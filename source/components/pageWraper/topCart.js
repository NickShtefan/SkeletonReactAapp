var React  = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;


var topCart = React.createClass({
render() {
        <div className="top-cart">
            <Glyphicon glyph="shopping-cart"/>{this.props.cart.count} — {this.props.cart.total}
        </div>
    }
});

module.exports = topCart;