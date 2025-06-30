import React, { useState } from 'react';
import { FaCat, FaHome, FaLeaf, FaHeart, FaPaw, FaStar, FaSmile, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'lifestyle', label: 'Yaşam Tarzı', icon: <FaSmile /> },
  { key: 'environment', label: 'Yaşam Alanı', icon: <FaHome /> },
  { key: 'care', label: 'Bakım İhtiyacı', icon: <FaLeaf /> },
];

const CAT_BREEDS = {
  lifestyle: [
    {
      name: 'Siyam',
      img: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&w=400',
      desc: 'Konuşkan ve sosyal! "Miyav" demek onun için bir sanattır.',
    },
    {
      name: 'İran (Persian)',
      img: 'https://images.pexels.com/photos/1048033/pexels-photo-1048033.jpeg?auto=compress&w=400',
      desc: 'Tam bir salon asili. Sakin ve huzurlu ortamları sever.',
    },
    {
      name: 'Bengal',
      img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&w=400',
      desc: 'Vahşi görünümlü minik leopar. Enerjisiyle evde fırtınalar estirir.',
    },
    {
      name: 'Ragdoll',
      img: 'https://images.pexels.com/photos/1472999/pexels-photo-1472999.jpeg?auto=compress&w=400',
      desc: 'Kucağa alındığında kendini salan, sevgi dolu tüy yumağı.',
    },
  ],
  environment: [
    {
      name: 'British Shorthair',
      img: 'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg?auto=compress&w=400',
      desc: 'Apartman hayatının centilmeni. Kendi halinde takılır, ortalığı dağıtmaz.',
    },
    {
      name: 'Maine Coon',
      img: 'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&w=400',
      desc: 'Nazik dev. Geniş alanları ve tırmanmayı sever, küçük bir aslan gibidir.',
    },
    {
      name: 'Sfenks (Sphynx)',
      img: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&w=400',
      desc: 'Tüysüz ama sıcakkanlı! Kışın kazağını giymeyi unutma.',
    },
    {
      name: 'Scottish Fold',
      img: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&w=400',
      desc: 'Kırık kulaklarıyla şirinlik abidesi. Sakin bir ev ortamı tam ona göre.',
    },
  ],
  care: [
    {
      name: 'Van Kedisi',
      img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&w=400',
      desc: 'Tüyü ipek gibi, bakımı kolay. Suyla oynamaya bayılması ise bonus!',
    },
    {
      name: 'Ankara Kedisi',
      img: 'https://images.pexels.com/photos/17767/pexels-photo.jpg?auto=compress&w=400',
      desc: 'Zarif ve uzun tüylü, düzenli fırçalama ile parıldar.',
    },
    {
      name: 'American Shorthair',
      img: 'https://images.pexels.com/photos/96938/pexels-photo-96938.jpeg?auto=compress&w=400',
      desc: 'Bakımı en kolaylarından. Sağlıklı ve uyumlu bir arkadaştır.',
    },
    {
      name: 'Habeş (Abyssinian)',
      img: 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&w=400',
      desc: 'Az bakım gerektiren, aktif ve meraklı bir kaşif.',
    },
  ],
};

const CAT_QUOTES = [
  '"Bir eve kedi girince, o ev artık yuva olur."',
  '"Kediler, mırıldayarak teşekkür eder."',
  '"Her kedinin bir favori kutusu vardır."',
  '"Kediler, zarafetin ve merakın patili halidir."',
  '"Hayat, kedi tüyleriyle daha güzel."',
];

function getRandomQuote() {
  return CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)];
}

export default function CatBreedGuide() {
  const [activeTab, setActiveTab] = useState('lifestyle');
  const favIndex = Math.floor(Math.random() * CAT_BREEDS[activeTab].length);
  const quote = getRandomQuote();

  return (
    <div className="bg-[#F0FFF8] min-h-screen py-10 px-2 font-[Fredoka] relative overflow-hidden">
      <Link 
        to="/pet-guide" 
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-200"
      >
        <FaArrowLeft className="text-[#38A169]" />
        <span className="text-gray-700 font-semibold">Geri Dön</span>
      </Link>
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 z-0" width="400" height="400" viewBox="0 0 200 200" fill="none">
        <path d="M100 20C50 20 20 50 20 100C20 150 50 180 100 180C150 180 180 150 180 100C180 50 150 20 100 20ZM90 40L110 40L100 60L90 40ZM70 45L80 65L60 75L70 45Z" fill="#38A169"/>
      </svg>
      <div className="max-w-3xl mx-auto rounded-xl shadow-lg bg-white/90 p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <FaCat className="text-[#38A169] text-7xl drop-shadow-lg mb-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
            Hangi kedi sana göre? Patili dostunu bulalım! <span className="inline-block">😺</span>
          </h1>
          <p className="text-lg text-gray-800 text-center max-w-xl">
            Bu rehber tırmalamaz! Sadece doğru yolu gösterir...
          </p>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors text-lg shadow-sm border flex items-center gap-2
                ${activeTab === tab.key ? 'bg-[#38A169] text-white' : 'bg-[#F0FFF8] text-gray-700 border-[#38A169]'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-[#E6FFFA] border-l-4 border-[#38A169] rounded-md px-6 py-4 mb-8 flex items-center gap-3 shadow-sm">
          <FaPaw className="text-[#38A169] text-2xl" />
          <span className="text-[#2C7A7B] font-semibold italic">Kediden Tavsiye:</span>
          <span className="text-gray-700">{quote}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CAT_BREEDS[activeTab].map((breed, i) => (
            <div
              key={breed.name}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative"
            >
              {i === favIndex && (
                <span className="absolute -top-3 right-3 bg-[#FFD700] text-white text-xs px-3 py-1 rounded-full shadow flex items-center gap-1 font-bold">
                  <FaStar className="text-white" /> Favorim!
                </span>
              )}
              <img
                src={breed.img}
                alt={breed.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-[#38A169] mb-3 shadow"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-1">
                <FaPaw className="text-[#38A169]" /> {breed.name}
              </h3>
              <p className="text-gray-700 text-center text-base leading-relaxed">
                {breed.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 