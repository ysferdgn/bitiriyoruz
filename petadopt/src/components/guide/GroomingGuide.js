import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCut, FaShower, FaPaw, FaArrowLeft } from 'react-icons/fa';

const TABS = {
  brushing: 'Tüy Bakımı & Fırçalama',
  bathing: 'Banyo Rutini',
  nails: 'Tırnak & Pati Bakımı',
};

const GROOMING_CONTENT = {
  brushing: {
    title: 'Parlak Tüylerin Sırrı',
    icon: <FaCut />,
    color: 'bg-cyan-500',
    steps: [
      { title: 'Doğru Fırçayı Seçin', desc: 'Kısa, uzun veya kıvırcık tüyler için farklı fırça ve taraklar bulunur. Evcil hayvanınızın tüy yapısına uygun olanı seçin.' },
      { title: 'Düzenli Olarak Fırçalayın', desc: 'Tüy dökülmesini kontrol altına almak ve tüy karışıklıklarını önlemek için haftada en az birkaç kez fırçalayın.' },
      { title: 'Nazik Olun', desc: 'Fırçalama işlemini olumlu bir deneyim haline getirin. Özellikle karışık tüyleri açarken nazik davranın ve onu ödüllendirin.' },
    ],
  },
  bathing: {
    title: 'Stressiz Banyo Zamanı',
    icon: <FaShower />,
    color: 'bg-blue-500',
    steps: [
      { title: 'Doğru Şampuanı Kullanın', desc: 'Asla insan şampuanı kullanmayın. Evcil hayvanınızın cilt pH\'ına uygun, özel olarak üretilmiş şampuanları tercih edin.' },
      { title: 'Su Sıcaklığını Ayarlayın', desc: 'Suyun ılık olduğundan emin olun. Çok sıcak veya çok soğuk su, onu rahatsız edebilir.' },
      { title: 'Göz ve Kulakları Koruyun', desc: 'Yıkama sırasında gözlerine ve kulaklarına su kaçmamasına özellikle dikkat edin. Kulaklarını pamukla nazikçe tıkayabilirsiniz.' },
    ],
  },
  nails: {
    title: 'Sağlıklı Patiler',
    icon: <FaPaw />,
    color: 'bg-indigo-500',
    steps: [
      { title: 'Doğru Zamanlama', desc: 'Tırnak kesimini, evcil hayvanınız sakin ve rahatken yapın. Genellikle oyun veya beslenme sonrası iyi bir zamandır.' },
      { title: 'Canlı Dokuya Dikkat Edin', desc: 'Tırnağın içindeki pembe renkli canlı dokuya (quick) asla kesmeyin, bu kanamaya ve acıya neden olur. Sadece tırnağın beyaz ucundan kesin.' },
      { title: 'Pati Kontrolü', desc: 'Tırnak kesimi sırasında patilerini de kontrol edin. Yastıkçıklar arasında kuruluk, çatlak veya yabancı cisim olup olmadığına bakın.' },
    ],
  },
};

export default function GroomingGuide() {
  const [activeTab, setActiveTab] = useState('brushing');
  const content = GROOMING_CONTENT[activeTab];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-4 relative">
          <Link 
            to="/pet-guide" 
            className="absolute top-0 left-4 -mt-12 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-all duration-200"
          >
            <FaArrowLeft className="text-gray-700" />
            <span className="text-gray-700 font-semibold">Geri Dön</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Temel Bakım Rehberi</h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Dostunuzun sağlıklı, temiz ve mutlu kalması için pratik ipuçları.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="flex justify-center bg-white rounded-xl shadow-lg p-2 gap-2 mb-10 z-10 relative">
          {Object.keys(TABS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full py-3 px-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2
                ${activeTab === key ? `${GROOMING_CONTENT[key].color} text-white shadow-lg` : 'text-slate-600 hover:bg-slate-100'}
              `}
            >
              {GROOMING_CONTENT[key].icon}
              {TABS[key]}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">{content.title}</h2>
          <div className="space-y-6">
            {content.steps.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border-l-4 rounded-r-lg" style={{ borderColor: GROOMING_CONTENT[activeTab].color.replace('bg-', '') }}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${content.color}`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 