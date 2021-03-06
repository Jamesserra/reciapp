import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn--inline');
        if (!btn) return;
  
        const goToPage = +btn.dataset.goto;
        handler(goToPage);
      });
    }

    _generateMarkup() {
      const curPage = this._data.page;
      const numPages = Math.ceil(
        this._data.results.length / this._data.resultsPerPage
      );

      //Page 1 and there are other pages
        if(curPage === 1 && numPages > 1) {
          return this._generateMarkupNextButton(curPage + 1)
        }
        
        //Last Page
        if(curPage === numPages && numPages > 1) {
          return this._generateMarkupPrevButton(curPage - 1)
        }
        
        //Other Page
        if(curPage < numPages) {
          return `
            ${this._generateMarkupPrevButton(curPage - 1)}, ${this._generateMarkupNextButton(curPage + 1)}
            `
        }

        //Page 1 and there are NO other pages
        return '';
    }; 

    _generateMarkupNextButton(pg) { 
      return `
      <button data-goto="${pg}" class="btn--inline pagination__btn--next">
          <span>Page ${pg}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>`
    }

    _generateMarkupPrevButton(pg) { 
      return `
        <button data-goto="${pg}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${pg}</span>
        </button>`
    }
}

export default new PaginationView();
