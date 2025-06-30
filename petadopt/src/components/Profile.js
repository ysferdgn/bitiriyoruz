import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaLock, FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import PetCard from './PetCard';
import Loading from './common/Loading';

// Kullanıcı profil sayfası bileşeni
// Kullanıcı bilgilerini, şifre değiştirme ve kendi ilanlarını yönetme imkanı sunar
const Profile = () => {
  // AuthContext'ten kullanıcı bilgisi, yüklenme durumu ve kullanıcıyı güncelleme fonksiyonu alınır
  const { user, loading: authLoading, setUser } = useAuth();
  // Profil düzenleme modunu kontrol eden state
  const [isEditing, setIsEditing] = useState(false);
  // Profil formundaki alanlar için state
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  // Şifre değiştirme formu için state
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  // Kullanıcının kendi ilanları
  const [myListings, setMyListings] = useState([]);
  // Sayfa genel yüklenme durumu
  const [loading, setLoading] = useState(true);
  // Hata mesajı state'i
  const [error, setError] = useState('');
  // Başarı mesajı state'i
  const [success, setSuccess] = useState('');
  // Yönlendirme için navigate fonksiyonu
  const navigate = useNavigate();

  // Sayfa yüklendiğinde veya kullanıcı değiştiğinde profil ve ilan verilerini çeker
  useEffect(() => {
    // Asenkron veri çekme fonksiyonu
    const fetchData = async () => {
      if (user) {
        setLoading(true); // Yüklenme başlatılır
        try {
          // Kullanıcı profil bilgileri ve kendi ilanları aynı anda çekilir
          const [profileRes, listingsRes] = await Promise.all([
            api.get('/api/users/profile'),
            api.get('/api/pets/my-listings')
          ]);
          // Profil formunu doldur
          setProfileData({
            name: profileRes.data.name || '',
            email: profileRes.data.email || '',
            phone: profileRes.data.phone || '',
          });
          // İlanları state'e ata
          setMyListings(listingsRes.data);
        } catch (err) {
          setError('Profil bilgileri yüklenemedi.'); // Hata mesajı göster
          console.error(err);
        } finally {
          setLoading(false); // Yüklenme bitti
        }
      } else if (!authLoading) {
        // Kullanıcı yoksa giriş sayfasına yönlendir
        navigate('/signin');
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  // Profil formundaki input değişikliklerini işler
  // e: input değişiklik eventi
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  // Şifre formundaki input değişikliklerini işler
  // e: input değişiklik eventi
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Profil güncelleme formu gönderildiğinde çalışır
  // API'ye güncel bilgileri gönderir ve kullanıcıyı günceller
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Profil güncelleme isteği
      const res = await api.put('/api/users/profile', profileData);
      setUser(res.data); // AuthContext'teki kullanıcıyı güncelle
      setSuccess('Profil bilgileri başarıyla güncellendi.');
      setIsEditing(false); // Düzenleme modunu kapat
    } catch (err) {
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
    }
  };

  // Şifre değiştirme formu gönderildiğinde çalışır
  // API'ye yeni şifreyi gönderir
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Yeni şifreler aynı mı kontrolü
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor!');
      return;
    }
    try {
      // Şifre güncelleme isteği
      await api.put('/api/users/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      // Formu temizle
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Şifre başarıyla değiştirildi.');
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.');
    }
  };

  // İlan düzenleme butonuna tıklanınca ilgili düzenleme sayfasına yönlendirir
  // petId: düzenlenecek ilan id'si
  const handleEdit = (petId) => {
    navigate(`/edit-pet/${petId}`);
  };

  // İlan silme işlemi: Kullanıcıdan onay alır, API'ye silme isteği gönderir ve ilanı listeden çıkarır
  // petId: silinecek ilan id'si
  const handleDelete = async (petId) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await api.delete(`/api/pets/${petId}`);
        setMyListings(myListings.filter(pet => pet._id !== petId)); // Silinen ilanı çıkar
        setSuccess('İlan başarıyla silindi.');
      } catch (err) {
        setError(err.response?.data?.message || 'İlan silinirken bir hata oluştu.');
      }
    }
  };

  // Sayfa veya kullanıcı yükleniyorsa yüklenme animasyonu göster
  if (loading || authLoading) {
    return <Loading />;
  }

  // Profil sayfası arayüzü
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profilim</h1>

        {/* Hata ve başarı mesajları */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{success}</div>}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun: Profil ve Şifre */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profil Bilgileri Kartı */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Kişisel Bilgiler</h2>
                {/* Düzenleme modunu aç/kapat */}
                <button onClick={() => setIsEditing(!isEditing)} className="text-green-600 hover:text-green-800 transition-colors">
                  {isEditing ? <FaTimes size={20} /> : <FaEdit size={20} />}
                </button>
              </div>
              {/* Profil bilgileri formu */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <InfoInput icon={<FaUser />} label="İsim Soyisim" name="name" value={profileData.name} onChange={handleProfileChange} disabled={!isEditing} />
                <InfoInput icon={<FaEnvelope />} label="E-posta Adresi" name="email" type="email" value={profileData.email} onChange={handleProfileChange} disabled={!isEditing} />
                <InfoInput icon={<FaPhone />} label="Telefon Numarası" name="phone" value={profileData.phone} onChange={handleProfileChange} disabled={!isEditing} />
                {isEditing && (
                  <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <FaSave /> Bilgileri Kaydet
                  </button>
                )}
              </form>
            </div>

            {/* Şifre Değiştirme Kartı */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Şifre Değiştir</h2>
              {/* Şifre değiştirme formu */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <InfoInput icon={<FaLock />} label="Mevcut Şifre" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                <InfoInput icon={<FaLock />} label="Yeni Şifre" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                <InfoInput icon={<FaLock />} label="Yeni Şifre Tekrar" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                  <FaSave /> Şifreyi Değiştir
                </button>
              </form>
            </div>
          </div>

          {/* Sağ Sütun: İlanlarım */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">İlanlarım ({myListings.length})</h2>
              {/* Kullanıcının ilanları varsa göster, yoksa bilgilendirici mesaj */}
              {myListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map(pet => (
                    <PetCard key={pet._id} pet={pet} onDelete={handleDelete} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaPaw className="text-5xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Henüz hiç ilanınız yok.</h3>
                  <p className="text-gray-500 mt-2">Yeni bir ilan ekleyerek bir dosta yuva bulmasına yardımcı olabilirsiniz.</p>
                  <button onClick={() => navigate('/add-pet')} className="mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    Hemen İlan Ekle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Yardımcı bileşen: Bilgi girişi için input
// icon: input başındaki ikon, label: input etiketi, ...props: input özellikleri
const InfoInput = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className={`pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${props.disabled ? 'bg-gray-100' : ''}`}
      />
    </div>
  </div>
);

export default Profile; 