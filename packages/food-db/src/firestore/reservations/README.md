# Reservations Firestore Database

This module provides functions to interact with the reservations collection in Firestore. It includes methods to create, read, update, and list reservations.

## Definitions
A reservations database might be better thought of as a "Reservation Requests" database. For the shake of brievity it has been shortened in the code to reservations.

A reservation request represents a family making a request to the food pantry to receive a box of groceries.

### App Model

**Id**
: This is a unique id for the request.

**userId**
: This is the userId of the family making the request.

**createdDate**
: This is the date the reservation request document was created in the database via Firestore server timestamp. This is converted via the firestore converter into a JS Date object.

**updatedDate**
: This the serverTimestamp of the last time update function has been called on this document.

**eventId**
:This is the unique event id that this request is related to.

**status**
: Status can be `pending`, `approved`, `declined`, `waitlist`. All requests start off as `pending` until the request is changed by a staff member.

**time**
: This value is a number that presents the 24hr time of day. The value `1600` would present `4:00 PM`.

**primaryContact**
: This object is `fname`, `lname`, `email`, and `phone` of user as given by Clerk Auth when registered.


**confirm**
: This is the confirmation code used to validate the user upon arrive to the food pantry.




## Firestore Converter

The `firestoreConverter` object is used to convert between Firestore documents and the `ReservationAppModel` and `ReservationDbModel` types.

### toFirestore

Converts a `ReservationAppModel` object to a Firestore document.

```typescript
toFirestore: (reservation: m.ReservationAppModel) => {
    return {
        id: reservation.id,
        createdTimestamp: Timestamp.fromDate(reservation.createdDate),
        updatedTimestamp: Timestamp.fromDate(reservation.updatedDate),
        eventId: reservation.eventId,
        status: reservation.status,
        time: reservation.time,
        primaryContact: reservation.primaryContact,
        userId: reservation.userId,
        confirm: reservation.confirm,
    }
}


fromFirestore: (snapshot: QueryDocumentSnapshot<m.ReservationDbModel>) => {
    const createdDate = snapshot.data()?.createdDate
        ? snapshot.data().createdDate.toDate()
        : snapshot.data().createdTimestamp.toDate()

    const updatedDate = snapshot.data().updatedTimestamp ? snapshot.data().updatedTimestamp.toDate() : new Date()

    return {
        id: snapshot.id,
        userId: snapshot.data().userId,
        createdDate,
        updatedDate,
        eventId: snapshot.data().eventId,
        status: snapshot.data().status,
        time: snapshot.data().time,
        confirm: snapshot.data().confirm,
        primaryContact: snapshot.data().primaryContact,
    }
}
```

## Notes
