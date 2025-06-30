import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShare, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaComments } from 'react-icons/fa';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// Türkçe: Boyut bilgisini Türkçeye çeviren yardımcı fonksiyon
const translateSize = (size) => {
  switch (size) {
    case 'Small':
      return 'Küçük';
    case 'Medium':
      return 'Orta';
    case 'Large':
      return 'Büyük';
    default:
      return size;
  }
};

const PetDetail = () => {
  // Türkçe: URL'den 'id' parametresini ve navigasyon fonksiyonunu al
  const { id } = useParams();
  const navigate = useNavigate();
  // Türkçe: Mevcut kullanıcı bilgisini AuthContext'ten al
  const { user } = useAuth();
  // Türkçe: Bileşenin durumlarını (state) tanımla
  const [pet, setPet] = useState(null); // Hayvan verisi
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu
  const [sendingMessage, setSendingMessage] = useState(false); // Mesaj gönderim durumu
  const [relatedPets, setRelatedPets] = useState([]); // İlgili hayvanlar

  // Türkçe: Bileşen yüklendiğinde veya 'id' değiştiğinde hayvan detaylarını çek
  useEffect(() => {
    // Türkçe: API'den hayvan detaylarını ve ilgili hayvanları çeken asenkron fonksiyon
    const fetchPetData = async () => {
      setLoading(true);
      try {
        // Ana hayvan detayını çek
        const petResponse = await axios.get(`/api/pets/${id}`);
        setPet(petResponse.data);

        // İlgili hayvanları çek
        const relatedResponse = await axios.get(`/api/pets/related/${id}`);
        setRelatedPets(relatedResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Hayvan detayları yüklenemedi.');
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  // Türkçe: Mesaj gönder butonuna tıklandığında çalışacak fonksiyon
  const handleSendMessage = async () => {
    // Türkçe: Kullanıcı giriş yapmamışsa uyar
    if (!user) {
      alert('Mesaj göndermek için giriş yapmalısınız');
      return;
    }

    // Türkçe: Kullanıcı kendi ilanına mesaj gönderemez
    if (user.id === pet.owner._id) {
      alert('Kendi hayvanınıza mesaj gönderemezsiniz');
      return;
    }

    setSendingMessage(true);
    try {
      // Türkçe: Yeni bir konuşma oluştur veya mevcut konuşmayı al
      const response = await axios.post('/api/conversations', {
        otherUserId: pet.owner._id
      });

      // Türkçe: Konuşma ID'si ile mesajlar sayfasına yönlendir
      navigate(`/messages?conversation=${response.data._id}`);
    } catch (err) {
      console.error('Konuşma oluşturulurken hata:', err);
      alert('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setSendingMessage(false);
    }
  };

  // Türkçe: Veri yükleniyorsa yüklenme animasyonu göster
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  // Türkçe: Hata oluştuysa hata mesajı göster
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C]"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  // Türkçe: Hayvan verisi yoksa hiçbir şey gösterme
  if (!pet) {
    return null;
  }

  // Türkçe: Ana bileşen arayüzü
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Türkçe: Geri Dön Butonu */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        title="Geri Dön"
      >
        <FaArrowLeft className="text-lg" />
        Geri
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Türkçe: Hayvan Resimleri */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {pet.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${pet.name} - ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Türkçe: Hayvan Bilgileri */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-800">{pet.breed}</p>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-700 hover:text-[#4CAF50]">
                <FaHeart />
              </button>
              <button className="text-gray-700 hover:text-[#4CAF50]">
                <FaShare />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{pet.name} Hakkında</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold uppercase text-gray-800">Yaş</p>
                  <p className="font-medium text-gray-900">{pet.age} yaşında</p>
                </div>
                <div>
                  <p className="text-lg font-semibold uppercase text-gray-800">Cinsiyet</p>
                  <p className="font-medium text-gray-900">{pet.gender === 'Male' ? 'Erkek' : 'Dişi'}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 col-span-2">
                  <FaMapMarkerAlt className="text-[#4CAF50]" />
                  <span className="text-gray-800">{pet.location}</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold uppercase text-gray-800">Açıklama</p>
                <p className="mt-2 text-gray-900">{pet.description}</p>
              </div>
            </div>
          </div>

          {/* Türkçe: Sahip İletişim Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Sahibiyle İletişime Geç</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#4CAF50]" />
                <span className="font-medium text-gray-900">{pet.owner.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#4CAF50]" />
                <span className="font-medium text-gray-900">{pet.owner.email}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button className="w-full px-6 py-3 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C]">
                Sahibiyle İletişime Geç
              </button>
              {user && user.id !== pet.owner._id && (
                <button 
                  onClick={handleSendMessage}
                  disabled={sendingMessage}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaComments />
                  {sendingMessage ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Türkçe: İlgili İlanlar Bölümü */}
      {relatedPets.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">İlginizi Çekebilecek Diğer İlanlar</h3>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {relatedPets.map((relatedPet) => (
              <Link to={`/pets/${relatedPet._id}`} key={relatedPet._id} className="block flex-shrink-0 w-64">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 h-full">
                  <div className="h-40">
                    <img
                      src={relatedPet.images[0] || '/placeholder-pet.jpg'}
                      alt={relatedPet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900 truncate">{relatedPet.name}</h4>
                    <p className="text-gray-700 text-sm">{relatedPet.breed}</p>
                    <div className="flex items-center text-gray-700 mt-2 text-sm">
                      <FaMapMarkerAlt className="mr-2 text-sm text-[#4CAF50]" />
                      <span>{relatedPet.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail; 