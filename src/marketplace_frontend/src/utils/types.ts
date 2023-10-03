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

export interface KYCRequest {
  id: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  about: string;
  email: string;
  organization: string;
  country: string;
  streetAdrees: string;
  city: string;
  province: string;
  zipCode: bigint;
  phoneNumber: bigint;
  profilePhoto: string;
  kycIDCopy: string;
  proofOfAddressCopy: string;
  status: string;
  dateCreated: bigint;
  isUpdated: boolean;
  isEmailVerified: boolean;
  membershipLevel: string;
  userWebsite: string;
  isFarmer: boolean;
  isBuyer: boolean;
  isStaff: boolean;
  pushNotification: {
    email: boolean;
    sms: boolean;
    everything: boolean;
  };
}
