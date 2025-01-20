import type { Timestamp } from "firebase-admin/firestore"
import type { Address, Minor, PrimaryContact, Student } from "../common-types"

interface RegistrationApp {
	id: string
	userId: string
	semesterId: string
	applicationId: string
	address: Address
	status: "registered" | "error" | "removed"
	primaryContact: PrimaryContact
	household_adults: number
	students: Student[]
	minors: Minor[]
	createdDate: Date
	updatedDate: Date
}

interface RegistrationDb extends Omit<RegistrationApp, "id" | "createdDate" | "updatedDate"> {
	updatedTimestamp: Timestamp
	createdTimestamp: Timestamp
}

interface RegistrationCreate extends Omit<RegistrationDb, "createdDate" | "updatedDate"> {}

export type { RegistrationApp, RegistrationDb, RegistrationCreate }
