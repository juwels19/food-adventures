"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "../ui/input";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export default function AddressAutocomplete({ onPlaceSelect, value }) {
  const map = useMap();
  const places = useMapsLibrary("places");
  const geocoding = useMapsLibrary("geocoding");

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] = useState();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] = useState(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] = useState(null);

  const [geocoderService, setGeocoderService] = useState(null);

  const [predictionResults, setPredictionResults] = useState([]);

  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (!places || !map || !geocoding) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
    setGeocoderService(new geocoding.Geocoder());

    return () => setAutocompleteService(null);
  }, [map, places, geocoding]);

  useEffect(() => {
    if (value && value !== "") {
      geocodeAddress({ formatted_address: value });
    }
  }, [geocoding, geocoderService]);

  const fetchPredictions = useCallback(
    async (inputValue) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = {
        input: inputValue,
        componentRestrictions: { country: "ca" },
        sessionToken,
      };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
    },
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (event) => {
      const value = event.target?.value;

      setInputValue(value);
      fetchPredictions(value);
      if (value === "") {
        onPlaceSelect(null);
      }
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId) => {
      if (!places) return;

      const detailRequestOptions = {
        placeId,
        fields: ["name", "formatted_address"],
        sessionToken,
      };

      const detailsRequestCallback = (placeDetails) => {
        setInputValue(placeDetails?.formatted_address ?? "");
        setPredictionResults([]);
        setSessionToken(new places.AutocompleteSessionToken());
        geocodeAddress(placeDetails);
      };

      placesService.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  const geocodeAddress = useCallback((placeDetails) => {
    const geocodeRequestOptions = {
      address: placeDetails.formatted_address,
      componentRestrictions: { country: "ca" },
    };

    const geocodeRequestCallback = (results) => {
      onPlaceSelect({ ...placeDetails, ...results[0] });
    };

    geocoderService.geocode(geocodeRequestOptions, geocodeRequestCallback);
  });

  return (
    <React.Fragment>
      <Input
        value={inputValue}
        onInput={(event) => onInputChange(event)}
        placeholder="Enter an address..."
      />
      {predictionResults.length > 0 && (
        <ul className="custom-list">
          {predictionResults.slice(0, 3).map(({ place_id, description }) => {
            return (
              <li
                key={place_id}
                className="hover:bg-slate-100 rounded-md p-2"
                onClick={() => handleSuggestionClick(place_id)}
              >
                {description}
              </li>
            );
          })}
        </ul>
      )}
    </React.Fragment>
  );

  // return (
  //   <Command>
  //     <CommandInput
  //       value={inputValue}
  //       onInput={(event) => onInputChange(event)}
  //       placeholder="Enter an address..."
  //     />
  //     <CommandList>
  //       <CommandGroup>
  //         {predictionResults.slice(0, 5).map(({ place_id, description }) => (
  //           <CommandItem
  //             key={place_id}
  //             className="hover:bg-slate-100 rounded-md p-2"
  //             onClick={() => handleSuggestionClick(place_id)}
  //           >
  //             {description}
  //           </CommandItem>
  //         ))}
  //       </CommandGroup>
  //     </CommandList>
  //   </Command>
  // );
}
