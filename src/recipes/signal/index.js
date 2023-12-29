let context;

export class Signal {
  #value;
  #subscribers = new Set();

  constructor(initialValue) {
    this.#value = initialValue;
  }

  get value() {
    if (context) {
      this.#subscribers.add(context);
    }
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    this.#subscribers.forEach((dep) => dep.notify());
  }
}

export const signal = (initialValue) => new Signal(initialValue);

export class Computed {
  #fn;
  #subscribers = new Set();

  constructor(fn) {
    this.#fn = fn;
  }

  get value() {
    const prevContext = context;
    if (context) {
      this.#subscribers.add(context);
    }
    context = this;
    const val = this.#fn();
    context = prevContext;
    return val;
  }

  notify() {
    this.#subscribers.forEach((dep) => dep.notify());
  }
}

export const computed = (fn) => new Computed(fn);

export class Effect {
  #fn;

  constructor(fn) {
    this.#fn = fn;
    this.runEffect();
  }

  runEffect() {
    const prevContext = context;
    context = this;
    this.#fn();
    context = prevContext;
  }

  notify() {
    this.runEffect();
  }
}

export const effect = (fn) => new Effect(fn);
