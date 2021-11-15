import React, { Component } from 'react';

import Slider from './Slider'
import Sidebar from './Sidebar';
import ProductListHome from './ProductListHome';

class Home extends Component {




    render() {


        return (
            <div id="home">
                <Slider
                    title="Bienvenido a la aplicación web de ventas MisionTIC2022"
                    btn="Productos"
                    size="slider-big"
                />

                <div className="center">
                    <div id="content">
                        {/*  */}
                        <h1 className="subheader">Ultimos Productos</h1>
                        <ProductListHome 
                            home="true"
                        />

                    </div>
                    <Sidebar />
                       {/*  LIMPIAR FLOTADOS */}
                    <div className="clearfix"></div>
                </div>
                
            </div>

        );
    }
}

export default Home;
