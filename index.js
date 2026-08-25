const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// 1. Telegram & Supabase Configurations
const TOKEN = '8803882724:AAFxQyifk9_snGYfdjiirs69X_XbJfoxtHY';
const SUPABASE_URL = 'https://zffbzdxqpcfxbtcxamjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZmJ6ZHhxcGNmeGJ0Y3hhbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODkzMjksImV4cCI6MjEwMzI2NTMyOX0.EKc0qGKf5Q8jnfn9Zsu5VM-whl4Wd3LV9GmBZG6JmAU';

const bot = new TelegramBot(TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();

app.use(express.json());

// ⚠️ ያንተ የቴሌግራም ID (አድሚን የማረጋገጫ ጥያቄዎች እንዲደርሱህ)
const ADMIN_CHAT_ID = 698188168; // ቦቱ ውስጥ /start ስትለው ID ህን ካላወቀው በራስ-ሰር ያገኛል

// 2. Mini App Route (Frontend Canvas/Logic with Real Supabase Balance Fetch)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="am">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ethio Aviator Real Game</title>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #0b0e14; color: #fff; text-align: center; margin: 0; padding: 15px; }
        .header { display: flex; justify-content: space-between; background: #182232; padding: 12px 18px; border-radius: 12px; margin-bottom: 15px; font-weight: bold; border: 1px solid #2a3b55; }
        .balance { color: #22c55e; font-size: 1.1rem; }
        .game-card { background: #151f2e; border-radius: 15px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
        .plane-container { height: 170px; display: flex; align-items: center; justify-content: center; border-bottom: 2px dashed #2a3b55; }
        .multiplier { font-size: 3.8rem; font-weight: 900; color: #ef4444; }
        .controls { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .bet-input { background: #0b0e14; border: 2px solid #2a3b55; color: #fff; padding: 14px; border-radius: 8px; font-size: 1.2rem; text-align: center; font-weight: bold; }
        .btn { background: #22c55e; color: #fff; border: none; padding: 16px; font-size: 1.3rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .btn-cashout { background: #eab308; display: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <span id="username">👤 ተጫዋች: ...</span>
        <span id="balance" class="balance">💰 0.00 ETB</span>
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
        const tg = window.Telegram.WebApp;
        tg.expand();

        const user = tg.initDataUnsafe?.user || { id: 12345678, first_name: "Guest" };
        document.getElementById('username').innerText = '👤 ' + user.first_name;

        let balance = 0;
        let currentMultiplier = 1.00;
        let isPlaying = false;
        let gameInterval;
        let crashMultiplier = 1.00;
        let currentBet = 0;

        // Fetch Balance from API
        async function loadUserData() {
          try {
            const res = await fetch('/api/user/' + user.id + '?name=' + encodeURIComponent(user.first_name));
            const data = await res.json();
            balance = parseFloat(data.balance);
            document.getElementById('balance').innerText = '💰 ' + balance.toFixed(2) + ' ETB';
          } catch(e) {
            console.error(e);
          }
        }
        loadUserData();

        async function updateDatabaseBalance(newBal) {
          balance = newBal;
          document.getElementById('balance').innerText = '💰 ' + balance.toFixed(2) + ' ETB';
          await fetch('/api/user/update-balance', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ telegram_id: user.id, balance: newBal })
          });
        }

        function placeBet() {
          const betInput = document.getElementById('betAmount');
          currentBet = parseFloat(betInput.value);

          if (isNaN(currentBet) || currentBet <= 0) return alert('እባክዎ ትክክለኛ የብር መጠን ያስገቡ!');
          if (currentBet > balance) return alert('የእርስዎ ሂሳብ በቂ አይደለም! እባክዎ አስቀድመው Deposit ያድርጉ።');

          updateDatabaseBalance(balance - currentBet);

          isPlaying = true;
          currentMultiplier = 1.00;
          crashMultiplier = (Math.random() * 3.5 + 1.1).toFixed(2);

          document.getElementById('betBtn').style.display = 'none';
          document.getElementById('cashoutBtn').style.display = 'block';
          document.getElementById('multiplier').style.color = '#ef4444';

          gameInterval = setInterval(() => {
            currentMultiplier += 0.05;
            document.getElementById('multiplier').innerText = currentMultiplier.toFixed(2) + 'x';

            if (currentMultiplier >= parseFloat(crashMultiplier)) {
              endGame(false);
            }
          }, 140);
        }

        function cashOut() {
          if (!isPlaying) return;
          const winnings = currentBet * currentMultiplier;
          updateDatabaseBalance(balance + winnings);
          alert('🎉 እንኳን ደስ አለዎት! ' + winnings.toFixed(2) + ' ETB አሸንፈዋል!');
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

// 3. Backend API Endpoints for Database Operations
app.get('/api/user/:id', async (req, res) => {
  const telegram_id = parseInt(req.params.id);
  const first_name = req.query.name || 'User';

  let { data: user } = await supabase.from('users').select('*').eq('telegram_id', telegram_id).single();

  if (!user) {
    const { data: newUser } = await supabase.from('users').insert([{ telegram_id, first_name, balance: 0 }]).select().single();
    user = newUser;
  }
  res.json(user || { balance: 0 });
});

app.post('/api/user/update-balance', async (req, res) => {
  const { telegram_id, balance } = req.body;
  await supabase.from('users').update({ balance }).eq('telegram_id', telegram_id);
  res.json({ success: true });
});

// 4. Telegram Bot Commands & Interaction
bot.setMyCommands([
  { command: '/start', description: '🎮 Play Aviator / ጌሙን ጀምር' },
  { command: '/deposit', description: '💳 Deposit Funds / ገንዘብ ገቢ አድርግ' },
  { command: '/withdraw', description: '🏧 Withdraw Winnings / ያሸነፉትን አውጡ' },
  { command: '/balance', description: '💰 My Balance / ሂሳቤን እወቅ' }
]);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'ተጫዋች';

  // Ensure user exists in Supabase
  await supabase.from('users').upsert({ telegram_id: chatId, first_name: userName });

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Play Ethio Aviator Now", web_app: { url: "https://ethio-aviator-bot.onrender.com" } }],
        [{ text: "💳 Deposit (ብር ገቢ አድርግ)", callback_data: "deposit_info" }, { text: "🏧 Withdraw (ወጪ አድርግ)", callback_data: "withdraw_info" }]
      ]
    }
  };

  bot.sendMessage(chatId, `ሰላም ${userName}! 🚀 ወደ **Ethio Aviator Game** በደህና መጡ።\n\nከታች ያለውን አዝራር በመጫን ይጫወቱ ወይም ብር ገቢ አድርገው ይጀምሩ!`, { parse_mode: 'Markdown', ...options });
});

// Deposit Info & Instruction
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'deposit_info') {
    bot.sendMessage(chatId, `💳 **ገንዘብ ገቢ ማድረጊያ (Deposit Instructions)**\n\n1. በሚከተሉት አካውንቶች የፈለጉትን መጠን ብር ይላኩ፦\n   • **Telebirr:** 0911000000 (Ethio Aviator)\n   • **CBE Bank:** 1000000000000 (Ethio Aviator)\n\n2. ብር ሲልኩ ያገኙትን **የቀጣሪ ወይም ትራንዛክሽን ቁጥር (Txn ID/Ref)** በሚከተለው መልኩ ይላኩልን፦\n\n`/deposit_ref [የTxn ቁጥር] [የብር መጠን]`\n\n*ምሳሌ:* `/deposit_ref TXN987654 500``);
  }
});

