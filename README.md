# TarotPro Tarot Data

A lightweight, structured 78-card tarot dataset and deterministic draw utility maintained by [TarotPro](https://tarotpro.ai/).

The repository is intentionally small: it provides stable card identifiers and basic deck taxonomy for prototypes, examples, and automated tests. It does not contain TarotPro's editorial card interpretations, prompts, user data, product source code, or artwork.

## Included

- All 78 Rider-Waite-Smith card names
- Stable IDs and URL-friendly slugs
- Major and Minor Arcana classification
- Suit, rank, and number metadata
- Lookup by ID, slug, or English name
- Random and deterministic seeded draws without duplicate cards
- Dataset integrity checks and zero-dependency tests

## Data shape

```json
{
  "id": "minor-cups-ace",
  "slug": "ace-of-cups",
  "name": "Ace of Cups",
  "arcana": "minor",
  "suit": "cups",
  "rank": "ace",
  "number": 1
}
```

The full dataset is available at [`data/cards.json`](data/cards.json).

## Usage

```js
import { cards, drawCards, getCard } from "./src/index.js";

console.log(cards.length); // 78
console.log(getCard("the-fool"));

const reading = drawCards(3, { seed: "tarotpro-example" });
console.log(reading.map((card) => card.name));
```

The `seed` option is intended for repeatable examples and automated tests. Omit it for a normal `Math.random()` draw. Neither mode is intended for cryptographic or security-sensitive use.

## Verify the project

Requires Node.js 20.10 or later.

```bash
npm run verify
```

This regenerates the canonical JSON file, validates the 78-card deck structure, and runs the utility tests.

## Live TarotPro experience

Use the data in a browser-based experience with the [TarotPro Tarot Card Generator](https://tarotpro.ai/tarot-card-generator).

## Scope and safety

This project contains general tarot deck metadata for software development, education, entertainment, and self-reflection. It does not provide medical, legal, financial, mental-health, or other professional advice.

## License

MIT. See [LICENSE](LICENSE).

