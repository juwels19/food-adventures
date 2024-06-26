"use client";

import { X } from "lucide-react";
import Creatable from "react-select/creatable";
import useSWR from "swr";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn, fetcher } from "@/lib/utils";
import { createTag } from "@/db/queries";
import { TAG_TYPES } from "@/lib/constants";
import { TAG_COLOURS } from "@/lib/tagColours";
import { useEffect, useState } from "react";

function CustomTag(props) {
  const { innerRef, innerProps, children, data } = props;
  return (
    <Badge
      ref={innerRef}
      {...innerProps}
      className={cn(
        "!rounded-l-full !rounded-r-none pr-0 !cursor-default",
        `bg-[${data.backgroundColour}]`
      )}
    >
      {children}
    </Badge>
  );
}

function CustomClearIndicator({ innerRef, innerProps, data }) {
  return (
    <Badge
      ref={innerRef}
      {...innerProps}
      className={cn(
        "!rounded-l-none !rounded-r-full mr-1 pr-1.5 pl-0 !cursor-pointer",
        `bg-[${data.backgroundColour}]`
      )}
    >
      <X size={14} />
    </Badge>
  );
}

function CustomContainer({ innerRef, innerProps, children }) {
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex flex-row bg-transparent"
    >
      {children}
    </div>
  );
}

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
    const tagData = {
      name: tagName,
      type: TAG_TYPES.RESTAURANT,
      backgroundColour:
        TAG_COLOURS[Math.floor(Math.random() * TAG_COLOURS.length)],
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
