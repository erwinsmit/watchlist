const { RESTDataSource } = require('apollo-datasource-rest');

class FilmsApi extends RESTDataSource {
    constructor() {
        super();
        this.baseUrl = 'https://api.themoviedb.org/3/';
    }

    willSendRequest(request) {
        request.params.set('api_key', process.env.API);
        request.params.set('language', 'en-US');
    }

    async getTrendingFilms() {
        return this.get(`${this.baseUrl}movie/now_playing?page=1`).then((response => this.setPosterPaths(response.results)));
    }

    async getFilmsBySearchTerm(searchTerm) {
        return this.get(`${this.baseUrl}search/movie?query=${searchTerm}&page=1'`).then((response => this.setPosterPaths(response.results)));
    }

    async getFilmById(id) {
        return this.get(`${this.baseUrl}movie/${id}`).then((response => this.setPosterPaths([response])[0]));
    }

    setPosterPaths(films) {

        if (films) {
            films.map(film => film.posterPath = "https://image.tmdb.org/t/p/w500" + film.poster_path)
        }
        return films;
    }
}

module.exports.FilmsApi = FilmsApi;