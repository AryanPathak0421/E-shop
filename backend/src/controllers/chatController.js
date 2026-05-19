const { detectIntent, executeQuery, formatResults } = require('../services/chatService');
const { generateResponse } = require('../utils/geminiHelper');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Detect intent
    const intent = detectIntent(message);

    // Unauthenticated order queries edge case
    if (intent === 'check_orders' && (!req.user || !req.user.id)) {
      return res.json({
        success: true,
        response: 'Please log in to view your orders.',
        intent,
      });
    }

    // Query database based on intent
    let dbResults = '';
    try {
      dbResults = await executeQuery(intent, message, req.user?.id);
    } catch (error) {
      console.error('Database query error:', error);
      dbResults = 'Unable to fetch data from database';
    }

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await generateResponse(message, intent, dbResults);
    } catch (error) {
      console.error('AI generation error:', error);
      aiResponse =
        'I apologize, but I am currently unable to process your request. Please try again later.';
    }

    res.json({
      success: true,
      response: aiResponse,
      intent,
    });
  } catch (error) {
    next(error);
  }
};