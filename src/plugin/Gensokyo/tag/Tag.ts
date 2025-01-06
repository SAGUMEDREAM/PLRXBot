import {Item} from "../item/Item";

export class Tag {
  tag_id: string;
  list: Set<Item>;
  public constructor() {
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
