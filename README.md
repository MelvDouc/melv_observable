# melv_observable

A class containing a private value and a set of functions to run whenever the
value is updated.

## Examples

```typescript
const countObservable = new Observable();

const stopLoggingCount = countObservable.subscribe((count) => {
  console.log(`count: ${count}`);
});

countObservable.setValue(0); // logs "count: 0"

setInterval(() => {
  countObservable.updateValue((count) => count + 1);
  if (countObservable.getValue() === 5)
    stopLoggingCount();
}, 1000); // increments and logs count every second

```