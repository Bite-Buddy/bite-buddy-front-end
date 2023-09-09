import { atom } from "jotai";
import { IUser } from "../interfaces";

export const userAtom = atom<IUser | null>({
  id: "",
  supabase_id: "",
  email: "",
  kitchens: [],
})
export const kitchensAtom = atom([])
export const currentKitchen = atom(null)