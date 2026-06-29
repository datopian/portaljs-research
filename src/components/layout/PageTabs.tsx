import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type PageTabItem = {
  title: string;
  description?: string;
  subtitle?: string;
  content: React.ReactNode;
  id: string;
};

export type PageTabsProps = {
  items: PageTabItem[];
  menuClass?: string;
  contentClass?: string;
  className?: string;
};

export default function PageTabs({
  items,
  className,
  menuClass,
  contentClass,
}: PageTabsProps) {
  return (
    <Tabs defaultValue={items?.[0]?.id} className={cn("w-full", className)}>
      <div className="">
        <TabsList className="h-auto w-full justify-start overflow-x-auto bg-transparent p-0">
          {items.map((item) => (
            <TabsTrigger
              key={item.id}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none",
                menuClass
              )}
              value={item.id}
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {items.map((item) => (
          <TabsContent
            key={item.id}
            value={item.id}
            className={cn("rounded-2xl", contentClass)}
          >
            {item.subtitle && (
              <h2 className="mb-4 text-xl font-bold text-foreground">{item.subtitle}</h2>
            )}
            {item.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
