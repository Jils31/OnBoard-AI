
import { Polar } from "@polar-sh/sdk";

export class PolarService {
  private polar: Polar;

  constructor(accessToken: string) {
    this.polar = new Polar({ accessToken });
  }

  async createCheckout(productId: string) {
    try {
      const checkout = await this.polar.checkouts.create({
        products: [productId]
      });
      return checkout.url;
    } catch (error) {
      console.error("Polar checkout error:", error);
      throw error;
    }
  }
}

export const polarService = new PolarService(
  import.meta.env.VITE_POLAR_ACCESS_TOKEN || ""
);
