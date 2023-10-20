import { instanceOf, raise, rescue } from './index.js';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class RandomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RandomError';
  }
}

test('instanceOf(Error, error) returns true if error.name equals Error.name', () => {
  expect(instanceOf(NotFoundError, new NotFoundError('Not found'))).toEqual(
    true
  );
});

test('instanceOf(Error, error) returns false if error.name does not equal Error.name', () => {
  expect(instanceOf(NotFoundError, new RandomError('Yeet'))).toEqual(false);
});

test('instanceOf(ErrorString, error) returns true if error.name equals ErrorString', () => {
  expect(instanceOf('NotFoundError', new NotFoundError('Not found'))).toEqual(
    true
  );
});

test('instanceOf(ErrorString, error) returns false if error.name does not equal ErrorString', () => {
  expect(instanceOf('NotFoundError', new RandomError('Yeet'))).toEqual(false);
});

test('rescue(Error, with) rescues error whose instance matches Error', async () => {
  const throwsNotFound = async () => raise(new NotFoundError('Not found'));
  await expect(
    throwsNotFound().catch(rescue(NotFoundError, () => 'Rescued'))
  ).resolves.toEqual('Rescued');
});

test('rescue(Error, with) rethrows error whose instance does not match Error', async () => {
  const throwsRandom = async () => raise(new RandomError('Yeet'));
  await expect(
    throwsRandom().catch(rescue(NotFoundError, () => 'Rescued'))
  ).rejects.toThrow(RandomError);
});

test('rescue(Error, with) rethrows error even if its constructor extends Error', async () => {
  const throwsRandom = async () => raise(new RandomError('Yeet'));
  await expect(
    throwsRandom().catch(rescue(Error, () => 'Rescued'))
  ).rejects.toThrow(RandomError);
});
