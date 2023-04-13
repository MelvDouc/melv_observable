# melv_observable

A class containing a private value and a set of functions to run whenever the
value is updated.

## Examples

```typescript
const countObservable = new Observable<number>();

const stopLoggingCount = countObservable.subscribe((count) => {
  console.log(`count: ${count}`);
});

countObservable.value = 0; // logs "count: 0"

setInterval(() => {
  countObservable.value++;
  if (countObservable.value === 5)
    stopLoggingCount();
}, 1000); // increments and logs count every second

```