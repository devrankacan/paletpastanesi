import Iyzipay from "iyzipay";

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function getClient(): Iyzipay {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY ?? "",
    secretKey: process.env.IYZICO_SECRET_KEY ?? "",
    uri:
      process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
  });
}

export type CheckoutBasketItem = {
  id: string;
  name: string;
  category: string;
  price: number; // TL, kuruş değil (iyzico ondalıklı TL bekler)
};

export type CheckoutBuyer = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  ip: string;
};

type InitializeParams = {
  conversationId: string;
  basketId: string;
  totalPriceTl: number;
  callbackUrl: string;
  buyer: CheckoutBuyer;
  items: CheckoutBasketItem[];
};

export type CheckoutInitializeResult = {
  status: string;
  token: string;
  checkoutFormContent: string;
};

export function initializeCheckoutForm(
  params: InitializeParams,
): Promise<CheckoutInitializeResult> {
  const client = getClient();
  const price = params.totalPriceTl.toFixed(2);

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: params.conversationId,
    price,
    paidPrice: price,
    currency: Iyzipay.CURRENCY.TRY,
    basketId: params.basketId,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: params.callbackUrl,
    buyer: {
      id: params.buyer.id,
      name: params.buyer.name,
      surname: params.buyer.surname,
      email: params.buyer.email,
      gsmNumber: params.buyer.phone,
      identityNumber: "11111111111",
      registrationAddress: params.buyer.address,
      ip: params.buyer.ip,
      city: params.buyer.city,
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${params.buyer.name} ${params.buyer.surname}`,
      city: params.buyer.city,
      country: "Turkey",
      address: params.buyer.address,
    },
    billingAddress: {
      contactName: `${params.buyer.name} ${params.buyer.surname}`,
      city: params.buyer.city,
      country: "Turkey",
      address: params.buyer.address,
    },
    basketItems: params.items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: item.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: item.price.toFixed(2),
    })),
  };

  return new Promise((resolve, reject) => {
    client.checkoutFormInitialize.create(
      // @ts-expect-error - iyzico checkout form init doesn't require paymentCard/installments
      request,
      (err, result) => {
        if (err) return reject(err);
        resolve(result as unknown as CheckoutInitializeResult);
      },
    );
  });
}

export type CheckoutRetrieveResult = {
  status: string;
  paymentStatus: string;
  paymentId: string;
  basketId: string;
  price: number | string;
  paidPrice: number | string;
};

export function retrieveCheckoutForm(
  token: string,
): Promise<CheckoutRetrieveResult> {
  const client = getClient();

  return new Promise((resolve, reject) => {
    client.checkoutForm.retrieve({ token }, (err, result) => {
      if (err) return reject(err);
      resolve(result as unknown as CheckoutRetrieveResult);
    });
  });
}
