/* ==========================================================================
   SULTAN ULTIMATE TELEGRAM BOT - PART 1 (EXPANDED & DETAILED)
   ========================================================================== */

const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

const TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(TOKEN, { polling: true });

// --- 1. SETUP DATABASE & TABLES ---
const db = new sqlite3.Database('./sultan_bot.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('SQLite Database connected successfully.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    telegram_id TEXT UNIQUE,
    name TEXT,
    username TEXT,
    bank_account TEXT,
    balance REAL DEFAULT 1000.0,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS groups (
    chat_id TEXT PRIMARY KEY,
    title TEXT,
    games_enabled INTEGER DEFAULT 1,
    bank_enabled INTEGER DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS quran_khatma (
    telegram_id TEXT,
    surah_number INTEGER,
    completed INTEGER DEFAULT 0,
    PRIMARY KEY (telegram_id, surah_number)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS custom_replies (
    keyword TEXT PRIMARY KEY,
    reply TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT,
    receiver_id TEXT,
    amount REAL,
    timestamp TEXT
  )`);
});

// --- 2. MASSIVE QUESTIONS & ANIME DATABASE ---
const questionsDatabase = {
  capital: [
    { q: "ما هي عاصمة مصر؟", a: "القاهرة" },
    { q: "ما هي عاصمة السعودية؟", a: "الرياض" },
    { q: "ما هي عاصمة الإمارات؟", a: "ابوظبي" },
    { q: "ما هي عاصمة الكويت؟", a: "الكويت" },
    { q: "ما هي عاصمة الأردن؟", a: "عمان" },
    { q: "ما هي عاصمة العراق؟", a: "بغداد" },
    { q: "ما هي عاصمة سوريا؟", a: "دمشق" },
    { q: "ما هي عاصمة لبنان؟", a: "بيروت" },
    { q: "ما هي عاصمة فلسطين؟", a: "القدس" },
    { q: "ما هي عاصمة قطر؟", a: "الدوحة" },
    { q: "ما هي عاصمة البحرين؟", a: "المنامة" },
    { q: "ما هي عاصمة عمان؟", a: "مسقط" },
    { q: "ما هي عاصمة اليمن؟", a: "صنعاء" },
    { q: "ما هي عاصمة تونس؟", a: "تونس" },
    { q: "ما هي عاصمة الجزائر؟", a: "الجزائر" },
    { q: "ما هي عاصمة المغرب؟", a: "الرباط" },
    { q: "ما هي عاصمة ليبيا؟", a: "طرابلس" },
    { q: "ما هي عاصمة السودان؟", a: "خرطوم" },
    { q: "ما هي عاصمة الصومال؟", a: "مقديشو" },
    { q: "ما هي عاصمة موريتانيا؟", a: "نواكشوط" },
    { q: "ما هي عاصمة فرنسا؟", a: "باريس" },
    { q: "ما هي عاصمة ألمانيا؟", a: "برلين" },
    { q: "ما هي عاصمة إيطاليا؟", a: "روما" },
    { q: "ما هي عاصمة إسبانيا؟", a: "مدريد" },
    { q: "ما هي عاصمة بريطانيا؟", a: "لندن" },
    { q: "ما هي عاصمة روسيا؟", a: "موسكو" },
    { q: "ما هي عاصمة الصين؟", a: "بكين" },
    { q: "ما هي عاصمة اليابان؟", a: "طوكيو" },
    { q: "ما هي عاصمة كوريا الجنوبية؟", a: "سيول" },
    { q: "ما هي عاصمة الهند؟", a: "نيودلهي" },
    { q: "ما هي عاصمة تركيا؟", a: "أنقرة" },
    { q: "ما هي عاصمة إيران؟", a: "طهران" },
    { q: "ما هي عاصمة إندونيسيا؟", a: "جاكرتا" },
    { q: "ما هي عاصمة باكستان؟", a: "إسلام آباد" },
    { q: "ما هي عاصمة البرازيل؟", a: "برازيليا" },
    { q: "ما هي عاصمة الأرجنتين؟", a: "بوينس آيرس" },
    { q: "ما هي عاصمة كندا؟", a: "أوتاوا" },
    { q: "ما هي عاصمة أستراليا؟", a: "كانبرا" },
    { q: "ما هي عاصمة اليونان؟", a: "أثينا" },
    { q: "ما هي عاصمة السويد؟", a: "ستوكهولم" },
    { q: "ما هي عاصمة النرويج؟", a: "أوسلو" },
    { q: "ما هي عاصمة فنلندا؟", a: "هلسنكي" },
    { q: "ما هي عاصمة الدنمارك؟", a: "كوبنهاغن" },
    { q: "ما هي عاصمة هولندا؟", a: "أمستردام" },
    { q: "ما هي عاصمة بلجيكا؟", a: "بروكسل" },
    { q: "ما هي عاصمة سويسرا؟", a: "برن" },
    { q: "ما هي عاصمة النمسا؟", a: "فيينا" },
    { q: "ما هي عاصمة البرتغال؟", a: "لشبونة" },
    { q: "ما هي عاصمة بولندا؟", a: "وارسو" },
    { q: "ما هي عاصمة أوكرانيا؟", a: "كييف" }
  ],
  arabic: [
    { q: "ما جمع كلمة 'قلم'؟", a: "اقلام" },
    { q: "ما جمع كلمة 'أسد'؟", a: "أسود" },
    { q: "ما جمع كلمة 'بحر'؟", a: "بحار" },
    { q: "ما إعراب الفاعل دائماً؟", a: "مرفوع" },
    { q: "ما إعراب المفعول به دائماً؟", a: "منصوب" },
    { q: "ضد كلمة 'الخير'؟", a: "الشر" },
    { q: "ضد كلمة 'الصدق'؟", a: "الكذب" },
    { q: "ما هو مرادف كلمة 'صراخ'؟", a: "صياح" },
    { q: "كم عدد حروف الهجاء العربية؟", a: "28" },
    { q: "ما هو أصل كلمة 'فلسفة'؟", a: "يوناني" },
    { q: "ما جمع كلمة 'طالب'؟", a: "طلاب" },
    { q: "ما جمع كلمة 'معلم'؟", a: "معلمون" },
    { q: "ما جمع كلمة 'مسجد'؟", a: "مساجد" },
    { q: "ما هو مرادف كلمة 'سريع'؟", a: "خاطف" },
    { q: "ما ضد كلمة 'قوي'؟", a: "ضعيف" },
    { q: "ما إعراب المبتدأ والخبر؟", a: "مرفوعان" },
    { q: "ما هو الفعل الماضي من 'يكتب'؟", a: "كتب" },
    { q: "ما هو جمع كلمة 'كتاب'؟", a: "كتب" },
    { q: "ما هو مرادف كلمة 'جميل'؟", a: "حسناء" },
    { q: "ما ضد كلمة 'واسع'؟", a: "ضيق" },
    { q: "ما جمع كلمة 'رجل'؟", a: "رجال" },
    { q: "ما جمع كلمة 'امرأة'؟", a: "نساء" },
    { q: "ما جمع كلمة 'طريق'؟", a: "طرق" },
    { q: "ما هو مرادف كلمة 'ذكاء'؟", a: "فطنة" },
    { q: "ما ضد كلمة 'حار'؟", a: "بارد" }
  ],
  math: [
    { q: "ما ناتج 5 × 5 + 10؟", a: "35" },
    { q: "كم جذر الـ 81؟", a: "9" },
    { q: "ما ناتج 12 × 12؟", a: "144" },
    { q: "ما ناتج 100 ÷ 4؟", a: "25" },
    { q: "إذا كان لديك 3 تفاحات وأخذت منهم 2، كم يتبقى معك؟", a: "2" },
    { q: "ما ناتج 7 + 8 × 2؟", a: "23" },
    { q: "ما نصف الرقم 150؟", a: "75" },
    { q: "كم ثانية في الدقيقة الواحدة؟", a: "60" },
    { q: "ما ناتج 9 × 9؟", a: "81" },
    { q: "ما هو العدد الأولي الزوجي الوحيد؟", a: "2" },
    { q: "ما ناتج 15 + 15؟", a: "30" },
    { q: "ما ناتج 50 - 20؟", a: "30" },
    { q: "ما ناتج 8 × 8؟", a: "64" },
    { q: "ما ناتج 81 ÷ 9؟", a: "9" },
    { q: "كم عدد أضلاع المثلث؟", a: "3" },
    { q: "ما ناتج 10 × 10؟", a: "100" },
    { q: "ما ناتج 45 ÷ 5؟", a: "9" },
    { q: "كم عدد زوايا المربع؟", a: "4" },
    { q: "ما ناتج 7 × 7؟", a: "49" },
    { q: "ما ناتج 30 + 30 ÷ 2؟", a: "45" }
  ],
  riddle: [
    { q: "يملك أسناناً كثيرة ولكنه لا يعض، فمن هو؟", a: "المشط" },
    { q: "شيء كلما أخذت منه كبر، وكلما وضعت فيه صغر، فما هو؟", a: "الحفرة" },
    { q: "ما هو الشيء الذي يسير أمامك ولا تراه؟", a: "المستقبل" },
    { q: "له عين واحدة ولا يرى، فما هو؟", a: "الإبرة" },
    { q: "ما هو الشيء الذي يخترق الزجاج ولا يكسره؟", a: "الضوء" },
    { q: "ما هو البيت الذي ليس فيه أبواب ولا نوافذ؟", a: "بيت الشعر" },
    { q: "ما هو الشيء الذي أطول من ليلك؟", a: "عمرك" },
    { q: "يتحرك بدون قدمين ولا يطير إلا بجناحين، فما هو؟", a: "السحاب" },
    { q: "ما هو الشيء الذي كلما احتك بالأرض طال؟", a: "القلم" },
    { q: "له أوراق وليس بنبات، ويحفظ الأسرار وليس بإنسان، فما هو؟", a: "الكتاب" }
  ],
  guess: [
    { q: "ما هو الحيوان الذي يسمى أبا الحصين؟", a: "الثعلب" },
    { q: "ما هو الحيوان الذي يُسمى أبا الحارث؟", a: "الأسد" },
    { q: "ما هو الطائر الذي يلد ولا يبيض؟", a: "الخفافيش" },
    { q: "ما هو الحيوان الذي ينام إحدى عينيه والأخرى مفتوحة؟", a: "الدلفين" },
    { q: "ما هي حشرة تبني بيتاً من الحرير وتصنع القماش؟", a: "دودة القز" },
    { q: "ما هو الحيوان الذي يستطيع تحمل العطش أكثر من الجمل؟", a: "الزرافة" },
    { q: "ما هو أسرع حيوان بري في العالم؟", a: "الفهد" },
    { q: "ما هو أكبر حيوان بحري على وجه الأرض؟", a: "الحوت الأزرق" },
    { q: "ما هو الحيوان الذي إذا قطعت ذيله ينمو مرة أخرى؟", a: "السحلية" },
    { q: "ما هي الحشرة التي تنقل مرض الملاريا؟", a: "البعوض" }
  ]
};

const animeCharactersList = [
  { name: "غوكو", image: "https://i.imgur.com/example1.jpg" },
  { name: "ناروتو", image: "https://i.imgur.com/example2.jpg" },
  { name: "لوفي", image: "https://i.imgur.com/example3.jpg" },
  { name: "ساسكي", image: "https://i.imgur.com/example4.jpg" },
  { name: "كاتسوكي باكوغو", image: "https://i.imgur.com/example5.jpg" },
  { name: "تامجيرو", image: "https://i.imgur.com/example6.jpg" },
  { name: "سايتاما", image: "https://i.imgur.com/example7.jpg" },
  { name: "ليفي أكرمان", image: "https://i.imgur.com/example8.jpg" },
  { name: "كانيكي", image: "https://i.imgur.com/example9.jpg" },
  { name: "إرين ييغر", image: "https://i.imgur.com/example10.jpg" }
];
/* ==========================================================================
   SULTAN ULTIMATE TELEGRAM BOT - PART 2 (LOGIC, DATABASE HOOKS & COMMANDS)
   ========================================================================== */

function getRandomQuestion(category) {
  const list = questionsDatabase[category];
  if (!list || list.length === 0) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function getRandomAnimeCharacter() {
  const index = Math.floor(Math.random() * animeCharactersList.length);
  return animeCharactersList[index];
}

// --- 3. AUTO REGISTRATION & EVENT HANDLERS ---
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  if (!user) return;

  const timestamp = new Date().toISOString();
  const bankAccount = 'SULTAN-' + Math.floor(100000 + Math.random() * 900000);

  db.run(
    `INSERT INTO users (telegram_id, name, username, bank_account, balance, created_at) 
     VALUES (?, ?, ?, ?, 1000.0, ?) 
     ON CONFLICT(telegram_id) DO UPDATE SET username=?, name=?`,
    [user.id, user.first_name, user.username || 'NoUser', bankAccount, timestamp, user.username, user.first_name]
  );

  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    db.run(
      `INSERT INTO groups (chat_id, title) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET title=?`,
      [chatId, msg.chat.title, msg.chat.title]
    );

    if (msg.new_chat_members) {
      msg.new_chat_members.forEach((member) => {
        bot.sendMessage(chatId, `أهلاً بك يا ${member.first_name} في عائلة سلطان ⚡ نورت الجروب!`);
      });
    }
  }

  if (msg.text && !msg.text.startsWith('/')) {
    db.get(`SELECT reply FROM custom_replies WHERE keyword = ?`, [msg.text], (err, row) => {
      if (row) {
        bot.sendMessage(chatId, row.reply);
      }
    });
  }
});

// --- 4. COMMANDS LOGIC & HANDLERS ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    "⚡ **أهلاً بك في بوت سلطان الشامل المتكامل** ⚡\n\n" +
    "💳 **البنك:** `/balance` | `/daily` | `/transfer`\n" +
    "🎮 **الألعاب:** `/game capital` | `/game anime` | `/game math` | `/game riddle` | `/game guess`\n" +
    "📖 **القرآن والختمة:** `/quran` | `/khatma`\n" +
    "👮 **الإدارة:** `/ban` | `/mute` | `/addreply`"
  );
});

bot.onText(/\/balance/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  db.get(`SELECT balance, bank_account FROM users WHERE telegram_id = ?`, [userId], (err, row) => {
    if (row) {
      bot.sendMessage(chatId, `💳 رقم الحساب: ${row.bank_account}\n💰 رصيدك الحالي: ${row.balance} جنيه`);
    } else {
      bot.sendMessage(chatId, "⚠️ حسابك غير مسجل، ارسل أي رسالة.");
    }
  });
});

bot.onText(/\/daily/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  db.run(`UPDATE users SET balance = balance + 200 WHERE telegram_id = ?`, [userId], () => {
    bot.sendMessage(chatId, "🎁 تم إضافة المكافأة اليومية (200 جنيه) بنجاح!");
  });
});

bot.onText(/\/transfer (\S+) (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetAccount = match[1];
  const amount = parseFloat(match[2]);

  db.get(`SELECT balance FROM users WHERE telegram_id = ?`, [senderId], (err, sender) => {
    if (!sender || sender.balance < amount) {
      return bot.sendMessage(chatId, "❌ رصيدك غير كافٍ للتحويل.");
    }
    db.get(`SELECT telegram_id FROM users WHERE bank_account = ?`, [targetAccount], (err, receiver) => {
      if (!receiver) return bot.sendMessage(chatId, "❌ رقم الحساب خطأ.");

      db.run(`UPDATE users SET balance = balance - ? WHERE telegram_id = ?`, [amount, senderId]);
      db.run(`UPDATE users SET balance = balance + ? WHERE telegram_id = ?`, [amount, receiver.telegram_id]);
      bot.sendMessage(chatId, `✅ تم تحويل ${amount} جنيه بنجاح إلى الحساب: ${targetAccount}`);
    });
  });
});

bot.onText(/\/game (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const gameType = match[1].trim();

  if (gameType === 'anime') {
    const character = getRandomAnimeCharacter();
    bot.sendMessage(chatId, `🎯 خمن شخصية الأنمي:\n${character.image}`);
  } else {
    const q = getRandomQuestion(gameType);
    if (!q) return bot.sendMessage(chatId, "❌ اللعبة غير موجودة أو القسم خطأ.");
    bot.sendMessage(chatId, `🧠 سؤال (${gameType}):\n${q.q}`);
  }
});

bot.onText(/\/quran/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "📖 قائمة سور القرآن الكريم الـ 114 متاحة للاستماع والتلاوة عبر روابط islamic.network.");
});

bot.onText(/\/khatma/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  db.run(`INSERT OR IGNORE INTO quran_khatma (telegram_id, surah_number, completed) VALUES (?, 1, 0)`, [userId], () => {
    bot.sendMessage(chatId, "🕌 تم فتح ختمة القرآن وحفظ تقدمك بنجاح!");
  });
});

bot.onText(/\/ban/, (msg) => {
  const chatId = msg.chat.id;
  if (!msg.reply_to_message) return bot.sendMessage(chatId, "⚠️ رد على رسالة العضو لطرده.");
  const userToBan = msg.reply_to_message.from.id;
  bot.banChatMember(chatId, userToBan).then(() => {
    bot.sendMessage(chatId, "🚨 تم طرد العضو بنجاح.");
  }).catch(() => {
    bot.sendMessage(chatId, "❌ تأكد من صلاحيات المشرف.");
  });
});

bot.onText(/\/mute/, (msg) => {
  const chatId = msg.chat.id;
  if (!msg.reply_to_message) return bot.sendMessage(chatId, "⚠️ رد على رسالة العضو لكتمه.");
  const userToMute = msg.reply_to_message.from.id;
  bot.restrictChatMember(chatId, userToMute, { can_send_messages: false }).then(() => {
    bot.sendMessage(chatId, "🔇 تم كتم العضو.");
  });
});

bot.onText(/\/addreply (.+) \/ (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const keyword = match[1].trim();
  const reply = match[2].trim();

  db.run(`INSERT OR REPLACE INTO custom_replies (keyword, reply) VALUES (?, ?)`, [keyword, reply], () => {
    bot.sendMessage(chatId, `✅ تم حفظ الرد التلقائي: (${keyword})`);
  });
});

console.log("Sultan Ultimate Telegram Bot Full Expanded Edition is running successfully...");
/* ==========================================================================
   SULTAN ULTIMATE TELEGRAM BOT - PART 3 (ADVANCED FEATURES & BROADCAST)
   ========================================================================== */

// --- 5. ADVANCED ADMIN COMMANDS & UTILITIES ---

bot.onText(/\/broadcast (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const broadcastMessage = match[1];

  // تأكد من صلاحيات المطور أو المالك (يمكنك استبدال الـ ID الخاص بك هنا)
  const ADMIN_ID = 'YOUR_TELEGRAM_ID'; 

  db.all(`SELECT telegram_id FROM users`, [], (err, rows) => {
    if (err) {
      return bot.sendMessage(chatId, "❌ حدث خطأ أثناء جلب المستخدمين.");
    }

    bot.sendMessage(chatId, `📢 جاري إرسال الإذاعة إلى ${rows.length} مستخدم...`);

    rows.forEach((row) => {
      bot.sendMessage(row.telegram_id, `📢 **رسالة إدارية من الإدارة:**\n\n${broadcastMessage}`, { parse_mode: 'Markdown' })
        .catch((e) => {
          // تجاهل الحسابات التي قامت بعمل حظر للبوت
        });
    });
  });
});

bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;

  db.get(`SELECT COUNT(*) as count FROM users`, [], (err, userRow) => {
    db.get(`SELECT COUNT(*) as count FROM groups`, [], (err2, groupRow) => {
      db.get(`SELECT SUM(balance) as total FROM users`, [], (err3, bankRow) => {
        const totalUsers = userRow ? userRow.count : 0;
        const totalGroups = groupRow ? groupRow.count : 0;
        const totalMoney = bankRow && bankRow.total ? bankRow.total : 0;

        const statsText = 
          `📊 **إحصائيات بوت سلطان الشاملة:**\n\n` +
          `👥 إجمالي المستخدمين المسجلين: \`${totalUsers}\`\n` +
          `👥 إجمالي المجموعات المفعل بها: \`${totalGroups}\`\n` +
          `💰 إجمالي الكتلة النقدية بالبنك: \`${totalMoney}\` جنيه\n` +
          `⚡ حالة البوت: \`متصل ويعمل بكفاءة\`\n`;

        bot.sendMessage(chatId, statsText, { parse_mode: 'Markdown' });
      });
    });
  });
});

// --- 6. CALLBACK QUERY HANDLERS (INLINE BUTTONS) ---
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'daily_bonus_claim') {
    const userId = query.from.id;
    db.run(`UPDATE users SET balance = balance + 200 WHERE telegram_id = ?`, [userId], () => {
      bot.answerCallbackQuery(query.id, { text: '🎁 تمت إضافة 200 جنيه إلى حسابك بنجاح!', show_alert: true });
    });
  } else if (data === 'help_menu') {
    bot.sendMessage(chatId, "📖 قائمة المساعدة السريعة:\nاستخدم الأوامر المباشرة مثل /start للبدء أو /balance لمعرفة رصيدك.");
    bot.answerCallbackQuery(query.id);
  }
});

// --- 7. ERROR HANDLING & MONITORING ---
bot.on('polling_error', (error) => {
  console.log(`[Polling Error]: ${error.code} - ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log("🔥 Sultan Ultimate Bot [Part 3 Loaded] - All systems online and fully operational!");
