import { StaticImageData } from "next/image";
import { menuOptionsInterface } from "./app-header/appHeader.interface";

export interface PageBannerInterface {
    image: StaticImageData;
    bannerType: 1 | 2;
    images: object[];
}

export interface AppBarInterface {
    menuOptions: menuOptionsInterface[];
}