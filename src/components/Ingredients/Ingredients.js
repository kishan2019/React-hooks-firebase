import React, { useState, useEffect,useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredient, setUserIngrediant] = useState([]);

  const filterIngredientHandler = useCallback(filterIngredients => {
    setUserIngrediant(filterIngredients);
  },[]);

  useEffect(() => {
    fetch('https://react-hooks-update-459d5.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredient = [];
      for(let key in responseData){
        loadedIngredient.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      setUserIngrediant(loadedIngredient);
    });
  }, []);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-459d5.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngrediant(prevIngredient => [
      ...prevIngredient,
      { id: responseData.name, ...ingredient }
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    fetch(`https://react-hooks-update-459d5.firebaseio.com/ingredients/${ingredientId}.json`,{
      method: 'DELETE'
    })
    .then(response => {
      setUserIngrediant(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        <IngredientList ingredients={userIngredient} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
 
};

export default Ingredients;
