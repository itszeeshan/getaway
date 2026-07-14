# Getaway 🃏

A real-time multiplayer card game (also known as *Thulla* / *Bhabhi*) for 2–4 players, with an illustrated look, anime-style characters, and per-character signature card decks.

Built with Next.js, Socket.IO, Tailwind CSS, and Framer Motion.

Pick a character, hit **New Game**, and share the room code (or invite link) with friends.

## Rules

**Goal:** get rid of all your cards. The last player still holding cards loses — everyone else "gets away".

1. **Setup** — the full deck is dealt evenly to all players. Whoever holds the **Ace of Spades** must lead it to start the first trick.
2. **Follow suit** — play moves clockwise. You must play a card of the suit that was led if you have one.
3. **Winning a trick** — the highest card of the lead suit wins the trick. If everyone followed suit, the cards are discarded and the winner leads the next trick.
4. **Dumping (the twist)** — if you can't follow suit, you may throw **any** card. Once the trick finishes, whoever holds the highest card of the lead suit picks up **every card on the table** — including their own. Getting stuck with the high card is dangerous!
5. **Getting away** — play your last card and you're safe... unless a dump lands the pile back in your hands before the trick ends.
6. **Game over** — when only one player has cards left, they're caught. First player out is crowned the winner.

## Characters

Each character comes with their own signature card deck in their colors, so you always know whose cards are on the table.
