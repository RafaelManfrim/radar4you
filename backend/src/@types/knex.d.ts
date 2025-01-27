// eslint-disable-next-line
import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface User {
    id: string
    email: string
    password_hash: string
    firebase_uid?: string
    login_provider: 'email' | 'google' | 'facebook'
    first_name: string
    created_at: Date
    updated_at: Date
    accepted_terms_at: Date
    is_email_notifications_enabled: boolean
    profile_picture_url?: string
    role: 'ADMIN' | 'USER'
  }

  export interface UserRefreshTokens {
    id: string
    user_id: string
    token: string
    expires_at: Date
    created_at: Date
    updated_at: Date
  }

  export interface Tables {
    users: User
    user_refresh_tokens: UserRefreshTokens
  }
}
