// user interfaces common to users, applications, and registrations

export interface Address {
	street: string
	unit: string
	city: string
	state: string
	zip: string
}

export interface PrimaryContact {
	fname: string
	lname: string
	email: string
	phone: string
}

export interface Student {
	id: string
	fname: string
	lname: string
	school: "tps" | "lde" | "tms" | "ths"
}

export interface Minor {
	id: string
	fname: string
	lname: string
	birthyear: number
}
