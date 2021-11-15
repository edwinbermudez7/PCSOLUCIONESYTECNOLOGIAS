import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';


import Error from './components/Error';
import Header from './components/Header';


import Footer from './components/Footer';
import Home from './components/Home';
import Productos from './components/Produtos';
import CLientes from './components/Clientes';
import Usuarios from './components/Usuarios';
import Ventas from './components/Ventas';
import ProductForm from './components/ProductForm';
import Search from './components/Search';
import ProductFormEdit from './components/ProductFormEdit';

import ClienteForm from './components/ClienteForm';
import ClienteFormEdit from './components/ClienteFormEdit';

import UsuarioForm from './components/UsuarioForm';
import UsuarioFormEdit from './components/UsuarioFormEdit';

import VentaForm from './components/VentaForm';
import VentaFormEdit from './components/VentaFormEdit';

class Router extends Component {
    render() {
        return (

            <BrowserRouter>
                <Header />


                {/* Configurar Rutas y Paginas */}
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/home' component={Home} />
                    <Route exact path="/productos" component={Productos} />
                    <Route exact path="/productos/busqueda/:search" component={Search} />
                    <Route exact path="/redirect/:search" render={
                        (props) => {
                            var search = props.match.params.search;
                            return (
                                <Redirect to={'/productos/busqueda/' + search} />
                            );

                        }
                    } />
                    <Route exact path="/productos/crear" component={ProductForm} />
                    <Route exact path="/productos/editar/:id" component={ProductFormEdit} />
                    

                    <Route exact path="/clientes" component={CLientes} />
                    <Route exact path="/clientes/crear" component={ClienteForm} />
                    <Route exact path="/clientes/editar/:id" component={ClienteFormEdit} />
                    


                    <Route exact path="/usuarios" component={Usuarios} />
                    <Route exact path="/usuarios/crear" component={UsuarioForm} />
                    <Route exact path="/usuarios/editar/:id" component={UsuarioFormEdit} />


                    <Route exact path="/ventas" component={Ventas} />
                    <Route exact path="/ventas/crear" component={VentaForm} />
                    <Route exact path="/ventas/editar/:id" component={VentaFormEdit} />
                 

                    <Route component={Error} />

                </Switch>



                
                <Footer />

            </BrowserRouter>
        );
    }
}

export default Router;
