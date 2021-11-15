import React, { Component } from 'react';


import { Redirect, Link } from 'react-router-dom';

import { LogoutButton } from "./Logout";
import { Profile } from "./Profile";

class Sidebar extends Component {

    searchRef = React.createRef();

    state = {
        search: "",
        redirect: false
    };

    redirectToSearch = (e) => {
        e.preventDefault();

        this.setState({
            search: this.searchRef.current.value,
            redirect: true
        });

    }

    render() {

        if (this.state.redirect) {
            return (
                <Redirect to={'/redirect/' + this.state.search} />
            );
        }

        return (

            <aside id="sidebar">
                {this.props.productos === "true" &&
                    <div id="nav-blog" className="sidebar-item">
                        <h3>Puedes hacer esto</h3>
                        <Link to="/productos/crear" className="btn btn-success" >Crear Productos</Link>
                    </div>
                }
                {this.props.clientes === "true" &&
                    <div id="clientes">
                        <div id="nav-blog" className="sidebar-item">
                            <h3>Puedes hacer esto</h3>
                            <Link to="/clientes/crear" className="btn btn-success">Crear Clientes</Link>
                        </div>
                    </div>
                }
                {this.props.usuarios === "true" &&
                    <div id="nav-blog" className="sidebar-item">
                        <h3>Puedes hacer esto</h3>
                        <Link to="/usuarios/crear" className="btn btn-success">Crear Usuarios</Link>
                    </div>



                }
                {this.props.ventas === "true" &&
                    <div id="nav-blog" className="sidebar-item">
                        <h3>Puedes hacer esto</h3>
                        <Link to="/ventas/crear" className="btn btn-success">Crear Ventas</Link>

                    </div>
                }

                <div id="search" className="sidebar-item">
                    <h3>Buscador</h3>
                    <p>Encuentra el producto que buscas</p>
                    <form onSubmit={this.redirectToSearch}>
                        <input type="text" name="search" ref={this.searchRef} />
                        <input type="submit" name="submit" value="Buscar" className="btn btn-dark" />
                    </form>
                </div>
                <div id="login" className="sidebar-item">
                    <h3>Usuario Logueado</h3>
                    <Profile />
                    <LogoutButton />

                </div>
            </aside>

        );
    }
}

export default Sidebar;