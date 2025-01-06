import {Tag} from "./Tag";

export class Tags {
  public static types: Map<string, Tag> = new Map();
  public static init(): void {

  }
  public static registerTag(tag_id: string): Tag {
    if(this.types.has(tag_id)) {
      let tag = new Tag();
      tag.tag_id = tag_id;
      return tag;
    }
    return null;
  }
  public static getTag(tag_id: string): Tag {
    return this.types.get(tag_id);
  }
}
