

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNewFilms
// ====================================================

export interface getNewFilms_films_watchListItem {
  filmId: string;
  id: string;
}

export interface getNewFilms_films {
  title: string;
  posterPath: string | null;
  id: string;
  watchListItem: getNewFilms_films_watchListItem | null;
}

export interface getNewFilms {
  films: (getNewFilms_films | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchFilms
// ====================================================

export interface searchFilms_searchFilms_watchListItem {
  filmId: string;
  id: string;
}

export interface searchFilms_searchFilms {
  title: string;
  posterPath: string | null;
  id: string;
  watchListItem: searchFilms_searchFilms_watchListItem | null;
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
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: watchList
// ====================================================

export interface watchList_watchListItems_film {
  title: string;
  posterPath: string | null;
  id: string;
}

export interface watchList_watchListItems {
  id: string;
  filmId: string;
  film: watchList_watchListItems_film | null;
}

export interface watchList {
  watchListItems: (watchList_watchListItems | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removeFilm
// ====================================================

export interface removeFilm_removeFilmFromWatchList {
  filmId: string;
}

export interface removeFilm {
  removeFilmFromWatchList: removeFilm_removeFilmFromWatchList | null;
}

export interface removeFilmVariables {
  filmId: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================