import { db } from "../fireBaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ProductInterface } from "../interfaces/products.interface";

export const addProductToCollection = async (productInfo: {
  title: string;
  price: number;
  productCategory: string;
  productState: string;
  imageUrl: string;
}) => {
  try {
    const newProduct = await addDoc(collection(db, "products"), {
      ...productInfo,
      createdAt: new Date(),
    });
    if (newProduct?.id) {
      return {
        ok: true,
        message: `Product with id: ${newProduct.id} has been uploaded successfully!`,
      };
    }
    throw new Error();
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "There was an error trying to add the product into the database",
    };
  }
};

export const getDocsFromCollection = async (collectionName: string) => {
  try {
    const docs = await getDocs(collection(db, collectionName));
    const docsData = docs.docs.map((item) => ({ id: item.id, ...item.data() }));
    return {
      ok: true,
      docs: docsData,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "There was an error trying to get all the information",
    };
  }
};

export async function getOneDocFromCollection(
  docId: string,
  collectionName: string
) {
  if (!docId || !collectionName) {
    throw new Error("Invalid ID or collection name provided");
  }
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  const docData = { id: docSnap.id, ...docSnap.data() } as ProductInterface;
  return docData;
}

export const addUserToCollection = async (userInfo: {
  email: string;
  password: string;
}) => {
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", userInfo?.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      return {
        ok: false,
        message: "The email is already registered",
      };
    }
    const newUser = await addDoc(collection(db, "users"), {
      ...userInfo,
    });
    if (newUser?.id) {
      return {
        ok: true,
        message: `User with id: ${newUser.id} has been created successfully!`,
      };
    }
    throw new Error();
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "There was an error trying to create the new User",
    };
  }
};
