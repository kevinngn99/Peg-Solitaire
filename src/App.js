import React, { useEffect, useState } from 'react';
import './App.css';
import * as PIXI from 'pixi.js';

class ArraySet extends Set {
  add(value) {
    super.add(value.toString());
  }

  has(value) {
    return super.has(value.toString());
  }

  delete(value) {
    super.delete(value.toString());
  }
}

class ArrayMap extends Map {
  set(key, value) {
    super.set(key.toString(), value);
  }

  has(key) {
    return super.has(key.toString());
  }

  get(key) {
    return super.get(key.toString());
  }
}

function App() {
  const [app, setApp] = useState(new PIXI.Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x4e214d,
    resolution: window.devicePixelRatio || 1
  }));

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

    let banned = new ArraySet();
    let master = new ArrayMap();
    const corners = [0, 1, 5, 6, 7, 8, 12, 13, 35, 36, 40, 41, 42, 43, 47, 48];

    for (let i = 0; i < 49; ++i) {
      if (i !== 24) {
        const x = (i % 7) * 95;
        const y = Math.floor(i / 7) * 95;

        banned.add([x, y]);
  
        if (!corners.includes(i)) {
          const pegSprite = new PIXI.Sprite(peg);
          pegSprite.anchor.set(0.5);
          pegSprite.x = x;
          pegSprite.y = y;
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
  
          master.set([x, y], pegSprite);
  
          const borderSprite = new PIXI.Sprite(border);
          borderSprite.anchor.set(0.5);
          borderSprite.x = x;
          borderSprite.y = y;
          container.addChild(borderSprite);
        }
      }
    }

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    const a = container.getBounds();
    let originX, originY;

    function onDragStart(event) {
      this.data = event.data;
      this.alpha = 0.5;
      originX = this.x;
      originY = this.y;
    }

    function onDragMove() {
      if (this.data) {
        const position = this.data.getLocalPosition(this.parent);
        this.x = position.x;
        this.y = position.y;
      }
    }

    function onDragEnd() {
      if (this.data) {
        const b = this.getBounds();

        if (a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height) {
          const destX = Math.abs(Math.round(this.x / 95) * 95);
          const destY = Math.abs(Math.round(this.y / 95) * 95);

          const distX = Math.abs(destX - originX);
          const distY = Math.abs(destY - originY);

          if (!banned.has([destX, destY])) {
            if (distX === 190 && distY === 0) {
              if (destX > originX) { //Right
                if (banned.has([originX + 95, originY])) {
                  this.x = destX;
                  this.y = destY;
                  
                  container.removeChild(master.get([originX + 95, originY]));
                  master.set([destX, destY], this);
                  banned.delete([originX + 95, originY]);
                  banned.delete([originX, originY]);
                  banned.add([destX, destY]);
                }
                else {
                  this.x = originX;
                  this.y = originY;
                }
              }
              else { //Left
                if (banned.has([originX - 95, originY])) {
                  this.x = destX;
                  this.y = destY;

                  container.removeChild(master.get([originX - 95, originY]));
                  master.set([destX, destY], this);
                  banned.delete([originX - 95, originY]);
                  banned.delete([originX, originY]);
                  banned.add([destX, destY]);
                }
                else {
                  this.x = originX;
                  this.y = originY;
                }
              }
            }
            else if (distX === 0 && distY === 190) {
              if (destY > originY) { //Down
                if (banned.has([originX, originY + 95])) {
                  this.x = destX;
                  this.y = destY;

                  container.removeChild(master.get([originX, originY + 95]));
                  master.set([destX, destY], this);
                  banned.delete([originX, originY + 95]);
                  banned.delete([originX, originY]);
                  banned.add([destX, destY]);
                }
                else {
                  this.x = originX;
                  this.y = originY;
                }
              }
              else { //Up
                if (banned.has([originX, originY - 95])) {
                  this.x = destX;
                  this.y = destY;

                  container.removeChild(master.get([originX, originY - 95]));
                  master.set([destX, destY], this);
                  banned.delete([originX, originY - 95]);
                  banned.delete([originX, originY]);
                  banned.add([destX, destY]);
                }
                else {
                  this.x = originX;
                  this.y = originY;
                }
              }
            }
            else {
              this.x = originX;
              this.y = originY;
            }
          }
          else {
            this.x = originX;
            this.y = originY;
          }
        }
        else {
          this.x = originX;
          this.y = originY;
        }

        this.data = null;
        this.alpha = 1;
      }
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