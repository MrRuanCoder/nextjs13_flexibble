"use client"        //引入或导入指令,用于引入客户端端的相关模块、库或函数

import { getProviders, signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

import Button from './Button';

type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | undefined;       //可选字段
  };

//Record 是 TypeScript 中的一个泛型类型。它用于表示一个拥有字符串类型键的对象
  type Providers = Record<string, Provider>;


const AuthProviders = () => {
    const [providers, setProviders] = useState<Providers | null>(null);     //类型注解，用于指定变量 providers 的类型

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();

            console.log(res);           //  查看令牌是否正确
    
            setProviders(res);
        }

        fetchProviders();
    }, []);     //[] 表示一个空的依赖数组。当你将依赖数组作为空数组时，它告诉React该 useEffect 只在组件挂载时执行，
    // 而不依赖于任何特定的变量(而不会对特定的变量进行依赖追踪)。也就是说，它只在组件的初始渲染时执行一次。

    if (providers) {
        return (
            <div>
                {Object.values(providers).map((provider: Provider, i) => (
                    <Button key={i} title='Sign In' handleClick={() => signIn(provider?.id)} />     //如果id存在的话，就调用传递
                ))}
            </div>
        )
    }
}

export default AuthProviders