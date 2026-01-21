import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/core/api'
import { useAuth } from '@/core/auth'
import type { User } from '@/core/auth'

import type { LoginFormData, RegisterFormData } from '../types'

// Replace with actual API call
async function loginUser(
  data: LoginFormData
): Promise<{ token: string; user: User }> {
  const response = await apiClient.post<{ token: string; user: User }>(
    '/auth/login',
    {
      email: data.email,
      password: data.password,
    }
  )
  return response.data
}

// Replace with actual API call
async function registerUser(
  data: RegisterFormData
): Promise<{ token: string; user: User }> {
  const response = await apiClient.post<{ token: string; user: User }>(
    '/auth/register',
    {
      email: data.email,
      password: data.password,
      name: data.name,
    }
  )
  return response.data
}

export function useLoginMutation() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user)
    },
  })
}

export function useRegisterMutation() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.token, data.user)
    },
  })
}
