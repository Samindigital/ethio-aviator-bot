const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const TOKEN = const TOKEN = '8803882724:AAFxQyifk9_snGYfdjiirs69X_XbJfoxtHY';

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ethio Aviator Bot is running live 24/7!');
});

bot.setMyCommands([
  { command: '/start', description: '🎮 Play Aviator / ጌሙን ጀምር' },
  { command: '/deposit', description: '💳 Deposit Funds / ገንዘብ ገቢ አድርግ' },
  { command: '/withdraw', description: '🏧 Withdraw Winnings / ያሸነፍከውን አውጣ' },
  { command: '/help', description: '🎧 Support & Admin / እርዳታና አድሚን' }
]);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'ተጫዋች';
  const welcomeText = `ሰላም ${userName}! 🚀 ወደ **Ethio Aviator** በደህና መጡ።\n\nከታች ያለውን ሜኑ በመጠቀም መጫወት፣ ገንዘብ ማስገባት ወይም ማውጣት ይችላሉ።`;
  bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
});

bot.onText(/\/deposit/, (msg) => {
  const chatId = msg.chat.id;
  const depositText = `💳 **የገንዘብ ማስገቢያ (Deposit) መመሪያ**\n\nበቴሌብር ወይም በባንክ ገቢ ለማድረግ ከታች ባሉት አካውንቶች ያስተላልፉ፡\n\n• **Telebirr:** 0911****** (ስም)\n• **CBE Bank:** 1000*********\n\nገንዘቡን እንደላኩ የቪኦኤ/Transaction Reference ቁጥር እዚህ ይላኩልን።`;
  bot.sendMessage(chatId, depositText, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpOptions = {
    reply_markup: {
      inline_keyboard: [[{ text: "💬 አድሚኑን ያግኙ", url: "https://t.me/YourAdminUsername" }]]
    }
  };
  bot.sendMessage(chatId, "❓ ማንኛውም ጥያቄ ካለዎት አድሚናችንን ማናገር ይችላሉ፡", helpOptions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
