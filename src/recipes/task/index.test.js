import { add, divide, multiply } from 'ramda';
import Task, { TaskTree } from '.';

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const task1 = Task((rej, res) => wait(50).then(() => res(1)));
const task2 = Task((rej, res) => wait(100).then(() => res(2)));
const badTask = Task((rej, res) =>
  wait(75).then(() => rej(new Error('BOOM!')))
);

test('Task(fn).fork(reject, resolve) calls resolve when successful', (done) => {
  task1.fork(
    () => {
      fail('Should not throw');
    },
    (val) => {
      expect(val).toEqual(1);
      done();
    }
  );
});

test('Task(fn).fork(reject, resolve) calls reject when unsuccessful', (done) => {
  badTask.fork(
    (err) => {
      expect(err.message).toEqual('BOOM!');
      done();
    },
    () => {
      fail('Should throw');
    }
  );
});

test('Task(fn).map(fn) calls resolve when successful', (done) => {
  task1.map(add(2)).fork(
    () => {
      fail('Should not throw');
    },
    (val) => {
      expect(val).toEqual(3);
      done();
    }
  );
});

test('Task(fn).map(fn) calls reject when unsuccessful', (done) => {
  badTask.map(add(2)).fork(
    (err) => {
      expect(err.message).toEqual('BOOM!');
      done();
    },
    () => {
      fail('Should throw');
    }
  );
});

test('Task(fn).chain(fnReturnsTask) calls resolve when successful', (done) => {
  task1
    .chain((val) => Task((rej, res) => res(val + 2)))
    .fork(
      () => {
        fail('Should not throw');
      },
      (val) => {
        expect(val).toEqual(3);
        done();
      }
    );
});

test('Task(fn).chain(fnReturnsTask) calls reject when original task is unsuccessful', (done) => {
  badTask
    .chain((val) => Task((rej, res) => res(val + 2)))
    .fork(
      (err) => {
        expect(err.message).toEqual('BOOM!');
        done();
      },
      () => {
        fail('Should throw');
      }
    );
});

test('Task(fn).chain(fnReturnsTask) calls reject when chained task is unsuccessful', (done) => {
  task1
    .chain(() => badTask)
    .fork(
      (err) => {
        expect(err.message).toEqual('BOOM!');
        done();
      },
      () => {
        fail('Should throw');
      }
    );
});

test('Task.of(value) calls resolve when successful', (done) => {
  Task.of(1).fork(
    () => {
      fail('Should not throw');
    },
    (val) => {
      expect(val).toEqual(1);
      done();
    }
  );
});

test('Task.of(value).map(fn) calls resolve when successful', (done) => {
  Task.of(1)
    .map(add(2))
    .fork(
      () => {
        fail('Should not throw');
      },
      (val) => {
        expect(val).toEqual(3);
        done();
      }
    );
});

test('Task.of(fn) calls resolve when successful', (done) => {
  Task.of(add)
    .map((add) => add(1))
    .map((add) => add(2))
    .fork(
      () => {
        fail('Should not throw');
      },
      (val) => {
        expect(val).toEqual(3);
        done();
      }
    );
});

test('Task(fn).ap(task) calls resolve when successful', (done) => {
  Task.of(add)
    .ap(task1)
    .ap(task2)
    .fork(
      () => {
        fail('Should not throw');
      },
      (val) => {
        expect(val).toEqual(3);
        done();
      }
    );
});

test('Task(fn).ap(task) calls reject when first subtask fails', (done) => {
  Task.of(add)
    .ap(badTask)
    .ap(task1)
    .fork(
      (err) => {
        expect(err.message).toEqual('BOOM!');
        done();
      },
      () => {
        fail('Should throw');
      }
    );
});

test('Task(fn).ap(task) calls reject when second subtask fails', (done) => {
  Task.of(add)
    .ap(task1)
    .ap(badTask)
    .fork(
      (err) => {
        expect(err.message).toEqual('BOOM!');
        done();
      },
      () => {
        fail('Should throw');
      }
    );
});

test('TaskTree(task, subtasks) calls resolve when successful', (done) => {
  TaskTree(Task.of(add), [task1, task2]).fork(
    () => {
      fail('Should not throw');
    },
    (val) => {
      expect(val).toEqual(3);
      done();
    }
  );
});

test('TaskTree(task, subtasks) calls reject when first subtask fails', (done) => {
  TaskTree(Task.of(add), [task1, badTask]).fork(
    (err) => {
      expect(err.message).toEqual('BOOM!');
      done();
    },
    () => {
      fail('Should throw');
    }
  );
});

test('TaskTree(task, subtasks) calls reject when second subtask fails', (done) => {
  TaskTree(Task.of(add), [badTask, task1]).fork(
    (err) => {
      expect(err.message).toEqual('BOOM!');
      done();
    },
    () => {
      fail('Should throw');
    }
  );
});

test('TaskTree(task, subtasks) works with nested subtasks', (done) => {
  TaskTree(Task.of(add), [
    TaskTree(Task.of(multiply), [Task.of(1), Task.of(2)]),
    TaskTree(Task.of(divide), [Task.of(4), Task.of(2)]),
  ]).fork(
    () => {
      fail('Should not throw');
    },
    (val) => {
      expect(val).toEqual(4);
      done();
    }
  );
});

test('TaskTree(task, subtasks) fails when a nested subtask fails', (done) => {
  TaskTree(Task.of(add), [
    TaskTree(Task.of(multiply), [badTask, Task.of(2)]),
    TaskTree(Task.of(divide), [Task.of(4), Task.of(2)]),
  ]).fork(
    (err) => {
      expect(err.message).toEqual('BOOM!');
      done();
    },
    () => {
      fail('Should throw');
    }
  );
});
