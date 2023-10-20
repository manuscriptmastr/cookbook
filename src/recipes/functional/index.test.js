import { curry, curryN, pipe, tap } from 'ramda';
import { applyN, chainRec, previous, onceEvery, onceUnless, thru } from '.';

test('applyN(number, fn) positionally applies two arguments', () => {
  const append = curry((prefix, suffix) => `${prefix} ${suffix}`);
  expect(applyN(2, append)([1, 'world'])([0, 'hello'])).toEqual('hello world');
});

test('applyN(number, fn) positionally applies three or more arguments', () => {
  const appendThree = curry(
    (prefix, infix, suffix) => `${prefix} ${infix} ${suffix}`
  );
  expect(
    applyN(3, appendThree)([1, 'there'])([0, 'hello'])([2, 'world'])
  ).toEqual('hello there world');
});

test('chainRec(fn) runs only once when fn calls done', () => {
  let timesCalled = 0;
  expect(
    chainRec((next, done, value) => {
      timesCalled += 1;
      return done(value.concat([1]));
    }, [])
  ).toEqual([1]);
  expect(timesCalled).toEqual(1);
});

test('chainRec(fn) runs as long as fn calls next', () => {
  let timesCalled = 0;
  expect(
    chainRec((next, done, value) => {
      timesCalled += 1;
      return value.length === 3
        ? done(value)
        : next(value.concat([value.length + 1]));
    }, [])
  ).toEqual([1, 2, 3]);
  expect(timesCalled).toEqual(4);
});

test('chainRec(fn) works with pagination', () => {
  let timesCalled = 0;
  const pages = [
    { cursor: 1, data: [1] },
    { cursor: 2, data: [2] },
    { cursor: null, data: [3] },
  ];
  const getPage = (num) => pages[num];

  expect(
    chainRec(
      (next, done, { data, cursor }) => {
        timesCalled += 1;
        return cursor === null
          ? done(data)
          : next({
              ...getPage(cursor),
              data: data.concat(getPage(cursor).data),
            });
      },
      { data: [], cursor: 0 }
    )
  ).toEqual([1, 2, 3]);
  expect(timesCalled).toEqual(4);
});

test('previous(fn, initial) passes initial as first previous value', () => {
  const add = (a, b) => a + b;
  expect(previous(add, 0)(1)).toEqual(1);
});

test('previous(fn, initial) passes previous value along', () => {
  const add = (a, b) => a + b;
  const addToLast = previous(add, 0);
  expect(addToLast(1)).toEqual(1);
  expect(addToLast(2)).toEqual(3);
  expect(addToLast(3)).toEqual(6);
});

test('onceEvery(ms, fn) returns result of fn', () => {
  const add = (a, b) => a + b;
  expect(onceEvery(1000, add)(1, 2)).toEqual(3);
});

test('onceEvery(ms, fn) returns old result when fn is called before ms elapsed', () => {
  let times = 0;
  const add = pipe(
    (...args) => args,
    tap(() => (times += 1)),
    ([a, b]) => a + b
  );
  const lazyAdd = onceEvery(1000, add);
  expect(lazyAdd(1, 2)).toEqual(3);
  expect(lazyAdd(1, 3)).toEqual(3);
  expect(times).toEqual(1);
});

test('onceEvery(ms, fn) returns new result when fn is called after ms elapsed', async () => {
  let times = 0;
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const add = curryN(
    2,
    pipe(
      (...args) => args,
      tap(() => (times += 1)),
      ([a, b]) => a + b
    )
  );
  const lazyAdd = onceEvery(500, add);
  expect(lazyAdd(1, 2)).toEqual(3);
  await wait(1000);
  expect(lazyAdd(1, 3)).toEqual(4);
  expect(times).toEqual(2);
});

test('onceUnless(pred, fn) returns result of fn', () => {
  const add = (a, b) => a + b;
  const shouldRefresh = () => false;
  expect(onceUnless(shouldRefresh, add)(1, 2)).toEqual(3);
});

test('onceUnless(pred, fn) returns last result of fn if predicate returns false', () => {
  let times = 0;
  const add = curryN(
    2,
    pipe(
      (...args) => args,
      tap(() => (times += 1)),
      ([a, b]) => a + b
    )
  );
  const shouldRefresh = () => false;
  const lazyAdd = onceUnless(shouldRefresh, add);
  expect(lazyAdd(1, 2)).toEqual(3);
  expect(lazyAdd(1, 3)).toEqual(3);
  expect(times).toEqual(1);
});

test('onceUnless(pred, fn) returns new result of fn if predicate returns true', () => {
  let times = 0;
  let refresh = false;
  const add = curryN(
    2,
    pipe(
      (...args) => args,
      tap(() => (times += 1)),
      ([a, b]) => a + b
    )
  );
  const shouldRefresh = () => refresh;
  const lazyAdd = onceUnless(shouldRefresh, add);
  expect(lazyAdd(1, 2)).toEqual(3);
  expect(lazyAdd(1, 3)).toEqual(3);
  refresh = true;
  expect(lazyAdd(1, 4)).toEqual(5);
  expect(times).toEqual(2);
});

test('onceUnless(pred, fn) passes fn arguments to predicate', () => {
  let times = 0;
  const add = curryN(
    2,
    pipe(
      (...args) => args,
      tap(() => (times += 1)),
      ([a, b]) => a + b
    )
  );
  const addsUpToThree = curry((one, two) => one + two === 3);
  const lazyAdd = onceUnless(addsUpToThree, add);
  expect(lazyAdd(1, 1)).toEqual(2);
  expect(lazyAdd(1, 3)).toEqual(2);
  expect(lazyAdd(1, 2)).toEqual(3);
});

test('thru(decorate, fetch) decorates fetch while allowing args to be passed into fetch', async () => {
  const fakeFetch = async (...args) => args;
  const call = (K) => K();
  expect(await thru(call, fakeFetch)('123.com', { method: 'POST' })).toEqual([
    '123.com',
    { method: 'POST' },
  ]);
});
