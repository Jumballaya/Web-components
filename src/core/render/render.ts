import { evtRegex } from "./evt.regex";
import { TemplateResult } from "./interfaces/template-result.interface";

const applyEventListeners = (handlers: TemplateResult['handlers'], node: Element): void => {
  for (const attrName of node.getAttributeNames()) {
    const match = (attrName + '=').match(evtRegex);
    if (match) {
      const val = node.getAttribute(attrName);
      if (val && val in handlers) {
        const handler = handlers[val];
        if (handler) {
          node.addEventListener(handler.type, handler.handler.bind(node));
          node.removeAttribute(attrName);
        }
      }
    }
  }
}

const applyListeners = (markup: TemplateResult, el: Element | DocumentFragment): void => {
  if (!(el instanceof DocumentFragment)) {
    applyEventListeners(markup.handlers, el);
  }
  for (const node of el.children) {
    applyEventListeners(markup.handlers, node);
    if (node.children.length > 0) {
      for (const child of node.children) {
        applyListeners(markup, child);
      }
    }
    if (node.shadowRoot) {
      applyListeners(markup, node.shadowRoot);
    }
  }
}

export const render = (tmpl: TemplateResult, css: string = ''): DocumentFragment => {
  const $template = document.createElement('template');
  $template.innerHTML = css.length > 0 ? `<style>${css}</style>${tmpl.markup}` : tmpl.markup;
  applyListeners(tmpl, $template.content);
  return $template.content;
}