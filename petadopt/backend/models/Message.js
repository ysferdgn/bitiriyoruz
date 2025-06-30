const mongoose = require('mongoose');

// Mesaj (Message) şeması: konuşma, gönderen, alıcı, metin, okundu bilgisi
const messageSchema = new mongoose.Schema(
  {
    // Mesajın ait olduğu konuşma (Conversation referansı)
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    // Mesajı gönderen kullanıcı
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Mesajın alıcısı (opsiyonel)
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Mesaj metni
    text: {
      type: String,
      required: true,
    },
    // Okundu bilgisi
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 