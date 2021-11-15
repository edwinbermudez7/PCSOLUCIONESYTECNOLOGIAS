import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from "../Global";
import imageDefault from "../assets/images/default.png";

import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';




class ProductList extends Component {

    url = Global.url;

    state = {
        productos: [],
        status: null
    };

    componentWillMount() {

        var search = this.props.search;

        if (search && search !== null && search !== undefined) {
            this.getProductosBySearch(search);
        } else {
            this.getProductos();
        }

    }

    getProductosBySearch = (searched) => {
        axios.get(this.url + "search/" + searched)
            .then(res => {
                this.setState({
                    productos: res.data.products,
                    status: 'success'
                })
            })
            .catch(err => {
                this.setState({
                    productos: [],
                    status: 'success'
                })
            });
    }

    getProductos = () => {
        axios.get(this.url + "products")
            .then(res => {
                this.setState({
                    productos: res.data.product,
                    status: 'success'
                })

            });
    }

    deleteProduct = (id) => {
        swal({
            title: "Estas Seguro?",
            text: "Borraras permanentemente el Producto",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(this.url + 'product/' + id)
                        .then(res => {
                            this.setState({
                                productos: res.data.product,
                                status: 'delete'
                            })

                            swal(
                                'Producto Borrado',
                                'El articulo ha sido borrado correctamente',
                                'success'
                            );

                        })
                } else {
                    swal(
                        'Producto no Borrado',
                        'El Producto no ha sido borrado',
                        'success'
                    );
                }
            });


    }

    render() {

        if (this.state.status === "delete") {
            return <Redirect to="/home" />
        }

        if (this.state.productos.length >= 1) {

            var listProductos = this.state.productos.map((producto) => {
                return (
                    <tr key={producto._id}>
                        <td></td>
                        <td>{producto.title}</td>
                        <td>{producto.description}</td>
                        <td>{producto.price}</td>
                        <td>{producto.stop}</td>
                        {
                            producto.image !== null ? (
                                <td><img src={this.url + 'get-image/' + producto.image} alt={producto.title} width="120" height="120" /></td>
                            ) : (
                                <td><img src={imageDefault} width="120" height="120" alt="default.png" /></td>
                            )
                        }

                        <td> <Moment date={producto.date} fromNow locale="es" /></td>
                        <td>
                            <Link to={'/productos/editar/'+producto._id} className="btn btn-xs btn-warning"><FontAwesomeIcon icon={faEdit} /></Link>
                            <button onClick={
                                () => {
                                    this.deleteProduct(producto._id)
                                }
                            } className="btn btn-xs btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>




                );
            });
            return (
                <div id="productos">
                    <h1 className="subheader">Listado de Productos</h1>
                    <div className="table-responsive">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                    <th>Precio</th>
                                    <th>Stop</th>
                                    <th>Imagen</th>
                                    <th>Modificado</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>

                                {listProductos}

                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else if (this.state.productos.length === 0 && this.state.status === 'success') {
            return (
                <div id="productos">
                    <h2 className="subheader">No hay Productos</h2>
                    <p>Todavia no hay contenido en esta sección</p>
                </div>
            );
        } else {
            return (
                <div id="productos">
                    <h2 className="subheader">Cargando....</h2>
                    <p>Espere mientras carga el contenido</p>
                </div>
            );
        }


    }


}

export default ProductList;