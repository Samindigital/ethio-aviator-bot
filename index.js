const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// 1. Configurations
const TOKEN = '8803882724:AAFxQyifk9_snGYfdjiirs69X_XbJfoxtHY';
const SUPABASE_URL = 'https://zffbzdxqpcfxbtcxamjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZmJ6ZHhxcGNmeGJ0Y3hhbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODkzMjksImV4cCI6MjEwMzI2NTMyOX0.EKc0qGKf5Q8jnfn9Zsu5VM-whl4Wd3LV9GmBZG6JmAU';

const SUPPORT_USERNAME = 'EthioAviatorSupport'; 

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
    chat: "💬 Live Support (እገዛ)",
    bet: "ዋጋ አስይዝ (BET)",
    cashout: "ብር አውጣ (CASH OUT)",
    win: "🎉 እንኳን ደስ አለዎት! {amount} ETB አሸንፈዋል!",
    invalid_bet: "⚠️ እባክዎ ትክክለኛ የብር መጠን ያስገቡ!",
    insufficient: "⚠️ የእርስዎ ሂሳብ በቂ አይደለም! እባክዎ Deposit ያድርጉ።",
    flew_away: "💥 FLEW AWAY!"
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
    invalid_bet: "⚠️ Please enter a valid bet amount!",
    insufficient: "⚠️ Insufficient balance! Please deposit.",
    flew_away: "💥 FLEW AWAY!"
  },
  om: {
    welcome: "Nagaa {name}! 🚀 Baga gara Ethio Aviator nagaan dhufte.",
    play: "🚀 Amma Taphadhu",
    deposit: "💳 Qarshii Galchii",
    withdraw: "🏧 Qarshii Baasi",
    chat: "💬 Deeggarsa Live",
    bet: "QABSIISI (BET)",
    cashout: "QARSHII BAASI",
    win: "🎉 Baga gammaddan! {amount} ETB mootaniirtu!",
    invalid_bet: "⚠️ Malaqa sirrii galchaa!",
    insufficient: "⚠️ Hambaan herrega keessanii gahaa miti!",
    flew_away: "💥 FLEW AWAY!"
  },
  ti: {
    welcome: "ሰላም {name}! 🚀 ናብ Ethio Aviator እንቋዕ ብደሓን መጻእኻ።",
    play: "🚀 ሕዚ ተጫወት",
    deposit: "💳 ገንዘብ ኣእትው",
    withdraw: "🏧 ገንዘብ ኣውፅእ",
    chat: "💬 Live Support",
    bet: "መሓዝ (BET)",
    cashout: "ብር ኣውፅእ (CASH OUT)",
    win: "🎉 እንቋዕ ደስ በለካ! {amount} ETB ተዓዊትካ!",
    invalid_bet: "⚠️ በጃኹም ትክክለኛ ናይ ብር መጠን ኣእትዉ!",
    insufficient: "⚠️ ናይ ሒሳብኩም መጠን እኹል ኣይኮነን!",
    flew_away: "💥 FLEW AWAY!"
  }
};

