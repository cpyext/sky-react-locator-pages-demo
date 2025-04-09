import * as React from "react";
import { useState } from "react";
import { useContext } from "react";

const LocationsContext = React.createContext<any>({});

export const LocationsProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [selectedLocationId, setSelectedLocationId] = useState<any>();
  const [hoveredLocationId, setHoveredLocationId] = useState<any>();

  return (
    <LocationsContext.Provider
      value={React.useMemo(
        () => ({
          selectedLocationId,
          setSelectedLocationId,
          hoveredLocationId,
          setHoveredLocationId,
        }),
        [
          selectedLocationId,
          setSelectedLocationId,
          hoveredLocationId,
          setHoveredLocationId,
        ]
      )}
    >
      {children}
    </LocationsContext.Provider>
  );
};
// make sure use
export const useLocationsContext = () => {
  return useContext(LocationsContext);
};
