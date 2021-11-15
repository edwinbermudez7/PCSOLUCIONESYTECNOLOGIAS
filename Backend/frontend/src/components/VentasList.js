import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from "../Global";


import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';




class VentasList extends Component {

    url = Global.url;

    state = {
        ventas: [],
        status: null
    };

    componentWillMount() {

        var search = this.props.search;

        if (search && search !== null && search !== undefined) {
            this.getVentasBySearch(search);
        } else {
            this.getVentas();
        }

    }

    getVentasBySearch = (searched) => {
        axios.get(this.url + "search/" + searched)
            .then(res => {
                this.setState({
                    ventas: res.data.venta,
                    status: 'success'
                })
            })
            .catch(err => {
                this.setState({
                    ventas: [],
                    status: 'success'
                })
            });
    }

    getVentas = () => {
        axios.get(this.url + "ventas")
            .then(res => {
                this.setState({
                    ventas: res.data.venta,
                    status: 'success'
                })

            });
    }

    deleteProduct = (id) => {
        swal({
            title: "Estas Seguro?",
            text: "Borraras permanentemente la Venta",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(this.url + 'venta/' + id)
                        .then(res => {
                            this.setState({
                                ventas: res.data.venta,
                                status: 'delete'
                            })

                            swal(
                                'Venta Borrada',
                                'La Venta ha sido borrado correctamente',
                                'success'
                            );

                        })
                } else {
                    swal(
                        'Venta no Borrado',
                        'La Venta no ha sido borrado',
                        'success'
                    );
                }
            });


    }

    render() {

        if (this.state.status === "delete") {
            return <Redirect to="/home" />
        }

        if (this.state.ventas.length >= 1) {

            var listventas = this.state.ventas.map((venta) => {
                return (
                    <tr key={venta._id}>
                        <td></td>
                        <td> <Moment date={venta.fechaVenta} fromNow locale="es" /></td>
                        <td>{venta.cliente}</td>
                        <td>{venta.vendedor}</td>
                        <td>{venta.producto}</td>
                        <td>{venta.precio}</td>
                        <td>{venta.cantidad}</td>
                        <td>{venta.total}</td>
                        <td>{venta.sucursal}</td>

                        
                        <td>
                            <Link to={'/ventas/editar/'+venta._id} className="btn btn-xs btn-warning"><FontAwesomeIcon icon={faEdit} /></Link>
                            <button onClick={
                                () => {
                                    this.deleteProduct(venta._id)
                                }
                            } className="btn btn-xs btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>




                );
            });
            return (
                <div id="ventas">
                    <h1 className="subheader">Listado de ventas</h1>
                    <div className="table-responsive">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha Venta</th>
                                    <th>Cliente</th>
                                    <th>Vendedor</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Sucursal</th>
                                </tr>
                            </thead>
                            <tbody>

                                {listventas}

                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else if (this.state.ventas.length === 0 && this.state.status === 'success') {
            return (
                <div id="ventas">
                    <h2 className="subheader">No hay ventas</h2>
                    <p>Todavia no hay contenido en esta sección</p>
                </div>
            );
        } else {
            return (
                <div id="ventas">
                    <h2 className="subheader">Cargando....</h2>
                    <p>Espere mientras carga el contenido</p>
                </div>
            );
        }


    }


}

export default VentasList;