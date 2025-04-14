import {
  GetHeadConfig,
  GetPath,
  GetRedirects,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import PageLayout from "../components/page-layout";
import StaticMap from "../components/static-map";
import { Image, LexicalRichText } from "@yext/pages-components";
import Carousel from "../components/Carousel";
import {
  Address,
  HoursStatus,
  HoursTable,
  getDirections,
  Map,
  MapboxMaps,
  Marker,
} from "@yext/pages-components";
import BreadCrumbs from "../components/breadCrumbs";

// Template config
export const config: TemplateConfig = {
  stream: {
    $id: "my-stream-id-1",
    fields: [
      "id",
      "uid",
      "meta",
      "timezone",
      "name",
      "address",
      "mainPhone",
      "reservationUrl",
      "hours",
      "slug",
      "yextDisplayCoordinate",
      "c_servicesAvailable.name",
      "c_servicesAvailable.c_icon",
      "c_servicesAvailable.richTextDescriptionV2",
      "c_bannerOfferte.c_bannerImage",
      "c_bannerOfferte.richTextDescriptionV2",
      "c_staticBanner.c_bannerImage",
    ],
    filter: {
      entityTypes: ["location"],
    },
    localization: {
      locales: ["it"],
    },
  },
};

// Path for live pages
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug
    ? document.slug
    : `${document.locale}/${document.address.region}/${document.address.city}/${
        document.address.line1
      }-${document.id.toString()}`;
};

// Redirects
export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
  return [`index-old/${document.id.toString()}`];
};

// HTML Head
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: document.description || document.name,
        },
      },
    ],
  };
};

// --- Types ---
type Service = {
  name: string;
  richTextDescriptionV2: string;
};

type Location = {
  name: string;
  address?: string;
  slug?: string;
};

