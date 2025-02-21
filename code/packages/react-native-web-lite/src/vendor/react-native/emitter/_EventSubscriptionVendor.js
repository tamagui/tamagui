

import { invariant } from '@tamagui/react-native-web-internals'

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */
class EventSubscriptionVendor {
  constructor() {
    this._subscriptionsForType = {}
  }
  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */

  addSubscription(eventType, subscription) {
    invariant(
      subscription.subscriber === this,
      'The subscriber of the subscription is incorrectly set.'
    )

    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = []
    }

    var key = this._subscriptionsForType[eventType].length

    this._subscriptionsForType[eventType].push(subscription)

    subscription.eventType = eventType
    subscription.key = key
    return subscription
  }
  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param {?string} eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */

  removeAllSubscriptions(eventType) {
    if (eventType == null) {
      this._subscriptionsForType = {}
    } else {
      delete this._subscriptionsForType[eventType]
    }
  }
  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   * @param {object} subscription
   */

  removeSubscription(subscription) {
    var eventType = subscription.eventType
    var key = subscription.key
    var subscriptionsForType = this._subscriptionsForType[eventType]

    if (subscriptionsForType) {
      delete subscriptionsForType[key]
    }
  }
  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   * TODO: This returns a nullable array. wat?
   *
   * @param {string} eventType
   * @returns {?array}
   */

  getSubscriptionsForType(eventType) {
    return this._subscriptionsForType[eventType]
  }
}

export default EventSubscriptionVendor
