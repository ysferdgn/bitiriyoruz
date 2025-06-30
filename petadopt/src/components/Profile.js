import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaLock, FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import PetCard from './PetCard';
import Loading from './common/Loading';

const Profile = () => {
  const { user, loading: authLoading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
          setLoading(true);
        try {
          const [profileRes, listingsRes] = await Promise.all([
            api.get('/api/users/profile'),
            api.get('/api/pets/my-listings')
          ]);
          
          setProfileData({
            name: profileRes.data.name || '',
            email: profileRes.data.email || '',
            phone: profileRes.data.phone || '',
          });

          setMyListings(listingsRes.data);

        } catch (err) {
          setError('Profil bilgileri yüklenemedi.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
          navigate('/signin');
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/api/users/profile', profileData);
      setUser(res.data);
      setSuccess('Profil bilgileri başarıyla güncellendi.');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor!');
      return;
    }

    try {
      await api.put('/api/users/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Şifre başarıyla değiştirildi.');
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.');
    }
  };

  const handleEdit = (petId) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await api.delete(`/api/pets/${petId}`);
        setMyListings(myListings.filter(pet => pet._id !== petId));
        setSuccess('İlan başarıyla silindi.');
      } catch (err) {
        setError(err.response?.data?.message || 'İlan silinirken bir hata oluştu.');
      }
    }
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profilim</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{success}</div>}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun: Profil ve Şifre */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profil Bilgileri Kartı */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Kişisel Bilgiler</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-green-600 hover:text-green-800 transition-colors">
                  {isEditing ? <FaTimes size={20} /> : <FaEdit size={20} />}
                </button>
              </div>
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
              {myListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map(pet => (
                    <div key={pet._id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105">
                      <img 
                        src={pet.images[0] || '/placeholder-pet.jpg'} 
                        alt={pet.name} 
                        className="w-full h-48 object-cover"
                        onClick={() => navigate(`/pets/${pet._id}`)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                        <p className="text-gray-600">{pet.breed} - {pet.age}</p>
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => handleEdit(pet._id)}
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <FaEdit /> Düzenle
                          </button>
                          <button 
                            onClick={() => handleDelete(pet._id)}
                            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <FaTimes /> Sil
                          </button>
                        </div>
                      </div>
                    </div>
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

// Yardımcı bileşen
const InfoInput = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-white disabled:text-gray-900 disabled:cursor-default"
      />
    </div>
  </div>
);

export default Profile; 