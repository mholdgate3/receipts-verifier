# Receipts verifier

This repository holds the Receipts verifier and the keys Receipts publishes. Receipts turns public predictions into checkable track records: it anchors each record on Intuition's chain and scores the caller against a stated baseline. The verifier is how you check a record without taking Receipts' word for anything.

It lives here, apart from Receipts' own site, so that you never have to run a copy Receipts serves you, and so that the list of keys has a public history Receipts can't quietly rewrite.

## Using the verifier

Open it at https://mholdgate3.github.io/receipts-verifier/, or download `index.html` and open your own copy. `node serve.mjs` serves a local copy at `http://127.0.0.1:4173/`, since browsers restrict some pages opened straight from a file.

Paste in a receipt's bundle, a settlement's, a checkpoint's, or a caller's whole export, from any Receipts record page. The verifier:

- hashes the record again and folds its Merkle proof to the batch root;
- reads the anchor transaction from Intuition's chain itself, through a public RPC you can change at the top of the file;
- says "verifies" only when the anchor's sender is one of the keys below, on the chain it is listed for, within its dates;
- checks the post's text, photos and author against any copy of the post you give it;
- works a settlement's outcome and baseline out again from the data the settlement holds, and a caller's whole score from their export.

It is one file with no dependencies. It never calls Receipts' servers, and it shows everything it is given as text, never as a page.

## The published keys

`attestors.json` lists every key Receipts has published. `anchor` keys send the transactions that anchor records. `graph` keys write Receipts' triples on Intuition's graph. They are separate keys.

Each entry is:

- `chainId`: the chain the key counts on. A key counts only there, so pointing the verifier at a node for another chain never makes an anchor there count. Only Intuition mainnet, chain 1155, is ever listed. Testnet keys are never published.
- `address`: the key's address.
- `from`: when the key came into use.
- `until`: when it stopped, or `null` for a key still in use.

The `anchor` list is the same list the verifier carries inside `index.html`, as `ANCHOR_ATTESTORS`.

Entries are only ever added. A key's entry is never removed or changed, except that a key in use is given an `until` date when it is retired. So a retired key, or one that was stolen and then retired, can't count for anything after its date, and everything it signed before then still checks. Every change is a commit in this repository's history.

## Releases

`releases.json` lists each release: its number, when it was made, and the SHA-256 of each file in it. Each release is also a tag, `release-<number>`. To check the copy you have:

```bash
node check.mjs
```

It checks that `attestors.json` lists the same anchor keys the verifier carries, and that each file's SHA-256 matches the newest release. With no tools at all, `sha256sum index.html` (or `shasum -a 256 index.html`) gives the figure to compare.

## Keeping the history

A GitHub ruleset stops anyone force-pushing to or deleting `main` and the release tags. The repository's owner could still remove that rule, so the copies that matter are the ones outside GitHub. Each release's page and its files at the release tag are saved to the Wayback Machine, which dates each copy itself, and any clone keeps the history it fetched. If this repository's history ever disagrees with those copies, the copies are the record.

## Where this comes from

The verifier is developed in Receipts' own repository, which is private. There its core runs in the server's test suite, against the server's own code, so the two agree on every hash. Each release here is a copy of a version that passed those tests. Nothing in this repository is built or minified: what you read is what runs.

## Licence

MIT. See `LICENSE`.
