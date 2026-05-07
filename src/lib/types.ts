export interface User {
  id: string;
  session_id: string;
  email?: string;
  credits: number;
  tier: "basic" | "plus" | "premium";
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  credits: number;
  tier: "basic" | "plus" | "premium";
  created_at: string;
}
