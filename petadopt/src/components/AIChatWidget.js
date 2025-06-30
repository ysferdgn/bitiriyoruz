import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  MicrophoneIcon,
  PhotoIcon,
  HeartIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  { text: 'En uysal köpek türleri', category: 'genel', icon: '🐕', priority: 1 },
  { text: 'Tavsiye edilen mama markaları', category: 'beslenme', icon: '🍖', priority: 2 },
  { text: 'Kedi tuvalet eğitimi', category: 'egitim', icon: '🐱', priority: 3 },
  { text: 'İlk defa evcil hayvan sahipleniyorum', category: 'sahiplenme', icon: '🏠', priority: 1 },
  { text: 'Acil veteriner durumları', category: 'acil', icon: '🚨', priority: 1 },
  { text: 'Kedilerde tüy dökme sorunu', category: 'saglik', icon: '🐾', priority: 2 },
  { text: 'Köpeklerde sosyalleşme', category: 'egitim', icon: '🎾', priority: 3 },
  { text: 'Hamster bakım rehberi', category: 'genel', icon: '🐹', priority: 3 },
  { text: 'Kuş kafesi düzenlemesi', category: 'genel', icon: '🦜', priority: 4 },
  { text: 'Aşı takvimi', category: 'saglik', icon: '💉', priority: 2 }
];

const categoryColors = {
  genel: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  saglik: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  beslenme: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  egitim: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  sahiplenme: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
  acil: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 animate-pulse font-semibold'
};

const categoryNames = {
  genel: '🐾 Genel',
  saglik: '🏥 Sağlık',
  beslenme: '🍖 Beslenme',
  egitim: '🎓 Eğitim',
  sahiplenme: '🏠 Sahiplenme',
  acil: '🚨 Acil'
};

const AI_MESSAGE_TRUNCATE = 300;
const TYPING_ANIMATION_DELAY = 1200;
const MAX_RETRIES = 3;
const QUICK_ACTIONS_VISIBLE = 6;

// Dinamik API endpoint fonksiyonu
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api/ai-chat';
  }
  return '/api/ai-chat';
};

