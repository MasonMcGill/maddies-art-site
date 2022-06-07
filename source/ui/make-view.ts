import { VirtualElement, a, body, br, div, img } from "./elements";

declare const imageSizes: {
  readonly [path: string]: {
    readonly width: number;
    readonly height: number;
  };
};

export default function makeRootView(
  pageTree: any,
  path: string
): VirtualElement {
  const rootView = body();
  rootView.children.push(makeSiteHeader());
  rootView.children.push(makeMainView(getSubtree(pageTree, path)));

  if (path !== "") {
    const parentPath = path.split("/").slice(0, -1).join("/");
    const parentName = getPageName(getSubtree(pageTree, parentPath));
    rootView.children.push(makeBackButton(parentPath, parentName));
  }

  return rootView;
}

function makeSiteHeader() {
  // TODO: Implement.
  return div();
}

function makeMainView(page: any) {
  // TODO: Implement.
  return div();
}

function makeBackButton(path: string, text: string) {
  // TODO: Implement.
  return div();
}

function getSubtree(pageTree: any, path: string) {
  let subtree = pageTree;

  for (const pathPart of path.split("/")) {
    let matchingEntry: any = null;

    for (const entry of subtree.entries || []) {
      if (getPageName(entry) === pathPart) {
        matchingEntry = entry;
        break;
      }
    }

    if (matchingEntry !== null) {
      subtree = matchingEntry;
    } else {
      return null;
    }
  }

  return subtree;
}

function getPageName(page: any) {
  if (typeof page.name === "string") {
    return page.name.toLowerCase();
  } else if (page.type === "painting" && typeof page.image === "string") {
    return page.image.split("/").at(-1);
  } else {
    return "<unnamed page>";
  }
}
