import { Component } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// The working result with 6(!) properties
interface WorkingResult extends A, B, C, D, E, F { }

// The broken result with 7 properties (or even more)
interface BrokenResult extends A, B, C, D, E, F, G { }
interface A {
  a: string;
}
interface B {
  b: string;
}
interface C {
  c: string;
}
interface D {
  d: string;
}
interface E {
  e: string;
}
interface F {
  f: string;
}
interface G {
  g: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  workingResult$: Observable<WorkingResult>;
  brokenResult$: Observable<BrokenResult>;
  workaroundResult$: Observable<BrokenResult>;

  constructor() {
    const a$: Observable<A> = of({ a: 'a' });
    const b$: Observable<B> = of({ b: 'b' });
    const c$: Observable<C> = of({ c: 'c' });
    const d$: Observable<D> = of({ d: 'd' });
    const e$: Observable<E> = of({ e: 'e' });
    const f$: Observable<F> = of({ f: 'f' });
    const g$: Observable<G> = of({ g: 'g' });

    // Object Spread works fine with a maximum of 6 property spreads
    this.workingResult$ = combineLatest([
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

    /*
    // Object spread with 7+ properties results in out of memory exception
    // using ng serve, ng build, ng test, ...
    this.brokenResult$ = combineLatest([
      a$, b$, c$, d$, e$, f$, g$
    ]).pipe(map(
      ([a, b, c, d, e, f, g]) => ({
        ...a,
        ...b,
        ...c,
        ...d,
        ...e,
        ...f,
        ...g
      })
    ));
    */

    // Using Object.assign works well with 7+ properties as a workround
    this.workaroundResult$ = combineLatest([
      a$, b$, c$, d$, e$, f$, g$
    ]).pipe(map(
      ([a, b, c, d, e, f, g]) => Object.assign({}, a, b, c, d, e, f, g)
    ));
  }
}
