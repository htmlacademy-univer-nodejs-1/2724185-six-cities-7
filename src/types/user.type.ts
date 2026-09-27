export type UserType = 'regular' | 'pro';

export type User = {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  type: UserType;
};
