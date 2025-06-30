import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBone, FaFish, FaCarrot, FaBalanceScale, FaExclamationTriangle, FaArrowLeft, FaPaw } from 'react-icons/fa';

const TABS = {
  dog: 'Köpek Beslenmesi',
  cat: 'Kedi Beslenmesi',
  tips: 'Genel İpuçları',
};

const NUTRITION_CONTENT = {
  dog: {
    title: 'Dostunuz İçin Doğru Mama',
    icon: <FaBone />,
    color: 'bg-orange-400',
    points: [
      { title: 'Kuru Mama', desc: 'Diş sağlığı için faydalıdır ve pratik bir seçenektir.' },
      { title: 'Yaş Mama', desc: 'Su alımını artırır ve özellikle iştahsız köpekler için caziptir.' },
      { title: 'Çiğ Beslenme (BARF)', desc: 'Doğal bir diyettir ancak veteriner kontrolünde dikkatli hazırlanmalıdır.' },
      { title: 'Porsiyon Kontrolü', desc: 'Irkına, yaşına ve aktivite seviyesine göre porsiyonları ayarlayın.' },
    ],
  },
  cat: {
    title: 'Kedinizin Sağlıklı Diyeti',
    icon: <FaFish />,
    color: 'bg-blue-400',
    points: [
      { title: 'Yüksek Protein', desc: 'Kediler zorunlu etçildir, diyetleri yüksek kaliteli protein içermelidir.' },
      { title: 'Taurin Önemi', desc: 'Kalp ve göz sağlığı için mamalarında mutlaka taurin olmalıdır.' },
      { title: 'Sıvı Tüketimi', desc: 'Böbrek sağlığı için yaş mama ve su pınarları ile su alımını teşvik edin.' },
      { title: 'Tahılsız Seçenekler', desc: 'Hassas sindirim sistemine sahip kediler için tahılsız mamalar daha iyi olabilir.' },
    ],
  },
  tips: {
    title: 'Beslenmede Altın Kurallar',
    icon: <FaBalanceScale />,
    color: 'bg-teal-400',
    points: [
      { title: 'Temiz Su', desc: 'Her zaman taze ve temiz suya erişimi olduğundan emin olun.' },
      { title: 'Yavaş Geçiş', desc: 'Mama değişikliği yaparken, eski mamayla yenisini karıştırarak yavaşça geçiş yapın.' },
      { title: 'Ödül Miktarı', desc: 'Ödül mamaları günlük kalori alımının %10\'unu geçmemelidir.' },
      { title: 'Yaşa Göre Beslenme', desc: 'Yavru, yetişkin ve yaşlı hayvanların besin ihtiyaçları farklıdır.' },
    ],
  },
};

const DANGEROUS_FOODS = [
  { name: 'Çikolata', icon: <FaExclamationTriangle className="text-red-500" /> },
  { name: 'Soğan ve Sarımsak', icon: <FaExclamationTriangle className="text-red-500" /> },
  { name: 'Üzüm ve Kuru Üzüm', icon: <FaExclamationTriangle className="text-red-500" /> },
  { name: 'Avokado', icon: <FaExclamationTriangle className="text-red-500" /> },
  { name: 'Ksilitol (Tatlandırıcı)', icon: <FaExclamationTriangle className="text-red-500" /> },
];

export default function PetNutritionGuide() {
  const [activeTab, setActiveTab] = useState('dog');

  const content = NUTRITION_CONTENT[activeTab];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative bg-white pb-12">
        <Link 
          to="/pet-guide" 
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-200"
        >
          <FaArrowLeft className="text-gray-700" />
          <span className="text-gray-700 font-semibold">Geri Dön</span>
        </Link>
        <div className="max-w-4xl mx-auto pt-20 px-4">
          <FaPaw className="mx-auto text-6xl text-green-500 mb-4" />
          <h1 className="text-center text-4xl font-bold text-gray-800">Doğru Evcil Hayvan Beslemesi</h1>
          <p className="text-center text-lg text-gray-800 mt-2">Sağlıklı ve mutlu bir yaşam için en iyi beslenme ipuçları.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-8 px-4">
        <div className="flex justify-center bg-white rounded-lg shadow-lg p-2 gap-2 mb-8 z-10 relative">
          {Object.keys(TABS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full py-3 px-4 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2
                ${activeTab === key ? `${NUTRITION_CONTENT[key].color} text-white shadow-md` : 'bg-transparent text-gray-500 hover:bg-gray-200'}
              `}
            >
              {NUTRITION_CONTENT[key].icon}
              {TABS[key]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.title}</h2>
            <div className="space-y-4">
              {content.points.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${item.color} mr-4`}>
                      <item.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-800">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tehlikeli Gıdalar</h2>
            <p className="text-gray-800 mb-4">Bu gıdaları dostunuzdan kesinlikle uzak tutun!</p>
            <ul className="space-y-3">
              {DANGEROUS_FOODS.map((food, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  {food.icon}
                  <span className="font-semibold text-red-800">{food.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 