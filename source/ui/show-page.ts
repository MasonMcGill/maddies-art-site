import { css } from "@emotion/css";
import { a, div, img, span } from "./elements";

interface Page {
  path: string;
  name?: string;
  type?: string;
  cardImage?: string;
  entries?: string;
  body: string;
}

declare const pages: Page[];

declare const imageSizes: {
  readonly [path: string]: {
    readonly width: number;
    readonly height: number;
  };
};

export default function showPage(
  container: HTMLElement,
  path: string
): Promise<void> {
  const page = pages.find((p) => p.path === path);
  if (page.type === "collection") {
    return showCollectionPage(container, path);
  } else if (page.type === "painting") {
    return showPaintingPage(container, path);
  } else {
    return showProseBlockPage(container, path);
  }
}

async function showCollectionPage(container: HTMLElement, path: string) {
  await fadeOut(container);

  const cards = pages
    .map((page) => page.path)
    .filter((p) => new RegExp(`^${path}[^\\/]+\\/?$`).test(p))
    .map(makeCard);

  container.append(
    div({
      id: "card-container",
      class: css({
        width: "min(100%, 640px)",
        margin: "auto",
        display: "flex",
        flexWrap: "wrap",
        rowGap: "16px",
        columnGap: "16px",
      }),
    })
  );

  await Promise.all(
    cards
      .map((card) => fadeIn(container.querySelector("#card-container"), [card]))
      .concat(path !== "/" ? [fadeIn(container, [makeBackButton(path)])] : [])
  );
}

function makeCard(path: string) {
  const page = pages.find((p) => p.path === path);
  const imagePath = getCardImagePath(path);
  const width = imageSizes[imagePath.replace(/^images\//, "")]?.width || 0;

  return a({
    href: `/#${page.path}`,
    class: css({
      position: "relative",
      minWidth: "160px",
      minHeight: "160px",
      boxShadow: "0px 3px 10px 0px #555",
      transition: "box-shadow 0.333s ease-out",
      ":hover": {
        boxShadow: "0px 3px 10px 0px #777",
      },
    }),
    style: {
      maxWidth: `${width}px`,
      flexGrow: `${width - 160}`,
    },
    children: [
      img({
        class: css({
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: page.name
            ? "brightness(100%) contrast(67%) hue-rotate(0deg)"
            : "brightness(100%) contrast(100%) hue-rotate(0deg)",
          transition: "filter 0.5s ease-out",
          "*:hover > &": {
            filter: page.name
              ? "brightness(110%) contrast(100%) hue-rotate(360deg)"
              : "brightness(120%) contrast(100%) hue-rotate(360deg)",
            transition: "filter 1s ease-out",
          },
        }),
        src: imagePath,
      }),
      page.name
        ? div({
            class: css({
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: "MuseoModerno",
              fontSize: "32px",
              color: "black",
              textDecoration: "none",
            }),
            children: [page.name],
          })
        : null,
    ],
  });
}

function getCardImagePath(path: string) {
  const page = pages.find((p) => p.path === path);

  if (page.cardImage !== undefined) {
    return page.cardImage.replace(/.jpg$/, "-small.jpg");
  }

  if (page.type === "collection") {
    const firstEntry = pages.find((p) =>
      new RegExp(`^${path}[^\\/]+\\/?$`).test(p.path)
    );
    return getCardImagePath(firstEntry.path);
  }

  try {
    return new DOMParser()
      .parseFromString(page.body, "text/html")
      .querySelector("img")
      .getAttribute("src")
      .replace(/.jpg$/, "-small.jpg");
  } catch {
    return "";
  }
}

async function showProseBlockPage(container: HTMLElement, path: string) {
  await fadeOut(container);

  const page = pages.find((p) => p.path === path);
  const doc = new DOMParser().parseFromString(page.body, "text/html").body;

  await fadeIn(container, [
    div({
      class: css({
        width: "min(100%, 640px)",
        margin: "auto",
        fontFamily: "Cutive Mono",
        fontSize: "17px",
      }),
      children: Array.from(doc.children) as HTMLElement[],
    }),
    path !== "/" ? makeBackButton(path) : null,
  ]);
}

async function showPaintingPage(container: HTMLElement, path: string) {
  await fadeOut(container);

  const page = pages.find((p) => p.path === path);
  const src = new DOMParser()
    .parseFromString(page.body, "text/html")
    .querySelector("img")
    .getAttribute("src")
    .replace(/.jpg$/, "-large.jpg");
  const imageSize = imageSizes[src.replace(/^images\//, "")];
  const aspectRatio = (imageSize?.width || 1) / (imageSize?.height || 1);

  await fadeIn(container, [
    div({
      children: [
        img({
          class: css({
            display: "block",
            margin: "auto",
          }),
          style: {
            width: `min(100vw - 40px, (100vh - 110px) * ${aspectRatio})`,
            height: `min(100vh - 110px, (100vw - 40px) / ${aspectRatio})`,
          },
          src,
        }),
      ],
    }),
    path !== "/" ? makeBackButton(path) : null,
  ]);
}

function makeBackButton(path: string) {
  const parentPath = path.match(/(.*\/)[^\/]+\/?/)[1];
  const parentName = pages.find((p) => p.path === parentPath).name;
  return div({
    class: css({
      marginTop: "10px",
      textAlign: "center",
    }),
    children: [
      a({
        href: `/#${parentPath}`,
        class: css({
          textAlign: "center",
          fontFamily: "Cutive Mono",
          fontSize: "17px",
          textDecoration: "none",
          color: "#aaa",
          transition: "color 0.333s ease-out",
          ":hover": { color: "#ddd" },
        }),
        children: [`↫ ${parentName}`],
      }),
    ],
  });
}

async function fadeOut(container: HTMLElement) {
  await Promise.all(
    Array.from(container.children)
      .filter((c) => c.tagName !== "SCRIPT")
      .map((c) => transition(c, { opacity: "0" }).then(() => c.remove()))
  );
}

async function fadeIn(container: HTMLElement, children: HTMLElement[]) {
  await Promise.all(
    children
      .filter((child) => child !== null)
      .map(async (child) => {
        child.style.opacity = "0";
        container.append(child);
        await Promise.all(
          Array.from(child.querySelectorAll("img")).map((img) => img.decode())
        );
        await transition(child, { opacity: "1" });
      })
  );
}

async function transition(element: Element, target: Keyframe) {
  const duration = 333; // milliseconds
  const animation = element.animate([target], { duration, fill: "forwards" });
  await animation.finished;
  animation.commitStyles();
  animation.cancel();
}
