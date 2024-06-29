import type { getUserAccessInfo } from '~/features/user/helpers'

export function checkDiscountEligibility({
  accessInfo,
  purchaseContainsBento,
  purchaseContainsTakeout,
}: {
  accessInfo?: Awaited<ReturnType<typeof getUserAccessInfo>>
  purchaseContainsTakeout: boolean
  purchaseContainsBento: boolean
}) {
  return (
    (accessInfo?.hasBentoAccess && purchaseContainsTakeout) ||
    // user already has takeout, wants to buy bento
    (accessInfo?.hasTakeoutAccess && purchaseContainsBento) ||
    // user is buying both bento and takeout
    (purchaseContainsBento && purchaseContainsTakeout)
  )
}
