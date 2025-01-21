import { getApps, initializeApp as initializeServerApp, cert as serverCert } from "firebase-admin/app"


export const initFirebase = ({
	FIREBASE_APP_NAME,
	SERVICE_ACCOUNT,
}: {
	FIREBASE_APP_NAME: string
	SERVICE_ACCOUNT: string
}) => {
	const config = {
		credential: serverCert(JSON.parse(SERVICE_ACCOUNT)),
	}

	if (getApps().length > 0) {
		const allApps = getApps()
		const app = allApps.find((app) => app.name === FIREBASE_APP_NAME)
		return app ? app : initializeServerApp(config, FIREBASE_APP_NAME)
	}
	return initializeServerApp(config, FIREBASE_APP_NAME)
}

// const firestoreDb = () => {
//   const fireApp = initFirebase();
//   const firestore = getFirestore(fireApp);

//   return firestore;
// };
