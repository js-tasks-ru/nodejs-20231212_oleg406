const Message = require('../models/Message');
const messageMapper = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({ chat: ctx.user.id });
  
  ctx.body = { messages: messages.map(messageMapper) };
};
