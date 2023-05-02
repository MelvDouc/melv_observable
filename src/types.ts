import { Observable } from "./Observable.js";

export type ObservableSubscription<TObsValue> = (value: TObsValue) => void;
export type OptionalObs<T> = T | Observable<T>;