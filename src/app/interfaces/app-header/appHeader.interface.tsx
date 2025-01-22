import { ReactElement } from "react";

export interface menuOptionsInterface {
    text: string;
    mobileText?: string;
    icon?: ReactElement;
    redirectPath: string;
    last: boolean;
    dataTestId: string;
};