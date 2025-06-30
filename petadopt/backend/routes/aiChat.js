const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const { OpenAI } = require('openai');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const winston = require('winston');

const router = express.Router();

// Winston ile gelişmiş loglama yapılandırması
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// CORS ve güvenlik middleware'i
router.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
  credentials: true
}));

// Rate limit oluşturucu (farklı seviyeler için)
const createRateLimit = (windowMs, max, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    keyGenerator: (req) => {
      // IP + User ID kombinasyonu ile daha hassas rate limiting
      const userId = req.user?.id || 'anonymous';
      return `${req.ip}-${userId}`;
    },
    handler: (req, res) => {
      logger.warn(`Rate limit aşıldı: ${req.ip}`, {
        ip: req.ip,
        userId: req.user?.id,
        endpoint: req.originalUrl
      });
      res.status(429).json({
        error: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });
};

// Farklı rate limit seviyeleri
const basicLimiter = createRateLimit(60 * 1000, 10); // 10/dakika
const premiumLimiter = createRateLimit(60 * 1000, 30); // 30/dakika
const heavyLimiter = createRateLimit(60 * 1000, 3); // Ağır işlemler için 3/dakika

// Gerekli environment değişkenlerini kontrol et
const requiredEnvVars = ['OPENAI_API_KEY', 'JWT_SECRET'];
for (const env of requiredEnvVars) {
  if (!process.env[env]) {
    throw new Error(`${env} environment variable is required`);
  }
}

// OpenAI API kurulumunu yap
let openai;
let isAIEnabled = false;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000 // 30 saniye timeout
    });
    isAIEnabled = true;
    console.log('✅ OpenAI Chat etkin.');
  } catch (error) {
    console.error('❌ OpenAI başlatılamadı:', error.message);
    isAIEnabled = false;
  }
} else {
  console.warn('⚠️  OpenAI API Key bulunamadı. AI Chat devre dışı.');
}

// JWT ile kullanıcı doğrulama middleware'i
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Geçersiz token gönderildi', { token: token.substring(0, 10) + '...' });
    req.user = null;
    next();
  }
};

// Sohbet mesajı için input doğrulama middleware'i
const validateChatInput = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Mesaj 1-1000 karakter arasında olmalı')
    .matches(/^[a-zA-ZçÇğĞıIİöÖşŞüÜ0-9\s.,!?()-]+$/)
    .withMessage('Mesaj geçersiz karakterler içeriyor'),
  body('history')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Geçmiş maksimum 20 mesaj içerebilir'),
  body('category')
    .optional()
    .isIn(['genel', 'saglik', 'beslenme', 'egitim', 'sahiplenme', 'acil'])
    .withMessage('Geçersiz kategori')
];

// Spam ve zararlı içerik kontrolü
const contentFilter = async (message) => {
  const spamKeywords = ['reklam', 'para', 'kredi', 'bitcoin', 'casino'];
  const harmfulKeywords = ['zarar', 'öldür', 'zehir', 'acı çektir'];
  const lowerMessage = message.toLowerCase();
  for (const keyword of [...spamKeywords, ...harmfulKeywords]) {
    if (lowerMessage.includes(keyword)) {
      return { isFiltered: true, reason: 'spam_or_harmful' };
    }
  }
  return { isFiltered: false };
};

// Sistem prompt'unu kategoriye göre döndüren fonksiyon
const getSystemPrompt = (category) => {
  const basePrompt = `Sen evcil hayvan konusunda uzman, güvenilir ve yardımsever bir asistansın. Türkiye'deki evcil hayvan sahipleri için özel olarak tasarlandın.

GÖREVLER:
- Evcil hayvan bakımı, sağlığı, eğitimi ve sahiplenme konularında rehberlik et
- Türkiye'deki yasal durumlar ve yerel koşullar hakkında bilgi ver
- Acil durumlarda veteriner hekim önerisi ver
- Sorumlu sahiplenmeyi teşvik et

ÖNEMLİ KURALLAR:
- Kesinlikle tıbbi teşhis koyma, sadece veteriner hekim öner
- Zararlı veya tehlikeli önerilerde bulunma
- Türkiye'deki hayvan hakları yasalarına uygun tavsiyelerde bulun
- Kısa, öz ve anlaşılır cevaplar ver`;
  const categoryPrompts = {
    saglik: basePrompt + '\n\nÖZEL FOKUS: Sağlık sorunları için acil durum belirtilerini tanıt ve mutlaka veteriner hekim öner.',
    beslenme: basePrompt + '\n\nÖZEL FOKUS: Hayvan türüne özel beslenme tavsiyeleri ver, zehirli yiyecekler konusunda uyar.',
    egitim: basePrompt + '\n\nÖZEL FOKUS: Pozitif eğitim yöntemleri öner, sabır ve tutarlılığın önemini vurgula.',
    sahiplenme: basePrompt + '\n\nÖZEL FOKUS: Sorumlu sahiplenme, hayvanın ihtiyaçları ve yasal yükümlülükler hakkında bilgi ver.',
    acil: basePrompt + '\n\nÖZEL FOKUS: ACİL DURUM! Hemen veteriner hekim başvurusu öner, ilk yardım bilgileri ver.'
  };
  return categoryPrompts[category] || basePrompt;
};

// Ana AI sohbet endpointi
router.post('/', authenticateToken, async (req, res) => {
  // Kullanıcı tipine göre rate limiting uygula
  const limiter = req.user?.isPremium ? premiumLimiter : basicLimiter;
  limiter(req, res, async () => {
    // Input doğrulama
    await Promise.all(validateChatInput.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Geçersiz giriş verileri',
        details: errors.array()
      });
    }
    const { message, history = [], category = 'genel' } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || crypto.randomUUID();
    // İçerik filtresi uygula
    const filterResult = await contentFilter(message);
    if (filterResult.isFiltered) {
      logger.warn('Filtrelenen mesaj', { userId, message: message.substring(0, 50) });
      return res.status(400).json({ error: 'Mesajınız sistem tarafından uygun bulunmadı.' });
    }
    // AI özelliği kapalıysa hata döndür
    if (!isAIEnabled) {
      return res.status(503).json({ error: 'AI sohbet özelliği şu anda kullanılamıyor.' });
    }
    try {
      // OpenAI API'ye istek hazırla
      const systemPrompt = getSystemPrompt(category);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message }
      ];
      // OpenAI API çağrısı
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        user: userId || undefined,
        stream: false
      });
      // Yanıtı döndür
      res.json({
        response: completion.choices[0].message.content,
        usage: completion.usage,
        sessionId
      });
    } catch (error) {
      logger.error('OpenAI API hatası', { error: error.message });
      res.status(500).json({ error: 'AI yanıtı alınırken bir hata oluştu.' });
    }
  });
});

// Sağlık kontrolü endpoint (Redis olmadan)
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      openai: 'ok'
    }
  };
  res.json(health);
});

module.exports = router;