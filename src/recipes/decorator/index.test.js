import { persist } from '.';

describe('@persist(storageKey, storage?)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('initializes session storage with default property', () => {
    expect(sessionStorage.getItem('test-property')).toBeNull();

    class TestClass {
      @persist('test-property')
      accessor showDialog = false;
    }

    const myClass = new TestClass();
    expect(myClass.showDialog).toBe(false);
    expect(sessionStorage.getItem('test-property')).toBe('false');
  });

  it('initializes value from session storage', () => {
    sessionStorage.setItem('test-property', 'true');

    class TestClass {
      @persist('test-property')
      accessor showDialog = false;
    }

    const myClass = new TestClass();
    expect(myClass.showDialog).toBe(true);
    expect(sessionStorage.getItem('test-property')).toBe('true');
  });

  it('updates both property and session storage when property is updated and session storage was initialized by default property', () => {
    class TestClass {
      @persist('test-property')
      accessor showDialog = false;
    }

    const myClass = new TestClass();

    expect(myClass.showDialog).toBe(false);
    expect(sessionStorage.getItem('test-property')).toBe('false');

    myClass.showDialog = true;

    expect(myClass.showDialog).toBe(true);
    expect(sessionStorage.getItem('test-property')).toBe('true');

    myClass.showDialog = false;

    expect(myClass.showDialog).toBe(false);
    expect(sessionStorage.getItem('test-property')).toBe('false');
  });

  it('updates both property and session storage when property is updated and property was initialized by session storage', () => {
    sessionStorage.setItem('test-property', 'true');

    class TestClass {
      @persist('test-property')
      accessor showDialog = false;
    }

    const myClass = new TestClass();

    expect(myClass.showDialog).toBe(true);
    expect(sessionStorage.getItem('test-property')).toBe('true');

    myClass.showDialog = false;

    expect(myClass.showDialog).toBe(false);
    expect(sessionStorage.getItem('test-property')).toBe('false');

    myClass.showDialog = true;

    expect(myClass.showDialog).toBe(true);
    expect(sessionStorage.getItem('test-property')).toBe('true');
  });

  it('works with local storage', () => {
    localStorage.setItem('test-property', 'true');

    class TestClass {
      @persist('test-property', localStorage)
      accessor showDialog = false;
    }

    const myClass = new TestClass();

    expect(myClass.showDialog).toBe(true);
    expect(localStorage.getItem('test-property')).toBe('true');

    myClass.showDialog = false;

    expect(myClass.showDialog).toBe(false);
    expect(localStorage.getItem('test-property')).toBe('false');

    myClass.showDialog = true;

    expect(myClass.showDialog).toBe(true);
    expect(localStorage.getItem('test-property')).toBe('true');
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
});