import { AbiCoder, Contract, JsonRpcProvider, Provider, TransactionReceipt, Wallet, ethers } from "ethers";
import { Chain } from "./chains";

export class Mailbox {
    
    private chain: Chain;
    private wallet: Wallet;
    private provider: Provider;
    private contract: Contract;
    private infuraKey: string;

    private abi = [
        'function quoteDispatch(uint32 destinationDomain, bytes32 recipientAddress, bytes calldata messageBody) external view returns (uint256 fee)',
        'function dispatch(uint32 destinationDomain, bytes32 recipientAddress, bytes calldata messageBody) external payable returns (bytes32 messageId)',
        'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)',
        'event Process(uint32 indexed origin, bytes32 indexed sender, address indexed recipient)',
    ];

    constructor(signingKey: string, infuraKey: string, chain: Chain) {
        this.infuraKey = infuraKey;
        this.chain = chain;
        this.provider = new JsonRpcProvider(this.rpc(chain.infuraName), chain.id);
        this.wallet = new Wallet(signingKey, this.provider);
        this.contract = new Contract(chain.mailBox, this.abi, this.wallet);
    }

    private rpc(chainName: string): string {
        return `https://${chainName}.infura.io/v3/${this.infuraKey}`;
    }

    async dispatch(destination: Chain, recipientAddress: string, message: string) {
        
        const encodedString = new AbiCoder().encode(['string'], [message]);

        // get the dispatch cost
        let fee: number;
        await this.contract.quoteDispatch(destination.id.toString(), recipientAddress, encodedString).then(value => {
            fee = value;
        }, _ => {
            throw Error('quoteDispatch call failed');
        });

        // dispatch the message
        const dispatch = await this.contract.dispatch(destination.id.toString(), recipientAddress, encodedString, { value: fee });
        const approveReceipt: TransactionReceipt = await dispatch.wait();
        if (approveReceipt.status === 0) throw new Error('dispatch call failed');

        // wait on the receiving end for confirmation that it has been processed
        const destSigner = new Wallet(this.wallet.privateKey, new JsonRpcProvider(this.rpc(destination.infuraName), destination.id));
        const destMailbox = new Contract(destination.mailBox, this.abi, destSigner);

        // filter events to only our dispatch
        const eventFilter = destMailbox.filters.Process(this.chain.id, ethers.zeroPadValue(this.wallet.address, 32), ethers.stripZerosLeft(recipientAddress));
        await destMailbox.once(eventFilter, async () => {
            // TODO message id seems kind of annoying to get at or reconstruct clientside, but
            // would be better to link directly to the message here
            console.log('Success! ' + `https://explorer.hyperlane.xyz/?search=${this.wallet.address}`)
        });
    }

    async queryDispatches(matchingList: MatchingListElement[]) {

        const currentBlock = await this.provider.getBlockNumber();

        for (const element of matchingList) {
            const eventFilter: Record<string, any> = {};
        
            // skip those in the matchingList that aren't for our chain
            if (element.originDomain !== '*' &&
                element.originDomain !== this.chain.id &&
                (Array.isArray(element.originDomain) && !element.originDomain.includes(this.chain.id))) 
                continue;
        
            eventFilter.sender = element.senderAddress;
            eventFilter.destination = element.destinationDomain;
            eventFilter.recipient = element.recipientAddress;
        
            const logs = await this.contract.queryFilter(
                this.contract.filters.Dispatch(...Object.values(eventFilter)),
                currentBlock - 1000000, // last million blocks
                'latest'
            );
  
            console.log('----------------------------');
            console.log('Matching Criteria:', element);
            console.log('----------------------------');
            logs.forEach((log: any) => {
                const parsedLog = this.contract.interface.parseLog(log);
                console.log('Parsed Log:', parsedLog);
            });
        }
    }
}

export interface MatchingListElement {
  originDomain?: '*' | number | number[];
  senderAddress?: '*' | string | string[];
  destinationDomain?: '*' | number | number[];
  recipientAddress?: '*' | string | string[];
}