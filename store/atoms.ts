import { atom } from 'jotai'

export const userAtom = atom({
  id: null,
  supabase_id: null,
  email: null
})
export const kitchensAtom = atom([])
export const currentKitchen = atom(null)