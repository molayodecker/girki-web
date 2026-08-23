import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((value) => isValidPhoneNumber(value), 'Enter a valid phone number'),
})

export type PhoneFormValues = z.infer<typeof phoneSchema>

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit verification code'),
})

export type OtpFormValues = z.infer<typeof otpSchema>

export const emailPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type EmailPasswordValues = z.infer<typeof emailPasswordSchema>

export const chefPersonalSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  city: z.string().min(2, 'Enter your city'),
  country: z.string().min(2, 'Enter your country'),
})

export type ChefPersonalValues = z.infer<typeof chefPersonalSchema>

export const chefProfileSchema = z.object({
  professionalName: z.string().min(2, 'Enter a professional name'),
  yearsExperience: z.number().int().min(0).max(60),
  bio: z.string().min(40, 'Tell guests a bit more about your cooking (40+ characters)'),
  specialties: z.string().min(2, 'Add at least one specialty'),
})

export type ChefProfileValues = z.infer<typeof chefProfileSchema>

export type SignupIntent = 'customer' | 'chef' | 'chef-portal'

export const SIGNUP_INTENT_KEY = 'girki_signup_intent'
export const PENDING_PHONE_KEY = 'girki_pending_phone'
