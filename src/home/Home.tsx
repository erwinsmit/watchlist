import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { getNewFilms, searchFilms } from '../types/graphql-types';
import { Typography, Box, Grid, Card, CardMedia, CardContent, Button, CardActions, TextField, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

const newFilmsQuery = gql`
   query getNewFilms {
        films {
            title,
            posterPath,
            id
        }
    }
`;

const searchFilmsQuery = gql`
    query searchFilms($searchTerm: String!) {
        searchFilms(searchTerm: $searchTerm) {
            title,
            posterPath,
            id
        }
    }
`;

export const Home: React.FC = () => {
    const { loading, error, data } = useQuery<getNewFilms>(newFilmsQuery);

    const [ filmSearchValue, setFilmSearchValue ] = useState('');

    const [searchForFilms, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery<searchFilms>(searchFilmsQuery);
    
    const films = filmSearchValue ? searchData?.searchFilms : data?.films;

    useEffect(() => {
        if (filmSearchValue) {
            searchForFilms({ variables: { searchTerm: filmSearchValue } });
        }
    }, [filmSearchValue])

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
                                        <Button size="small" color="primary">
                                        Add to watchlist
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
        </Box>
    )
}