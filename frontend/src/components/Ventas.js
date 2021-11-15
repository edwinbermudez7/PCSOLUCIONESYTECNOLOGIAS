import React, { Component } from 'react';

import Slider from './Slider'
import Sidebar from './Sidebar';
import VentasList from './VentasList';

class Ventas extends Component {
    render() {


        return (
            <div id="ventas">
                <Slider
                    title="Ventas"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">
                        {/* Listado de Ventas */}
                        <VentasList />
                    </div>
                    <Sidebar
                        ventas="true"
                    />
                    <div className="clearfix"></div>
                </div>

            </div>

        );
    }
}

export default Ventas;
