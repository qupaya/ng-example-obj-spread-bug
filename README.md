
# Angular / TypeScript Memory Consumption (combineLatest + Object Merging)

This repository contains some code examples to illustrate the memory consumption using RxJS combineLatest and object merging.

We experienced a huge memory consumption at compilation time, which mostly resulted in a node.js out of memory exception during ng build (ng serve, ng test).

All examples can be found in https://github.com/qupaya/ng-example-obj-spread-bug/blob/main/src/app/app.component.ts

An issue for Angular has already been filed: https://github.com/angular/angular/issues/38116

# Code & Performance

## **WORKING:** combineLatest + 6 Observables as Array

combineLatest works pretty well with six sources and a merged object using the spread operator.

```ts
    this.sixPropsResult$ = combineLatest([
      a$, b$, c$, d$, e$, f$
    ]).pipe(map(
      ([a, b, c, d, e, f]) => ({
        ...a,
        ...b,
        ...c,
        ...d,
        ...e,
        ...f
      })
    ));
```

### Result

Command: `/usr/bin/time -l ng build`

```ts
       17.52 real        15.97 user         2.00 sys
 451121152  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    210708  page reclaims
      4498  page faults
         0  swaps
         0  block input operations
         0  block output operations
         0  messages sent
         0  messages received
         2  signals received
      7720  voluntary context switches
     47316  involuntary context switches
```

## **FAILING:** combineLatest + 7 Observables as Array

This is almost the same code as above, but combineLatest combines **seven** streams.

- This results mostly in an out of memory exception.
    - Memory usage ~2gig
    - Takes ~47s
- Sometimes a TS compilation error is thrown _at build time_

```ts
    this.sevenPropsBrokenResult$ = combineLatest(
      [a$, b$, c$, d$, e$, f$, g$]
    ).pipe(map(
      ([a, b, c, d, e, f, g]) => ({
        ...a,
        ...b,
        ...c,
        ...d,
        ...e,
        ...f,
        ...g
      }),
    ));
```

### Result

Command: `/usr/bin/time -l ng build`

```ts
       46.85 real        37.37 user         5.53 sys
1936789504  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    980706  page reclaims
      4458  page faults
         0  swaps
         0  block input operations
         0  block output operations
         0  messages sent
         0  messages received
         2  signals received
      8570  voluntary context switches
    174244  involuntary context switches
```

## **WORKING:** combineLatest + 7 Observables as separate arguments

We experienced no issues using combineLatest without an array.

```ts
    this.sevenPropsWorkingResult$ = combineLatest(
      a$, b$, c$, d$, e$, f$, g$ // USING SINGLE ARGUMENTS WORKS, TOO
    ).pipe(map(
      ([a, b, c, d, e, f, g]) => ({
        ...a,
        ...b,
        ...c,
        ...d,
        ...e,
        ...f,
        ...g
      }),
    ));
```

### Result

Command: `/usr/bin/time -l ng build`

```ts
       17.71 real        16.84 user         2.29 sys
 446627840  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    209653  page reclaims
      4489  page faults
         0  swaps
         0  block input operations
         0  block output operations
         0  messages sent
         0  messages received
         2  signals received
      7086  voluntary context switches
     39083  involuntary context switches
```

## **WORKING:** combineLatest + 7 Observables as Array + Object.assign

Using combineLatest with a single array of **7** streams works in combination with Object.assign. The spread operator would consume more memory.

```ts
    this.sevenPropsWorkaroundResult$ = combineLatest([
      a$, b$, c$, d$, e$, f$, g$
    ]).pipe(map(
      ([a, b, c, d, e, f, g]) => Object.assign({}, a, b, c, d, e, f, g)
    ));
```

### Result

Command: `/usr/bin/time -l ng build`

```ts
       16.11 real        16.20 user         2.01 sys
 450129920  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    209951  page reclaims
      4462  page faults
         0  swaps
         0  block input operations
         0  block output operations
         0  messages sent
         0  messages received
         2  signals received
      5665  voluntary context switches
     37709  involuntary context switches
```
