import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const profileStep1Schema = z.object({
  full_name: z.string().min(3).max(100),
  phone: z
    .string()
    .regex(/^\+92[0-9]{10}$/, 'Enter Pakistani number in format: +923001234567')
    .optional()
    .or(z.literal('')),
  cnic: z
    .string()
    .regex(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, 'CNIC format: 00000-0000000-0')
    .optional()
    .or(z.literal('')),
  city: z.string().optional(),
  province: z.string().optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
});

export const profileStep2Schema = z.object({
  university: z.string().min(2, 'University name required'),
  degree: z.string().min(2, 'Degree required'),
  graduation_year: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 5),
  cgpa: z.number().min(0).max(4.0).optional(),
});

export const profileStep3Schema = z.object({
  skills: z.array(z.string()).min(1, 'Select at least one skill').max(20),
  linkedin_url: z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Enter a valid GitHub URL').optional().or(z.literal('')),
});

export const applicationSchema = z.object({
  internship_id: z.string().uuid(),
  motivation_letter: z
    .string()
    .min(300, 'Motivation letter must be at least 300 characters')
    .max(2000, 'Motivation letter must be under 2000 characters'),
  relevant_experience: z.string().max(1000).optional(),
  hours_per_week: z
    .number()
    .int()
    .min(5, 'Minimum 5 hours per week')
    .max(40, 'Maximum 40 hours per week'),
  linkedin_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export const projectSubmissionSchema = z.object({
  submission_text: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your work'),
  github_url: z
    .string()
    .url('Please enter a valid GitHub URL (e.g. https://github.com/user/repo)')
    .refine((v) => v.includes('github.com'), 'URL must be a GitHub repository link'),
  file_urls: z.array(z.string()).optional(),
});

export const internshipSchema = z.object({
  title: z.string().min(5).max(100),
  category: z.string().min(1, 'Select a category'),
  description: z.string().min(100),
  requirements: z.string().min(50),
  what_you_learn: z.string().min(50),
  duration_weeks: z.number().int().refine((v) => [2, 4, 6, 8, 12].includes(v), 'Select standard duration'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  spots_total: z.number().int().min(1).max(500),
  projects: z.array(z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    resources_url: z.string().url().optional().or(z.literal('')),
    week_number: z.number().int().min(1).max(12),
  })).min(1, 'Add at least one project'),
});

export const reviewApplicationSchema = z.object({
  action: z.enum(['accept', 'reject']),
  rejection_reason: z.string().optional(),
  admin_notes: z.string().optional(),
});

export const reviewProjectSchema = z.object({
  action: z.enum(['pass', 'fail']),
  feedback: z.string().min(10, 'Please provide feedback (min 10 characters)'),
});

export const profileSchema = z.object({
  full_name: z.string().min(3).max(100),
  phone: z.string().optional().or(z.literal('')),
  cnic: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  university: z.string().min(2).optional().or(z.literal('')),
  degree_title: z.string().optional().or(z.literal('')),
  current_semester: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).catch([]),
  bio: z.string().max(500).optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;
export type InternshipInput = z.infer<typeof internshipSchema>;
export type ProfileInput = {
  full_name: string;
  phone?: string;
  cnic?: string;
  city?: string;
  university?: string;
  degree_title?: string;
  current_semester?: string;
  skills: string[];
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
};
