import type { Timestamp } from "firebase-admin/firestore";

export type EventType = "pickup" | "drive-thru" | "error";
export type EventStage =
  | "planning"
  | "open-for-requests"
  | "open-for-pickups"
  | "event-finished";

export interface CreateEvent {
  name: string;
  type: EventType;
  semesterId: string;
  eventDate: Date;
}
export type EventDbModel = {
  createdTimestamp: Timestamp;
  eventTimestamp: Timestamp;
  message: string;
  name: string;
  semesterId: string;
  stage: EventStage;
  timeSlots: { [key: number]: string };
  type: EventType;
  updatedTimestamp: Timestamp;
};

export interface EventUpdateableFields {
  name: string;
  type: EventType;
  stage: EventStage;
  message: string;
  semesterId: string;
  eventDate: Date;
}

export interface EventAppModel {
  id: string;
  name: string;
  type: EventType;
  stage: EventStage;
  eventDate: Date;
  createdDate: Date;
  updatedDate: Date;
  timeSlots: { [key: number]: string };
  semesterId: string;
  message: string;
}
