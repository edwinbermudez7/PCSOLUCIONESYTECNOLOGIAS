import React, { Component } from 'react';

import Slider from './Slider';
import Sidebar from './Sidebar';
import ClienteList from './ClienteList'

class CLientes extends Component {
    render() {


        return (
            <div id="clientes">
                <Slider
                    title="Clientes"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">
                        {/* Listado de Clientes */}
                        <ClienteList />
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

export default CLientes;
