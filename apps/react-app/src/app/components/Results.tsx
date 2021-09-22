import React, { useState } from 'react'
import { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';

// custom components
import { DetailFetchStatus, FetchStatus, MoviePropTitles, MoviePropIconColors } from './Omdb';
import { toggleDetailWindow } from '../../features/movies/movieSlice';

// Material-UI design components
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import MovieFilterOutlinedIcon from '@material-ui/icons/MovieFilterOutlined';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import StarIcon from '@material-ui/icons/Star';
import LocalPlayIcon from '@material-ui/icons/LocalPlay';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TheatersIcon from '@material-ui/icons/Theaters';
import TimerIcon from '@material-ui/icons/Timer';
import VideocamIcon from '@material-ui/icons/Videocam';
import CreateIcon from '@material-ui/icons/Create';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BusinessIcon from '@material-ui/icons/Business';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TranslateIcon from '@material-ui/icons/Translate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Hidden from '@material-ui/core/Hidden';

// customized material-UI style sheet
import { useStyles_results, themeColor } from '../styles/material_ui_styles';

// référence sur la restriction de l'âge (signalétique jeunesse) du film
const ref_rated_age = "https://en.wikipedia.org/wiki/Motion_Picture_Association_film_rating_system#:~:text=Rated%20G%3A%20General%20audiences%20%E2%80%93%20All,accompanying%20parent%20or%20adult%20guardian.";

const Img_placeholder = '../../assets/images/Img_placeholder.jpg';

interface Props {
    callback_open_detail:{(id:string):void},
    callback_load_more:{():void}
}

const Results: React.FC<Props> = (props: Props):JSX.Element => {
    const classes = useStyles_results();
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state);

    // helps the user know that there is no more pages to load
    const [dialogue_page_is_full,set_dialogue_page_is_full] = useState<boolean>(false);

    const toggle_details = (status:boolean):void => {
        /**
         * @param {boolean} status - paramètre pour ouvrir ou fermer l'état de la fenêtre via Redux.
         */
        dispatch(toggleDetailWindow(status));
    };

    const selectMovie = (imdbID:string):void => {
        /**
         * @param {string} imdbID - paramètre permettant de récupérer les détails du film.
         */
        props.callback_open_detail(imdbID);
        toggle_details(true);
    }

    //L'état initial
    const init:JSX.Element = (
        <>
            <MovieFilterOutlinedIcon className={classes.icon}/>
            <p className={classes.text_large}>Seach for your movies!</p>
        </>
    )

    const loadingIcon:JSX.Element = (
        <CircularProgress className={classes.icon} />
    )

    // Message d'erreur géré par Redux, si aucun message n'est disponible, cela renvoie à une erreur (exception) du type "uncaught".
    const error:JSX.Element = (
        <>
            <ErrorOutlineOutlinedIcon className={classes.icon} />
            {typeof state.movies.msg_error === 'string' ? (
                <p className={classes.text_large}>{state.movies.msg_error}</p>
            ):(
                <p className={classes.text_large}>Uncaught error</p>
            )}
        </>
    )

    const searchResultStatusSelector = ():JSX.Element => {
        switch(state.movies.status){
            case FetchStatus.LOADING:
                return (
                    <div className={classes.listWrapper}>
                        {loadingIcon}
                    </div>
                );
            case FetchStatus.ERROR:
                return (
                    <div className={classes.listWrapper}>
                        {error}
                    </div>
                );
            case FetchStatus.INIT:
                return (
                    <div className={classes.listWrapper}>
                        {init}
                    </div>
                );
            default:
                return list;
        }
    }

    const isValidData = (input:string|undefined):boolean => {
        /**
         * @param {(string|undefined)} input - returns true if the value is a string type and has a value that is not equal to "N/A".
         */
        return (input!=="N/A")&&input!==''&&typeof input === 'string';
    }

    interface Dialog_DetailProps {
        onClose: () => void;
    }

    const indent = (input:string,size:number):string => {
        /**
         * @param {string} input - le texte avant lequel l'on souhaite mettre un alinéa
         * @param {number} size - la taille de l'alinéa
         */
        return String.fromCharCode(160).repeat(size) + input;
    }
    
    const Dialog_Detail: React.FC<Dialog_DetailProps> = (props: Dialog_DetailProps) => {
        const { onClose } = props;

        if(state.movies.details.status === DetailFetchStatus.ERROR){
            return(
                <Dialog fullWidth maxWidth={'md'} onClose={onClose} open={state.movies.details.open}>
                    <div className={classes.statusWrapper}>
                        {error}
                    </div>
                </Dialog>
            )
        }

        if(!state.movies.details.movie || !state.movies.details.open || state.movies.details.status === DetailFetchStatus.LOADING){
            return (
                <Dialog fullWidth maxWidth={'md'} onClose={onClose} open={state.movies.details.open}>
                    <div className={classes.statusWrapper}>
                        {loadingIcon}
                    </div>
                </Dialog>
            )
        }

        const renderMovieProp = (title:string,elements:string[],searchable:boolean):JSX.Element => {
            /**
             * @param {string} title - title of the detail movie prop to display.
             * @param {string[]} elements - elements of the detail movie prop to display.
             * @param {boolean} searchable - if true, elements will be wrapped inside an "a" tag as a link for the google search API.
             */
            return(
                <>
                    {title && 
                        <span className={classes.text_medium_Title}>{title}:</span>
                    }
                    <div className={classes.movieProps_inline}>
                        {searchable ? (
                            elements.map((value,index:number)=>{
                                return (
                                    <>
                                        {(index!==0) && <span className={classes.text_medium}>{String.fromCharCode(160)}</span>}
                                        <a className={classes.wrappinglink_hover} key={index} href={`https://www.google.com/search?q=${value.replace(/ /g,'+')}`} target="_blank" rel="noopener noreferrer">
                                            <span className={classes.text_medium} style={{color: '#1E1420',textTransform: 'capitalize'}}>{value}</span>
                                        </a>
                                        {(index<elements.length-1) && <span className={classes.text_medium}>,</span>}
                                    </>
                            )})
                        ):(
                            elements.map((value,index:number)=>{
                                return (
                                    <>
                                        {(index!==0) && <span className={classes.text_medium}>{String.fromCharCode(160)}</span>}
                                        <span key={index} className={classes.text_medium} style={{textTransform: 'capitalize'}}>{value}</span>
                                        {(index<elements.length-1) && <span className={classes.text_medium}>,</span>}
                                    </>
                            )})
                        )}
                    </div>
                </>
            )
        }

        const moviePlot:JSX.Element = (
            <div className={classes.plotContainer}>
                {isValidData(state.movies.details.movie.Plot) ? (
                    <p className={classes.text_medium}>
                        {indent(state.movies.details.movie.Plot,4)}
                    </p>
                ):(
                    <div className={classes.wrapper}>
                        <p className={classes.text_medium}>
                            Plot unavailable
                        </p>
                    </div>
                )}
            </div>
        )

        const moviePoster:JSX.Element = (
            <a className={classes.wrappinglink} href={isValidData(state.movies.details.movie.imdbID) ? (`https://www.imdb.com/title/${state.movies.details.movie.imdbID}`):(`https://www.imdb.com/find?q=${state.movies.details.movie.Title.replace(/ /g, '+')}`)} target="_blank" rel="noopener noreferrer">
                {isValidData(state.movies.details.movie.Poster) ? (
                    <img className={classes.poster} src={state.movies.details.movie.Poster} alt="poster"/>
                ):(
                    <img className={classes.poster} src={Img_placeholder} alt="poster"/>
                )}
            </a>
        )

        const movieProps_standard:JSX.Element = (
            <>
                <div className={classes.movieProps}>
                    <TheatersIcon className={classes.propIcon} style={{fill: MoviePropIconColors.GENRE}}/>
                    {state.movies.details.movie.Type && 
                        <span className={classes.text_medium_Title}>
                            {MoviePropTitles.GENRE}:
                        </span>
                    }
                    <div className={classes.movieProps_inline}>
                        {state.movies.details.movie.Type && 
                            <span className={classes.text_medium} style={{textTransform: 'capitalize'}}>
                                {state.movies.details.movie.Type}
                            </span>
                        }
                        {isValidData(state.movies.details.movie.Rated) && (
                            <a className={classes.link} href={ref_rated_age} target="_blank" rel="noopener noreferrer">
                            <span>{`[${state.movies.details.movie.Rated}]`}</span>
                            <ContactSupportIcon className={classes.helpIcon}/>
                            </a>
                        )}
                        {isValidData(state.movies.details.movie.Genre) && <span className={classes.text_medium}>{` (${state.movies.details.movie.Genre})`}</span>}
                    </div>
                </div>
                {isValidData(state.movies.details.movie.imdbRating) && 
                    <div className={classes.movieProps}>
                        <StarIcon className={classes.propIcon} style={{fill: MoviePropIconColors.IMDB_RATING}}/>
                        {renderMovieProp(MoviePropTitles.IMDB_RATING,[state.movies.details.movie.imdbRating],false)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Awards) && 
                    <div className={classes.movieProps}>
                        <LocalPlayIcon className={classes.propIcon} style={{fill: MoviePropIconColors.AWARDS}}/>
                        {renderMovieProp(MoviePropTitles.AWARDS,[state.movies.details.movie.Awards],false)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Runtime) && 
                    <div className={classes.movieProps}>
                        <TimerIcon className={classes.propIcon} style={{fill: MoviePropIconColors.RUNTIME}}/>
                        {renderMovieProp(MoviePropTitles.RUNTIME,[state.movies.details.movie.Runtime],false)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Released) && 
                    <div className={classes.movieProps}>
                        <AssignmentTurnedInIcon className={classes.propIcon} style={{fill: MoviePropIconColors.RELEASE_DATE}}/>
                        {renderMovieProp(MoviePropTitles.RELEASE_DATE,[state.movies.details.movie.Released],false)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Director) && 
                    <div className={classes.movieProps}>
                        <VideocamIcon className={classes.propIcon} style={{fill: MoviePropIconColors.DIRECTOR}}/>
                        {renderMovieProp(MoviePropTitles.DIRECTOR,state.movies.details.movie.Director.split(','),true)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Writer) && 
                    <div className={classes.movieProps}>
                        <CreateIcon className={classes.propIcon} style={{fill: MoviePropIconColors.WRITER}}/>
                        {renderMovieProp(MoviePropTitles.WRITER,state.movies.details.movie.Writer.split(','),true)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Production) && 
                    <div className={classes.movieProps}>
                        <BusinessIcon className={classes.propIcon} style={{fill: MoviePropIconColors.PRODUCTION}}/>
                        {renderMovieProp(MoviePropTitles.PRODUCTION,state.movies.details.movie.Production.split(','),true)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Actors) && 
                    <div className={classes.movieProps}>
                        <RecentActorsIcon className={classes.propIcon} style={{fill: MoviePropIconColors.ACTORS}}/>
                        {renderMovieProp(MoviePropTitles.ACTORS,state.movies.details.movie.Actors.split(','),true)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Country) && 
                    <div className={classes.movieProps}>
                        <LocationOnIcon className={classes.propIcon} style={{fill: MoviePropIconColors.COUNTRY}}/>
                        {renderMovieProp(MoviePropTitles.COUNTRY,state.movies.details.movie.Country.split(','),false)}
                    </div>
                }
                {isValidData(state.movies.details.movie.Language) && 
                    <div className={classes.movieProps}>
                        <TranslateIcon className={classes.propIcon} style={{fill: MoviePropIconColors.LANGUAGE}}/>
                        {renderMovieProp(MoviePropTitles.LANGUAGE,state.movies.details.movie.Language.split(','),false)}
                    </div>
                }
            </>
        )

        const renderContent_standard:JSX.Element = (
            <>
                <div className={classes.detailContainer}>
                    <div className={classes.detailBox}>
                        {moviePoster}
                        <div className={classes.moviePropsContainer_standard}>
                            {movieProps_standard}
                        </div>
                    </div>
                    {moviePlot}
                </div>
            </>
        )

        const movieProps_mobile:JSX.Element = (
            <>
                <div className={classes.movieProps}>
                    <TheatersIcon className={classes.propIcon} style={{fill: MoviePropIconColors.GENRE}}/>
                    {state.movies.details.movie.Type && 
                        <span className={classes.text_medium_Title}>
                            {MoviePropTitles.GENRE}
                        </span>
                    }
                </div>
                <div className={classes.movieProps}>
                    <div className={classes.movieProps_inline}>
                        {state.movies.details.movie.Type && 
                            <span className={classes.text_medium} style={{textTransform: 'capitalize'}}>
                                {state.movies.details.movie.Type}
                            </span>
                        }
                        {isValidData(state.movies.details.movie.Rated) && (
                            <a className={classes.link} href={ref_rated_age} target="_blank" rel="noopener noreferrer">
                            <span>{`[${state.movies.details.movie.Rated}]`}</span>
                            <ContactSupportIcon className={classes.helpIcon}/>
                            </a>
                        )}
                        {isValidData(state.movies.details.movie.Genre) && <span className={classes.text_medium}>{` (${state.movies.details.movie.Genre})`}</span>}
                    </div>
                </div>
                {isValidData(state.movies.details.movie.imdbRating) && 
                    <>
                        <div className={classes.movieProps}>
                            <StarIcon className={classes.propIcon} style={{fill: MoviePropIconColors.IMDB_RATING}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.IMDB_RATING}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',[state.movies.details.movie.imdbRating],false)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Awards) && 
                    <>
                        <div className={classes.movieProps}>
                            <LocalPlayIcon className={classes.propIcon} style={{fill: MoviePropIconColors.AWARDS}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.AWARDS}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',[state.movies.details.movie.Awards],false)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Runtime) && 
                    <>
                        <div className={classes.movieProps}>
                            <TimerIcon className={classes.propIcon} style={{fill: MoviePropIconColors.RUNTIME}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.RUNTIME}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',[state.movies.details.movie.Runtime],false)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Released) && 
                    <>
                        <div className={classes.movieProps}>
                            <AssignmentTurnedInIcon className={classes.propIcon} style={{fill: MoviePropIconColors.RELEASE_DATE}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.RELEASE_DATE}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',[state.movies.details.movie.Released],false)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Director) && 
                    <>
                        <div className={classes.movieProps}>
                            <VideocamIcon className={classes.propIcon} style={{fill: MoviePropIconColors.DIRECTOR}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.DIRECTOR}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Director.split(','),true)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Writer) && 
                    <>
                        <div className={classes.movieProps}>
                            <CreateIcon className={classes.propIcon} style={{fill: MoviePropIconColors.WRITER}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.WRITER}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Writer.split(','),true)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Production) && 
                    <>
                        <div className={classes.movieProps}>
                            <BusinessIcon className={classes.propIcon} style={{fill: MoviePropIconColors.PRODUCTION}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.PRODUCTION}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Production.split(','),true)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Actors) && 
                    <>
                        <div className={classes.movieProps}>
                            <RecentActorsIcon className={classes.propIcon} style={{fill: MoviePropIconColors.ACTORS}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.ACTORS}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Actors.split(','),true)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Country) && 
                    <>
                        <div className={classes.movieProps}>
                            <LocationOnIcon className={classes.propIcon} style={{fill: MoviePropIconColors.COUNTRY}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.COUNTRY}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Country.split(','),false)}
                        </div>
                    </>
                }
                {isValidData(state.movies.details.movie.Language) && 
                    <>
                        <div className={classes.movieProps}>
                            <TranslateIcon className={classes.propIcon} style={{fill: MoviePropIconColors.LANGUAGE}}/>
                            <span className={classes.text_medium_Title}>
                                {MoviePropTitles.LANGUAGE}
                            </span>
                        </div>
                        <div className={classes.movieProps}>
                            {renderMovieProp('',state.movies.details.movie.Language.split(','),false)}
                        </div>
                    </>
                }
            </>
        )

        const renderContent_mobile:JSX.Element = (
            <>
                <IconButton
                    color="inherit"
                    onClick={()=>toggle_details(false)}
                    className={classes.exitIconButton}
                >
                    <ClearIcon className={classes.exitIcon}/>
                </IconButton>
                <div className={classes.detailContainer}>
                    {moviePoster}
                    <div className={classes.moviePropsContainer_mobile}>
                        <Hidden smDown>
                            {movieProps_standard}
                        </Hidden>
                        <Hidden mdUp>
                            {movieProps_mobile}
                        </Hidden>
                    </div>
                    {moviePlot}
                </div>
            </>
        )
    
        return (
            <Dialog fullWidth maxWidth={'md'} onClose={onClose} open={state.movies.details.open}>
                <DialogTitle className={classes.text_title}>{state.movies.details.movie.Title!}{state.movies.details.movie.Year && ` (${state.movies.details.movie.Year})`}</DialogTitle>
                <Hidden mdDown>
                    {renderContent_standard}
                </Hidden>
                <Hidden lgUp>
                    {renderContent_mobile}
                </Hidden>
            </Dialog>
        );
    }

    const list:JSX.Element = (
        <List className={classes.root} disablePadding>
            {state.movies.movies && state.movies.movies.map((content:MovieSearchResult,index:number)=>{
                return(
                    <>
                        <ListItem key={index} button alignItems="flex-start" onClick={()=>selectMovie(content.imdbID)}>
                            <ListItemAvatar>
                            <Avatar alt="Poster" variant='rounded' src={isValidData(content.Poster) ? content.Poster:Img_placeholder} />
                            </ListItemAvatar>
                            <ListItemText
                            primary={content.Title}
                            secondary={
                                <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                    style={{textTransform: 'capitalize'}}
                                >
                                    {isValidData(content.Type) && `${content.Type}`}{isValidData(content.Year) && ` (${content.Year})`}
                                </Typography>
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                        {index<state.movies.movies.length-1 && <Divider variant="inset" component="li" />}
                    </>
            )})}
            {(state.movies.status === FetchStatus.OK) &&
                <ListItem button alignItems="center" onClick={()=>props.callback_load_more()}>
                    <ExpandMoreIcon className={classes.wrappinglink_hover} style={{fill:themeColor,minWidth:'50px',minHeight:'50px',margin:'15px auto'}}/>
                </ListItem>
            }
            {(state.movies.status === FetchStatus.OK_COMPLETE) &&
                <ListItem button alignItems="center" onClick={()=>set_dialogue_page_is_full(true)}>
                    <CheckIcon className={classes.wrappinglink_hover} style={{fill:themeColor,minWidth:'50px',minHeight:'50px',margin:'15px auto'}}/>
                </ListItem>
            }
            {(state.movies.status === FetchStatus.LOADING_MORE) &&
                <ListItem alignItems="center">
                    <div style={{fill:themeColor,minWidth:'50px',minHeight:'50px',margin:'15px auto'}}>
                        {loadingIcon}
                    </div>
                </ListItem>
            }
        </List>
    )

    const moreInformation:JSX.Element = (
        /**
         * This shows if there is no more pages to load.
         */
        <Dialog fullWidth maxWidth={'sm'} onClose={()=>set_dialogue_page_is_full(false)} open={dialogue_page_is_full}>
            <div className={classes.statusWrapper}>
                <CheckIcon className={classes.wrappinglink_hover} style={{fill:themeColor,minWidth:'50px',minHeight:'50px',margin:'15px auto'}}/>
                <p className={classes.text_large}>The search results have reached the end.</p>
                <a className={classes.wrappinglink_hover} href="https://www.imdb.com" target="_blank" rel="noopener noreferrer">
                    <p className={classes.text_medium} style={{color:themeColor}}>For more information, please visit www.imdb.com</p>
                </a>
            </div>
        </Dialog>
    )

    return (
        <div className={classes.wrapper}>
            <div className={classes.listContainer}>
                {searchResultStatusSelector()}
            </div>
            {state.movies.status !== FetchStatus.INIT && <Dialog_Detail onClose={()=>toggle_details(false)} />}
            {moreInformation}
        </div>
    );
}

export default Results;
