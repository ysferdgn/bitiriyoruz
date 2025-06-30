import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPaw } from 'react-icons/fa';

// Kullanıcı giriş (oturum açma) ekranı bileşeni
// Kullanıcıdan e-posta ve şifre alır, giriş işlemini başlatır
const SignIn = () => {
  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();
  // AuthContext'ten login fonksiyonu alınır
  const { login } = useAuth();
  // Form verileri için state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Hata mesajı state'i
  const [error, setError] = useState('');
  // Giriş işlemi yüklenme durumu
  const [loading, setLoading] = useState(false);

  // Form alanı değiştiğinde çalışır
  // e: input değişiklik eventi
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form gönderildiğinde çalışır
  // Giriş işlemini başlatır, başarılıysa ana sayfaya yönlendirir
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Giriş isteği
      const { success, error } = await login(formData.email, formData.password);
      if (success) {
        navigate('/'); // Başarılıysa ana sayfaya yönlendir
      } else {
        setError(error || 'Giriş sırasında bir hata oluştu');
      }
    } catch (error) {
      setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Giriş formu arayüzü
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaPaw className="text-4xl text-[#4CAF50]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hesabınıza giriş yapın
        </h2>
        <p className="mt-2 text-center text-sm text-gray-800">
          veya{' '}
          <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
            yeni bir hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Hata mesajı */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {/* Giriş formu */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 