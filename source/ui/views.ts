import { css } from "@emotion/css";

import { aboutImage, collections, contactImage } from "./constants";
import { VirtualElement, a, br, div, img } from "./elements";

declare const imageSizes: {
  readonly [path: string]: {
    readonly width: number;
    readonly height: number;
  };
};

export function aboutView(): VirtualElement {
  return div({
    class: css`
      width: min(100% - 15px, 600px);
      margin: auto;
      font-family: "Cutive Mono";
      font-size: 17px;
    `,
    children: [
      `Madeline Weste is a painter living in Los Angeles.
      She is very good with computers. 🖌️\\🤖_🎨`,
      a({
        href: `/#/`,
        class: css`
          display: block;
          margin-top: 10px;
          text-align: center;
          font-family: "Cutive Mono";
          font-size: 17px;

          text-decoration: none;
          color: #aaa;
          transition: color 0.333s ease-out;

          &:hover {
            color: #ddd;
          }
        `,
        children: ["↫ Home"],
      }),
    ],
  });
}

export function contactView(): VirtualElement {
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
  return div({
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
      a({
        href: `/#/`,
        class: css`
          display: block;
          margin-top: 10px;
          text-align: center;
          font-family: "Cutive Mono";
          font-size: 17px;

          text-decoration: none;
          color: #aaa;
          transition: color 0.333s ease-out;

          &:hover {
            color: #ddd;
          }
        `,
        children: ["↫ Home"],
      }),
    ],
  });
}

export function homeView(): VirtualElement {
  const homeView = div({
    class: css`
      width: min(100%, 640px);
      margin: auto;
      display: flex;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 16px;
    `,
    children: [],
  });

  for (const c of collections) {
    homeView.children.push(
      homeViewCard({
        text: c.cName,
        href: `/#/collections/${c.cName}`,
        cName: c.cName,
        pName: c.pNames[0],
      })
    );
  }

  homeView.children.push(
    homeViewCard({
      text: "About",
      href: "/#/about",
      cName: aboutImage.cName,
      pName: aboutImage.pName,
    })
  );

  homeView.children.push(
    homeViewCard({
      text: "Contact",
      href: "/#/contact",
      cName: contactImage.cName,
      pName: contactImage.pName,
    })
  );

  return homeView;
}

function homeViewCard(opts: {
  text: string;
  href: string;
  cName: string;
  pName: string;
}) {
  const { width } =
    imageSizes[`images-small/paintings-${opts.cName}/${opts.pName}.jpg`];
  return a({
    href: opts.href,
    class: css`
      position: relative;
      min-width: 160px;
      min-height: 160px;

      box-shadow: 0px 3px 10px 0px #555;
      transition: box-shadow 0.333s ease-out;

      &:hover {
        box-shadow: 0px 3px 10px 0px #777;
      }
    `,
    style: {
      maxWidth: `${width}px`,
      flexGrow: `${width - 160}`,
    },
    children: [
      img({
        class: css`
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;

          filter: brightness(100%) contrast(67%) hue-rotate(0deg);
          transition: filter 0.5s ease-out;

          *:hover > & {
            filter: brightness(110%) contrast(100%) hue-rotate(360deg);
            transition: filter 1s ease-out;
          }
        `,
        src: `images-small/paintings-${opts.cName}/${opts.pName}.jpg`,
      }),
      div({
        class: css`
          position: absolute;
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;
          //
          font-family: "MuseoModerno";
          // font-family: "Flamenco";

          // font-weight: bold;
          // font-family: "Kalam";
          // font-weight: bold;
          font-size: 32px;
          color: black;

          text-decoration: none;
        `,
        children: [opts.text],
      }),
    ],
  });
}

export function collectionView(cName: string): VirtualElement {
  const cardHolder = div({
    class: css`
      width: min(100%, 640px);
      margin: auto;
      display: flex;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 16px;
    `,
    children: [],
  });

  const collection = collections.find((c) => c.cName === cName);
  collection.pNames.forEach((pName) => {
    cardHolder.children.push(
      collectionViewCard({
        href: `/#/paintings/${cName}/${pName}`,
        cName: cName,
        pName: pName,
      })
    );
  });

  const collectionView = div({
    children: [
      cardHolder,
      a({
        href: "/#/",
        class: css`
          display: block;
          margin-top: 10px;
          text-align: center;
          font-family: "Cutive Mono";
          font-size: 17px;

          text-decoration: none;
          color: #aaa;
          transition: color 0.333s ease-out;

          &:hover {
            color: #ddd;
          }
        `,
        children: ["↫ Home"],
      }),
    ],
  });

  return collectionView;
}

function collectionViewCard(opts: {
  href: string;
  cName: string;
  pName: string;
}) {
  const { width } =
    imageSizes[`images-small/paintings-${opts.cName}/${opts.pName}.jpg`];
  return a({
    href: opts.href,
    class: css`
      position: relative;
      min-width: 160px;
      min-height: 160px;

      box-shadow: 0px 3px 10px 0px #555;
      transition: box-shadow 0.333s ease-out;

      &:hover {
        box-shadow: 0px 3px 10px 0px #777;
      }
    `,
    style: {
      maxWidth: `${width}px`,
      flexGrow: `${width - 160}`,
    },
    children: [
      img({
        class: css`
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;

          filter: brightness(100%) contrast(100%) hue-rotate(0deg);
          transition: filter 0.5s ease-out;

          *:hover > & {
            filter: brightness(120%) contrast(100%) hue-rotate(360deg);
            transition: filter 1s ease-out;
          }
        `,
        src: `images-small/paintings-${opts.cName}/${opts.pName}.jpg`,
      }),
    ],
  });
}

export function paintingView(cName: string, pName: string): VirtualElement {
  return div({
    children: [
      img({
        class: css`
          display: block;
          max-width: 100%;
          max-height: calc(100vh - 110px);
          margin: auto;
        `,
        src: `images/paintings-${cName}/${pName}.jpg`,
      }),
      a({
        href: `/#/collections/${cName}`,
        class: css`
          display: block;
          margin-top: 10px;
          text-align: center;
          font-family: "Cutive Mono";
          font-size: 17px;

          text-decoration: none;
          color: #aaa;
          transition: color 0.333s ease-out;

          &:hover {
            color: #ddd;
          }
        `,
        children: [`↫ ${cName}`],
      }),
    ],
  });
}
