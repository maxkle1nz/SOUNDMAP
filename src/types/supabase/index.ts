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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          city: string | null
          region: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          city?: string | null
          region?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          city?: string | null
          region?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          profile_id: string | null
          name: string
          genre: string
          styles: string[] | null
          influences: string[] | null
          bio: string | null
          city: string
          region: string | null
          image_url: string | null
          cover_url: string | null
          listeners: number
          verified: boolean
          featured: boolean
          social_links: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          name: string
          genre: string
          styles?: string[] | null
          influences?: string[] | null
          bio?: string | null
          city: string
          region?: string | null
          image_url?: string | null
          cover_url?: string | null
          listeners?: number
          verified?: boolean
          featured?: boolean
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          name?: string
          genre?: string
          styles?: string[] | null
          influences?: string[] | null
          bio?: string | null
          city?: string
          region?: string | null
          image_url?: string | null
          cover_url?: string | null
          listeners?: number
          verified?: boolean
          featured?: boolean
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          artist_id: string
          title: string
          duration: number
          audio_url: string
          cover_url: string | null
          plays: number
          release_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          duration: number
          audio_url: string
          cover_url?: string | null
          plays?: number
          release_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          duration?: number
          audio_url?: string
          cover_url?: string | null
          plays?: number
          release_date?: string | null
          created_at?: string
        }
      }
      scenes: {
        Row: {
          id: string
          name: string
          city: string
          region: string
          description: string | null
          image_url: string | null
          primary_genres: string[] | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          city: string
          region: string
          description?: string | null
          image_url?: string | null
          primary_genres?: string[] | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city?: string
          region?: string
          description?: string | null
          image_url?: string | null
          primary_genres?: string[] | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          investor_id: string
          artist_id: string
          amount: number
          message: string | null
          public_support: boolean
          status: string
          transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          artist_id: string
          amount: number
          message?: string | null
          public_support?: boolean
          status?: string
          transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          artist_id?: string
          amount?: number
          message?: string | null
          public_support?: boolean
          status?: string
          transaction_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
