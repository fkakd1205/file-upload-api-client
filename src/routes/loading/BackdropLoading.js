import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: 1400,     // modal z-index:1300
      color: '#fff'
    },
  }));

const BackdropLoading = ({open}) => {
    const classes = useStyles();

    return(
        <Backdrop className={classes.backdrop} open={open} >
            <CircularProgress color="inherit" />
        </Backdrop>
    )   
}

export default BackdropLoading;