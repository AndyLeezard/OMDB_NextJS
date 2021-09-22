import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus, DetailFetchStatus } from '../../app/components/Omdb';

type ErrorMessage = string | Error

export interface MovieState {
  movies:MovieSearchResult[],
  status:FetchStatus,
  msg_error?:ErrorMessage,
  details:{
    status:DetailFetchStatus,
    open:boolean,
    movie:Movie
  }
}

const initialState: MovieState = {movies:[],status:FetchStatus.INIT,details:{status:DetailFetchStatus.LOADING,open:false,movie:{Title:'',imdbID:''}}};

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    updateMovies: (state, action: PayloadAction<MovieSearchResult[]>) => {
      state.movies = action.payload;
      state.status = FetchStatus.OK;
    },
    updateStatus: (state, action: PayloadAction<FetchStatus>) => {
      state.status = action.payload;
    },
    updateError: (state, action: PayloadAction<ErrorMessage>) => {
      state.msg_error = action.payload;
    },
    setMovieDetail: (state, action: PayloadAction<Movie>) => {
      state.details.movie = action.payload;
    },
    toggleDetailWindow: (state, action: PayloadAction<boolean>) => {
      state.details.open = action.payload;
    },
    setDetailStatus: (state, action: PayloadAction<DetailFetchStatus>) => {
      state.details.status = action.payload;
    }
  },
})

export const { updateMovies, updateStatus, updateError, setMovieDetail, toggleDetailWindow, setDetailStatus } = movieSlice.actions

export default movieSlice.reducer