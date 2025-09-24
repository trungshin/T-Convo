export type IUser = { 
  id: string; 
  _id: string;
  username: string; 
  displayName?: string; 
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
};
export type IPost = {
  _id: string;
  author: IUser;
  content: string;
  media?: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};
