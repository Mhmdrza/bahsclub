import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, "نام کاربری باید حداقل ۲ حرف باشد").max(30, "نام کاربری حداکثر ۳۰ حرف"),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ حرف باشد").max(100).regex(/[a-zA-Z]/, "رمز عبور باید شامل حروف باشد").regex(/[0-9]/, "رمز عبور باید شامل عدد باشد"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const createDebateSchema = z.object({
  title: z.string().min(5, "عنوان حداقل ۵ حرف").max(200, "عنوان حداکثر ۲۰۰ حرف"),
  initialStatement: z.string().min(50, "بیانیه اولیه حداقل ۵۰ حرف").max(5000),
  tags: z.array(z.string()).min(1, "حداقل یک برچسب").max(5, "حداکثر ۵ برچسب"),
});

export const challengeSchema = z.object({
  positionStatement: z.string().min(50, "موضع‌گیری حداقل ۵۰ حرف").max(5000),
});

export const turnSchema = z.object({
  content: z.string().min(10, "پیام حداقل ۱۰ حرف").max(5000, "پیام حداکثر ۵۰۰۰ حرف"),
});

export const flagSchema = z.object({
  flaggableType: z.enum(["debate", "turn"]),
  flaggableId: z.number(),
  reason: z.enum(["personal_attack", "insulting_question", "derailing", "motive_guessing", "pressure", "spam", "other"]),
  details: z.string().max(500).optional(),
});

export const bioSchema = z.object({
  bio: z.string().max(500, "بیوگرافی حداکثر ۵۰۰ حرف"),
});