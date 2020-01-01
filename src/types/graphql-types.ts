

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNewFilms
// ====================================================

export interface getNewFilms_films {
  title: string;
  posterPath: string | null;
  id: string;
}

export interface getNewFilms {
  films: (getNewFilms_films | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchFilms
// ====================================================

export interface searchFilms_searchFilms {
  title: string;
  posterPath: string | null;
  id: string;
}

export interface searchFilms {
  searchFilms: (searchFilms_searchFilms | null)[] | null;
}

export interface searchFilmsVariables {
  searchTerm: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addFilm
// ====================================================

export interface addFilm_addFilmToWatchList {
  filmId: string;
}

export interface addFilm {
  addFilmToWatchList: addFilm_addFilmToWatchList | null;
}

export interface addFilmVariables {
  filmId: string;
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: watchList
// ====================================================

export interface watchList_watchListItems_movieInfo {
  id: string;
  posterPath: string | null;
  title: string;
}

export interface watchList_watchListItems {
  filmId: string;
  id: string;
  movieInfo: watchList_watchListItems_movieInfo | null;
}

export interface watchList {
  watchListItems: (watchList_watchListItems | null)[] | null;
}

export interface watchListVariables {
  userId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================