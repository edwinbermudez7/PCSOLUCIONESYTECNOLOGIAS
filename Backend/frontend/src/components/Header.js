import React, { Component } from 'react';
import logo from '../assets/images/react.svg';
import { NavLink } from 'react-router-dom';

class Header extends Component {
    render() {


        return (
            <header id="header">
                <div className="center">
                    {/*  LOGO  */}
                    <div id="logo">
                        <img src={logo} className="app-logo" alt="Logotipo" />
                        <span id="brand">
                            <strong>ventas </strong>MisionTIC2022
                        </span>
                    </div>

                    {/*  MENU  */}
                    <nav id="menu">
                        <ul>
                            <li>
                                <NavLink to="/home" activeClassName="active">Inicio</NavLink>
                            </li>
                            <li>
                                <NavLink to="/productos" activeClassName="active">Productos</NavLink>
                            </li>
                            <li>
                                <NavLink to="/clientes" activeClassName="active">Clientes</NavLink>
                            </li>
                            <li>
                                <NavLink to="/usuarios" activeClassName="active">Usuarios</NavLink>
                            </li>
                            <li>
                                <NavLink to="/ventas" activeClassName="active">Ventas</NavLink>
                            </li>
                        </ul>
                    </nav>

                 
                </div>
            </header>
        );
    }
}

export default Header;