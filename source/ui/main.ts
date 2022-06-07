import makeView from "./make-view";
import render from "./render";

declare const pageTree: any;

let activeTransition: Promise<void> | null = null;

window.onload = async () => {
  if (location.hash === "") {
    history.replaceState(null, null, "/#/");
  }

  await document.fonts.ready;
  showRequestedView();

  window.onhashchange = (event: HashChangeEvent) => {
    showRequestedView();
    event.preventDefault();
  };
};

async function showRequestedView() {
  if (activeTransition !== null) return;

  const path = location.hash.replace(/^[#/]+/, "");
  const view = makeView(pageTree, path);

  activeTransition = render(view);
  await activeTransition;
  activeTransition = null;
}
