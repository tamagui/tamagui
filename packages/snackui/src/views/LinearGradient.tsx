let exp = null

if (!process.env.SNACKUI_COMPILE_PROCESS) {
  exp = require('expo-linear-gradient').LinearGradient
}

// TODO type
export const LinearGradient = exp as any
