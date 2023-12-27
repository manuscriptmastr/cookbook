export const signal = (initialValue) => {
  let value = initialValue;
  const getter = () => value;
  getter.set = (newValue) => {
    value = newValue;
  };
  getter.update = (fn) => {
    value = fn(value);
  };
  return getter;
};
