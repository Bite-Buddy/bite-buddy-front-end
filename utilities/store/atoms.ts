import { atom } from "jotai";
import { IUser } from "../interfaces";

export const userAtom = atom<IUser>({
  id: "",
  supabase_id: "",
  email: "",
  kitchens: [],
})
export const kitchensAtom = atom([])
export const currentKitchen = atom(null)