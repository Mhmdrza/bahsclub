import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "نام کاربری باید حداقل ۲ حرف باشد").max(30, "نام کاربری حداکثر ۳۰ حرف"),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ حرف باشد").max(100).regex(/[a-zA-Z]/, "رمز عبور باید شامل حروف باشد").regex(/[0-9]/, "رمز عبور باید شامل عدد باشد"),
  inviteCode: z.string().optional(),
});

export const waitlistSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است"),
  note: z.string().max(200, "حداکثر ۲۰۰ حرف").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const createIdeaSchema = z.object({
  title: z.string().min(5, "عنوان حداقل ۵ حرف").max(200, "عنوان حداکثر ۲۰۰ حرف"),
  reasoning: z.string().min(50, "استدلال حداقل ۵۰ حرف").max(5000),
  confidence: z.number().min(0).max(100),
  sources: z.string().max(2000).optional(),
  falsifier: z.string().max(2000).optional(),
  tags: z.array(z.string()).min(1, "حداقل یک برچسب").max(5, "حداکثر ۵ برچسب"),
  openToResponse: z.boolean().optional(),
});

export const responseSchema = z.object({
  content: z.string().min(30, "پاسخ حداقل ۳۰ حرف").max(5000),
  kind: z.enum(["reply", "challenge"]).optional(),
});

export const messageSchema = z.object({
  content: z.string().min(10, "پیام حداقل ۱۰ حرف").max(5000, "پیام حداکثر ۵۰۰۰ حرف"),
});

export const flagSchema = z.object({
  flaggableType: z.enum(["idea", "idea_response", "debate", "message"]),
  flaggableId: z.number(),
  reason: z.enum(["personal_attack", "insulting_question", "derailing", "motive_guessing", "pressure", "spam", "other"]),
  details: z.string().max(500).optional(),
});

export const bioSchema = z.object({
  bio: z.string().max(500, "بیوگرافی حداکثر ۵۰۰ حرف"),
});