import { verifyPassword } from "../../../lib/auth";
import { db } from "../../../fireBaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        console.log("333333333333333333333333333");
        const docRef = await doc(db, "users", "wbkP0Io4IT4RMc8mdAso");
        console.log("TESTING------------->", querySnapshot.size);
        const docSnap = await getDoc(docRef);
        console.log("TESTING 2");
        const adminUser = docSnap.data();
        console.log("TESTING 3");
        console.log(password, adminUser?.password);
        const isValid = await verifyPassword(password, adminUser?.password);
        if (email.toLowerCase() === adminUser?.email.toLowerCase() && isValid) {
          return adminUser.email.toLowerCase();
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
