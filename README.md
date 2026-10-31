# Grand Tour Tycoon

A live property-trading board game for 2–8 players that runs in the browser. No accounts, no server.

**Play:** https://libyan11.github.io/grand-tour-tycoon/

## How it works

- The player who creates a game is the host. Their browser runs the game, so they keep the tab open while playing.
- Friends join with the invite link, QR code or 4-letter room code. Browsers find each other through the free public [PeerJS](https://peerjs.com/) service, then send moves directly to each other.
- If the host reloads, the game is restored from their browser's storage and friends reconnect automatically.
- Pass-and-play on one device works offline.

The whole game is one file: `index.html`.
