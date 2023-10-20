import query, { o, m, c } from '.';
import Joi from 'joi';

const JQL = {
  eq: o((k, v) => `${k} = "${v}"`),
  gt: o((k, v) => `${k} > ${v}`),
  not: m((q) => `NOT ${q}`),
  and: c((qs) => qs.join(' AND ')),
  or: c((qs) => qs.join(' OR ')),
};

test('o(), m(), and c() can be called directly', () => {
  const { and, eq, gt, not } = JQL;
  expect(
    and([eq('project', 'TEST'), not(gt('created', 'endOfDay("-1")'))])
  ).toEqual('project = "TEST" AND NOT created > endOfDay("-1")');
});

test('o(), m(), and c() throw when arguments are invalid', () => {
  const { and, eq, gt, not } = JQL;
  expect(() =>
    and([eq('project', {}), not(gt('created', 'endOfDay("-1")'))])
  ).toThrow(new Joi.ValidationError('"value" must be one of [string, number]'));
});

test('query(transforms, object) returns equals operation', () => {
  const jql = query(JQL);
  expect(jql({ eq: ['project', 'TEST'] })).toEqual('project = "TEST"');
});

test('query(transforms, object) returns greater than operation', () => {
  const jql = query(JQL);
  expect(jql({ gt: ['created', 'endOfDay("-1")'] })).toEqual(
    'created > endOfDay("-1")'
  );
});

test('query(transforms, object) returns and of two operations', () => {
  const jql = query(JQL);
  expect(
    jql({
      and: [{ eq: ['project', 'TEST'] }, { gt: ['created', 'endOfDay("-1")'] }],
    })
  ).toEqual('project = "TEST" AND created > endOfDay("-1")');
});

test('query(transforms, object) returns and of operations > 2', () => {
  expect(
    query(JQL, {
      and: [
        { eq: ['project', 'TEST'] },
        { gt: ['created', 'endOfDay("-1")'] },
        { eq: ['type', 'Purchase Request'] },
      ],
    })
  ).toEqual(
    'project = "TEST" AND created > endOfDay("-1") AND type = "Purchase Request"'
  );
});
