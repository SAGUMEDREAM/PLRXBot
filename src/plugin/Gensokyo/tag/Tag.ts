import {Item} from "../item/Item";

export class Tag {
  public readonly tag_id: string;
  public readonly list: Set<Item>;
  public constructor(tag_id: string) {
    this.tag_id = tag_id;
    this.list = new Set<Item>();
  }
  public addItem(item: Item): Tag {
    this.list.add(item);
    return this;
  }
  public addList(items: Item[] = []): Tag {
    items.forEach(item => this.list.add(item));
    return this;
  }
  public isIn(item: Item): boolean {
    return this.list.has(item);
  }
}
