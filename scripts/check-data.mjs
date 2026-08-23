import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(await readFile(path.join(projectRoot, "data/cards.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(dataset.schemaVersion === "1.0.0", "Unexpected schema version");
assert(dataset.tradition === "Rider-Waite-Smith", "Unexpected tarot tradition");
assert(dataset.language === "en", "Unexpected dataset language");
assert(Array.isArray(dataset.cards), "cards must be an array");
assert(dataset.cardCount === 78, "cardCount must be 78");
assert(dataset.cards.length === 78, "Dataset must contain 78 cards");

const major = dataset.cards.filter((card) => card.arcana === "major");
const minor = dataset.cards.filter((card) => card.arcana === "minor");
assert(major.length === 22, "Dataset must contain 22 Major Arcana cards");
assert(minor.length === 56, "Dataset must contain 56 Minor Arcana cards");

for (const field of ["id", "slug", "name"]) {
  const values = dataset.cards.map((card) => card[field]);
  assert(values.every((value) => typeof value === "string" && value.length > 0), `${field} values must be non-empty strings`);
  assert(new Set(values).size === 78, `${field} values must be unique`);
}

for (const suit of ["wands", "cups", "swords", "pentacles"]) {
  assert(minor.filter((card) => card.suit === suit).length === 14, `${suit} must contain 14 cards`);
}

assert(
  major.every((card, index) => card.number === index && card.suit === null && card.rank === null),
  "Major Arcana numbering or null fields are invalid"
);

assert(
  minor.every(
    (card) =>
      typeof card.suit === "string" &&
      typeof card.rank === "string" &&
      Number.isInteger(card.number) &&
      card.number >= 1 &&
      card.number <= 14
  ),
  "Minor Arcana metadata is invalid"
);

console.log("Validated 78 cards: 22 Major Arcana and 56 Minor Arcana.");

