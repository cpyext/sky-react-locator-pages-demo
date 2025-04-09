import { Coordinate } from "@yext/pages-components";
import { Result } from "@yext/search-headless-react";
import { LngLatLike, Map, Popup } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/server";
import { FaLocationPin } from "react-icons/fa6";
import Location from "../types/locations";
const transformToMapboxCoord = (
  coordinate: Coordinate
): LngLatLike | undefined => {
  if (!coordinate.latitude || !coordinate.longitude) return;
  return {
    lng: coordinate.longitude,
    lat: coordinate.latitude,
  };
};

const getLocationHTML = (location: Location) => {
  const address = location.address;
  const html = (
    <div>
      <p className="font-bold">{location.name || "unknown location"}</p>
      <p>{location.address.line1}</p>
      <p>{`${address.city}, ${address.region}, ${address.postalCode}`}</p>
    </div>
  );

  return ReactDOM.renderToString(html);
};

export interface MapPinProps {
  mapbox: Map;
  result: Result<Location>;
  selectedLocationId: string;
  selectedLocationFromContext: string;
  setSelectedLocationId: (value: string) => void;
}

const MapPin = ({
  mapbox,
  result,
  selectedLocationId,
  selectedLocationFromContext,
  setSelectedLocationId,
}: MapPinProps) => {
  const location = result.rawData;
  const [isActive, setIsActive] = useState<boolean>();
  const popupRef = useRef(new Popup({ offset: 15 }));
  useEffect(() => {
    if (selectedLocationFromContext) {
      document
        .querySelectorAll(".mapboxgl-popup")
        .forEach((item) => item.remove());

      setIsActive(selectedLocationFromContext === location.id);
    }
  }, [selectedLocationFromContext, location.id]);

  useEffect(() => {
    if (isActive && location.yextDisplayCoordinate) {
      const mapboxCoordinate = transformToMapboxCoord(
        location.yextDisplayCoordinate
      );
      if (mapboxCoordinate) {
        popupRef.current
          .setLngLat(mapboxCoordinate)
          .setHTML(getLocationHTML(location))
          .addTo(mapbox);
      }
    } else {
      popupRef.current.remove();
    }
  }, [isActive, mapbox, location]);
  const handleClick = () => {
    setSelectedLocationId(isActive ? null : location.id);
  };
  return (
    <button onClick={handleClick}>
      <FaLocationPin className={`mapPin ${isActive ? "h-8 w-8" : "h-4 w-4"}`} />
    </button>
  );
};

export default MapPin;
