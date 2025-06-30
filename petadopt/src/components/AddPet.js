import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPaw, FaTimes, FaUpload, FaStar, FaTrash, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/axios';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import { turkishCities } from '../utils/cities';
import Loading from './common/Loading';

const breedsData = {
    dog: ["Labrador", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog", "Poodle", "Beagle", "Rottweiler", "Dachshund", "Siberian Husky", "Kangal", "Akbaş", "Diğer"],
    cat: ["British Shorthair", "Scottish Fold", "Van Kedisi", "Ankara Kedisi", "Tekir", "Sarman", "Calico", "Diğer"],
    bird: ["Muhabbet Kuşu", "Sultan Papağanı", "Kanarya", "İspinoz", "Diğer"],
    other: ["Hamster", "Tavşan", "Kaplumbağa", "Balık", "Diğer"],
};

Modal.setAppElement('#root');

const AddPet = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [petData, setPetData] = useState({
        name: '',
        age: '',
        type: '',
        breed: '',
        gender: '',
        location: '',
        description: '',
    });
    
    // images: holds File objects for new uploads
    const [images, setImages] = useState([]);
    // imagePreviews: holds URLs for display (remote URLs or local blob URLs)
    const [imagePreviews, setImagePreviews] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            api.get(`/api/pets/${id}`)
                .then(response => {
                    setPetData(response.data);
                    // In edit mode, previews are the existing image URLs
                    setImagePreviews(response.data.images || []);
                    setLoading(false);
                })
                .catch(err => {
                    setError('İlan bilgileri yüklenemedi.');
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData(prevData => {
            const newData = { ...prevData, [name]: value };
            if (name === 'type' && prevData.type !== value) {
                newData.breed = '';
            }
            return newData;
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));

            if (imagePreviews.length + newFiles.length > 5) {
                setError('En fazla 5 fotoğraf yükleyebilirsiniz.');
            return;
            }
            
            setImages(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newFilePreviews]);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const previewToRemove = imagePreviews[indexToRemove];

        // Revoke blob URL to prevent memory leaks for local files
        if (previewToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(previewToRemove);
        }

        // Find which file object corresponds to the blob URL to remove it
        const newImages = images.filter(file => URL.createObjectURL(file) !== previewToRemove);
        setImages(newImages);

        const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        Object.keys(petData).forEach(key => {
            if (key !== 'images') { // Don't append the old images array
                formData.append(key, petData[key]);
            }
        });

        if (isEditMode) {
            // Separate existing URLs from new file previews
            const existingImageUrls = imagePreviews.filter(p => !p.startsWith('blob:'));
            formData.append('images', JSON.stringify(existingImageUrls));
            
            // Append only new files
            images.forEach(file => {
                formData.append('newImages', file);
            });

            try {
                const res = await api.put(`/api/pets/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                navigate(`/pets/${res.data._id}`);
            } catch (err) {
                setError(err.response?.data?.message || 'İlan güncellenirken bir hata oluştu.');
                console.error(err);
            }

        } else {
            // Create mode: append all files from the `images` state
            if (images.length === 0) {
                setError('Lütfen en az bir fotoğraf yükleyin.');
                setLoading(false);
                return;
            }
            images.forEach(file => {
                formData.append('images', file);
            });

            try {
                const res = await api.post('/api/pets', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                navigate(`/pets/${res.data._id}`);
        } catch (err) {
                setError(err.response?.data?.message || 'İlan oluşturulurken bir hata oluştu.');
                console.error(err);
            }
        }
        setLoading(false);
    };
    
    if (loading) return <Loading />;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold">
                    <FaArrowLeft />
                    Geri Dön
                </button>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEditMode ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h1>
                    <p className="text-gray-600 mb-8">{isEditMode ? 'İlan bilgilerini güncelleyerek yeni sahibini bulmasına yardımcı olun.' : 'Yeni bir dosta yuva bulmak için ilanın bilgilerini girin.'}</p>
                    
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fotoğraflar (En fazla 5 adet)</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                                Ana Fotoğraf
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {imagePreviews.length < 5 && (
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <FaUpload className="text-gray-400 text-3xl" />
                                        <span className="mt-2 text-sm text-gray-600 text-center">Fotoğraf Ekle</span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                        
                        {/* Pet Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="İsim" name="name" value={petData.name} onChange={handleChange} required />
                            <Input label="Yaş" name="age" type="number" value={petData.age} onChange={handleChange} required />
                            
                            <Select label="Tür" name="type" value={petData.type} onChange={handleChange} required>
                                <option value="">Tür Seçin</option>
                                <option value="dog">Köpek</option>
                                <option value="cat">Kedi</option>
                                <option value="bird">Kuş</option>
                                <option value="other">Diğer</option>
                            </Select>

                            <Select label="Cins" name="breed" value={petData.breed} onChange={handleChange} disabled={!petData.type} required>
                                <option value="">Cins Seçin</option>
                                {petData.type && breedsData[petData.type] && breedsData[petData.type].map(breed => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                            </Select>
                            
                            <Select label="Cinsiyet" name="gender" value={petData.gender} onChange={handleChange} required>
                                <option value="">Cinsiyet Seçin</option>
                                <option value="Male">Erkek</option>
                                <option value="Female">Dişi</option>
                            </Select>

                            <Select label="Şehir" name="location" value={petData.location} onChange={handleChange} required>
                                <option value="">Şehir Seçin</option>
                                {turkishCities.map(city => <option key={city} value={city}>{city}</option>)}
                            </Select>
                    </div>
                    
                        {/* Description Section */}
                        <div>
                            <label htmlFor="description" className="block text-base font-semibold text-gray-900 mb-1">Açıklama</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="6"
                                value={petData.description}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Evcil hayvanınızın karakteri, alışkanlıkları ve ihtiyaçları hakkında bilgi verin."
                            />
                </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                <FaPaw />
                                {isEditMode ? 'Değişiklikleri Kaydet' : 'İlanı Yayınla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition text-gray-900 placeholder-gray-500 font-medium" />
    </div>
);

const Select = ({ label, children, ...props }) => (
    <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">{label}</label>
        <select {...props} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition bg-white appearance-none text-gray-900 font-medium">
            {children}
        </select>
    </div>
);

export default AddPet;