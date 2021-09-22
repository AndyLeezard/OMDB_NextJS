import React, { useState, useEffect, ChangeEvent } from 'react'
import { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';

// custom components
import { DetailFetchStatus, FetchStatus, Omdb, SearchParameters } from './Omdb';
import { updateMovies, updateStatus, updateError, setMovieDetail, toggleDetailWindow, setDetailStatus } from '../../features/movies/movieSlice';

// Material-UI design components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Results from './Results';
import Hidden from '@material-ui/core/Hidden';

// référence sur la restriction de l'âge (signalétique jeunesse) du film
import { useStyles_header } from '../styles/material_ui_styles';

// search type parameters
enum types{
    NULL='', // : no type (default)
    MOVIE='movie',
    EPISODE='episode',
    SERIES='series',
    GAME='game',
    ANY='any' // : no type
}

const MainComponent: React.FC = ():JSX.Element => {
    const classes = useStyles_header();
    const state = useSelector((state: RootState) => state)
    const dispatch = useDispatch()

    //classe Omdb qui fait office de service pour appeller l'API avec la fonction de recherche et de récupération de film
    const [searcher, unused] = useState<Omdb>(new Omdb(()=>statusListener()));

    // paramètres de recherche
    const [type, setType] = useState<types>(types.NULL);
    const [title, setTitle] = useState<string>('');
    const [year, setYear] = useState<string>('');

    // l'état du petit popup qui permet de préciser le type (film, série, etc...)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl); 
    
    useEffect(() => {
        // Dev only
        console.log("Redux state snapshot : ",state, "at : ", new Date().toLocaleString());
    }, [state])

    const statusListener = ():void => {
        console.log('Searcher updated : ',searcher, "at : ", new Date().toLocaleString());
        if(searcher.search_status){
          state.movies.movies!==searcher.movies && dispatch(updateMovies(searcher.movies));
          state.movies.details.movie!==searcher.movie && dispatch(setMovieDetail(searcher.movie));
          state.movies.status!==searcher.search_status && dispatch(updateStatus(searcher.search_status));
        }else{
          dispatch(updateError('Uncaught Error at stack : Omdb.tsx - status undefined.'));
        }
        searcher.get_status && dispatch(setDetailStatus(searcher.get_status));
        searcher.msg_error && dispatch(updateError(searcher.msg_error));
    }

    const parseParameter = ():SearchParameters => {
        /**
          * cette fonction transforme les mots clés en objet paramètres de la recherche
         */
        return {
          title:title.trim().toLowerCase(),
          type:type.toString().trim(),
          year:year
        };
    }

    const trigger_search = ():void => {
      /**
       * la classe Omdb détecte automatiquement s'il s'agit d'une nouvelle recherche ou bien il s'agit d'une demande pour charger plus de pages.
       * toutefois, si nécessaire, la classe Omdb a une fonction intégrée "loadMore" pour les cas strictes tels que le bouton "charger plus".
       */
      if(title.trim().length<1){
        dispatch(updateError("The title keyword is required"));
        dispatch(updateStatus(FetchStatus.ERROR));
        return;
      }
      let parameters = parseParameter();
      (searcher.cache.lastParameters === parameters) ?
        dispatch(updateStatus(FetchStatus.LOADING_MORE))
        :
        dispatch(updateStatus(FetchStatus.LOADING));
      searcher.searchMovies(parameters);
    }

    const trigger_open_detail = (imdbID:string):void => {
      /**
       * enregistrement de l'état d'ouverture de la fenêtre des détails et le full data du film via Redux
       */
        dispatch(setDetailStatus(DetailFetchStatus.LOADING));
        dispatch(toggleDetailWindow(true));
        searcher.getMovie(imdbID);
    }

    const trigger_load_more = ():void => {
      dispatch(updateStatus(FetchStatus.LOADING_MORE))
      searcher.loadMore();
    }

    const handleTypeMenuOpen = (event: React.MouseEvent<HTMLElement>):void => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = ():void => {
        setAnchorEl(null);
    };

    const updateType = (input:types):void => {
        setType(input);
        handleMenuClose();
    }

    const titleHandler = (e: ChangeEvent<HTMLInputElement>):void => {
        let val = e.target.value;
        (val.substring(val.length-2) !== '  ') && setTitle(val.trimLeft());
        // preventing double spaces and trimming both sides
        // ce processus permet d'éviter certaines erreurs en amont
    }

    const yearHandler = (e: ChangeEvent<HTMLInputElement>):void => {
        setYear(e.target.value.replace(/\D/g,''));
        // seuls les nombres sont acceptables
    }

    const menuId = 'menu-types';
    const renderTypeMenu:JSX.Element = (
        <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        >
          <MenuItem onClick={()=>updateType(types.MOVIE)} style={{textTransform: 'capitalize'}}>{types.MOVIE.toString()}</MenuItem>
          <MenuItem onClick={()=>updateType(types.SERIES)} style={{textTransform: 'capitalize'}}>{types.SERIES.toString()}</MenuItem>
          <MenuItem onClick={()=>updateType(types.EPISODE)} style={{textTransform: 'capitalize'}}>{types.EPISODE.toString()}</MenuItem>
          <MenuItem onClick={()=>updateType(types.GAME)} style={{textTransform: 'capitalize'}}>{types.GAME.toString()}</MenuItem>
          <MenuItem onClick={()=>updateType(types.NULL)} style={{textTransform: 'capitalize'}}>{types.ANY.toString()}</MenuItem>
        </Menu>
    );

    const typeSelector:JSX.Element = (
        <div className={classes.search}>
            <IconButton
                edge="end"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleTypeMenuOpen}
                color="inherit"
            >
                <MenuIcon />
                {(type === types.NULL) ? (
                    <span className={classes.typeinput}>Type</span>
                ):(
                    <span className={classes.typeinput_active} style={{textTransform:'capitalize'}}>{type.toString()}</span>
                )}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={()=>setType(types.NULL)}
            >
              <ClearIcon />
            </IconButton>
        </div>
    )

    const titleInput:JSX.Element = (
      <div className={classes.search}>
          <InputBase
            placeholder="Title"
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            onKeyPress={(event) => {
              if(event.key === 'Enter'){
                trigger_search();
              }
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={titleHandler}
            value={title}
          />
          <IconButton
              color="inherit"
              onClick={()=>setTitle('')}
          >
            <ClearIcon />
          </IconButton>
      </div>
    )

    const yearInput:JSX.Element = (
      <div className={classes.search}>
          <InputBase
            placeholder="Year"
            type="number"
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            onKeyPress={(event) => {
              if(event.key === 'Enter'){
                console.log('enter key was pressed');
                trigger_search();
              }
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={yearHandler}
            value={year}
          />
          <IconButton
              color="inherit"
              onClick={()=>setYear('')}
          >
            <ClearIcon />
          </IconButton>
      </div>
    )

    const searchButton:JSX.Element = (
      <div className={classes.searchIcon}>
          <IconButton
              edge="end"
              aria-controls={menuId}
              onClick={trigger_search}
              color="inherit"
          >
              <SearchIcon />
          </IconButton>
      </div>
    )

    const header_standard:JSX.Element = (
      <Hidden mdDown>
        <div className={classes.grow_standard}>
          <AppBar position="static" className={classes.appbar}>
              <Toolbar className={classes.toolbar}>
              <Typography className={classes.title} variant="h6" noWrap>
                  OMDb API
              </Typography>
                {typeSelector}
                {titleInput}
                {yearInput}
                {searchButton}
              </Toolbar>
          </AppBar>
        </div>
      </Hidden>
    )

    const header_mobile:JSX.Element = (
      <Hidden lgUp>
        <div className={classes.grow_mobile}>
          <AppBar position="static" className={classes.appbar_mobile}>
              <Toolbar className={classes.toolbar}>
                {titleInput}
              </Toolbar>
              <Toolbar className={classes.toolbar}>
                <div className={classes.typeSelector_mobile}>
                  {typeSelector}
                </div>
                <div className={classes.yearInput_mobile}>
                  {yearInput}
                </div>
              </Toolbar>
              <div className={classes.button_mobile} onClick={trigger_search}>
                <SearchIcon />
              </div>
          </AppBar>
        </div>
      </Hidden>
    )

    return (
        <div className='mainComponent'>
          {header_standard}
          {header_mobile}
          {renderTypeMenu}
          <Results callback_open_detail={(id:string)=>trigger_open_detail(id)} callback_load_more={()=>trigger_load_more()}/>
        </div>
    )
}

export default MainComponent;
