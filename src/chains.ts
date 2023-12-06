export type Chain = {
    id: number;
    infuraName: string;
    mailBox: string;
    testRecipient: string;
}

export const chains: Record<number, Chain> = {
    5: {
        id: 5,
        infuraName: "goerli",
        mailBox: "0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932",
        testRecipient: "0x0000000000000000000000004fC0Ac163eFFEb7890937cB89275B2C231880F22"
    },
    11155111: {
        id: 11155111,
        infuraName: "sepolia",
        mailBox: "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766",
        testRecipient: "0x000000000000000000000000eDc1A3EDf87187085A3ABb7A9a65E1e7aE370C07"
    },
    84531: {
        id: 84531,
        infuraName: "base-goerli",
        mailBox: "0x58483b754Abb1E8947BE63d6b95DF75b8249543A",
        testRecipient: "0x00000000000000000000000054Bd02f0f20677e9846F8E9FdB1Abc7315C49C38"
    },
    421613: {
        id: 421613,
        infuraName: "arbitrum-goerli",
        mailBox: "0x13dABc0351407d5aAa0A50003a166A73b4febfDc",
        testRecipient: "0x00000000000000000000000007543860AE9E72aBcF2Bae9827b23621A64Fa416"
    },
};