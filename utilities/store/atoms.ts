import { atom } from "jotai";
import { IFood, IKitchen, IUser, IInvite } from "../interfaces";

export const userAtom = atom<IUser>({
  id: 0,
  supabase_id: "",
  email: "",
  kitchens: [],
  invites: [],
})
export const kitchensAtom = atom<IKitchen[]>([])
export const currentKitchenAtom = atom<IKitchen | null>(null)
export const currentFoodListAtom = atom<IFood[]>([])
export const currentFoodItemAtom = atom<IFood | null>(null)
export const invitesAtom = atom<IInvite[]>([])
export const currentInviteAtom = atom<IInvite | null>(null)
