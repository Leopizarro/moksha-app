export { default } from "next-auth/middleware";

export const config = {
  // routes protected with authentication (NextJs Auth)
  matcher: ["/signup", "/upload", "/edit/:id"],
};
