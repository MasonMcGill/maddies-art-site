export type ElementOptions = {
  class?: string;
  id?: string;
  href?: string;
  src?: string;
  style?: { [_: string]: string };
  children?: (VirtualElement | string)[];
};

export type VirtualElement = { typeName: string } & ElementOptions;

function virtualElementBuilder(typeName: string) {
  return (options?: ElementOptions) => ({ typeName, ...(options || {}) });
}

export const a = virtualElementBuilder("a");
export const body = virtualElementBuilder("body");
export const br = virtualElementBuilder("br");
export const div = virtualElementBuilder("div");
export const header = virtualElementBuilder("header");
export const img = virtualElementBuilder("img");
export const main = virtualElementBuilder("main");
export const span = virtualElementBuilder("span");
