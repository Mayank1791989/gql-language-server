/* @flow strict */
import Emitter from '../Emitter';
import {
  type IGQLService,
  type IGQLServiceCommandParams,
  type EmitterSubscription,
  GQLV2Service,
} from './types';

export type Options = {|
  debug: boolean,
  cwd: string,
|};

export default class GQLV2ToV3Service implements IGQLService {
  _gqlV2: GQLV2Service;
  _GQLV2Service: Class<GQLV2Service>;
  _options: Options;

  _emitter: Emitter = new Emitter();
  _isRunning: boolean = false;

  _triggerError = (err: Error) => this._emitter.emit('error', err);
  _triggerChange = () => this._emitter.emit('change');

  constructor(Service: Class<GQLV2Service>, options: Options) {
    this._options = options;
    this._GQLV2Service = Service;
  }

  async start() {
    await new Promise((resolve) => {
      this._gqlV2 = new this._GQLV2Service({
        onInit: () => {
          this._isRunning = true;
          resolve();
        },
        onChange: this._triggerChange,
      });
    });
  }

  async stop() {
    this._isRunning = false;
    await Promise.resolve();
  }

  onChange(listener: () => void): EmitterSubscription {
    const disposable = this._emitter.on('change', listener);
    return { remove: () => disposable.dispose() };
  }

  onError(listener: (err: Error) => void): EmitterSubscription {
    const disposable = this._emitter.on('error', listener);
    return { remove: () => disposable.dispose() };
  }

  onLog() {
    return {
      // eslint-disable-next-line no-empty-function
      remove: () => {},
    };
  }

  getConfig() {
    return this._gqlV2._config;
  }

  getSchema() {
    return this._gqlV2._schemaBuilder.getSchema();
  }

  status() {
    if (!this._isRunning) {
      return [];
    }

    return this._catchThrownErrors(() => {
      return this._gqlV2.status();
    }, []);
  }

  autocomplete(params: IGQLServiceCommandParams) {
    if (!this._isRunning) {
      return [];
    }

    return this._catchThrownErrors(() => {
      return this._gqlV2.autocomplete(params);
    }, []);
  }

  getDef(params: IGQLServiceCommandParams) {
    if (!this._isRunning) {
      return [];
    }

    return this._catchThrownErrors(() => {
      return [this._gqlV2.getDef(params)].filter(Boolean);
    }, []);
  }

  findRefs(params: IGQLServiceCommandParams) {
    if (!this._isRunning) {
      return [];
    }

    return this._catchThrownErrors(() => {
      return this._gqlV2.findRefs(params);
    }, []);
  }

  getInfo(params: IGQLServiceCommandParams) {
    if (!this._isRunning) {
      return [];
    }

    return this._catchThrownErrors(() => {
      return [this._gqlV2.getInfo(params)].filter(Boolean);
    }, []);
  }

  _catchThrownErrors = <T>(fn: () => T, defaultValue: T): T => {
    try {
      return fn();
    } catch (err) {
      this._triggerError(err);
      return defaultValue;
    }
  };
}
