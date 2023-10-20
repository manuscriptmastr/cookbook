import { Color, Text, VStack, List, render, sanitize } from '.';

test('Color enum allows different ways to find a color', () => {
  expect(Color.blue).toEqual('blue');
  expect(Color('blue')).toEqual('blue');
});

test('Text(string) works', () => {
  expect(render(Text(''))).toEqual(
    '<Text foregroundColor="black" backgroundColor="white"></Text>'
  );
  expect(render(Text('Hi'))).toEqual(
    '<Text foregroundColor="black" backgroundColor="white">Hi</Text>'
  );
  expect(Text('').props.foregroundColor).toEqual('black');
  expect(Text('').foregroundColor('blue').props.foregroundColor).toEqual(
    'blue'
  );
  expect(
    Text('').foregroundColor('blue').backgroundColor('charcoal').props
  ).toEqual({ foregroundColor: 'blue', backgroundColor: 'charcoal' });
});

test('VStack(children) works without children', () => {
  expect(render(VStack([]))).toEqual('<VStack height="0" width="0"></VStack>');
  expect(VStack([]).height(10).props.height).toEqual(10);
  expect(VStack([]).height(10).width(10).props).toEqual({
    height: 10,
    width: 10,
  });
});

test('VStack(children) works with children', () => {
  expect(render(VStack([Text('Hi')]))).toEqual(
    sanitize(`
      <VStack height="0" width="0">
        <Text foregroundColor="black" backgroundColor="white">Hi</Text>
      </VStack>
    `)
  );
});

test('VStack(children) works with children and modifiers', () => {
  expect(
    render(
      VStack([
        Text('Hello').foregroundColor(Color.blue).backgroundColor(Color.black),
        Text('world'),
      ])
    )
  ).toEqual(
    sanitize(`
      <VStack height="0" width="0">
        <Text foregroundColor="blue" backgroundColor="black">Hello</Text>
        <Text foregroundColor="black" backgroundColor="white">world</Text>
      </VStack>
    `)
  );
});

test('List(children) works without children', () => {
  expect(render(List([]))).toEqual('<List orientation="vertical"></List>');
  expect(render(List([], () => Text('Hi')))).toEqual(
    '<List orientation="vertical"></List>'
  );
});

test('List(children) works with children', () => {
  expect(render(List([Text('Hi')]))).toEqual(
    sanitize(`
      <List orientation="vertical">
        <Text foregroundColor="black" backgroundColor="white">Hi</Text>
      </List>
    `)
  );
});

test('List(children) works with children and modifiers', () => {
  expect(
    render(
      List(['hello', 'world'], ([firstChar]) =>
        Text(firstChar).backgroundColor(Color.blue)
      )
    )
  ).toEqual(
    sanitize(`
      <List orientation="vertical">
        <Text foregroundColor="black" backgroundColor="blue">h</Text>
        <Text foregroundColor="black" backgroundColor="blue">w</Text>
      </List>
    `)
  );
});
