import React from 'react';
import Table from "@material-ui/core/Table/Table";
import EnhancedTableHead from "../../Tablas/EnhancedTableHead";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import ArchiveIcon from '@material-ui/icons/Archive';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import rp from "request-promise";
import AcceptIcon from '@material-ui/icons/AssignmentTurnedIn';
/*import DetalleSolicitud from './DetalleSolicitud';*/
import axios from "axios";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import Mensaje from "../../Mensajes/Mensaje";

let counter = 0;
let createData = (item) => {
    counter += 1;
    let leyenda = "SIN DATO";
    return {
        id: counter,
        nombre: item.nombre ? item.nombre : leyenda,
        apellido1: item.apellido1 ? item.apellido1 : leyenda,
        apellido2: item.apellido2 ? item.apellido2 : leyenda,
        cargo: item.cargo ? item.cargo : leyenda,
        dependencia: item.dependencia ? item.dependencia : leyenda,
        correo: item.correo ? item.correo : leyenda,
        telefono_personal: item.telefono_personal ? item.telefono_personal : leyenda,
        telefono_oficina: item.telefono_oficina ? item.telefono_oficina : leyenda,
        extension: item.extension ? item.extension : leyenda,
        fecha_solicitud: item.fecha_solicitud ? item.fecha_solicitud.substring(0, 10) : leyenda,
        estatus: item.estatus ? item.estatus : leyenda,
        id_oficio: item.id_oficio ? item.id_oficio : leyenda
    };
};
const columnData = [
    {
        id: 'nombre',
        label: 'Nombre',
        position: 2,
        mostrar: true,
        key: 'nombre'
    },
    {
        id: 'apellido1',
        label: 'Apellido Uno',
        position: 3,
        mostrar: true,
        key: 'apellido1'
    },
    {
        id: 'apellido2',
        label: 'Apellido Dos',
        position: 4,
        mostrar: true,
        key: 'apellido2'
    },
    {
        id: 'cargo',
        label: 'Cargo',
        position: 5,
        mostrar: true,
        key: 'cargo'
    },
    {
        id: 'correo',
        label: 'Correo electrónico',
        position: 7,
        mostrar: true,
        key: 'correo'
    },
    {
        id: 'telefonoPersonal',
        label: 'Teléfono personal',
        position: 8,
        mostrar: true,
        key: 'telefonoPersonal'
    },

    {
        id: 'telefonoOficina',
        label: 'Teléfono oficina',
        position: 9,
        mostrar: true,
        key: 'telefonoOficina'
    },
    {
        id: 'extension',
        label: 'Extensión',
        position: 10,
        mostrar: true,
        key: 'extension'
    },
    {
        id: 'fecha_solicitud',
        label: 'Fecha alta',
        position: 11,
        mostrar: true,
        key: 'fecha_solicitud'
    },
    {
        id: 'estatus',
        label: 'Estatus',
        position: 12,
        mostrar: true,
        key: 'estatus'
    },
];

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
};


