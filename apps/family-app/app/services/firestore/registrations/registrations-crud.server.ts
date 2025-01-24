import {
	type DocumentData,
	FieldValue,
	type Firestore,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp,
} from "firebase-admin/firestore"
import type * as m from "./registrations-types"

interface RegConverter extends FirestoreDataConverter<m.RegistrationApp, m.RegistrationDb> {}

const firestoreConverter: RegConverter = {
	toFirestore: (registration: m.RegistrationApp) => {
		return {
			id: registration.id,
			userId: registration.userId,
			semesterId: registration.semesterId,
			status: registration.status,
			address: registration.address,
			createdTimestamp: Timestamp.fromDate(registration.createdDate),
			updatedTimestamp: Timestamp.fromDate(registration.updatedDate),
			applicationId: registration.applicationId,
			household_adults: registration.household_adults,
			students: registration.students,
			minors: registration.minors,
			primaryContact: registration.primaryContact,
		}
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot<m.RegistrationDb>) => {
		const createdDate = snapshot.data().createdTimestamp ? snapshot.data().createdTimestamp.toDate() : new Date()

		const updatedDate = snapshot.data().updatedTimestamp ? snapshot.data().updatedTimestamp.toDate() : new Date()

		return {
			id: snapshot.id,
			userId: snapshot.data().userId,
			applicationId: snapshot.data().applicationId,
			household_adults: snapshot.data().household_adults,
			semesterId: snapshot.data().semesterId,
			status: snapshot.data().status,
			primaryContact: snapshot.data().primaryContact,
			createdDate,
			updatedDate,
			students: snapshot.data().students,
			minors: snapshot.data().minors,
			address: snapshot.data().address,
		}
	},
}

export const registrationsDb = ({
	firestore,
	path,
}: {
	firestore: Firestore
	path: string
}) => {
	const collectionRead = firestore.collection(path).withConverter(firestoreConverter)

	const collectionWrite = firestore.collection(path)

	const read = async (id: string) => {
		const docSnap = await collectionRead.doc(id).get()
		const doc = docSnap.data()
		if (!doc) {
			return null
		}
		return doc
	}

	const create = async (data: m.RegistrationCreate) => {
		const docRef = collectionWrite.doc()

		const writeData = {
			...data,
			status: "registered",
			createdTimestamp: FieldValue.serverTimestamp(),
			updatedTimestamp: FieldValue.serverTimestamp(),
		}

		await docRef.set(writeData)

		return docRef.id
	}

	const update = async ({
		id,
		data,
	}: {
		id: string
		data: DocumentData
	}) => {
		const docRef = collectionWrite.doc(id)
		const updateData = {
			...data,
			updatedDate: FieldValue.serverTimestamp(),
		}
		await docRef.update(updateData)

		return docRef.id
	}

	const checkRegistration = async ({
		userId,
		semesterId,
	}: {
		userId: string
		semesterId: string
	}) => {
		const querySnapshot = await collectionRead.where("userId", "==", userId).where("semesterId", "==", semesterId).get()
		const docs = querySnapshot.docs.map((doc) => doc.data())

		if (docs.length === 0) {
			return null
		}

		return docs[0]
	}

	return {
		read,
		create,
		update,
		checkRegistration,
		collection: collectionRead,
		untypedCollection: collectionWrite,
	}
}
