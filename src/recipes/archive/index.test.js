import Archivable from '.';

test('Archivable(value) sets .value to initial value', () => {
  expect(Archivable('hello').value).toEqual('hello');
});

test('Archivable(value) updates .value to result of .next()', () => {
  expect(Archivable('hello').next('bye').value).toEqual('bye');
});

test('Archivable(value) stores all values in ._history', () => {
  expect(Archivable('hello').next('bye')._history).toEqual(['hello', 'bye']);
});

test('Archivable(value) sets .value to result of .map()', () => {
  expect(Archivable('hello').map((x) => x.toUpperCase()).value).toEqual(
    'HELLO'
  );
});

test('Archivable(value) sets .value from result of calling .next() and .undo()', () => {
  expect(Archivable('hello').next('bye').undo().value).toEqual('hello');
});

test('Archivable(value) allows multiple .undo()', () => {
  expect(Archivable('hello').next('bye').undo().undo().value).toEqual('hello');
});

test('Archivable(value) calls .redo() and sets .value', () => {
  expect(Archivable('hello').redo().value).toEqual('hello');
});

test('Archivable(value) accepts array of history', () => {
  expect(Archivable(['hello', 'bye', 'hi again']).undo().redo()._head).toEqual(
    2
  );
});

test('Archivable(value) calls .next() and sets value', () => {
  expect(Archivable(['hello', 'bye']).undo().next('greeting').value).toEqual(
    'greeting'
  );
});

test('Archivable(value) calls .next() and slices history after head', () => {
  expect(Archivable(['hello', 'bye']).undo().next('greeting')._history).toEqual(
    ['hello', 'greeting']
  );
});
