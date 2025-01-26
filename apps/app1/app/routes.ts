import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    ...prefix("events", [
      index("routes/events/events.tsx"),
      route("create", "routes/events/create-event.tsx"),
      route(":eventId", "routes/events/eventid-nav.tsx", [
        index("routes/events/eventIdIndex.tsx"),
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
  ]),
  route("login", "routes/login/login.tsx"),
  route("logout", "routes/logout.ts"),
] satisfies RouteConfig;
