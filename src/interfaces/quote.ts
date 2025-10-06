export interface Quote {
    _id: string
    customer: string
    customerId: string
    create_date: string
    amount: number
    text_amount: string
    quote_details: QuoteDetail[]
  }
  
  export interface QuoteDetail {
    _id: string
    product: string
    price: number
    unit: string
    total: number
    description: string
  }
  