const AIChatWidget = ({
  userId = null,
  isAuthenticated = false,
  theme = 'light',
  position = 'bottom-right'
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Merhaba! 🐾 Ben senin Akıllı Evcil Hayvan Asistanınım. Evcil hayvan bakımı, sağlık, eğitim veya sahiplenme hakkındaki tüm sorularında size yardımcı olmaya hazırım!\n\nHangi konuda yardıma ihtiyacınız var?',
      timestamp: new Date(),
      category: 'genel',
      rating: null,
      confidence: 1.0
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMsgs, setExpandedMsgs] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('genel');
  const [quickActionsPage, setQuickActionsPage] = useState(0);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());
  const inputRef = useRef(null);
  const apiEndpoint = getApiBaseUrl();

  // Audio support check
  useEffect(() => {
    setAudioSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Unread count management
  useEffect(() => {
    if (open) {
      setUnreadCount(0);
    }
  }, [open]);

  // Connection status check
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  // Notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && !open) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSaP0vLNe');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {
        console.warn('Notification sound failed:', e);
      }
    }
  }, [soundEnabled, open]);

  // Enhanced message sending with retry logic
  const sendMessage = useCallback(async (msg, category = selectedCategory, isRetry = false) => {
    if (!msg.trim()) return;

    const messageId = Date.now();
    const userMessage = {
      id: messageId,
      sender: 'user',
      text: msg.trim(),
      timestamp: new Date(),
      category
    };

    if (!isRetry) {
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }

    setTyping(true);
    setError(null);

    try {
      // Get conversation history
      const history = messages.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const requestData = {
        message: msg.trim(),
        history,
        category,
        userId,
        sessionId: sessionId.current,
        timestamp: new Date().toISOString(),
        clientInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('token')}` : '',
          'X-Session-ID': sessionId.current,
          'X-Client-Version': '2.1.0',
          'X-Widget-Theme': theme
        },
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(35000) // 35 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.text,
        timestamp: new Date(),
        category: data.category || category,
        confidence: data.confidence || 0.9,
        sources: data.sources || [],
        cached: data.cached || false,
        rating: null,
        usage: data.usage
      };

      setMessages(prev => [...prev, aiMessage]);
      setRetryCount(0);

      if (!open) {
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
      }

    } catch (err) {
      console.error('AI Chat Error:', err);

      if (retryCount < MAX_RETRIES && !isRetry && !(err.name === 'AbortError')) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => sendMessage(msg, category, true), 2000 * (retryCount + 1));
        setError(`Tekrar deneniyor... (${retryCount + 1}/${MAX_RETRIES})`);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: connectionStatus === 'disconnected'
            ? '🔌 İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
            : err.message.includes('429')
            ? '⏳ Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.'
            : '😔 Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date(),
          category: 'error',
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        setError('Bağlantı hatası oluştu.');
        setRetryCount(0);
      }
    } finally {
      setTimeout(() => setTyping(false), TYPING_ANIMATION_DELAY);
    }
  }, [messages, selectedCategory, userId, isAuthenticated, retryCount, connectionStatus, open, playNotificationSound, apiEndpoint, theme]);

  // Voice recording functionality
  const startVoiceRecording = useCallback(() => {
    if (!audioSupported) {
      setError('Ses tanıma bu tarayıcıda desteklenmiyor.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'tr-TR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      inputRef.current?.focus();
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      setError(`Ses tanıma hatası: ${event.error === 'no-speech' ? 'Ses algılanamadı' : event.error}`);
    };

    try {
      recognition.start();
    } catch (err) {
      setError('Mikrofon erişimi reddedildi.');
      setIsRecording(false);
    }
  }, [audioSupported]);

  // Message rating
  const rateMessage = useCallback((messageId, rating) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    ));

    // Send rating to backend
    fetch(`${apiEndpoint}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('token')}` : ''
      },
      body: JSON.stringify({
        messageId,
        rating,
        sessionId: sessionId.current,
        userId
      })
    }).catch(console.error);
  }, [apiEndpoint, isAuthenticated, userId]);

  // Enhanced input handling
  const handleInputKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [input, sendMessage]);

  // Toggle message expansion
  const toggleExpand = useCallback((idx) => {
    setExpandedMsgs(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    if (window.confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz?')) {
      setMessages([messages[0]]); // Keep welcome message
      setExpandedMsgs({});
      setError(null);
      sessionId.current = crypto.randomUUID();
    }
  }, [messages]);

  // Retry last message
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMessage) {
      // Remove last AI response if it was an error
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.isError) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      sendMessage(lastUserMessage.text, lastUserMessage.category);
    }
  }, [messages, sendMessage]);

  // Categorized quick actions with pagination
  const filteredQuickActions = useMemo(() => {
    const filtered = quickActions
      .filter(action => selectedCategory === 'genel' || action.category === selectedCategory)
      .sort((a, b) => a.priority - b.priority);

    const startIndex = quickActionsPage * QUICK_ACTIONS_VISIBLE;
    return filtered.slice(startIndex, startIndex + QUICK_ACTIONS_VISIBLE);
  }, [selectedCategory, quickActionsPage]);

  const totalPages = useMemo(() => {
    const filtered = quickActions
      .filter(action => selectedCategory === 'genel' || action.category === selectedCategory);
    return Math.ceil(filtered.length / QUICK_ACTIONS_VISIBLE);
  }, [selectedCategory]);

  // Position classes
  const positionClasses = useMemo(() => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    };
    return positions[position] || positions['bottom-right'];
  }, [position]);

  // Theme classes
  const themeClasses = useMemo(() => ({
    primary: theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
    secondary: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
    accent: 'bg-gradient-to-r from-emerald-600 to-blue-600',
    border: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
    input: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }), [theme]);

  return (
    <div className="font-sans antialiased">
      {/* Floating Chat Button */}
      {!open && (
        <div className={`fixed ${positionClasses} z-50`}>
          <button
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-full p-4 shadow-2xl transition-all duration-300 flex items-center justify-center w-16 h-16 hover:scale-110 group transform hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            onClick={() => setOpen(true)}
            aria-label="Evcil Hayvan Asistanını Aç"
          >
            <ChatBubbleLeftRightIcon className="h-7 w-7 group-hover:animate-bounce" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
          </button>
        </div>
      )}

      {/* Enhanced Chat Window */}
      {open && (
        <div className={`fixed ${positionClasses} z-50 w-96 h-[650px] ${themeClasses.primary} rounded-2xl shadow-2xl flex flex-col animate-slideIn transition-all duration-300 border ${themeClasses.border} overflow-hidden backdrop-blur-sm`}>
          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  🐾
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'} border-2 border-white`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Akıllı Evcil Hayvan Asistanı</h3>
                <p className="text-xs opacity-90 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {connectionStatus === 'connected' ? 'Çevrimiçi' : 'Bağlantı Yok'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <SpeakerWaveIcon className="h-4 w-4" /> : <SpeakerXMarkIcon className="h-4 w-4" />}
              </button>
              <button
                onClick={clearConversation}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                title="Sohbeti Temizle"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                title="Kapat"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className={`px-4 py-2 ${themeClasses.secondary} border-b ${themeClasses.border}`}>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setQuickActionsPage(0);
              }}
              className={`w-full text-xs rounded-lg px-3 py-2 ${themeClasses.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200`}
            >
              {Object.entries(categoryNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto px-4 py-3 ${themeClasses.secondary} space-y-4 scroll-smooth`}>
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-200 hover:shadow-xl ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white ml-4'
                        : msg.isError
                        ? 'bg-red-50 text-red-800 border border-red-200 mr-4'
                        : `${themeClasses.primary} border ${themeClasses.border} mr-4 shadow-md`
                      }`}
                  >
                    {/* Category badge for AI messages */}
                    {msg.sender === 'ai' && msg.category && msg.category !== 'genel' && !msg.isError && (
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${categoryColors[msg.category] || categoryColors.genel}`}>
                        {categoryNames[msg.category]}
                      </div>
                    )}

                    {/* Message content with expand/collapse */}
                    {msg.sender === 'ai' && msg.text.length > AI_MESSAGE_TRUNCATE ? (
                      <>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {expandedMsgs[idx] ? msg.text : `${msg.text.slice(0, AI_MESSAGE_TRUNCATE)}...`}
                        </div>
                        <button
                          className="block text-blue-600 hover:text-blue-800 text-xs mt-2 underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                          onClick={() => toggleExpand(idx)}
                        >
                          {expandedMsgs[idx] ? 'Daha az gör' : 'Devamını oku'}
                        </button>
                      </>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    )}

                    {/* Confidence indicator for AI messages */}
                    {msg.sender === 'ai' && msg.confidence && msg.confidence < 0.8 && !msg.isError && (
                      <div className="flex items-center mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Bu cevap için bir veteriner hekim ile görüşmenizi öneriyorum.</span>
                      </div>
                    )}

                    {/* Cached indicator */}
                    {msg.cached && (
                      <div className="flex items-center mt-1 text-xs opacity-60">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Önbellekten
                      </div>
                    )}
                  </div>

                  {/* Message metadata */}
                  <div className={`flex items-center mt-1 text-xs opacity-60 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="mx-2">
                      {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Rating for AI messages */}
                    {msg.sender === 'ai' && !msg.isError && (
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => rateMessage(msg.id, 'helpful')}
                          className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 ${msg.rating === 'helpful' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                          title="Yararlı"
                        >
                          <HeartIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => rateMessage(msg.id, 'not-helpful')}
                          className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${msg.rating === 'not-helpful' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                          title="Yararlı Değil"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced typing indicator */}
            {typing && (
              <div className="flex justify-start animate-fadeIn">
                <div className={`rounded-2xl px-4 py-3 ${themeClasses.primary} border ${themeClasses.border} shadow-md mr-4`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">Asistan yazıyor...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error display with retry option */}
            {error && (
              <div className="flex flex-col items-center animate-fadeIn space-y-2">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                {error.includes('Bağlantı hatası') && (
                  <button
                    onClick={retryLastMessage}
                    className="text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
                  >
                    Tekrar Dene
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Actions with Pagination */}
          {filteredQuickActions.length > 0 && (
            <div className={`px-4 py-3 ${themeClasses.primary} border-t ${themeClasses.border}`}>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Hızlı Başlangıç Önerileri ({quickActionsPage + 1}/{totalPages})</span>
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                >
                  {showFullHistory ? 'Kısalt' : 'Tümünü Gör'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                {(showFullHistory ? quickActions : filteredQuickActions).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(action.category);
                      sendMessage(action.text, action.category);
                    }}
                    className={`flex items-center text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${categoryColors[action.category] || categoryColors.genel}`}
                  >
                    <span className="mr-2">{action.icon}</span>
                    <span className="flex-1">{action.text}</span>
                  </button>
                ))}
              </div>
              {totalPages > 1 && !showFullHistory && (
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => setQuickActionsPage(prev => Math.max(0, prev - 1))}
                    disabled={quickActionsPage === 0}
                    className={`p-1 rounded-full ${themeClasses.secondary} ${quickActionsPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-500">{quickActionsPage + 1} / {totalPages}</span>
                  <button
                    onClick={() => setQuickActionsPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={quickActionsPage === totalPages - 1}
                    className={`p-1 rounded-full ${themeClasses.secondary} ${quickActionsPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}


          {/* Message Input and Controls */}
          <div className={`flex items-center p-4 border-t ${themeClasses.border} ${themeClasses.primary}`}>
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                className={`w-full pr-10 py-2 pl-3 rounded-xl text-sm resize-none overflow-hidden h-12 ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm`}
                placeholder="Mesajınızı buraya yazın..."
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleInputKeyDown}
                disabled={typing || connectionStatus === 'disconnected'}
              />
              <button
                onClick={startVoiceRecording}
                className={`absolute right-10 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!audioSupported || isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Sesli Mesaj"
                disabled={!audioSupported || isRecording || typing || connectionStatus === 'disconnected'}
              >
                <MicrophoneIcon className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
              </button>
            </div>
            <button
              onClick={() => sendMessage(input)}
              className={`ml-3 p-3 rounded-full ${themeClasses.accent} text-white shadow-md hover:shadow-lg transition-all duration-200 ${!input.trim() || typing || connectionStatus === 'disconnected' ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
              disabled={!input.trim() || typing || connectionStatus === 'disconnected'}
              aria-label="Mesaj Gönder"
            >
              <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;