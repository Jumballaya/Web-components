
export interface Matcher {
  regex: RegExp;
  match: (uri: string) => Record<string, unknown> | null;
};