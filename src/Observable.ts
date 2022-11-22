export default class Observable<T> {
  private value: T;
  private subscriptions = new Set<(value: T) => any>();

  constructor(value?: T) {
    if (value !== undefined)
      this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  public setValue(newValue: T, allowNotification = true): this {
    this.value = newValue;
    return allowNotification ? this.notify() : this;
  }

  public updateValue(updater: (value: T) => T, allowNotification = true): this {
    this.value = updater(this.value);
    return allowNotification ? this.notify() : this;
  }

  public subscribe(subscription: (value: T) => any): () => void {
    this.subscriptions.add(subscription);
    return () => this.subscriptions.delete(subscription);
  }

  public followObservable<O>(observable: Observable<O>, mapFn: (value: O) => T): this {
    observable.subscribe((value) => this.setValue(mapFn(value)));
    return this;
  }

  public notify(): this {
    this.subscriptions.forEach((subscription) => subscription(this.value));
    return this;
  }
}