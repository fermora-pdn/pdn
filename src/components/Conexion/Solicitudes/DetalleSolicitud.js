import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import CloseButton from '@material-ui/icons/Close'
import IconButton from "@material-ui/core/IconButton/IconButton";

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,

    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 110,
        },
        [theme.breakpoints.down('sm')]: {
            width: '80%',
            height: '80%',
            overflowY: 'scroll',

        },
        [theme.breakpoints.up('xl')]: {
            width: theme.spacing.unit * 130,
        },
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',

    },
    fontSmall: {
        fontSize: '.8em',
    },
    flex: {
        flexGrow: 1,
    },
    button: {
        float: 'right'
    },
    title: {
        color: theme.palette.primary.main,
    },
    centrado: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

class DetalleSolicitud extends React.Component {
    render() {
        const {classes, handleClose, solicitud, control} = this.props;
        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={control}
                    onClose={handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <form>
                            <Grid container spacing={8} justify="flex-start">
                                <Grid item xs={11}>
                                    <Typography variant="title" className={classes.title}>Ficha de la
                                        solicitud</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton color="primary" className={classes.button} component="span"
                                                onClick={handleClose}>
                                        <CloseButton/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="read-only-input"
                                        label="Correo electrónico"
                                        defaultValue={solicitud.correo}
                                        className={classes.textField}
                                        margin="normal"
                                        multiline
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="read-only-input"
                                        label="Teléfono personal"
                                        defaultValue={solicitud.telefono_personal}
                                        className={classes.textField}
                                        margin="normal"
                                        multiline
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="read-only-input"
                                        label="Teléfono oficina"
                                        defaultValue={solicitud.telefono_oficina}
                                        className={classes.textField}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="read-only-input"
                                        label="Extensión"
                                        defaultValue={solicitud.extension}
                                        className={classes.textField}
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}

DetalleSolicitud.propTypes = {
    classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
//const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default withStyles(styles)(DetalleSolicitud);
