export default EventEmitter;
declare class EventEmitter {
    constructor(subscriber?: EventSubscriptionVendor);
    _subscriber: EventSubscriptionVendor;
    addListener(eventType: string, listener: Function, context: any): EventSubscription;
    removeAllListeners(eventType: string | null): void;
    removeSubscription(subscription: any): void;
    listenerCount(eventType: string): number;
    emit(eventType: string, ...args: any[]): void;
    removeListener(eventType: any, listener: any): void;
}
import EventSubscriptionVendor from "./_EventSubscriptionVendor.js";
//# sourceMappingURL=_EventEmitter.d.ts.map