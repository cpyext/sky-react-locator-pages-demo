import { Address } from "@yext/types";

interface DirectoryProps {
  id: string;
  name: string;
  slug: string;
}

interface BreadcrumbsProps {
  data: Address;
  currAddress: string;
}

export const BreadCrumbs = ({ data, currAddress }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex w-full -mb-8">
      <ol
        role="list"
        className="flex flex-wrap items-center  w-full  text-sm md:text-base"
      >
        <li className="w-fit flex items-center">
          <a
            href="#"
            className="text-secondary decoration-2 underline-offset-4"
          >
            All Locations
          </a>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="size-5 ml-2"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
        </li>
        <li key={data.region} className="flex items-start w-fit">
          <a
            href={"#"}
            className="mx-2 text-sm text-secondary decoration-2 underline-offset-4  break-words"
          >
            {data.region}
          </a>
          <div className="shrink-0 flex items-center">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="size-5 "
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
          </div>
        </li>
        <li key={data.city} className="flex items-start w-fit">
          <a
            href={"#"}
            className="mx-2 text-sm text-secondary decoration-2 underline-offset-4   break-words"
          >
            {data.city}
          </a>
          <div className="shrink-0 flex items-center">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="size-5 "
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
          </div>
        </li>
        <li className="flex items-start w-fit text-sm break-words font-normal md:font-bold">
          {currAddress}
        </li>
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
