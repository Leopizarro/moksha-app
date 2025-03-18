import { db } from "../fireBaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { ProductInterface } from "../interfaces/products.interface";

export const addProductToCollection = async (productInfo: ProductInterface) => {
  try {
    const newProduct = await addDoc(collection(db, "products"), {
      ...productInfo,
      createdAt: Timestamp.now(),
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

export async function getProductsByFilters(
  filters?: object,
  currentPage?: number,
  maxPageSize?: number
) {
  try {
    let q;
    if (filters) {
      let queryFilters = [];
      Object.entries(filters)?.forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            // Use 'in' for multiple values
            queryFilters.push(where(key, "in", value));
          } else if (typeof value === "object" && value !== null) {
            // Handle range queries (e.g., { age: { operator: ">=", value: 25 } })
            queryFilters.push(where(key, value.operator, value.value));
          } else {
            // Standard equality filter
            queryFilters.push(where(key, "==", value));
          }
        }
      });
      q = query(
        collection(db, "products"),
        ...queryFilters,
        where("productState", "==", "on sale"),
        orderBy("createdAt", "desc"),
        limit(maxPageSize)
      );
    } else {
      q = query(
        collection(db, "products"),
        where("productState", "==", "on sale"),
        orderBy("createdAt", "desc"),
        limit(maxPageSize)
      );
    }
    let querySnapshot = await getDocs(q);
    const countSnapshot = await getCountFromServer(q);

    let lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    if (currentPage && currentPage > 1) {
      for (let i = 0; i < currentPage - 1; i++) {
        q = query(q, startAfter(lastDoc));
        querySnapshot = await getDocs(q);
        lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
    }

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      ok: true,
      message: "Products on sale retrieved successfully!",
      products,
      count: countSnapshot.data().count,
      lastDoc,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      ok: false,
      message: "There was an error trying to delete the document",
      products: [],
      count: 0,
      lastDoc: null,
    };
  }
}

export async function getProductsByCategory(status: string) {
  try {
    const q = query(
      collection(db, "products"),
      where("productCategory", "==", status),
      where("productState", "==", "on sale")
    );
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      ok: true,
      message: "Products on sale retrieved successfully!",
      products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      ok: false,
      message: "There was an error trying to delete the document",
      products: [],
    };
  }
}

export default async function getCountOfQuery(filters?: object) {
  try {
    let q;
    if (filters) {
      let queryFilters = [];
      Object.entries(filters)?.forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            // Use 'in' for multiple values
            queryFilters.push(where(key, "in", value));
          } else if (typeof value === "object" && value !== null) {
            // Handle range queries (e.g., { age: { operator: ">=", value: 25 } })
            queryFilters.push(where(key, value.operator, value.value));
          } else {
            // Standard equality filter
            queryFilters.push(where(key, "==", value));
          }
        }
      });
      q = query(
        collection(db, "products"),
        ...queryFilters,
        where("productState", "==", "on sale"),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "products"),
        where("productState", "==", "on sale"),
        orderBy("createdAt", "desc")
      );
    }
    const countSnapshot = await getCountFromServer(q);

    return {
      ok: true,
      message: "Total count retrieved successfully!",
      count: countSnapshot.data().count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      ok: false,
      message: "There was an error trying to get the total count",
      count: 0,
    };
  }
}
