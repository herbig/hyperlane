#!/usr/bin/env npx ts-node --esm
import { Mailbox, MatchingListElement } from "./mailbox.js";
import { chains } from "./chains.js";
import { readFileSync } from 'fs';

const params = process.argv.slice(2);

const signingKey = params[1];
const infuraSecret = params[2];
const origin = Number(params[3]);

if (
    (params[0] !== 'dispatch' && params[0] !== 'search') || 
    signingKey === undefined || 
    infuraSecret === undefined || 
    isNaN(origin)) {

    console.log('Usage: {dispatch|search} {privateKey} {infuraKey} {chainId} {destinationId|searchList} {message|}');
} else if (params[0] === 'dispatch') {

    const mailbox = new Mailbox(signingKey, infuraSecret, chains[origin]);
    const destination = Number(params[4])
    const message = params[5];

    const destinationChain = chains[destination];

    // dispatch the message and wait for success
    await mailbox.dispatch(destinationChain, destinationChain.testRecipient, message);
} else if (params[0] === 'search') {

    const mailbox = new Mailbox(signingKey, infuraSecret, chains[origin]);

    // import matching criteria from json file
    const parsedJson: MatchingListElement[] = JSON.parse(readFileSync(params[4], 'utf-8'));
    
    // match it up
    await mailbox.queryDispatches(parsedJson);
}