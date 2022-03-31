import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return

    recipeView.renderSpinner();
    
    //1) Load Recipe
    await model.loadRecipe(id)

    //2) Rending Recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function() {
  try {
    //1) Get search query
    const query = searchView.getQuery();
    
    if(!query) return;
    //2) Load Search results
    await model.loadSearchResults(query);

    //3) Render results
    console.log(model.state.search.results)
  } catch (err) {
    console.log(err)
  }
};

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', showRecipe)
