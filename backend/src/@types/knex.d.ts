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

  export interface CardBrands {
    id: string
    name: string
    logo_url?: string
    created_at: Date
    updated_at: Date
  }

  export interface FinancialInstutions {
    id: string
    name: string
    logo_url?: string
    markup: number
    created_at: Date
    updated_at: Date
  }

  // TODO: ADICIONAR CAMPOS "SALA-VIP", "BENEFÍCIOS GERAIS" e "anuidade", "cashback", "imagem"
  export interface Cards {
    id: string
    title: string
    image_url?: string
    card_brand_id: string
    financial_institution_id: string
    points_currency: 'USD' | 'BRL'
    points_conversion_rate: number
    is_recommended: boolean
    annual_fee?: number
    benefits?: string
    vip_lounges?: string
    created_at: Date
    updated_at: Date
  }

  export interface UserCards {
    id: string
    user_id: string
    card_id: string
    is_favorite: boolean
    created_at: Date
    updated_at: Date
  }

  export interface DollarQuotes {
    id: string
    exchange_rate: number
    retrieved_at: Date
  }

  export interface Simulations {
    id: string
    user_id: string
    simulation_type: 'purchase' | 'monthly_spending' | 'period'
    amount: number
    product: string
    desired_points: number
    monthly_spending: number
    months: number
    exchange_rate?: number
    created_at: Date
    updated_at: Date
  }

  export interface SimulationCards {
    id: string
    simulation_id: string
    card_id: string
    required_spending: number
    required_months: number
    earned_points: number
  }

  export interface Tables {
    users: User
    user_refresh_tokens: UserRefreshTokens
    card_brands: CardBrands
    financial_institutions: FinancialInstutions
    cards: Cards
    user_cards: UserCards
    dollar_quotes: DollarQuotes
    simulations: Simulations
    simulation_cards: SimulationCards
  }
}
