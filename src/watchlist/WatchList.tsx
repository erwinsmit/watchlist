import React, { useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { watchList } from '../types/graphql-types';
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

export const WatchList: React.FC = () => {
    const firebaseContext = useContext(FirebaseContext);
    const [getWatchListItems, { loading, error, data }] = useLazyQuery<watchList>(watchListQuery);

    useEffect(() => {
        if (firebaseContext.user) {
            getWatchListItems({ variables: { userId: firebaseContext.user.uid } });
        }
    }, [firebaseContext]);

    const watchListItems = data?.watchListItems;

    return (
        <div>
            {firebaseContext && firebaseContext.user &&
                firebaseContext.user.displayName
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
                                        <Button size="small" color="primary">
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