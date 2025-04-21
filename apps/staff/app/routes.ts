import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/base_layout.tsx", [
    index("routes/staff-landing.tsx"),
    ...prefix("events", [
      index("routes/events-page.tsx"),
      route("list", "routes/event-list.tsx"),
      route(":eventId", "routes/event-details.tsx"),
    ]),
  ]),
  route("sign-in/*", "routes/sign-in.tsx"),
] satisfies RouteConfig;
