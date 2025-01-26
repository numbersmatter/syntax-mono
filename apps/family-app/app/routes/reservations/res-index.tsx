import type { Route } from "./+types/res-index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ResHome() {
  return <div>
    <h1>test</h1>
  </div>;
}
