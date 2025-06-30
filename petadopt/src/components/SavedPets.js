import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PetCard from './PetCard';
import Loading from './common/Loading';
import { FaBookmark } from 'react-icons/fa';

const SavedPets = () => {
  const { user, savedPets, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <Loading />;
  }
  
  // Backenden null gelebilecek kayıtları (örn. silinmiş ilan) filtrele
  const validSavedPets = savedPets ? savedPets.filter(p => p) : [];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaBookmark className="text-4xl text-green-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Kaydedilen İlanlar</h1>
            <p className="text-gray-600 mt-1">Daha sonra bakmak için kaydettiğiniz ilanlar.</p>
          </div>
        </div>
        
        {validSavedPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {validSavedPets.map(pet => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <FaBookmark className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Henüz hiç ilan kaydetmediniz.</h3>
            <p className="text-gray-500 mt-2">İlanlardaki ikonuna tıklayarak onları buraya ekleyebilirsiniz.</p>
            <button onClick={() => navigate('/search')} className="mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
              İlanları Keşfet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPets; 