// Deposit Reference Receiver (Sends directly to Admin for Approval)
bot.onText(/\/deposit_ref (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const refNo = match[1];
  const amount = parseFloat(match[2]);

  if (isNaN(amount) || amount <= 0) {
    return bot.sendMessage(chatId, '❌ እባክዎ ትክክለኛ የብር መጠን ያስገቡ!');
  }

  // Insert Pending Transaction into Supabase
  const { data: txn } = await supabase.from('transactions').insert([
    { telegram_id: chatId, type: 'deposit', amount, transaction_ref: refNo, status: 'pending' }
  ]).select().single();

  bot.sendMessage(chatId, `✅ የገንዘብ ገቢ ጥያቄዎ ደርሶናል!\n\n• **መጠን:** ${amount} ETB\n• **Ref No:** ${refNo}\n\nአድሚኑ አረጋግጦ በ 5 ደቂቃ ውስጥ ሂሳብዎ ላይ ይጨምርልዎታል።`);

  // Send Alert to Admin Chat with Approve/Reject Buttons
  const adminOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve_${txn.id}_${chatId}_${amount}` },
          { text: "❌ Reject", callback_data: `reject_${txn.id}_${chatId}` }
        ]
      ]
    }
  };

  bot.sendMessage(msg.chat.id, `🚨 **አዲስ የ Deposit ጥያቄ!**\n\n• **ተጫዋች:** ${msg.from.first_name} (ID: ${chatId})\n• **መጠን:** ${amount} ETB\n• **Txn Ref:** ${refNo}`, adminOptions);
});

// Admin Approval/Rejection Action Handler
bot.on('callback_query', async (query) => {
  const data = query.data;

  if (data.startsWith('approve_')) {
    const [_, txnId, userId, amountStr] = data.split('_');
    const amount = parseFloat(amountStr);
    const uId = parseInt(userId);

    // Update Transaction Status
    await supabase.from('transactions').update({ status: 'approved' }).eq('id', txnId);

    // Add Balance to User in Supabase
    const { data: user } = await supabase.from('users').select('balance').eq('telegram_id', uId).single();
    const newBal = (parseFloat(user?.balance || 0) + amount);
    await supabase.from('users').update({ balance: newBal }).eq('telegram_id', uId);

    bot.answerCallbackQuery(query.id, { text: "✅ Deposit Approved!" });
    bot.sendMessage(uId, `🎉 **እንኳን ደስ አለዎት!**\n\nየገባው ${amount} ETB ሂሳብዎ ላይ ተጨምሯል። አሁን መጫወት ይችላሉ!`);
    bot.editMessageText(`✅ **APPROVED!** (${amount} ETB added to User ID: ${uId})`, { chat_id: query.message.chat.id, message_id: query.message.message_id });
  } 
  else if (data.startsWith('reject_')) {
    const [_, txnId, userId] = data.split('_');
    await supabase.from('transactions').update({ status: 'rejected' }).eq('id', txnId);

    bot.answerCallbackQuery(query.id, { text: "❌ Deposit Rejected" });
    bot.sendMessage(parseInt(userId), `❌ **የገንዘብ ጥያቄዎ አልፀደቀም!**\n\nየላኩት ትራንዛክሽን ቁጥር አልተገኘም ወይም ስህተት አለበት። እባክዎ አድሚኑን ያናግሩ።`);
    bot.editMessageText(`❌ **REJECTED!** (User ID: ${userId})`, { chat_id: query.message.chat.id, message_id: query.message.message_id });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
