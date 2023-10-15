import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/constant";
import { getCurrentUser } from "@/lib/session";

import AuthProviders from "./AuthProviders";
import Button from "./Button";
import ProfileMenu from "./ProfileMenu";

const Navbar = async () => {
    const session = await getCurrentUser()

    return (
        <nav className='flexBetween navbar'>
            <div className='flex-1 flexStart gap-10'>
                <Link href='/'>     //主页重定向图片
                    <Image
                        src='/logo.svg'
                        width={116}
                        height={43}
                        alt='logo'
                    />
                </Link>
                <ul className='xl:flex hidden text-small gap-7'>        //xl:flex:种响应式设计的技巧，以便在不同的屏幕尺寸下应用不同的样式
                    {NavLinks.map((link) => (
                        <Link href={link.href} key={link.text}>
                            {link.text}
                        </Link>
                    ))}
                </ul>
            </div>

            <div className='flexCenter gap-4'>        //有session显示用户图片和profile，无显示Auth来login
                {session?.user ? (
                    <>
                        <ProfileMenu session={session} />

                        <Link href="/create-project">
                            <Button title='Share work' />
                        </Link>
                    </>
                ) : (
                    <AuthProviders />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
