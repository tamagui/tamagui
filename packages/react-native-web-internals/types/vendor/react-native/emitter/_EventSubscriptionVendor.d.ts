export default EventSubscriptionVendor;
declare class EventSubscriptionVendor {
    _subscriptionsForType: {};
    addSubscription(eventType: string, subscription: EventSubscription): EventSubscription;
    removeAllSubscriptions(eventType: string | null): void;
    removeSubscription(subscription: object): void;
    getSubscriptionsForType(eventType: string): any[] | null;
}
//# sourceMappingURL=_EventSubscriptionVendor.d.ts.map