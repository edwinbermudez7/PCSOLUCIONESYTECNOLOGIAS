import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class UsuarioForm extends Component {

    url = Global.url;

    documentoRef = React.createRef();
    nombreApellidoRef = React.createRef();
    telefonoRef = React.createRef();
    correoRef = React.createRef();
    SucursalNorteRef = React.createRef();
    SucursalSurRef = React.createRef();
    SucursalCentroRef = React.createRef();
    RolVendedorRef = React.createRef();
    RolAdministradorRef = React.createRef();

    state = {
        usuarios: {},
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

        var rol="Vendedor";
        if(this.RolAdministradorRef.current.checked){
            rol = this.RolAdministradorRef.current.value;
        }else if(this.RolVendedorRef.current.checked){
            rol= this.RolVendedorRef.current.value;
        }

        var sucursal = "Norte"
        if(this.SucursalNorteRef.current.checked){
            sucursal = this.SucursalNorteRef.current.value;
        }else if(this.SucursalSurRef.current.checked){
            sucursal = this.SucursalSurRef.current.value;
        }else if(this.SucursalCentroRef.current.checked){
            sucursal = this.SucursalCentroRef.current.value;
        }


        this.setState({
            usuarios: {
                documento: this.documentoRef.current.value,
                nombreApellido: this.nombreApellidoRef.current.value,
                telefono: this.telefonoRef.current.value,
                correo: this.correoRef.current.value,
                rol:rol,
                sucursal:sucursal
            }
        });
        
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveUsuarios = (e) => {
        e.preventDefault();
        this.changeState();
        if (this.validator.allValid()) {


            axios.post(this.url + 'save-user', this.state.usuarios)
                .then(res => {
                    if (res.data.user) {
                        this.setState({
                            usuarios: res.data.user,
                            status: "waiting"
                        })

                        swal(
                            'Usuario Creado',
                            'El Usuario ha sido creado correctamente',
                            'success'
                        );

                        /* Subir Imagen */
                        if (this.state.selectedFile !== null) {
                            /* Sacar el ID del usuario guardado */
                            var usuarioId = this.state.usuarios._id;

                            /* Crear form data y añadir fichero */
                            const formData = new FormData();

                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );

                            /* peticion ajax */
                            axios.post(this.url + 'upload-image-user/' + usuarioId, formData)
                                .then(res => {
                                    if (res.data.user) {
                                        this.setState({
                                            usuarios: res.data.user,
                                            status: "success"
                                        })
                                    } else {
                                        this.setState({
                                            usuarios: res.data.user,
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
            return <Redirect to="/usuarios" />
        }
        return (
            <div id="UsuarioForm">
                <Slider
                    title="Formuario Usuario"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de usuarios */}
                        <form className="mid-form" onSubmit={this.saveUsuarios} >
                            <div className="form-group">
                                <label htmlFor="documento">Documento</label>
                                <input type="number" name="documento" ref={this.documentoRef} onChange={this.changeState} />
                                {this.validator.message('documento', this.state.usuarios.documento, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nombreApellido">Nombre Completo</label>
                                <input type="text" name="nombreApellido" ref={this.nombreApellidoRef} onChange={this.changeState} />
                                {this.validator.message('nombreApellido', this.state.usuarios.nombreApellido, 'required|alpha_num_space')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono">Telefono</label>
                                <input type="number" name="telefono" ref={this.telefonoRef} onChange={this.changeState} />
                                {this.validator.message('telefono', this.state.usuarios.telefono, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="correo">Correo</label>
                                <input type="email" name="correo" ref={this.correoRef} onChange={this.changeState} />
                                {this.validator.message('correo', this.state.usuarios.correo, 'required')}
                            </div>

                            <div class="form-group radibuttons">
                            <label htmlFor="sucursal">Sucursal </label>
                                <input type="radio" name="sucursal" value="norte" ref={this.SucursalNorteRef} onChange={this.changeState}  /> Norte
                                <input type="radio" name="sucursal" value="sur" ref={this.SucursalSurRef} onChange={this.changeState} /> Sur
                                <input type="radio" name="sucursal" value="centro"ref={this.SucursalCentroRef} onChange={this.changeState} /> Centro
                                {this.validator.message('sucursal', this.state.usuarios.sucursal, 'required')}
                            </div>

                            <div className="clearfix"></div>
                       

                            <div className="form-group">
                                <label htmlFor="file0">Imagen</label>
                                <input type="file" name="file0" onChange={this.fileChange} />
                            </div>

                            <div class="form-group radibuttons">
                                <label htmlFor="rol">Rol</label>
                                <input type="radio" name="rol" value="administrador" ref={this.RolAdministradorRef}  onChange={this.changeState} /> Administrador
                                <input type="radio" name="rol" value="vendedor" ref={this.RolVendedorRef}   onChange={this.changeState} /> Vendedor
                                {this.validator.message('rol', this.state.usuarios.rol, 'required')}
                            </div>


                            <div className="clearfix"></div>

                            <input type="submit" value="Enviar" className="btn btn-info" />

                        </form>
                    </div>
                    <Sidebar
                        usuarios="true"
                    />
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default UsuarioForm;
