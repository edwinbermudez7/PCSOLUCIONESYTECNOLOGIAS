import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class VentaForm extends Component {

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
        selectedFile: null
    };


    componentWillMount() {
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

       

        console.log(this.state.ventas);
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveVentas = (e) => {
        e.preventDefault();
        this.changeState();
        if (this.validator.allValid()) {


            axios.post(this.url + 'save-venta', this.state.ventas)
                .then(res => {
                    if (res.data.venta) {
                        this.setState({
                            ventas: res.data.venta,
                            status: "waiting"
                        })

                        swal(
                            'Venta Creada',
                            'La venta ha sido creado correctamente',
                            'success'
                        );

                        /* Subir Imagen */
                        if (this.state.selectedFile !== null) {
                            /* Sacar el ID del Venta guardado */
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
        return (
            <div id="VentaForm">
                <Slider
                    title="Formuario Ventas"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de Productos */}
                        <form className="mid-form" onSubmit={this.saveVentas} >
                            

                            <div className="form-group">
                                <label htmlFor="cliente">Cliente</label>
                                <select name="cliente" ref={this.clienteRef} onChange={this.changeState}>
                                    <option>Seleccion el Cliente</option>

                                    {this.state.customers.map(cliente => (
                                        <option key={cliente._id} defaultValue={cliente.nombreApellido}>{cliente.nombreApellido}</option>

                                    ))}

                                </select>

                            </div>

                            <div className="form-group">
                                <label htmlFor="vendedor">Vendedor</label>
                                <select name="vendedor" ref={this.vendedorRef} onChange={this.changeState}>
                                    <option>Seleccion el Vendedor</option>

                                    {this.state.usuarios.map(usuario => (
                                        <option key={usuario._id} defaultValue={usuario.nombreApellido}>{usuario.nombreApellido}</option>

                                    ))}
                                </select>

                            </div>

                            <div class="form-group radibuttons">
                                <label htmlFor="sucursal">Sucursal </label>
                                <input type="radio" name="sucursal" value="norte" ref={this.SucursalNorteRef} onChange={this.changeState} /> Norte
                                <input type="radio" name="sucursal" value="sur" ref={this.SucursalSurRef} onChange={this.changeState} /> Sur
                                <input type="radio" name="sucursal" value="centro" ref={this.SucursalCentroRef} onChange={this.changeState} /> Centro
                                {this.validator.message('sucursal', this.state.ventas.sucursal, 'required')}
                            </div>

                            <div className="clearfix"></div>

                            <div className="form-group">
                                <label htmlFor="producto">Producto</label>
                                <select name="producto" ref={this.productoRef} onChange={this.changeState}>
                                    <option>Seleccion el Producto</option>

                                    {this.state.productos.map(producto => (
                                        <option key={producto._id} defaultValue={producto.title}>{producto.title}</option>

                                    ))}
                                </select>

                            </div>

                            <div className="form-group">
                                <label htmlFor="precio">Precio</label>
                                <input type="number" name="precio" ref={this.precioRef} onChange={this.changeState} />
                                {this.validator.message('precio', this.state.ventas.precio, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cantidad">Cantidad</label>
                                <input type="number" name="cantidad" ref={this.cantidadRef} onChange={this.changeState} />
                                {this.validator.message('cantidad', this.state.ventas.cantidad, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="total">Total</label>
                                <input type="number" readOnly name="total" ref={this.totalRef} onChange={this.changeState} />
                                {this.validator.message('total', this.state.ventas.total, 'required|numeric|min:0,num')}
                            </div>






                            <div className="clearfix"></div>

                            <input type="submit" value="Enviar" className="btn btn-info" />

                        </form>
                    </div>
                    <Sidebar
                        productos="true"
                    />
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default VentaForm;
