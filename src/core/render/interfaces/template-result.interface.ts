import { HandlerEntry } from "./handler-entry.interface";

export interface TemplateResult {
  raw: readonly string[];
  markup: string;
  handlers: Record<string, HandlerEntry>;
}