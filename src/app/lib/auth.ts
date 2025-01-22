"use server"
import { hash, compare } from 'bcrypt';
import { signIn } from "next-auth/react";
import { addUserToCollection } from "../lib/firestore";

export async function hashPassword(password: string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export async function createUser(email: string, password: string) {
    if (email.length >= 6 && password.length >= 6 && email.includes('@')) {
        const hashedPassword = await hashPassword(password);
        const response = await addUserToCollection({email, password: hashedPassword});
        return response;
    }
    return {
        ok: false,
        message: 'Invalid credentials, please try again'
    }
}

export async function authenticate(_currentState: unknown, formData: FormData) {
    try {
        await signIn('credentials', {formData});
    } catch(error) {
        console.log(error);
    }
};

