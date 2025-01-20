import type { Timestamp } from "firebase-admin/firestore"
import type { Address, Minor, Student } from "../common-types"

export interface StudentCreate extends Omit<Student, "id"> {}
export interface MinorCreate extends Omit<Minor, "id"> {}

export interface UserAppModel {
	id: string
	email: string
	createdDate: Date
	updatedDate: Date
	language: "en" | "es"
	address: Address
	household_adults: number
	minors: Minor[]
	students: Student[]
}

export interface UserDbModel extends Omit<UserAppModel, "id" | "createdDate" | "updatedDate"> {
	email: string
	createdTimestamp: Timestamp
	updatedTimestamp: Timestamp
}

export interface AppUserCreate {
	language: "en" | "es"
	email: string
	userId: string
}
