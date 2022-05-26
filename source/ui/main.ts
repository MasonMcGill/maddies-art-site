import { css } from "@emotion/css";

import {
  VirtualElement,
  a,
  header,
  main,
  reify,
  render,
  span,
} from "./elements";
import * as views from "./views";

let activeTransition: Promise<void> | null = null;

window.onload = async () => {
  if (location.hash === "") {
    history.replaceState(null, null, "/#/");
  }

  await document.fonts.ready;
  document.body.append(reify(makeHeader()), reify(makeMainSection()));
  showRequestedView();

  window.onhashchange = (event: HashChangeEvent) => {
    showRequestedView();
    event.preventDefault();
  };
};

function makeHeader() {
  return header({
    class: css`
      z-index: 2;
      position: fixed;
      width: 100%;
      padding-top: 3px;
      padding-bottom: 1px;

      background-color: black;
      box-shadow: 0px 0px 10px 0px black;

      text-align: center;
      // font-family: "Water Brush";
      // color: white;
    `,
    children: [makeHomeLink()],
  });
}

function makeHomeLink() {
  return a({
    href: "/#/",
    class: css`
      color: white;
      // color: #bbb;
      text-decoration: none;
      font-family: "MuseoModerno";
      font-size: 26px;
    `,
    children: [
      span({ style: { color: "#666" }, children: ["·"] }),
      span({ style: { color: "#999" }, children: ["\u00A0·"] }),
      span({ style: { color: "#ccc" }, children: ["\u00A0·"] }),
      "\u00A0 Madeline Weste \u00A0",
      span({ style: { color: "#ccc" }, children: ["·\u00A0"] }),
      span({ style: { color: "#999" }, children: ["·\u00A0"] }),
      span({ style: { color: "#666" }, children: ["·"] }),
    ],
  });
}

function makeMainSection() {
  return main({
    class: css`
      position: relative;
      padding-top: 50px;
      padding-bottom: 20px;
      padding-left: 20px;
      padding-right: 20px;
      color: white;
    `,
  });
}

async function showRequestedView() {
  if (activeTransition !== null) return;

  const container = document.querySelector("main");
  const path = location.hash.replace(/^[#/]+/, "");
  let match: RegExpMatchArray;
  let view: VirtualElement;

  if (path.match(/^about$/)) {
    view = views.aboutView();
  } else if (path.match(/^contact$/)) {
    view = views.contactView();
  } else if ((match = path.match(/^collections\/([^/]+)$/))) {
    view = views.collectionView(match[1]);
  } else if ((match = path.match(/^paintings\/([^/]+)\/([^/]+)$/))) {
    view = views.paintingView(match[1], match[2]);
  } else {
    view = views.homeView();
  }

  activeTransition = render(container, [view]);
  await activeTransition;
  activeTransition = null;
}
