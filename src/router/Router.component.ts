import { RouteState } from "./interfaces/route-state.interface";
import { ROUTE_NAVIGATE_TO } from "./router.state";
import { Component, CustomElement, html } from "../core";
import { RouteData } from "./interfaces/route-data.interface";
import { createMatcher } from "./matcher";
import { matchRoutes } from "./util";

@Component('app-router')
export class Router extends CustomElement {

  private activeRoute: RouteData;

  async componentDidUnmount() {
    window.removeEventListener('popstate', this.handlePopState.bind(this));
  }

  componentDidMount() {
    window['Router'] = this;
    this.activeRoute = matchRoutes(this.routes, window.location.pathname)[0];
    this.updateLinks();
    window.addEventListener('popstate', this.handlePopState.bind(this));
    this.navigate(window.location.pathname);
  }

  public async navigate(url: string, push = true) {
    const matchedRoutes = matchRoutes(this.routes, url);
    if (matchedRoutes.length > 0) {
      this.activeRoute = matchedRoutes[0];
      if (push) {
        window.history.pushState(null, null, url);
        this.store?.dispatch<RouteState>({
          type: ROUTE_NAVIGATE_TO,
          payload: {
            title: this.activeRoute.title,
            path: this.activeRoute.path,
            params: this.activeRoute.params || [],
          }
        })
      }
    }
    this.update();
  }

  public render() {
    return html`<slot></slot><render-zone></render-zone>`
  }

  get routes() {
    const $routes = this.querySelectorAll('app-route');
    const out = Array.from($routes)
      .filter($route => $route.parentNode === this)
      .map($route => ({
        path: $route.getAttribute('path'),
        matcher: createMatcher($route.getAttribute('path')),
        title: $route.getAttribute('title'),
        component: $route.getAttribute('component'),
      }));
    return out;
  }

  get renderZone() {
    const inside = this.shadowRoot.querySelector('render-zone');
    const outside = this.querySelector('render-zone');
    return inside || outside;
  }

  private update() {
    const { component, title, params = {} } = this.activeRoute;
    if (component) {
      while (this?.renderZone?.firstChild) {
        this.renderZone.removeChild(this.renderZone.firstChild);
      }
      const view = document.createElement(component);
      document.title = title || document.title;
      for (let key of Object.keys(params)) {
        if (key !== "*") view.setAttribute(key, params[key]);
      }
      this.renderZone.appendChild(view);
      this.updateLinks(view.shadowRoot || view);
    }
  }

  public updateLinks(root: Element | ShadowRoot = this) {
    if (!root) return;
    root.querySelectorAll("a[route]").forEach(link => {
      const target = link.getAttribute("route");
      link.setAttribute("href", target);
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.navigate(target);
      });
    });
  }

  private async handlePopState(e: PopStateEvent) {
    this.navigate(window.location.pathname, false);
  }
}
