import React, { useState } from 'react';
import { FaFeather, FaHome, FaMusic, FaHeart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'talkers', label: 'Konuşkanlar', icon: <FaMusic /> },
  { key: 'apartment', label: 'Apartman Dostları', icon: <FaHome /> },
  { key: 'colorful', label: 'Rengarenk Tüyler', icon: <FaHeart /> },
];

const BREEDS = {
  talkers: [
    {
      name: 'Muhabbet Kuşu',
      img: 'https://www.webtekno.com/images/editor/default/0003/43/7e0ff0e771b30f4ccece1f299a6e1910b0318fc4.jpeg',
      desc: '🦜 Cıvıl cıvıl, "merhaba dünya!" demeye hazır, küçük ama sesi büyük.',
    },
    {
      name: 'Jako Papağanı',
      img: 'http://www.atasehirveteriner.com/upload/images/jako-papagan.jpg',
      desc: '🎓 Akıllı ve yetenekli, kelime haznesiyle sizi şaşırtabilir.',
    },
    {
      name: 'Sultan Papağanı',
      img: 'https://papaganlar.org/wp-content/uploads/2023/01/sultan-papagani-fiyatlari-2022-768x1152.jpg',
      desc: '👑 Islıklarıyla ünlü, omuzunuzda şarkı söylemeye bayılır.',
    },
    {
      name: 'Amazon Papağanı',
      img: 'https://i.pinimg.com/originals/26/a2/dd/26a2dd496b014e120e2691f73dd13d60.jpg',
      desc: '🎤 Operacı gibi sesli, enerjik ve sosyal bir arkadaş.',
    },
  ],
  apartment: [
    {
      name: 'Kanarya',
      img: 'http://blog.kurumama.com/resimleri/2017/11/kanarya.jpg',
      desc: '🎶 Küçük kafesinde mutlu, tatlı ötüşüyle evi şenlendirir.',
    },
    {
      name: 'Zebra İspinozu',
      img: 'https://i.ytimg.com/vi/wsEem4KSsTA/hqdefault.jpg',
      desc: '🦓 Minik ve hareketli, küçük alanlarda bile enerjisini atar.',
    },
    {
      name: 'Cennet Papağanı',
      img: 'https://www.evcilhayvan.market/wp-content/uploads/2018/06/cennet-papagani-1-640x425.jpg',
      desc: '❤️ Eşine sadık, kompakt ve sevgi dolu bir apartman kuşu.',
    },
    {
      name: 'Forpus Papağanı',
      img: 'https://papaganlar.org/wp-content/uploads/2020/12/disi-forpus-papagani.jpg',
      desc: '🐦 "Cep papağanı" olarak bilinir, küçük ama karakteri büyük.',
    },
  ],
  colorful: [
    {
      name: 'Macaw Papağanı',
      img: 'http://2.bp.blogspot.com/-XQXd55omZF0/T9GsCJXqYjI/AAAAAAAAB_Q/HKcTwuAeR0o/s1600/Macaw+Parrots+image.jpg',
      desc: '🌈 Gökkuşağı gibi renkli, tropik bir güzellik abidesi.',
    },
    {
      name: 'Gouldian Finch',
      img: 'http://hdwpro.com/wp-content/uploads/2020/07/Best-Gouldian-Finch.jpg',
      desc: "🎨 Yürüyen bir sanat eseri, en renkli ispinoz türlerinden.",
    },
    {
      name: 'Lori Papağanı',
      img: 'https://www.petihtiyac.com/Data/EditorFiles/lori-papagani-2.jpg',
      desc: '🖌️ Fırça gibi dili ve canlı renkleriyle dikkat çeker.',
    },
    {
      name: 'Eclectus Papağanı',
      img: 'https://www.philipsanimalgarden.com/wp-content/uploads/2016/02/eclectus-parrot.jpg',
      desc: '💚 Dişisi kırmızı, erkeği yeşil; doğanın renk harikası.',
    },
  ],
};

const BIRD_QUOTES = [
  '"Kuşlar, özgürlüğün kanat çırpan halidir."',
  '"Bir kuşun cıvıltısı, en güzel sabah alarmıdır."',
  '"Tüylü bir dost, kalbinize neşeyle konar."',
  '"Hayata kuş bakışı bakmak için bir kuş sahiplenin."',
  '"En güzel şarkılar, küçük bir kalpten dökülür."',
];

function getRandomQuote() {
  return BIRD_QUOTES[Math.floor(Math.random() * BIRD_QUOTES.length)];
}

export default function BirdBreedGuide() {
  const [activeTab, setActiveTab] = useState('talkers');
  const favIndex = Math.floor(Math.random() * BREEDS[activeTab].length);
  const quote = getRandomQuote();

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-2 font-[Fredoka] relative overflow-hidden">
      <Link 
        to="/pet-guide" 
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all duration-200"
      >
        <FaArrowLeft className="text-teal-500" />
        <span className="text-gray-700 font-semibold">Geri Dön</span>
      </Link>

      <div className="max-w-3xl mx-auto rounded-xl shadow-lg bg-white/90 p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <FaFeather className="text-cyan-500 text-7xl drop-shadow-lg mb-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
            Hangi kuş sana göre? Hadi cıvıldayalım! <span className="inline-block">🐦</span>
          </h1>
          <p className="text-lg text-gray-800 text-center max-w-xl">
            Bu rehber tüy kadar hafif ve bir o kadar da bilgilendirici!
          </p>
        </div>
        
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors text-lg shadow-sm border flex items-center gap-2
                ${activeTab === tab.key ? 'bg-cyan-500 text-white' : 'bg-blue-50 text-gray-700 border-cyan-500'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        <div className="bg-cyan-50 border-l-4 border-cyan-500 rounded-md px-6 py-4 mb-8 flex items-center gap-3 shadow-sm">
          <FaFeather className="text-cyan-600 text-2xl" />
          <span className="text-cyan-700 font-semibold italic">Kuş Diliyle:</span>
          <span className="text-gray-700">{quote}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {BREEDS[activeTab].map((breed, i) => (
            <div
              key={breed.name}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative"
            >
              {i === favIndex && (
                <span className="absolute -top-3 right-3 bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow flex items-center gap-1 font-bold">
                  <FaStar className="text-white" /> Cici Kuş!
                </span>
              )}
              <img
                src={breed.img}
                alt={breed.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-cyan-400 mb-3 shadow"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-1">
                {breed.name}
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