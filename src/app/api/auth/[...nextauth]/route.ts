import { verifyPassword } from "../../../lib/auth";
import { db } from "../../../fireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
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
        /* const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q); */
        const docRef = await doc(db, "users", "wbkP0Io4IT4RMc8mdAso");
        const docSnap = await getDoc(docRef);
        const adminUser = docSnap.data();
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
