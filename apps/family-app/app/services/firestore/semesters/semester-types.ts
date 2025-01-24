import type { Timestamp } from "firebase-admin/firestore";

type SemesterAppModel = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
};

type SemesterDbModel = {
  name: string;
  startTimestamp: Timestamp;
  endTimestamp: Timestamp;
  createdTimestamp: Timestamp;
};

type SemesterCreate = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export { type SemesterAppModel, type SemesterDbModel, type SemesterCreate };
