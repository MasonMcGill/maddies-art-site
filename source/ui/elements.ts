function elementBuilder<T extends HTMLElement>(typeName: string) {
  return (
    attributes?: { readonly [_: string]: any },
    children?: readonly (Element | string)[]
  ) => {
    const element = document.createElement(typeName);

    for (const key in attributes || {}) {
      if (key !== "children") {
        element.setAttribute(key, attributes[key]);
      }
    }

    for (const child of children || attributes?.children || []) {
      element.appendChild(
        typeof child === "string" ? document.createTextNode(child) : child
      );
    }

    return element as T;
  };
}

export const a = elementBuilder<HTMLAnchorElement>("a");
export const body = elementBuilder<HTMLBodyElement>("body");
export const br = elementBuilder<HTMLBRElement>("br");
export const div = elementBuilder<HTMLDivElement>("div");
export const header = elementBuilder<HTMLElement>("header");
export const img = elementBuilder<HTMLImageElement>("img");
export const main = elementBuilder<HTMLElement>("main");
export const span = elementBuilder<HTMLSpanElement>("span");
