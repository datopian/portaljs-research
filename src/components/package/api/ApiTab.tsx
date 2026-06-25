import { getApiCode } from "@/lib/utils";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import CodeViewer from "@/components/ui/code-viewer";
import { envVars } from "@/lib/env";

export default function ApiTabs({
  name,
  action = "package_show",
}: {
  name: string;
  action?: string;
}) {
  const DMS = envVars.dms ?? "";

  return (
    <div className="surface-panel rounded-2xl p-4 sm:p-5">
      <Tabs defaultValue="python" className="flex w-full flex-col">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              API example
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Use the dataset API endpoint in your application or workflow.
            </p>
          </div>

          <TabsList className="h-auto rounded-full bg-[color:color-mix(in_srgb,var(--brand-accent)_6%,white)] p-1 text-muted-foreground">
            <TabsTrigger
              value="python"
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-soft)]"
            >
              Python
            </TabsTrigger>
            <TabsTrigger
              value="javascript"
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-soft)]"
            >
              JavaScript
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="python" className="mt-0">
          <CodeViewer
            label="Python"
            data={getApiCode(DMS, "python", action, name)}
          />
        </TabsContent>

        <TabsContent value="javascript" className="mt-0">
          <CodeViewer
            label="JavaScript"
            data={getApiCode(DMS, "javascript", action, name)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
