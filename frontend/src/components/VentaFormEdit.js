import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class VentaFormEdit extends Component {

    url = Global.url;

    clienteRef = React.createRef();
    vendedorRef = React.createRef();
    productoRef = React.createRef();
    precioRef = React.createRef();
    cantidadRef = React.createRef();
    totalRef = React.createRef();
    SucursalNorteRef = React.createRef();
    SucursalSurRef = React.createRef();
    SucursalCentroRef = React.createRef();


    state = {
        customers: [],
        usuarios: [],
        productos: [],
        ventas: {},
        status: null,
        selectedFile: null,
        suma: 0
    };

    componentWillMount() {
        this.ventasId = this.props.match.params.id;
        this.getVenta(this.ventasId);
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este Campo es Requerido'
            }
        });
        this.getcustomers();
        this.getusuarios();
        this.getProductos();
    }

    getcustomers = () => {
        axios.get(this.url + "clientes/")
            .then(res => {
                this.setState({
                    customers: res.data.cliente,
                    status: "waiting"

                })
            });
    }

    getusuarios = () => {
        axios.get(this.url + "users")
            .then(res => {
                this.setState({
                    usuarios: res.data.user,
                    status: 'waiting'
                })

            });
    }

    getProductos = () => {
        axios.get(this.url + "products")
            .then(res => {
                this.setState({
                    productos: res.data.product,
                    status: 'waiting'
                })

            });
    }


    getVenta = (id) => {
        axios.get(this.url + 'venta/' + id)
            .then(res => {
                this.setState({
                    ventas: res.data.venta
                })
            })
    }

    changeState = () => {
        var sucursal = "Norte"
        if (this.SucursalNorteRef.current.checked) {
            sucursal = this.SucursalNorteRef.current.value;
        } else if (this.SucursalSurRef.current.checked) {
            sucursal = this.SucursalSurRef.current.value;
        } else if (this.SucursalCentroRef.current.checked) {
            sucursal = this.SucursalCentroRef.current.value;
        }
        this.totalRef.current.value = this.cantidadRef.current.value * this.precioRef.current.value
        this.setState({
            ventas: {
                cliente: this.clienteRef.current.value,
                vendedor: this.vendedorRef.current.value,
                producto: this.productoRef.current.value,
                sucursal: sucursal,
                precio: this.precioRef.current.value,
                cantidad: this.cantidadRef.current.value,
                total: this.totalRef.current.value
            }
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveVentas = (e) => {

        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {


            axios.put(this.url + 'venta/' + this.ventasId, this.state.ventas)
                .then(res => {
                    if (res.data.venta) {
                        this.setState({
                            ventas: res.data.venta,
                            status: "waiting"
                        })

                        swal(
                            'Venta Actualizado',
                            'la Venta ha sido Actualizado correctamente',
                            'success'
                        );

                        /* Subir Imagen */
                        if (this.state.selectedFile !== null) {
                            /* Sacar el ID del venta guardado */
                            var ventasId = this.state.ventas._id;

                            /* Crear form data y añadir fichero */
                            const formData = new FormData();

                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );

                            /* peticion ajax */
                            axios.post(this.url + 'upload-image/' + ventasId, formData)
                                .then(res => {
                                    if (res.data.venta) {
                                        this.setState({
                                            ventas: res.data.venta,
                                            status: "success"
                                        })
                                    } else {
                                        this.setState({
                                            ventas: res.data.venta,
                                            status: "failed"
                                        })
                                    }
                                })

                        } else {
                            this.setState({
                                status: "success"
                            })
                        }
                    } else {
                        this.setState({
                            status: "failed"
                        })
                    }
                })

        } else {
            this.setState({
                status: "failed"
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
    fileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    render() {

        if (this.state.status === "success") {
            return <Redirect to="/ventas" />
        }


        
        var norte=false, sur=false, centro=false;

        if(this.state.ventas.sucursal === "norte"){
            norte=true;
        }else if(this.state.ventas.sucursal === "sur"){
            sur=true;
        }else{
            centro=true
        }


        return (
            <div id="productForm">
                <Slider
                    title="Formuario Editar Productos"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de Productos */}
                        {this.state.ventas.producto &&
                            <form className="mid-form" onSubmit={this.saveVentas} >
                                
                                <div className="form-group">
                                    <label htmlFor="cliente">Cliente</label>
                                    <select name="cliente" value={this.state.ventas.cliente}  ref={this.clienteRef} onChange={this.changeState}>
                                        <option>Seleccion el Cliente</option>

                                        {this.state.customers.map(cliente => (
                                            <option key={cliente._id} defaultValue={cliente.nombreApellido}>{cliente.nombreApellido}</option>

                                        ))}

                                    </select>

                                </div>

                                <div className="form-group">
                                    <label htmlFor="vendedor">Vendedor</label>
                                    <select name="vendedor" value={this.state.ventas.vendedor}  ref={this.vendedorRef} onChange={this.changeState}>
                                        <option>Seleccion el Vendedor</option>

                                        {this.state.usuarios.map(usuario => (
                                            <option key={usuario._id} defaultValue={usuario.nombreApellido}>{usuario.nombreApellido}</option>

                                        ))}
                                    </select>

                                </div>

                                <div class="form-group radibuttons">
                                    <label htmlFor="sucursal">Sucursal </label>
                                    <input type="radio" name="sucursal" defaultChecked={norte} value="norte" ref={this.SucursalNorteRef} onChange={this.changeState} /> Norte
                                    <input type="radio" name="sucursal" defaultChecked={sur} value="sur" ref={this.SucursalSurRef} onChange={this.changeState} /> Sur
                                    <input type="radio" name="sucursal" defaultChecked={centro} value="centro" ref={this.SucursalCentroRef} onChange={this.changeState} /> Centro
                                    {this.validator.message('sucursal', this.state.ventas.sucursal, 'required')}
                                </div>

                                <div className="clearfix"></div>

                                <div className="form-group">
                                    <label htmlFor="producto">Producto</label>
                                    <select name="producto" value={this.state.ventas.producto}  ref={this.productoRef} onChange={this.changeState}>
                                        <option>Seleccion el Producto</option>

                                        {this.state.productos.map(producto => (
                                            <option key={producto._id} defaultValue={producto.title}>{producto.title}</option>

                                        ))}
                                    </select>

                                </div>

                                <div className="form-group">
                                    <label htmlFor="precio">Precio</label>
                                    <input type="number" name="precio" value={this.state.ventas.precio}  ref={this.precioRef} onChange={this.changeState} />
                                    {this.validator.message('precio', this.state.ventas.precio, 'required|numeric|min:0,num')}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cantidad">Cantidad</label>
                                    <input type="number" name="cantidad"value={this.state.ventas.cantidad}  ref={this.cantidadRef} onChange={this.changeState} />
                                    {this.validator.message('cantidad', this.state.ventas.cantidad, 'required|numeric|min:0,num')}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="total">Total</label>
                                    <input type="number" readOnly value={this.state.ventas.total}  name="total" ref={this.totalRef} onChange={this.changeState} />
                                    {this.validator.message('total', this.state.ventas.total, 'required|numeric|min:0,num')}
                                </div>






                                <div className="clearfix"></div>

                                <input type="submit" value="Enviar" className="btn btn-info" />

                            </form>
                        }
                        {!this.state.ventas.producto &&
                            <h2 className="subheader">Cargando...</h2>
                        }

                    </div>
                    <Sidebar
                        ventas="true"
                    />
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default VentaFormEdit;
