import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as PIXI from 'pixi.js';

function App() {
  const [app, setApp] = useState(new PIXI.Application({ width: 800, height: 800, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1 }));

  useEffect(() => {
    document.getElementById('container').appendChild(app.view);

    const container = new PIXI.Container();
    app.stage.addChild(container);

    const texture = PIXI.Texture.from('./bunny.png');

    for (let i = 0; i < 25; ++i) {
      const bunny = new PIXI.Sprite(texture);
      bunny.anchor.set(0.5);
      bunny.x = (i % 5) * 40;
      bunny.y = Math.floor(i / 5) * 40;
      container.addChild(bunny);
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
        <div id="container" />
      </header>
    </div>
  );
}

export default App;
