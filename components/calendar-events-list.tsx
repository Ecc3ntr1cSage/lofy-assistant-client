"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { CalendarEventDialog } from "@/components/calendar-event-dialog";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
}

export function CalendarEventsList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (currentDate.getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    currentDate.getFullYear().toString()
  );

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        year: selectedYear,
      });

      const response = await fetch(`/api/calendar?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch events:", response.status, errorData);
        throw new Error(
          errorData.error || `Failed to fetch events (${response.status})`
        );
      }

      const data = await response.json();

      if (!data.events) {
        throw new Error("Invalid response format");
      }

      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    fetchEvents();
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
          <Loader2 className="w-12 h-12 mb-4 animate-spin text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Loading calendar events...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="w-12 h-12 mb-4 text-destructive" />
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
            <Calendar className="w-5 h-5 text-muted-foreground" />
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
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No calendar events found for{" "}
              {months[parseInt(selectedMonth) - 1]?.label} {selectedYear}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-row">
          <TracingBeam>
            {events.map((event) => {
              const startDate = new Date(event.start_time);
              const endDate = new Date(event.end_time);
              const isToday =
                format(startDate, "yyyy-MM-dd") ===
                format(new Date(), "yyyy-MM-dd");

              return (
                <GlowingEffect
                  key={event.id}
                  blur={0}
                  borderWidth={2}
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                >
                  <Card
                    className="my-4 transition-all cursor-pointer rounded-xl"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2">
                        {/* Date Section */}
                        <div className="flex flex-col items-center justify-center w-24 border-r">
                          <Badge
                            variant={isToday ? "default" : "outline"}
                            className="mb-2"
                          >
                            {format(startDate, "EEE")}
                          </Badge>
                          <div className="text-2xl font-bold">
                            {format(startDate, "d")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(startDate, "MMM yyyy")}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-2">
                          <h3 className="mb-2 text-sm font-semibold line-clamp-1">
                            {event.title}
                          </h3>

                          {event.description && (
                            <>
                              <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                              <Separator className="mb-3" />
                            </>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.is_all_day
                                ? "All day"
                                : `${format(startDate, "h:mm a")} - ${format(
                                    endDate,
                                    "h:mm a"
                                  )}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowingEffect>
              );
            })}
          </TracingBeam>

          <CalendarEventDialog
            event={selectedEvent}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}
