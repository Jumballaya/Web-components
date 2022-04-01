import { Matcher } from "../matcher/interfaces/matcher.interface";

export interface RouteData {
  title: string;
  path: string;
  component: string;
  matcher?: Matcher;
  params?: Record<string, any>;
}