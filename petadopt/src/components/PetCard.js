import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBirthdayCake, FaVenus, FaMars, FaBookmark, FaRegBookmark, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Auth context'i tekrar import ediyoruz

// Hayvan kartı bileşeni: İlan listesindeki her bir hayvanı gösterir
// Kullanıcıya hayvanın temel bilgilerini, kaydetme ve silme gibi işlemleri sunar
const PetCard = ({ pet, onDelete }) => {
  // AuthContext'ten kullanıcı, kaydedilenler ve kaydetme fonksiyonu alınır
  const { user, savedPets, toggleSavedPet, loading: authLoading } = useAuth();
  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();

  // Eğer pet objesi yoksa hiçbir şey gösterme
  if (!pet) {
    return null;
  }

  // Kullanıcı bu ilanı kaydetmiş mi kontrolü
  // savedPets: kullanıcının kaydettiği ilanlar
  // isSaved: bu ilan kaydedilmiş mi?
  const isSaved = user && Array.isArray(savedPets) && savedPets.some(savedPet => savedPet && savedPet._id === pet._id);

  // Kaydet butonuna tıklanınca çalışır
  // Giriş yapılmamışsa giriş sayfasına yönlendirir, aksi halde kaydetme işlemini tetikler
  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin');
      return;
    }
    toggleSavedPet(pet._id);
  };

  // Cinsiyet kontrolü ve ikon/metin seçimi
  const isMale = pet.gender && pet.gender.toLowerCase() === 'male';
  const imageUrl = pet.images && pet.images.length > 0 ? pet.images[0] : '/placeholder-pet.jpg';
  const genderText = isMale ? 'Erkek' : 'Dişi';
  const genderIcon = isMale ? <FaMars className="text-blue-800" /> : <FaVenus className="text-pink-800" />;
  // İlanın durumu (ör: available)
  const status = pet.status || 'available';

  // Hayvan kartı arayüzü
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col h-full">
      <div className="relative">
        <Link to={`/pets/${pet._id}`} className="block">
          <img
            src={imageUrl}
            alt={pet.name}
            className="w-full h-56 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-pet.jpg'; }}
          />
        </Link>
        {/* İlan müsaitse yeşil rozet göster */}
        {status === 'available' && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Müsait
          </div>
        )}
        {/* Kullanıcı giriş yaptıysa kaydet butonu göster */}
        {user && (
          <button
            onClick={handleSaveClick}
            disabled={authLoading}
            className={`absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full transition-colors text-2xl ${
                isSaved ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
            title={isSaved ? 'Kaydedilenlerden kaldır' : 'Daha sonra bakmak için kaydet'}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}
        {/* onDelete fonksiyonu verilmişse sil butonu göster */}
        {onDelete && (
          <button
            onClick={() => onDelete(pet._id)}
            className="absolute top-3 left-3 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 transition-colors z-10"
            title="İlanı Sil"
          >
            <FaTrash />
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{pet.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Konum bilgisi */}
          <div className="flex items-center gap-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            <FaMapMarkerAlt />
            <span>{pet.location}</span>
          </div>
          {/* Yaş bilgisi */}
          <div className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
            <FaBirthdayCake />
            <span>{pet.age} yaş</span>
          </div>
          {/* Cinsiyet bilgisi */}
          <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full font-medium ${isMale ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
            {genderIcon}
            <span>{genderText}</span>
          </div>
        </div>

        {/* Irk bilgisi */}
        <p className="text-md text-gray-700 mb-4">{pet.breed}</p>
        
        {/* Detaylar butonu */}
        <div className="mt-auto">
          <Link
            to={`/pets/${pet._id}`}
            className="block w-full text-center bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard; 