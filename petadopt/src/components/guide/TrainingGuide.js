import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaPaw, FaTools, FaLightbulb, FaCheck, FaTimes, FaArrowLeft, FaDog } from 'react-icons/fa';

const TABS = {
  positive: 'Pozitif Pekiştirme',
  commands: 'Temel Komutlar',
  problems: 'Sorunlu Davranışlar',
};

const TRAINING_CONTENT = {
  positive: {
    title: 'Öğrenmenin En Eğlenceli Yolu',
    icon: <FaLightbulb />,
    color: 'bg-amber-500',
    content: [
      { title: 'Clicker (Tıklayıcı) Eğitimi', desc: 'Doğru davranışı anında işaretlemek için bir tıklayıcı kullanın ve hemen ardından ödül verin. Bu, öğrenmeyi hızlandırır.' },
      { title: 'Ödül Mamanın Gücü', desc: 'Eğitim sırasında kullanacağınız, normal mamasından daha lezzetli ve küçük ödüller hazırlayın.' },
      { title: 'Kısa ve Sık Tekrarlar', desc: 'Eğitim seanslarını 5-10 dakika gibi kısa tutun. Bu, sıkılmasını ve dikkat dağınıklığını önler.' },
    ],
  },
  commands: {
    title: 'Herkesin Bilmesi Gereken Komutlar',
    icon: <FaCheck />,
    color: 'bg-sky-500',
    content: [
      { title: 'Otur (Sit)', desc: 'Ödülü burnundan başına doğru yavaşça hareket ettirin. Poposu yere değdiğinde "Otur" deyin ve ödülü verin.' },
      { title: 'Bekle (Stay)', desc: 'Önce kısa mesafelerde ve sürelerde başlayın. "Bekle" komutundan sonra geri dönüp onu ödüllendirin, çağırmayın.' },
      { title: 'Gel (Come)', desc: 'Neşeli bir ses tonuyla "Gel" deyin. Yanınıza geldiğinde bolca övgü ve ödülle karşılayın.' },
    ],
  },
  problems: {
    title: 'Bu Davranışları Nasıl Çözeriz?',
    icon: <FaTools />,
    color: 'bg-rose-500',
    content: [
      { title: 'Tasma Çekiştirme', desc: 'Çekiştirmeye başladığı an durun. Tasma gevşediğinde yürümeye devam edin. Sabırlı olun, zamanla öğrenecektir.' },
      { title: 'Aşırı Havlama', desc: 'Havlamanın nedenini anlayın (can sıkıntısı, uyarı, heyecan). Dikkatini dağıtacak komutlar veya oyuncaklarla ilgisini başka yöne çekin.' },
      { title: 'Eşya Kemirme', desc: 'Ona çiğneyebileceği bol miktarda oyuncak verin. Yasak bir şeyi kemirirken yakalarsanız, oyuncağıyla değiştirin ve oyuncağıyla oynadığında övün.' },
    ],
  },
};

export default function TrainingGuide() {
  const [activeTab, setActiveTab] = useState('positive');
  const content = TRAINING_CONTENT[activeTab];

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
          <FaDog className="mx-auto text-6xl text-blue-500" />
          <div className="text-center mt-8">
            <FaGraduationCap className="mx-auto text-5xl text-blue-600" />
            <h1 className="mt-4 text-4xl font-bold text-gray-900">Eğitim İpuçları Rehberi</h1>
            <p className="mt-2 text-lg text-gray-500">Sabır, sevgi ve doğru tekniklerle harikalar yaratın.</p>
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
                ${activeTab === key ? `${TRAINING_CONTENT[key].color} text-white shadow-md` : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {TRAINING_CONTENT[key].icon}
              {TABS[key]}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {content.content.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className={`w-full md:w-16 flex-shrink-0 flex items-center justify-center p-4 text-white ${content.color}`}>
                <h3 className="text-3xl font-black">{index + 1}</h3>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
                <p className="text-gray-800 mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 