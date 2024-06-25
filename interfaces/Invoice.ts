export interface ProductSum{
    productId:number,
    productName:string,
    productSum:number

}

export interface InvoiceInstance {
    invoiceId: string;
    vendorId: number;
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
    productId: number;
    productCode: string;
  }
  