// 2. Mini App Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="am">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ethio Aviator Pro</title>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: #0b0e14; color: #fff; text-align: center; padding: 12px; display: flex; flex-direction: column; min-height: 100vh; justify-content: space-between; }
        
        /* Header */
        .header { display: flex; justify-content: space-between; align-items: center; background: #182232; padding: 10px 14px; border-radius: 12px; border: 1px solid #2a3b55; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .balance { color: #22c55e; font-size: 1.1rem; font-weight: 800; }
        .lang-select { background: #0b0e14; color: #fff; border: 1px solid #2a3b55; padding: 5px 8px; border-radius: 8px; font-size: 0.85rem; outline: none; }
        
        /* Game Arena */
        .game-card { background: #151f2e; border-radius: 16px; padding: 20px 15px; margin-top: 10px; border: 1px solid #233248; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
        .plane-container { height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 2px dashed #2a3b55; position: relative; background: radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(15,23,42,0) 70%); border-radius: 12px; }
        
        /* Animated Red Plane */
        .animated-plane { position: absolute; bottom: 20px; left: 20px; font-size: 2.8rem; transform: rotate(15deg); transition: all 0.1s linear; filter: drop-shadow(0px 0px 10px rgba(239, 68, 68, 0.8)); display: none; }
        
        .multiplier { font-size: 3.8rem; font-weight: 900; color: #ef4444; text-shadow: 0 0 20px rgba(239, 68, 68, 0.4); z-index: 2; }
        
        /* Banners & Messages */
        .msg-banner { display: none; padding: 10px; border-radius: 8px; margin-top: 12px; font-weight: bold; font-size: 0.95rem; text-align: center; animation: fadeIn 0.3s ease-in-out; }
        .msg-success { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #22c55e; }
        .msg-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #ef4444; }

        /* Controls & Quick Bets */
        .controls { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
        .bet-input { background: #0b0e14; border: 2px solid #2a3b55; color: #fff; padding: 12px; border-radius: 10px; font-size: 1.3rem; text-align: center; font-weight: bold; width: 100%; outline: none; }
        .bet-input:focus { border-color: #3b82f6; }
        
        .quick-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 5px; }
        .chip { background: #1e293b; border: 1px solid #334155; color: #cbd5e1; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .chip:active { background: #3b82f6; color: #fff; transform: scale(0.95); }

        .btn { background: #22c55e; color: #fff; border: none; padding: 16px; font-size: 1.3rem; border-radius: 10px; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); transition: all 0.2s; }
        .btn-cashout { background: #eab308; box-shadow: 0 4px 15px rgba(234, 179, 8, 0.3); display: none; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Bottom Live Support */
        .footer-support { margin-top: auto; padding-top: 15px; }
        .support-btn { background: #1e293b; border: 1px solid #3b82f6; color: #60a5fa; text-decoration: none; padding: 12px; border-radius: 10px; font-size: 0.95rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      </style>
    </head>
    <body>

      <!-- Top Bar -->
      <div class="header">
        <select id="langPicker" class="lang-select" onchange="changeLanguage(this.value)">
          <option value="am">🇪🇹 አማርኛ</option>
          <option value="en">🇬🇧 English</option>
          <option value="om">🇪🇹 Oromoo</option>
          <option value="ti">🇪🇹 ትግርኛ</option>
        </select>
        <span id="balance" class="balance">💰 0.00 ETB</span>
      </div>

      <!-- Main Game Arena -->
      <div class="game-card">
        <div class="plane-container" id="planeArena">
          <div id="plane" class="animated-plane">✈️</div>
          <div id="multiplier" class="multiplier">1.00x</div>
        </div>

        <div id="msgBanner" class="msg-banner"></div>

        <div class="controls">
          <input type="number" id="betAmount" class="bet-input" value="50" placeholder="የውርርድ መጠን">
          
          <!-- Quick Bet Amount Chips -->
          <div class="quick-chips">
            <span class="chip" onclick="setBet(10)">10</span>
            <span class="chip" onclick="setBet(20)">20</span>
            <span class="chip" onclick="setBet(30)">30</span>
            <span class="chip" onclick="setBet(40)">40</span>
            <span class="chip" onclick="setBet(50)">50</span>
            <span class="chip" onclick="setBet(100)">100</span>
            <span class="chip" onclick="setBet(200)">200</span>
            <span class="chip" onclick="setBet(500)">500</span>
            <span class="chip" onclick="setBet(1000)">1000</span>
            <span class="chip" onclick="setBet(2000)">2000</span>
            <span class="chip" onclick="setBet(3000)">3000</span>
            <span class="chip" onclick="setBet(5000)">5000</span>
            <span class="chip" onclick="setBet(10000)">10000</span>
          </div>

          <button id="betBtn" class="btn" onclick="placeBet()">BET</button>
          <button id="cashoutBtn" class="btn btn-cashout" onclick="cashOut()">CASH OUT</button>
        </div>
      </div>

      <!-- Footer Live Support -->
      <div class="footer-support">
        <a href="https://t.me/${SUPPORT_USERNAME}" target="_blank" class="support-btn" id="chatBtn">
          💬 Live Support (እገዛ)
        </a>
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

        // Sound Effects (Web Audio API Synthesizer)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playSound(type) {
          try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'fly') {
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(150, audioCtx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
              gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'win') {
              osc.type = 'sine';
              osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
              osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
              osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
              gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            } else if (type === 'crash') {
              osc.type = 'square';
              osc.frequency.setValueAtTime(120, audioCtx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.3);
            }
          } catch(e) {}
        }

        function setBet(amount) {
          document.getElementById('betAmount').value = amount;
        }

        function showMessage(msg, isError = false) {
          const banner = document.getElementById('msgBanner');
          banner.innerText = msg;
          banner.className = 'msg-banner ' + (isError ? 'msg-error' : 'msg-success');
          banner.style.display = 'block';
        }

        function hideMessage() {
          document.getElementById('msgBanner').style.display = 'none';
        }

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
          hideMessage();

          if (isNaN(currentBet) || currentBet <= 0) return showMessage(t.invalid_bet, true);
          if (currentBet > balance) return showMessage(t.insufficient, true);

          updateDatabaseBalance(balance - currentBet);

          isPlaying = true;
          currentMultiplier = 1.00;

          // Crash Algorithm: 70% chance to crash between 1.01x and 1.15x
          const rand = Math.random();
          if (rand < 0.70) {
            crashMultiplier = (Math.random() * 0.14 + 1.01).toFixed(2);
          } else {
            crashMultiplier = (Math.random() * 2.5 + 1.16).toFixed(2);
          }

          document.getElementById('betBtn').style.display = 'none';
          document.getElementById('cashoutBtn').style.display = 'block';
          document.getElementById('multiplier').style.color = '#ef4444';
          
          const plane = document.getElementById('plane');
          plane.style.display = 'block';
          plane.style.bottom = '20px';
          plane.style.left = '20px';

          gameInterval = setInterval(() => {
            currentMultiplier += 0.02;
            document.getElementById('multiplier').innerText = currentMultiplier.toFixed(2) + 'x';
            
            // Plane Movement Animation
            let posX = Math.min(220, (currentMultiplier - 1) * 120 + 20);
            let posY = Math.min(100, (currentMultiplier - 1) * 70 + 20);
            plane.style.left = posX + 'px';
            plane.style.bottom = posY + 'px';

            playSound('fly');

            if (currentMultiplier >= parseFloat(crashMultiplier)) {
              endGame(false);
            }
          }, 100);
        }

        function cashOut() {
          if (!isPlaying) return;
          const winnings = currentBet * currentMultiplier;
          updateDatabaseBalance(balance + winnings);

          playSound('win');
          const t = dict[currentLang];
          showMessage(t.win.replace('{amount}', winnings.toFixed(2)), false);

          endGame(true);
        }

        function endGame(won) {
          clearInterval(gameInterval);
          isPlaying = false;
          const t = dict[currentLang];
          const plane = document.getElementById('plane');

          if (!won) {
            playSound('crash');
            document.getElementById('multiplier').innerText = t.flew_away;
            document.getElementById('multiplier').style.color = "#dc2626";
            plane.style.display = 'none';
          } else {
            plane.style.display = 'none';
          }

          document.getElementById('cashoutBtn').style.display = 'none';
          document.getElementById('betBtn').style.display = 'block';
          document.getElementById('betBtn').disabled = true;

          // Automatic Reset Loop back to 1.00x
          setTimeout(() => {
            document.getElementById('multiplier').innerText = '1.00x';
            document.getElementById('multiplier').style.color = '#ef4444';
            document.getElementById('betBtn').disabled = false;
          }, 2500);
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

// Handle Language Selection Callbacks
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
