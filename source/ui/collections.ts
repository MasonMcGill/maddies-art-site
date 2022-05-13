export type ReadonlyCollection = {
  readonly name: string;
  readonly paintingNames: readonly string[];
};

export const collections: readonly ReadonlyCollection[] = [
  {
    name: "2022",
    paintingNames: ["bts", "lab-forest"],
  },
  {
    name: "2021",
    paintingNames: ["coney-island", "fishing", "heart-disruption", "hive-mind"],
  },
  {
    name: "2020",
    paintingNames: [
      "in-your-head",
      "apple",
      "black-lives-matter",
      "greed",
      "head-on-fire",
      "headspaces",
      "nicholas",
      "quarantine",
      "sharks",
      "standing-out",
      "tears",
    ],
  },
  {
    name: "2019",
    paintingNames: [
      "wet-tiger",
      "anyone-will-do",
      "day-night-poppies",
      "forever-fun",
    ],
  },
  {
    name: "2018",
    paintingNames: [
      "trickle-down",
      "boiling-pot",
      "circular-thinking",
      "eclipse",
      "fishfucker",
      "graveyard",
      "screaming-cats",
    ],
  },
  {
    name: "2017",
    paintingNames: ["city-man", "lichtenstein", "rich-man", "scary-cats"],
  },
  {
    name: "2016",
    paintingNames: ["political", "alcoholic"],
  },
  {
    name: "2015",
    paintingNames: ["big-lady", "in-the-park"],
  },
  {
    name: "2014",
    paintingNames: ["lady-and-the-tiger", "mirror-lady", "pigs", "still-life"],
  },
  {
    name: "2013",
    paintingNames: [
      "rabbits",
      "moving-forward",
      "seattle-interior",
      "sunflowers",
      "table",
    ],
  },
  {
    name: "2012",
    paintingNames: [
      "extinction-dream-1",
      "extinction-dream-2",
      "extinction-dream-3",
      "extinction-dream-4",
      "extinction-dream-5",
      "extinction-dream-6",
    ],
  },
];
