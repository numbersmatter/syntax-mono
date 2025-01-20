import {
	FieldValue,
	type Firestore,
	type FirestoreDataConverter,
	type QueryDocumentSnapshot,
	Timestamp,
	type WithFieldValue,
	getFirestore,
} from "firebase-admin/firestore"
import type * as m from "./event-types"

interface EventConverter extends FirestoreDataConverter<m.EventAppModel, m.EventDbModel> {}

const firestoreConverter: EventConverter = {
	toFirestore: (event: m.EventAppModel) => {
		return {
			eventTimestamp: Timestamp.fromDate(event.eventDate),
			createdTimestamp: Timestamp.fromDate(event.createdDate),
			updatedTimestamp: Timestamp.fromDate(event.updatedDate),
			semesterId: event.semesterId,
			name: event.name,
			type: event.type,
			stage: event.stage,
			timeSlots: event.timeSlots,
			message: event.message,
		}
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot<m.EventDbModel>) => {
		const eventDate = snapshot.data().eventTimestamp ? snapshot.data().eventTimestamp.toDate() : new Date()

		const createdDate = snapshot.data().createdTimestamp ? snapshot.data().createdTimestamp.toDate() : new Date()

		const updatedDate = snapshot.data().updatedTimestamp ? snapshot.data().updatedTimestamp.toDate() : new Date()

		return {
			id: snapshot.id,
			name: snapshot.data().name,
			type: snapshot.data().type,
			stage: snapshot.data().stage,
			eventDate,
			createdDate,
			updatedDate,
			timeSlots: snapshot.data().timeSlots,
			semesterId: snapshot.data().semesterId,
			message: snapshot.data().message,
		}
	},
}

export const eventsDb = ({
	firestore,
	path,
}: {
	firestore: Firestore
	path: string
}) => {
	const collectionRead = firestore.collection(path).withConverter(firestoreConverter)

	const collectionWrite = firestore.collection(path)

	const read = async ({ eventId }: { eventId: string }) => {
		const docSnap = await collectionRead.doc(eventId).get()
		const doc = docSnap.data()
		if (typeof doc === "undefined") {
			return null
		}
		return doc
	}

	const create = async (eventData: m.CreateEvent) => {
		const eventDocRef = collectionWrite.doc()
		const createData: WithFieldValue<m.EventDbModel> = {
			...eventData,
			eventTimestamp: Timestamp.fromDate(eventData.eventDate),
			createdTimestamp: FieldValue.serverTimestamp(),
			updatedTimestamp: FieldValue.serverTimestamp(),
			stage: "planning",
			timeSlots: {},
			message: "",
		}
		await eventDocRef.set(createData)

		return eventDocRef.id
	}

	const list = async () => {
		const querySnapshot = await collectionRead.get()
		const docs = querySnapshot.docs.map((doc) => doc.data())
		return docs
	}

	const listOpen = async () => {
		const querySnapshot = await collectionRead.where("stage", "==", "open-for-requests").get()
		const requestReadyEvents = querySnapshot.docs.map((doc) => doc.data())

		const pickupSnapshot = await collectionRead.where("stage", "==", "open-for-pickups").get()

		const pickupReadyEvents = pickupSnapshot.docs.map((doc) => doc.data())

		return [...requestReadyEvents, ...pickupReadyEvents]
	}

	const update = async ({
		id,
		data,
	}: {
		id: string
		data: Partial<m.EventDbModel>
	}) => {
		const updateData = {
			...data,
			updatedDate: FieldValue.serverTimestamp(),
		}
		const docRef = collectionWrite.doc(id)
		return await docRef.update(updateData)
	}

	const listByStages = async ({
		stages,
	}: {
		stages: m.EventStage[]
	}) => {
		const querySnapshot = await collectionRead.where("stage", "in", stages).get()
		const events = querySnapshot.docs.map((doc) => doc.data())
		return events
	}

	return {
		read,
		list,
		listOpen,
		create,
		update,
		listByStages,
		collection: collectionRead,
		untypedCollection: collectionWrite,
	}
}
