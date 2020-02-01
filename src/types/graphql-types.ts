

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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================