import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js';

function App() {
  const [app, setApp] = useState(new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x4e214d, resolution: window.devicePixelRatio || 1 }));

  useEffect(() => {
    document.getElementById('container').appendChild(app.view);

    const container = new PIXI.Container();
    const peg = PIXI.Texture.from('./peg.png');
    const hole = PIXI.Texture.from('./hole.png');

    app.stage.addChild(container);

    for (let i = 0; i < 49; ++i) {
      let tile;

      if (i === 0 || i === 1 || i === 5 || i === 6 ||
        i === 7 || i === 8 || i === 12 || i === 13 ||
        i === 35 || i === 36 || i === 40 || i === 41 ||
        i === 42 || i === 43 || i === 47 || i === 48) {
        continue;
      }

      if (i === 24) {
        tile = new PIXI.Sprite(hole);
      }
      else {
        tile = new PIXI.Sprite(peg);
      }

      tile.anchor.set(0.5);
      tile.x = (i % 7) * 95;
      tile.y = Math.floor(i / 7) * 95;
      container.addChild(tile);
    }

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

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
