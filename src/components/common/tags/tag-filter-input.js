"use client";

import Select from "react-select";
import { CustomClearIndicator, CustomContainer, CustomTag } from "./common";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export default function TagFilterInput({ onFilterChange, isLoading = false }) {
  const {
    data: allTagOptions,
    isLoading: isLoadingTags,
    isValidating: isValidatingTags,
  } = useSWR("/api/tags/restaurants", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return (
    <Select
      isMulti
      placeholder="Filter by tag..."
      isDisabled={isLoadingTags || isValidatingTags || isLoading}
      options={
        allTagOptions &&
        allTagOptions.map((tag) => ({
          ...tag,
          value: tag.name,
          label: tag.name,
        }))
      }
      onChange={onFilterChange}
      components={{
        MultiValueContainer: CustomContainer,
        MultiValueLabel: CustomTag,
        MultiValueRemove: CustomClearIndicator,
      }}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          ":hover": {
            borderColor: "#e2e8f0",
          },
          borderColor: "#e2e8f0",
          cursor: "text",
          ":focus-visible": {
            boxShadow: "var(--tw-ring-inset) 0 0 0 2px rgb(2 6 23)",
            outline: "2px solid transparent",
            outlineOffset: "2px",
          },
        }),
      }}
    />
  );
}
