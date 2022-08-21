export default EmitterSubscription;
declare class EmitterSubscription extends _EventSubscription {
    constructor(emitter: EventEmitter, subscriber: EventSubscriptionVendor, listener: Function, context: any);
    emitter: EventEmitter;
    listener: Function;
    context: any;
}
import _EventSubscription from "./_EventSubscription.js";
//# sourceMappingURL=_EmitterSubscription.d.ts.map