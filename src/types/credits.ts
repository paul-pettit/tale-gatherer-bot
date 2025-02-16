
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  stripe_price_id: string;
  description?: string;
}
