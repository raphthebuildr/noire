declare module "@paystack/inline-js" {
  type Transaction = {
    id: number;
    reference: string;
    message: string;
  };

  type TransactionCallbacks = {
    onSuccess?: (transaction: Transaction) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
    onLoad?: (data: {
      id: number;
      customer: Record<string, unknown>;
      accessCode: string;
    }) => void;
  };

  type TransactionOptions = TransactionCallbacks & {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
    channels?: string[];
  };

  export default class PaystackPop {
    constructor();
    newTransaction(options: TransactionOptions): unknown;
    resumeTransaction(
      accessCode: string,
      callbacks?: TransactionCallbacks,
    ): unknown;
    cancelTransaction(): void;
  }
}
