import { RouteData } from "./interfaces/route-data.interface";

export const matchRoutes = (routes: RouteData[], uri: string): RouteData[] => {
  let matched: RouteData[] = [];
  for (const route of routes) {
    const match = route.matcher.match(uri);
    if (match) {
      route.params = match;
      matched.push(route);
    }
  }
  return matched;
}