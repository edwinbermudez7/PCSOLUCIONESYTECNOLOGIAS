import React, { Component } from 'react';

import Slider from './Slider';
import Sidebar from './Sidebar';
import ProductList from './ProductList';

class Search extends Component {


    render() {

        var searched = this.props.match.params.search;

        return (
            <div id="productos">
                <Slider
                    title={"Busqueda: "+searched}
                    size="slider-small"
                />

                <div className="center">
                    <div id="content">
                        {/* Listado de Productos */}
                        <ProductList 
                            search={searched}
                        
                        />
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

export default Search;
