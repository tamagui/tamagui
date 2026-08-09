export function isTrustedPublishingEnvironment(env: NodeJS.ProcessEnv) {
  return (
    env.GITHUB_ACTIONS === 'true' &&
    !!env.ACTIONS_ID_TOKEN_REQUEST_URL &&
    !!env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  )
}

export async function ensureNpmAuthentication({
  env,
  interactive,
  check,
  login,
}: {
  env: NodeJS.ProcessEnv
  interactive: boolean
  check: () => Promise<unknown>
  login: () => Promise<unknown>
}) {
  if (isTrustedPublishingEnvironment(env)) {
    return
  }

  try {
    await check()
    return
  } catch {}

  if (!interactive) {
    throw new Error(
      'npm is not authenticated for publishing. Run `npm login` and then re-run the release.'
    )
  }

  console.info('\nnpm is not authenticated. `npm login` will open your browser.')
  try {
    await login()
  } catch {}

  try {
    await check()
  } catch (err) {
    throw new Error(
      `npm is still not authenticated after login. Run \`npm login\` and then re-run the release.\n\n${err}`
    )
  }
}
