export interface Quote {
    _id: string
    customer: string
    customerId: string
    create_date: string
    user: string
    amount: number
    text_amount: string
    items: QuoteDetail[],
    invoiceNumber: string,
  }
  
  export interface QuoteDetail {
    _id: string
    product: string
    price: number
    unit: string
    quantity: number
    total: number
    description: string
  }