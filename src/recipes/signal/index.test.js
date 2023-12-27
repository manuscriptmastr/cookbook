import { signal } from '.';

describe('signal(initialValue)', () => {
  it('stores an initial value', () => {
    const name = signal('Joshua');
    expect(name()).toBe('Joshua');
  });

  it('can be set to a new value', () => {
    const name = signal('Joshua');
    expect(name()).toBe('Joshua');
    name.set('Jonathan');
    expect(name()).toBe('Jonathan');
  });

  it('can be updated to a new value given the previous value', () => {
    const name = signal('Joshua');
    expect(name()).toBe('Joshua');
    name.update((str) => str.slice(0, 4));
    expect(name()).toBe('Josh');
  });
});

// describe('computed(fn)', () => {
// 	it('')
// })
