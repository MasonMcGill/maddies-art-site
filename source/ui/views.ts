import { collections } from "./collections";

export interface View {
  render(container: HTMLElement, previousView: View): void;
}

export class BlankView {
  render(container: HTMLElement, previousView: View): void {}
}

export class HomeView implements View {
  render(container: HTMLElement, previousView: View): void {
    const collectionCards = collections.map(({ name, paintingNames }) =>
      $("a", { href: `/#/collections/${name}` }, [
        $("div", { class: "card" }, [
          $("img", { src: `images/paintings-${name}/${paintingNames[0]}.jpg` }),
          $("div", { class: "label" }, [name]),
        ]),
      ])
    );

    const infoCards = [
      $("a", { href: `/#/about` }, [
        $("div", { class: "card" }, [
          $("img", { src: "images/paintings-2017/lichtenstein.jpg" }),
          $("div", { class: "label" }, ["About"]),
        ]),
      ]),
      $("a", { href: `/#/contact` }, [
        $("div", { class: "card" }, [
          $("img", { src: "images/paintings-2021/heart-disruption.jpg" }),
          $("div", { class: "label" }, ["Contact"]),
        ]),
      ]),
    ];

    container.replaceChildren(
      $("div", { class: "card-container" }, [...collectionCards, ...infoCards])
    );
  }
}

export class AboutView implements View {
  render(container: HTMLElement, previousView: View): void {
    container.replaceChildren(
      $("div", { class: "prose-container" }, [
        `Madeline Weste is a painter living in Los Angeles.
        She is very good with computers. 🖌️\\🤖_🎨`,
      ])
    );
  }
}

export class ContactView implements View {
  render(container: HTMLElement, previousView: View): void {
    container.replaceChildren(
      $("div", { class: "prose-container" }, [
        $("img", { class: "icon", src: "images/icons/email.svg" }),
        " madelineweste at gmail.com",
        $("br"),
        $("img", { class: "icon", src: "images/icons/instagram.svg" }),
        " @madelineweste",
      ])
    );
  }
}

export class CollectionView implements View {
  readonly name: string;
  readonly paintingNames: readonly string[];

  constructor(name: string, paintingNames: readonly string[]) {
    this.name = name;
    this.paintingNames = Array.from(paintingNames);
  }

  render(container: HTMLElement, previousView: View): void {
    const cards = this.paintingNames.map((pName) =>
      $("a", { href: `/#/paintings/${this.name}/${pName}` }, [
        $("div", { class: "card" }, [
          $("img", { src: `images/paintings-${this.name}/${pName}.jpg` }),
        ]),
      ])
    );
    container.replaceChildren($("div", { class: "card-container" }, cards));
  }
}

export class PaintingView implements View {
  readonly collectionName: string;
  readonly paintingName: string;

  constructor(collectionName: string, paintingName: string) {
    this.collectionName = collectionName;
    this.paintingName = paintingName;
  }

  render(container: HTMLElement, previousView: View): void {
    const cName = this.collectionName;
    const pName = this.paintingName;
    container.replaceChildren(
      $("img", {
        class: "full-size-painting",
        src: `images/paintings-${cName}/${pName}.jpg`,
      })
    );
  }
}

export function* getViewsByName(): Iterable<[string, View]> {
  yield ["", new HomeView()];
  yield ["#/about", new AboutView()];
  yield ["#/contact", new ContactView()];

  for (const c of collections) {
    const view = new CollectionView(c.name, c.paintingNames);
    yield [`#/collections/${c.name}`, view];
  }

  for (const c of collections) {
    for (const p of c.paintingNames) {
      const view = new PaintingView(c.name, p);
      yield [`#/paintings/${c.name}/${p}`, view];
    }
  }
}

function $(
  elementType: string,
  attributes?: { readonly [_: string]: string },
  children?: readonly (Element | string)[]
): HTMLElement {
  const element = document.createElement(elementType);
  for (const key in attributes || {}) {
    element.setAttribute(key, attributes[key]);
  }
  for (const child of children || []) {
    element.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    );
  }
  return element;
}
