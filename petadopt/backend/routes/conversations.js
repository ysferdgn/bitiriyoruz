const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   GET /api/conversations
// @desc    Get all conversations for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('--- Konuşmalar endpointi çağrıldı ---');
    console.log('istek yapan kullanıcı:', req.user.id);
    const conversations = await Conversation.find({
      participants: req.user.id
    }).populate('participants', 'name email profilePicture').sort({ updatedAt: -1 });
    console.log('Bulunan konuşma sayısı:', conversations.length);
    if (conversations.length > 0) {
      console.log('İlk konuşma örneği:', JSON.stringify(conversations[0], null, 2));
    }

    // Filter out the logged-in user from participants list for frontend ease
    const formattedConversations = conversations.map(convo => {
      const otherParticipant = convo.participants.find(p => p._id.toString() !== req.user.id);
      return {
        ...convo.toObject(),
        otherParticipant: otherParticipant,
      };
    });

    console.log('Frontend\'e gönderilen formattedConversations:', JSON.stringify(formattedConversations, null, 2));

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/conversations/:conversationId/messages
// @desc    Get all messages for a specific conversation
// @access  Private
router.get('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log('--- Mesajlar endpointi çağrıldı ---');
    console.log('conversationId:', conversationId);
    console.log('istek yapan kullanıcı:', req.user.id);

    // Check if the user is a participant of the conversation
    const conversation = await Conversation.findById(conversationId);
    console.log('bulunan conversation:', conversation);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      console.log('Kullanıcı bu konuşmanın katılımcısı değil veya konuşma bulunamadı.');
      return res.status(403).json({ msg: 'User not authorized for this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .populate({
        path: 'sender',
        select: 'name profilePicture',
      })
      .sort({ createdAt: 1 }); // Show oldest messages first
    console.log('Bulunan mesaj sayısı:', messages.length);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/conversations
// @desc    Create a new conversation or get existing one
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ msg: 'otherUserId is required' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, otherUserId] }
    }).populate('participants', 'name email profilePicture');

    if (conversation) {
      // Return existing conversation
      const otherParticipant = conversation.participants.find(p => p._id.toString() !== req.user.id);
      return res.json({
        ...conversation.toObject(),
        otherParticipant: otherParticipant,
      });
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [req.user.id, otherUserId]
    });

    await conversation.save();

    // Populate participants
    await conversation.populate('participants', 'name email profilePicture');

    const otherParticipant = conversation.participants.find(p => p._id.toString() !== req.user.id);

    res.json({
      ...conversation.toObject(),
      otherParticipant: otherParticipant,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/conversations/:conversationId/messages
// @desc    Send a message in a conversation
// @access  Private
router.post('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ msg: 'Message text is required' });
    }

    // Check if the user is a participant of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ msg: 'User not authorized for this conversation' });
    }

    // Create new message
    const message = new Message({
      conversationId,
      sender: req.user.id,
      text: text.trim()
    });

    await message.save();

    // Update conversation's lastMessage and updatedAt
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate sender info
    await message.populate('sender', 'name profilePicture');

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/conversations/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if the user is the sender of the message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized to delete this message' });
    }

    await message.deleteOne();

    // Optional: Check if this was the last message in the conversation and update Conversation.lastMessage
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === messageId) {
      // Find the new last message (if any)
      const lastMessage = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 });
      conversation.lastMessage = lastMessage ? lastMessage._id : null;
      await conversation.save();
    }

    res.json({ msg: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/conversations/:conversationId
// @desc    Delete an entire conversation and all its messages
// @access  Private
router.delete('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    // Ensure the user is part of the conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ msg: 'User not authorized to delete this conversation' });
    }

    // Delete all messages associated with the conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation itself
    await conversation.deleteOne();

    res.json({ msg: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 