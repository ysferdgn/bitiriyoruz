import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaComments, FaPaperPlane, FaSpinner, FaArrowLeft, FaSearch, FaTrash, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import Loading from './common/Loading';

const MessagesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const userId = user?._id || user?.id;

    const fetchConversations = useCallback(async () => {
        if (!userId) return;
        setLoadingConversations(true);
        try {
            const res = await api.get('/api/conversations');
            setConversations(res.data);
            
            // Check if URL has a conversationId to pre-select
            const params = new URLSearchParams(location.search);
            const conversationIdFromUrl = params.get('id');
            if (conversationIdFromUrl && res.data.some(c => c._id === conversationIdFromUrl)) {
                const preselected = res.data.find(c => c._id === conversationIdFromUrl);
                setSelectedConversation(preselected);
            } else if (res.data.length > 0) {
                 setSelectedConversation(res.data[0]);
            }

        } catch (err) {
            console.error("Konuşmalar yüklenirken hata:", err);
        } finally {
            setLoadingConversations(false);
        }
    }, [userId, location.search]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const fetchMessages = useCallback(async () => {
        if (!selectedConversation?._id) return;
        setLoadingMessages(true);
        setErrorMessages('');
        try {
            const res = await api.get(`/api/conversations/${selectedConversation._id}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error("Mesajlar yüklenirken hata:", err);
            setErrorMessages('Mesajlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoadingMessages(false);
        }
    }, [selectedConversation?._id]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        navigate(`/messages?id=${conversation._id}`, { replace: true });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedConversation || sendingMessage) return;

        setSendingMessage(true);
        try {
            const response = await api.post(`/api/conversations/${selectedConversation._id}/messages`, { text: newMessage.trim() });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            
            const updatedConversations = conversations.map(c => 
                c._id === selectedConversation._id ? { ...c, lastMessage: response.data, updatedAt: response.data.createdAt } : c
            );
            setConversations(updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));

        } catch (err) {
            console.error("Mesaj gönderilirken hata:", err);
        } finally {
            setSendingMessage(false);
        }
    };

    const handleDeleteConversation = async (e, conversationId) => {
        e.stopPropagation(); // Prevent conversation selection
        if (window.confirm('Bu konuşmayı kalıcı olarak silmek istediğinizden emin misiniz?')) {
            try {
                await api.delete(`/api/conversations/${conversationId}`);
                setConversations(prev => prev.filter(c => c._id !== conversationId));
                if (selectedConversation?._id === conversationId) {
                    setSelectedConversation(null);
                    setMessages([]);
                    navigate('/messages', { replace: true });
                }
            } catch (err) {
                console.error("Konuşma silinirken hata:", err);
                alert('Konuşma silinirken bir hata oluştu.');
            }
        }
    };
    
    const otherUser = selectedConversation?.participants.find(p => p._id !== userId);

    // Mesajın gönderen id'sini normalize eden yardımcı fonksiyon
    const getSenderId = (msg) => {
        if (!msg.sender) return '';
        if (typeof msg.sender === 'object') {
            return msg.sender._id || msg.sender.id || '';
        }
        return msg.sender;
    };

    return (
        <div className="h-[calc(100vh-80px)] flex bg-gray-100 font-sans">
            {/* Conversation List */}
            <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Gelen Kutusu</h1>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loadingConversations ? <Loading/> : (
                        conversations.map(conv => {
                            const participant = conv.participants.find(p => p._id !== userId);
                            return (
                                <div
                                    key={conv._id}
                                    className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${selectedConversation?._id === conv._id ? 'bg-green-50' : ''}`}
                                    onClick={() => handleSelectConversation(conv)}
                                >
                                    {participant?.profilePhoto ? (
                                        <img src={participant.profilePhoto} alt={participant.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                    ) : (
                                        <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-gray-900 truncate">{participant?.name || 'Bilinmeyen Kullanıcı'}</h3>
                                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true, locale: tr })}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.text || 'Henüz mesaj yok'}</p>
                                    </div>
                                    <button onClick={(e) => handleDeleteConversation(e, conv._id)} className="ml-2 text-gray-400 hover:text-red-500 p-2 rounded-full">
                                      <FaTrash />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Message Area */}
            <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gray-50 ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
                            <button onClick={() => setSelectedConversation(null)} className="md:hidden mr-4 text-gray-600">
                                <FaArrowLeft />
                            </button>
                            {otherUser?.profilePhoto ? (
                                <img src={otherUser.profilePhoto} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                            ) : (
                                <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                            )}
                            <h2 className="text-xl font-semibold text-gray-800">{otherUser?.name || 'Sohbet'}</h2>
                        </div>
                        {/* Messages */}
                        <div className="flex-grow p-6 overflow-y-auto">
                            {errorMessages && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
                                    {errorMessages}
                                </div>
                            )}
                            {loadingMessages ? <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-3xl text-green-500" /></div> : (
                                messages.map(msg => {
                                    const isMine = getSenderId(msg) === userId;
                                    return (
                                        <div key={msg._id} className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-md p-3 rounded-2xl ${isMine ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 shadow-md'}`}>
                                                <p className="break-words">{msg.text}</p>
                                                <span className={`text-xs mt-1 block ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Bir mesaj yazın..."
                                    className="flex-grow px-4 py-2 bg-gray-100 rounded-full focus:outline-none text-gray-900 font-medium placeholder-gray-500"
                                />
                                <button type="submit" disabled={sendingMessage} className="ml-4 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-400">
                                    {sendingMessage ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
                        <FaComments className="text-6xl mb-4" />
                        <h2 className="text-2xl font-semibold">Görüntülenecek bir konuşma seçin</h2>
                        <p className="mt-2">Veya bir ilan sayfasından yeni bir mesaj gönderin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage; 