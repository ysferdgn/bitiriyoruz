const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Tüm konuşmaları getirir (giriş yapan kullanıcı için)
router.get('/', auth, async (req, res) => {
  try {
    console.log('--- Konuşmalar endpointi çağrıldı ---');
    console.log('istek yapan kullanıcı:', req.user.id);
    // Kullanıcının dahil olduğu konuşmaları bul
    const conversations = await Conversation.find({
      participants: req.user.id
    }).populate('participants', 'name email profilePicture').sort({ updatedAt: -1 });
    console.log('Bulunan konuşma sayısı:', conversations.length);
    if (conversations.length > 0) {
      console.log('İlk konuşma örneği:', JSON.stringify(conversations[0], null, 2));
    }
    // Frontend için diğer katılımcıyı ayıkla
    const formattedConversations = conversations.map(convo => {
      const otherParticipant = convo.participants.find(p => p._id.toString() !== req.user.id);
      return {
        ...convo.toObject(),
        otherParticipant: otherParticipant,
      };
    });
    console.log('Frontend\'e gönderilen formattedConversations:', JSON.stringify(formattedConversations, null, 2));
    res.json(formattedConversations);
  } catch (error) {
    console.error('Konuşmalar getirilirken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Belirli bir konuşmanın tüm mesajlarını getirir
router.get('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log('--- Mesajlar endpointi çağrıldı ---');
    console.log('conversationId:', conversationId);
    console.log('istek yapan kullanıcı:', req.user.id);
    // Kullanıcı bu konuşmanın katılımcısı mı kontrol et
    const conversation = await Conversation.findById(conversationId);
    console.log('bulunan conversation:', conversation);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      console.log('Kullanıcı bu konuşmanın katılımcısı değil veya konuşma bulunamadı.');
      return res.status(403).json({ msg: 'Bu konuşmaya erişim yetkiniz yok' });
    }
    // Mesajları bul ve sırala
    const messages = await Message.find({ conversationId })
      .populate({
        path: 'sender',
        select: 'name profilePicture',
      })
      .sort({ createdAt: 1 }); // En eski mesajlar önce
    console.log('Bulunan mesaj sayısı:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Mesajlar getirilirken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Yeni konuşma oluşturur veya mevcut olanı getirir
router.post('/', auth, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    if (!otherUserId) {
      return res.status(400).json({ msg: 'otherUserId zorunludur' });
    }
    // Zaten konuşma var mı kontrol et
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, otherUserId] }
    }).populate('participants', 'name email profilePicture');
    if (conversation) {
      // Varsa onu döndür
      const otherParticipant = conversation.participants.find(p => p._id.toString() !== req.user.id);
      return res.json({
        ...conversation.toObject(),
        otherParticipant: otherParticipant,
      });
    }
    // Yoksa yeni konuşma oluştur
    conversation = new Conversation({
      participants: [req.user.id, otherUserId]
    });
    await conversation.save();
    // Katılımcıları doldur
    await conversation.populate('participants', 'name email profilePicture');
    const otherParticipant = conversation.participants.find(p => p._id.toString() !== req.user.id);
    res.json({
      ...conversation.toObject(),
      otherParticipant: otherParticipant,
    });
  } catch (error) {
    console.error('Konuşma oluşturulurken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Konuşmada mesaj gönderir
router.post('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ msg: 'Mesaj metni zorunludur' });
    }
    // Kullanıcı bu konuşmanın katılımcısı mı kontrol et
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Bu konuşmaya mesaj gönderme yetkiniz yok' });
    }
    // Yeni mesaj oluştur
    const message = new Message({
      conversationId,
      sender: req.user.id,
      text: text.trim()
    });
    await message.save();
    // Konuşmanın son mesajını ve güncellenme zamanını güncelle
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();
    // Gönderen bilgisini doldur
    await message.populate('sender', 'name profilePicture');
    res.json(message);
  } catch (error) {
    console.error('Mesaj gönderilirken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Mesajı siler (sadece gönderen silebilir)
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: 'Mesaj bulunamadı' });
    }
    // Sadece gönderen silebilir
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ msg: 'Bu mesajı silme yetkiniz yok' });
    }
    await message.deleteOne();
    // Eğer bu mesaj konuşmanın son mesajıysa, güncelle
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === messageId) {
      // Yeni son mesajı bul
      const lastMessage = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 });
      conversation.lastMessage = lastMessage ? lastMessage._id : null;
      await conversation.save();
    }
    res.json({ msg: 'Mesaj başarıyla silindi' });
  } catch (error) {
    console.error('Mesaj silinirken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Konuşmayı siler (geliştirilebilir, şu an sadece endpoint)
// router.delete('/:conversationId', ...)

module.exports = router; 