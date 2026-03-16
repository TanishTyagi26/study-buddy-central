// Re-export the NoteCard note type for use across pages
export interface NoteWithProfile {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number | null;
  download_count: number | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
    role: string;
  } | null;
}
