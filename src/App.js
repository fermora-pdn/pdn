import React from 'react';
import pndRoutes from './routes/index';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import P404 from './components/P404';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import PrivateRoute from "./PrivateRoute";
import app from "./config/firebase";
import LoginPDN from "./components/Inicio/LoginPDN";
import {connect} from 'react-redux';
import ScrollToTop from './ScrollToTop';
import ReactGA from 'react-ga';
import MensajeError from './components/Mensajes/MensajeError';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#89d4f2',
            light: '#bdffff',
            dark: '#56a3bf'
        },
        secondary: {
            main: '#ffe01b',
            light: "#ffff5c",
            dark: '#c8af00'
        },
        fontLight: {
            color: "#f5f5f5"//"#e0e0e0"
        },
        grey: {
            color: "#c5c5c5"
        },
        titleBanner: {
            color: '#666666'
        },
        graphGreen: {
            color: "#00cc99"
        },
        textPrincipal: {
            color: "#00322b"
        },
        textSecondary: {
            color: "#e6e6e6"
        },
        backLight: {
            color: "#e6e6e6"
        },
        backDark: {
            color: 'rgb(55, 70, 79)'
        },
        textNormal: {
            color: 'rgba(0, 0, 0, 0.87)'
        },
        white: {
            color: "#ffff"
        },
        grisTenue: {
            color: '#f5f5f5'
        },
        azul: {
            color: '#89d4f2'
        },
        black: {
            black: "#000"
        },
        red: {
            color: '#B00020'
        },
        textGrey: {
            color: '#666666'
        },

    },
    /*   overrides:{
           MuiTableHead:{
               root:{
                   backgroundColor: '#8fe19f'
               }
           }
       }
   */
});

const p404 = () => {
    return <P404/>
};


class App extends React.Component {
    constructor(props) {
        super(props);
    };

    componentWillMount() {
        let aux = JSON.parse(localStorage.getItem("sesion"));
        this.setState({
            sesion: aux,
            loading: false
        });
        this.props.newSesion(aux);
        this.initializeReactGA();
    };

    handleSignIn = (email, pass, history) => {
        try {
            app.auth().signInWithEmailAndPassword(email, pass).then((resp) => {
                if (!resp.user.emailVerified) {
                    this.setState(
                        {
                            mensaje: 'El correo electrónico no ha sido validado. Revisa tu bandeja de entrada y sigue las instrucciones.'
                        }, () => {
                            let user = app.auth().currentUser;
                            user.sendEmailVerification().then(function () {
                            }).catch(function (err) {
                                console.log("Error: ", err);
                            })
                        })
                }
                else {
                    let db = app.firestore();
                    const settings = {timestampsInSnapshots: true};
                    db.settings(settings);
                    db.collection('/users_pdn').where("uid", "==", resp.user.uid).get().then((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            this.setState({
                                sesion: {
                                    currentUser: {
                                        nombre: doc.data().nombre,
                                        apellidoPaterno: doc.data().apellidoPaterno,
                                        apellidoMaterno: doc.data().apellidoMaterno,
                                        rol: doc.data().rol,
                                        email: doc.data().correo,
                                        uid : doc.data().uid,
                                        dependencia : doc.data().dependencia,
                                    },
                                    authenticated: true,
                                },
                                loading: false
                            }, () => {
                                this.props.newSesion(this.state.sesion);
                                localStorage.setItem("sesion", JSON.stringify(this.state.sesion));
                                history.push('/');
                            })
                        });
                    });

                }
                /*if (resp.user.uid) {
                    let db = app.firestore();
                    const settings = {timestampsInSnapshots: true};
                    db.settings(settings);
                    db.collection('/users_demodeclaraciones').where("UID", "==", resp.user.uid).get().then((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            this.setState({
                                sesion: {
                                    currentUser: {
                                        nombre: doc.data().nombre,
                                        apellidoPaterno: doc.data().apellidoPaterno,
                                        apellidoMaterno: doc.data().apellidoMaterno,
                                        profile: doc.data().profile,
                                        email: resp.user.email,
                                    },
                                    authenticated: true,
                                },
                                loading: false
                            }, () => {
                                this.props.newSesion(this.state.sesion);
                                localStorage.setItem("sesion", JSON.stringify(this.state.sesion));
                                history.push('/');
                            })
                        });
                    });

                }*/
            }).catch(error => {
                console.log("Error con signInWithEmailAndPassword ", error);
                this.setState({
                    mensaje: error.code === 'auth/invalid-email' ? 'El correo electrónico no es válido' : error.code === 'auth/user-disabled' ? 'El usuario ha sido deshabilitado' : error.code === 'auth/user-not-found' ?
                        'El correo electrónico no esta dado de alta' : 'La contraseña es invalida o la cuenta no tiene una contraseña'
                })
            });

        } catch (e) {
            this.setState({
                mensaje: e
            })
        }
    };

    handleRecovery = (email) => {
        app.auth().sendPasswordResetEmail(email).then(() => {
            this.setState({
                mensaje: 'Se ha enviado un correo a su cuenta. Por favor siga los pasos indicados'
            });
        }).catch(error => {
            console.log("Error con sendPasswordResetEmail ", error);
            this.setState({
                mensaje: error.code === 'auth/invalid-email' ? 'El correo electrónico no es válido' : error.code === 'auth/user-disabled' ? 'El usuario ha sido deshabilitado' : error.code === 'auth/user-not-found' ?
                    'El correo electrónico no esta dado de alta' : 'La contraseña es invalida o la cuenta no tiene una contraseña'
            })
        });
    };

    initializeReactGA = () => {
        ReactGA.initialize('UA-131031213-1');
        ReactGA.pageview('/');
        ReactGA.pageview('/sancionados');
        ReactGA.pageview('/servidores');
    };

    render() {
        const {sesion, loading} = this.state;
        if (loading) {
            return <p>Cargando...</p>;
        }

        return (
            <MuiThemeProvider theme={theme}>
                <Router basename={process.env.PUBLIC_URL}>
                    <ScrollToTop>
                        <Switch>
                            <Route exact path={'/login'}
                                   render={(props) => <LoginPDN handleSignIn={this.handleSignIn}
                                                                handleRecovery={this.handleRecovery}
                                                                propiedades={props}
                                                                mensaje={this.state.mensaje}/>}/>

                            {pndRoutes.map((prop, key) => {
                                    return prop.private ?
                                        <PrivateRoute exact path={prop.path} component={prop.component} key={key}
                                                      sesion={sesion}/> :
                                        <Route exact path={prop.path} component={prop.component} key={key}/>;
                                }
                            )
                            }
                            <Route render={p404}/>
                        </Switch>
                    </ScrollToTop>
                </Router>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let newState = {
        sesion: state.sesionReducer.sesion
    };
    return newState;
};
const mapDispatchToProps = (dispatch, ownProps) => ({
    newSesion: (sesion) => dispatch({type: 'SET_SESION', sesion}),
});

let previo = App;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(previo)

//export default App;