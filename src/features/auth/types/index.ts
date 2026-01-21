import type { loginSchema, registerSchema } from '../api/validation'
import type { z } from 'zod'

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
