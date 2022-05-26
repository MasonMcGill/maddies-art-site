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

export async function render(container: Element, vElements: VirtualElement[]) {
  const vElementIds = new Set(
    vElements.map((e) => e.id).filter((id) => id !== undefined)
  );

  // Fade out and remove unneeded elements.
  await Promise.all(
    Array.from(container.children)
      .filter((c) => !vElementIds.has(c.id))
      .map((c) => transition(c, { opacity: "0" }).then(() => c.remove()))
  );

  // Fade in new elements.
  await Promise.all(
    vElements
      .filter((ve) => document.getElementById(ve.id) === null)
      .map(async (ve) => {
        const child = reify(ve);
        child.style.opacity = "0";
        container.append(child);
        await transition(child, { opacity: "1" });
      })
  );
}

export function reify(vElement: VirtualElement) {
  const element = document.createElement(vElement.typeName);

  Object.entries(vElement).forEach(([k, v]) => {
    if (k !== "typeName" && typeof v === "string") {
      element.setAttribute(k, v);
    }
  });

  Object.entries(vElement.style || {}).forEach(([k, v]) => {
    element.style[k] = v;
  });

  (vElement.children || []).forEach((c) => {
    element.append(typeof c === "string" ? c : reify(c));
  });

  return element;
}

async function transition(element: Element, target: Keyframe): Promise<void> {
  const duration = 333; // milliseconds
  const animation = element.animate([target], { duration, fill: "forwards" });
  await animation.finished;
  animation.commitStyles();
  animation.cancel();
}
