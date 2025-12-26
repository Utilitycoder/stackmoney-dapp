export type TransactionCardType = "amount" | "distributions" | "addresses";

export type FeatureCardImgType = "stream" | "airdrop" | "distribution";

export interface TransactionCardProps {
  type: TransactionCardType;
  amount: string | number;
  percentage?: number;
  title: string;
  isWalletConnected?: boolean;
}

export interface FeatureCardProps {
  title: string;
  linkText: string;
  description: string;
  link: string;
  imgType: FeatureCardImgType;
}

export interface ITransactionDataPoint {
  time: string;
  STX: number;
  sBTC: number;
  USD?: number;
}

