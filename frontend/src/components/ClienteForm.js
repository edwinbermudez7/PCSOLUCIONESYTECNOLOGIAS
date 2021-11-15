import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class ClienteForm extends Component {

    url = Global.url;

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
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este Campo es Requerido'


            }
        });

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


            axios.post(this.url + 'save-cliente', this.state.clientes)
                .then(res => {
                    if (res.data.cliente) {
                        this.setState({
                            clientes: res.data.cliente,
                            status: "waiting"
                        })

                        swal(
                            'Cliente Creado',
                            'El Cliente ha sido creado correctamente',
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
                    title="Formuario Clientes"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de clientes */}
                        <form className="mid-form" onSubmit={this.saveClientes} >

                            <div className="form-group">
                                <label htmlFor="documento">Documento Identidad</label>
                                <input type="number" name="documento" ref={this.documentoRef} onChange={this.changeState} />
                                {this.validator.message('documento', this.state.clientes.documento, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nombreApellido">Nombre del Cliente</label>
                                <input type="text" name="nombreApellido" ref={this.nombreApellidoRef} onChange={this.changeState} />
                                {this.validator.message('nombreApellido', this.state.clientes.nombreApellido, 'required|alpha_num_space')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono">Telefono</label>
                                <input type="number" name="telefono" ref={this.telefonoRef} onChange={this.changeState} />
                                {this.validator.message('telefono', this.state.clientes.telefono, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="correo">Correo</label>
                                <input type="email" name="correo" ref={this.correoRef} onChange={this.changeState} />
                                {this.validator.message('correo', this.state.clientes.correo, 'required')}
                            </div>

                            <div className="clearfix"></div>

                            <input type="submit" value="Enviar" className="btn btn-info" />

                        </form>
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

export default ClienteForm;
