import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

const breeds = {
    Köpek: [
        "Pomeranian", "Chihuahua", "Yorkshire Terrier", "Maltese", "Shih Tzu", "Pekingese", "Toy Poodle",
        "Cavalier King Charles", "Cocker Spaniel", "Beagle", "Bulldog", "French Bulldog", "Basenji",
        "Basset Hound", "Border Collie", "Shiba Inu", "Labrador Retriever", "Golden Retriever", "German Shepherd",
        "Siberian Husky", "Boxer", "Doberman", "Rottweiler", "Dalmatian", "Kangal", "Belgian Malinois",
        "Anatolian Shepherd", "Great Pyrenees", "Shetland Sheepdog", "Australian Shepherd", "Alaskan Malamute",
        "Akita Inu", "American Pit Bull Terrier", "Whippet", "Greyhound", "Papillon", "Boston Terrier",
        "Jack Russell Terrier", "Cane Corso", "Samoyed"
    ],
    Kedi: [
        "British Shorthair", "Scottish Fold", "Persian (İran Kedisi)", "Maine Coon", "Turkish Van (Van Kedisi)",
        "Turkish Angora (Ankara Kedisi)", "Siamese", "Ragdoll", "American Shorthair", "Bengal", "Sphynx (Tüysüz Kedi)",
        "Norwegian Forest Cat", "Russian Blue", "Burmese", "Chartreux", "Abyssinian", "Exotic Shorthair",
        "Oriental Shorthair", "Devon Rex", "Cornish Rex", "Manx", "Selkirk Rex", "Himalayan", "Balinese",
        "Savannah", "Toyger", "Munchkin", "LaPerm", "Tonkinese", "Turkish Semi-longhair", "Egyptian Mau",
        "Japanese Bobtail", "Somali", "Singapura", "American Curl", "Havana Brown", "Kurilian Bobtail",
        "Lykoi (Kurt Kedi)", "Ragamuffin", "Pixie-bob"
    ],
    Kuş: [
        "Muhabbet Kuşu", "Sultan Papağanı (Cockatiel)", "Cennet Papağanı (Lovebird)", "Jako Papağanı (African Grey)",
        "Amazon Papağanı", "Macaw Papağanı", "Kanarya", "Zebra İspinozu (Zebra Finch)", "Bengal İspinozu",
        "Hint Bülbülü", "Paraket (Budgerigar türü)", "Lori Papağanı", "Kakadu (Cockatoo)", "Senegal Papağanı",
        "Konur Papağanı (Conure)", "Mavi Papağan", "Yeşil Papağan", "Goldfinch (Saka Kuşu)", "İspinoz (Finch)",
        "Eclectus Papağanı", "Gülbaşlı Muhabbet Kuşu", "Büyük Alexander Papağanı", "Turuncu Suratlı Kanarya",
        "Maskeli Lovebird", "Java İspinozu", "Sarı Kanarya", "Mavi İspinoz", "Kakariki", "Kakadu Rose",
        "Keşiş Papağanı (Monk Parakeet)"
    ]
};

const AddPet = () => {
    const [petData, setPetData] = useState({
        name: '',
        age: '',
        type: '',
        breed: '',
        gender: '',
        city: '',
        description: '',
    });
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData(prevData => {
            const newData = { ...prevData, [name]: value };
            if (name === 'type') {
                newData.breed = '';
            }
            return newData;
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        Object.keys(petData).forEach(key => {
            formData.append(key, petData[key]);
        });
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            await api.post('/pets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/my-listings');
        } catch (err) {
            setError(err.response?.data?.message || 'Bir hata oluştu.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Yeni İlan Ekle</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">İsim</label>
                    <input type="text" name="name" id="name" value={petData.name} onChange={handleChange} placeholder="İsim" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Tür</label>
                    <select name="type" id="type" value={petData.type} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="" disabled>Tür Seçin</option>
                        <option value="Kedi">Kedi</option>
                        <option value="Köpek">Köpek</option>
                        <option value="Kuş">Kuş</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="breed" className="block text-gray-700 text-sm font-bold mb-2">Cins</label>
                    {petData.type && breeds[petData.type] ? (
                        <select name="breed" id="breed" value={petData.breed} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="" disabled>Cins Seçin</option>
                            {breeds[petData.type].map((breed) => (
                                <option key={breed} value={breed}>{breed}</option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" name="breed" id="breed" value={petData.breed} onChange={handleChange} placeholder="Cins" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Yaş</label>
                        <input type="number" name="age" id="age" value={petData.age} onChange={handleChange} placeholder="Yaş" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Cinsiyet</label>
                        <select name="gender" id="gender" value={petData.gender} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="" disabled>Cinsiyet Seçin</option>
                            <option value="Dişi">Dişi</option>
                            <option value="Erkek">Erkek</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">Şehir</label>
                    <input type="text" name="city" id="city" value={petData.city} onChange={handleChange} placeholder="Şehir" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Açıklama</label>
                    <textarea name="description" id="description" value={petData.description} onChange={handleChange} placeholder="Evcil hayvanınız hakkında bilgi verin..." required rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">Resimler</label>
                    <input type="file" name="images" id="images" onChange={handleImageChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
                        {loading ? 'Ekleniyor...' : 'İlanı Oluştur'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <FaArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                        Geri
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPet;
