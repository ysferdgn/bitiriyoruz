import React, { useState } from 'react';
import { FaPaw, FaStethoscope, FaClipboardList, FaHome, FaInfoCircle, FaCheckCircle, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TABS = {
  welcome: 'İlk Hafta',
  vet: 'Veteriner Ziyareti',
  shopping: 'Gerekli Eşya Listesi',
};

const GUIDE_CONTENT = {
  welcome: {
    title: 'Evinize Hoş Geldi!',
    icon: <FaHome className="text-4xl text-white" />,
    bgColor: 'bg-blue-400',
    points: [
      'İlk 24 saatte yeni evine alışması için ona zaman tanıyın.',
      'Evi kendi hızında, sakince gezip koklamasına izin verin.',
      'Sakin bir köşe hazırlayın. Yatağı ve suyu kolayca ulaşabileceği bir yerde olsun.',
      'İlk günler biraz stresli olabilir, sabırlı ve sevgi dolu olun.',
    ],
  },
  vet: {
    title: 'İlk Veteriner Kontrolü',
    icon: <FaStethoscope className="text-4xl text-white" />,
    bgColor: 'bg-green-400',
    points: [
      'Eve alıştıktan sonraki ilk hafta içinde veteriner randevusu alın.',
      'Genel sağlık kontrolü, aşı takvimi ve parazit kontrolü hakkında bilgi alın.',
      'Mikroçip taktırmayı ve kaydını yaptırmayı unutmayın.',
      'Veterinerinize beslenme ve kısırlaştırma hakkında sorular sorun.',
    ],
  },
  shopping: {
    title: 'Alışveriş Zamanı!',
    icon: <FaClipboardList className="text-4xl text-white" />,
    bgColor: 'bg-yellow-400',
    points: [
      'Kaliteli mama ve su kabı.',
      'Rahat bir yatak ve taşıma çantası/kutusu.',
      'Tasma, göğüs tasması ve isimlik.',
      'Yaşına uygun oyuncaklar ve tırmalama tahtası (kedi ise).',
      'Tüy fırçası, şampuan ve tırnak makası gibi bakım ürünleri.',
    ],
  },
};

export default function FirstTimeOwnerGuide() {
  const [activeTab, setActiveTab] = useState('welcome');

  const content = GUIDE_CONTENT[activeTab];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 relative">
      <Link 
        to="/pet-guide" 
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
      >
        <FaArrowLeft className="text-purple-500" />
        <span className="text-gray-700 font-semibold">Geri Dön</span>
      </Link>
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10">
          <FaPaw className="mx-auto text-5xl text-purple-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">İlk Kez Evcil Hayvan Sahibi Rehberi</h1>
          <p className="text-lg text-gray-600 mt-2">
            Bu heyecan verici yolculukta bilmeniz gereken her şey burada!
          </p>
        </div>

        {/* Sekmeler */}
        <div className="flex flex-col sm:flex-row rounded-xl bg-white shadow-md p-2 gap-2 mb-8">
          {Object.keys(TABS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full py-3 px-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
                ${activeTab === key ? 'bg-purple-500 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-purple-100'}
              `}
            >
              {GUIDE_CONTENT[key].icon}
              {TABS[key]}
            </button>
          ))}
        </div>

        {/* İçerik Kutusu */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500">
          <div className={`p-6 text-white ${content.bgColor}`}>
            <div className="flex items-center gap-4">
              {content.icon}
              <h2 className="text-2xl font-bold">{content.title}</h2>
            </div>
          </div>
          <div className="p-8">
            <ul className="space-y-4">
              {content.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-center gap-3">
                <FaInfoCircle className="text-blue-500 text-2xl" />
                <p className="text-blue-800 font-semibold">
                  Unutmayın: Her hayvan farklıdır. Onu tanımak için zaman ayırın ve bol bol sevgi gösterin!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 