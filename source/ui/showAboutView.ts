import { css } from "@emotion/css";
import { div } from "./elements";

export default async function (container: HTMLElement): Promise<void> {
  // prettier-ignore
  if (container.childNodes.length !== 0) {
    await container.animate(
      [{ opacity: "1" }, { opacity: "0" }],
      { duration: 333 }
    ).finished;
  }

  container.replaceChildren(
    div({
      class: css`
        width: min(100% - 15px, 600px);
        margin: auto;
        font-family: "Cutive Mono";
        font-size: 17px;
      `,
      children: [
        `Madeline Weste is a painter living in Los Angeles.
        She is very good with computers. 🖌️\\🤖_🎨`,
      ],
    })
  );

  // prettier-ignore
  await container.animate(
    [{ opacity: "0" }, { opacity: "1" }],
    { duration: 333 }
  ).finished;
}
