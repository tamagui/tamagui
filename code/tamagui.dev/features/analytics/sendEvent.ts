import { currentUser } from '../user/useUser'

export const sendEvent = (name: string, props?: Object) => {
  // @ts-expect-error
  const oneDollarAnalytics = window.stonks?.event

  if (typeof oneDollarAnalytics === 'undefined') {
    console.warn(`Analytics not set up yet`)
    return
  }

  if (currentUser) {
    oneDollarAnalytics(name, {
      ...props,
      userId: currentUser.user.id,
    })
  } else {
    oneDollarAnalytics(name, props)
  }
}
