import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import App from './app/app';

// Créer des types Movie et MovieSearchResult utilisables dans toute l'application.✅
declare global {
  type MovieSearchResult = {
    Title:string,
    imdbID:string
    Year?:string,
    Type?:string,
    Poster?:string,
  }
  
  type Movie = {
    Title:string,
    imdbID:string,
    Year?:string,
    Rated?:string,
    Released?:string,
    Runtime?:string,
    Genre?:string,
    Director?:string,
    Writer?:string,
    Actors?:string,
    Plot?:string,
    Language?:string,
    Country?:string,
    Awards?:string,
    Poster?:string,
    Ratings?:{Source?:string,Value?:string}[],
    Metascore?:string,
    imdbRating?:string,
    imdbVotes?:string,
    Type?:string,
    DVD?:string,
    BoxOffice?:string,
    Production?:string,
    Website?:string,
    Response?:string,
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
