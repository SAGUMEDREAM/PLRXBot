export abstract class BaseUserProfile {
  abstract username: string | null;
  abstract user_id: number | string;
  abstract user_avatar: string | null;
  abstract banned: boolean;
  abstract permission_level: number;
  abstract permissions: string[];
  abstract data: object;
}
