import { Matcher } from "./interfaces/matcher.interface";

const paramRe = /^:(.+)/;

export const segmentize = (uri: string) => {
  // 1. Replace any amount of Leading and/or Trailing '/' from the string
  // 2. Split by '/'
  return uri
    .replace(/(^\/|\/$)/g, "")
    .split("/");
}

const clean = (str: string): [string, string[], boolean] => {
  const [uriPathname] = str.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  return [uriPathname, uriSegments, isRootUri];
}

const createRegex = (uri: string): [string[], RegExp] => {
  const [uriPathname, uriSegments, isRootUri] = clean(uri);
  if (isRootUri) {
    return [[], new RegExp('^/$')];
  }
  if (uriPathname === '*') {
    return [[], new RegExp(/.*/g)];
  }

  const params: Array<string> = [];

  const regexSegments = uriSegments.map((seg, i) => {
    const paramMatch = seg.match(paramRe);
    if (paramMatch) {
      params.push(paramMatch[1]);
      return '(.+)';
    }
    return seg;
  });
  const str = '^\\/'.concat(regexSegments.join('\\/')).concat('\\/$');
  return [params, new RegExp(str)];
}

export const createMatcher = (uri: string): Matcher => {
  const [regexPathname, regexSegments, _] = clean(uri);
  const [params, regex] = createRegex(uri);
  return {
    regex,
    match: (uri: string): Record<string, unknown> | null => {
      if (uri[uri.length - 1] !== '/') uri += '/';
      const [uriPathname, uriSegments, _] = clean(uri);
      if (regexPathname === '*') {
        return {};
      }
      if (uriSegments.length !== regexSegments.length) {
        return null;
      }
      const matches = regex ? uriPathname.match(regex) : null;
      if (matches) {
        return params.reduce((acc, param, index) => {
          return {
            ...acc,
            [param]: matches[index + 1].replace(/\//g, ''),
          }
        }, {} as Record<string, unknown>);
      }
      return null;
    }
  }
}
