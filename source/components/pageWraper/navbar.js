/**
 * Created by Anton on 09.03.2015.
 */

'use strict';

var React  = require('react');
var {Navbar, Nav, NavItem} = require('react-bootstrap').Navbar;


var navbarInstance = React.createClass({
    render() {
        <Navbar>
            <Nav>
                <NavItem eventKey={1} href="#">Link</NavItem>
                <NavItem eventKey={2} href="#">Link</NavItem>
                <NavItem eventKey={2} href="#">Link</NavItem>
            </Nav>
        </Navbar>
    }
});

module.exports = navbarInstance;