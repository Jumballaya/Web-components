import { Router } from "../../router";
import { Store } from "../../state";
import { html } from "../render/html";
import { TemplateResult } from "../render/interfaces/template-result.interface";

export abstract class CustomElement extends HTMLElement {
  render(): TemplateResult { return html``; }
  get css(): string { return ''; };

  get router(): Router | undefined {
    return window['Router'];
  }

  get store(): Store<unknown> | undefined {
    return window['Store'];
  }

  componentWillMount(): void | Promise<void> { }
  componentDidMount(): void | Promise<void> { };

  componentWillUnmount(): void | Promise<void> { };
  componentDidUnmount(): void | Promise<void> { };

  componentDidUpdate(name: string, oldValue: string, newValue: string): void { }
  shouldComponentUpdate(name: string, oldValue: string, newValue: string): boolean { return true; }

}