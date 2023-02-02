import { FacebookOutlined, GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Footer as AntFooter, } from "antd/lib/layout/layout"
import Image from 'next/image';
import Logo from '~public/logo_footer.png';
import CenterContainer from "./CenterContainer";

const Footer =  () => {
    return (
        <AntFooter className="bg-[#141414]">
            <CenterContainer className="gap-1 ">
                <Image src={Logo} alt="Move Block logo" />
                <div>
                    <Button shape="circle" type="link" href="https://github.com/move-block" icon={<GithubOutlined style={{ color: 'white' }}/>} />
                    <Button shape="circle" type="link" href="/" icon={<TwitterOutlined style={{ color: 'white' }}/>} />
                    <Button shape="circle" type="link" href="/" icon={<FacebookOutlined style={{ color: 'white' }}/>} />   
                </div>
            </CenterContainer>
        </AntFooter>
    )
}

export default Footer;