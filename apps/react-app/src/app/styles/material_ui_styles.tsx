import { createStyles, Theme, makeStyles, alpha } from '@material-ui/core/styles';

export const themeColor = "#3F51B5";

export const useStyles_header = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            justifyContent: 'space-evenly',
        },
        typeSelector_mobile: {
            width:'100%',
            paddingRight:'0.4rem',
        },
        yearInput_mobile: {
            width:'100%',
            paddingLeft:'0.4rem',
        },
        appbar:{
            borderRadius: '0.5rem',
        },
        appbar_mobile:{
            borderRadius: '0.5rem',
            paddingTop: '0.5rem',
        },
        grow_standard: {
            flexGrow: 1,
            width: '100%',
            margin: '0px auto',
        },
        grow_mobile: {
            flexGrow: 1,
            width: '95%',
            margin: '0px auto',
        },
        menuButton: {
            paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
            marginRight: theme.spacing(1),
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('lg')]: {
                display: 'block',
            },
        },
        search: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            width: '100%',
            [theme.breakpoints.up('lg')]: {
                width: 'auto',
            },
        },
        searchIcon: {
            height: '100%',
            position: 'relative',
        },
        inputRoot: {
            color: 'inherit',
            width: '100%',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
        },
        typeinput:{
            paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
            paddingRight: `calc(1em + ${theme.spacing(2)}px)`,
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '5ch',
        },
        alignSelf: 'center',
            color: '#8291A5',
            fontWeight: 600,
            fontSize: 15
        },
        typeinput_active:{
            paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
            paddingRight: `calc(1em + ${theme.spacing(2)}px)`,
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '5ch',
            },
            alignSelf: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15
        },
        button_mobile: {
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            width:'100%',
            minHeight:'2rem',
            paddingTop:'0.25rem',
            paddingBottom:'0.25em',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
        }
    })
);

export const useStyles_results = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        listContainer: {
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: 'snow',
            borderRadius: '0.5rem',
            width: '100%',
            height: '100%',
            [theme.breakpoints.down('xs')]: {
                width: '95%',
                height: '80vw',
            },
            [theme.breakpoints.only('sm')]: {
                width: '95%',
                height: '40vw',
            },
            [theme.breakpoints.only('md')]: {
                height: '35vw',
                width: '95%',
            },
            [theme.breakpoints.up('lg')]: {
                height: '30vw',
            },
            overflowY: 'auto',
        },
        listWrapper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            justifyItems: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        },
        icon: {
            width: '12rem',
            height: '12rem',
            [theme.breakpoints.down('md')]: {
                width: '6rem',
                height: '6rem',
            },
            fill: themeColor
        },
        text_large: {
            fontSmooth: 'always',
            fontSize: 20,
            color: themeColor,
            fontWeight: 600,
            fontFamily: 'Arial',
        },
        text_title: {
            fontSmooth: 'always',
            fontSize: 24,
            color: themeColor,
            fontWeight: 800,
            fontFamily: 'Arial',
            textAlign: 'center',
        },
        text_medium: {
            fontSmooth: 'always',
            fontSize: 16,
            color: "#1E1E1E",
            fontFamily: 'Arial'
        },
        text_medium_Title: {
            fontSmooth: 'always',
            fontSize: 16,
            color: "#1E1E1E",
            fontWeight: 'bold',
            marginLeft: '0.5rem',
            marginRight: '0.75rem',
            fontFamily: 'Arial',
        },
        detailWrapper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10vw',
            [theme.breakpoints.down('md')]: {
                height: '48vw',
            },
        },
        statusWrapper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '24vw',
            [theme.breakpoints.down('md')]: {
                minHeight: '56vw',
            },
            width: '100%'
        },
        detailContainer: {
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Arial'
        },
        detailBox: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            },
            [theme.breakpoints.down('md')]: {
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        poster: {
            borderRadius: '0.5rem',
            objectFit: 'cover',
            maxWidth: '100%',
        },
        plotContainer: {
            borderRadius: '0.5rem',
            backgroundColor: '#F2F2F2',
            marginTop: '0.5rem',
            marginInline : '0.5rem',
            marginBottom : '1rem',
            paddingInline: '1.5rem',
            textAlign: 'justify',
        },
        link: {
            marginLeft: '0.5rem',
            color: 'inherit',
            textDecoration: 'none',
            padding: 0,
            margin: 0
        },
        wrappinglink: {
            color: 'inherit',
            textDecoration: 'none',
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '0.5rem',
            marginRight: '0.5rem',
        },
        wrappinglink_hover: {
            textDecoration: 'none',
            padding: 0,
            [theme.breakpoints.up('lg')]: {
                "&:hover": {
                    backgroundColor: "white",
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                },
            },
            [theme.breakpoints.down('md')]: {
                "&:hover": {
                    backgroundColor: "white",
                    borderRadius: '0.5rem',
                },
            },
        },
        helpIcon: {
            position: 'relative',
            bottom: '10px',
            right: '5px',
            maxWidth: '15px',
            maxHeight: '15px'
        },
        propIcon: {
            position: 'relative',
            marginInline: '0.5rem',
            alignSelf: 'center',
            maxWidth: '20px',
            maxHeight: '20px',
        },
        root: {
            width: '100%',
            maxWidth: '1080px',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
            fontStyle: 'italic',
        },
        movieProps: {
            display: 'flex',
            flexDirection: 'row',
            justifyItems: 'flex-start',
            alignItems: 'center',
            marginTop: '0.5rem',
        },
        movieProps_inline: {
            display: 'inline',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                marginLeft: '4rem'
            },
        },
        moviePropsContainer_standard:{
            display: 'none',
            color: 'inherit',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            borderRadius: '0.5rem',
            backgroundColor: '#F0F0F0',
            width: '100%',
            marginRight: '0.5rem',
            [theme.breakpoints.up('lg')]: {
                display: 'flex',
                flexDirection: 'column',
            },
            paddingInline: '0.5rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
        },
        moviePropsContainer_mobile:{
            borderRadius: '0.5rem',
            backgroundColor: '#F2F2F2',
            margin: '0.5rem',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            color: 'inherit',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            [theme.breakpoints.up('lg')]: {
                display: 'none',
            },
            paddingInline: '0.5rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
        },
        exitIconButton: {
            position: 'fixed',
            top: '0.15rem',
            right: '0.15rem',
            width: '4rem',
            height: '4rem',
            backgroundColor: alpha(theme.palette.common.white, 0.25),
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.35),
            },
        },
        exitIcon: {
            width: '4rem',
            height: '4rem',
        }
    }),
);