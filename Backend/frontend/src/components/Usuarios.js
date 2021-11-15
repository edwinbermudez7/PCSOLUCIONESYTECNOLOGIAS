import React, { Component } from 'react';

import Slider from './Slider'
import Sidebar from './Sidebar';
import UsuarioList from './UsuarioList';

class Usuarios extends Component {
    render() {


        return (
            <div id="usuarios">
                <Slider
                    title="Usuarios"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">
                        {/* Listado de Usuarios */}
                        <UsuarioList />
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

export default Usuarios;
