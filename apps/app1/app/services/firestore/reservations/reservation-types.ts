import type { Timestamp } from "firebase-admin/firestore"
import type { PrimaryContact } from "../common-types"

export type DeliveryStatuses = "waiting" | "family-error" | "staff-error" | "delivered"

type DeliveryDetailsDate = {
	status: DeliveryStatuses
	deliveredDate: Date
	staffId: string
}

type DeliveryDetailsTimestamp = {
	deliveryTimestamp: Timestamp
	status: DeliveryStatuses
	staffId: string
}

export interface ReservationAppModel {
	id: string
	userId: string
	createdDate: Date
	updatedDate: Date
	eventId: string
	status: "pending" | "approved" | "declined" | "waitlist"
	time: number
	confirm: string
	primaryContact: PrimaryContact
	deliveryDetails?: DeliveryDetailsDate
}

export interface ReservationDbModel {
	id: string
	createdTimestamp: Timestamp
	updatedTimestamp: Timestamp
	eventId: string
	status: "pending" | "approved" | "declined" | "waitlist"
	confirm: string
	userId: string
	primaryContact: PrimaryContact
	time: number
	createdDate?: Timestamp
	deliveryDetails?: DeliveryDetailsTimestamp
}

export interface CreateReservation {
	id: string
	eventId: string
	userId: string
	time: number
	primaryContact: PrimaryContact
}
