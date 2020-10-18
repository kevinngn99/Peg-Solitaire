import React from 'react';
import './Tutorial.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';

function ItemCard(props) {
    return (
        <Card style={{ width: 330, display: 'flex', flexWrap: 'wrap' }} >
            <Card.Img variant="top" src="./img.svg" />
            <Card.Body>
                <Card.Title style={{ color: '#212529', fontSize: 20 }}> {props.title} </Card.Title>
                <Card.Text style={{ color: '#212529', fontSize: 16, textAlign: 'left' }}>
                    This is a wider card with supporting text below as a natural lead-in to additional content.
                    This card has even longer content than the first to show that equal height action.
                </Card.Text>
            </Card.Body>
            <Card.Footer style={{ color: '#6c757d', fontSize: 16 }}>
                <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
        </Card>
    );
}

function Tutorial() {
    return (
        <div className="Tutorial">
            <header className="Tutorial-header">
                <div id="container" style={{ width: window.innerWidth, height: window.innerHeight }} >
                    <ItemCard title='Card 1'/>
                </div>
            </header>
        </div>
    );
}

export default Tutorial;