const styles = theme => ({
    tableFooter: {
        display: 'flow-root',
        flexWrap: 'wrap',
    },
    progress: {
        position: 'fixed',
        margin: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    container: {
        marginTop: '30px',
        marginBottom: '30px',
    },
    section: {
        maxWidth: '1200px',
        overflowX: 'auto'
    },
    table: {
        tableLayout: 'fixed',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    },
    tablePagination: {
        overflowX: 'auto',
        fontSize: '0.75rem'
    },
    gridTable: {
        marginBottom: '27px'
    },
    titleTable: {
        marginBottom: '61px'
    },
    title: {
        color: theme.palette.primary.main,
        textAlign: 'center'
    },
    text: {
        color: theme.palette.secondary.dark,
    }
});


class TablaContactos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'nombre',
            selected: [],
            page: 0,
            rowsPerPage: 10,
            open: false,
            elementoSeleccionado: {},
            totalRows: 0,
            data: [],
            filterData: [],
            oficio: null,
            flag_msj: false,
        };
    };

    handleClose = () => {
        this.setState({open: false});
    };

    componentDidMount() {
        this.getSolicitudes('FIELD_FILTER');
    }

    getSolicitudes = (typeSearch) => {
        let params = {};

        (typeSearch === 'FIELD_FILTER' || typeSearch === 'CHANGE_PAGE') ? params.limit = this.state.rowsPerPage : null;
        (typeSearch === 'FIELD_FILTER' || typeSearch === 'CHANGE_PAGE') ? params.offset = (this.state.rowsPerPage * this.state.page) : null;
        (typeSearch === 'FIELD_FILTER') ? this.getTotalRows(params) : null;


        let options = {
            uri: 'https://plataformadigitalnacional.org/api/solicitudes_conexion',
            json: true,
            qs: params
        };
        rp(options)
            .then(data => {
                let dataAux = data.map(item => {
                    return createData(item);
                });

                this.setState({
                    filterData: dataAux,
                    loading: false
                });
                return true;
            })
            .catch(err => {
                this.setState({loading: false});
                alert("_No se pudó obtener la información");
                console.log(err);
            });

    };

    getTotalRows = (params) => {
        let options = {
            uri: 'https://plataformadigitalnacional.org/api/solicitudes_conexion?select=count=eq.exact',
            json: true,
            qs: params
        };
        rp(options)
            .then(data => {
                this.setState({totalRows: data[0].count, loading: false});
            }).catch(err => {
            this.setState({loading: false});
            alert("_No se pudó obtener la información");
            console.log(err);
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value, page: 0}, () => {
            this.getSolicitudes('FIELD_FILTER');
        });
    };

    handleChangePage = (event, page) => {
        this.setState({page}, () => {
            this.getSolicitudes('CHANGE_PAGE');
        });

    };
    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({order, orderBy});
    };
    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleClick = (event, elemento) => {
        this.setState({elementoSeleccionado: elemento});
        this.setState({open: true});
    };

    viewOficio = (solicitud) => {
        let fd = new FormData();
        fd.append('idDocument', solicitud.id_oficio);
        axios
            .post('https://demospdn.host/pdn/getOficio', fd, {responseType: 'arraybuffer'})
            .then(res => {
                if (res && res.status === 200) {
                    let fileName = 'Oficio.pdf';
                    const a = document.createElement('a');
                    a.download = fileName;
                    let blob = new Blob([res.data], {type: 'application/pdf'});
                    a.href = URL.createObjectURL(blob);
                    //window.open(URL.createObjectURL(blob));
                    a.click();
                    URL.revokeObjectURL(a.href);
                }
            })
            .catch(err => {
                console.log("err:", err);
            })
    };
    handleCloseMsj = () => {
        this.setState({flag_msj: false});
    };

    acceptSolicitud = (n) => {
        if (n.estatus !== 'ALTA') {
            let params = {};
            params.correo = 'eq.' + n.correo;

            let options = {
                method: 'PATCH',
                uri: 'https://plataformadigitalnacional.org/api/solicitudes',
                qs: params,
                headers: {
                    'Prefer': 'return = representation',
                    'Content-Type': 'application/json'
                },
                body: {'estatus': 'ALTA'},
                json: true
            };
            rp(options)
                .then(data => {
                    this.setState({
                        flag_msj: true
                    }, () => {
                        this.getSolicitudes('FIELD_FILTER');
                    })
                })
                .catch(err => {
                    alert("_No se pudó completar la operación");
                    console.log(err);
                });
        }
    };

    render() {
        const {classes} = this.props;
        const {order, orderBy, selected, rowsPerPage, page, filterData, totalRows, filterDataAll} = this.state;
        let index = 0;
        return (
            <div>
                <Mensaje mensaje={'La solicitud ha sido aceptada'} titulo={'Solicitud aceptada'}
                         open={this.state.flag_msj} handleClose={this.handleCloseMsj}/>

                <Typography variant={"h6"} className={classes.text}>Contactos registrados</Typography>
                <Table className={classes.table} aria-describedby="spinnerLoading"
                       aria-busy={this.state.loading} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={filterData.length}
                        columnData={columnData}
                        acciones={true}
                    />
                    <TableBody>
                        {
                            filterData
                                .sort(getSorting(order, orderBy))
                                .map(n => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index++}
                                        >
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.nombre}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.apellido1}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.apellido2}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.cargo}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.dependencia}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.fecha_solicitud}</TableCell>
                                            <TableCell
                                                onClick={(event) => this.handleClick(event, n)}>{n.estatus}</TableCell>
                                            <TableCell>
                                                <Tooltip title={"Aceptar solicitud"}>
                                                    <AcceptIcon onClick={() => this.acceptSolicitud(n)}
                                                                color={n.estatus === 'ALTA' ? 'disabled' : 'primary'}/>
                                                </Tooltip>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    className={classes.tablePagination}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    labelRowsPerPage='Registros por página'
                    labelDisplayedRows={({from, to, count}) => {
                        return `${from}-${to} de ${count}`;
                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(TablaContactos)