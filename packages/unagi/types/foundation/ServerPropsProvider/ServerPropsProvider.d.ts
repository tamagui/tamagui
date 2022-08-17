import React, { ReactNode } from 'react';
declare global {
    var __UNAGI_DEV__: boolean;
    var __UNAGI_TEST__: boolean;
}
export interface LocationServerProps {
    pathname: string;
    search: string;
}
export interface ServerProps {
    [key: string]: any;
}
declare type ServerPropsSetterInput = ((prev: ServerProps) => Partial<ServerProps>) | Partial<ServerProps> | string;
export interface ServerPropsSetter {
    (input: ServerPropsSetterInput, propValue?: any): void;
}
interface ProposedServerPropsSetter {
    (input: ServerPropsSetterInput, propValue?: any): LocationServerProps;
}
interface BaseServerPropsContextValue {
    pending: boolean;
}
export interface InternalServerPropsContextValue extends BaseServerPropsContextValue {
    setLocationServerProps: ServerPropsSetter;
    setServerProps: ServerPropsSetter;
    serverProps: ServerProps;
    locationServerProps: LocationServerProps;
    getProposedLocationServerProps: ProposedServerPropsSetter;
    setRscResponseFromApiRoute: (response: any) => void;
}
export interface ServerPropsContextValue extends BaseServerPropsContextValue {
    serverProps: ServerProps;
    setServerProps: ServerPropsSetter;
}
export declare const ServerPropsContext: React.Context<InternalServerPropsContextValue>;
interface ServerPropsProviderProps {
    initialServerProps: LocationServerProps;
    setServerPropsForRsc: React.Dispatch<React.SetStateAction<LocationServerProps>>;
    setRscResponseFromApiRoute: (response: any) => void;
    children: ReactNode;
}
export declare function ServerPropsProvider({ initialServerProps, setServerPropsForRsc, setRscResponseFromApiRoute, children, }: ServerPropsProviderProps): JSX.Element;
export {};
//# sourceMappingURL=ServerPropsProvider.d.ts.map