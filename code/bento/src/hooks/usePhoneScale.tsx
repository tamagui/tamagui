// Simple hook for components that need phone scaling
// Returns scale=1 and invertScale=1 (no scaling) - can be customized per app
export const usePhoneScale = () => {
  return {
    scale: 1,
    invertScale: 1,
  }
}
