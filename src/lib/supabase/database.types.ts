export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tandas: {
        Row: {
          id: string
          name: string
          description: string | null
          contribution_amount: number
          frequency: 'weekly' | 'biweekly' | 'monthly'
          max_members: number
          current_round: number
          total_rounds: number
          status: 'forming' | 'active' | 'completed' | 'disputed'
          escrow_address: string | null
          ai_trust_score: number
          creator_id: string | null
          created_at: string
          next_payout_at: string | null
          updated_at: string | null
          network: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          contribution_amount: number
          frequency: 'weekly' | 'biweekly' | 'monthly'
          max_members: number
          current_round?: number
          total_rounds: number
          status?: 'forming' | 'active' | 'completed' | 'disputed'
          escrow_address?: string | null
          ai_trust_score?: number
          creator_id?: string | null
          created_at?: string
          next_payout_at?: string | null
          updated_at?: string | null
          network?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          contribution_amount?: number
          frequency?: 'weekly' | 'biweekly' | 'monthly'
          max_members?: number
          current_round?: number
          total_rounds?: number
          status?: 'forming' | 'active' | 'completed' | 'disputed'
          escrow_address?: string | null
          ai_trust_score?: number
          creator_id?: string | null
          created_at?: string
          next_payout_at?: string | null
          updated_at?: string | null
          network?: string
        }
      }
      tanda_members: {
        Row: {
          id: string
          tanda_id: string
          user_id: string | null
          wallet_address: string
          display_name: string
          avatar_url: string | null
          trust_score: number
          payout_position: number
          is_current_recipient: boolean
          total_contributed: number
          total_received: number
          joined_at: string
        }
        Insert: {
          id?: string
          tanda_id: string
          user_id?: string | null
          wallet_address: string
          display_name: string
          avatar_url?: string | null
          trust_score?: number
          payout_position: number
          is_current_recipient?: boolean
          total_contributed?: number
          total_received?: number
          joined_at?: string
        }
        Update: {
          id?: string
          tanda_id?: string
          user_id?: string | null
          wallet_address?: string
          display_name?: string
          avatar_url?: string | null
          trust_score?: number
          payout_position?: number
          is_current_recipient?: boolean
          total_contributed?: number
          total_received?: number
          joined_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          tanda_id: string
          member_id: string
          round: number
          amount: number
          currency: 'MXNB' | 'MXN'
          status: 'pending' | 'confirmed' | 'failed'
          bitso_tx_id: string | null
          botchain_tx_hash: string | null
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          tanda_id: string
          member_id: string
          round: number
          amount: number
          currency?: 'MXNB' | 'MXN'
          status?: 'pending' | 'confirmed' | 'failed'
          bitso_tx_id?: string | null
          botchain_tx_hash?: string | null
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          tanda_id?: string
          member_id?: string
          round?: number
          amount?: number
          currency?: 'MXNB' | 'MXN'
          status?: 'pending' | 'confirmed' | 'failed'
          bitso_tx_id?: string | null
          botchain_tx_hash?: string | null
          created_at?: string
          confirmed_at?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          tanda_id: string
          recipient_id: string
          round: number
          amount: number
          currency: 'MXNB' | 'MXN'
          status: 'scheduled' | 'processing' | 'completed' | 'failed'
          bitso_payout_id: string | null
          botchain_tx_hash: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          tanda_id: string
          recipient_id: string
          round: number
          amount: number
          currency?: 'MXNB' | 'MXN'
          status?: 'scheduled' | 'processing' | 'completed' | 'failed'
          bitso_payout_id?: string | null
          botchain_tx_hash?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          tanda_id?: string
          recipient_id?: string
          round?: number
          amount?: number
          currency?: 'MXNB' | 'MXN'
          status?: 'scheduled' | 'processing' | 'completed' | 'failed'
          bitso_payout_id?: string | null
          botchain_tx_hash?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      webhook_events: {
        Row: {
          id: string
          event_type: string
          payload: Json
          processed: boolean
          created_at: string
          network: string
        }
        Insert: {
          id?: string
          event_type: string
          payload: Json
          processed?: boolean
          created_at?: string
          network?: string
        }
        Update: {
          id?: string
          event_type?: string
          payload?: Json
          processed?: boolean
          created_at?: string
          network?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
