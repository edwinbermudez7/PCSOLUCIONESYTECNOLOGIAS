import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../Global';
import Slider from './Slider'
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';

class ProductForm extends Component {

    url = Global.url;

    titleRef = React.createRef();
    descriptionRef = React.createRef();
    priceRef = React.createRef();
    stopRef = React.createRef();

    state = {
        productos: {},
        status: null,
        selectedFile: null
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este Campo es Requerido --'
              
              
            }
          });

    }

    changeState = () => {
        this.setState({
            productos: {
                title: this.titleRef.current.value,
                description: this.descriptionRef.current.value,
                price: this.priceRef.current.value,
                stop: this.stopRef.current.value
            }
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveProductos = (e) => {
        e.preventDefault();
        this.changeState();
        if (this.validator.allValid()) {


            axios.post(this.url + 'save-produc', this.state.productos)
                .then(res => {
                    if (res.data.product) {
                        this.setState({
                            productos: res.data.product,
                            status: "waiting"
                        })

                        swal(
                            'Producto Creado',
                            'El Producto ha sido creado correctamente',
                            'success'
                        );

                        /* Subir Imagen */
                        if (this.state.selectedFile !== null) {
                            /* Sacar el ID del Producto guardado */
                            var productId = this.state.productos._id;

                            /* Crear form data y añadir fichero */
                            const formData = new FormData();

                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );

                            /* peticion ajax */
                            axios.post(this.url + 'upload-image/' + productId, formData)
                                .then(res => {
                                    if (res.data.product) {
                                        this.setState({
                                            productos: res.data.product,
                                            status: "success"
                                        })
                                    } else {
                                        this.setState({
                                            productos: res.data.product,
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
            return <Redirect to="/productos" />
        }
        return (
            <div id="productForm">
                <Slider
                    title="Formuario Productos"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">


                        {/* crear un Formulario de Productos */}
                        <form className="mid-form" onSubmit={this.saveProductos} >
                            <div className="form-group">
                                <label htmlFor="title">Nombre del Producto</label>
                                <input type="text" name="title" ref={this.titleRef} onChange={this.changeState} />
                                {this.validator.message('title', this.state.productos.title, 'required|alpha_num_space')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Descripcion</label>
                                <textarea name="description" ref={this.descriptionRef} onChange={this.changeState} ></textarea>
                                {this.validator.message('description', this.state.productos.description, 'required')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Precio</label>
                                <input type="number" name="price" ref={this.priceRef} onChange={this.changeState} />
                                {this.validator.message('price', this.state.productos.price, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="stop">Cantidad</label>
                                <input type="number" name="stop" ref={this.stopRef} onChange={this.changeState} />
                                {this.validator.message('stop', this.state.productos.stop, 'required|numeric|min:0,num')}
                            </div>

                            <div className="form-group">
                                <label htmlFor="file0">Imagen</label>
                                <input type="file" name="file0" onChange={this.fileChange} />
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

export default ProductForm;
