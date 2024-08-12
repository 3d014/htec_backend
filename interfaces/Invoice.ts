export interface ProductSum{
    productId:string,
    productName:string,
    productSum:number
}

export interface InvoiceInstance {
    invoiceId: string;
    vendorId: string;
    invoiceNumber: string;
    dateOfIssue: Date;
    dateOfPayment: Date;
    totalValueWithoutPdv: number;
    totalValueWithPdv: number;
    pdvValue: number;
  }

  export interface InvoiceItemInstance {
    invoiceItemId: string;
    invoiceId: string;
    quantity: number;
    priceWithoutPdv: number;
    priceWithPdv: number;
    sumWithoutPdv: number;
    sumWithPdv: number;
    discount: number;
    productId: string;
    productCode: string;
  }
  