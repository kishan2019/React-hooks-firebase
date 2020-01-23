import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredient, action) => {
  switch(action.type){
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error("IT SHOULD NEVER REACH");

  }
}

const httpReducer = (currhttpState, action) => {
  switch(action.type){
    case 'SEND':
      return {loading: true, error: null}; 
    case 'RESPONSE':
     return {...currhttpState, loading: false};
    case 'ERROR':
     return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...currhttpState, error: null}
    default: 
      throw new Error('should not be reached.');    
  }
}

const Ingredients = () => {
  const [userIngredient, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
 
  const filterIngredientHandler = useCallback(filterIngredients => {
    dispatch({type: 'SET', ingredients: filterIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-update-459d5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      return response.json();
    }).then(responseData => {
      dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
    });
  };

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-hooks-update-459d5.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        dispatchHttp({type: 'RESPONSE'})
       dispatch({type: 'DELETE', id: ingredientId})
      })
      .catch(error => {
        dispatchHttp({type: 'ERROR', errorMessage: error.message})
      });
  };

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        <IngredientList ingredients={userIngredient} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );

};

export default Ingredients;
