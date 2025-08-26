import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|login|privacy-policy|_next/static|_next/image|favicon.ico).*)"],
};
