export interface CalendarListResponse {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: any[];
  items: CalendarEvent[];
}

export interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created?: string;
  updated: string;
  summary?: string;
  creator?: Creator;
  organizer?: Organizer;
  start: Start;
  end: End;
  recurringEventId: string;
  originalStartTime: OriginalStartTime;
  iCalUID: string;
  sequence?: number;
  eventType?: string;
  transparency?: string;
  visibility?: string;
}

export interface Creator {
  email: string;
  self: boolean;
}

export interface Organizer {
  email: string;
  self: boolean;
}

export interface Start {
  dateTime: string;
  timeZone: string;
}

export interface End {
  dateTime: string;
  timeZone: string;
}

export interface OriginalStartTime {
  dateTime: string;
  timeZone: string;
}
