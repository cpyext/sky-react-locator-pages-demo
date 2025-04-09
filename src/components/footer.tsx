import { Image } from "@yext/pages-components";
 const Footer = ({_site}: any) => {
  const { c_footer } = _site;
  return (
    <>
      {c_footer && (
        <Image image={c_footer} />
      ) }
    </>
  );
};

export default Footer;
