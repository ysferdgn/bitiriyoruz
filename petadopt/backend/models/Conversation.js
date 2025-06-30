const mongoose = require('mongoose');

// Konuşma (Conversation) şeması: katılımcılar ve son mesaj
const conversationSchema = new mongoose.Schema(
  {
    // Katılımcı kullanıcılar (User referansları)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    // Son mesaj (Message referansı)
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation; 