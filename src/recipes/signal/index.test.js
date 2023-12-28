import { computed, effect, signal } from '.';

describe('signal(initialValue)', () => {
  it('stores an initial value', () => {
    const name = signal('Joshua');
    expect(name.value).toBe('Joshua');
  });

  it('can be set to a new value', () => {
    const name = signal('Joshua');
    expect(name.value).toBe('Joshua');
    name.value = 'Jonathan';
    expect(name.value).toBe('Jonathan');
  });
});

describe('computed(fn)', () => {
  it('computes a value from a signal', () => {
    const name = signal('Joshua');
    const length = computed(() => name.value.length);
    expect(length.value).toBe(6);
  });

  it('uses latest value from a signal', () => {
    const name = signal('Joshua');
    const length = computed(() => name.value.length);
    expect(length.value).toBe(6);
    name.value = 'Jonathan';
    expect(length.value).toBe(8);
  });
});

describe('effect(fn)', () => {
  it('runs the effect function on initialization', () => {
    const effectFn = jest.fn();
    effect(effectFn);
    expect(effectFn).toHaveBeenCalledTimes(1);
  });

  it('runs the effect function when a signal changes', () => {
    const effectFn = jest.fn();
    const name = signal('Joshua');
    effect(() => effectFn(name.value));
    expect(effectFn).toHaveBeenNthCalledWith(1, 'Joshua');
    name.value = 'Jonathan';
    expect(effectFn).toHaveBeenNthCalledWith(2, 'Jonathan');
  });

  it('runs the effect function when a computed signal changes', () => {
    const effectFn = jest.fn();
    const name = signal('Joshua');
    const length = computed(() => name.value.length);
    effect(() => effectFn(length.value));
    expect(effectFn).toHaveBeenNthCalledWith(1, 6);
    name.value = 'Jonathan';
    expect(effectFn).toHaveBeenNthCalledWith(2, 8);
  });

  it('accepts a function with multiple signals', () => {
    const effectFn = jest.fn();
    const josh = signal('Joshua');
    const jon = signal('Jonathan');
    effect(() => effectFn(`${josh.value} and ${jon.value}`));
    expect(effectFn).toHaveBeenNthCalledWith(1, 'Joshua and Jonathan');
    josh.value = 'Josh';
    expect(effectFn).toHaveBeenNthCalledWith(2, 'Josh and Jonathan');
    jon.value = 'Jon';
    expect(effectFn).toHaveBeenNthCalledWith(3, 'Josh and Jon');
  });

  it('accepts a function with multiple computed signals', () => {
    const effectFn = jest.fn();
    const name = signal('Joshua');
    const length = computed(() => name.value.length);
    const greeting = computed(() => `Hello, ${name.value}!`);
    effect(() =>
      effectFn(
        `${greeting.value} Your name is ${length.value} characters long.`
      )
    );
    expect(effectFn).toHaveBeenNthCalledWith(
      1,
      'Hello, Joshua! Your name is 6 characters long.'
    );
    name.value = 'Jonathan';
    expect(effectFn).toHaveBeenNthCalledWith(
      2,
      'Hello, Jonathan! Your name is 8 characters long.'
    );
  });

  it('accepts a function with mixed signals and computed signals', () => {
    const effectFn = jest.fn();
    const name = signal('Joshua');
    const hobbies = signal(['coffee', 'Bible', 'bodybuilding']);
    const numberOfHobbies = computed(() => hobbies.value.length);
    effect(() =>
      effectFn(`${name.value} has ${numberOfHobbies.value} hobbies.`)
    );
    expect(effectFn).toHaveBeenNthCalledWith(1, 'Joshua has 3 hobbies.');
    hobbies.value = ['coffee', 'Bible', 'bodybuilding', 'coding'];
    expect(effectFn).toHaveBeenNthCalledWith(2, 'Joshua has 4 hobbies.');
  });
});
