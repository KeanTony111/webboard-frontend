export interface User {
  id: number;
  username: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;  // Made required
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  detail: string;
  user: User;
  community: Community;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  userId: number;
  communityId: number;
}
