export interface OptionalValue<T> {
  value: T;
}

export class OptionalValue<T> {
  value: T;

  constructor(value: T = null) {
    this.value = value;
  }

  public get() {
    return this.value;
  }
}
