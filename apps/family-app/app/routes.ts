import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/index/index-page.tsx"),
    ...prefix("events", [
      index("routes/home.tsx"),
      route(":eventId", "routes/events/event-id.tsx"),
    ]),
    ...prefix("reservations", [
      index("routes/reservations/res-index.tsx"),
      route(":rId", "routes/reservations/reservation-id.tsx"),
    ]),
  ]),
  route("login/*", "routes/login.tsx"),
  route("sign-up", "routes/sign-up.tsx"),

  // route("logout", "routes/logout.ts"),
] satisfies RouteConfig;
