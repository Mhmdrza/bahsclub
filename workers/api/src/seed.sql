-- Seed: بحث‌کلاب. Passwords are all 'password123'.
-- Hash: uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc= | Salt: dGVzdHNhbHQxMjM0NTY3OA==
INSERT OR REPLACE INTO users (id, username, email, password_hash, password_salt, is_trusted, created_at)
VALUES
  (1, 'socrates_teh', 'socrates@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-120 days')),
  (2, 'ali_rezaei', 'ali@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-110 days')),
  (3, 'sara_rad', 'sara@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-100 days')),
  (4, 'mehdi_k', 'mehdi@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-90 days')),
  (5, 'nima_d', 'nima@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 0, datetime('now', '-60 days')),
  (6, 'yalda_m', 'yalda@bahs.club', 'uicuY8CgEPQ56upaAHn/dHc086VphI4b0AM1oUr2UIc=', 'dGVzdHNhbHQxMjM0NTY3OA==', 0, datetime('now', '-40 days'));

INSERT OR IGNORE INTO tags (id, name, slug, created_by, created_at)
VALUES
  (1, 'فلسفه و اخلاق', 'philosophy-ethics', 1, datetime('now', '-120 days')),
  (2, 'هوش مصنوعی', 'ai-tech', 1, datetime('now', '-120 days')),
  (3, 'اقتصاد و جامعه', 'economics-society', 2, datetime('now', '-110 days')),
  (4, 'مغالطات و منطق', 'fallacies-logic', 3, datetime('now', '-100 days')),
  (5, 'علم و اپیستمولوژی', 'epistemology-science', 4, datetime('now', '-90 days')),
  (6, 'آموزش و یادگیری', 'education-learning', 2, datetime('now', '-80 days')),
  (7, 'رسانه و اطلاعات نادرست', 'media-misinformation', 2, datetime('now', '-70 days')),
  (8, 'آزادی بیان', 'free-speech', 3, datetime('now', '-60 days'));

-- ---------- Ideas ----------

-- Idea 1 (Socrates): LLM understanding. Has a revision (confidence drifted down) + a debate.
INSERT OR IGNORE INTO ideas (id, user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
VALUES (
  1, 1, 'socrates_teh',
  'مدل‌های زبانی بزرگ به «فهم» نمی‌رسند، هرچند رفتارشان فهم‌نما است',
  'ادعای من این است که ترنسفورمرها صرفاً پیش‌بینی آماری توکن بعدی بر پایهٔ الگوهای متنی‌اند. بدون تجسم فیزیکی (Embodiment)، علیت‌سنجی مستقل و مدلی از جهان که از تعامل فعال برآمده باشد، آنچه می‌بینیم شباهت ساختاری به فهم است، نه خود فهم.',
  65,
  'جان سرل، «اتاق چینی» (1980)؛ مقالات دربارهٔ تمایز نحو و معناشناسی',
  'اگر مدلی بدون تعامل فیزیکی صرفاً از متن، توانایی تعمیم علی و آزمون فرضیه در محیط تازه نشان دهد، این ادعا ضعیف می‌شود.',
  1, datetime('now', '-40 days'), datetime('now', '-20 days')
);

INSERT OR IGNORE INTO idea_versions (id, idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
VALUES
  (1, 1, 1,
   'مدل‌های زبانی بزرگ صرفاً پیش‌بینی آماری‌اند و درکی از معنا ندارند',
   'ترنسفورمرها الگوهای متنی را بازتولید می‌کنند و هیچ رجوع خارجی به واقعیت ندارند. توانایی زبانی چیزی دربارهٔ فهم نمی‌گوید.',
   85,
   'جان سرل، اتاق چینی',
   '',
   datetime('now', '-40 days')),
  (2, 1, 2,
   'مدل‌های زبانی بزرگ به «فهم» نمی‌رسند، هرچند رفتارشان فهم‌نما است',
   'ادعای من این است که ترنسفورمرها صرفاً پیش‌بینی آماری توکن بعدی بر پایهٔ الگوهای متنی‌اند. بدون تجسم فیزیکی (Embodiment)، علیت‌سنجی مستقل و مدلی از جهان که از تعامل فعال برآمده باشد، آنچه می‌بینیم شباهت ساختاری به فهم است، نه خود فهم.',
   65,
   'جان سرل، «اتاق چینی» (1980)؛ مقالات دربارهٔ تمایز نحو و معناشناسی',
   'اگر مدلی بدون تعامل فیزیکی صرفاً از متن، توانایی تعمیم علی و آزمون فرضیه در محیط تازه نشان دهد، این ادعا ضعیف می‌شود.',
   datetime('now', '-20 days'));

INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (1, 2), (1, 5);

-- Idea 2 (Ali): UBI. Closed debate.
INSERT OR IGNORE INTO ideas (id, user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
VALUES (
  2, 2, 'ali_rezaei',
  'درآمد پایه همگانی پایدارترین پاسخ به بیکاری ساختاری ناشی از اتوماسیون است',
  'با ورود هوش مصنوعی به مشاغل خدماتی و شناختی، سرعت نابودی مشاغل از خلق مشاغل جدید پیشی می‌گیرد. درآمد پایه، کف معیشتی بدون پیش‌شرط فراهم می‌کند که شوک بازار کار را خنثی و قدرت چانه‌زنی نیروی کار را حفظ می‌کند.',
  60,
  'آزمایش‌های پایلوت UBI در فنلاند و کنیا؛ مدل صندوق آلاسکا',
  'اگر در بازه‌ای کوتاه، نرخ اشتغال جدید از نرخ حذف مشاغل پیشی بگیرد، ضرورت UBI کاهش می‌یابد.',
  1, datetime('now', '-30 days'), datetime('now', '-30 days')
);
INSERT OR IGNORE INTO idea_versions (id, idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
VALUES (3, 2, 1,
  'درآمد پایه همگانی پایدارترین پاسخ به بیکاری ساختاری ناشی از اتوماسیون است',
  'با ورود هوش مصنوعی به مشاغل خدماتی و شناختی، سرعت نابودی مشاغل از خلق مشاغل جدید پیشی می‌گیرد. درآمد پایه، کف معیشتی بدون پیش‌شرط فراهم می‌کند که شوک بازار کار را خنثی و قدرت چانه‌زنی نیروی کار را حفظ می‌کند.',
  60,
  'آزمایش‌های پایلوت UBI در فنلاند و کنیا؛ مدل صندوق آلاسکا',
  'اگر در بازه‌ای کوتاه، نرخ اشتغال جدید از نرخ حذف مشاغل پیشی بگیرد، ضرورت UBI کاهش می‌یابد.',
  datetime('now', '-30 days'));
INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (2, 3);

-- Idea 3 (Mehdi): moral relativism. Open with two pending replies.
INSERT OR IGNORE INTO ideas (id, user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
VALUES (
  3, 4, 'mehdi_k',
  'نسبی‌گرایی اخلاقی خودابطال‌گر است، اما نه به آن سادگی که گفته می‌شود',
  'اگر کسی بگوید «هیچ حقیقت اخلاقی عینی وجود ندارد»، خود این گزاره را به‌عنوان حکمی عام و صادق مطرح می‌کند. با این حال باید میان عینیت‌گرایی متافیزیکی و بن‌بست‌های عملی نسبی‌گرایی تفکیک کرد.',
  55,
  '',
  'اگر بتوان صورت‌بندی‌ای از نسبی‌گرایی ساخت که خودارجاع نباشد، این ادعا رد می‌شود.',
  1, datetime('now', '-10 days'), datetime('now', '-10 days')
);
INSERT OR IGNORE INTO idea_versions (id, idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
VALUES (4, 3, 1,
  'نسبی‌گرایی اخلاقی خودابطال‌گر است، اما نه به آن سادگی که گفته می‌شود',
  'اگر کسی بگوید «هیچ حقیقت اخلاقی عینی وجود ندارد»، خود این گزاره را به‌عنوان حکمی عام و صادق مطرح می‌کند. با این حال باید میان عینیت‌گرایی متافیزیکی و بن‌بست‌های عملی نسبی‌گرایی تفکیک کرد.',
  55, '',
  'اگر بتوان صورت‌بندی‌ای از نسبی‌گرایی ساخت که خودارجاع نباشد، این ادعا رد می‌شود.',
  datetime('now', '-10 days'));
INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (3, 1), (3, 4);

-- Idea 4 (Sara): education. No responses yet.
INSERT OR IGNORE INTO ideas (id, user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
VALUES (
  4, 3, 'sara_rad',
  'نظام آموزشی نمره‌محور تفکر نقادانه را سرکوب می‌کند، نه پرورش می‌دهد',
  'ساختار نمره‌محور، استانداردسازی آزمون‌ها و تأکید بر حفظ پاسخ‌های معین به‌جای طرح پرسش‌های اصیل، تفکر انتقادی را فلج می‌کند. بدون بازطراحی حول گفت‌وگو و پژوهش‌محوری، آموزش رسمی بیشتر کارکرد جامعه‌پذیری انفعالی دارد.',
  70,
  'کن رابینسون؛ پژوهش‌های سنجش تفکر انتقادی',
  '',
  1, datetime('now', '-5 days'), datetime('now', '-5 days')
);
INSERT OR IGNORE INTO idea_versions (id, idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
VALUES (5, 4, 1,
  'نظام آموزشی نمره‌محور تفکر نقادانه را سرکوب می‌کند، نه پرورش می‌دهد',
  'ساختار نمره‌محور، استانداردسازی آزمون‌ها و تأکید بر حفظ پاسخ‌های معین به‌جای طرح پرسش‌های اصیل، تفکر انتقادی را فلج می‌کند. بدون بازطراحی حول گفت‌وگو و پژوهش‌محوری، آموزش رسمی بیشتر کارکرد جامعه‌پذیری انفعالی دارد.',
  70, 'کن رابینسون؛ پژوهش‌های سنجش تفکر انتقادی', '', datetime('now', '-5 days'));
INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (4, 6), (4, 4);

-- Idea 5 (Nima): scientific realism. Has debate.
INSERT OR IGNORE INTO ideas (id, user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
VALUES (
  5, 5, 'nima_d',
  'نظریه‌های علمی تصویری صادق از ساختار واقعیت می‌دهند، نه صرفاً ابزار پیش‌بینی',
  'استدلال «عدم معجزه» نشان می‌دهد اگر نظریه‌های علمی موفق به واقعیت اشاره نکنند، موفقیت تجربی چشمگیرشان توضیح‌ناپذیر می‌ماند. پس باید موجودیت‌های غیرقابل‌مشاهدهٔ مفروض را واقعی دانست.',
  50,
  'استدلال عدم معجزه (پاتنم)',
  'نمایش موفقیت پیش‌بینی بدون هیچ ادعای هستی‌شناختی، این استدلال را تضعیف می‌کند.',
  1, datetime('now', '-7 days'), datetime('now', '-7 days')
);
INSERT OR IGNORE INTO idea_versions (id, idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
VALUES (6, 5, 1,
  'نظریه‌های علمی تصویری صادق از ساختار واقعیت می‌دهند، نه صرفاً ابزار پیش‌بینی',
  'استدلال «عدم معجزه» نشان می‌دهد اگر نظریه‌های علمی موفق به واقعیت اشاره نکنند، موفقیت تجربی چشمگیرشان توضیح‌ناپذیر می‌ماند. پس باید موجودیت‌های غیرقابل‌مشاهدهٔ مفروض را واقعی دانست.',
  50, 'استدلال عدم معجزه (پاتنم)',
  'نمایش موفقیت پیش‌بینی بدون هیچ ادعای هستی‌شناختی، این استدلال را تضعیف می‌کند.',
  datetime('now', '-7 days'));
INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (5, 5), (5, 1);

-- ---------- Responses ----------

-- Structured challenge on Idea 1 (Sara), accepted → Debate 1
INSERT OR IGNORE INTO idea_responses (id, idea_id, user_id, kind, content, status, created_at)
VALUES (
  1, 1, 3, 'challenge',
  'فهم یک طیف است نه یک ویژگی صفر و یکی. وقتی سیستمی مفاهیم را ترکیب می‌کند، چندمرحله‌ای استدلال می‌کند و یادگیری را به حوزه‌های تازه منتقل می‌کند، تفکیک آن از درک انسانی بی‌پایه و برآمده از شهودگرایی زیست‌شناختی است.',
  'debating', datetime('now', '-35 days')
);

-- Reply on Idea 2 (Mehdi)
INSERT OR IGNORE INTO idea_responses (id, idea_id, user_id, kind, content, status, created_at)
VALUES (
  2, 2, 4, 'reply',
  'من با هدف موافقم اما با ابزار مخالف: تضمین اشتغال هدفمند و بازآموزی مهارتی، با هزینهٔ کمتر و بدون تورم، همان اثر را دارد.',
  'pending', datetime('now', '-28 days')
);

-- Two pending replies on Idea 3
INSERT OR IGNORE INTO idea_responses (id, idea_id, user_id, kind, content, status, created_at)
VALUES
  (3, 3, 5, 'reply',
   'نسبی‌گرایی ادعای حقیقت مطلق دربارهٔ جهان نمی‌کند؛ گزاره‌ای تبیینی دربارهٔ ماهیت قراردادهای اجتماعی است. تفکیک نقد درون‌گفتمانی از تحمیل برون‌گفتمانی این بن‌بست را باز می‌کند.',
   'pending', datetime('now', '-8 days')),
  (4, 3, 6, 'challenge',
   'عینیت‌گرایی اخلاقی اغلب پوششی برای هژمونی قدرت‌های غالب بوده است. فهم زمینه‌مند ارزش‌ها به معنای پذیرش ظلم نیست، بلکه به رسمیت شناختن تکثر عقلانیت است.',
   'pending', datetime('now', '-6 days'));

-- Structured challenge on Idea 5 (Ali), accepted → Debate 2
INSERT OR IGNORE INTO idea_responses (id, idea_id, user_id, kind, content, status, created_at)
VALUES (
  5, 5, 2, 'challenge',
  'استقرای بدبینانهٔ تاریخی نشان می‌دهد بیشتر نظریه‌های علمی گذشته که به‌شدت موفق بودند، در نهایت باطل شدند. بنابراین ابزارگرایی و ضدواقع‌گرایی ساختاری عقلانی‌تر است.',
  'debating', datetime('now', '-6 days')
);

-- ---------- Debates ----------

INSERT OR IGNORE INTO debates (id, idea_id, response_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at)
VALUES (
  1, 1, 1,
  1, 'socrates_teh', 3,
  'مدل‌های زبانی بزرگ به «فهم» نمی‌رسند، هرچند رفتارشان فهم‌نما است',
  'in_progress', datetime('now', '-35 days'), datetime('now', '-2 hours')
);
INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (1, 2), (1, 5);
INSERT OR IGNORE INTO debate_messages (id, debate_id, user_id, content, created_at)
VALUES
  (1, 1, 1, 'مسئله تمایز نحو از معناشناسی است. دستکاری دقیق نمادها به معنای آگاهی از محتوای نمادها نیست.', datetime('now', '-34 days')),
  (2, 1, 3, 'تمثیل اتاق چینی فرض می‌کند کل سیستم ناآگاه است، اما فهم می‌تواند در سطح ساختار و بازنمایی چندبعدی شکل بگیرد.', datetime('now', '-30 days')),
  (3, 1, 1, 'این بازنمایی‌ها همچنان فاقد مقصودمندی و تعامل فعال با محیط‌اند؛ فشرده‌سازی کارآمد توزیع داده‌اند، نه فهم.', datetime('now', '-20 days')),
  (4, 1, 3, 'مقصودمندی انسان هم برآمده از تکامل و بهینه‌سازی پاداش است. تفاوت زیرساخت، دلیل منطقی انکار شناخت نیست.', datetime('now', '-1 day'));

INSERT OR IGNORE INTO debates (id, idea_id, response_id, creator_id, creator_username, opponent_id, title, status, closed_reason, closed_at, created_at, updated_at)
VALUES (
  2, 5, 5,
  5, 'nima_d', 2,
  'نظریه‌های علمی تصویری صادق از ساختار واقعیت می‌دهند، نه صرفاً ابزار پیش‌بینی',
  'closed', 'mutual', datetime('now', '-2 days'), datetime('now', '-6 days'), datetime('now', '-2 days')
);
INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (2, 5), (2, 1);
INSERT OR IGNORE INTO debate_messages (id, debate_id, user_id, content, created_at)
VALUES
  (5, 2, 5, 'واقع‌گرایی ساختاری آنچه در گذر نظریه‌های موفق حفظ می‌شود را به‌درستی جدا می‌کند: ساختار ریاضی و روابط، نه ماهیت صوری نام‌گذاری‌ها.', datetime('now', '-6 days')),
  (6, 2, 2, 'تغییرات هستی‌شناختی در انقلاب‌های علمی نشان می‌دهد ساختارها بی‌بار تفسیری وجود ندارند؛ ادعای صدق دربارهٔ امر نامشاهده‌پذیر مازاد است.', datetime('now', '-4 days')),
  (7, 2, 5, 'مازاد بودن یک ادعا آن را باطل نمی‌کند؛ اگر بهترین تبیین موفقیت علم باشد، واقع‌گرایی موجه است.', datetime('now', '-3 days')),
  (8, 2, 2, 'بهترین تبیین می‌تواند ابزارگرایانه بماند: نظریه‌ها ابزارهای ریاضی موفق‌اند، نه تصویر صادق.', datetime('now', '-2 days'));

-- ---------- Follows ----------
INSERT OR IGNORE INTO follows (follower_id, followee_id, created_at) VALUES
  (2, 1, datetime('now', '-30 days')),
  (3, 1, datetime('now', '-30 days')),
  (5, 1, datetime('now', '-20 days')),
  (1, 3, datetime('now', '-25 days')),
  (4, 1, datetime('now', '-25 days')),
  (4, 3, datetime('now', '-15 days')),
  (6, 3, datetime('now', '-12 days')),
  (1, 2, datetime('now', '-18 days')),
  (5, 2, datetime('now', '-10 days')),
  (3, 5, datetime('now', '-8 days'));

-- ---------- Votes ----------
INSERT OR IGNORE INTO votes (user_id, voteable_type, voteable_id)
VALUES
  (1, 'idea', 1), (2, 'idea', 1), (4, 'idea', 1), (5, 'idea', 1), (6, 'idea', 1),
  (1, 'idea', 2), (3, 'idea', 2), (5, 'idea', 2),
  (2, 'idea', 3), (3, 'idea', 3),
  (1, 'idea', 4), (4, 'idea', 4),
  (3, 'idea', 5), (4, 'idea', 5), (5, 'idea', 5),
  (1, 'idea_response', 1), (4, 'idea_response', 1), (5, 'idea_response', 1),
  (2, 'idea_response', 5), (3, 'idea_response', 5),
  (1, 'debate', 1), (2, 'debate', 1), (4, 'debate', 1), (5, 'debate', 1), (6, 'debate', 1),
  (1, 'debate', 2), (3, 'debate', 2), (5, 'debate', 2),
  (2, 'message', 2), (4, 'message', 1), (5, 'message', 1), (6, 'message', 2),
  (1, 'message', 3), (5, 'message', 3), (2, 'message', 4), (6, 'message', 4);

-- ---------- Roles / bios ----------
UPDATE users SET role='judge' WHERE id=1;
UPDATE users SET bio='جستجوگر حقیقت؛ علاقه‌مند به فلسفه ذهن و منطق' WHERE id=1;
UPDATE users SET bio='پژوهشگر اقتصاد و سیاست‌گذاری عمومی' WHERE id=2;
UPDATE users SET bio='دانشجوی فلسفه علم؛ علاقه‌مند به اپیستمولوژی' WHERE id=3;
UPDATE users SET bio='علاقه‌مند به اخلاق و فلسفه اخلاق کاربردی' WHERE id=4;
UPDATE users SET bio='کارآفرین؛ کنجکاو دربارهٔ فلسفه علم' WHERE id=5;
UPDATE users SET bio='روان‌شناسی و جامعه' WHERE id=6;

-- ---------- Sample flags ----------
INSERT OR IGNORE INTO flags (flagger_id, flaggable_type, flaggable_id, reason, details, created_at)
VALUES
  (6, 'message', 4, 'derailing', 'این فریمینگ بحث را از موضوع اصلی منحرف می‌کند', datetime('now', '-1 hour')),
  (5, 'idea', 4, 'pressure', 'لحن قطعی و فشار روانی برای پذیرش ادعا', datetime('now', '-30 minutes'));
