import {
  GetHeadConfig,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateRenderProps,
} from "@yext/pages";
import Locator from "../components/Locator";
import PageLayout from "../components/page-layout";
import "../index.css";
import { LocationsProvider } from "../common/LocationsContext";

export const config: TemplateConfig = {
  name: "search",
};

export const getPath = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Locator | Search",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: "Static page example meta description.",
        },
      },
    ],
  };
};

const Search: Template<TemplateRenderProps> = ({ document }) => {
  console.log(JSON.stringify(document));

  const { _site } = document;
  /*test*/
  return (
    <LocationsProvider>
      <PageLayout _site={_site}>
        <div>
          <Locator
            verticalKey={import.meta.env.YEXT_PUBLIC_VERTICAL_KEY}
          ></Locator>
        </div>
      </PageLayout>
    </LocationsProvider>
  );
};

export default Search;
