export default class Observable<T> {
  private value: T;
  private subscriptions = new Set<(value: T) => void>();

  constructor(value?: T) {
    if (value !== undefined)
      this.value = value;
  }

  /**
   * Get the private value stored in this instance.
   */
  public getValue(): T {
    return this.value;
  }

  /**
   * Change this instance's value with an expression and notify subscribers.
   */
  public setValue(newValue: T, allowNotification = true): this {
    this.value = newValue;
    return allowNotification ? this.notify() : this;
  }

  /**
   * Change this instance's value with a function that takes in the current value and notify subscribers.
   */
  public updateValue(updater: (value: T) => T, allowNotification = true): this {
    this.value = updater(this.value);
    return allowNotification ? this.notify() : this;
  }

  /**
   * Execute a function whenever this instance's value changes.
   * @param subscription The function to run.
   * @param onUnsubscribe An optional function to run after unsubscribing.
   * @returns A function that will remove the subscription.
   */
  public subscribe(subscription: (value: T) => void, onUnsubscribe?: (value: T) => void): () => void {
    this.subscriptions.add(subscription);

    return () => {
      this.subscriptions.delete(subscription);
      onUnsubscribe && onUnsubscribe(this.value);
    };
  }

  /**
   * Map this instance's value onto that of another observable.
   * @param observable The observable to follow.
   * @param mapFn A function that takes in the other observable's value and return a value of the type of this instance.
   */
  public followObservable<O>(observable: Observable<O>, mapFn: (value: O) => T): this {
    observable.subscribe((value) => this.setValue(mapFn(value)));
    return this;
  }

  /**
   * Execute every subscription function that was added to this instance via `subscribe`.
   */
  public notify(): this {
    this.subscriptions.forEach((subscription) => subscription(this.value));
    return this;
  }
}