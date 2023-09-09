export interface IFood {
  id: string,
  name: string,
  bought_on: Date,
  updated_on: Date,
  inStock: boolean,
}

export interface IUser {
  id: string,
  supabase_id: string,
  email: string,
  kitchens: IFood[],
}