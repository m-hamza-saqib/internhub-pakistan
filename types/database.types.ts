// Auto-generated Supabase types placeholder
// Run: supabase gen types typescript --project-id YOUR_ID > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          email: string;
          phone: string | null;
          cnic: string | null;
          city: string | null;
          province: string | null;
          country: string;
          university: string | null;
          degree: string | null;
          graduation_year: number | null;
          cgpa: number | null;
          skills: string[];
          bio: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          avatar_url: string | null;
          cv_url: string | null;
          role: 'intern' | 'admin';
          profile_completeness: number;
          is_suspended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      internships: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          description: string;
          requirements: string;
          what_you_learn: string;
          duration_weeks: number;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          spots_total: number;
          spots_filled: number;
          is_published: boolean;
          is_archived: boolean;
          thumbnail_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['internships']['Row'], 'id' | 'spots_filled' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['internships']['Insert']>;
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          internship_id: string;
          status: 'pending' | 'under_review' | 'accepted' | 'rejected';
          motivation_letter: string;
          relevant_experience: string | null;
          hours_per_week: number;
          linkedin_url: string | null;
          admin_notes: string | null;
          rejection_reason: string | null;
          offer_letter_url: string | null;
          applied_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'applied_at'>;
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          application_id: string;
          internship_id: string;
          start_date: string;
          end_date: string;
          is_completed: boolean;
          completion_date: string | null;
          certificate_id: string | null;
          certificate_url: string | null;
          certificate_unlocked: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
      internship_projects: {
        Row: {
          id: string;
          internship_id: string;
          title: string;
          description: string;
          week_number: number;
          resources_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['internship_projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['internship_projects']['Insert']>;
      };
      project_submissions: {
        Row: {
          id: string;
          enrollment_id: string;
          project_id: string;
          user_id: string;
          status: 'in_progress' | 'submitted' | 'under_review' | 'passed' | 'failed';
          submission_text: string | null;
          file_urls: string[];
          submitted_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          feedback: string | null;
          attempt_number: number;
        };
        Insert: Omit<Database['public']['Tables']['project_submissions']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['project_submissions']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          enrollment_id: string;
          amount: number;
          currency: string;
          method: 'safepay' | 'lemon_squeezy' | 'manual_bank';
          status: 'pending' | 'completed' | 'failed' | 'manual_pending';
          gateway_transaction_id: string | null;
          gateway_payload: Json | null;
          screenshot_url: string | null;
          verified_by: string | null;
          created_at: string;
          verified_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'application_update' | 'project_update' | 'announcement' | 'payment' | 'certificate';
          title: string;
          body: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          user_id: string | null;
          author_name: string;
          author_role: string | null;
          author_university: string | null;
          content: string;
          rating: number;
          is_approved: boolean;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'intern' | 'admin';
      application_status: 'pending' | 'under_review' | 'accepted' | 'rejected';
      project_status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'passed' | 'failed';
      internship_difficulty: 'beginner' | 'intermediate' | 'advanced';
      payment_status: 'pending' | 'completed' | 'failed' | 'manual_pending';
      payment_method: 'safepay' | 'lemon_squeezy' | 'manual_bank';
      notification_type: 'application_update' | 'project_update' | 'announcement' | 'payment' | 'certificate';
    };
  };
};
