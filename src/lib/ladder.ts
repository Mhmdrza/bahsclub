export interface LadderModule {
  label: string;
  slugs: string[];
}

export interface LadderRung {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  competencies: string[];
  selfCheck: string[];
  lessonSlugs: string[];
  modules: LadderModule[];
}

export const LADDER: LadderRung[] = [
  {
    id: "pad",
    step: "مرحلهٔ ۱",
    title: "پایه: خوب حرف زدن",
    subtitle: "گفت‌وگو، گوش دادن، شفافیت",
    description:
      "اینجا یاد می‌گیری طوری حرف بزنی که طرف مقابل هم بخواهد بشنود: چطور گوش بدهی، چطور سؤال بپرسی، و چطور یک ادعای مبهم را دقیق کنی. بدون این پایه، هر تکنیک پیشرفته‌تری فقط یک بازی سطحی می‌شود.",
    competencies: [
      "شنیدن برای فهمیدن، نه برای پاسخ دادن",
      "شفاف کردن ادعا و نقشهٔ استدلال",
      "مدیریت لحن، سکوت، و نوع پرسش",
      "احترام به استقلال طرف مقابل و پرهیز از نیت‌خوانی",
    ],
    selfCheck: [
      "حین مخالفت، اول می‌فهمم طرف مقابل دقیقاً چه می‌گوید، بعد پاسخ می‌دهم.",
      "می‌توانم یک ادعای مبهم را به جمله‌ای تبدیل کنم که واقعاً می‌شود آزمود.",
      "لحن، سکوت، و نوع سؤال خودم را هنگام گفت‌وگو آگاهانه مدیریت می‌کنم.",
    ],
    lessonSlugs: ["dialogue-basics", "judgment-literacy"],
    modules: [
      {
        label: "گفت‌وگو با دیگری",
        slugs: [
          "dialogue-autonomy",
          "active-listening",
          "strategic-silence",
          "echo-last-three-words",
          "intonation-up-down",
          "tone-of-voice",
          "intent-question",
        ],
      },
      {
        label: "شفاف فکر کردن",
        slugs: [
          "what-is-judgment-testing",
          "claim-vs-interpretation",
          "precise-claims",
          "structure-of-argument",
          "falsifiability-and-revision",
        ],
      },
      {
        label: "تمرین پایه",
        slugs: [
          "asking-better-questions",
          "fair-effective-debate",
          "confidence-and-uncertainty",
          "rewrite-vague-claim",
          "claim-vs-taste",
          "three-sentence-response",
        ],
      },
    ],
  },
  {
    id: "moqavemat",
    step: "مرحلهٔ ۲",
    title: "مقاومت: بحث، تعارض، نفوذ",
    subtitle: "تشخیص تاکتیک، مدیریت تعارض، شناخت نفوذ",
    description:
      "اینجا یاد می‌گیری در تعارض گم نشوی: تاکتیک‌های انحرافی را بشناسی، تفاوت بحث سازنده و جدل برنده‌محور را بفهمی، و ابزارهای نفوذ — ترس، اکثریت، مرجع — را از استدلال واقعی جدا کنی.",
    competencies: [
      "تشخیص مغالطه‌ها و تاکتیک‌های انحرافی",
      "بازگرداندن بحث به مسیر، بدون تشدید تنش",
      "شناخت ابزارهای نفوذ عاطفی و اجتماعی",
      "حفظ انصاف (استیلمن‌نینگ) زیر فشار",
    ],
    selfCheck: [
      "تاکتیک‌هایی مثل حملهٔ شخصی، مرد پوشالی، و انحراف موضوع را تشخیص می‌دهم.",
      "می‌توانم بدون متهم کردن طرف مقابل، بحث را به موضوع اصلی برگردانم.",
      "ابزارهای نفوذ (ترس، اکثریت، مرجع) را از استدلال واقعی جدا می‌کنم.",
    ],
    lessonSlugs: ["spotting-tactics"],
    modules: [
      {
        label: "انصاف و شواهد",
        slugs: ["steelman-opponent", "evidence-quality", "when-to-say-i-dont-know"],
      },
      {
        label: "تشخیص تاکتیک",
        slugs: [
          "what-is-fallacy",
          "ad-hominem",
          "straw-man",
          "false-dilemma",
          "red-herring",
          "appeal-to-authority",
          "whataboutism",
          "responding-to-tactics",
        ],
      },
      {
        label: "نفوذ و احساس",
        slugs: [
          "emotional-persuasion",
          "expertise-and-incentives",
          "appeal-to-fear",
          "appeal-to-majority",
          "appeal-to-tradition",
          "appeal-to-novelty",
        ],
      },
      {
        label: "مغالطه‌های رایج",
        slugs: [
          "slippery-slope",
          "hasty-generalization",
          "nirvana-fallacy",
          "shifting-burden-of-proof",
          "false-analogy",
          "all-or-nothing",
          "composition-division",
          "appeal-to-ignorance",
          "cherry-picking",
        ],
      },
      {
        label: "تمرین",
        slugs: ["spot-fallacy-dialogue"],
      },
    ],
  },
  {
    id: "tasallot",
    step: "مرحلهٔ ۳",
    title: "تسلط: چهارچوب، روایت، برتری",
    subtitle: "ساختن و خنثی کردن معنا",
    description:
      "اینجا وارد لایهٔ عمیق‌تر می‌شوی: اینکه چهارچوب‌بندی و روایت چطور قضاوت را می‌سازند، و شوپنهاور چطور «برنده شدن به هر قیمت» را ممکن می‌کند — تا هم بشناسی، هم خنثی کنی.",
    competencies: [
      "تشخیص چهارچوب‌بندی و حذف در روایت",
      "جدا کردن همبستگی از علیت و ساختن توضیح جایگزین",
      "شناخت هنر برتری‌جویی و دفاع در برابرش",
      "محک زدن عمیق باورها",
    ],
    selfCheck: [
      "چهارچوب‌بندی و حذف را در خبرها و روایت‌های رسانه‌ای می‌بینم.",
      "همبستگی را از علیت جدا می‌کنم و برای شواهد، توضیح جایگزین می‌سازم.",
      "ترفندهای «برنده شدن به هر قیمت» را می‌شناسم و می‌توانم خنثی کنم.",
    ],
    lessonSlugs: ["deeper-curriculum"],
    modules: [
      {
        label: "چهارچوب و روایت",
        slugs: [
          "framing-and-omission",
          "hidden-assumption",
          "alternative-explanations",
          "correlation-and-causation",
        ],
      },
      {
        label: "هنر برتری‌جویی (شوپنهاور)",
        slugs: [
          "schopenhauer-art-of-being-right",
          "poisoning-the-well",
          "appeal-to-consequences",
          "provocation",
          "absurd-extension",
          "theory-vs-practice",
          "hair-splitting",
          "begging-the-question",
          "moving-goalposts",
          "loaded-question",
          "equivocation",
          "gish-gallop",
        ],
      },
      {
        label: "محک عمیق",
        slugs: ["belief-stress-test"],
      },
    ],
  },
];
