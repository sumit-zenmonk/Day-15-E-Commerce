export interface UserType {
  uid: string
  email: string
  name: string
  role: string
  address: any
}

export interface AuthState {
  user: UserType | null
  token: string | null
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}

export interface LoginPayload {
  email: string
  password: string
  // role: string
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