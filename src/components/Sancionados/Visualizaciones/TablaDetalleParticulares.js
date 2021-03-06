import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import rp from "request-promise";
import CircularProgress from '@material-ui/core/CircularProgress';
import BajarCSV from "../../Tablas/BajarCSV";
import Grid from "@material-ui/core/Grid/Grid";
import EnhancedTableHead from '../../Tablas/EnhancedTableHead';
import Typography from "@material-ui/core/Typography/Typography";
import DetalleParticular from "../Particulares/DetalleParticular";
import Modal from "@material-ui/core/Modal/Modal";

let counter = 0;

let createData = (item) => {
    counter += 1;
    let leyenda = "NO EXISTE DATO EN LA BASE DE DATOS SFP";
    return {
        id: counter,
        proveedor: item.proveedor_o_contratista ? item.proveedor_o_contratista : leyenda,
        dependencia: item.dependencia ? item.dependencia : leyenda,
        expediente: item.numero_de_expediente ? item.numero_de_expediente : leyenda,
        hechos: item.hechos_de_la_irregularidad ? item.hechos_de_la_irregularidad : leyenda,
        objetoSocial: item.objeto_social ? item.objeto_social : leyenda,
        sentidoResolucion: item.sentido_de_resolucion ? item.sentido_de_resolucion : leyenda,
        fechaNotificacion: item.fecha_de_notificacion ? item.fecha_de_notificacion : leyenda,
        fechaResolucion: item.fecha_de_resolucion ? item.fecha_de_resolucion : leyenda,
        plazo: item.plazo ? item.plazo : leyenda,
        monto: item.monto ? item.monto : leyenda,
        responsableInformacion: item.nombre_del_responsable_de_la_informacion ? item.nombre_del_responsable_de_la_informacion : leyenda,
        fechaActualizacion: item.fecha_de_actualizacion ? item.fecha_de_actualizacion : leyenda
    };
};

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}
const columnData = [
    {
        id: 'proveedor',
        numeric: false,
        disablePadding: false,
        label: 'Proveedor o contratista',
        position: 1,
        mostrar: true
    },
    {id: 'dependencia', numeric: false, disablePadding: false, label: 'Institución', position: 2, mostrar: true},
    {
        id: 'expediente',
        numeric: false,
        disablePadding: false,
        label: 'Número de expediente',
        position: 3,
        mostrar: true
    },
    {
        id: 'hechos',
        numeric: false,
        disablePadding: false,
        label: 'Hechos de la irregularidad',
        position: 4,
        mostrar: false
    },
    {id: 'objetoSocial', numeric: false, disablePadding: false, label: 'Objeto social', position: 5, mostrar: false},
    {
        id: 'sentidoResolucion',
        numeric: false,
        disablePadding: false,
        label: 'Sentido de la resolución',
        position: 6,
        mostrar: true
    },
    {
        id: 'fechaNotificacion',
        numeric: false,
        disablePadding: false,
        label: 'Fecha notificación',
        position: 7,
        mostrar: false
    },
    {
        id: 'fechaResolucion',
        numeric: false,
        disablePadding: false,
        label: 'Fecha resolución',
        position: 8,
        mostrar: false
    },
    {id: 'plazo', numeric: false, disablePadding: false, label: 'Plazo', position: 9, mostrar: false},
    {id: 'monto', numeric: false, disablePadding: false, label: 'Monto', position: 10, mostrar: false},
    {
        id: 'responsableInformacion',
        numeric: false,
        disablePadding: false,
        label: 'Responsable de información',
        position: 11,
        mostrar: false
    },
    {
        id: 'fechaActualizacion',
        numeric: false,
        disablePadding: false,
        label: 'Fecha actualización',
        position: 12,
        mostrar: false
    }
];

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
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
    },
    tablePagination:{
        overflowX : 'auto',
        fontSize :'0.75rem'
    },
    gridTable:{
        marginBottom : '27px'
    },
    titleTable:{
        marginBottom:'61px'
    },
    desc:{
        color : theme.palette.primary.dark,
    }
});


class EnhancedTable extends React.Component {

