import { environment } from "../../environments/environment"

// dev only : enabling it will always cause a fetching error.
const force_error = environment.force_error; // only the search results
const force_error_detail = environment.force_error_detail; // only the detail window

// dev only : enabling it will cause an infinite loading time.
const force_loading = environment.force_loading; // only the search results
const force_loading_detail = environment.force_loading_detail; // only the detail window

export enum FetchStatus{
    INIT='initialized',// initial state
    OK='ok',// fetch successful, and there are more pages available.
    OK_COMPLETE='complete',// fetch successful, and there is no more pages to load.
    LOADING='loading',// fetching
    LOADING_MORE='loading_more',// fetching more pages
    ERROR='error',// fetching failed
}

export enum DetailFetchStatus{
    LOADING='loading',//initial state
    OK='ok',// fetch successful
    ERROR='error',// fetching failed
}

export enum MoviePropTitles{
    GENRE='Genre',
    IMDB_RATING='IMDb rating',
    AWARDS='Awards',
    RUNTIME='Running time',
    RELEASE_DATE='Release date',
    DIRECTOR='Directed by',
    WRITER='Written by',
    PRODUCTION='Produced by',
    ACTORS='Starring',
    COUNTRY='Produced in',
    LANGUAGE='Languages'
}

export enum MoviePropIconColors{
    GENRE='#7CCCBE',
    IMDB_RATING='#D48B4A',
    AWARDS='#FC431E',
    RUNTIME='#333333',
    RELEASE_DATE='#709CB9',
    DIRECTOR='#8898A3',
    WRITER='#799B5B',
    PRODUCTION='#2B2F4D',
    ACTORS='#F48FB1',
    COUNTRY='#1BA160',
    LANGUAGE='#C86D52'
}

export interface SearchParameters{
    title:string,
    type?:string,
    year?:string
}

export const lengthIsMultipleOfTen = (array:any[]):boolean => {
    /**
     * Cette fonction permet de déterminer si la length d'un array peut être parfaitement divisée par 10.
     * Dans ce cas d'usage, on souhaite savoir s'il peut y avoir encore des résultats supplémentaires à charger,
     * car une page a 10 résultats au maximum.
     */
    return array.length%10 === 0;
}

interface Cache{
    /**
     * La class Omdb se souviendra des derniers paramètres de recherche pour décider automatiquement
     * si l'utilisateur a l'intention d'effectuer une nouvelle recherche ou bien charger plus d'informations sur le même titre.
     */
    lastParameters:SearchParameters,
    page:number
}

export class Omdb{
    public cache:Cache = {lastParameters:{title:''},page:1}
    constructor(public pushEvent:{():void},public movies?:MovieSearchResult[], public movie?:Movie, public search_status?:FetchStatus, public get_status?:DetailFetchStatus, public msg_error?:string){
    }

    loadMore = ():void => {
        if(force_loading){
            return;
        }
        this.searchMovies(this.cache.lastParameters);
    }

    searchMovies = async(input:SearchParameters):Promise<void> => {
        if(force_loading){
            return;
        }
        let title = `s=${input.title.replace(/ /g, '%20')}`; //alternative for replaceAll() supported in ES2021
        let type = input.type ? `&type=${input.type}`:'';
        let year = input.year ? `&y=${input.year}`:'';
        let controller = new AbortController();
        let init = Boolean(JSON.stringify(input) !== JSON.stringify(this.cache.lastParameters)); // if true : searching for a new page 1 with new parameters
        let api = `https://www.omdbapi.com/?apikey=${environment.apikey}&${title+type+year}${init ? '':`&page=${this.cache.page+1}`}`;
        init ? this.cache = {lastParameters:input,page:1}:this.cache = {lastParameters:input,page:this.cache.page+1};
        try{
            if(force_error){
                let error = 'Server error:504 (Gateway timeout)';
                this.msg_error = error;
                throw new Error(error);
            }
            const response = await fetch(api, { signal: controller.signal });
            const movies = await response.json();
            if(!movies.Response || movies.Response !== "True"){
                if(!init){
                    this.search_status = FetchStatus.OK_COMPLETE;
                }else if(movies.Error){
                    this.msg_error = movies.Error;
                    throw new Error(movies.Error);
                }else{
                    let error = 'Server error:504 (Gateway timeout)';
                    this.msg_error = error;
                    throw new Error(error);
                }
            }else{
                this.msg_error = '';
                if(init){
                    let new_list = movies.Search;
                    this.movies = new_list;
                    if(new_list.length<10){
                        this.search_status = FetchStatus.OK_COMPLETE;
                    }else{
                        this.search_status = FetchStatus.OK;
                    }
                }else{
                    let new_list = [...this.movies,...movies.Search];
                    if(!lengthIsMultipleOfTen(new_list)){
                        this.search_status = FetchStatus.OK_COMPLETE;
                    }
                    this.movies = [...this.movies,...movies.Search];
                }
            }
        }catch(error){
            console.log('Fetch error: ', error.message);
            this.search_status = FetchStatus.ERROR;
            this.msg_error = error.message;
        }finally{
            controller = null;
            this.pushEvent();
        }
    }

    getMovie = async(imdbID:string):Promise<void> => {
        if(force_loading_detail){
            return;
        }
        if(this.movie){
            if(imdbID===this.movie.imdbID){
                console.log(`aborting 'getMovie' because the movie ${this.movie.Title} has already been loaded.`)
                this.pushEvent();
                return;
            }
        }
        let controller = new AbortController();
        try{
            if(force_error_detail){
                let error = 'Server error:504 (Gateway timeout)';
                this.msg_error = error;
                throw new Error(error);
            }
            const response = await fetch(`https://www.omdbapi.com/?apikey=${environment.apikey}&i=${imdbID}&plot=full`, { signal: controller.signal });
            const movie = await response.json();
            if(!movie.Response || movie.Response !== "True"){
                this.movie = undefined;
                this.get_status = DetailFetchStatus.ERROR;
                if(movie.Error){
                    this.msg_error = movie.Error;
                    throw new Error(movie.Error);
                }else{
                    let error = 'Server error:504 (Gateway timeout)';
                    this.msg_error = error;
                    throw new Error(error);
                }
            }else{
                this.movie = movie;
                this.msg_error = '';
                this.get_status = DetailFetchStatus.OK;
            }
        }catch(error){
            console.log('Fetch error: ', error.message);
            this.get_status = DetailFetchStatus.ERROR;
            this.msg_error = error.message;
        }finally{
            controller = null;
            this.pushEvent();
        }
    }
}