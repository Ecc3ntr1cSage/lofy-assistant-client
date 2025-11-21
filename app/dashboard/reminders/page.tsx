import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { BellRing } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RemindersPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 mx-auto w-full max-w-5xl">
                <div className="flex items-center gap-3 mb-2">
                  <BellRing className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">Reminders</h1>
                </div>
                <p className="text-muted-foreground mb-6">
                  Manage your reminders and notifications
                </p>
                <Separator className="mb-6" />
                <ReminderList />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
