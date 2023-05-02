import { ObservableSubscription } from "./types.js";

export class Observable<T> {
  #value: T;
  readonly #subscriptions = new Set<ObservableSubscription<T>>();

  constructor(value?: T) {
    if (value !== undefined)
      this.#value = value;
  }

  /**
   * Get the private value stored in this instance.
   */
  public get value(): T {
    return this.#value;
  }

  /**
   * Change this instance's value with an expression and notify subscribers.
   */
  public set value(newValue: T) {
    this.#value = newValue;
    this.notify();
  }

  /**
   * Run a function whenever the value stored in this instance is reassigned.
   * @param subscription The function to run.
   * @returns An unsubscribe function.
   */
  public subscribe(subscription: ObservableSubscription<T>): VoidFunction {
    this.#subscriptions.add(subscription);
    return () => this.#subscriptions.delete(subscription);
  }

  /**
   * Create a new observable whose value is mapped on to that of this instance.
   * @param mapFn A function to convert this instance's value into that of the returned observable.
   * @returns The mapped observable.
   */
  public map<TOtherObsValue>(mapFn: (value: T) => TOtherObsValue): Observable<TOtherObsValue> {
    const obs = new Observable(mapFn(this.#value));
    this.subscribe((value) => obs.value = mapFn(value));
    return obs;
  }

  /**
   * Execute every subscription function that was added to this instance via `subscribe`.
   */
  public notify(): void {
    this.#subscriptions.forEach((subscription) => subscription(this.#value));
  }
}
