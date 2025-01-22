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

  return {
    read,
    create,
    update,
    collection: readCollection,
    collection_danger: CollectionReference,
    list,
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
