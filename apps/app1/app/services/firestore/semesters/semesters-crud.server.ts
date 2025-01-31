import {
  CollectionReference,
  type DocumentData,
  FieldValue,
  type Firestore,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import type * as m from "./semester-types";

const firestoreConverter = {
  toFirestore: (semester: m.SemesterAppModel) => {
    return {
      name: semester.name,
      startTimestamp: Timestamp.fromDate(semester.startDate),
      endTimestamp: Timestamp.fromDate(semester.endDate),
      createdTimestamp: Timestamp.fromDate(semester.createdDate),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.SemesterDbModel>) => {
    const doc = snapshot.data();
    return {
      id: snapshot.id,
      startDate: doc.startTimestamp.toDate(),
      endDate: doc.endTimestamp.toDate(),
      createdDate: doc.createdTimestamp.toDate(),
      name: doc.name,
    };
  },
};

const semesterDb = ({
  firestore,
  path,
}: {
  firestore: Firestore;
  path: string;
}) => {
  const readCollection = firestore
    .collection(path)
    .withConverter(firestoreConverter);

  const writeCollection = firestore.collection(path);

  const read = async ({ id }: { id: string }) => {
    const docSnap = await readCollection.doc(id).get();
    const doc = docSnap.data();

    if (!doc) {
      return null;
    }
    return doc;
  };

  const create = async (data: m.SemesterCreate) => {
    const docRef = writeCollection.doc();

    const writeData = {
      name: data.name,
      startTimestamp: Timestamp.fromDate(data.startDate),
      endTimestamp: Timestamp.fromDate(data.endDate),
      createdTimestamp: FieldValue.serverTimestamp(),
    };

    await docRef.set(writeData);

    return docRef.id;
  };

  const update = async ({
    id,
    updateData,
  }: {
    id: string;
    updateData: DocumentData;
  }) => {
    const docRef = writeCollection.doc(id);
    const data = {
      ...updateData,
    };

    await docRef.update(data);

    return docRef.id;
  };

  const list = async () => {
    const querySnapshot = await readCollection.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const getActiveSemester = async () => {
    const acSnap = await writeCollection.doc("active_semester").get();
    const active_semester = acSnap.data();

    // if no active semester doc
    if (!active_semester) {
      // Query the collection, order by 'createdTimestamp'
      // in descending order, and limit to 1
      const querySnapshot = await readCollection
        .orderBy("createdTimestamp", "desc")
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        // Return the most recent document
        const mostRecentDoc = querySnapshot.docs[0].data();

        return {
          semesterId: mostRecentDoc.id,
          semesterName: mostRecentDoc.name,
        };
      } else {
        // Handle the case where no documents are found
        return null;
      }
    }

    return {
      semesterId: active_semester.id as string,
      semesterName: active_semester.name as string,
    };
  };

  // active semester functions

  const set = async ({ id }: { id: string }) => {
    const refDoc = await read({ id });
    if (!refDoc) {
      throw new Error(`No semester with id: ${id}`);
    }

    const acRef = writeCollection.doc("active_semester");

    const newData = {
      id: refDoc.id,
      name: refDoc.name,
      startTimestamp: Timestamp.fromDate(refDoc.startDate),
      endTimestamp: Timestamp.fromDate(refDoc.endDate),
      createdTimestamp: FieldValue.serverTimestamp(),
    };

    return await acRef.set(newData);
  };

  const active = {
    getActiveSemester,
    set,
  };

  return {
    read,
    create,
    update,
    collection: readCollection,
    collection_danger: writeCollection,
    list,
    active,
  };
};

const getActiveSemester = async () => {
  const semesterId = "Dt6bULFo471k1b6HRsDl";
  const semesterName = "August-December 2024";

  return {
    semesterId,
    semesterName,
  };
};

export { getActiveSemester, semesterDb };
