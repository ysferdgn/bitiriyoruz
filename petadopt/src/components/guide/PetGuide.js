import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaStethoscope, FaBone, FaCat, FaDog, FaGraduationCap, FaCut, FaSearch, FaArrowRight, FaFeather, FaBookOpen
} from 'react-icons/fa';

// Guide data
const guides = [
  {
    category: 'Genel Bakım',
    title: 'İlk Kez Evcil Hayvan Sahiplenecekler İçin Rehber',
    description: 'Yeni dostunuzla hayatınıza harika bir başlangıç yapmak için bilmeniz gereken her şey.',
    path: '/first-time-owner-guide',
    icon: <FaDog className="text-white" />,
    bgColor: 'bg-blue-500'
  },
  {
    category: 'Sağlık',
    title: 'Evcil Hayvan Sağlığı ve Hastalıklar',
    description: 'Sık görülen hastalıklar, önleyici bakım ve acil durum ipuçları.',
    path: '/health-guide',
    icon: <FaStethoscope className="text-white" />,
    bgColor: 'bg-red-500'
  },
  {
    category: 'Beslenme',
    title: 'Evcil Hayvan Beslenme Rehberi',
    description: 'Dostunuzun yaşına, cinsine ve sağlık durumuna en uygun beslenme programını oluşturun.',
    path: '/pet-nutrition-guide',
    icon: <FaBone className="text-white" />,
    bgColor: 'bg-yellow-500'
  },
  {
    category: 'Eğitim',
    title: 'Temel Eğitim Teknikleri',
    description: 'Pozitif pekiştirme ile tuvalet, itaat ve sosyalleşme eğitimleri.',
    path: '/training-guide',
    icon: <FaGraduationCap className="text-white" />,
    bgColor: 'bg-green-500'
  },
  {
    category: 'Bakım',
    title: 'Tüy ve Vücut Bakımı',
    description: 'Tüy dökülmesi, tırnak kesimi ve banyo rutinleri hakkında pratik bilgiler.',
    path: '/grooming-guide',
    icon: <FaCut className="text-white" />,
    bgColor: 'bg-purple-500'
  },
  {
    category: 'Türlere Özel',
    title: 'Kedi Irkları Rehberi',
    description: 'Farklı kedi ırklarının karakter özellikleri, bakım ihtiyaçları ve mizaçları.',
    path: '/cat-breed-guide',
    icon: <FaCat className="text-white" />,
    bgColor: 'bg-pink-500'
  },
  {
    category: 'Türlere Özel',
    title: 'Köpek Irkları Rehberi',
    description: 'Enerji seviyelerinden apartman yaşamına uygunluğuna kadar köpek ırkları.',
    path: '/dog-breed-guide',
    icon: <FaDog className="text-white" />,
    bgColor: 'bg-indigo-500'
  },
  {
    category: 'Türlere Özel',
    title: 'Kuş Irkları Rehberi',
    description: 'Papağanlardan kanaryalara, farklı kuş türlerinin özellikleri ve bakım ihtiyaçları.',
    path: '/bird-breed-guide',
    icon: <FaFeather className="text-white" />,
    bgColor: 'bg-teal-500'
  },
];


const PetGuide = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredGuides = useMemo(() => 
        guides.filter(guide => 
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.category.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [searchTerm]
    );

    const handleSearch = (e) => {
        e.preventDefault();
        // The list updates automatically, but you could navigate to a search results page
        // For now, filtering the current view is enough.
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Pet Bakım Rehberi
                    </h1>
                    <p className="text-lg text-gray-800 max-w-3xl mx-auto">
                        Yeni bir dost edinmekten, onun sağlıklı ve mutlu bir yaşam sürmesini sağlamaya kadar her konuda yanınızdayız.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rehberde ara (örn: beslenme, kedi bakımı)"
                            className="w-full px-6 py-4 pr-16 rounded-full shadow-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                        <button type="submit" className="absolute h-12 w-12 top-1/2 right-2 -translate-y-1/2 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition">
                            <FaSearch />
                        </button>
                    </form>
                </div>

                {/* Guide Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredGuides.map((guide) => (
                        <div 
                            key={guide.path} 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"
                            onClick={() => navigate(guide.path)}
                        >
                            <div className={`p-6 ${guide.bgColor} flex items-center justify-center h-32`}>
                                <div className="text-5xl opacity-80 group-hover:opacity-100 transition-opacity">
                                    {guide.icon}
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm font-semibold text-green-600 mb-1">{guide.category}</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                                <p className="text-gray-800 text-sm mb-4 h-16">{guide.description}</p>
                                <div className="flex justify-end">
                                     <span className="flex items-center text-green-600 font-semibold group-hover:underline">
                                        Devamını Oku
                                        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                     </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredGuides.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500">Aradığınız kriterlere uygun bir rehber bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetGuide; 