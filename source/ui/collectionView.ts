import { TemplateResult, html } from 'lit-html';

interface Collection {
  name: string,
  paintingNames: string[]
}

export default function (collection: Collection): TemplateResult {
  return html`Collection view: ${collection.name}`;
}
