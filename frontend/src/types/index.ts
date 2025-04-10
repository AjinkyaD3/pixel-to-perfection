// Leaderboard types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredPoints: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  badges: Badge[];
  eventsAttended: number;
  earlyRegistrations: number;
  socialShares: number;
  contributions: number;
}

// Activity types
export interface PointsActivity {
  id: string;
  userId: string;
  description: string;
  points: number;
  category: string;
  createdAt: string;
}

// Add other types as needed 