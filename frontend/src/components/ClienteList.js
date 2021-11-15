import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';

import Global from "../Global";


import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';




class ClienteList extends Component {

    url = Global.url;

    state = {
        clientes: [],
        status: null
    };

    componentWillMount() {

        var search = this.props.search;

        if (search && search !== null && search !== undefined) {
            this.getclientesBySearch(search);
        } else {
            this.getclientes();
        }

    }

    getclientesBySearch = (searched) => {
        axios.get(this.url + "search/" + searched)
            .then(res => {
                this.setState({
                    clientes: res.data.cliente,
                    status: 'success'
                })
            })
            .catch(err => {
                this.setState({
                    clientes: [],
                    status: 'success'
                })
            });
    }

    getclientes = () => {
        axios.get(this.url + "clientes")
            .then(res => {
                
                this.setState({
                    clientes: res.data.cliente,
                    status: 'success'
                })
                
            });
        
    }

    deleteCliente = (id) => {
        swal({
            title: "Estas Seguro?",
            text: "Borraras permanentemente el Cliente",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(this.url + 'cliente/' + id)
                        .then(res => {
                            this.setState({
                                clientes: res.data.cliente,
                                status: 'delete'
                            })

                            swal(
                                'Cliente Borrado',
                                'El articulo ha sido borrado correctamente',
                                'success'
                            );

                        })
                } else {
                    swal(
                        'Cliente no Borrado',
                        'El Cliente no ha sido borrado',
                        'success'
                    );
                }
            });


    }

    render() {
        
        if (this.state.status === "delete") {
            return <Redirect to="/home" />
        }

        if (this.state.clientes.length >= 1) {

            var listclientes = this.state.clientes.map((cliente) => {
                return (
                    <tr key={cliente._id}>
                        <td></td>
                        <td>{cliente.documento}</td>
                        <td>{cliente.nombreApellido}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.correo}</td>
                        <td>
                            <Link to={'/clientes/editar/' + cliente._id} className="btn btn-xs btn-warning"><FontAwesomeIcon icon={faEdit} /></Link>
                            <button onClick={
                                () => {
                                    this.deleteCliente(cliente._id)
                                }
                            } className="btn btn-xs btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>




                );
            });
            return (
                <div id="clientes">
                    <h1 className="subheader">Listado de clientes</h1>
                    <div className="table-responsive">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Documento</th>
                                    <th>Nombre Apellido</th>
                                    <th>Telefono</th>
                                    <th>correo</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>

                                {listclientes}

                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else if (this.state.clientes.length === 0 && this.state.status === 'success') {
            return (
                <div id="clientes">
                    <h2 className="subheader">No hay clientes</h2>
                    <p>Todavia no hay contenido en esta sección</p>
                </div>
            );
        } else {
            return (
                <div id="clientes">
                    <h2 className="subheader">Cargando....</h2>
                    <p>Espere mientras carga el contenido</p>
                </div>
            );
        }


    }


}

export default ClienteList;