export type IUser = { id: string; username: string; displayName?: string; avatarUrl?: string };
export type IPost = {
  _id: string;
  author: IUser;
  content: string;
  media?: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};
