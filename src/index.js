import dataset from "../data/cards.json" with { type: "json" };

export const cards = Object.freeze(dataset.cards.map((card) => Object.freeze({ ...card })));

export function getCard(query) {
  if (typeof query !== "string" || query.trim() === "") return null;
  const normalized = query.trim().toLowerCase();
  return (
    cards.find(
      (card) =>
        card.id.toLowerCase() === normalized ||
        card.slug.toLowerCase() === normalized ||
        card.name.toLowerCase() === normalized
    ) ?? null
  );
}

export function createSeededRandom(seed) {
  const input = String(seed);
  let state = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    state ^= input.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawCards(count = 1, options = {}) {
  if (!Number.isInteger(count) || count < 1 || count > cards.length) {
    throw new RangeError(`count must be an integer between 1 and ${cards.length}`);
  }

  if (options.seed !== undefined && options.rng !== undefined) {
    throw new TypeError("Provide either seed or rng, not both");
  }

  const random = options.rng ?? (options.seed === undefined ? Math.random : createSeededRandom(options.seed));
  if (typeof random !== "function") throw new TypeError("rng must be a function");

  const deck = [...cards];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomValue = random();
    if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
      throw new RangeError("rng must return a finite number from 0 (inclusive) to 1 (exclusive)");
    }
    const swapIndex = Math.floor(randomValue * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }

  return deck.slice(0, count);
}

