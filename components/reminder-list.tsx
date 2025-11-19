"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Clock, Loader2 } from "lucide-react";
import { ReminderFormDialog } from "@/components/reminder-form-dialog";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Reminder {
  id: number;
  message: string;
  reminder_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (currentDate.getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    currentDate.getFullYear().toString()
  );

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        month: selectedMonth,
        year: selectedYear,
      });

      const response = await fetch(`/api/reminder?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch reminders:", response.status, errorData);
        throw new Error(
          errorData.error || `Failed to fetch reminders (${response.status})`
        );
      }

      const data = await response.json();

      if (!data.reminders) {
        throw new Error("Invalid response format");
      }

      setReminders(data.reminders);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [selectedMonth, selectedYear]);

  const handleReminderClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingReminder(null);
    fetchReminders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "outline";
      default:
        return "default";
    }
  };

  // Generate month options
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate year options (current year ± 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Loading reminders...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-destructive mb-4" />
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Section */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              No reminders found for{" "}
              {months[parseInt(selectedMonth) - 1]?.label} {selectedYear}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-row">
          <TracingBeam>
            {reminders.map((reminder) => {
              const reminderDate = new Date(reminder.reminder_time);
              const isToday =
                format(reminderDate, "yyyy-MM-dd") ===
                format(new Date(), "yyyy-MM-dd");

              return (
                <GlowingEffect
                  key={reminder.id}
                  blur={0}
                  borderWidth={2}
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                >
                  <Card
                    className="transition-all my-4 cursor-pointer rounded-xl"
                    onClick={() => handleReminderClick(reminder)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2">
                        {/* Date Section */}
                        <div className="w-24 flex flex-col items-center justify-center border-r">
                          <Badge
                            variant={isToday ? "default" : "outline"}
                            className="mb-2"
                          >
                            {format(reminderDate, "EEE")}
                          </Badge>
                          <div className="text-2xl font-bold">
                            {format(reminderDate, "d")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(reminderDate, "MMM yyyy")}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-2">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                              {reminder.message}
                            </h3>
                            <Badge
                              variant={getStatusColor(reminder.status)}
                              className="ml-2"
                            >
                              {reminder.status}
                            </Badge>
                          </div>

                          <Separator className="mb-3" />

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{format(reminderDate, "h:mm a")}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowingEffect>
              );
            })}
          </TracingBeam>

          <ReminderFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onClose={handleDialogClose}
            reminder={editingReminder}
          />
        </div>
      )}
    </div>
  );
}
