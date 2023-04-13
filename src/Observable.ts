export class Observable<TObsValue> {
  private _value: TObsValue;
  private _subscriptions = new Set<ObservableSubscription<TObsValue>>();

  constructor(value?: TObsValue) {
    if (value !== undefined)
      this._value = value;
  }

  /**
   * Get the private value stored in this instance.
   */
  public get value(): TObsValue {
    return this._value;
  }

  /**
   * Change this instance's value with an expression and notify subscribers.
   */
  public set value(newValue: TObsValue) {
    this._value = newValue;
    this.notify();
  }

  /**
   * Run a function whenever the value stored in this instance is reassigned.
   */
  public subscribe(subscription: ObservableSubscription<TObsValue>): VoidFunction {
    this._subscriptions.add(subscription);
    return () => this._subscriptions.delete(subscription);
  }

  /**
   * Map the value of this instance on to that of another observable.
   */
  public map<TOtherObsValue>(otherObs: Observable<TOtherObsValue>, mapFn: (value: TOtherObsValue) => TObsValue): void {
    this.value = mapFn(otherObs.value);
    otherObs.subscribe((value) => this.value = mapFn(value));
  }

  /**
   * Execute every subscription function that was added to this instance via `subscribe`.
   */
  public notify(): void {
    this._subscriptions.forEach((subscription) => subscription(this._value));
  }
}

export type ObservableSubscription<TObsValue> = (value: TObsValue) => void;