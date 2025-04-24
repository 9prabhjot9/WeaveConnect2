interface ArConnectWallet {
  connect: (permissions: string[]) => Promise<void>;
  disconnect: () => Promise<void>;
  getActiveAddress: () => Promise<string>;
  sign: (transaction: any) => Promise<any>;
  switch: (walletName: string) => Promise<void>;
  name?: string;
  walletName?: string;
  getWalletNames?: () => Promise<string[]>;
  getPermissions?: () => Promise<string[]>;
  getArweaveConfig?: () => Promise<any>;
}

declare global {
  interface Window {
    arweaveWallet?: ArConnectWallet;
  }
}

export {}; 