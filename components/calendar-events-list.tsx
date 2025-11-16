import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CalendarEvent {
  id: number
  title: string
  description: string | null
  start_time: Date
  end_time: Date
  is_all_day: boolean
}

interface CalendarEventsListProps {
  events: CalendarEvent[]
}

export function CalendarEventsList({ events }: CalendarEventsListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            No calendar events found
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const startDate = new Date(event.start_time)
        const endDate = new Date(event.end_time)
        const isToday = format(startDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
        
        return (
          <Link key={event.id} href={`/dashboard/calendar/${event.id}`}>
            <Card className="transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="p-0">
                <div className="flex gap-0">
                  {/* Date Section */}
                  <div className="flex-shrink-0 w-28 bg-muted/50 p-4 flex flex-col items-center justify-center border-r">
                    <Badge variant={isToday ? "default" : "outline"} className="mb-2">
                      {format(startDate, "EEE")}
                    </Badge>
                    <div className="text-3xl font-bold">
                      {format(startDate, "d")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(startDate, "MMM yyyy")}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        <Separator className="mb-3" />
                      </>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {event.is_all_day
                          ? "All day"
                          : `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
