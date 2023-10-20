import ramda from 'ramda';
const { both, curryN, eqProps, ifElse, is, propEq } = ramda;

export const instanceOf = eqProps('name');
export const raise = (error) => {
  throw error;
};
export const rescue = (Err, swallow) => ifElse(instanceOf(Err), swallow, raise);
