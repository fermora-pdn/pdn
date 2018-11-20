import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import app from "../../config/firebase";

export default class Login extends React.Component {
    state = {
        email: '',
        pass: '',
        user: null
    };
    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };
    handleSignUp = async () => {
        try {
            let log = await app
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.pass);
            this.props.history.push("/");
        } catch (error) {
            alert(error);
        }
    };

    handleSignIn = async () => {
        try {
            let resp = await app.auth().signInWithEmailAndPassword(this.state.email, this.state.pass);
            if (resp.uid) {
                this.props.handleClose();
            }
        } catch (e) {
            alert(e);
        }
    };

    render() {
        const {open, handleClose} = this.props;
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Iniciar sesión</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ingresa tu email y contraseña
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="mail"
                            label="Email"
                            type="email"
                            fullWidth
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            margin="dense"
                            id="pass"
                            label="Contraseña"
                            type="password"
                            fullWidth
                            value={this.state.pass}
                            onChange={this.handleChange('pass')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={this.handleSignIn} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}