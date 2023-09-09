import React, {createContext, useContext, useReducer} from 'react';

interface IKitchen {
  name: string,
  id: number
}

interface IUser {
  id: number | null,
  supabase_id: string | null,
  email: string | null
}

interface IState {
  user: IUser,
  kitchens: IKitchen[],
  setUser: Function,
  setKitchens: Function,
  addKitchen: Function
}

const initialState: IState = {
  kitchens: [],
  user: {
    id: null,
    supabase_id: null,
    email: null
  },
  setUser: () => {
    console.log('init')
  },
  setKitchens: () => {},
  addKitchen: () => {}
}

export const StateContext = createContext(initialState);

const reducer = (state, action) => {
  console.log('REDUCE', state, action)
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.payload
      };
    case 'setKitchens':
      return {
        ...state,
        kitchens: action.payload
      };
    case 'addKitchen':
      return {
        ...state,
        kitchens: [...state.kitchens, action.payload]
      };

    default:
      return state;
  }
};



export const StateProvider = ({ children }) =>{
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log('use reducer', state)

  const setUser = (user: IUser) => {
    console.log('the good one', user)
    dispatch({
      type: 'setUser',
      payload: user
    })
  }

  const setKitchens = (kitchens: IKitchen[]) => {
    dispatch({
      type: 'setKitchens',
      payload: kitchens
    })
  }

  const addKitchen = (kitchen: IKitchen) => {
    dispatch({
      type: 'addKitchen',
      payload: kitchen
    })
  }

  const value = {
    user: state.user,
    kitchens: state.kitchens,
    setUser,
    setKitchens,
    addKitchen
  }

  return (  
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  )
};

export const useStateValue = () => useContext(StateContext);