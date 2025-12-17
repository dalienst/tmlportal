"use client";

import * as React from "react";
import { cn } from "@/lib/utils";



// RE-IMPLEMENTING WITH CONTEXT for robustness
const TabsContext = React.createContext({ value: undefined, onValueChange: () => {} });

const TabsRoot = React.forwardRef(({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const setValue = onValueChange || setUncontrolledValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = "Tabs";

const TabsListRoot = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsListRoot.displayName = "TabsList";

const TabsTriggerRoot = React.forwardRef(({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isSelected = context.value === value;

    return (
        <button
            ref={ref}
            type="button"
            className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            isSelected
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground",
            className
            )}
            onClick={() => context.onValueChange(value)}
            {...props}
        />
    )
});
TabsTriggerRoot.displayName = "TabsTrigger";

const TabsContentRoot = React.forwardRef(({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isSelected = context.value === value;
    
    if (!isSelected) return null;

    return (
        <div
            ref={ref}
            className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
            )}
            {...props}
        />
    );
});
TabsContentRoot.displayName = "TabsContent";

export { TabsRoot as Tabs, TabsListRoot as TabsList, TabsTriggerRoot as TabsTrigger, TabsContentRoot as TabsContent };
