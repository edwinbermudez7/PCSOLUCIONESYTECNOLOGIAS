import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from "../Global";
import imageDefault from "../assets/images/user.jpg";

import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';




class UsuarioList extends Component {

    url = Global.url;

    state = {
        usuarios: [],
        status: null
    };

    componentWillMount() {

        var search = this.props.search;

        if (search && search !== null && search !== undefined) {
            this.getusuariosBySearch(search);
        } else {
            this.getusuarios();
        }

    }

    getusuariosBySearch = (searched) => {
        axios.get(this.url + "search/" + searched)
            .then(res => {
                this.setState({
                    usuarios: res.data.user,
                    status: 'success'
                })
            })
            .catch(err => {
                this.setState({
                    usuarios: [],
                    status: 'success'
                })
            });
    }

    getusuarios = () => {
        axios.get(this.url + "users")
            .then(res => {
                this.setState({
                    usuarios: res.data.user,
                    status: 'success'
                })

            });
    }

    deleteUsuario = (id) => {
        swal({
            title: "Estas Seguro?",
            text: "Borraras permanentemente el Usuario",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(this.url + 'user/' + id)
                        .then(res => {
                            this.setState({
                                usuarios: res.data.user,
                                status: 'delete'
                            })

                            swal(
                                'Usuario Borrado',
                                'El articulo ha sido borrado correctamente',
                                'success'
                            );

                        })
                } else {
                    swal(
                        'Usuario no Borrado',
                        'El Usuario no ha sido borrado',
                        'success'
                    );
                }
            });


    }

    render() {

        if (this.state.status === "delete") {
            return <Redirect to="/home" />
        }

        if (this.state.usuarios.length >= 1) {

            var listusuarios = this.state.usuarios.map((usuario) => {
                return (
                    <tr key={usuario._id}>
                        <td></td>
                        <td>{usuario.documento}</td>
                        <td>{usuario.nombreApellido}</td>
                        <td>{usuario.telefono}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.sucursal}</td>
                        <td>{usuario.rol}</td>
                        {
                            usuario.image !== null ? (
                                <td><img src={this.url + 'get-image-user/' + usuario.image} alt={usuario.title} width="120" height="120" /></td>
                            ) : (
                                <td><img src={imageDefault} width="120" height="120" alt="default.png" /></td>
                            )
                        }

                        <td> <Moment date={usuario.date} fromNow locale="es" /></td>
                        <td>
                            <Link to={'/usuarios/editar/' + usuario._id} className="btn btn-xs btn-warning"><FontAwesomeIcon icon={faEdit} /></Link>
                            <button onClick={
                                () => {
                                    this.deleteUsuario(usuario._id)
                                }
                            } className="btn btn-xs btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>




                );
            });
            return (
                <div id="usuarios">
                    <h1 className="subheader">Listado de usuarios</h1>
                    <div className="table-responsive">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Documento</th>
                                    <th>Nombre Apellido</th>
                                    <th>Telefono</th>
                                    <th>correo</th>
                                    <th>Sucursal</th>
                                    <th>Rol</th>
                                    <th>Imagen</th>
                                    <th>Modificado</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>

                                {listusuarios}

                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else if (this.state.usuarios.length === 0 && this.state.status === 'success') {
            return (
                <div id="usuarios">
                    <h2 className="subheader">No hay usuarios</h2>
                    <p>Todavia no hay contenido en esta sección</p>
                </div>
            );
        } else {
            return (
                <div id="usuarios">
                    <h2 className="subheader">Cargando....</h2>
                    <p>Espere mientras carga el contenido</p>
                </div>
            );
        }


    }


}

export default UsuarioList;