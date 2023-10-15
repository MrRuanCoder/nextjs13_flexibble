import NextAuth from "next-auth";

import { authOptions } from "@/lib/session";

const handler = NextAuth(authOptions);

//一行导出身份验证处理程序，使其可以被 Next.js 应用程序访问。
// 可以在你的 Next.js 应用程序中使用这两个命名的处理程序来处理 GET 和 POST 请求，以进行身份验证。
export { handler as GET, handler as POST };
