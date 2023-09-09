import { Reducer } from "react";

interface IMutualState {
    user: {
        id: string,
        supabase_id: string,
        email: string,
        currentkitchenId: string
    },
    kitchens: string[]
}

type TAction =
    | { type: 'changeUser'; newUser: IMutualState['user'] }
    | { type: 'changeKitchens'; newKitchens: string[] }
    | { type: 'addKitchen'; newKitchen: string };

const reducer: Reducer<IMutualState, TAction> = (state, action) => {
    switch (action.type) {
        case 'changeUser':
            return {
                ...state,
                user: action.newUser
            };
        case 'changeKitchens':
            return {
                ...state,
                kitchens: action.newKitchens
            };
        case 'addKitchen':
            return {
                ...state,
                kitchens: [...state.kitchens, action.newKitchen]
            };

        default:
            return state;
    }
};

export { reducer, IMutualState, TAction };