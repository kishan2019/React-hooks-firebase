import React, { useReducer,useState, useEffect, useCallback } from 'react';

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
  //const [userIngredient, setUserIngrediant] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filterIngredientHandler = useCallback(filterIngredients => {
    // setUserIngrediant(filterIngredients);
    dispatch({type: 'SET', ingredients: filterIngredients });
  }, []);

  // useEffect(() => {
  //   fetch('https://react-hooks-update-459d5.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredient = [];
  //       for (let key in responseData) {
  //         loadedIngredient.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       //setUserIngrediant(loadedIngredient);
  //       dispatch({type: 'SET', ingredients: loadedIngredient });
  //     });
  // }, []);

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-update-459d5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      // setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'})
      return response.json();
    }).then(responseData => {
      // setUserIngrediant(prevIngredient => [
      //   ...prevIngredient,
      //   { id: responseData.name, ...ingredient }
      //]);
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
        // setUserIngrediant(prevIngredients =>
          // prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
       // );
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
