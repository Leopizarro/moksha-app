import { db } from "../fireBaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ProductInterface } from "../interfaces/products.interface";

export const addProductToCollection = async (productInfo: ProductInterface) => {
  try {
    const newProduct = await addDoc(collection(db, "products"), {
      ...productInfo,
      createdAt: new Date(),
    });
    if (newProduct?.id) {
      const docSnap = await getDoc(newProduct);
      const docData = { id: docSnap.id, ...docSnap.data() } as ProductInterface;
      return {
        ok: true,
        message: `Product with id: ${newProduct.id} has been uploaded successfully!`,
        product: docData,
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

export async function updateDocFromCollection(
  collection: string,
  id: string,
  data: object
) {
  try {
    const docRef = doc(db, collection, id);
    await setDoc(docRef, data, { merge: true });
    return {
      ok: true,
      message: `Document with id ${id} was updated!`,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "There was an error trying to update de document",
    };
  }
}

export async function deleteDocFromCollection(collection: string, id: string) {
  try {
    const docRef = await doc(db, collection, id);
    await deleteDoc(docRef);
    return {
      ok: true,
      message: "Document deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "There was an error trying to delete the document",
    };
  }
}
