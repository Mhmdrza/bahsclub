-- Seed users
-- Passwords are all hashed for 'password123'
-- Generated using standard webcrypto PBKDF2 iterations: 100000, salt
INSERT OR IGNORE INTO users (id, username, email, password_hash, password_salt, is_trusted, created_at)
VALUES 
  (1, 'socrates_teh', 'socrates@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-20 days')),
  (2, 'ali_rezaei', 'ali@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-18 days')),
  (3, 'sara_rad', 'sara@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-15 days')),
  (4, 'mehdi_k', 'mehdi@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 1, datetime('now', '-12 days')),
  (5, 'nima_d', 'nima@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 0, datetime('now', '-10 days')),
  (6, 'yalda_m', 'yalda@bahs.club', 'qM8V4u5w0K9eXw8p4gLzO2k1bJ7dF8mQ5tU6vY7wX8A=', 'dGVzdHNhbHQxMjM0NTY3OA==', 0, datetime('now', '-8 days'));

-- Seed tags
INSERT OR IGNORE INTO tags (id, name, slug, created_by, created_at)
VALUES
  (1, 'فلسفه و اخلاق', 'philosophy-ethics', 1, datetime('now', '-20 days')),
  (2, 'هوش مصنوعی', 'ai-tech', 1, datetime('now', '-20 days')),
  (3, 'اقتصاد و جامعه', 'economics-society', 2, datetime('now', '-18 days')),
  (4, 'مغالطات و منطق', 'fallacies-logic', 3, datetime('now', '-15 days')),
  (5, 'علم و اپیستمولوژی', 'epistemology-science', 4, datetime('now', '-12 days')),
  (6, 'آموزش و یادگیری', 'education-learning', 2, datetime('now', '-10 days'));

-- Debate 1: In Progress (AI & Consciousness)
INSERT OR IGNORE INTO debates (id, creator_id, creator_username, opponent_id, title, initial_statement, status, max_turns, current_turn, next_speaker, created_at, updated_at)
VALUES (
  1,
  1,
  'socrates_teh',
  3,
  'آیا مدل‌های زبانی بزرگ (LLM) می‌توانند به «فهم واقعی» یا آگاهی دست یابند؟',
  'ادعای من این است که ساختار کنونی ترنسفورمرها صرفاً پیش‌بینی آماری کلمه بعدی بر اساس الگوهای متنی است. بدون تجسم فیزیکی (Embodiment)، علیت‌سنجی واقعی و مدلی مستقل از جهان خارج، هیچ درکی از معنا رخ نمی‌دهد و آنچه می‌بینیم شباهت ساختاری به فهم است، نه خود فهم.',
  'in_progress',
  6,
  4,
  1,
  datetime('now', '-5 days'),
  datetime('now', '-2 hours')
);

INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (1, 2), (1, 5);

INSERT OR IGNORE INTO challengers (id, debate_id, user_id, position_statement, status, created_at)
VALUES (
  1,
  1,
  3,
  'فهم یک طیف است نه یک ویژگی صفر و یکی. وقتی یک سیستم قادر به ترکیب مفاهیم جدید، استدلال چندمرحله‌ای و انتقال یادگیری به حوزه‌های نادیده باشد، تفکیک آن از درک انسانی بی‌پایه و ناشی از شهودگرایی بیولوژیکی است.',
  'accepted',
  datetime('now', '-4 days')
);

INSERT OR IGNORE INTO turns (id, debate_id, user_id, turn_number, content, created_at)
VALUES
  (1, 1, 1, 1, 'مسئله تمایز بین نحو (Syntax) و معناشناسی (Semantics) است، همان‌طور که جان سرل در اتاق چینی نشان داد. دستکاری دقیق نمادها به معنای آگاهی از محتوای نمادها نیست. یک مدل پیش‌بینی توکن صرفاً همبستگی‌های زبانی را بازتولید می‌کند بدون اینکه ارجاع خارجی به واقعیت داشته باشد.', datetime('now', '-4 days')),
  (2, 1, 3, 2, 'تمثیل اتاق چینی فرض می‌کند که کل سیستم ناآگاه است، اما در سیستم‌های پیچیده، فهم در سطح کل ساختار و بردارهای بازنمایی چندبعدی شکل می‌گیرد. آزمون‌های جدید نشان می‌دهند که مدل‌های زبانی نقشه‌های درونی پیوسته‌ای از جهان و فضا-زمان می‌سازند، نه تطبیق سطحی رشته‌ها.', datetime('now', '-3 days')),
  (3, 1, 1, 3, 'این نقشه‌های درونی همچنان فاقد مقصودمندی (Intentionality) و تعامل فعال با محیط هستند. بدون امکان خطا و تصحیح در یک بستر زیستی-فیزیکی، این بازنمایی‌ها محتوای واقعی ندارند بلکه فشرده‌سازی کارآمد توزیع داده‌های انسانی هستند.', datetime('now', '-2 days')),
  (4, 1, 3, 4, 'مقصودمندی در انسان نیز برآمده از فرآیند تکامل و بهینه‌سازی توابع پاداش بقاست. تفاوت در زیرساخت سلولی در برابر سیلیکونی، دلیلی منطقی بر انکار وجود درک و شناخت نیست. اگر رفتاری کارکردی، ابطال‌پذیر و تعمیم‌پذیر باشد، تعریف سنتی ادراک بر آن منطبق است.', datetime('now', '-1 day'));

-- Debate 2: Closed (Universal Basic Income)
INSERT OR IGNORE INTO debates (id, creator_id, creator_username, opponent_id, title, initial_statement, status, max_turns, current_turn, next_speaker, closure_requested_by, closed_reason, closed_at, created_at, updated_at)
VALUES (
  2,
  2,
  'ali_rezaei',
  4,
  'درآمد پایه همگانی (UBI) پایدارترین راهکار برای مقابله با بیکاری ساختاری ناشی از اتوماسیون است',
  'با ورود هوش مصنوعی به مشاغل خدماتی و شناختی، سرعت نابودی مشاغل از خلق مشاغل جدید پیشی خواهد گرفت. درآمد پایه همگانی، کف معیشتی بدون پیش‌شرط فراهم می‌کند که شوک بازار کار را خنثی کرده و قدرت چانه‌زنی نیروی کار را حفظ می‌کند.',
  'closed',
  4,
  4,
  NULL,
  NULL,
  'max_turns',
  datetime('now', '-6 days'),
  datetime('now', '-12 days'),
  datetime('now', '-6 days')
);

INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (2, 3);

INSERT OR IGNORE INTO challengers (id, debate_id, user_id, position_statement, status, created_at)
VALUES (
  2,
  2,
  4,
  'اجرای UBI به دلیل بار مالیاتی فلج‌کننده موجب تورم مزمن و کاهش انگیزه نوآوری و مشارکت اقتصادی فعال می‌شود. تقویت تضمین اشتغال هدفمند و بازآموزی مهارتی بسیار اثربخش‌تر است.',
  'accepted',
  datetime('now', '-11 days')
);

INSERT OR IGNORE INTO turns (id, debate_id, user_id, turn_number, content, created_at)
VALUES
  (5, 2, 2, 1, 'هزینه سرسام‌آور بوروکراسی سیستم‌های رفاهی کنونی بیشتر از توزیع مستقیم پول است. UBI کرامت فردی را بدون تست وسع حفظ می‌کند و اجازه می‌دهد افراد به جای کارهای بیهوده به خلق ارزش واقعی بپردازند.', datetime('now', '-11 days')),
  (6, 2, 4, 2, 'محاسبات ساده اقتصادی نشان می‌دهد پرداخت یک درآمد شایسته به کل جمعیت به بودجه‌ای معادل بخش بزرگی از تولید ناخالص داخلی نیاز دارد که جز با چاپ پول تورم‌زا یا مالیات سنگین بر بهره‌وری قابل تامین نیست.', datetime('now', '-9 days')),
  (7, 2, 2, 3, 'منبع تامین می‌تواند مالیات بر ارزش افزوده اتوماسیون و رانت منابع طبیعی (مدل صندوق آلاسکا) باشد، نه مالیات بر درآمد طبقه متوسط. این بازتوزیع رانت فناوری است نه اتلاف منابع.', datetime('now', '-8 days')),
  (8, 2, 4, 4, 'مالیات بر اتوماسیون انگیزه رشد بهره‌وری کل را سرکوب می‌کند و مانع توسعه فناوری می‌شود. تاریخ نشان داده سیاست‌های مهار تکنولوژی به فقر بیشتر انجامیده‌اند.', datetime('now', '-6 days'));

-- Debate 3: Open / Challengers stage
INSERT OR IGNORE INTO debates (id, creator_id, creator_username, opponent_id, title, initial_statement, status, max_turns, current_turn, next_speaker, created_at, updated_at)
VALUES (
  3,
  4,
  'mehdi_k',
  NULL,
  'نسبی‌گرایی اخلاقی منطقاً خودابطال‌گر و در عمل ناممکن است',
  'اگر کسی ادعا کند «هیچ حقیقت اخلاقی عینی وجود ندارد و همه چیز وابسته به فرهنگ یا فرد است»، خود این گزاره را به عنوان یک حکم عام و صادق مطرح می‌کند. علاوه بر این، در مقام عمل، نسبی‌گرایی هرگونه نقد علیه ظلم‌های ساختاری تاریخی را غیرممکن می‌سازد.',
  'challengers',
  6,
  0,
  NULL,
  datetime('now', '-2 days'),
  datetime('now', '-1 day')
);

INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (3, 1), (3, 4);

INSERT OR IGNORE INTO challengers (id, debate_id, user_id, position_statement, status, created_at)
VALUES
  (3, 3, 5, 'نسبی‌گرایی ادعای حقیقت مطلق درباره جهان نمی‌کند، بلکه گزاره‌ای تبیینی درباره ماهیت قراردادهای اجتماعی است. تفکیک بین نقد درون‌گفتمانی و تحمیل برون‌گفتمانی این بن‌بست ظاهری را حل می‌کند.', 'pending', datetime('now', '-1 day')),
  (4, 3, 6, 'عینیت‌گرایی اخلاقی همواره پوششی برای هژمونی قدرت‌های غالب بوده است. فهم زمینه‌مند ارزش‌ها به معنای پذیرش ظلم نیست بلکه به رسمیت شناختن تکثر عقلانیت است.', 'pending', datetime('now', '-12 hours'));

-- Debate 4: Open with no challengers yet
INSERT OR IGNORE INTO debates (id, creator_id, creator_username, opponent_id, title, initial_statement, status, max_turns, current_turn, next_speaker, created_at, updated_at)
VALUES (
  4,
  3,
  'sara_rad',
  NULL,
  'نظام‌های آموزشی سنتی بیش از آنکه تفکر نقادانه را پرورش دهند، آن را سرکوب می‌کنند',
  'ساختار نمره‌محور، استانداردسازی آزمون‌ها و تاکید بر حفظ پاسخ‌های معین به جای طرح پرسش‌های اصیل، تفکر انتقادی دانش‌آموزان را فلج می‌کند. بدون بازطراحی ساختار حول گفتگو و پژوهش‌محوری، آموزش رسمی بیشتر کارکرد جامعه‌پذیری انفعالی دارد.',
  'open',
  6,
  0,
  NULL,
  datetime('now', '-1 day'),
  datetime('now', '-1 day')
);

INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (4, 6), (4, 4);

-- Debate 5: In Progress (Scientific Realism)
INSERT OR IGNORE INTO debates (id, creator_id, creator_username, opponent_id, title, initial_statement, status, max_turns, current_turn, next_speaker, created_at, updated_at)
VALUES (
  5,
  1,
  'socrates_teh',
  2,
  'نظریه‌های علمی تصویر صادقی از ساختار واقعیت ارایه می‌دهند، نه صرفاً ابزارهای پیش‌بینی',
  'استدلال عدم معجزه (No Miracles Argument) نشان می‌دهد اگر نظریه‌های علمی موفق به واقعیت اشاره نکنند، موفقیت تجربی چشمگیر آن‌ها معجزه‌ای غیرقابل توضیح خواهد بود. بنابراین باید موجودیت‌های غیرقابل مشاهده مفروض (مانند کوارک‌ها و میدان‌ها) را واقعی دانست.',
  'in_progress',
  6,
  2,
  1,
  datetime('now', '-3 days'),
  datetime('now', '-5 hours')
);

INSERT OR IGNORE INTO debate_tags (debate_id, tag_id) VALUES (5, 5), (5, 1);

INSERT OR IGNORE INTO challengers (id, debate_id, user_id, position_statement, status, created_at)
VALUES (
  5,
  5,
  2,
  'استقرای بدبینانه تاریخی نشان می‌دهد اکثر نظریه‌های علمی گذشته که شدیداً موفق بودند در نهایت باطل شدند (مانند نظریه فلوژیستون یا اتر). بنابراین ابزارگرایی و ضدواقع‌گرایی ساختاری رویکردی عقلانی‌تر است.',
  'accepted',
  datetime('now', '-3 days')
);

INSERT OR IGNORE INTO turns (id, debate_id, user_id, turn_number, content, created_at)
VALUES
  (9, 5, 1, 1, 'پاسخ به استقرای بدبینانه، واقع‌گرایی ساختاری است؛ آنچه در گذر از نظریه‌های موفق حفظ می‌شود ساختار ریاضی و روابط میان پدیده‌هاست، نه لزوماً ماهیت صوری نام‌گذاری‌ها. هندسه فضا-زمان یا قوانین ماکسول پایدار مانده‌اند.', datetime('now', '-2 days')),
  (10, 5, 2, 2, 'تغییرات بنیادین هستی‌شناختی در انقلاب‌های علمی نشان می‌دهد ساختارها بدون بار تفسیری وجود ندارند. نظریه‌ها ابزارهای ریاضی موفقی برای نجات پدیدارها هستند و ادعای صدق گزاره‌ای درباره امر نامشاهده‌پذیر غیرضروری و مازاد است.', datetime('now', '-1 day'));

-- Seed Votes
INSERT OR IGNORE INTO votes (user_id, voteable_type, voteable_id)
VALUES
  (1, 'debate', 1),
  (2, 'debate', 1),
  (4, 'debate', 1),
  (5, 'debate', 1),
  (6, 'debate', 1),
  (1, 'debate', 2),
  (3, 'debate', 2),
  (5, 'debate', 2),
  (2, 'debate', 3),
  (3, 'debate', 3),
  (1, 'debate', 4),
  (4, 'debate', 4),
  (3, 'debate', 5),
  (4, 'debate', 5),
  (5, 'debate', 5),
  (1, 'turn', 2),
  (2, 'turn', 2),
  (4, 'turn', 1),
  (5, 'turn', 1),
  (6, 'turn', 2),
  (1, 'turn', 3),
  (5, 'turn', 3),
  (2, 'turn', 4),
  (6, 'turn', 4),
  (1, 'turn', 5),
  (3, 'turn', 5),
  (5, 'turn', 6),
  (6, 'turn', 6),
  (3, 'turn', 9),
  (4, 'turn', 9),
  (5, 'turn', 10);
