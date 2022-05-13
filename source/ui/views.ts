import { collections } from "./collections";

declare const imageSizes: {
  readonly [path: string]: {
    readonly width: string;
    readonly height: string;
  };
};

export interface View {
  render(container: HTMLElement, previousView: View): void;
}

export class BlankView {
  render(container: HTMLElement, previousView: View): void {}
}

export class HomeView implements View {
  render(container: HTMLElement, previousView: View): void {
    const imagePath = (cName: string, pName: string) => {
      return `images-small-and-square/paintings-${cName}/${pName}.jpg`;
    };
    const dimensions = (cName: string, pName: string) => {
      const { width, height } = imageSizes[imagePath(cName, pName)];
      return { style: `min-width:${width}px;min-height:${height}px` };
    };
    const collectionCards = collections.map(({ name, paintingNames }) =>
      $("a", { href: `/#/collections/${name}` }, [
        $("div", { class: "card", ...dimensions(name, paintingNames[0]) }, [
          $("img", { src: imagePath(name, paintingNames[0]) }),
          $("div", { class: "label" }, [name]),
        ]),
      ])
    );
    const infoCards = [
      $("a", { href: `/#/about` }, [
        $("div", { class: "card", ...dimensions("2017", "lichtenstein") }, [
          $("img", { src: imagePath("2017", "lichtenstein") }),
          $("div", { class: "label" }, ["About"]),
        ]),
      ]),
      $("a", { href: `/#/contact` }, [
        $("div", { class: "card", ...dimensions("2021", "heart-disruption") }, [
          $("img", { src: imagePath("2021", "heart-disruption") }),
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
    const imagePath = (cName: string, pName: string) => {
      return `images-small/paintings-${cName}/${pName}.jpg`;
    };
    const dimensions = (cName: string, pName: string) => {
      const { width, height } = imageSizes[imagePath(cName, pName)];
      return { style: `width:${width}px;height:${height}px` };
    };
    const cards = this.paintingNames.map((pName) =>
      $("a", { href: `/#/paintings/${this.name}/${pName}` }, [
        $("div", { class: "card", ...dimensions(this.name, pName) }, [
          $("img", { src: imagePath(this.name, pName) }),
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
