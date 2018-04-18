/* @flow */
import Emitter, { type EmitterSubscription } from '../Emitter';
import UniversalDisposable from '../UniversalDisposable';
import { type IGQLService, type IGQLServiceCommandParams } from './types';
import _noop from 'lodash/noop';

export type Options = {|
  debug: boolean,
  cwd: string,
|};

export default class GQLV2ToV3Service implements IGQLService {
  _gqlV2: any;
  _GQLV2Service: any;
  _options: Options;

  _emitter: Emitter = new Emitter();
  _disposables = new UniversalDisposable();
  _isRunning: boolean = false;

  _triggerError = (err: Error) => this._emitter.emit('error', err);
  _triggerChange = () => this._emitter.emit('change');

  constructor(GQLV2Service: any, options: Options) {
    this._options = options;
    this._GQLV2Service = GQLV2Service;
  }

  async start() {
    await new Promise(resolve => {
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
    return this._emitter.on('change', listener);
  }

  onError(listener: (err: Error) => any): EmitterSubscription {
    return this._emitter.on('error', listener);
  }

  onLog() {
    return {
      remove: _noop,
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
      return null;
    }

    return this._catchThrownErrors(() => {
      return this._gqlV2.getDef(params);
    }, null);
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
      return null;
    }

    return this._catchThrownErrors(() => {
      return this._gqlV2.getInfo(params);
    }, null);
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
