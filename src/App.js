import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js';

function App() {
  const [app, setApp] = useState(new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x4e214d, resolution: window.devicePixelRatio || 1 }));

  useEffect(() => {
    document.getElementById('container').appendChild(app.view);

    const container = new PIXI.Container();
    const empty = PIXI.Texture.from('./empty.png');
    const hole = PIXI.Texture.from('./hole.png');
    const peg = PIXI.Texture.from('./peg.png');

    app.stage.addChild(container);

    for (let i = 0; i < 49; ++i) {
      if (i === 0 || i === 1 || i === 5 || i === 6 ||
        i === 7 || i === 8 || i === 12 || i === 13 ||
        i === 35 || i === 36 || i === 40 || i === 41 ||
        i === 42 || i === 43 || i === 47 || i === 48) {
        continue;
      }

      let tileSprite;

      if (i === 24) {
        tileSprite = new PIXI.Sprite(empty);
      }
      else {
        tileSprite = new PIXI.Sprite(hole);
      }

      const pegSprite = new PIXI.Sprite(peg);
      pegSprite.anchor.set(0.5);
      pegSprite.position.x = (i % 7) * 95;
      pegSprite.position.y = Math.floor(i / 7) * 95;
      pegSprite.interactive = true;
      pegSprite.buttonMode = true;
      pegSprite
        .on('mousedown', onDragStart)
        .on('mousemove', onDragMove)
        .on('mouseup', onDragEnd)
        .on('touchstart', onDragStart)
        .on('touchmove', onDragMove)
        .on('touchend', onDragEnd);
      container.addChild(pegSprite);

      tileSprite.anchor.set(0.5);
      tileSprite.x = (i % 7) * 95;
      tileSprite.y = Math.floor(i / 7) * 95;
      container.addChild(tileSprite);
    }

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    function onDragStart(event) {
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
    }

    function onDragMove () {
      if (this.dragging) {
        const position = this.data.getLocalPosition(this.parent);
        this.position.x = position.x;
        this.position.y = position.y;
      }
    }

    function onDragEnd() {
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
        <div id="container" style={{width: window.innerWidth, height: window.innerHeight, backgroundColor: "#4e214d"}} />
      </header>
    </div>
  );
}

export default App;
