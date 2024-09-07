"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";

import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import "../../styles/overrides.css";

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export default function GoogleAutocomplete({ onPlaceSelect, value }) {
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

  const [popoverOpen, setPopoverOpen] = useState(false);

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
      const value = event;
      setInputValue(value);
      fetchPredictions(value);
      if (!value || value === "") {
        onPlaceSelect(null);
        setPopoverOpen(false);
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
        setInputValue(placeDetails?.name ?? "");
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

  useEffect(() => {
    if (predictionResults.length > 0) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  }, [predictionResults]);

  return (
    <Command
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      shouldFilter={false}
      loop
      className="overflow-visible h-max relative border border-slate-200 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-slate-950 has-[:focus-visible]:ring-offset-2"
    >
      <div>
        <CommandInput
          value={inputValue}
          onValueChange={(e) => onInputChange(e)}
          placeholder="Start typing..."
        />
      </div>
      <div
        className={cn(
          popoverOpen ? "opacity-100" : "opacity-0",
          "absolute bg-white z-10 w-full top-[51px] border border-slate-200 rounded-lg transition-opacity ease-in-out duration-100"
        )}
      >
        <CommandList className="shadow-lg rounded-md">
          {predictionResults.slice(0, 3).map(({ place_id, description }) => {
            return (
              <CommandItem
                key={place_id}
                className="hover:bg-slate-100 rounded-md p-3"
                onSelect={() => handleSuggestionClick(place_id)}
              >
                {description}
              </CommandItem>
            );
          })}
        </CommandList>
      </div>
    </Command>
  );
}
