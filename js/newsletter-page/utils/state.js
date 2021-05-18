/*
 *  A simple utility class for managing state and DOM updates
 *  Using this, it is possible to keep these tasks separate
 *
 *  This is an 'abstract' class which should be extended
 */

/*
 *  watchExpression: a function that takes the data model and returns the value of one of the properties within it.
 *  listener: runs when the value returned from the watch expression has changed. Listener functions should normally update the DOM with the new data.
 *  It is important not to update the model from within a listener as this could result in infinite loops.
 */

function createWatcher(watchExpression, listener, data) {
  let value = watchExpression(data);
  listener(value, null, data);

  return (data) => {
    const newValue = watchExpression(data);

    if (newValue !== value) {
      listener(newValue, value, data);
      value = newValue;
    }
  };
}

export class State {
  constructor(initial) {
    this.initialState = initial;

    this.data = {
      ...initial,
    };

    this.watchers = [];
  }

  watch(watcher, listener) {
    this.watchers.push(createWatcher(watcher, listener, this.data));
  }

  digest() {
    this.watchers.forEach((watcher) => {
      watcher(this.data);
    });
  }
}
