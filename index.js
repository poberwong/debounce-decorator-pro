
/**
 * if immediate is true, the value will be returned synchronously or else will return a Promise
 * @returns {Function}
 */
export default = (params) => (target, name, descriptor) => {
  let timer = null;
  const { delay = 300, immediate = false } = params;

  // high order function
  if (!descriptor || (arguments.length === 1 && typeof target === 'function')) {
    return createDebounce(target);
  }

  function createDebounce (fn) {
    return function debounce () {
      if (immediate && !timer) {
        return fn.apply(this, arguments);
      }
      if (timer) {
        clearTimeout(timer);
      }

      let argumentsCopy = arguments;
      let that = this;

      return (new Promise((resolve) => {
        timer = setTimeout(function () {
          if (!immediate) {
            resolve(fn.apply(that, argumentsCopy));
          }
          timer = null;
        }, delay);
      }));
    }
  }

  if (descriptor.value) {
    return {
      enumerable: false,
      configurable: true,
      writable: true,
      value: createDebounce(descriptor.value)
    };
  }

  if (descriptor.initializer) {
    return {
      enumerable: false,
      configurable: true,
      writable: true,
      initializer () {
        return createDebounce(descriptor.initializer.call(this));
      }
    };
  }

  return descriptor;
}