// --- Template Function ---
const Location: Template<TemplateRenderProps> = ({
  document,
  relativePrefixToRoot,
  path,
}) => {
  const {
    _site,
    name,
    address,
    mainPhone,
    hours,
    reservationUrl,
    c_staticBanner,
    yextDisplayCoordinate,
    c_servicesAvailable,
    c_bannerOfferte,
  } = document;

  return (
    <PageLayout _site={_site}>
      {/* 🧭 Breadcrumbs */}
      <main id="main" className="centered-container space-y-12">
        <BreadCrumbs data={address} currAddress={address.line1} />
      </main>
      <div className="centered-container space-y-12">
        {/* Offer / Carousel Banner Section */}
        {/* {c_bannerOfferte && (
          <div className="mt-16 w-full">
            <h1 className="text-4xl font-bold text-center">{name}</h1>
            <Carousel data={c_bannerOfferte} />
          </div>
        )} */}

        {/* ✅ Offer Section - Handles 1 or more banners */}
        {c_bannerOfferte && c_bannerOfferte.length > 0 && (
          <div className="mt-16 w-full">
            <h1 className="text-4xl font-bold text-center">{name}</h1>

            {/* 👇 If only 1 banner, render without carousel */}
            {c_bannerOfferte.length === 1 ? (
              <div className="relative block w-full mt-6">
                {/* Overlay text */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 py-4">
                  <div className="text-gray-100 font-light text-center mt-4 text-xl md:text-xl lg:text-xl drop-shadow-lg leading-snug w-3/4 max-w-[600px]">
                    <LexicalRichText
                      serializedAST={JSON.stringify(
                        c_bannerOfferte[0].richTextDescriptionV2.json
                      )}
                    />
                  </div>
                </div>

                {/* Static image */}
                <Image
                  image={c_bannerOfferte[0].c_bannerImage}
                  className="!w-full !h-full object-cover max-h-[1000px]"
                />
              </div>
            ) : (
              // More than one banner - show Carousel
              <Carousel data={c_bannerOfferte} />
            )}
          </div>
        )}

        {/* Name, CTAs and Hours Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-10">
          {/* 🟦 Section 1 + 🟨 Section 2 as Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* 🟦 Left Column: Info & CTAs */}
            <article className="flex flex-col gap-4">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
                {name}
              </h1>

              <HoursStatus
                currentTemplate={(params: any) => (
                  <span className="HoursStatus-current--search">
                    {params.isOpen ? (
                      <span className="font-semibold text-green-600">
                        Open Now
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">Closed</span>
                    )}
                  </span>
                )}
                hours={hours}
                timezone={document.timezone}
                className="text-lg text-gray-800"
                dayOfWeekTemplate={() => null}
              />

              {/* 📍 CTAs */}
              <nav className="flex flex-col gap-3 pt-2 w-full items-start">
                {yextDisplayCoordinate.latitude &&
                  yextDisplayCoordinate.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${yextDisplayCoordinate.latitude},${yextDisplayCoordinate.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-72 px-4 py-2 rounded-full text-center font-semibold 
                 bg-[#ffffff] text-[#000000] border-2 border-[#000000] 
                 hover:bg-[#cc0000] hover:text-[#ffffff] hover:border-[#ffffff] 
                 transition-colors duration-300"
                    >
                      Ottieni indicazioni
                    </a>
                  )}

                {mainPhone && (
                  <a
                    href={`tel:${mainPhone}`}
                    className="w-full md:w-72 px-4 py-2 rounded-full text-center font-semibold 
                 bg-[#ffffff] text-[#000000] border-2 border-[#000000] 
                 hover:bg-[#cc0000] hover:text-[#ffffff] hover:border-[#ffffff] 
                 transition-colors duration-300"
                  >
                    Chiama
                  </a>
                )}

                {reservationUrl && (
                  <a
                    href={reservationUrl.displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-72 px-4 py-2 rounded-full text-center font-semibold 
                 bg-[#ffffff] text-[#000000] border-2 border-[#000000] 
                 hover:bg-[#cc0000] hover:text-[#ffffff] hover:border-[#ffffff] 
                 transition-colors duration-300"
                  >
                    Prenota appuntamento
                  </a>
                )}
              </nav>
            </article>

            {/* 🟨 Right Column: Hours */}
            {/* <article className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Hours</h2>
      <div className="border rounded-lg shadow-sm p-4 bg-gray-50">
        <ul className="space-y-2">
          {Object.entries(hours?.normalHours?.dayHours || {}).map(
            ([day, times]: [string, any]) => (
              <li
                key={day}
                className="flex justify-between text-sm md:text-base text-gray-700 font-medium"
              >
                <span className="w-1/2 capitalize">{day}</span>
                <span className="w-1/2 text-right">
                  {times.length > 0
                    ? times
                        .map(
                          (time: { start: string; end: string }) =>
                            `${time.start} - ${time.end}`
                        )
                        .join(", ")
                    : "Closed"}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </article> */}

            <article className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-gray-900">Hours</h2>
              <div className="space-y-2">
                <HoursTable hours={hours} />
              </div>
            </article>
          </div>

          {/* 🗺️ Full Width Map */}
          {yextDisplayCoordinate && (
            <div className="w-full h-[350px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-md border border-gray-300">
              <StaticMap
                latitude={yextDisplayCoordinate.latitude}
                longitude={yextDisplayCoordinate.longitude}
              />
            </div>
          )}
        </section>

        {/* ✅ Available Services
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c_servicesAvailable.map(
              (
                service: { name: string; richTextDescriptionV2: string },
                index: number
              ) => (
                <div
                  //key={index}
                  className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {service.richTextDescriptionV2}
                  </p>
                </div>
              )
            )}
          </div>
        </div> */}

        {/* ✅ Available Services */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c_servicesAvailable.map((service: any, index: number) => (
              <div
                key={index}
                className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition-shadow"
              >
                {/* Name + Icon Row */}
                <div className="flex items-center gap-3 mb-2">
                  {service.c_icon && (
                    <Image
                      image={service.c_icon}
                      className="!max-w-none !w-6 !h-6 object-contain"
                    />
                  )}
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                </div>
                <LexicalRichText
                  serializedAST={JSON.stringify(
                    service.richTextDescriptionV2.json
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 📍 Related Locations (Optional Section) */}
        {/* Uncomment if needed:
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available At These Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {c_bannerOfferte.map((location: Location, index: number) => (
              <div
                key={index}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-lg font-semibold mb-1">{location.name}</h3>
                {location.address && (
                  <p className="text-sm text-gray-500">{location.address}</p>
                )}
                {location.slug && (
                  <a
                    href={`/locations/${location.slug}`}
                    className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Location →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Static Banner Section */}
        {c_staticBanner[0].c_bannerImage && (
          <Image
            image={c_staticBanner[0].c_bannerImage}
            className="rounded-xl border !h-[550px] w-0 object-contain mx-auto"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Location;
