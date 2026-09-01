const isAuthFailure = (error) => {
  if (error?.code === 'EOTP') {
    return true
  }

  return (
    error?.code === 'E401' &&
    /one-time pass|one[- ]time password|two-factor|2fa|otp/i.test(
      `${error.message || ''}\n${error.body || ''}`
    )
  )
}

const publishInBatches = async ({
  workspaces,
  publish,
  onAuthFailure,
  batchSize = 6,
  maxAttempts = 2,
}) => {
  const failures = []

  for (let index = 0; index < workspaces.length; index += batchSize) {
    let pending = workspaces.slice(index, index + batchSize)

    for (let attempt = 0; pending.length > 0 && attempt < maxAttempts; attempt++) {
      const [leader, ...followers] = pending

      try {
        await publish(leader)
      } catch (error) {
        if (isAuthFailure(error)) {
          onAuthFailure()
        }
        continue
      }

      const results = await Promise.allSettled(followers.map(publish))
      if (
        results.some(
          (result) => result.status === 'rejected' && isAuthFailure(result.reason)
        )
      ) {
        onAuthFailure()
      }

      pending = results.flatMap((result, resultIndex) =>
        result.status === 'rejected' ? [followers[resultIndex]] : []
      )
    }

    failures.push(...pending)
  }

  return failures
}

module.exports = {
  isAuthFailure,
  publishInBatches,
}
