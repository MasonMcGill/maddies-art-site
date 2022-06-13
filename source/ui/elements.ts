export type ElementOptions = {
  class?: string;
  id?: string;
  href?: string;
  src?: string;
  style?: Partial<CSSStyleDeclaration>;
  children?: (HTMLElement | string)[];
};

function elementBuilder(typeName: string) {
  return (options: ElementOptions = {}) => {
    const element = document.createElement(typeName);

    Object.entries(options).forEach(([k, v]) => {
      if (typeof v === "string") {
        element.setAttribute(k, v);
      }
    });

    Object.entries(options.style || {}).forEach(([k, v]) => {
      element.style[k] = v;
    });

    (options.children || []).forEach((c) => {
      element.append(c);
    });

    return element;
  };
}

export const a = elementBuilder("a");
export const body = elementBuilder("body");
export const br = elementBuilder("br");
export const div = elementBuilder("div");
export const header = elementBuilder("header");
export const img = elementBuilder("img");
export const main = elementBuilder("main");
export const span = elementBuilder("span");
