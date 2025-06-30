import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShare, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaComments } from 'react-icons/fa';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// Boyut bilgisini Türkçeye çeviren yardımcı fonksiyon
// size: İngilizce boyut (Small, Medium, Large)
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

// Hayvan detay sayfası bileşeni
// Seçilen hayvanın detaylarını, iletişim ve benzer ilanları gösterir
const PetDetail = () => {
  // URL'den 'id' parametresini alır
  const { id } = useParams();
  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();
  // Kullanıcı bilgisi (giriş yapmışsa)
  const { user } = useAuth();
  // Hayvan verisi (API'den çekilen)
  const [pet, setPet] = useState(null);
  // Sayfa yüklenme durumu
  const [loading, setLoading] = useState(true);
  // Hata mesajı
  const [error, setError] = useState(null);
  // Mesaj gönderme işlemi yüklenme durumu
  const [sendingMessage, setSendingMessage] = useState(false);
  // Benzer hayvan ilanları
  const [relatedPets, setRelatedPets] = useState([]);

  // Sayfa yüklendiğinde veya id değiştiğinde hayvan detaylarını ve ilgili ilanları çeker
  useEffect(() => {
    // API'den hayvan detaylarını ve ilgili hayvanları çeken asenkron fonksiyon
    const fetchPetData = async () => {
      setLoading(true); // Yüklenme başlatılır
      try {
        // Ana hayvan detayını çek
        const petResponse = await axios.get(`/api/pets/${id}`);
        setPet(petResponse.data);
        // İlgili hayvanları çek
        const relatedResponse = await axios.get(`/api/pets/related/${id}`);
        setRelatedPets(relatedResponse.data);
        setLoading(false); // Yüklenme bitti
      } catch (err) {
        setError('Hayvan detayları yüklenemedi.'); // Hata mesajı göster
        setLoading(false);
      }
    };
    fetchPetData();
  }, [id]);

  // Mesaj gönder butonuna tıklandığında çalışır
  // Kullanıcı giriş yapmamışsa veya kendi ilanına mesaj göndermeye çalışıyorsa uyarı verir
  const handleSendMessage = async () => {
    if (!user) {
      alert('Mesaj göndermek için giriş yapmalısınız');
      return;
    }
    if (user.id === pet.owner._id) {
      alert('Kendi hayvanınıza mesaj gönderemezsiniz');
      return;
    }
    setSendingMessage(true);
    try {
      // Yeni bir konuşma oluştur veya mevcut konuşmayı al
      const response = await axios.post('/api/conversations', {
        otherUserId: pet.owner._id
      });
      // Mesajlar sayfasına yönlendir
      navigate(`/messages?conversation=${response.data._id}`);
    } catch (err) {
      console.error('Konuşma oluşturulurken hata:', err);
      alert('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setSendingMessage(false);
    }
  };

  // Sayfa yükleniyorsa yüklenme animasyonu göster
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  // Hata oluştuysa hata mesajı göster
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

  // Hayvan verisi yoksa hiçbir şey gösterme
  if (!pet) {
    return null;
  }

  // Hayvan detay sayfası arayüzü
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Geri Dön Butonu */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        title="Geri Dön"
      >
        <FaArrowLeft className="text-lg" />
        Geri
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hayvan Resimleri */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
            {/* Ana resim */}
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* Diğer resimler */}
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

        {/* Hayvan Bilgileri ve İletişim */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-800">{pet.breed}</p>
            </div>
            <div className="flex gap-4">
              {/* Beğen ve Paylaş butonları (şu an işlevsiz) */}
              <button className="text-gray-700 hover:text-[#4CAF50]" title="Beğen">
                <FaHeart />
              </button>
              <button className="text-gray-700 hover:text-[#4CAF50]" title="Paylaş">
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

          {/* Sahip İletişim Bilgileri ve Mesaj Gönder */}
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
              {/* Mesaj gönder butonu */}
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaComments /> {sendingMessage ? 'Mesaj gönderiliyor...' : 'Mesaj Gönder'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benzer İlanlar */}
      {relatedPets.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer İlanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Her bir benzer ilan kartı */}
            {relatedPets.map(relatedPet => (
              <Link key={relatedPet._id} to={`/pets/${relatedPet._id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={relatedPet.images[0] || '/placeholder-pet.jpg'}
                    alt={relatedPet.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{relatedPet.name}</h3>
                    <p className="text-gray-700">{relatedPet.breed}</p>
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