import React, { useState} from 'react';
import './Tutorial.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import ClickSelect from './ClickSelect';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Tutorial() {
    const wi = 1920;
    const hi = 1080;
    const ws = window.screen.width;
    const hs = window.screen.height;
    const ratio = Math.min((wi / ws), (hi / hs));
    const scale = 1 / ratio;
    const [start, setStart] = useState(false);
    const [tutorial, setTutorial] = useState(false);
    const [cursor, setCursor] = useState('Select');
    const [sound, setSound] = useState('On');

    function ItemCard(props) {
        return (
            <Card style={{ width: 450, margin: 'auto' }} >
                <Card.Img style={{objectFit: 'contain'}} variant="top" src={props.image} />
                <Card.Body>
                    <Card.Title style={{ color: '#212529', fontSize: 20, fontFamily: 'Inter-Bold'}}> {props.title} </Card.Title>
                    <Card.Text style={{ color: '#212529', fontSize: 16, fontFamily: 'Inter-Regular', textAlign: 'left' }}>
                        {props.content}
                    </Card.Text>
                </Card.Body>
                <Card.Footer style={{ color: '#6c757d', fontSize: 16, fontFamily: 'Inter-Regular' }}>
                    <small className="text-muted"> Card {props.item} of 5 </small>
                </Card.Footer>
            </Card>
        );
    }
    
    const onGame = () => {
        setStart(true);
    }

    const onTutorial = () => {
        setTutorial(true);
    }

    const onCursor = () => {
        if (cursor === 'Select') {
            setCursor('Drag');
        }
        else {
            setCursor('Select');
        }
    }

    const onSound = () => {
        if (sound === 'On') {
            setSound('Off');
        }
        else {
            setSound('On');
        }
    }

    if (start && cursor === 'Select') {
        return (
            <ClickSelect />
        );
    }
    else if (start && cursor === 'Drag') {
        return (
            <App />
        );
    }
    else if (tutorial) {
        return (
            <div className="Tutorial">
                <header className="Tutorial-header">
                    <div id="container" style={{ zoom: scale, margin: 'auto'}} >
                        <Carousel interval={null} style={{ width: 600, height: 550, margin: 'auto'}}>
                            <Carousel.Item>
                                <ItemCard image='./select/1.png' button={false} title='Basic Rules' item='1'
                                    content='
                                    The rules of peg solitaire are simple.
                                    1) You are allowed to jump over pegs horizontally or vertically.
                                    2) But you can only jump over a peg two positions away.
                                    3) The game is won when there is 1 remaining peg in the center of the board.
                                    That&apos;s it!'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./select/2.png' button={false} title='Step One' item='2'
                                    content='The next few slides will teach you the controls of the game.
                                    To move a peg over another peg, hover over your desired peg and select it, as seen above.'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./select/3.png' button={true} title='Step Two' item='3'
                                    content='Once you have selected your peg, the game will show which moves you can make.
                                    A green circle indicates a possible move, whereas a yellow circle indicates your currently selected peg.'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./select/4.png' button={true} title='Step Three' item='4'
                                    content='To move your currently selected peg over the white peg, hover over to the green circle.
                                    Then select it.'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <ItemCard image='./select/5.png' button={true} title='Step Four' item='5'
                                    content='After selecting the green circle, your peg will automatically move to your desired position.
                                    Repeat this action and leave 1 peg remaining in the center of the board to win!'
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </header>
            </div>
        );
    }
    else {
        return (
            <div className="Tutorial">
                <header className="Tutorial-header">
                    <div id="container" style={{ zoom: scale, margin: 'auto'}} >
                        <div style={{ marginBottom: 60, color: '#ffffff', fontSize: 140, fontFamily: 'Dosis-ExtraBold', textShadow: '0px 10px 0 #434596'}}>
                            Peg Solitaire
                        </div>
                        
                        <custom-div>
                            <button onClick={onGame} style={{ width: 340, height: 130, margin: 20, outline: 'none' }} className='game'>
                                Play Game
                            </button>

                            <button onClick={onTutorial} style={{ width: 340, height: 130, margin: 20, outline: 'none' }} className='tutorial'>
                                Tutorial
                            </button>

                            <button onClick={onCursor} style={{ width: 340, height: 130, margin: 20, outline: 'none' }} className='cursor'>
                                Cursor: {cursor}
                            </button>

                            <button onClick={onSound} style={{ width: 340, height: 130, margin: 20, outline: 'none' }} className='sound'>
                                Sound: {sound}
                            </button>
                        </custom-div>
                    </div>
                </header>
            </div>
        );
    }
}

export default Tutorial;