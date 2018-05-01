/* @flow */
interface IDisposable {
  dispose(): void;
}

export type AnyTeardown = (() => mixed) | IDisposable;

/**
 * Like a CompositeDisposable, but in addition to Disposable instances it can
 * also accept plain functions and Rx subscriptions.
 */
export default class UniversalDisposable {
  disposed: boolean;
  teardowns: Set<AnyTeardown>;

  constructor(...teardowns: Array<AnyTeardown>) {
    this.teardowns = new Set();
    this.disposed = false;
    if (teardowns.length) {
      this.add(...teardowns);
    }
  }

  add(...teardowns: Array<AnyTeardown>): void {
    if (this.disposed) {
      throw new Error('Cannot add to an already disposed UniversalDisposable!');
    }
    for (let i = 0; i < teardowns.length; i += 1) {
      assertTeardown(teardowns[i]);
      this.teardowns.add(teardowns[i]);
    }
  }

  remove(teardown: AnyTeardown): void {
    if (!this.disposed) {
      this.teardowns.delete(teardown);
    }
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.teardowns.forEach(teardown => {
        if (typeof teardown.dispose === 'function') {
          teardown.dispose();
        } else if (typeof teardown.unsubscribe === 'function') {
          teardown.unsubscribe();
        } else if (typeof teardown === 'function') {
          teardown();
        }
      });
      this.teardowns = (null: any);
    }
  }

  unsubscribe(): void {
    this.dispose();
  }

  clear(): void {
    if (!this.disposed) {
      this.teardowns.clear();
    }
  }
}

function assertTeardown(teardown: AnyTeardown): void {
  if (
    typeof teardown.dispose === 'function' ||
    typeof teardown.unsubscribe === 'function' ||
    typeof teardown === 'function'
  ) {
    return;
  }
  throw new TypeError(
    'Arguments to UniversalDisposable.add must be disposable',
  );
}
