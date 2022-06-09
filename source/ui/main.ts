import { css } from "@emotion/css";
import { a, header, main, span } from "./elements";
import showPage from "./show-page";

let activeTransition: Promise<void> | null = null;

window.onload = async () => {
  if (location.hash === "") {
    history.replaceState(null, null, "/#/");
  }

  await document.fonts.load("12px MuseoModerno");
  await document.fonts.load("12px Cutive Mono");
  document.body.append(makeHeader(), makeMainSection());
  showRequestedView();

  window.onhashchange = (event: HashChangeEvent) => {
    showRequestedView();
    event.preventDefault();
  };
};

async function showRequestedView() {
  if (activeTransition !== null) return;

  const path = "/" + location.hash.replace(/^[#/]+/, "");
  activeTransition = showPage(document.querySelector("main"), path);

  await activeTransition;
  activeTransition = null;
}

function makeHeader() {
  return header({
    class: css({
      zIndex: "2",
      position: "fixed",
      width: "100%",
      paddingTop: "3px",
      paddingBottom: "1px",
      backgroundColor: "black",
      boxShadow: "0px 0px 10px 0px black",
      textAlign: "center",
    }),
    children: [makeHomeLink()],
  });
}

function makeHomeLink() {
  return a({
    href: "/#/",
    class: css({
      color: "white",
      textDecoration: "none",
      fontFamily: "MuseoModerno",
      fontSize: "26px",
    }),
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
    class: css({
      position: "relative",
      paddingTop: "50px",
      paddingBottom: "20px",
      paddingLeft: "20px",
      paddingRight: "20px",
      color: "white",
    }),
  });
}
