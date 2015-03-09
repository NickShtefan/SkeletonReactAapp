
'use strict';

var React  = require('react');
var Navbar = require('./navbar');
var TopCart = require('./topCart');

var CartProps = {
    getDefaultProps: function() {
        return {
            cart: {
                count: 0,
                total: 0
            }
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            cart: nextProps.count > this.props.count
        });
        this.setState({
            cart: nextProps.total > this.props.total
        });
    }
};

export default React.createClass({
    mixin: [CartProps],
    render() {
        <div className="container-fluid">
            <Navbar/>
            <img src={'http://placehold.it/400x20&text=slide1'} alt="Logo" className="logo-img"/>
            <TopCart {...this.props.cart}/>
            <Navbar/>
            //TODO <Vidget/> Создать подключаемые виджеты
            //TODO <Footer/>
        </div>
    }
});