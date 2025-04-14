import {
  Matcher,
  SelectableStaticFilter,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
import {
  AppliedFilters,
  Geolocation,
  MapboxMap,
  Pagination,
  ResultsCount,
  SearchBar,
  VerticalResults,
  onSearchFunc,
} from "@yext/search-ui-react";
import { LngLat, LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as React from "react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import LocationCard from "./LocationCard";
import MapPin from "./MapPin";
import { useLocationsContext } from "../common/LocationsContext";
import { IoIosClose } from "react-icons/io";

// ✅ Type for props
type PromoBanner = {
  url: string;
  alternateText?: string;
};

type LocatorProps = {
  verticalKey: string;
  name?: string;
  c_promoBanner?: PromoBanner;
};

const Locator = ({ verticalKey, name, c_promoBanner }: LocatorProps) => {
  const searchActions = useSearchActions();
  const filters = useSearchState((state) => state.filters.static);
  const facets = useSearchState((state) => state.filters.facets);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [showFacets, setShowFacets] = useState(false);

  const {
    selectedLocationId: _selectedLocationId,
    setSelectedLocationId: _setSelectedLocationId,
  } = useLocationsContext();

  useEffect(() => {
    if (selectedLocationId) {
      _setSelectedLocationId(selectedLocationId);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    searchActions.setVertical(verticalKey);
    const queryParams = new URLSearchParams(window.location.search);
    let q = queryParams.get("query");
    q && searchActions.setQuery(q);
    searchActions.executeVerticalQuery().then(() => setIsLoading(false));
  }, []);

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    searchActions.executeVerticalQuery();
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("type");
    if (query) {
      queryParams.set("query", query);
    } else {
      queryParams.delete("query");
    }
    history.pushState(null, "", "?" + queryParams.toString());
  };

  const onDrag = React.useCallback(
    (center: LngLat, bounds: LngLatBounds) => {
      const radius = center.distanceTo(bounds.getNorthEast());
      const nonLocationFilters =
        filters?.filter(
          (f) =>
            f.filter.kind !== "fieldValue" ||
            f.filter.fieldId !== "builtin.location"
        ) ?? [];
      const nearFilter: SelectableStaticFilter = {
        selected: true,
        displayName: "Near Current Area",
        filter: {
          kind: "fieldValue",
          fieldId: "builtin.location",
          matcher: Matcher.Near,
          value: { ...center, radius },
        },
      };
      searchActions.setStaticFilters([...nonLocationFilters, nearFilter]);
      searchActions.executeVerticalQuery();
    },
    [filters, searchActions]
  );

  return (
    <>
      {name && (
        <h1 className="text-4xl font-bold text-center mt-6">{name}</h1>
      )}

      <div className="centered-container">
        <div className="flex gap-8 w-full items-center my-6">
          <SearchBar
            customCssClasses={{ searchBarContainer: "w-full ml-8" }}
            placeholder="Enter an address, zip code, or city and state"
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col w-[40%] p-4 overflow-scroll relative" style={{ height: "80vh" }}>
          {c_promoBanner?.url && (
            <div className="w-full mt-6">
              <img
                src={c_promoBanner.url}
                alt={c_promoBanner.alternateText || name || "Promo Banner"}
                className="w-full max-h-[400px] object-cover rounded-xl"
              />
            </div>
          )}

          {import.meta.env.YEXT_PUBLIC_ARE_FACETS_ENABLED === "true" && (
            <>
              <div
                className="text-center bg-gray-200 rounded-lg py-2 px-4 mt-4 cursor-pointer"
                onClick={() => setShowFacets(!showFacets)}
              >
                Filters & Features
              </div>
              {showFacets && (
                <div className="absolute inset-0 bg-white h-[95vh] px-4 overflow-y-scroll">
                  <IoIosClose
                    onClick={() => setShowFacets(false)}
                    className="ml-auto h-8 w-8 mr-4 hover:cursor-pointer hover:border"
                  />

                  <h2 className="text-xl font-semibold mb-4">Filters</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {facets?.map((facet, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          const option = facet.options[0];
                          if (option) {
                            searchActions.setFacetOption(facet.fieldId, option, !option.selected);
                            searchActions.executeVerticalQuery();
                          }
                        }}
                      >
                        <img
                          src={`/icons/${facet.displayName.toLowerCase().replace(/\s/g, "-")}.svg`}
                          alt={facet.displayName}
                          className="w-8 h-8 mb-2"
                        />
                        <span className="text-sm text-center">{facet.displayName}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-row gap-4 mb-8">
                    <div className="applyButton" onClick={() => setShowFacets(false)}>Apply</div>
                    <div
                      className="hover:cursor-pointer px-4 py-1 mt-4 text-[#027da5] w-fit hover:underline"
                      onClick={() => setShowFacets(false)}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <ResultsCount />
            <AppliedFilters />
            {isLoading ? (
              <div className="h-screen">
                <Loader />
              </div>
            ) : (
              <VerticalResults
                CardComponent={LocationCard}
                customCssClasses={{
                  verticalResultsContainer: "flex flex-col gap-4 bg-white",
                }}
              />
            )}
            <div className="mt-4">
              <Pagination />
              <Geolocation
                customCssClasses={{
                  iconContainer: "none",
                  geolocationContainer: "flex flex-col lg:flex-col",
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-[60%] h-[80vh]">
          <MapboxMap
            onDrag={onDrag}
            mapboxOptions={{ zoom: 20 }}
            mapboxAccessToken={import.meta.env.YEXT_PUBLIC_MAP_API_KEY || ""}
            PinComponent={(props) => (
              <MapPin
                {...props}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
                selectedLocationFromContext={_selectedLocationId}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Locator;

const createPopUp1 = (data: any) => {
  return (
    <div>
      <h3 className="uppercase bembo text-sm font-normal mb-2.5">${data.name}</h3>
    </div>
  );
};
