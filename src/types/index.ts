// URL型定義
export interface Url {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: number;
  deleted_at: string | null;
}
