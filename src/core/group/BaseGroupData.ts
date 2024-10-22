export abstract class BaseGroupData {
  abstract group_id: number;
  abstract banned: boolean
  abstract permissions: string[];
  abstract data: {};
}
