import type * as DocumentPicker from 'expo-document-picker';
import type * as ImagePicker from 'expo-image-picker/src/ImagePicker';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
export type MediaTypeOptions = 'All' | 'Videos' | 'Images' | 'Audios';
export type UseFilePickerControl = {
    open: () => void;
    getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
    getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
    dragStatus?: {
        isDragAccept: boolean;
        isDragActive: boolean;
        isDragReject: boolean;
    };
};
type NativeFiles<MT extends MediaTypeOptions[]> = MT[number] extends 'Images' ? ImagePicker.ImagePickerResult['assets'] : DocumentPicker.DocumentPickerResult[];
export type OnPickType<MT extends MediaTypeOptions[]> = (param: {
    webFiles: File[] | null;
    nativeFiles: NativeFiles<MT> | null;
}) => void | Promise<void>;
type UseFilePickerProps<MT extends MediaTypeOptions> = {
    mediaTypes: MT[];
    onPick: OnPickType<MT[]>;
    /** multiple only works for image only types on native, but on web it works regarding the media types */
    multiple: boolean;
    typeOfPicker: 'file' | 'image';
};
export declare function useFilePicker<MT extends MediaTypeOptions>(props?: UseFilePickerProps<MT>): {
    open: () => void;
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    dragStatus: {
        isDragAccept: boolean;
        isDragActive: boolean;
        isDragReject: boolean;
    };
    control: {
        open: () => void;
        getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
        getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
        dragStatus: {
            isDragAccept: boolean;
            isDragActive: boolean;
            isDragReject: boolean;
        };
    };
};
export {};
//# sourceMappingURL=useFilePicker.d.ts.map