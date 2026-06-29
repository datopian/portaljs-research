"use client";

import { Activity } from "@/schemas/ckan";
import {
  CalendarClock,
  FilePenLine,
  FolderPlus,
  FolderPen,
  PackagePlus,
  PackageSearch,
  RefreshCw,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { formatDateToHumanReadable } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type ActivityItemProps = {
  activity: Activity;
};

const activityConfig: Record<
  string,
  {
    label: string;
    Icon: typeof PackageSearch;
  }
> = {
  "new package": { label: "Created dataset", Icon: PackagePlus },
  "changed package": { label: "Updated dataset", Icon: FilePenLine },
  "deleted package": { label: "Deleted dataset", Icon: Trash2 },
  "new organization": { label: "Created organization", Icon: FolderPlus },
  "changed organization": { label: "Updated organization", Icon: FolderPen },
};

function getActivityPresentation(activityType?: string) {
  if (!activityType) {
    return {
      label: "Unknown activity",
      Icon: RefreshCw,
    };
  }

  return (
    activityConfig[activityType] ?? {
      label: activityType.replace(/_/g, " "),
      Icon: RefreshCw,
    }
  );
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const { timestamp, activity_type, user_data, data } = activity;
  const { label, Icon } = getActivityPresentation(activity_type);

  const userDisplay = user_data
    ? user_data.fullname || user_data.name
    : "Unknown user";

  const datasetTitle = data?.package?.title;

  return (
    <article className="surface-panel rounded-2xl p-5 sm:p-6">
      <div className="flex gap-4">
        <div className="hidden shrink-0 sm:block">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_8%,white)] text-[color:var(--brand-accent)]">
            <Icon className="size-5" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 sm:hidden">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--brand-accent)_8%,white)] text-[color:var(--brand-accent)]">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-medium text-primary/85">{label}</span>
              </div>

              <div className="hidden sm:block">
                <span className="text-sm font-medium text-primary/85">{label}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <UserIcon className="size-4" />
                  <span className="font-medium text-foreground">{userDisplay}</span>
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="size-4" />
                  {formatDateToHumanReadable(timestamp)}
                </span>
              </div>
            </div>
          </div>

          {datasetTitle && (
            <div className="rounded-xl bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] px-4 py-3 text-sm leading-6 text-foreground/88">
              <span className="font-medium text-foreground">{datasetTitle}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="surface-panel rounded-2xl p-5 sm:p-6">
      <div className="flex gap-4">
        <Skeleton className="hidden h-11 w-11 rounded-2xl sm:block" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
