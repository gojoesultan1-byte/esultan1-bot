const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sultan_bot.db');

db.serialize(() => {
  // جدول المستخدمين والبنك
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    telegram_id TEXT UNIQUE,
    name TEXT,
    username TEXT,
    bank_account TEXT,
    balance REAL DEFAULT 0,
    is_premium INTEGER DEFAULT 0,
    created_at TEXT
  )`);

  // جدول الجروبات
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    chat_id TEXT PRIMARY KEY,
    title TEXT,
    games_enabled INTEGER DEFAULT 1,
    bank_enabled INTEGER DEFAULT 1,
    welcome_enabled INTEGER DEFAULT 1
  )`);

  // جدول ختمة القرآن
  db.run(`CREATE TABLE IF NOT EXISTS quran_khatma (
    telegram_id TEXT,
    surah_number INTEGER,
    completed INTEGER DEFAULT 0,
    PRIMARY KEY (telegram_id, surah_number)
  )`);

  // جدول الردود التلقائية والاختصارات
  db.run(`CREATE TABLE IF NOT EXISTS custom_replies (
    keyword TEXT PRIMARY KEY,
    reply TEXT
  )`);

  // جدول المعاملات المالية
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT,
    receiver_id TEXT,
    amount REAL,
    timestamp TEXT
  )`);
});

module.exports = db;
