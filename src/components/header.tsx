import { Image } from "@yext/pages-components";
 
const Header = ({_site}: any) => {
  const { c_header } = _site;

  return (
    <>
      {c_header && (
        <Image image={c_header} />
      ) }
    </>
  );
};

export default Header;


