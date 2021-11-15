import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class ClienteFormEdit extends Component {

    url = Global.url;
    clienteId = null;

    documentoRef = React.createRef();
    nombreApellidoRef = React.createRef();
    telefonoRef = React.createRef();
    correoRef = React.createRef();

    state = {
        clientes: {},
        status: null,
        selectedFile: null
    };

    componentWillMount() {
        this.clienteId = this.props.match.params.id;
        console.log(this.clienteId);
        this.getCliente(this.clienteId);
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este Campo es Requerido'
            }
        });
    }

    getCliente = (id) => {
        axios.get(this.url + 'cliente/' + id)
            .then(res => {
                this.setState({
                    clientes: res.data.cliente
                })
            })
    }

    changeState = () => {
        this.setState({
            clientes: {
                documento: this.documentoRef.current.value,
                nombreApellido: this.nombreApellidoRef.current.value,
                telefono: this.telefonoRef.current.value,
                correo: this.correoRef.current.value
            }
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveClientes = (e) => {

        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {


            axios.put(this.url + 'cliente/' + this.clienteId, this.state.clientes)
                .then(res => {
                    if (res.data.cliente) {
                        this.setState({
                            clientes: res.data.cliente,
                            status: "waiting"
                        })

                        swal(
                            'Cliente Actualizado',
                            'El Cliente ha sido Actualizado correctamente',
                            'success'
                        );

                        /* Subir Imagen */
                        if (this.state.selectedFile !== null) {
                            /* Sacar el ID del Cliente guardado */
                            var clienteId = this.state.clientes._id;

                            /* Crear form data y añadir fichero */
                            const formData = new FormData();

                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );

                            /* peticion ajax */
                            axios.post(this.url + 'upload-image/' + clienteId, formData)
                                .then(res => {
                                    if (res.data.cliente) {
                                        this.setState({
                                            clientes: res.data.cliente,
                                            status: "success"
                                        })
                                    } else {
                                        this.setState({
                                            clientes: res.data.cliente,
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
            return <Redirect to="/clientes" />
        }
        return (
            <div id="clienteForm">
                <Slider
                    title="Formuario Editar clientes"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de clientes */}
                        {this.state.clientes.documento &&
                            <form className="mid-form" onSubmit={this.saveClientes} >
                                <div className="form-group">
                                    <label htmlFor="documento">Documento Identidad</label>
                                    <input type="number" name="documento" defaultValue={this.state.clientes.documento} ref={this.documentoRef} onChange={this.changeState} />
                                    {this.validator.message('documento', this.state.clientes.documento, 'required|numeric|min:0,num')}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="nombreApellido">Nombre del Cliente</label>
                                    <input type="text" name="nombreApellido" defaultValue={this.state.clientes.nombreApellido} ref={this.nombreApellidoRef} onChange={this.changeState} />
                                    {this.validator.message('nombreApellido', this.state.clientes.nombreApellido, 'required|alpha_num_space')}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telefono">Telefono</label>
                                    <input type="number" name="telefono" defaultValue={this.state.clientes.telefono} ref={this.telefonoRef} onChange={this.changeState} />
                                    {this.validator.message('telefono', this.state.clientes.telefono, 'required|numeric|min:0,num')}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="correo">Correo</label>
                                    <input type="email" name="correo" defaultValue={this.state.clientes.correo} ref={this.correoRef} onChange={this.changeState} />
                                    {this.validator.message('correo', this.state.clientes.correo, 'required')}
                                </div>

                            
                                <div className="clearfix"></div>

                                <input type="submit" value="Enviar" className="btn btn-info" />

                            </form>
                        }
                        {!this.state.clientes.documento &&
                            <h2 className="subheader">Cargando...</h2>
                        }

                    </div>
                    <Sidebar
                        clientes="true"
                    />
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default ClienteFormEdit;
