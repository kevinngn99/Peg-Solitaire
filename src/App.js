import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js';

function App() {
  const [app, setApp] = useState(new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x4e214d, resolution: window.devicePixelRatio || 1 }));

  useEffect(() => {
    document.getElementById('container').appendChild(app.view);

    const container = new PIXI.Container();
    const empty = PIXI.Texture.from('./empty.png');
    const peg = PIXI.Texture.from('./peg.png');
    const border = PIXI.Texture.from('./border.png');

    app.stage.addChild(container);

    const emptySprite = new PIXI.Sprite(empty);
    emptySprite.anchor.set(0.5);
    emptySprite.x = (24 % 7) * 95;
    emptySprite.y = Math.floor(24 / 7) * 95;
    container.addChild(emptySprite);

    let banned = new Set();
    banned.add(((0 % 7) * 95).toString().concat((Math.floor(0 / 7) * 95).toString()));
    banned.add(((1 % 7) * 95).toString().concat((Math.floor(1 / 7) * 95).toString()));
    banned.add(((5 % 7) * 95).toString().concat((Math.floor(5 / 7) * 95).toString()));
    banned.add(((6 % 7) * 95).toString().concat((Math.floor(6 / 7) * 95).toString()));
    banned.add(((7 % 7) * 95).toString().concat((Math.floor(7 / 7) * 95).toString()));
    banned.add(((8 % 7) * 95).toString().concat((Math.floor(8 / 7) * 95).toString()));
    banned.add(((12 % 7) * 95).toString().concat((Math.floor(12 / 7) * 95).toString()));
    banned.add(((13 % 7) * 95).toString().concat((Math.floor(13 / 7) * 95).toString()));
    banned.add(((35 % 7) * 95).toString().concat((Math.floor(35 / 7) * 95).toString()));
    banned.add(((36 % 7) * 95).toString().concat((Math.floor(36 / 7) * 95).toString()));
    banned.add(((40 % 7) * 95).toString().concat((Math.floor(40 / 7) * 95).toString()));
    banned.add(((41 % 7) * 95).toString().concat((Math.floor(41 / 7) * 95).toString()));
    banned.add(((42 % 7) * 95).toString().concat((Math.floor(42 / 7) * 95).toString()));
    banned.add(((43 % 7) * 95).toString().concat((Math.floor(43 / 7) * 95).toString()));
    banned.add(((47 % 7) * 95).toString().concat((Math.floor(47 / 7) * 95).toString()));
    banned.add(((48 % 7) * 95).toString().concat((Math.floor(48 / 7) * 95).toString()));

    for (let i = 0; i < 49; ++i) {
      if (i === 0 || i === 1 || i === 5 || i === 6 ||
        i === 7 || i === 8 || i === 12 || i === 13 ||
        i === 24 || i === 35 || i === 36 || i === 40 ||
        i === 41 || i === 42 || i === 43 || i === 47 || i === 48) {
        continue;
      }

      const pegSprite = new PIXI.Sprite(peg);
      pegSprite.anchor.set(0.5);
      pegSprite.x = (i % 7) * 95;
      pegSprite.y = Math.floor(i / 7) * 95;
      pegSprite.interactive = true;
      pegSprite.buttonMode = true;
      pegSprite
        .on('mousedown', onDragStart)
        .on('mousemove', onDragMove)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchstart', onDragStart)
        .on('touchmove', onDragMove)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd);
      container.addChild(pegSprite);

      const borderSprite = new PIXI.Sprite(border);
      borderSprite.anchor.set(0.5);
      borderSprite.x = (i % 7) * 95;
      borderSprite.y = Math.floor(i / 7) * 95;
      container.addChild(borderSprite);
    }

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    const a = container.getBounds();
    let x, y;

    function onDragStart(event) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
      x = this.x;
      y = this.y;
    }

    function onDragMove() {
      if (this.dragging) {
        const position = this.data.getLocalPosition(this.parent);
        this.x = position.x;
        this.y = position.y;
      }
    }

    function onDragEnd() {
      const b = this.getBounds();

      if (a.x + a.width > b.x && a.x < b.x + b.width &&
        a.y + a.height > b.y && a.y < b.y + b.height) {
        let xx = Math.abs(Math.round(this.x / 95) * 95);
        let yy = Math.abs(Math.round(this.y / 95) * 95);

        if (banned.has(xx.toString().concat(yy.toString()))) {
          this.x = x;
          this.y = y;
        }
        else {
          this.x = xx;
          this.y = yy;
        }
      }
      else {
        this.x = x;
        this.y = y;
      }
      this.data = null;
      this.alpha = 1;
      this.dragging = false;
    }

    return () => {
      app.stop();
    }
  }, [app]);

  return (
    <div className="App">
      <header className="App-header">
        <div id="container" style={{ width: window.innerWidth, height: window.innerHeight, backgroundColor: "#4e214d" }} />
      </header>
    </div>
  );
}

export default App;
