/// <reference types="react" />
import { LinkCoreProps } from 'solito/link';
import { AnchorProps } from 'tamagui';
export type TextLinkProps = Pick<LinkCoreProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: import("react").ForwardRefExoticComponent<Omit<TextLinkProps, "ref"> & import("react").RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map