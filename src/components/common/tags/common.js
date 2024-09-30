import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function CustomTag(props) {
  const { innerRef, innerProps, children, data } = props;
  return (
    <Badge
      ref={innerRef}
      {...innerProps}
      style={{ background: data.backgroundColour }}
      className={cn("!rounded-l-full !rounded-r-none pr-0 !cursor-default")}
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
      style={{
        background: data.backgroundColour,
      }}
      className={cn(
        "!rounded-l-none !rounded-r-full mr-1 pr-1.5 pl-0 !cursor-pointer"
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

export { CustomTag, CustomClearIndicator, CustomContainer };
