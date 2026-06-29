import { MouseEventHandler } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FilterBadge = ({
  icon,
  description,
  items,
  badgeClassName,
  itemTitleRender,
  onItemClick,
}: {
  icon?: React.ReactNode;
  description?: string;
  items: string[];
  badgeClassName?: string;
  itemTitleRender?: (item: string) => string | undefined;
  onItemClick?: (item: string) => void;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}) => {
  return (
    <>
      {items.map((item, i) => (
        <Badge
          variant="outline"
          asChild
          key={`${item}-${i}`}
          onClick={() => onItemClick?.(item)}
          className={cn(
            "cursor-pointer gap-2 rounded-full px-3 py-1.5 text-sm shadow-none",
            badgeClassName
          )}
        >
          <button
            type="button"
            title={description}
            className="inline-flex max-w-full items-center gap-2"
          >
            {icon}
            <span className="truncate">
              {itemTitleRender ? itemTitleRender(item) : item}
            </span>
            <X className="size-3.5 min-w-3.5" />
          </button>
        </Badge>
      ))}
    </>
  );
};

export default FilterBadge;
