import React, { useState, useEffect } from 'react';
import { FaDog, FaCat, FaDove, FaMars, FaVenus } from 'react-icons/fa';
import PetCard from './PetCard';
import axios from '../utils/axios';
import { turkishCities } from '../utils/cities'; // Şehir listesini import et

const Search = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false); // Başlangıçta false
  
  // Filtre durumları - type ve gender artık array
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    type: [],
    gender: [],
  });

  // Sadece bileşen yüklendiğinde konumları çek
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsResponse = await axios.get('/api/pets/locations');
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Konumlar yüklenirken hata oluştu:', error);
        // Hata durumunda kullanıcıya bilgi verilebilir, örn. bir toast notification ile.
      }
    };
    fetchLocations();
  }, []);
  
  // Filtreler her değiştiğinde API'ye istek atarak evcil hayvanları getir
  useEffect(() => {
    const fetchPets = async () => {
    setLoading(true);
      
      const activeFilters = { ...filters };
      
      // Array olan filtreleri virgülle ayrılmış string'e çevir
      if (activeFilters.type.length) {
        activeFilters.type = activeFilters.type.join(',');
      } else {
        delete activeFilters.type; // Boşsa parametreyi gönderme
      }

      if (activeFilters.gender.length) {
        activeFilters.gender = activeFilters.gender.join(',');
      } else {
        delete activeFilters.gender; // Boşsa parametreyi gönderme
      }

      // Konum boşsa gönderme
      if (!activeFilters.location) {
        delete activeFilters.location;
      }
      
      try {
        const response = await axios.get('/api/pets/search', { params: activeFilters });
        setPets(response.data);
      } catch (error) {
        console.error('Hayvanlar yüklenirken hata oluştu:', error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    // İlk yüklemede ve filtreler değiştiğinde çalıştır
    fetchPets();
  }, [filters]);

  // Çoklu seçim filtresini yöneten fonksiyon
  const handleMultiSelectFilter = (name, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value) // Değer zaten varsa kaldır
        : [...currentValues, value]; // Değer yoksa ekle
      
      return { ...prevFilters, [name]: newValues };
    });
  };
  
  // Konum filtresini yöneten fonksiyon
  const handleLocationChange = (e) => {
    setFilters(prevFilters => ({
        ...prevFilters,
        location: e.target.value
    }));
  }

  // Tüm filtreleri temizleyen fonksiyon
  const handleClearFilters = () => {
    setFilters({
      location: '',
      type: [],
      gender: [],
    });
  };

  const FilterButton = ({ icon, label, value, name }) => {
    // Değerin filter array'inde olup olmadığını kontrol et
    const isActive = filters[name].includes(value); 
    return (
      <button
        onClick={() => handleMultiSelectFilter(name, value)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border-2 ${
          isActive 
            ? 'bg-green-500 text-white border-green-500 shadow-md' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
        }`}
      >
        {icon}
        <span className="font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Hayalindeki Dostunu Bul</h1>
        <p className="mt-2 text-lg text-gray-600">Filtreleri kullanarak sana en uygun ilanı keşfet.</p>
      </div>

      {/* Filtreleme Bölümü */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 sticky top-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Şehir Filtresi */}
          <div className="w-full">
            <select
              value={filters.location}
              onChange={handleLocationChange}
              className="w-full p-3 border-2 border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tüm Şehirler</option>
              {turkishCities.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Tür Filtresi */}
          <div className="flex justify-center items-center gap-2">
            <FilterButton icon={<FaDog />} label="Köpek" value="dog" name="type" />
            <FilterButton icon={<FaCat />} label="Kedi" value="cat" name="type" />
            <FilterButton icon={<FaDove />} label="Kuş" value="bird" name="type" />
      </div>

          {/* Cinsiyet Filtresi */}
          <div className="flex justify-center items-center gap-2">
            <FilterButton icon={<FaMars />} label="Erkek" value="Male" name="gender" />
            <FilterButton icon={<FaVenus />} label="Dişi" value="Female" name="gender" />
          </div>

          {/* Temizle Butonu */}
          <div>
          <button
              onClick={handleClearFilters}
              className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md disabled:bg-red-300"
              disabled={!filters.location && !filters.type.length && !filters.gender.length}
            >
              Filtreleri Temizle
          </button>
              </div>
            </div>
          </div>

      {/* Arama Sonuçları */}
        {loading ? (
          <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">İlanlar Yükleniyor...</p>
          </div>
        ) : (
        <>
          <p className="text-center text-gray-600 mb-8">{pets.length} ilan bulundu.</p>
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pets.map(pet => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-800">Aradığınız Kriterlere Uygun İlan Bulunamadı.</h3>
              <p className="text-gray-500 mt-2">Farklı filtreler deneyerek aramanızı genişletebilirsiniz.</p>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default Search; 