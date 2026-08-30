export type ContentStatus = "draft" | "published" | "archived";

export type ArticleType = "article" | "tactic" | "practice";

export type ArticleLevel = "beginner" | "intermediate" | "advanced";

export interface ExerciseData {
  scenario: string;
  question: string;
  hints?: string[];
  answer: string;
  explanation: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  category: string;
  level: ArticleLevel;
  readingTime: number;
  order: number;
  tags: string[];
  topics: string[];
  type: ArticleType;
  publishedAt: string;
  updatedAt?: string;
  related?: string[];
  featuredOnHome?: "concept" | "tactic" | "practice";
  exercise?: ExerciseData;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  headings: TocHeading[];
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface LessonFrontmatter {
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  level: ArticleLevel;
  audience: string;
  featured?: boolean;
  sequential?: boolean;
  milestone: string;
  order: number;
  steps: string[];
}

export interface Lesson extends LessonFrontmatter {
  resolvedSteps: Article[];
}

export interface TopicFrontmatter {
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  order: number;
}

export type Topic = TopicFrontmatter;

export interface PageFrontmatter {
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  order: number;
}

export interface Page extends PageFrontmatter {
  content: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface HomeSlot {
  type: "concept" | "tactic" | "practice";
  label: string;
  articleSlug?: string;
}

export interface Principle {
  title: string;
  description: string;
}

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  nav: NavItem[];
  featuredLessonSlug?: string;
  homeSlots: HomeSlot[];
  principles: Principle[];
  livePractice: {
    title: string;
    description: string;
    href: string;
  };
}

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: ArticleLevel;
  tags: string[];
  topics: string[];
  type: ArticleType;
  readingTime: number;
  body: string;
}
