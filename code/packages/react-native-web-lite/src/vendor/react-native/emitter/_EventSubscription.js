

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
class _EventSubscription {
  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */
  constructor(subscriber) {
    this.subscriber = subscriber
  }
  /**
   * Removes this subscription from the subscriber that controls it.
   */

  remove() {
    this.subscriber.removeSubscription(this)
  }
}

export default _EventSubscription
