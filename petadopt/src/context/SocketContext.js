import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth(); // Kimliği doğrulanmış kullanıcıyı al

  useEffect(() => {
    // Sadece kimliği doğrulanmış kullanıcılar için socket bağlantısı kur
    if (user) {
      // Backend sunucu adresimiz
      const newSocket = io("http://localhost:5000", {
        query: { userId: user._id } // Backend'e hangi kullanıcının bağlandığını bildir
      });

      setSocket(newSocket);

      // Bileşen kaldırıldığında bağlantıyı temizle
      return () => newSocket.close();
    } else {
      // Kullanıcı oturumu kapattıysa veya yoksa, mevcut socket bağlantısını kes
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]); // Bu effect, user değiştiğinde (giriş/çıkış yapıldığında) tekrar çalışır

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}; 