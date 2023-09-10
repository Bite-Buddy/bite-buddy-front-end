import { atom } from "jotai";
import { IFood, IKitchen, IUser } from "../interfaces";

export const userAtom = atom<IUser>({
  id: 0,
  supabase_id: "",
  email: "",
  kitchens: [],
})
export const kitchensAtom = atom<IKitchen[]>([])
export const currentKitchenAtom = atom<IKitchen | null>(null)
export const currentFoodListAtom = atom<IFood[]>([])