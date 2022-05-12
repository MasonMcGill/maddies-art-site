import { TemplateResult, html } from 'lit-html';

export default function (
  collectionName: string,
  paintingName: string
): TemplateResult {
  return html`Painting view: ${collectionName} :: ${paintingName}`;
}
