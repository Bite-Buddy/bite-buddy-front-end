export interface IUser {
  id: number,
  supabase_id: string,
  email: string,
  kitchens: IKitchen[],
}

export interface IKitchen {
  id: number,
  name: string,
  users: IUser[],
  food_list: IFood[],
}

export interface IFoodRequest {
  id?: string,
  name?: string,
  bought_on?: Date,
  updated_on?: Date,
  inStock?: boolean,
}


export interface IFood {
  id: string,
  name: string,
  bought_on: Date,
  updated_on: Date,
  inStock: boolean,
}

export interface IInvite {
  id: number,
  kitchen_id: number,
  recipient_id: number
}