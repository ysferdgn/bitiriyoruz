import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSyringe, FaBookMedical, FaFirstAid, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const TABS = {
  vaccinations: 'Aşı Takvimi',
  illnesses: 'Yaygın Hastalıklar',
  emergency: 'Acil Bakım',
};

const HEALTH_CONTENT = {
  vaccinations: {
    title: 'Aşının Önemi ve Takvimi',
    icon: <FaSyringe />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    data: [
      { q: 'Köpekler İçin Temel Aşılar', a: 'Karma, Kuduz, Parvovirus, Distemper ve Bordetella (barınak veya sosyalleşme ortamlarına göre).' },
      { q: 'Kediler İçin Temel Aşılar', a: 'Karma (Feline Panleukopenia, Calicivirus, Rhinotracheitis), Kuduz ve Lösemi (risk grubuna göre).' },
      { q: 'Yavrularda Aşılama', a: 'Genellikle 6-8 haftalıkken başlar ve veterinerinizin belirlediği programa göre birkaç hafta arayla tekrarlanır.' },
    ],
  },
  illnesses: {
    title: 'Belirtiler ve Sık Görülen Hastalıklar',
    icon: <FaBookMedical />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    data: [
      { q: 'Parazitler (İç/Dış)', a: 'Belirtiler: Kaşıntı, tüy dökülmesi, iştahsızlık, ishal. Düzenli parazit kontrolü hayati önem taşır.' },
      { q: 'Sindirim Sorunları', a: 'Belirtiler: Kusma, ishal, kabızlık. Ani mama değişikliklerinden kaçının ve veterinerinize danışın.' },
      { q: 'Deri Problemleri', a: 'Belirtiler: Kızarıklık, kaşıntı, yaralar. Alerjiler, enfeksiyonlar veya parazitler neden olabilir.' },
    ],
  },
  emergency: {
    title: 'Acil Durumda Ne Yapmalı?',
    icon: <FaFirstAid />,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    data: [
      { q: 'Zehirlenme Şüphesi', a: 'Hemen veterinerinizi arayın. Zehirli maddeyi ve mümkünse ambalajını yanınızda götürün. Asla kusturmaya çalışmayın.' },
      { q: 'Trafik Kazası / Travma', a: 'Sakin olun, hayvanı dikkatlice ve sarsmadan hareket ettirin. İç kanama riskine karşı hemen kliniğe başvurun.' },
      { q: 'Nefes Almada Güçlük', a: 'Hayvanın ağzında yabancı bir cisim olup olmadığını kontrol edin. Hava yolunun açık olduğundan emin olun ve derhal veterinerinize ulaşın.' },
    ],
  },
};

export default function HealthGuide() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('vaccinations');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (TABS[hash]) {
      setActiveTab(hash);
    }
  }, [location]);
  
  const content = HEALTH_CONTENT[activeTab];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-8 bg-white shadow-sm relative">
        <Link 
          to="/pet-guide" 
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-200"
        >
          <FaArrowLeft className="text-green-600" />
          <span className="text-gray-700 font-semibold">Geri Dön</span>
        </Link>
        <div className="max-w-4xl mx-auto pt-20 px-4">
          <FaShieldAlt className="mx-auto text-6xl text-red-500" />
          <div className="text-center mt-8">
            <h1 className="text-4xl font-bold text-gray-900">Evcil Hayvan Sağlığı Rehberi</h1>
            <p className="mt-2 text-lg text-gray-800">Onların sağlığı ve mutluluğu için bilmeniz gerekenler.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row rounded-xl bg-white shadow-md p-2 gap-2 mb-8">
          {Object.keys(TABS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full py-3 px-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3
                ${activeTab === key ? `${HEALTH_CONTENT[key].color.replace('text-', 'bg-')} text-white shadow` : 'bg-transparent text-gray-700 hover:bg-gray-100'}
              `}
            >
              {HEALTH_CONTENT[key].icon}
              {TABS[key]}
            </button>
          ))}
        </div>

        <div className={`p-6 bg-white rounded-lg shadow-lg border-t-4 ${content.color.replace('text-', 'border-')}`}>
          <h2 className={`text-2xl font-bold mb-4 ${content.color}`}>{content.title}</h2>
          <div className="space-y-4">
            {content.data.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg ${content.bgColor}`}>
                <h3 className={`font-bold text-lg ${content.color}`}>{item.q}</h3>
                <p className="text-gray-700 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 