import { CardProps } from "@yext/search-ui-react";
import { useEffect } from "react";
import { CiPhone } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import { useLocationsContext } from "../common/LocationsContext";
import Location from "../types/locations";
import { HoursStatus } from "@yext/pages-components";
const LocationCard = ({ result }: CardProps<Location>) => {
  const { name, id, distance } = result;
  const { address, hours, timezone, mainPhone, c_tertiaryCTA } = result.rawData;
  const { selectedLocationId, setSelectedLocationId } = useLocationsContext();
  const getDirectionsUrl = (addr?: any) => {
    const region = addr.region ? ` ${addr.region}` : ``;
    const rawQuery = `${addr.line1},${addr.city},${region} ${addr.postalCode} ${addr.countryCode}`;
    const query = encodeURIComponent(rawQuery);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}&output=classic`;
    return url;
  };

  useEffect(() => {
    const element = document.getElementById(selectedLocationId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedLocationId]);

  return (
    <div
      id={id}
      onClick={() => setSelectedLocationId(id)}
      className="w-full border  rounded-sm bg-[#f9f7f6]  flex flex-col "
    >
      <div className="  px-4 py-4 flex gap-2 items-center justify-between">
        <div className="flex  text-sm w-full gap-2 justify-between text-black">
          <div className="flex w-full !gap-0 flex-col justify-between">
            <div className="font-bold text-base text-[#141414]">{name}</div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center text-sm">
                <div>
                  <LuMapPin />
                </div>
                <div className="flex flex-col  ">
                  <div>
                    {address?.line1}, {address?.city}, {address?.region},{" "}
                    {address?.postalCode}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div>
                  <CiPhone />
                </div>
                <div>
                  {mainPhone
                    ? mainPhone
                        .replace("+1", "")
                        .replace(/\D+/g, "")
                        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
                    : `(610) 363-8020`}
                </div>
              </div>
            </div>

            {hours ? (
              <div className="font-semibold">
                {<HoursStatus hours={hours} timezone={timezone ?? ""} />}
              </div>
            ) : (
              <div className="font-semibold">
                <div className="HoursStatus">
                  <span className="HoursStatus-current">
                    Permanently Closed
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 text-center w-max">
            <div className="px-4">{(distance / 1609.344).toFixed(2)}mi</div>
            <a className="cta1" href={getDirectionsUrl(address)}>
              Get Directions
            </a>
            <a href={`tel:${mainPhone}`} className="cta2">
              Call
            </a>
            {c_tertiaryCTA && (
              <a href={c_tertiaryCTA.link} className="cta3">
                {c_tertiaryCTA.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
