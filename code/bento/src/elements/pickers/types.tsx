import type { DropzoneOptions } from 'react-dropzone'

export type DropZoneOptionsCustom = Omit<DropzoneOptions, 'accept'> & {
  // native only
  onOpen: DropzoneOptions['onDrop']
  // native only
  allowsEditing?: boolean
  mediaTypes?: MediaTypeOptions[]
}

export enum MediaTypeOptions {
  /**
   * Images and videos.
   */
  All = 'All',
  /**
   * Only videos.
   */
  Videos = 'Videos',
  /**
   * Only images.
   */
  Images = 'Images',
}
