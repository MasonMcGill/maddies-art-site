import { BlankView, View, getViewsByName } from "./views";

const views = new Map(getViewsByName());
let presentedView: View = new BlankView();

document.body.innerHTML = `
  <header>
    <a href="/#/">
      —&nbsp; Madeline Weste &nbsp;—
    </a>
  </header>
  <main></main>
`;

function updatePresentedView() {
  const container = document.querySelector("main");
  const view = views.get(location.hash) || views.get("");
  view.render(container, presentedView);
  presentedView = view;
}

window.onhashchange = (event: HashChangeEvent) => {
  updatePresentedView();
  event.preventDefault();
};

updatePresentedView();
