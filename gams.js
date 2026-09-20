// مصفوفة أسئلة الألعاب (يتم التوسيع لتغطية 500 سؤال لكل قسم)
const questionsData = {
  capital: [
    { q: "ما هي عاصمة مصر؟", a: "القاهرة" },
    { q: "ما هي عاصمة السعودية؟", a: "الرياض" },
    { q: "ما هي عاصمة الإمارات؟", a: "ابوظبي" },
    { q: "ما هي عاصمة فرنسا؟", a: "باريس" }
    // (يمكنك إضافة البقية لتصل إلى 500 سؤال بنفس النمط)
  ],
  arabic: [
    { q: "ما جمع كلمة 'قلم'؟", a: "اقلام" },
    { q: "ما إعراب الفاعل دائماً؟", a: "مرفوع" }
  ],
  math: [
    { q: "ما ناتج 5 × 5 + 10؟", a: "35" },
    { q: "كم جذر الـ 81؟", a: "9" }
  ],
  riddle: [
    { q: "يملك أسناناً كثيرة ولكنه لا يعض، فمن هو؟", a: "المشط" }
  ],
  guess: [
    { q: "ما هو الحيوان الذي يسمى أبا الحصين؟", a: "الثعلب" }
  ]
};

// قائمة شخصيات الأنمي لتخمين الصور (200 شخصية)
const animeCharacters = [
  { name: "غوكو", image: "https://example.com/goku.jpg" },
  { name: "ناروتو", image: "https://example.com/naruto.jpg" },
  { name: "لوفي", image: "https://example.com/luffy.jpg" }
  // (أضف حتى 200 صورة لشخصيات مختلفة)
];

function getRandomQuestion(category) {
  const list = questionsData[category];
  if (!list || list.length === 0) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function getRandomAnimeCharacter() {
  const index = Math.floor(Math.random() * animeCharacters.length);
  return animeCharacters[index];
}

module.exports = { getRandomQuestion, getRandomAnimeCharacter };
