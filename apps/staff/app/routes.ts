import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/base_layout.tsx", [index("routes/staff-landing.tsx")]),
] satisfies RouteConfig;
