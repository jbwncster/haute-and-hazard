# Digital rules coverage and playtest notes

The complete web app uses the v7.9 card and Stage records in `digital-playtest/data.js` and the current turn sequence:

**Transformation → Reveal → Shopping → Slay / Dragdagulan† / Pass → Cleanup**

It supports 2–5 local hot-seat players and Solo Circuit v0.2. Solo setup includes all four difficulties, a House Queen, one Personality, and Beginner or Full Stage Rules. Android users can install the responsive PWA from a supported browser; it is not a native Play Store build.

## Automated in the app

- The 12-card starter decks, 5-card opening hands, shared 5-card Rack, Thrift supply, and Stage deck.
- Tips from cards played from hand, card purchases to the Archive, Rack refill, and turn cleanup.
- Coordinate slots, Appeal, matching Tenets, Perfect Illusion, listed Stage bonuses, and Stage scoring.
- Curtain Call, the 30 Gross SP / empty Stage Deck end trigger, final Penalty values, and listed tiebreak order.
- Solo House Stage checks, four-round timer, the House Automa's printed Rack removal rules, difficulty modifiers, Personality choices, and supported Automa effects.
- Dragdagulan† card draws, printed Lip Sync values, and the Stage 8 / Stage 12 modifiers.

## Guided manual resolution

Card text is shown on every card. The app automatically handles common printed gains and draws. When an effect needs a player choice, an opponent choice, or a card movement the digital rules cannot infer, it opens a guided resolution prompt. Record net Tips, Appeal, and Gross SP there, and make any card movement in the visible zones when applicable. This keeps the paper card text authoritative during playtests.

The digital implementation is a playtest host, not a complete automated adjudicator. In particular, complicated multi-step card effects, penalties that require a physical card choice, and rare House tie situations should be checked against the current rulebook. A House tied with a player after every published tiebreak remains unresolved in Solo Circuit v0.2 and is flagged on the final screen.

## Verification

Run the source-level smoke checks from the repository root:

```bash
node digital-complete/smoke-test.cjs
```

These checks exercise canonical data counts, a two-player Curtain Call and end trigger, solo timer and House Always Wins scoring, and Perfect Illusion. They do not replace a real browser / Android install test or a Tabletop Simulator in-app test.
