import { collections } from "./collections";

declare const imageSizes: {
  readonly [path: string]: {
    readonly width: string;
    readonly height: string;
  };
};

export async function showHomeView(container: HTMLElement): Promise<void> {
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

export async function showCollectionView(
  container: HTMLElement,
  cName: string
): Promise<void> {
  const imagePath = (pName: string) => {
    return `images-small/paintings-${cName}/${pName}.jpg`;
  };
  const dimensions = (pName: string) => {
    const { width, height } = imageSizes[imagePath(pName)];
    return { style: `width:${width}px;height:${height}px` };
  };
  const collection = collections.find((c) => c.name === cName);
  const cards = collection.paintingNames.map((pName) =>
    $("a", { href: `/#/paintings/${cName}/${pName}` }, [
      $("div", { class: "card", ...dimensions(pName) }, [
        $("img", { src: imagePath(pName) }),
      ]),
    ])
  );
  container.replaceChildren($("div", { class: "card-container" }, cards));
}

export async function showPaintingView(
  container: HTMLElement,
  cName: string,
  pName: string
): Promise<void> {
  container.replaceChildren(
    $("img", {
      class: "full-size-painting",
      src: `images/paintings-${cName}/${pName}.jpg`,
    })
  );
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
