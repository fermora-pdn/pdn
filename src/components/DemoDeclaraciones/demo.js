import React from 'react';
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Footer from '../Footer/Footer';
import Header from "./Header";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import IconButton from "@material-ui/core/IconButton/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Mensaje from "./Mensaje";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {mapDeclaracion} from "./utils";
import rp from "request-promise";
import TablaPre from "./TablaPre";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "./TabsDemo";

const styles = theme => ({
    root: {
        flexGrow: 1,
        [theme.breakpoints.up('sm')]: {
            marginLeft: '150px',
            marginRight: '150px',

        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,

        }
    },
    title: {
        color: theme.palette.textPrincipal.color,
        textAlign: 'center',
        marginTop: theme.spacing.unit * 2,
    },
    bgPanelLight: {
        backgroundColor: theme.palette.white.color,
        minHeight: '550px',
        paddingBottom: '50px',
    },
    section: {
        maxWidth: '1024px'
    },
    bgImg: {
        height: '300px',
        backgroundImage: 'url(test2.jpg)',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        textAlign: 'left',
        backgroundSize: 'cover',
        width: '100%',
    },
    center: {
        textAlign: 'center'
    },
    container: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: '100px',
            marginRight: '100px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit
        }
    },
    pdn: {
        [theme.breakpoints.up('sm')]: {
            paddingTop: '75px'
        },
        [theme.breakpoints.down('sm')]: {
            paddingTop: '40px'

        }
    },
    button: {
        margin: theme.spacing.unit,
    },
    avatar: {
        margin: 10
    },
    progress: {
        position: 'absolute',
        margin: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
});

class DemoDeclaraciones extends React.Component {
    state = {
        user: 'profile_4',
        nombre: '',
        apellidoUno: '',
        apellidoDos: '',
        bandera: 0,
        srcAvatar: 'avatarUno.png',
        registros: [],
        showTable: false,
        loading: false,
        totalRows: 0,
        rowsPerPage: 10,
        page: 0
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleChangeUser = event => {
        this.setState(
            {
                user: event.target.value,
                nombre: '',
                apellidoUno: '',
                apellidoDos: '',
                bandera: 0,
                registros: [],
                showTable: false,
                srcAvatar: event.target.value === 'Auditor Superior de la Federación' ? 'avatarUno.png' : event.target.value === 'Secretario de la Función Pública' ? 'avatarDos.png' : 'avatarTres.png'
            });
    };

    getRegistro = (id) => {
        const API_URL = process.env.API_URL || 'https://demospdn.host/demo1/api/s1/declaraciones';

        this.setState({loading: true});

        let options = {
            uri: API_URL,
            qs: {
                id: id,
                profile: this.state.user
            },
            json: true,
            insecure: true
        };

        rp(options)
            .then(data => {
                this.setState(
                    {
                        declaracion: mapDeclaracion(data)

                    }, () => {
                        this.setState(
                            {
                                bandera: 2,
                                showTable: false,
                                loading: false,
                            })
                    }
                );

            }).catch(err => {
            this.setState({loading: false});
            alert("_No se pudó obtener la información");
            console.log(err);
        });

    };
    search = () => {
        const API_URL = process.env.API_URL || 'https://demospdn.host/demo1/api/s1/declaraciones';
        this.setState({loading: true});

        let options = {
            uri: API_URL,
            qs: {
                nombres: this.state.nombre,
                primer_apellido: this.state.apellidoUno,
                segundo_apellido: this.state.apellidoDos,
                skip: this.state.page * this.state.rowsPerPage,
                limit: this.state.rowsPerPage
            },
            json: true,
            insecure: true

        };

        rp(options)
            .then(data => {
                this.setState({
                    registros: data.results,
                    showTable: true,
                    bandera: 0,
                    loading: false,
                    totalRows: data.total,
                    rowsPerPage: data.pagination.limit,

                })

            }).catch(err => {
            this.setState({loading: false});
            alert("_No se pudó obtener la información");
            console.log(err);
        });


    };

    handleChangePage = (event, page) => {
        this.setState({page}, () => {
            this.search();
        });

    };
    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value}, () => {
            this.search();
        });
    };
    clean = () => {
        this.setState({
            user: 'profile_1',
            nombre: '',
            apellidoUno: '',
            apellidoDos: '',
            bandera: 0,
            registros: [],
            showTable: false
        });
    };

    render() {
        const {classes, user} = this.props;
        return (
            <div>
                <Header user={user.profile} srcAvatar={this.state.srcAvatar}
                        handleChangeUser={this.handleChangeUser}/>
                <div className={classes.bgImg}>
                    <div className={classes.container}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} align="center">
                                <Typography className={classes.pdn} variant="display2" style={{color: '#fff'}}>
                                    Sistema de declaración patrimonial y de intereses
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <div className={classes.bgPanelLight}>
                    <div className={classes.root}>
                        {
                            this.state.loading &&
                            <CircularProgress className={classes.progress} id="spinnerLoading" size={100}/>
                        }
                        <Grid container justify={'center'} spacing={0} aria-describedby={'spinnerLoading'}
                              aria-busy={this.state.loading}>
                            <Grid item xs={12} className={classes.section}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <Typography variant={'title'} className={classes.title}>Consulta</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField
                                            id="standard-name"
                                            label="Nombre(s)"
                                            className={classes.textField}
                                            value={this.state.nombre}
                                            onChange={this.handleChange('nombre')}
                                            margin="normal"

                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="standard-name"
                                            label="Apellido uno"
                                            className={classes.textField}
                                            value={this.state.apellidoUno}
                                            onChange={this.handleChange('apellidoUno')}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="standard-name"
                                            label="Apellido dos"
                                            className={classes.textField}
                                            value={this.state.apellidoDos}
                                            onChange={this.handleChange('apellidoDos')}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Tooltip title={'Buscar'}>
                                            <IconButton color="primary" className={classes.button}
                                                        aria-label="Add to shopping cart" onClick={this.search}>
                                                <SearchIcon/>
                                            </IconButton>
                                        </Tooltip>

                                    </Grid>
                                    <Grid item xs={1}>
                                        <Tooltip title={'Limpiar'}>
                                            <IconButton color="primary" className={classes.button}
                                                        aria-label="Add to shopping cart" onClick={this.clean}>
                                                <ClearIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {this.state.showTable &&
                                        <Typography variant={'title'} className={classes.title}> Resultados
                                            previos</Typography>
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {this.state.showTable &&
                                        <TablaPre registros={this.state.registros} getRegistro={this.getRegistro}
                                                  totalRows={this.state.totalRows} rowsPerPage={this.state.rowsPerPage}
                                                  page={this.state.page}
                                                  handleChangePage={this.handleChangePage}
                                                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}/>
                                        }
                                    </Grid>

                                    <Grid item xs={12}>
                                        {
                                            this.state.bandera === 1 &&
                                            <Mensaje mensaje={'El usuario no cuenta con los permisos suficientes'}/>
                                        }
                                        {
                                            // this.state.bandera === 2 && <Registro declaracion={this.state.declaracion}/>
                                            this.state.bandera === 2 && <Tabs declaracion={this.state.declaracion}/>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

}

DemoDeclaraciones.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DemoDeclaraciones);