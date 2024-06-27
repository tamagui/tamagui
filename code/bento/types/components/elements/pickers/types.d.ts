import type { DropzoneOptions } from 'react-dropzone';
export type DropZoneOptionsCustom = Omit<DropzoneOptions, 'accept'> & {
    onOpen: DropzoneOptions['onDrop'];
    allowsEditing?: boolean;
    mediaTypes?: MediaTypeOptions[];
};
export declare enum MediaTypeOptions {
    /**
     * Images and videos.
     */
    All = "All",
    /**
     * Only videos.
     */
    Videos = "Videos",
    /**
     * Only images.
     */
    Images = "Images"
}
//# sourceMappingURL=types.d.ts.map