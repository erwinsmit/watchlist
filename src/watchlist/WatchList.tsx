import React, { useContext, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { watchList, removeFilm } from '../types/graphql-types';
import { FirebaseContext } from '../authentication/firebase';
import { Grid, Card, CardMedia, CardContent, Button, Typography, CardActions } from '@material-ui/core';

export const watchListQuery = gql`
    query watchList {
        watchListItems {
            id,
            filmId,
            film {
              title,
              posterPath,
              id
            }
        }
    }
`;


const removeFromWatchList = gql`
	mutation removeFilm($filmId: String!) {
		removeFilmFromWatchList(filmId: $filmId){
  		filmId
	}
}
`;

export const WatchList: React.FC = () => {
    const firebaseContext = useContext(FirebaseContext);
    const [getWatchListItems, { loading, error, data, refetch }] = useLazyQuery<watchList>(watchListQuery);

    const [removeFilmFromWatchListMutation, { loading: removeFilmLoading, error: removeFilmError }] = useMutation<removeFilm>(removeFromWatchList);
    
    useEffect(() => {
        if (firebaseContext.user) {
            getWatchListItems({ variables: { userId: firebaseContext.user.uid } });
        }
    }, [firebaseContext]);

    const watchListItems = data?.watchListItems;

    function handleRemove(filmId: string) {
		if (firebaseContext.user) {
			removeFilmFromWatchListMutation(
				{
					variables: {
						filmId: filmId
					},
					update(cache) {
                        refetch();
						// check if I can update cache here directly instead of refetching
						
					}
				}
			);
		}
	}


    return (
        <div>
            {firebaseContext && firebaseContext.user &&
                firebaseContext.user.displayName
            }

            {loading &&
                <>Loading...</>
            }

            {watchListItems && 
                <Grid container spacing={2}>
                    {watchListItems.map((watchListItem) => {
                        const film = watchListItem?.film;

                        if (!film || !watchListItem) {
                            return;
                        }
                        
                        return (
                            <Grid item xs={3} key={watchListItem.id}>
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
                                        <Button size="small" color="primary" onClick={() => handleRemove(film.id)}>
                                            Remove
                                        </Button>
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
        </div>
    )
}