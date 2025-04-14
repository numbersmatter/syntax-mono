import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/staff-landing.tsx"),
    ...prefix("events", [
      index("routes/events/events.tsx"),
      route("create", "routes/events/create-event.tsx"),
      route(":eventId", "routes/events/eventid-nav.tsx", [
        index("routes/events/eventIdIndex.tsx"),
        route("reservations", "routes/events/reservation-request.tsx"),
        ...prefix("add-family", [
          index("routes/events/add-family.tsx"),
          route(":userId", "routes/events/family-event-form.tsx"),
        ]),
        route("edit", "routes/events/event-edit.tsx"),
        ...prefix("pickup", [
          index("routes/events/pickup-list.tsx"),
          route(":reservationId", "routes/events/pickup-process.tsx"),
        ]),
      ]),
    ]),
    ...prefix("reservations", [
      index("routes/reservations/reserve-index.tsx"),
      route(":rId", "routes/reservations/process-reservation.tsx"),
    ]),
    ...prefix("semesters", [
      index("routes/semesters/semesters.tsx"),
      route("create", "routes/semesters/create.tsx"),
      route(":semesterId", "routes/semesters/semesterId.tsx"),
    ]),
    ...prefix("users", [
      index("routes/users/users-index.tsx"),
      route(":userId", "routes/users/user-id.tsx", [
        index("routes/users/userid-index.tsx"),
        route("students", "routes/users/update-students.tsx"),
        route("create-reservation", "routes/users/create-reservation.tsx"),
        route("adults", "routes/users/update-adults.tsx"),
      ]),
    ]),
  ]),
  // layout("routes/layout.tsx", []),
  route("login", "routes/login/login.tsx"),
  route("logout", "routes/logout.ts"),
] satisfies RouteConfig;
