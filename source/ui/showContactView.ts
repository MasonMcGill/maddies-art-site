import { css } from "@emotion/css";
import { br, div, img } from "./elements";

export default async function (container: HTMLElement): Promise<void> {
  const iconClass = css`
    margin-bottom: -2.5px;
    height: 15px;
    filter: invert(1);
  `;
  const emailIcon = img({
    class: iconClass,
    src: "images/icons/email.svg",
  });
  const instagramIcon = img({
    class: iconClass,
    src: "images/icons/instagram.svg",
  });

  // prettier-ignore
  if (container.childNodes.length !== 0) {
    await container.animate(
      [{ opacity: "1" }, { opacity: "0" }],
      { duration: 333 }
    ).finished;
  }

  await Promise.all([emailIcon.decode(), instagramIcon.decode()]);

  container.replaceChildren(
    div({
      class: css`
        width: min(100% - 15px, 600px);
        margin: auto;
        text-align: center;
        line-height: 1.5;
        font-family: "Cutive Mono";
        font-size: 17px;
      `,
      children: [
        emailIcon,
        " madelineweste at gmail.com",
        br(),
        instagramIcon,
        " @madelineweste",
      ],
    })
  );

  // prettier-ignore
  await container.animate(
    [{ opacity: "0" }, { opacity: "1" }],
    { duration: 333 }
  ).finished;
}
