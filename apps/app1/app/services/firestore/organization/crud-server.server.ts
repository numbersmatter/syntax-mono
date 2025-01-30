import {
  type DocumentData,
  DocumentSnapshot,
  FieldValue,
  type Firestore,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  Timestamp,
  type WithFieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import type { ActiveSemesterDoc } from "./org-types";

export const orgCollection = ({
  firestore,
  path,
  special_paths,
}: {
  firestore: Firestore;
  path: string;
  special_paths: Record<string, string>;
}) => {
  const collectionRef = firestore.collection(path);

  const active_semester_path =
    special_paths.active_semester ?? "active_semester";
  const active_semester_ref = collectionRef.doc(active_semester_path);

  const getActiveSemester = active_semester_ref.get() as Promise<
    DocumentSnapshot<ActiveSemesterDoc>
  >;

  const setActiveSemester = ({ active_id }: { active_id: string }) =>
    active_semester_ref.set({
      active_id,
    });

  return {
    getActiveSemester,
  };
};
