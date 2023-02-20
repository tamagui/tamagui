import * as Burnt from 'burnt'

export const createNativeToast = ({ title, body, duration, preset }: CreateNativeToastsOptions) => {
  Burnt.toast({
    title,
    message: body ?? "",
    preset,
    duration,
  })
}
