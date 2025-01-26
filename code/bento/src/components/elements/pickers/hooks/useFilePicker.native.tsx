import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useEvent } from 'tamagui'

import { useDropZone } from './useDropZone'

export type MediaTypeOptions = 'All' | 'Videos' | 'Images' | 'Audios'
export type UseFilePickerControl = {
  open: () => void
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T
  dragStatus?: {
    isDragAccept: boolean
    isDragActive: boolean
    isDragReject: boolean
  }
  typeOfPicker: 'file' | 'image'
}

type NativeFiles<MT extends MediaTypeOptions[]> = MT[number] extends 'Images'
  ? ImagePicker.ImagePickerResult['assets']
  : //@ts-ignore
    DocumentPicker.DocumentResult[]
export type OnPickType<MT extends MediaTypeOptions[]> = (param: {
  webFiles: File[] | null
  nativeFiles: NativeFiles<MT> | null
}) => void | Promise<void>
type UseFilePickerProps<MT extends MediaTypeOptions> = {
  mediaTypes: MT[]
  onPick: OnPickType<MT[]>
  /** multiple only works for image only types on native, but on web it works regarding the media types */
  multiple: boolean
  typeOfPicker: 'file' | 'image'
}

export function useFilePicker<MT extends MediaTypeOptions>(
  props?: UseFilePickerProps<MT>
) {
  const { mediaTypes, onPick, typeOfPicker, ...rest } = props || {}

  // const _onDrop = useEvent((webFiles) => {
  //   if (onPick) {
  //     onPick({ webFiles, nativeFiles: null })
  //   }
  // })

  // const _onOpenDocumentNative = useEvent(async () => {
  //   let result = await DocumentPicker.getDocumentAsync({
  //     type: 'application/pdf',
  //     multiple: false,
  //   })

  //   if (result.type === 'success') {
  //     onPick({ webFiles: null, nativeFiles: result.uri })
  //   }
  // })

  const _onOpenNative = useEvent((nativeFiles) => {
    if (onPick) {
      onPick({ webFiles: null, nativeFiles })
    }
  })

  const { open, getInputProps, getRootProps, isDragAccept, isDragActive, isDragReject } =
    useDropZone({
      onOpen: _onOpenNative,
      // @ts-ignore
      mediaTypes,
      noClick: true,
      ...rest,
    })

  const _handleOpenNative = async () => {
    // No permissions request is necessary for launching the image or document library
    if (typeOfPicker === 'image') {
      let result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsMultipleSelection: true,
      })
      _onOpenNative(result.assets)
    } else {
      let result = await DocumentPicker.getDocumentAsync()
      _onOpenNative(result.assets)
    }
  }

  const control = {
    dragStatus: {
      isDragAccept,
      isDragActive,
      isDragReject,
    },
    getInputProps: () => null,
    getRootProps: () => null,
    open: _handleOpenNative,
  }

  return { control, ...control }
}
