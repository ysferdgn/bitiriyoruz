import React, { useState } from 'react';
import { FaDog, FaHome, FaLeaf, FaHeart, FaPaw, FaStar, FaSmile, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'lifestyle', label: 'Yaşam Tarzı', icon: <FaSmile /> },
  { key: 'environment', label: 'Yaşam Alanı', icon: <FaHome /> },
  { key: 'care', label: 'Bakım İhtiyacı', icon: <FaLeaf /> },
];

const BREEDS = {
  lifestyle: [
    {
      name: 'Chihuahua',
      img: 'https://images.pexels.com/photos/4587997/pexels-photo-4587997.jpeg?auto=compress&w=400',
      desc: '🐾 Minik ama yürekten! Apartmanda yaşar, kucakta kral olur.',
    },
    {
      name: 'Golden Retriever',
      img: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&w=400',
      desc: '🐾 "Top at, getiririm!" modunda, dost canlısı ve yürüyüş delisi.',
    },
    {
      name: 'Border Collie',
      img: 'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&w=400',
      desc: '🐾 Enerjin bitmiyorsa, Border Collie ile yarışabilirsin!',
    },
    {
      name: 'Bulldog',
      img: 'https://images.pexels.com/photos/164186/pexels-photo-164186.jpeg?auto=compress&w=400',
      desc: '🐾 Rahatına düşkün, "bugün de uyuyalım" diyenler için.',
    },
  ],
  environment: [
    {
      name: 'Siberian Husky',
      img: 'https://petihtiyac.com/Data/EditorFiles/husky_bakimi_petihtiyac.jpg',
      desc: '❄️ Soğuk iklim ve geniş alan seven, kaçmaya meyilli maceraperest.',
    },
    {
      name: 'French Bulldog',
      img: 'https://images.petlebi.com/v7/_ptlb/up/race/165.jpg',
      desc: '🏢 Küçük evler ve apartmanlar için "ben de varım!"',
    },
    {
      name: 'Labrador',
      img: 'https://i2.milimaj.com/i/milliyet/75/750x0/60e58fd286b2441d8410f008.jpg',
      desc: '🌳 Bahçeli evde mutluluk abidesi, suya atlamaya bayılır.',
    },
    {
      name: 'Pug',
      img: 'https://images.pexels.com/photos/374906/pexels-photo-374906.jpeg?auto=compress&w=400',
      desc: '😴 Küçük alanlarda kolayca uyum sağlar, horlaması bonus.',
    },
  ],
  care: [
    {
      name: 'Poodle',
      img: 'https://petegitimi.com/wp-content/uploads/2021/08/kanis-kopek-egitimi.jpeg',
      desc: '✂️ Az tüy döker, alerjisi olanlar için "oh be!" dedirtir.',
    },
    {
      name: 'Shih Tzu',
      img: 'https://fello.pet/wp-content/uploads/2022/06/Shih-Tzu-1-scaled.jpg',
      desc: "💇‍♂️ Düzenli tımar ister, ama selfie'de hep havalı çıkar.",
    },
    {
      name: 'Beagle',
      img: 'https://images.pexels.com/photos/460823/pexels-photo-460823.jpeg?auto=compress&w=400',
      desc: '🎾 Bakımı kolay, enerjik ve sosyal. "Hadi gezelim!"',
    },
    {
      name: 'Akita',
      img: 'https://dyreportal.dk/media/800/800/media/a/lexicon/75314_akita.jpg',
      desc: '🧼 Daha fazla ilgi ve bakım ister, ama sevgisi de büyük.',
    },
  ],
};

const DOG_QUOTES = [
  '"Bir köpeğin sadakati, en iyi arkadaşınkinden fazladır!"',
  '"Kuyruğunu sallayan bir dost, kötü gününü güzelleştirir."',
  '"Köpekler, hayatın patili neşesidir!"',
  '"Bir köpek, evinize neşe ve biraz da tüy getirir."',
  '"Köpekler konuşamaz ama gözleriyle her şeyi anlatır."',
  '"Bir köpek, asla yanlış insanı sevmez."',
];

function getRandomQuote() {
  return DOG_QUOTES[Math.floor(Math.random() * DOG_QUOTES.length)];
}

export default function DogBreedGuide() {
  const [activeTab, setActiveTab] = useState('lifestyle');
  // Rastgele bir karta "Favorim!" rozeti
  const favIndex = Math.floor(Math.random() * BREEDS[activeTab].length);
  // Rastgele köpekten tavsiye
  const quote = getRandomQuote();

  return (
    <div className="bg-[#FFF8F0] min-h-screen py-10 px-2 font-[Fredoka] relative overflow-hidden">
      <Link 
        to="/pet-guide" 
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-200"
      >
        <FaArrowLeft className="text-[#4CAF50]" />
        <span className="text-gray-700 font-semibold">Geri Dön</span>
      </Link>

      {/* Büyük silik pati SVG */}
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 z-0" width="400" height="400" viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="120" rx="40" ry="50" fill="#4CAF50" />
        <ellipse cx="60" cy="80" rx="18" ry="25" fill="#4CAF50" />
        <ellipse cx="140" cy="80" rx="18" ry="25" fill="#4CAF50" />
        <ellipse cx="80" cy="60" rx="12" ry="18" fill="#4CAF50" />
        <ellipse cx="120" cy="60" rx="12" ry="18" fill="#4CAF50" />
      </svg>
      <div className="max-w-3xl mx-auto rounded-xl shadow-lg bg-white/90 p-8 relative z-10">
        {/* Esprili başlık */}
        <div className="flex flex-col items-center mb-8">
          <FaDog className="text-[#F4A460] text-7xl drop-shadow-lg mb-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
            Hangi köpek sana göre? Hadi bulalım! <span className="inline-block">🐶</span>
          </h1>
          <p className="text-lg text-gray-800 text-center max-w-xl">
            Merak etme, ısırmayız! Sadece biraz pati izi bırakabiliriz...
          </p>
        </div>
        {/* Sekmeler */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors text-lg shadow-sm border flex items-center gap-2
                ${activeTab === tab.key ? 'bg-[#4CAF50] text-white' : 'bg-[#FFF8F0] text-gray-700 border-[#4CAF50]'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {/* Köpekten günün tavsiyesi */}
        <div className="bg-[#E8F5E9] border-l-4 border-[#4CAF50] rounded-md px-6 py-4 mb-8 flex items-center gap-3 shadow-sm">
          <FaPaw className="text-[#4CAF50] text-2xl" />
          <span className="text-[#388E3C] font-semibold italic">Köpekten Tavsiye:</span>
          <span className="text-gray-700">{quote}</span>
        </div>
        {/* Irk kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {BREEDS[activeTab].map((breed, i) => (
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
                className="w-24 h-24 object-cover rounded-full border-4 border-[#4CAF50] mb-3 shadow"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-1">
                <FaPaw className="text-[#4CAF50]" /> {breed.name}
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