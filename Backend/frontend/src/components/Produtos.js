import React, { Component } from 'react';

import Slider from './Slider';
import Sidebar from './Sidebar';
import ProductList from './ProductList';

class Productos extends Component {


    render() {



        return (
            <div id="productos">
                <Slider
                    title="Productos"
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">
                        {/* Listado de Productos */}
                        <ProductList />
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

export default Productos;
