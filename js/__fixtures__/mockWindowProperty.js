export default (property, value) => {
  const { [property]: originalProperty } = window;
  delete window[property];
  beforeEach(() => {
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value,
    });
  });
  afterEach(() => {
    window[property] = originalProperty;
  });
};
