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
    ]),
  ]),
] satisfies RouteConfig;
