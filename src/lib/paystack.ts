const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const paystack = {
  /**
   * Initializes a transaction with Paystack.
   * @param email Customer's email
   * @param amount Amount in NGN (will be converted to kobo)
   * @param reference Unique transaction reference
   * @param callbackUrl URL to redirect to after payment
   * @returns The checkout authorization URL
   */
  async initializePayment(
    email: string,
    amount: number,
    reference: string,
    callbackUrl: string
  ): Promise<string> {
    if (!PAYSTACK_SECRET_KEY) {
      // For local development without Paystack, we can simulate it by just returning the callback URL directly
      console.warn("PAYSTACK_SECRET_KEY is missing. Simulating payment initialization.");
      return `${callbackUrl}?trxref=${reference}&reference=${reference}`;
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url: callbackUrl,
        currency: "NGN",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to initialize Paystack payment");
    }

    return data.data.authorization_url;
  },

  /**
   * Verifies a transaction with Paystack.
   * @param reference The transaction reference to verify
   * @returns Boolean indicating if the payment was successful
   */
  async verifyPayment(reference: string): Promise<boolean> {
    if (!PAYSTACK_SECRET_KEY) {
      console.warn("PAYSTACK_SECRET_KEY is missing. Simulating payment verification success.");
      return true; // Simulate success in dev mode without keys
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to verify Paystack payment");
    }

    return data.data.status === "success";
  },
};
