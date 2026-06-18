export interface Wallet {
  user_id: string;
  gold_balance: number;
  gem_balance: number;
  version: number;
  updated_at: string;
}

export interface GameQuest {
  id: string;
  title: string;
  description: string | null;
  target_count: number;
  gold_reward: number;
  gem_reward: number;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string | null;
  gold_reward: number;
  gem_reward: number;
}

export interface BattleLog {
  id: string;
  attacker_id: string;
  defender_id: string | null;
  winner_id: string | null;
  battle_type: string;
  attacker_damage: number;
  defender_damage: number;
  duration_seconds: number;
  created_at: string;
}

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  item_id: string;
  price: number;
  currency: string;
  quantity: number;
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  sold_at: string | null;
}
