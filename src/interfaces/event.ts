export interface Events {
    _id: string
    event_type: string
    customer: string
    user: string
    from_date: string
    to_date: string
    processed: string
    status: number
  }

  export interface Noti {
    _id: string
    event_type: string
    customer: string
    user: string
    create_date: string
    is_read: number
  }