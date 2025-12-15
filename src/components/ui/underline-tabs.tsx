import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* Root */
const UnderlineTabs = TabsPrimitive.Root;

/* List */
const UnderlineTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex border-border",
      className
    )}
    {...props}
  />
));
UnderlineTabsList.displayName = "UnderlineTabsList";

/* Trigger */
const UnderlineTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative px-5 py-3 text-[.82rem] font-medium text-muted-foreground transition-colors",
      "hover:text-foreground",
      "data-[state=active]:text-primary",
      "data-[state=active]:after:absolute",
      "data-[state=active]:after:left-0",
      "data-[state=active]:after:bottom-[-1px]",
      "data-[state=active]:after:h-[2px]",
      "data-[state=active]:after:w-full",
      "data-[state=active]:after:bg-primary",
      "focus-visible:outline-none focus-visible:ring-0",
      className
    )}
    {...props}
  />
));
UnderlineTabsTrigger.displayName = "UnderlineTabsTrigger";

/* Content */
const UnderlineTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "pt-4 focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
UnderlineTabsContent.displayName = "UnderlineTabsContent";

export {
  UnderlineTabs,
  UnderlineTabsList,
  UnderlineTabsTrigger,
  UnderlineTabsContent,
};
