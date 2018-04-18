declare module 'vscode-jsonrpc' {
  import type { Thenable } from 'thenable';
  import type { ICancellationToken } from 'vscode-jsonrpc/lib/cancellation';
  import type {
    ResponseError,
    ResponseMessage,
    RequestType as _RequestType,
    RequestType0 as _RequestType0,
    RequestType1,
    RequestType2,
    RequestType3,
    RequestType4,
    RequestType5,
    RequestType6,
    RequestType7,
    RequestType8,
    RequestType9,
    NotificationMessage,
    NotificationType as _NotificationType,
    NotificationType0 as _NotificationType0,
    NotificationType1,
    NotificationType2,
    NotificationType3,
    NotificationType4,
    NotificationType5,
    NotificationType6,
    NotificationType7,
    NotificationType8,
    NotificationType9,
  } from 'vscode-jsonrpc/lib/messages';

  import type { IDisposable as _IDisposable } from 'vscode-jsonrpc/lib/events';

  declare export type RequestType<P, R, E, RO> = _RequestType<P, R, E, RO>;
  declare export type RequestType0<R, E, RO> = _RequestType0<R, E, RO>;
  declare export type NotificationType<P, RO> = _NotificationType<P, RO>;
  declare export type NotificationType0<RO> = _NotificationType0<RO>;
  declare export type IDisposable = _IDisposable;

  declare export type HandlerResult<R, E> = Thenable<R> | R;

  declare export interface StarRequestHandler {
    (method: string, ...params: any[]): HandlerResult<any, any>;
  }

  declare export interface GenericRequestHandler<R, E> {
    (...params: any[]): HandlerResult<R, E>;
  }

  declare export type RequestHandler0<R, E> = (
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler<P, R, E> = (
    params: P,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler1<P1, R, E> = (
    p1: P1,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler2<P1, P2, R, E> = (
    p1: P1,
    p2: P2,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler3<P1, P2, P3, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler4<P1, P2, P3, P4, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler5<P1, P2, P3, P4, P5, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler6<P1, P2, P3, P4, P5, P6, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler7<P1, P2, P3, P4, P5, P6, P7, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler8<P1, P2, P3, P4, P5, P6, P7, P8, R, E> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
    p8: P8,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type RequestHandler9<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    R,
    E,
  > = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
    p8: P8,
    p9: P9,
    token: ICancellationToken,
  ) => HandlerResult<R, E>;

  declare export type StarNotificationHandler = (
    method: string,
    ...params: any[]
  ) => void;

  declare export type GenericNotificationHandler = (...params: any[]) => void;

  declare export type NotificationHandler0 = () => void;
  declare export type NotificationHandler<P> = (params: P) => void;
  declare export type NotificationHandler1<P1> = (p1: P1) => void;
  declare export type NotificationHandler2<P1, P2> = (p1: P1, p2: P2) => void;
  declare export type NotificationHandler3<P1, P2, P3> = (
    p1: P1,
    p2: P2,
    p3: P3,
  ) => void;
  declare export type NotificationHandler4<P1, P2, P3, P4> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
  ) => void;
  declare export type NotificationHandler5<P1, P2, P3, P4, P5> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
  ) => void;
  declare export type NotificationHandler6<P1, P2, P3, P4, P5, P6> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
  ) => void;
  declare export type NotificationHandler7<P1, P2, P3, P4, P5, P6, P7> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
  ) => void;
  declare export type NotificationHandler8<P1, P2, P3, P4, P5, P6, P7, P8> = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
    p8: P8,
  ) => void;

  declare export type NotificationHandler9<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
  > = (
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4,
    p5: P5,
    p6: P6,
    p7: P7,
    p8: P8,
    p9: P9,
  ) => void;

  declare export interface Logger {
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    log(message: string): void;
  }
  declare export var NullLogger: Logger;

  declare export type TraceValues = 'off' | 'messages' | 'verbose';

  declare var Trace: {
    fromString(value: string): TraceValues,
    toString(value: TraceValues): TraceValues,
  };

  declare export interface SetTraceParams {
    value: TraceValues;
  }
  declare var type: NotificationType<SetTraceParams, void>;

  declare export interface LogTraceParams {
    message: string;
    verbose?: string;
  }
  declare var type: NotificationType<LogTraceParams, void>;
  declare export interface Tracer {
    log(message: string, data?: string): void;
  }

  declare export var ConnectionErrors: {
    /**
     * The connection is closed.
     */
    Closed: 1,
    /**
     * The connection got disposed.
     */
    Disposed: 2,
    /**
     * The connection is already in listening mode.
     */
    AlreadyListening: 3,
  };
  declare type ConnectionErrorType = 1 | 2 | 3;

  declare export class ConnectionError {
    code: ConnectionErrorType;
    constructor(code: ConnectionErrorType, message: string): this;
  }

  declare export type MessageQueue = LinkedMap<string, Message>;

  declare export type IConnectionStrategy = {
    cancelUndispatched?: (
      message: Message,
      next: (message: Message) => ResponseMessage | void,
    ) => ResponseMessage | void,
  };

  declare export var ConnectionStrategy: {
    is(value: any): IConnectionStrategy,
  };

  declare export interface MessageConnection {
    sendRequest<R, E, RO>(
      type: RequestType0<R, E, RO>,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P, R, E, RO>(
      type: RequestType<P, R, E, RO>,
      params: P,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, R, E, RO>(
      type: RequestType1<P1, R, E, RO>,
      p1: P1,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, R, E, RO>(
      type: RequestType2<P1, P2, R, E, RO>,
      p1: P1,
      p2: P2,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, R, E, RO>(
      type: RequestType3<P1, P2, P3, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, R, E, RO>(
      type: RequestType4<P1, P2, P3, P4, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, P5, R, E, RO>(
      type: RequestType5<P1, P2, P3, P4, P5, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, P5, P6, R, E, RO>(
      type: RequestType6<P1, P2, P3, P4, P5, P6, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, P5, P6, P7, R, E, RO>(
      type: RequestType7<P1, P2, P3, P4, P5, P6, P7, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, P5, P6, P7, P8, R, E, RO>(
      type: RequestType8<P1, P2, P3, P4, P5, P6, P7, P8, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
      p8: P8,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, RO>(
      type: RequestType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
      p8: P8,
      p9: P9,
      token?: ICancellationToken,
    ): Thenable<R>;
    sendRequest<R>(method: string, ...params: any[]): Thenable<R>;
    onRequest<R, E, RO>(
      type: RequestType0<R, E, RO>,
      handler: RequestHandler0<R, E>,
    ): void;
    onRequest<P, R, E, RO>(
      type: RequestType<P, R, E, RO>,
      handler: RequestHandler<P, R, E>,
    ): void;
    onRequest<P1, R, E, RO>(
      type: RequestType1<P1, R, E, RO>,
      handler: RequestHandler1<P1, R, E>,
    ): void;
    onRequest<P1, P2, R, E, RO>(
      type: RequestType2<P1, P2, R, E, RO>,
      handler: RequestHandler2<P1, P2, R, E>,
    ): void;
    onRequest<P1, P2, P3, R, E, RO>(
      type: RequestType3<P1, P2, P3, R, E, RO>,
      handler: RequestHandler3<P1, P2, P3, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, R, E, RO>(
      type: RequestType4<P1, P2, P3, P4, R, E, RO>,
      handler: RequestHandler4<P1, P2, P3, P4, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, P5, R, E, RO>(
      type: RequestType5<P1, P2, P3, P4, P5, R, E, RO>,
      handler: RequestHandler5<P1, P2, P3, P4, P5, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, P5, P6, R, E, RO>(
      type: RequestType6<P1, P2, P3, P4, P5, P6, R, E, RO>,
      handler: RequestHandler6<P1, P2, P3, P4, P5, P6, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, P5, P6, P7, R, E, RO>(
      type: RequestType7<P1, P2, P3, P4, P5, P6, P7, R, E, RO>,
      handler: RequestHandler7<P1, P2, P3, P4, P5, P6, P7, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, P5, P6, P7, P8, R, E, RO>(
      type: RequestType8<P1, P2, P3, P4, P5, P6, P7, P8, R, E, RO>,
      handler: RequestHandler8<P1, P2, P3, P4, P5, P6, P7, P8, R, E>,
    ): void;
    onRequest<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, RO>(
      type: RequestType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, RO>,
      handler: RequestHandler9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E>,
    ): void;
    onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): void;
    onRequest(handler: StarRequestHandler): void;
    sendNotification<RO>(type: NotificationType0<RO>): void;
    sendNotification<P, RO>(type: NotificationType<P, RO>, params?: P): void;
    sendNotification<P1, RO>(type: NotificationType1<P1, RO>, p1: P1): void;
    sendNotification<P1, P2, RO>(
      type: NotificationType2<P1, P2, RO>,
      p1: P1,
      p2: P2,
    ): void;
    sendNotification<P1, P2, P3, RO>(
      type: NotificationType3<P1, P2, P3, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
    ): void;
    sendNotification<P1, P2, P3, P4, RO>(
      type: NotificationType4<P1, P2, P3, P4, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
    ): void;
    sendNotification<P1, P2, P3, P4, P5, RO>(
      type: NotificationType5<P1, P2, P3, P4, P5, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
    ): void;
    sendNotification<P1, P2, P3, P4, P5, P6, RO>(
      type: NotificationType6<P1, P2, P3, P4, P5, P6, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
    ): void;
    sendNotification<P1, P2, P3, P4, P5, P6, P7, RO>(
      type: NotificationType7<P1, P2, P3, P4, P5, P6, P7, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
    ): void;
    sendNotification<P1, P2, P3, P4, P5, P6, P7, P8, RO>(
      type: NotificationType8<P1, P2, P3, P4, P5, P6, P7, P8, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
      p8: P8,
    ): void;
    sendNotification<P1, P2, P3, P4, P5, P6, P7, P8, P9, RO>(
      type: NotificationType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, RO>,
      p1: P1,
      p2: P2,
      p3: P3,
      p4: P4,
      p5: P5,
      p6: P6,
      p7: P7,
      p8: P8,
      p9: P9,
    ): void;
    sendNotification(method: string, ...params: any[]): void;
    onNotification<RO>(
      type: NotificationType0<RO>,
      handler: NotificationHandler0,
    ): void;
    onNotification<P, RO>(
      type: NotificationType<P, RO>,
      handler: NotificationHandler<P>,
    ): void;
    onNotification<P1, RO>(
      type: NotificationType1<P1, RO>,
      handler: NotificationHandler1<P1>,
    ): void;
    onNotification<P1, P2, RO>(
      type: NotificationType2<P1, P2, RO>,
      handler: NotificationHandler2<P1, P2>,
    ): void;
    onNotification<P1, P2, P3, RO>(
      type: NotificationType3<P1, P2, P3, RO>,
      handler: NotificationHandler3<P1, P2, P3>,
    ): void;
    onNotification<P1, P2, P3, P4, RO>(
      type: NotificationType4<P1, P2, P3, P4, RO>,
      handler: NotificationHandler4<P1, P2, P3, P4>,
    ): void;
    onNotification<P1, P2, P3, P4, P5, RO>(
      type: NotificationType5<P1, P2, P3, P4, P5, RO>,
      handler: NotificationHandler5<P1, P2, P3, P4, P5>,
    ): void;
    onNotification<P1, P2, P3, P4, P5, P6, RO>(
      type: NotificationType6<P1, P2, P3, P4, P5, P6, RO>,
      handler: NotificationHandler6<P1, P2, P3, P4, P5, P6>,
    ): void;
    onNotification<P1, P2, P3, P4, P5, P6, P7, RO>(
      type: NotificationType7<P1, P2, P3, P4, P5, P6, P7, RO>,
      handler: NotificationHandler7<P1, P2, P3, P4, P5, P6, P7>,
    ): void;
    onNotification<P1, P2, P3, P4, P5, P6, P7, P8, RO>(
      type: NotificationType8<P1, P2, P3, P4, P5, P6, P7, P8, RO>,
      handler: NotificationHandler8<P1, P2, P3, P4, P5, P6, P7, P8>,
    ): void;
    onNotification<P1, P2, P3, P4, P5, P6, P7, P8, P9, RO>(
      type: NotificationType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, RO>,
      handler: NotificationHandler9<P1, P2, P3, P4, P5, P6, P7, P8, P9>,
    ): void;
    onNotification(method: string, handler: GenericNotificationHandler): void;
    onNotification(handler: StarNotificationHandler): void;
    trace(value: TraceValues, tracer: Tracer, sendNotification?: boolean): void;
    onError: Event<[Error, Message | void, number | void]>;
    onClose: Event<void>;
    onUnhandledNotification: Event<NotificationMessage>;
    listen(): void;
    onDispose: Event<void>;
    dispose(): void;
    inspect(): void;
  }

  declare type MessageReader = any;
  declare type MessageWriter = any;

  declare export function createMessageConnection(
    reader: MessageReader,
    writer: MessageWriter,
    logger?: Logger,
    strategy?: IConnectionStrategy,
  ): MessageConnection;
}
