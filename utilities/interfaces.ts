export interface IUser {
  id: string,
  supabase_id: string,
  email: string,
  kitchens: IKitchen[],
}

export interface IKitchen {
  kitchen_id: string,
  user_id: string,
  name: string,
  food_list: IFood[],
}

export interface IFood {
  id: string,
  name: string,
  bought_on: Date,
  updated_on: Date,
  inStock: boolean,
}
