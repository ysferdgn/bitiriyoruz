import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBars, FaTimes, FaHome, FaDog, FaUser, FaSignOutAlt, 
  FaSignInAlt, FaUserPlus, FaBookmark, FaPlusCircle, FaBookOpen, FaSearch, FaEnvelope
} from 'react-icons/fa';
import Header from './Header';
import AIChatWidget from '../AIChatWidget';
import api from '../../utils/axios';
import Modal from 'react-modal';

// Sol menü (sidebar) bileşeni: Navigasyon ve çıkış işlemleri
const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/api/conversations');
        const data = res.data;
        // lastMessage.read === false && lastMessage.sender !== user.id
        const unread = data.some(convo =>
          convo.lastMessage &&
          convo.lastMessage.read === false &&
          convo.lastMessage.sender !== user.id
        );
        setHasUnread(unread);
      } catch (e) {
        setHasUnread(false);
      }
    };
    fetchUnread();
  }, [user]);

  // Çıkış işlemini başlatır
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Çıkışı onaylar
  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  // Çıkışı iptal eder
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Menüdeki navigasyon elemanları
  const navItems = user 
    ? [
        { icon: <FaHome />, text: 'Ana Sayfa', path: '/' },
        { icon: <FaSearch />, text: 'Hayvan Ara', path: '/search' },
        { icon: (
            <span className="relative">
              <FaEnvelope />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </span>
          ), text: 'Mesajlar', path: '/messages' },
        { icon: <FaBookmark />, text: 'Kaydedilenler', path: '/saved-pets' },
        { icon: <FaPlusCircle />, text: 'İlan Ekle', path: '/add-pet' },
        { icon: <FaUser />, text: 'Profil', path: '/profile' },
        { icon: <FaBookOpen />, text: 'Rehber', path: '/pet-guide' },
      ]
    : [
        { icon: <FaHome />, text: 'Ana Sayfa', path: '/' },
        { icon: <FaSearch />, text: 'Hayvan Ara', path: '/search' },
        { icon: <FaBookOpen />, text: 'Rehber', path: '/pet-guide' },
        { icon: <FaSignInAlt />, text: 'Giriş Yap', path: '/signin' },
        { icon: <FaUserPlus />, text: 'Kayıt Ol', path: '/signup' },
      ];

  return (
    <div className={`fixed top-0 left-0 h-full bg-green-700 text-white transition-all duration-300 ease-in-out z-50 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-green-600">
        {isExpanded && <span className="text-2xl font-bold">PetAdopt</span>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-green-600">
            {isExpanded ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="px-4 py-2">
              <Link to={item.path} className="flex items-center p-2 rounded-md hover:bg-green-600">
                <div className="w-12 flex justify-center">{item.icon}</div>
                {isExpanded && <span className="ml-4">{item.text}</span>}
              </Link>
            </li>
          ))}
          {user && (
             <li className="px-4 py-2 absolute bottom-4 w-full">
               <button onClick={handleLogout} className="flex items-center p-2 w-full rounded-md hover:bg-green-600">
                <div className="w-12 flex justify-center"><FaSignOutAlt /></div>
                {isExpanded && <span className="ml-4">Çıkış Yap</span>}
               </button>
             </li>
          )}
        </ul>
      </nav>
      <Modal
        isOpen={showLogoutModal}
        onRequestClose={cancelLogout}
        className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Çıkış Yap
          </h2>
          <p className="text-gray-700 mb-6">
            Çıkış yapmak istediğinize emin misiniz?
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={confirmLogout} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Evet</button>
            <button onClick={cancelLogout} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition">Hayır</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Sayfa düzeni bileşeni: Sidebar, üst menü ve ana içerik
const Layout = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  // Sidebar'ı aç/kapat
  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <AIChatWidget />
      <div className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <Header />
        <main>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 