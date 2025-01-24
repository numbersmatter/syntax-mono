import type { Timestamp } from "firebase-admin/firestore"

export type EventType = "pickup" | "drive-thru" | "error"
export type EventStage = "planning" | "open-for-requests" | "open-for-pickups" | "event-finished"

export interface CreateEvent {
	name: string
	type: EventType
	semesterId: string
	eventDate: Date
}
export type EventDbModel = {
	name: string
	type: EventType
	semesterId: string
	eventTimestamp: Timestamp
	createdTimestamp: Timestamp
	updatedTimestamp: Timestamp
	stage: EventStage
	timeSlots: { [key: number]: string }
	message: string
}

export interface EventUpdateableFields {
	name: string
	type: EventType
	stage: EventStage
	message: string
	semesterId: string
	eventDate: Date
}

export interface EventAppModel {
	id: string
	name: string
	type: EventType
	stage: EventStage
	eventDate: Date
	createdDate: Date
	updatedDate: Date
	timeSlots: { [key: number]: string }
	semesterId: string
	message: string
}
