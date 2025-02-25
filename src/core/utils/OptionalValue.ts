export interface OptionalValue<T> {
  value: T;
}

export class OptionalValue<T> {
  value: T;

  constructor(value: T = null) {
    this.value = value;
  }

  public isNull(): boolean {
    return this.value == null;
  }

  public notNull(): boolean {
    return this.value != null;
  }

  public get() {
    return this.value;
  }
}
