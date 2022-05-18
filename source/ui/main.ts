import { css } from "@emotion/css";

import { a, body, header, main } from "./elements";
import * as views from "./views";
import showAboutView from "./showAboutView";
import showContactView from "./showContactView";

let activeTransition: Promise<void> | null = null;

window.onload = async () => {
  await document.fonts.ready;
  window.onhashchange = (event: HashChangeEvent) => {
    showRequestedView();
    event.preventDefault();
  };

  const skeleton = pageSkeleton();
  const headerEntrance = skeleton
    .querySelector("header")
    .animate([{ opacity: "0" }, { opacity: "1" }], { duration: 333 });
  document.body.replaceWith(skeleton);
  const view = showRequestedView();
  await Promise.all([headerEntrance.finished, view]);
};

function pageSkeleton() {
  return body({
    class: css`
      margin: 0;
      color: white;
    `,
    children: [
      header({
        class: css`
          z-index: 1;
          position: fixed;
          width: 100%;
          padding-top: 6px;
          padding-bottom: 1px;

          background-color: black;
          box-shadow: 0px 0px 15px 0px black;

          text-align: center;
          font-family: "Water Brush";
          font-size: 28px;
        `,
        children: [
          a({
            class: css`
              color: white;
              text-decoration: none;
            `,
            href: "/#/",
            children: ["—\u00A0 Madeline Weste \u00A0—"],
          }),
        ],
      }),
      main({
        class: css`
          padding-top: 50px;
          padding-left: 10px;
          padding-right: 10px;
        `,
      }),
    ],
  });
}

async function showRequestedView() {
  if (activeTransition !== null) return;

  const container = document.querySelector("main");
  const path = location.hash.replace(/^[#/]+/, "");
  let match: RegExpMatchArray;

  if (path.match(/^about$/)) {
    activeTransition = showAboutView(container);
  } else if (path.match(/^contact$/)) {
    activeTransition = showContactView(container);
  } else if ((match = path.match(/^collections\/([^/]+)$/))) {
    activeTransition = views.showCollectionView(container, match[1]);
  } else if ((match = path.match(/^paintings\/([^/]+)\/([^/]+)$/))) {
    activeTransition = views.showPaintingView(container, match[1], match[2]);
  } else {
    activeTransition = views.showHomeView(container);
  }

  await activeTransition;
  activeTransition = null;
}
