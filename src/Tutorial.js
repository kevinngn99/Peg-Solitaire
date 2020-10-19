import React, { useState} from 'react';
import './Tutorial.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Tutorial() {
    const [start, setStart] = useState(false);

    function ItemCard(props) {
        const onclick = () => {
            setStart(true);
        }
    
        return (
            <Card style={{ width: 330, height: 440, margin: 'auto' }} >
                <Card.Img style={{objectFit: 'contain'}} variant="top" src={props.image} />
                <Card.Body>
                    <Card.Title style={{ color: '#212529', fontSize: 20, fontFamily: 'DMSans', fontWeight: 'bold'}}> {props.title} </Card.Title>
                    <Card.Text style={{ color: '#212529', fontSize: 16, fontFamily: 'DMSans', fontWeight: 'normal', textAlign: 'left' }}>
                        {!props.button ? props.content : <div> <p>{props.content}</p> {<Button onClick={onclick} variant="primary">Start Game!</Button>} </div>}
                    </Card.Text>
                </Card.Body>
                <Card.Footer style={{ color: '#6c757d', fontSize: 16, fontFamily: 'DMSans', fontWeight: 'normal' }}>
                    <small className="text-muted"> Card {props.item} of 3 </small>
                </Card.Footer>
            </Card>
        );
    }

    if (start) {
        return (
            <App />
        );
    }
    else {
        return (
            <div className="Tutorial">
                <header className="Tutorial-header">
                    <div id="container" style={{ width: window.innerWidth, margin: 'auto'}} >
                        <Carousel interval={null} style={{ width: 500, height: 500, margin: 'auto'}}>
                            <Carousel.Item>
                                <ItemCard image='./example.gif' button={false} title='How to Play?' item='1'
                                    content='
                                    You are allowed to jump over pegs horizontally or vertically.
                                    But you can only jump over a peg into a hole that is two positions away.
                                    The game is won when there is 1 peg in the center of the board.
                                    That&apos;s it!'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./watch.jpg' button={false} title='What to Expect?' item='2'
                                    content='There will be 3 rounds.
                                    Each round increases in difficulty.
                                    There is a time limit of 3 minutes.
                                    If you go over time, the game is stopped.
                                    The game is also stopped when you run out of possible moves.'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./peg_solitaire.jpg' button={true} title='Let&apos;s Play!' item='3'
                                    content='Review the cards again if you are uncertain of the rules.
                                    Otherwise, click the button below to begin the first round of the game!'
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </header>
            </div>
        );
    }
}

export default Tutorial;