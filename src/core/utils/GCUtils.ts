import v8 from "v8";
export class GCUtils {
  public static GCRegistry: FinalizationRegistry<any>;
  static {
    this.GCRegistry = new FinalizationRegistry((cleanup) => {
      console.log(`${cleanup} has been garbage collected`);
    });
  }
  public static register(obj: object): void {
    const weakRef = new WeakRef(obj);
    this.GCRegistry.register(obj, "Object");
  }
  public static getObjectSize(obj) {
    const serialized = v8.serialize(obj);
    return serialized.length;
  }
}
