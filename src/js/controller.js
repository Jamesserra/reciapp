import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot) {
  module.hot.accept();
}

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
    resultsView.renderSpinner();
    //1) Get search query
    const query = searchView.getQuery();
    
    if(!query) return;
    //2) Load Search results
    await model.loadSearchResults(query);

    //3) Render results
    resultsView.render(model.getSearchResultsPage());

    //4) Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function(goToPage) {
  //1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4) Render NEW Pagination Buttons
  paginationView.render(model.state.search);
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination)
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', showRecipe)
