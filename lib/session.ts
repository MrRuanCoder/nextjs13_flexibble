import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";

import { createUser, getUser } from "./actions";
import { SessionInterface, UserProfile } from "@/common.types";

export const authOptions: NextAuthOptions = {   //指定变量为NextAuthOptions 的对象
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,      //需要google cloud相关服务
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,    //非空断言操作符,！表示一定有值
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );

      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret);
      return decodedToken as JWT;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;   //可选链操作符 ?. 来安全地访问属性，如果属性不存在则返回 undefined

      try {
        //111  ? 表示 user 属性是可选的，即它不一定要存在在对象中。如果存在，它的类型应该是 UserProfile
        //as { user?: UserProfile } 表示将 await getUser(email) 返回的值断言为具有一个名为 user 的可选属性的对象，
        // 且这个属性的类型应该符合 UserProfile 的类型。
        const data = await getUser(email) as { user?: UserProfile }

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        };

        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    //{ user } 是参数解构的语法。它表示从传递给函数的参数对象中提取 user 属性，并将其赋值给一个名为 user 的局部变量。
    //: 表示类型注解，指定了 user 参数的类型。
    async signIn({ user }: {
      user: AdapterUser | User
    }) {
      try {
        //如果user对象存在且具有email属性，就会获取它，否则返回undefined。
        // 接着，as string部分将结果强制转换为字符串类型，以确保getUser函数接受的参数是字符串。
        //as { user?: UserProfile }类型断言,告诉TypeScript将getUser函数的返回值视为具有user属性的对象,该属性的类型应该符合UserProfile类型。
        const userExists = await getUser(user?.email as string) as { user?: UserProfile }
        
        if (!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string)
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);    //异常报错检测
        return false;
      }
    },
  },
};
//
export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;    //extends了session

  return session;
}
