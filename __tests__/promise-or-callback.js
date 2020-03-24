var promiseOrCallback = require('../lib/promise-or-callback');

function noop() {}

function functionThatReturnsAResolvedPromise(data) {
  return new Promise(function (resolve) {
    resolve(data);
  });
}

function functionThatReturnsARejectedPromise(err) {
  return new Promise(function () {
    throw err;
  });
}

describe('promiseOrCallback', function () {
  it('returns promise if no callback is provided', function () {
    var promise = functionThatReturnsAResolvedPromise();
    var isPromise = promiseOrCallback(promise);

    expect(isPromise).toBeInstanceOf(Promise);
  });

  it('does not return a promise if a callback is provided', function () {
    var promise = functionThatReturnsAResolvedPromise();
    var isPromise = promiseOrCallback(promise, noop);

    expect(isPromise).not.toBeInstanceOf(Promise);
  });

  it('calls callback with error caught from promise', function (done) {
    var error = new Error('a problem');
    var promise = functionThatReturnsARejectedPromise(error);

    promiseOrCallback(promise, function (err) {
      expect(err).toBe(error);

      done();
    });
  });

  it('calls callback with data resolved from promise', function (done) {
    var data = {foo: 'bar'};
    var promise = functionThatReturnsAResolvedPromise(data);

    promiseOrCallback(promise, function (err, resolvedData) {
      expect(err).toBeFalsy();
      expect(resolvedData).toBe(data);

      done();
    });
  });
});