    componentDidMount() {
        this.handleSearchAPI('FIELD_FILTER', this.props.institucion);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.institucion !== this.props.institucion){
            this.handleSearchAPI('FIELD_FILTER',nextProps.institucion);
        }
    }


    constructor(props) {
        super(props);
        this.btnDownloadAll = React.createRef();
        this.state = {
            order: 'asc',
            orderBy: 'proveedor',
            selected: [],
            nombreParticular: '',
            data: [],
            filterData: [],
            page: 0,
            rowsPerPage: 10,
            open: false,
            elementoSeleccionado: {},
            institucion: null,
            loading: true,
            totalRows: 0,
            filterDataAll: []
        };
    }

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

    handleClose = () => {
        this.setState({open: false});
    };

    handleClick = (event, elemento) => {
        this.setState({elementoSeleccionado: elemento, open: true});
    };

    handleChangePage = (event, page) => {
        this.setState({page}, () => {
            this.handleSearchAPI('CHANGE_PAGE', this.props.institucion);
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value}, () => {
            this.handleSearchAPI('FIELD_FILTER',null);
        });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    getTotalRows = (params) => {
        let options = {
            uri: 'https://plataformadigitalnacional.org/api/proveedores_sancionados?select=count=eq.exact',
            json: true,
            qs : params
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
    handleSearchAPI = (type,inst) => {
        this.setState({loading: true});
        let URI = 'https://plataformadigitalnacional.org/api/proveedores_sancionados?';
        let params = {};
        inst ? params.dependencia = 'eq.' + inst : null;
        type==='ALL' && !inst ? params.dependencia = 'eq.' + this.state.institucion : null;
        type !== "ALL" ? params.limit = this.state.rowsPerPage : null ;
        type === "CHANGE_PAGE" ? params.offset = (this.state.rowsPerPage * this.state.page): null;
        (type !== 'ALL' && type !=="CHANGE_PAGE") ? this.getTotalRows(params) : null;

        let options = {
            uri: URI,
            json: true,
            qs : params

        };
        rp(options)
            .then(data => {
                let dataAux = data.map(item => {
                    return createData(item);
                });

                type==='ALL' ? this.setState({data : dataAux,loading : false},()=>{
                    this.btnDownloadAll.triggerDown();
                }):(type === 'FIELD_FILTER' || type === 'CHANGE_PAGE') ? this.setState({
                    filterData : dataAux,
                    loading: false,
                    institucion : inst
                }) : null;
                return true;
            })
            .catch(err => {
                this.setState({loading: false});
                alert("_No se pudó obtener la información");
                console.log(err);
            });

    };

    render() {
        const {classes,institucion} = this.props;
        const {data, order, orderBy, selected, rowsPerPage, page, filterData, totalRows, filterDataAll} = this.state;
        const emptyRows = rowsPerPage - filterData.length;
        return (
            <div className={classes.container}>
                <div>
                    <div className={classes.tableWrapper}>
                        <DetalleParticular handleClose={this.handleClose} particular={this.state.elementoSeleccionado}
                                           control={this.state.open}/>
                        {
                            this.state.loading &&
                            <Modal
                                open={this.state.loading}
                                disableAutoFocus={true}
                            >
                                <CircularProgress className={classes.progress} id="spinnerLoading" size={200}/>
                            </Modal>
                        }
                        <Grid container justify={'center'} spacing={0} className={classes.gridTable}>
                            <Grid item xs={12}  className={classes.titleTable}>
                                <Typography variant={'title'} className={classes.title}>
                                    Detalle</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.section}>
                                <Typography variant={"h6"} className={classes.desc}>Pulsa sobre el registro para ver su detalle<br/></Typography>

                                <Table className={classes.table} aria-describedby="spinnerLoading"
                                       aria-busy={this.state.loading} aria-labelledby="tableTitle">
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={this.handleSelectAllClick}
                                        onRequestSort={this.handleRequestSort}
                                        rowCount={data.length}
                                        columnData = {columnData}
                                    />
                                    <TableBody id="tableParticulares">
                                        {filterData
                                            .sort(getSorting(order, orderBy))
                                            .map(n => {
                                                const isSelected = this.isSelected(n.id);
                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={event => this.handleClick(event, n)}
                                                        role="checkbox"
                                                        aria-checked={isSelected}
                                                        tabIndex={-1}
                                                        key={n.id}
                                                        selected={isSelected}
                                                    >
                                                        <TableCell component="th" scope="row"
                                                                   padding="default">{n.proveedor}</TableCell>
                                                        <TableCell>{n.dependencia}</TableCell>
                                                        <TableCell>{n.expediente}</TableCell>
                                                        <TableCell>{n.sentidoResolucion}</TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                    </TableBody>

                                </Table>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item md={3} xs={12}>
                                <BajarCSV innerRef={comp => this.btnDownloadAll = comp} data={data} filtrado={false}
                                          columnas={columnData} fnSearch = {this.handleSearchAPI}
                                          fileName={'Detalle'}/>
                            </Grid>
                            <Grid item md={3} xs={12}/>
                            <Grid item md={6} xs={12}>
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
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={"caption"} style={{fontStyle:'italic'}}>Fuente: https://datos.gob.mx/busca/dataset/proveedores-y-contratistas-sancionados</Typography>
                            </Grid>
                        </Grid>


                    </div>
                </div>
            </div>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
