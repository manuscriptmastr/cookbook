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
    const prevContext = context;
    this.#fn = fn;
    context = this;
    this.#fn();
    context = prevContext;
  }

  get value() {
    if (context) {
      this.#subscribers.add(context);
    }
    return this.#fn();
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
    context = this;
    this.#fn();
    context = undefined;
  }

  notify() {
    this.#fn();
  }
}

export const effect = (fn) => new Effect(fn);
