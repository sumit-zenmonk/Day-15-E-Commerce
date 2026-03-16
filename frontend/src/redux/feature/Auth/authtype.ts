export interface User {
  uid: string
  email: string
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}

export interface LoginPayload {
  email: string
  password: string
  role: string
}

export interface SignupPayload {
  username: string
  email: string
  password: string
  role: string
}

export interface AuthResponse {
  message: string
  access_token: string
}