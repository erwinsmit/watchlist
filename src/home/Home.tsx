import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { debounce } from 'lodash';
import { gql } from 'apollo-boost';
import { Typography, Box, Grid, Card, CardMedia, CardContent, Button, CardActions, TextField, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { getNewFilms, searchFilms, addFilm } from '../types/graphql-types';
import { FirebaseContext } from '../authentication/firebase';

const newFilmsQuery = gql`
   query getNewFilms {
		films {
			title,
			posterPath,
			id,
			watchListItem {
				filmId,
				id
			}
		}
	}
`;

const searchFilmsQuery = gql`
	query searchFilms($searchTerm: String!) {
		searchFilms(searchTerm: $searchTerm) {
			title,
			posterPath,
			id,
			watchListItem {
				filmId,
				id
			}
		}
	}
`;

const addToWatchList = gql`
	mutation addFilm($filmId: String!) {
		addFilmToWatchList(filmId: $filmId){
  		filmId
	}
}
`;


export const Home: React.FC = () => {
	const { loading, error, data, refetch } = useQuery<getNewFilms>(newFilmsQuery);
	const firebaseContext = useContext(FirebaseContext);
	const [filmSearchValue, setFilmSearchValue] = useState('');

	const [searchForFilms, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery<searchFilms>(searchFilmsQuery);
	const [addFilmToWatchListMutation] = useMutation<addFilm>(addToWatchList);

	const searchDebounced = useCallback(debounce((term: any) => {
		searchForFilms({ variables: { searchTerm: term } });
	}, 500, { trailing: true, leading: false }), []);

	useEffect(() => {
		if (firebaseContext.user) {
			refetch();
		}
	}, [firebaseContext]);
	
	const films = filmSearchValue ? searchData?.searchFilms : data?.films;

	useEffect(() => {
		if (filmSearchValue) {
			searchDebounced(filmSearchValue);
		}
	}, [filmSearchValue])

	function handleAddToWatchList(filmId: string) {
		if (firebaseContext.user) {
			addFilmToWatchListMutation(
				{
					variables: {
						filmId: filmId
					},
					update(cache) {
						// check if I can update cache here directly instead of refetching
						refetch();
					}
				}
			);
		}
	}

	return (
		<Box paddingY={4}>
			<Box paddingBottom={4}>
				<form noValidate>
					<TextField
						id="film-search"
						label="Search"
						variant="outlined"
						value={filmSearchValue}
						onChange={(event) => setFilmSearchValue(event.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search />
								</InputAdornment>
							),
						}}
					/>
				</form>
			</Box>

			{filmSearchValue ?
				<Typography variant="h2" gutterBottom>Results for "{filmSearchValue}"</Typography>
				:
				<Typography variant="h2" gutterBottom>Trending</Typography>
			}

			{loading || searchLoading &&
				<>Loading...</>
			}

			{error &&
				<>{error.message}</>
			}

			{searchError &&
				<>{searchError.message}</>
			}

			{films &&
				<Grid container spacing={2}>
					{films.map((film) => {
						if (!film) {
							return;
						}

						return (
							<Grid item xs={3} key={film.id as string}>
								<Card>
									{film.posterPath &&
										<CardMedia
											component="img"
											alt={film.title ? film.title : ''}
											image={film.posterPath}
										/>
									}
									<CardContent>
										<Typography gutterBottom variant="h5">{film.title}</Typography>
									</CardContent>
									<CardActions>
										{firebaseContext.user && !film.watchListItem?.id &&
											<Button size="small" color="primary" onClick={() => handleAddToWatchList(film.id)}>
												Add to watchlist
											</Button>
										}
										{firebaseContext.user && film.watchListItem?.id &&
											<Button size="small" color="primary">
												On your watchlist
											</Button>
										}
										<Button size="small" color="primary">
											Learn More
										</Button>
									</CardActions>
								</Card>
							</Grid>
						)
					})}
				</Grid>
			}
		</Box>
	)
}