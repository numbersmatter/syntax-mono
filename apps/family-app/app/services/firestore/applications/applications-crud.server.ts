import {
	type DocumentData,
	FieldValue,
	type Firestore,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp,
} from "firebase-admin/firestore"
import type { Minor, Student } from "../common-types"
import type * as m from "./application-types"

type AppConverter = FirestoreDataConverter<m.ApplicationAppDb, m.ApplicationDb>

const firestoreConverter: AppConverter = {
	toFirestore: (application: m.ApplicationAppDb) => {
		return {
			id: application.id,
			userId: application.userId,
			semesterId: application.semesterId,
			status: application.status,
			createdTimestamp: Timestamp.fromDate(application.createdDate),
			updatedTimestamp: Timestamp.fromDate(application.updatedDate),
			address: application.address,
			household_adults: application.household_adults,
			minors: application.minors,
			students: application.students,
			primaryContact: application.primaryContact,
		}
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot<m.ApplicationDb>) => {
		return {
			id: snapshot.id,
			userId: snapshot.data().userId,
			semesterId: snapshot.data().semesterId,
			status: snapshot.data().status,
			primaryContact: {
				fname: snapshot.data().primaryContact?.fname,
				lname: snapshot.data().primaryContact?.lname,
				email: snapshot.data().primaryContact?.email,
				phone: snapshot.data().primaryContact?.phone,
			},
			createdDate: snapshot.data().createdTimestamp.toDate(),
			updatedDate: snapshot.data().updatedTimestamp.toDate(),
			address: snapshot.data().address,
			household_adults: snapshot.data().household_adults,
			minors: snapshot.data().minors,
			students: snapshot.data().students,
		}
	},
}

export const applicationsDb = ({
	firestore,
	path,
}: {
	firestore: Firestore
	path: string
}) => {
	const collectionWrite = firestore.collection(path)
	const collectionRead = collectionWrite.withConverter(firestoreConverter)

	const read = async ({ id }: { id: string }) => {
		const docSnap = await collectionRead.doc(id).get()
		const doc = docSnap.data()
		if (!doc) {
			return null
		}

		return doc
	}

	const create = async ({
		data,
	}: {
		data: m.ApplicationCreate
	}) => {
		const docRef = collectionWrite.doc()

		const writeData = {
			...data,
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
	const addStudent = async ({
		appUserId,
		data,
	}: {
		appUserId: string
		data: Student
	}) => {
		const docRef = collectionWrite.doc(appUserId)

		const writeData = {
			updatedDate: FieldValue.serverTimestamp(),
			students: FieldValue.arrayUnion(data),
		}

		await docRef.update(writeData)
		return docRef.id
	}

	const removeStudent = async ({
		appUserId,
		studentId,
	}: {
		appUserId: string
		studentId: string
	}) => {
		const docRef = collectionWrite.doc(appUserId)
		const doc = await read({ id: appUserId })

		const students = doc?.students ?? []

		const newStudents = students.filter((student) => student.id !== studentId)

		const writeData = {
			updatedDate: FieldValue.serverTimestamp(),
			students: newStudents,
		}

		await docRef.update(writeData)
		return docRef.id
	}

	const addMinor = async ({
		appUserId,
		data,
	}: {
		appUserId: string
		data: Minor
	}) => {
		const docRef = collectionWrite.doc(appUserId)

		const writeData = {
			updatedDate: FieldValue.serverTimestamp(),
			minors: FieldValue.arrayUnion(data),
		}

		await docRef.update(writeData)
		return docRef.id
	}

	const removeMinor = async ({
		appUserId,
		minorId,
	}: {
		appUserId: string
		minorId: string
	}) => {
		const docRef = collectionWrite.doc(appUserId)
		const doc = await read({ id: appUserId })

		const minors = doc?.minors ?? []

		const newMinors = minors.filter((minor) => minor.id !== minorId)

		const writeData = {
			updatedDate: FieldValue.serverTimestamp(),
			minors: newMinors,
		}

		await docRef.update(writeData)
		return docRef.id
	}

	const checkApplication = async ({
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

	const getAllBySemester = async ({ semesterId }: { semesterId: string }) => {
		const querySnapshot = await collectionRead.where("semesterId", "==", semesterId).get()
		const docs = querySnapshot.docs.map((doc) => doc.data())

		return docs
	}

	const getAllForReviewBySemester = async ({
		semesterId,
	}: {
		semesterId: string
	}) => {
		const querySnapshot = await collectionRead
			.where("status", "==", "pending")
			.where("semesterId", "==", semesterId)
			.get()
		const docs = querySnapshot.docs.map((doc) => {
			return {
				...doc.data(),
				id: doc.id,
			}
		})
		return docs
	}

	return {
		read,
		create,
		update,
		addStudent,
		removeStudent,
		addMinor,
		removeMinor,
		checkApplication,
		getAllForReviewBySemester,
		getAllBySemester,
		collection: collectionRead,
		untypedCollection: collectionWrite,
	}
}
