const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// 1. Configurations
const TOKEN = '8803882724:AAFxQyifk9_snGYfdjiirs69X_XbJfoxtHY';
const SUPABASE_URL = 'https://zffbzdxqpcfxbtcxamjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZmJ6ZHhxcGNmeGJ0Y3hhbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODkzMjksImV4cCI6MjEwMzI2NTMyOX0.EKc0qGKf5Q8jnfn9Zsu5VM-whl4Wd3LV9GmBZG6JmAU';

// ⚠️ ያንተን የቴሌግራም ዩዘርኔም እዚህ ጋር ተካ (ያለ @ ምልክት)
const SUPPORT_USERNAME = 'Belongsjesus'; 

const bot = new TelegramBot(TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();

app.use(express.json());

// Multi-language Text Dictionary
const i18n = {
  am: {
    welcome: "ሰላም {name}! 🚀 ወደ Ethio Aviator በደህና መጡ።",
    play: "🚀 አሁኑኑ ተጫወት",
    deposit: "💳 ብር ገቢ አድርግ",
    withdraw: "🏧 ብር ወጪ አድርግ",
    chat: "💬 እገዛ / Live Chat",
    bet: "ዋጋ አስይዝ (BET)",
    cashout: "ብር አውጣ (CASH OUT)",
    win: "🎉 እንኳን ደስ አለዎት! {amount} ETB አሸንፈዋል!",
    invalid_bet: "እባክዎ ትክክለኛ የብር መጠን ያስገቡ!",
    insufficient: "የእርስዎ ሂሳብ በቂ አይደለም!"
  },
  en: {
    welcome: "Welcome {name}! 🚀 To Ethio Aviator.",
    play: "🚀 Play Now",
    deposit: "💳 Deposit",
    withdraw: "🏧 Withdraw",
    chat: "💬 Live Support",
    bet: "PLACE BET",
    cashout: "CASH OUT",
    win: "🎉 Congratulations! You won {amount} ETB!",
    invalid_bet: "Please enter a valid bet amount!",
    insufficient: "Insufficient balance!"
  },
  om: {
    welcome: "Nagaa {name}! 🚀 Baga gara Ethio Aviator nagaan dhufte.",
    play: "🚀 Amma Taphadhu",
    deposit: "💳 Qarshii Galchii",
    withdraw: "🏧 Qarshii Baasi",
    chat: "💬 Deeggarsa / Chat",
    bet: "QABSIISI (BET)",
    cashout: "QARSHII BAASI",
    win: "🎉 Baga gammaddan! {amount} ETB mootaniirtu!",
    invalid_bet: "Malaqa sirrii galchaa!",
    insufficient: "Hambaan herrega keessanii gahaa miti!"
  },
  ti: {
    welcome: "ሰላም {name}! 🚀 ናብ Ethio Aviator እንቋዕ ብደሓን መጻእኻ።",
    play: "🚀 ሕዚ ተጫወት",
    deposit: "💳 ገንዘብ ኣእትው",
    withdraw: "🏧 ገንዘብ ኣውፅእ",
    chat: "💬 ሓገዝ / Chat",
    bet: "መሓዝ (BET)",
    cashout: "ብር ኣውፅእ (CASH OUT)",
    win: "🎉 እንቋዕ ደስ በለካ! {amount} ETB ተዓዊትካ!",
    invalid_bet: "በጃኹም ትክክለኛ ናይ ብር መጠን ኣእትዉ!",
    insufficient: "ናይ ሒሳብኩም መጠን እኹል ኣይኮነን!"
  }
};

// 2. Mini App Route (With Direct Voice/Live Chat Button & Multi-language)
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
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #0b0e14; color: #fff; text-align: center; margin: 0; padding: 12px; }
        .header { display: flex; justify-content: space-between; align-items: center; background: #182232; padding: 10px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #2a3b55; }
        .balance { color: #22c55e; font-size: 1.05rem; font-weight: bold; }
        .lang-select { background: #0b0e14; color: #fff; border: 1px solid #2a3b55; padding: 4px; border-radius: 6px; font-size: 0.85rem; }
        .support-btn { background: #3b82f6; color: #fff; text-decoration: none; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; }
        .game-card { background: #151f2e; border-radius: 15px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); position: relative; }
        .plane-container { height: 160px; display: flex; align-items: center; justify-content: center; border-bottom: 2px dashed #2a3b55; position: relative; }
        .multiplier { font-size: 3.8rem; font-weight: 900; color: #ef4444; }
        .controls { margin-top: 18px; display: flex; flex-direction: column; gap: 12px; }
        .bet-input { background: #0b0e14; border: 2px solid #2a3b55; color: #fff; padding: 14px; border-radius: 8px; font-size: 1.2rem; text-align: center; font-weight: bold; }
        .btn { background: #22c55e; color: #fff; border: none; padding: 16px; font-size: 1.3rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .btn-cashout { background: #eab308; display: none; }
        .win-banner { display: none; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 10px; border-radius: 8px; margin-top: 10px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <select id="langPicker" class="lang-select" onchange="changeLanguage(this.value)">
          <option value="am">🇪🇹 አማርኛ</option>
          <option value="en">🇬🇧 English</option>
          <option value="om">🇪🇹 Oromoo</option>
          <option value="ti">🇪🇹 ትግርኛ</option>
        </select>

        <a href="https://t.me/${SUPPORT_USERNAME}" target="_blank" class="support-btn" id="chatBtn">💬 Live Chat</a>

        <span id="balance" class="balance">💰 0.00 ETB</span>
      </div>

      <div class="game-card">
        <div class="plane-container">
          <div id="multiplier" class="multiplier">1.00x</div>
        </div>

        <div id="winBanner" class="win-banner"></div>

        <div class="controls">
          <input type="number" id="betAmount" class="bet-input" value="50">
          <button id="betBtn" class="btn" onclick="placeBet()">BET</button>
          <button id="cashoutBtn" class="btn btn-cashout" onclick="cashOut()">CASH OUT</button>
        </div>
      </div>

      <script>
        const dict = ${JSON.stringify(i18n)};
        let currentLang = 'am';

        const tg = window.Telegram.WebApp;
        tg.expand();

        const user = tg.initDataUnsafe?.user || { id: 12345678, first_name: "Guest" };
        
        let balance = 0;
        let currentMultiplier = 1.00;
        let isPlaying = false;
        let gameInterval;
        let crashMultiplier = 1.00;
        let currentBet = 0;

        function updateTexts() {
          const t = dict[currentLang];
          document.getElementById('betBtn').innerText = t.bet;
          document.getElementById('cashoutBtn').innerText = t.cashout;
          document.getElementById('chatBtn').innerText = t.chat;
        }

        function changeLanguage(lang) {
          currentLang = lang;
          updateTexts();
        }

        async function loadUserData() {
          try {
            const res = await fetch('/api/user/' + user.id + '?name=' + encodeURIComponent(user.first_name));
            const data = await res.json();
            balance = parseFloat(data.balance || 0);
            document.getElementById('balance').innerText = '💰 ' + balance.toFixed(2) + ' ETB';
            updateTexts();
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
          const t = dict[currentLang];
          document.getElementById('winBanner').style.display = 'none';

          if (isNaN(currentBet) || currentBet <= 0) return alert(t.invalid_bet);
          if (currentBet > balance) return alert(t.insufficient);

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

          const t = dict[currentLang];
          const winBanner = document.getElementById('winBanner');
          winBanner.innerText = t.win.replace('{amount}', winnings.toFixed(2));
          winBanner.style.display = 'block';

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

// 3. Backend API
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

// 4. Telegram Bot Commands & Multi-Language Start Menu
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'ተጫዋች';

  await supabase.from('users').upsert({ telegram_id: chatId, first_name: userName });

  const langOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇪🇹 አማርኛ", callback_data: "lang_am" },
          { text: "🇬🇧 English", callback_data: "lang_en" }
        ],
        [
          { text: "🇪🇹 Afaan Oromoo", callback_data: "lang_om" },
          { text: "🇪🇹 ትግርኛ", callback_data: "lang_ti" }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "👋 Welcome " + userName + "!\n\nእባክዎ ቋንቋ ይምረጡ / Please select language:", langOptions);
});

// Handle Language Selection Callbacks & Menu Display
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userName = query.from.first_name || 'ተጫዋች';
  const data = query.data;

  if (data.startsWith('lang_')) {
    const langCode = data.split('_')[1];
    const t = i18n[langCode] || i18n.am;

    const mainMenu = {
      reply_markup: {
        inline_keyboard: [
          [{ text: t.play, web_app: { url: "https://ethio-aviator-bot.onrender.com" } }],
          [{ text: t.deposit, callback_data: "deposit_info" }, { text: t.withdraw, callback_data: "withdraw_info" }],
          [{ text: t.chat, url: "https://t.me/" + SUPPORT_USERNAME }]
        ]
      }
    };

    bot.sendMessage(chatId, t.welcome.replace('{name}', userName), mainMenu);
  }
});

// Deposit & Withdrawal Callback Options
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'deposit_info') {
    const depText = "💳 **የገንዘብ ገቢ ማድረጊያ መመሪያ**\n\n1. Telebirr: 0911000000\n2. CBE Bank: 1000000000000\n\n/deposit_ref [Txn Ref] [Amount]\n\nምሳሌ፦ /deposit_ref TXN987654 500";
    bot.sendMessage(chatId, depText);
  } else if (data === 'withdraw_info') {
    const wText = "🏧 **የገንዘብ ወጪ ማድረጊያ መመሪያ**\n\n/withdraw [Amount] [Telebirr/CBE] [Account Number]\n\nምሳሌ፦ /withdraw 200 Telebirr 0912345678";
    bot.sendMessage(chatId, wText);
  }
});

// Transaction Handlers
bot.onText(/\/deposit_ref (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const refNo = match[1];
  const amount = parseFloat(match[2]);

  if (isNaN(amount) || amount <= 0) return bot.sendMessage(chatId, '❌ Invalid Amount!');

  const { data: txn } = await supabase.from('transactions').insert([
    { telegram_id: chatId, type: 'deposit', amount, transaction_ref: refNo, status: 'pending' }
  ]).select().single();

  bot.sendMessage(chatId, "✅ Deposit request sent! Amount: " + amount + " ETB.");

  const adminOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve Deposit", callback_data: "approve_dep_" + txn.id + "_" + chatId + "_" + amount },
          { text: "❌ Reject", callback_data: "reject_dep_" + txn.id + "_" + chatId }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "🚨 **Admin Alert - Deposit Request**\nUser: " + msg.from.first_name + "\nAmount: " + amount + " ETB\nRef: " + refNo, adminOptions);
});

bot.onText(/\/withdraw (.+) (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = parseFloat(match[1]);
  const method = match[2];
  const accountNo = match[3];

  const { data: user } = await supabase.from('users').select('balance').eq('telegram_id', chatId).single();
  const currentBal = parseFloat(user?.balance || 0);

  if (isNaN(amount) || amount <= 0 || amount > currentBal) return bot.sendMessage(chatId, '❌ Insufficient balance!');

  await supabase.from('users').update({ balance: currentBal - amount }).eq('telegram_id', chatId);

  const { data: txn } = await supabase.from('transactions').insert([
    { telegram_id: chatId, type: 'withdraw', amount, payment_method: method + " (" + accountNo + ")", status: 'pending' }
  ]).select().single();

  bot.sendMessage(chatId, "✅ Withdrawal request submitted! Amount: " + amount + " ETB.");

  const adminOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Paid", callback_data: "approve_wtd_" + txn.id + "_" + chatId + "_" + amount },
          { text: "❌ Reject & Refund", callback_data: "reject_wtd_" + txn.id + "_" + chatId + "_" + amount }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "🏧 **Admin Alert - Withdrawal Request**\nUser: " + msg.from.first_name + "\nAmount: " + amount + " ETB\nMethod: " + method + " (" + accountNo + ")", adminOptions);
});

// Admin Callbacks Processing
bot.on('callback_query', async (query) => {
  const data = query.data;

  if (data.startsWith('approve_dep_')) {
    const [, , txnId, uId, amountStr] = data.split('_');
    const amount = parseFloat(amountStr);

    await supabase.from('transactions').update({ status: 'approved' }).eq('id', txnId);
    const { data: user } = await supabase.from('users').select('balance').eq('telegram_id', parseInt(uId)).single();
    await supabase.from('users').update({ balance: parseFloat(user?.balance || 0) + amount }).eq('telegram_id', parseInt(uId));

    bot.answerCallbackQuery(query.id, { text: "✅ Approved!" });
    bot.sendMessage(uId, "🎉 Your deposit of " + amount + " ETB has been approved!");
  } 
  else if (data.startsWith('approve_wtd_')) {
    const [, , txnId, uId, amountStr] = data.split('_');
    await supabase.from('transactions').update({ status: 'approved' }).eq('id', txnId);
    bot.answerCallbackQuery(query.id, { text: "✅ Paid!" });
    bot.sendMessage(uId, "🎉 Your withdrawal of " + amountStr + " ETB has been sent!");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
