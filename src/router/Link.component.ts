import { Component, CustomElement, html } from "../core";
import { Attribute } from "../core";


@Component('app-link')
export class Link extends CustomElement {

  @Attribute()
  route: string;

  componentDidMount() {
    this.updateLink();

    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        if (mut.attributeName === 'route' || mut.attributeName === 'style') {
          this.updateLink();
        }
      }
    });

    observer.observe(this, {
      attributes: true,
      attributeOldValue: true,
      subtree: true,
    })
  }

  render() {
    return html`<a><slot></slot></a>`
  }

  private updateLink() {
    const $a = this.shadowRoot.querySelector('a') as HTMLAnchorElement;
    const style = this.getAttribute('style');
    if (this.router && $a && this.router.updateLinks) {
      const route = this.getAttribute('route');
      if (route) {
        $a.setAttribute('route', route);
      }
      this.router.updateLinks(this.shadowRoot);
      if (style) {
        $a.setAttribute('style', style);
      }
    }
  }
}