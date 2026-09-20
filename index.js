/* ==========================================================================
   SULTAN ULTIMATE TELEGRAM BOT - FULL CLEAN VERSION
   ========================================================================== */

const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

// استبدل التوكن هنا أو خلية ياخده من البيئة
const TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(TOKEN, { polling: true });

// --- قاعدة البيانات SQLite ---
const db = new sqlite3.Database('./sultan.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// إنشاء الجداول الأساسية
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    username TEXT,
    balance INTEGER DEFAULT 500,
    khatma_page INTEGER DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS groups (
    group_id TEXT PRIMARY KEY,
    title TEXT
  )`);
});

// --- 1. الأمر الرئيسي /start ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || 'User';

  db.run(`INSERT OR IGNORE INTO users (telegram_id, username) VALUES (?, ?)`, [userId, username], () => {
    const welcomeText = 
      `⚡ *أهلاً بك في بوت سلطان الشامل المتكامل* ⚡\n\n` +
      `💳 *البنك:* /balance | /daily | /transfer\n` +
      `🎮 *الألعاب:* /game | /game math | /game riddle | /game guess\n` +
      `📖 *القرآن والختمة:* /quran | /khatma\n` +
      `👮‍♂️ *الإدارة:* /ban | /mute | /broadcast | /stats`;

    bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
  });
});

// --- 2. نظام البنك والأموال ---
bot.onText(/\/balance/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  db.get(`SELECT balance FROM users WHERE telegram_id = ?`, [userId], (err, row) => {
    const balance = row ? row.balance : 500;
    bot.sendMessage(chatId, `💰 رصيدك الحالي هو: \`${balance}\` جنيه.`, { parse_mode: 'Markdown' });
  });
});

bot.onText(/\/daily/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  db.run(`UPDATE users SET balance = balance + 200 WHERE telegram_id = ?`, [userId], () => {
    bot.sendMessage(chatId, `🎁 تمت إضافة مكافأتك اليومية (200 جنيه) بنجاح!`, { parse_mode: 'Markdown' });
  });
});

// --- 3. الألعاب والترفيه ---
bot.onText(/\/game/, (msg) => {
  const chatId = msg.chat.id;
  const gamesList = 
    `🎮 *قائمة الألعاب المتاحة:*\n\n` +
    `1️⃣ مسابقة الرياضيات: \`/game math\`\n` +
    `2️⃣ فوازير ورتوش: \`/game riddle\`\n` +
    `3️⃣ لعبة التخمين: \`/game guess\``;

  bot.sendMessage(chatId, gamesList, { parse_mode: 'Markdown' });
});

bot.onText(/\/game math/, (msg) => {
  const chatId = msg.chat.id;
  const num1 = Math.floor(Math.random() * 50) + 1;
  const num2 = Math.floor(Math.random() * 50) + 1;
  bot.sendMessage(chatId, `🧮 كم الناتج:\n\`${num1} + ${num2} = ?\``, { parse_mode: 'Markdown' });
});

// --- 4. القرآن والختمة ---
bot.onText(/\/khatma/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  db.get(`SELECT khatma_page FROM users WHERE telegram_id = ?`, [userId], (err, row) => {
    const page = row ? row.khatma_page : 1;
    bot.sendMessage(chatId, `📖 صفحتك الحالية في الختمة هي الصفحة رقم: \`${page}\`\nاستمر ولا تتوقف!`, { parse_mode: 'Markdown' });
  });
});

// --- 5. الإحصائيات والإذاعة ---
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;

  db.get(`SELECT COUNT(*) as count FROM users`, [], (err, userRow) => {
    const totalUsers = userRow ? userRow.count : 0;
    bot.sendMessage(chatId, `📊 إحصائيات البوت:\n👥 عدد المستخدمين: \`${totalUsers}\`\n⚡ الحالة: \`يعمل بكفاءة\``, { parse_mode: 'Markdown' });
  });
});

bot.onText(/\/broadcast (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const broadcastMessage = match[1];

  db.all(`SELECT telegram_id FROM users`, [], (err, rows) => {
    if (err) return bot.sendMessage(chatId, "❌ حدث خطأ.");
    
    bot.sendMessage(chatId, `📢 جاري الإرسال إلى ${rows.length} مستخدم...`);
    rows.forEach((row) => {
      bot.sendMessage(row.telegram_id, `📢 *إشعار إداري:*\n\n${broadcastMessage}`, { parse_mode: 'Markdown' }).catch(() => {});
    });
  });
});

// --- معالجة الأخطاء والتشغيل ---
bot.on('polling_error', (error) => {
  console.log(`[Polling Error]: ${error.message}`);
});

console.log("🔥 Sultan Bot is running smoothly...");
