import { adjust, curry, curryN, once } from 'ramda';

// const appendThree = curry((prefix, infix, suffix) => `${prefix} ${infix} ${suffix}`);
// const apThree = applyN(3, appendThree);
// apThree([0, 'hello'])([2, 'world'])([1, 'there']);
// => 'hello there world'
export const applyN = (num, fn) => {
  const arrayOf = (val, num) => new Array(num).fill(val);
  const isFilled = (arr) => arr.every((item) => item !== null);
  const run = ([pos, arg], args) => {
    const newArgs = adjust(pos, () => arg, args);
    return isFilled(newArgs)
      ? fn(...newArgs)
      : ([pos, arg]) => run([pos, arg], newArgs);
  };
  return ([pos, arg]) => run([pos, arg], arrayOf(null, num));
};

// Tail recursion using the chainRec category
export const chainRec = curry((fn, acc) => {
  const next = (value) => ({ tag: next, value });
  const done = (value) => ({ tag: done, value });
  const { value, tag } = fn(next, done, acc);
  return tag === next ? chainRec(fn, value) : value;
});

// const lazyFetchAuthHeaders = onceEvery(5000, fetchAuthHeaders);
// await lazyFetchAuthHeaders();
// => invokes fetchAuthHeaders()
// await lazyFetchAuthHeaders();
// => skips invocation and returns last result
// await wait(6000);
// await lazyFetchAuthHeaders();
// => invokes fetchAuthHeaders()
export const onceEvery = curry((ms, fn) => {
  let stale = true;
  let timer;
  let result;
  return curryN(fn.length, (...args) => {
    clearTimeout(timer);
    if (stale) {
      stale = false;
      result = fn(...args);
    }

    timer = setTimeout(() => (stale = true), ms);
    return result;
  });
});

export const onceUnless = curry((pred, fn) => {
  let _fn = once(fn);
  return curryN(fn.length, (...args) => {
    if (pred(...args)) {
      _fn = once(fn);
    }
    return _fn(...args);
  });
});

// Passes the previous value along with next value
export const previous = curry((fn, initial) => {
  let last = initial;
  return (value) => {
    const next = fn(last, value);
    last = next;
    return next;
  };
});

// const safeFetch = thru(retry(3), fetch);
// safeFetch('123.com', { method: 'GET' });
// => Response
export const thru = curry(
  (decorate, fn) =>
    (...args) =>
      decorate(() => fn(...args))
);
