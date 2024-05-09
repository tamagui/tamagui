import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
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
    typeOfPicker: 'file' | 'image';
};
type NativeFiles<MT extends MediaTypeOptions[]> = MT[number] extends 'Images' ? ImagePicker.ImagePickerResult['assets'] : DocumentPicker.DocumentResult[];
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
    dragStatus: {
        isDragAccept: boolean;
        isDragActive: boolean;
        isDragReject: boolean;
    };
    getInputProps: () => null;
    getRootProps: () => null;
    open: () => Promise<void>;
    control: {
        dragStatus: {
            isDragAccept: boolean;
            isDragActive: boolean;
            isDragReject: boolean;
        };
        getInputProps: () => null;
        getRootProps: () => null;
        open: () => Promise<void>;
    };
};
export {};
//# sourceMappingURL=useFilePicker.native.d.ts.map