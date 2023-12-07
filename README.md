# Hyperlane Demo

This project demonstrates dispatching and querying messages between blockchains using [Hyperlane](https://www.hyperlane.xyz/).

## Installation

Install packages using

```
npm install
```

Run by executing index.js, e.g.

```
./index.js
```

Alternatively, you can install the utility globally via

```
npm install -g
```

After which you can simply use the global command `hyperlane`.

## Usage

This utility has two modes, `dispatch`, to send messages, and `search` to query them.

To dispatch a message, use the command:

```
hyperlane dispatch {signingKey} {infuraApiKey} {originChain} {destinationChain} {message}
```

To query messages, use:

```
hyperlane search {signingKey} {infuraApiKey} {originChain} {matchingCriteria}
```

Where `matchingCriteria` is a .json file with a list of [MatchingListElements](https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/465112db6fddb3b598d6da39c13491ff1bc7e700/typescript/infra/src/config/agent/relayer.ts#L19).

The results of the query will be written to the `output.txt` file.

## Supported Chains and Future Changes

For demo purposes, a few testnets have been added as supported chains, in the chains.ts file.  This includes goerli, sepolia, base-goerli, and arbitrum-goerli, although other chains can easily be added in the future.

Additionally, messaging is done only between Hyperlane's deployed test recipients, although the application could be altered to allow for messaging arbitrary recipients in the future.