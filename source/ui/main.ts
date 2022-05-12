import { TemplateResult, html, render } from 'lit-html';

import aboutView from './aboutView';
import collectionView from './collectionView';
import collections from './collections';
import contactView from './contactView';
import homeView from './homeView';
import paintingView from './paintingView';

const viewBuilders = new Map(getViewBuilders());

function main() {
  render(rootView(location.hash), document.body);
  window.onhashchange = () => {
    render(rootView(location.hash), document.body);
  };
}

function rootView(path: string) {
  return html`
    <header>
      <a href="index.html">
        —&nbsp; Madeline Weste &nbsp;—
      </a>
    </header>
    <main>
      ${ viewBuilders.has(path)
        ? viewBuilders.get(path)
        : viewBuilders.get('') }
    </main>
  `;
}

function* getViewBuilders(): Iterable<[string, TemplateResult]> {
  yield ['', homeView()];
  yield ['#about', aboutView()];
  yield ['#contact', contactView()];

  for (const c of collections) {
    yield [`#collections/${c.name}`, collectionView(c)];
  }

  for (const c of collections) {
    for (const p of c.paintingNames) {
      yield [`#paintings/${c.name}/${p}`, paintingView(c.name, p)];
    }
  }
}

main();
