"use client";

import useSWR from "swr";
import { toast } from "sonner";

import { createTag } from "@/db/queries";
import { TAG_TYPES } from "@/lib/constants";
import Creatable from "react-select/creatable";
import { fetcher, generateValidLightContrastColour } from "@/lib/utils";
import {
  CustomClearIndicator,
  CustomContainer,
  CustomTag,
} from "@/components/common/tags/common";

export default function TagMultiSelect(props) {
  const {
    data: allTagOptions,
    isLoading,
    isValidating,
    mutate,
  } = useSWR("/api/tags/restaurants", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const handleTagCreation = async (tagName) => {
    const colour = generateValidLightContrastColour();
    const tagData = {
      name: tagName,
      type: TAG_TYPES.RESTAURANT,
      backgroundColour: colour,
      fontColour: "#F4FFF8",
    };
    const result = await createTag(tagData);
    if (result === null) {
      toast.error(
        `There was an error in creating tag "${tagName}". Please try again.`
      );
      return;
    }
    mutate();
    props.setTags([
      ...props.tags,
      { ...result, value: result.name, label: result.name },
    ]);
  };

  return (
    <Creatable
      isMulti
      isDisabled={isLoading || isValidating}
      isClearable={false}
      options={
        allTagOptions &&
        allTagOptions.map((tag) => {
          return { ...tag, value: tag.name, label: tag.name };
        })
      }
      value={props.tags}
      onChange={(value) => props.setTags(value)}
      onCreateOption={(tagName) => handleTagCreation(tagName)}
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
