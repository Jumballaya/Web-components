import { setupAttributeChangedCallback, setupConnectedCallback, setupDisconnectCallback } from './lifecycle';

export const Component = (selector: `${string}-${string}`) =>
  (customElementCtor: CustomElementConstructor) => {
    setupConnectedCallback(customElementCtor);
    setupDisconnectCallback(customElementCtor);
    setupAttributeChangedCallback(customElementCtor);
    window.customElements.define(selector, customElementCtor);
  }