import Image from "next/image";
import Link from "next/link";

import { footerLinks } from "@/constant";

type ColumnProps = {
    title: string;
    links: Array<string>;
};

const FooterColumn = ({ title, links }: ColumnProps) => (       //参数对象中提取名为 title 和 links 的属性
    <div className="footer_column">                         //不需要通过props.title和props.links这种方式来访问
        <h4 className="font-semibold">{title}</h4>
        <ul className="flex flex-col gap-2 font-normal">
            {links.map((link) => <Link href="/" key={link}>{link}</Link>)}  //link数组
        </ul>
    </div>
);

const Footer = () => (
    <section className="flexStart footer">      //flexStart并使其子元素沿主轴（通常是水平轴）从开始位置开始排列(左右都行）
        //flex-col: 这个类名通常表示将元素内部的子元素沿垂直方向（从上到下）排列  gap-12内部的子元素之间添加垂直间距
        //w-full: 这个类名通常表示将元素的宽度设置为与其容器的宽度相等，填满整个宽度   items-start   表示将元素内部的子元素沿交叉轴（与主轴垂直的轴）从开始位置开始排列。这通常用于控制子元素在交叉轴上的对齐。
        <div className="flex flex-col gap-12 w-full">
            <div className="flex items-start flex-col">
                <Image src="/logo-purple.svg" width={116} height={38} alt="logo" />

                <p className="text-start text-sm font-normal mt-5 max-w-xs">
                    Flexibble is the world&apos;s leading community for creatives to share, grow, and get hired.
                </p>
            </div>
            <div className="flex flex-wrap gap-12">
                <FooterColumn title={footerLinks[0].title} links={footerLinks[0].links} />

                <div className="flex-1 flex flex-col gap-4">        //flex-1占据其父容器中剩余的所有可用空间
                    <FooterColumn title={footerLinks[1].title} links={footerLinks[1].links} />
                    <FooterColumn title={footerLinks[2].title} links={footerLinks[2].links} />
                </div>

                <FooterColumn title={footerLinks[3].title} links={footerLinks[3].links} />

                <div className="flex-1 flex flex-col gap-4">
                    <FooterColumn title={footerLinks[4].title} links={footerLinks[4].links} />
                    <FooterColumn title={footerLinks[5].title} links={footerLinks[5].links} />
                </div>

                <FooterColumn title={footerLinks[6].title} links={footerLinks[6].links} />
            </div>
        </div>

        <div className="flexBetween footer_copyright">      //版权标识
            <p>@ 2023 Flexibble. All rights reserved</p>
            <p className="text-gray">
                <span className="text-black font-semibold">10,214</span> projects submitted
            </p>
        </div>
    </section>
);

export default Footer;
