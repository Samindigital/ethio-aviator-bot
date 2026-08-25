const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const TOKEN = '8803882724:AAFxQyifk9_snGYfdjiirs69X_XbJfoxtHY';
const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

app.use(express.json());

// የ Aviator ጌም ሙሉ የውበት እና የተግባር (UI & Logic) ኮድ
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="am">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ethio Aviator Game</title>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0e14; color: #fff; text-align: center; margin: 0; padding: 15px; }
        .header { display: flex; justify-content: space-between; background: #182232; padding: 10px 15px; border-radius: 10px; margin-bottom: 15px; font-weight: bold; }
        .balance { color: #22c55e; }
        .game-card { background: #151f2e; border-radius: 15px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); position: relative; overflow: hidden; }
        .plane-container { height: 160px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 2px dashed #2a3b55; }
        .multiplier { font-size: 3.5rem; font-weight: 900; color: #ef4444; text-shadow: 0 0 15px rgba(239,68,68,0.4); }
        .controls { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
        .bet-input { background: #0b0e14; border: 2px solid #2a3b55; color: #fff; padding: 12px; border-radius: 8px; font-size: 1.1rem; text-align: center; font-weight: bold; }
        .btn { background: #22c55e; color: #fff; border: none; padding: 14px; font-size: 1.2rem; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn:active { transform: scale(0.98); }
        .btn-cashout { background: #eab308; display: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <span>💰 ሂሳብ:</span>
        <span id="balance" class="balance">1,000 ETB</span>
      </div>

      <div class="game-card">
        <div class="plane-container">
          <div id="multiplier" class="multiplier">1.00x</div>
        </div>

        <div class="controls">
          <input type="number" id="betAmount" class="bet-input" value="50" placeholder="የውርርድ መጠን (ETB)">
          <button id="betBtn" class="btn" onclick="placeBet()">ዋጋ አስይዝ (BET)</button>
          <button id="cashoutBtn" class="btn btn-cashout" onclick="cashOut()">ብር አውጣ (CASH OUT)</button>
        </div>
      </div>

      <script>
        let balance = 1000;
        let currentMultiplier = 1.00;
        let isPlaying = false;
        let gameInterval;
        let crashMultiplier = 1.00;
        let currentBet = 0;

        const tg = window.Telegram.WebApp;
        tg.expand();

        function updateBalance() {
          document.getElementById('balance').innerText = balance.toLocaleString() + ' ETB';
        }

        function placeBet() {
          const betInput = document.getElementById('betAmount');
          currentBet = parseFloat(betInput.value);

          if (isNaN(currentBet) || currentBet <= 0) {
            alert('እባክዎ ትክክለኛ የብር መጠን ያስገቡ!');
            return;
          }
          if (currentBet > balance) {
            alert('የእርስዎ ሂሳብ በቂ አይደለም!');
            return;
          }

          balance -= currentBet;
          updateBalance();

          isPlaying = true;
          currentMultiplier = 1.00;
          crashMultiplier = (Math.random() * 3 + 1.2).toFixed(2); // ከ 1.2x እስከ 4.2x መካከል ይበተናል

          document.getElementById('betBtn').style.display = 'none';
          document.getElementById('cashoutBtn').style.display = 'block';
          document.getElementById('multiplier').style.color = '#ef4444';

          gameInterval = setInterval(() => {
            currentMultiplier += 0.04;
            document.getElementById('multiplier').innerText = currentMultiplier.toFixed(2) + 'x';

            if (currentMultiplier >= parseFloat(crashMultiplier)) {
              endGame(false);
            }
          }, 150);
        }

        function cashOut() {
          if (!isPlaying) return;
          const winnings = Math.floor(currentBet * currentMultiplier);
          balance += winnings;
          updateBalance();
          alert('🎉 እንኳን ደስ አለዎት! ' + winnings + ' ETB አሸንፈዋል!');
          endGame(true);
        }

        function endGame(won) {
          clearInterval(gameInterval);
          isPlaying = false;

          if (!won) {
            document.getElementById('multiplier').innerText = "FLEW AWAY! 💥";
            document.getElementById('multiplier').style.color = "#dc2626";
          }

          document.getElementById('betBtn').style.display = 'block';
          document.getElementById('cashoutBtn').style.display = 'none';
        }
      </script>
    </body>
    </html>
  `);
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
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Play Ethio Aviator Now", web_app: { url: "https://ethio-aviator-bot.onrender.com" } }]
      ]
    }
  };

  bot.sendMessage(chatId, `ሰላም ${userName}! 🚀 ወደ **Ethio Aviator** በደህና መጡ።\n\nከታች ያለውን አዝራር በመጫወት አሸናፊ ይሁኑ!`, { parse_mode: 'Markdown', ...options });
});

bot.onText(/\/deposit/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `💳 **የገንዘብ ማስገቢያ (Deposit)**\n\n• **Telebirr:** 0911******\n• **CBE:** 1000*********`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
