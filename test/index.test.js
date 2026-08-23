import assert from "node:assert/strict";
import test from "node:test";

import { cards, createSeededRandom, drawCards, getCard } from "../src/index.js";

test("exports a complete 78-card deck", () => {
  assert.equal(cards.length, 78);
  assert.equal(cards.filter((card) => card.arcana === "major").length, 22);
  assert.equal(cards.filter((card) => card.arcana === "minor").length, 56);
});

test("looks up cards by id, slug, and name", () => {
  assert.equal(getCard("major-00")?.name, "The Fool");
  assert.equal(getCard("ace-of-cups")?.id, "minor-cups-ace");
  assert.equal(getCard("KING OF SWORDS")?.slug, "king-of-swords");
  assert.equal(getCard("unknown-card"), null);
});

test("returns repeatable draws for a seed", () => {
  const first = drawCards(3, { seed: "tarotpro-example" }).map((card) => card.id);
  const second = drawCards(3, { seed: "tarotpro-example" }).map((card) => card.id);
  assert.deepEqual(first, second);
});

test("draws unique cards", () => {
  const drawn = drawCards(10, { seed: "unique-cards" });
  assert.equal(new Set(drawn.map((card) => card.id)).size, 10);
});

test("accepts a custom random-number generator", () => {
  const random = createSeededRandom("custom-rng");
  assert.equal(drawCards(2, { rng: random }).length, 2);
});

test("rejects invalid draw options", () => {
  assert.throws(() => drawCards(0), RangeError);
  assert.throws(() => drawCards(79), RangeError);
  assert.throws(() => drawCards(1.5), RangeError);
  assert.throws(() => drawCards(1, { seed: "a", rng: Math.random }), TypeError);
  assert.throws(() => drawCards(1, { rng: () => 1 }), RangeError);
});

