import React, { Component } from "react";

import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/es';
import Global from "../Global";
import imageDefault from "../assets/images/default.png";






class ProductListHome extends Component {

    url = Global.url;

    state = {
        productos: [],
        status: null
    };

    componentWillMount() {
        var home = this.props.home
        if(home === "true"){
            this.getLastProductos();
        }else{
            this.getProductosHome();
        }
        
    }

    getLastProductos = () => {
        axios.get(this.url + "products/last")
            .then(res => {
                this.setState({
                    productos: res.data.product,
                    status: 'success'
                })
                
            });
    }

    getProductosHome = () => {
        axios.get(this.url + "products")
            .then(res => {
                this.setState({
                    productos: res.data.product,
                    status: 'success'
                })
               
            });
    }

    render() {
        if (this.state.productos.length >= 1) {

            var listProductos = this.state.productos.map((producto) => {
                return (



                    <div key={producto._id} className="col-md-4">
                        <div className="card mb-4 box-shadow">
                            {
                                producto.image !== null ? (
                                    <img className="card-img-top" src={this.url + 'get-image/' + producto.image} alt={producto.title} width="120" height="120" />
                                ) : (
                                    <img className="card-img-top" src={imageDefault} width="120" height="120" alt="default" />
                                )
                            }

                            <div className="card-body">
                                <p className="card-text">{producto.title}</p>
                                <p className="card-text">{producto.description}</p>
                                <p className="card-text">$ {producto.price}</p>
                                <div className="d-flex justify-content-between align-items-center">

                                    <small className="text-muted"><Moment date={producto.date} fromNow locale="es" /></small>
                                </div>
                            </div>
                        </div>
                    </div>

                );
            });
            return (
                <div id="productos">

                    <div className="album py-5 bg-light">
                        <div className="container">
                            <div className="row">
                                {listProductos}
                            </div>
                        </div>
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

export default ProductListHome;