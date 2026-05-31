import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
  createViewMonthGrid,
  createViewMonthAgenda,
  createViewList,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  category?: string;
}

interface Props {
  events: CalendarEvent[];
  defaultDate?: string;
}

/** Category → accent colour (light / dark background pair) */
const CATEGORY_COLORS: Record<
  string,
  { main: string; container: string; onContainer: string }
> = {
  Atelier:     { main: "#d97706", container: "#fef3c7", onContainer: "#92400e" },
  Formation:   { main: "#2563eb", container: "#dbeafe", onContainer: "#1e3a8a" },
  Conférence:  { main: "#16a34a", container: "#dcfce7", onContainer: "#14532d" },
  Permanence:  { main: "#7c3aed", container: "#ede9fe", onContainer: "#4c1d95" },
};
const DEFAULT_COLOR = { main: "#121212", container: "#f3f4f6", onContainer: "#1f2937" };

export default function EventsCalendar({ events, defaultDate }: Props) {
  // Build one Keystatic calendar per category for colour-coding
  const categories = [...new Set(events.map((e) => e.category ?? "Autre"))];
  const calendars = Object.fromEntries(
    categories.map((cat) => {
      const c = CATEGORY_COLORS[cat] ?? DEFAULT_COLOR;
      return [
        cat,
        {
          colorName: cat,
          lightColors: { main: c.main, container: c.container, onContainer: c.onContainer },
          darkColors:  { main: c.main, container: c.container, onContainer: c.onContainer },
        },
      ];
    })
  );

  // Tag each event with its calendar (= category)
  const taggedEvents = events.map((e) => ({
    ...e,
    calendarId: e.category ?? "Autre",
  }));

  const calendarApp = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda(), createViewList()],
    events: taggedEvents,
    locale: "fr-FR",
    defaultView: "month-agenda",
    selectedDate: defaultDate,
    calendars,
  });

  return (
    <div className="sx-auverme">
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
