/* @flow */
import { Emitter } from 'event-kit';
export type EmitterSubscription = { remove: () => void };
export default Emitter;
