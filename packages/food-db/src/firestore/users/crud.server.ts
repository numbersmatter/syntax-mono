import {
	type DocumentData,
	FieldValue,
	type Firestore,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp,
	type WithFieldValue,
	getFirestore,
} from "firebase-admin/firestore"
import type * as m from "./user-types"

type UserConverter = FirestoreDataConverter<m.UserAppModel, m.UserDbModel>

const firestoreConverter: UserConverter = {
	toFirestore: (appUser: WithFieldValue<m.UserAppModel>) => {
		return {
			email: appUser.email,
			createdTimestamp: FieldValue.serverTimestamp(),
			updatedTimestamp: FieldValue.serverTimestamp(),
			language: appUser.language,
			address: appUser.address,
			household_adults: appUser.household_adults,
			minors: appUser.minors,
			students: appUser.students,
		}
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot<m.UserDbModel>) => {
		const createdDate = snapshot.data().createdTimestamp ? snapshot.data().createdTimestamp.toDate() : new Date()

		const updatedDate = snapshot.data().updatedTimestamp ? snapshot.data().updatedTimestamp.toDate() : new Date()

		return {
			id: snapshot.id,
			email: snapshot.data().email,
			createdDate,
			updatedDate,
			language: snapshot.data().language,
			address: snapshot.data().address,
			household_adults: snapshot.data().household_adults,
			minors: snapshot.data().minors,
			students: snapshot.data().students,
		}
	},
}

export const UserDb = ({
	firestore,
	path,
}: {
	firestore: Firestore
	path: string
}) => {
	const collectionRead = firestore.collection(path).withConverter(firestoreConverter)

	const read = async ({ id }: { id: string }) => {
		const docSnap = await collectionRead.doc(id).get()
		const doc = docSnap.data()
		if (!doc) {
			return null
		}
		return doc
	}

	const list = async () => {
		const querySnapshot = await collectionRead.get()
		const docs = querySnapshot.docs.map((doc) => doc.data())
		return docs
	}

	const collectionWrite = firestore.collection(path)
	const create = async (data: m.AppUserCreate) => {
		const docRef = collectionRead.doc(data.userId)
		const writeData = {
			language: data.language,
			email: data.email,
			students: [],
			minors: [],
			address: {
				street: "",
				unit: "",
				city: "",
				state: "",
				zip: "",
			},
			household_adults: 1,
			createdDate: FieldValue.serverTimestamp(),
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.set(writeData, { merge: true })
	}

	const update = async ({
		id,
		updateData,
	}: {
		id: string
		updateData: DocumentData
	}) => {
		const docRef = collectionWrite.doc(id)

		const writeData = {
			...updateData,
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.update(writeData)
	}

	const addStudent = async ({
		userId,
		student,
	}: {
		userId: string
		student: m.StudentCreate
	}) => {
		const docRef = collectionWrite.doc(userId)
		const studentId = collectionRead.doc().id

		const addStudent = {
			id: studentId,
			...student,
		}

		const writeData = {
			students: FieldValue.arrayUnion(addStudent),
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.update(writeData)
	}

	const removeStudent = async ({
		userId,
		studentId,
	}: {
		userId: string
		studentId: string
	}) => {
		const docRef = collectionWrite.doc(userId)
		const profileDoc = await read({ id: userId })
		if (!profileDoc) {
			throw new Error("User profile not found.")
		}
		const students = profileDoc.students

		const newStudents = students.filter((student) => student.id !== studentId)

		const writeData = {
			students: newStudents,
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.update(writeData)
	}

	const addMinor = async ({
		userId,
		minor,
	}: {
		userId: string
		minor: m.MinorCreate
	}) => {
		const docRef = collectionWrite.doc(userId)
		const studentId = collectionRead.doc().id

		const addMinor = {
			id: studentId,
			...minor,
		}

		const writeData = {
			minors: FieldValue.arrayUnion(addMinor),
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.update(writeData)
	}

	const removeMinor = async ({
		userId,
		minorId,
	}: {
		userId: string
		minorId: string
	}) => {
		const docRef = collectionRead.doc(userId)
		const profileDoc = await read({ id: userId })
		if (!profileDoc) {
			throw new Error("User profile not found.")
		}
		const minors = profileDoc.minors

		const newMinors = minors.filter((minor) => minor.id !== minorId)

		const writeData = {
			minors: newMinors,
			updatedDate: FieldValue.serverTimestamp(),
		}

		return await docRef.update(writeData)
	}

	return {
		read,
		list,
		create,
		update,
		addStudent,
		removeStudent,
		addMinor,
		removeMinor,
		collection: collectionRead,
		untypedCollection: collectionWrite,
	}
}
