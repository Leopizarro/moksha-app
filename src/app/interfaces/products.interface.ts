import { Timestamp } from "firebase/firestore";

export interface ProductInterface {
  id: string;
  imageUrl: string;
  description?: string;
  thumbnailImageUrl: string;
  price: number;
  title: string;
  productCategory: string;
  productState: string;
  createdAt: Timestamp;
}
