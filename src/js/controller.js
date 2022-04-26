import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

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

    //0) Result view to mark selected result
    resultsView.update(model.getSearchResultsPage())

    bookmarksView.update(model.state.bookmarks);

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

const controlServings = function(newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the view
  //recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function() {
  //1 Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  //2 Update receipe view
  recipeView.update(model.state.recipe);

  //3 Render bookmark
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  // console.log(newRecipe);
  try {
    recipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  } catch(err) {
    console.log('Error 🤣');
    addRecipeView.renderError(err.message)
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', showRecipe)
