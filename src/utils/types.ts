export interface Result {
  err?: any;
  ok?: any;
}

export interface NewsLetterSubscription {
  id: string;
  email: string;
  isVerified: boolean;
  created: bigint;
}

