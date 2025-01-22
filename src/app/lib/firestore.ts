import { db } from "@/app/fireBaseConfig"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"

export const addImageToGallery = async (gallery: string, imageInfo: { title: string, description: string, name_in_bucket: string }) => {
    try {
        const newImage = await addDoc(collection(db, gallery), {
            ...imageInfo
        })
        if (newImage?.id) {
            return {
                ok: true,
                message: `Image with id: ${newImage.id} has been uploaded successfully!`
            }
        }
        throw new Error()
    } catch(error) {
        console.log(error)
        return {
            ok: false,
            message: 'There was an error trying to add the image to the database'
        }
    }
}

export const getDocsFromCollection = async (gallery: string) => {
    try {
        const docs = await getDocs(collection(db, gallery));
        return {
            ok: true,
            docs: docs.docs
        }
    } catch(error) {
        console.log(error)
        return {
            ok: false,
            message: 'There was an error trying to get all the information'
        }
    }
}

export const addUserToCollection = async (userInfo: {email: string, password: string}) => {
    try {
        const q = query(collection(db, "users"), where("email", "==", userInfo?.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            return {
                ok: false,
                message: 'The email is already registered'
            }
        }
        const newUser = await addDoc(collection(db, 'users'), {
            ...userInfo
        })
        if (newUser?.id) {
            return {
                ok: true,
                message: `User with id: ${newUser.id} has been created successfully!`
            }
        }
        throw new Error()
    } catch(error) {
        console.log(error)
        return {
            ok: false,
            message: 'There was an error trying to create the new User'
        }
    }
}