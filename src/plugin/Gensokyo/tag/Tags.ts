import {Tag} from "./Tag";
import {Items} from "../item/Items";

export class Tags {
  public static types: Map<string, Tag> = new Map();
  public static lucky_draw_pool: Tag;
  public static init(): void {
    this.lucky_draw_pool = this.registerTag("lucky_dra_pool");
    this.lucky_draw_pool.addList([
    ])
  }
  public static registerTag(tag_id: string): Tag {
    if(!this.types.has(tag_id)) {
      return new Tag(tag_id);
    }
    return null;
  }
  public static getTag(tag_id: string): Tag {
    return this.types.get(tag_id);
  }
}
