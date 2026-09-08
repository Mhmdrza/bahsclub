import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "نام کاربری باید حداقل ۲ حرف باشد").max(30, "نام کاربری حداکثر ۳۰ حرف"),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ حرف باشد").max(100).regex(/[a-zA-Z]/, "رمز عبور باید شامل حروف باشد").regex(/[0-9]/, "رمز عبور باید شامل عدد باشد"),
  inviteCode: z.string().min(1, "کد دعوت الزامی است"),
});

export const waitlistSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است"),
  note: z.string().max(200, "حداکثر ۲۰۰ حرف").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const createStatementSchema = z.object({
  title: z.string().min(5, "عنوان حداقل ۵ حرف").max(200, "عنوان حداکثر ۲۰۰ حرف"),
  content: z.string().min(50, "بیانیه حداقل ۵۰ حرف").max(5000),
  tags: z.array(z.string()).min(1, "حداقل یک برچسب").max(5, "حداکثر ۵ برچسب"),
});

export const counterSchema = z.object({
  content: z.string().min(50, "پاسخ حداقل ۵۰ حرف").max(5000),
});

export const messageSchema = z.object({
  content: z.string().min(10, "پیام حداقل ۱۰ حرف").max(5000, "پیام حداکثر ۵۰۰۰ حرف"),
});

export const flagSchema = z.object({
  flaggableType: z.enum(["statement", "counter_statement", "debate", "message"]),
  flaggableId: z.number(),
  reason: z.enum(["personal_attack", "insulting_question", "derailing", "motive_guessing", "pressure", "spam", "other"]),
  details: z.string().max(500).optional(),
});

export const bioSchema = z.object({
  bio: z.string().max(500, "بیوگرافی حداکثر ۵۰۰ حرف"),
});