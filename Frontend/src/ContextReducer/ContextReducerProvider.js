import React, { createContext, useContext, useReducer } from 'react'

const cartcontext=createContext();
const Dispatchcotext=createContext();

const reducer=(state,action)=>{
   switch(action.type){
    case 'ADD':
      return [...state,{id:action.id,name:action.name,price:action.price,quantity:action.quantity,size:action.size}]
    case 'REMOVE':
      const newArray=[...state];
      newArray.splice(action.index,1);
      return newArray;
    case 'UPDATE':
      const updateArray = state.map(food =>{
          if(food.id === action.id){
            return {
              ...food,
              quantity:parseInt( action.quantity ) + parseInt(food.quantity),
              price: action.price + food.price
            }
          }
          return food;
      });
      return updateArray;
    case "DROP":
      return [];
    default:
   }
}
export const ContextReducerProvider = ({children}) => {
   const [state,dispatch]=useReducer(reducer,[]);
    return (
     <Dispatchcotext.Provider value={dispatch}>
       <cartcontext.Provider value={state}>
         {children}
       </cartcontext.Provider>
     </Dispatchcotext.Provider>
  )
}

export const useCart=()=> useContext(cartcontext);
export const useDispatch=()=> useContext(Dispatchcotext);
