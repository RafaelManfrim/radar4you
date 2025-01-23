// eslint-disable-next-line
import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
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
    }
  }
}
