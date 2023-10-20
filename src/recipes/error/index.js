import { both, curryN, eqProps, ifElse, is, propEq } from 'ramda';

export const instanceOf = eqProps('name');
export const raise = (error) => {
  throw error;
};
export const rescue = (Err, swallow) => ifElse(instanceOf(Err), swallow, raise);
