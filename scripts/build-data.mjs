import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const majorArcana = [
  [0, "The Fool"],
  [1, "The Magician"],
  [2, "The High Priestess"],
  [3, "The Empress"],
  [4, "The Emperor"],
  [5, "The Hierophant"],
  [6, "The Lovers"],
  [7, "The Chariot"],
  [8, "Strength"],
  [9, "The Hermit"],
  [10, "Wheel of Fortune"],
  [11, "Justice"],
  [12, "The Hanged Man"],
  [13, "Death"],
  [14, "Temperance"],
  [15, "The Devil"],
  [16, "The Tower"],
  [17, "The Star"],
  [18, "The Moon"],
  [19, "The Sun"],
  [20, "Judgement"],
  [21, "The World"]
];

const suits = ["wands", "cups", "swords", "pentacles"];
const ranks = [
  ["ace", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
  ["ten", 10],
  ["page", 11],
  ["knight", 12],
  ["queen", 13],
  ["king", 14]
];

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const cards = [
  ...majorArcana.map(([number, name]) => ({
    id: `major-${String(number).padStart(2, "0")}`,
    slug: slugify(name),
    name,
    arcana: "major",
    suit: null,
    rank: null,
    number
  })),
  ...suits.flatMap((suit) =>
    ranks.map(([rank, number]) => {
      const name = `${titleCase(rank)} of ${titleCase(suit)}`;
      return {
        id: `minor-${suit}-${rank}`,
        slug: slugify(name),
        name,
        arcana: "minor",
        suit,
        rank,
        number
      };
    })
  )
];

const dataset = {
  schemaVersion: "1.0.0",
  tradition: "Rider-Waite-Smith",
  language: "en",
  cardCount: cards.length,
  cards
};

const dataDirectory = path.join(projectRoot, "data");
await mkdir(dataDirectory, { recursive: true });
await writeFile(path.join(dataDirectory, "cards.json"), `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

