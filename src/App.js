import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import * as PIXI from 'pixi.js';
import * as FontFaceObserver from 'fontfaceobserver';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

class ArraySet extends Set {
  add(value) {
    return super.add(value.toString());
  }

  has(value) {
    return super.has(value.toString());
  }
}

class ArrayMap extends Map {
  set(key, value) {
    return super.set(key.toString(), value);
  }

  has(key) {
    return super.has(key.toString());
  }

  get(key) {
    return super.get(key.toString());
  }

  delete(key) {
    return super.delete(key.toString());
  }
}

function App() {
  const [app, setApp] = useState(new PIXI.Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x131342,
    resolution: 1,
    antialias: true
  }));

  useEffect(() => {
    const font = new FontFaceObserver('DMSans');
  
    font.load().then(function () {
      document.getElementById('container').appendChild(app.view);
      let level = 1;
      start();

      function start() {
        const container = new PIXI.Container();
        app.stage.addChild(container);

        const empty = PIXI.Texture.from('./empty.png');
        const peg = PIXI.Texture.from('./peg.png');
        
        let cross = new ArraySet();
        let current = new ArrayMap();
        const corners = [0, 1, 5, 6, 7, 8, 12, 13, 35, 36, 40, 41, 42, 43, 47, 48];
        let pegs;
        
        if (level === 1) {
          pegs = [10, 16, 22, 18, 25];
        }
        else if (level === 2) {
          pegs = [10, 16, 18, 22, 24, 26, 30, 32, 38, 45];
        }
        else {
          pegs = [2, 3, 4, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 44, 45, 46];
        }

        for (let i = 0; i < 49; ++i) {
          const x = (i % 7) * 95;
          const y = Math.floor(i / 7) * 95;

          if (!corners.includes(i)) {
            if (pegs.includes(i)) {
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
      
              current.set([x, y], pegSprite);
            }

            cross.add([x, y]);

            const emptySprite = new PIXI.Sprite(empty);
            emptySprite.anchor.set(0.5);
            emptySprite.x = x;
            emptySprite.y = y;
            container.addChild(emptySprite);
          }
        }

        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.x = 570 / 2;
        container.pivot.y = 570 / 2;

        const style = new PIXI.TextStyle({
          fill: '#FFFFFF',
          fontFamily: 'DMSans',
          align: 'center'
        });

        const status = new PIXI.Text('Pegs\n' + pegs.length.toString() + ' of ' + pegs.length.toString(), style);
        status.anchor.set(0.5);
        status.x = 570;
        status.y = -95;
        container.addChild(status);

        const timer = new PIXI.Text('Time\n3:00', style);
        timer.anchor.set(0.5);
        timer.x = 285;
        timer.y = -95;
        container.addChild(timer);

        const round = new PIXI.Text('Round\n' + level + ' of 3', style);
        round.anchor.set(0.5);
        round.x = 0;
        round.y = -95;
        container.addChild(round);

        let originX, originY;
        let count = pegs.length;
        let time = 180;

        const interval = setInterval(() => {
          --time;
          const min = Math.floor(time / 60).toString();
          const sec = (time % 60).toString();
          timer.text = (sec < 10) ? 'Time\n' + min + ':0' + sec : 'Time\n' + min + ':' + sec;

          if (time === 0) {
            clearInterval(interval);
          }
        }, 1000);

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
            let moved = false;

            const destX = Math.abs(Math.round(this.x / 95) * 95);
            const destY = Math.abs(Math.round(this.y / 95) * 95);

            const distX = Math.abs(destX - originX);
            const distY = Math.abs(destY - originY);

            if (cross.has([destX, destY])) {
              if (distX === 190 && distY === 0) { //Horizontal
                if (destX > originX) { //Right
                  if (current.has([originX + 95, originY]) && !current.has([destX, destY])) {
                    this.x = destX;
                    this.y = destY;
                    
                    container.removeChild(current.get([originX + 95, originY]));
                    current.delete([originX, originY]);
                    current.delete([originX + 95, originY]);
                    current.set([destX, destY], this);

                    --count;
                    status.text = (count < 10) ? 'Pegs\n0' + count.toString() + ' of ' + pegs.length.toString() : 'Pegs\n' + count.toString() + ' of ' + pegs.length.toString();
                    moved = true;
                  }
                  else {
                    this.x = originX;
                    this.y = originY;
                  }
                }
                else { //Left
                  if (current.has([originX - 95, originY]) && !current.has([destX, destY])) {
                    this.x = destX;
                    this.y = destY;

                    container.removeChild(current.get([originX - 95, originY]));
                    current.delete([originX, originY]);
                    current.delete([originX - 95, originY]);
                    current.set([destX, destY], this);

                    --count;
                    status.text = (count < 10) ? 'Pegs\n0' + count.toString() + ' of ' + pegs.length.toString() : 'Pegs\n' + count.toString() + ' of ' + pegs.length.toString();
                    moved = true;
                  }
                  else {
                    this.x = originX;
                    this.y = originY;
                  }
                }
              }
              else if (distX === 0 && distY === 190) { //Vertical
                if (destY > originY) { //Up
                  if (current.has([originX, originY + 95]) && !current.has([destX, destY])) {
                    this.x = destX;
                    this.y = destY;

                    container.removeChild(current.get([originX, originY + 95]));
                    current.delete([originX, originY]);
                    current.delete([originX, originY + 95]);
                    current.set([destX, destY], this);

                    --count;
                    status.text = (count < 10) ? 'Pegs\n0' + count.toString() + ' of ' + pegs.length.toString() : 'Pegs\n' + count.toString() + ' of ' + pegs.length.toString();
                    moved = true;
                  }
                  else {
                    this.x = originX;
                    this.y = originY;
                  }
                }
                else { //Down
                  if (current.has([originX, originY - 95]) && !current.has([destX, destY])) {
                    this.x = destX;
                    this.y = destY;

                    container.removeChild(current.get([originX, originY - 95]));
                    current.delete([originX, originY]);
                    current.delete([originX, originY - 95]);
                    current.set([destX, destY], this);

                    --count;
                    status.text = (count < 10) ? 'Pegs\n0' + count.toString() + ' of ' + pegs.length.toString() : 'Pegs\n' + count.toString() + ' of ' + pegs.length.toString();
                    moved = true;
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

            if (moved) {
              let endGame = true;

              for (let [key, value] of current) {
                const pos = value.position;
                const rMid = [pos.x + 95, pos.y], rEnd = [pos.x + 190, pos.y];
                const lMid = [pos.x - 95, pos.y], lEnd = [pos.x - 190, pos.y];
                const uMid = [pos.x, pos.y + 95], uEnd = [pos.x, pos.y + 190];
                const dMid = [pos.x, pos.y - 95], dEnd = [pos.x, pos.y - 190];
                
                if (cross.has(rMid) && cross.has(rEnd)) {
                  if (current.has(rMid) && !current.has(rEnd)) {
                    endGame = false;
                    break;
                  }
                }

                if (cross.has(lMid) && cross.has(lEnd)) {
                  if (current.has(lMid) && !current.has(lEnd)) {
                    endGame = false;
                    break;
                  }
                }

                if (cross.has(uMid) && cross.has(uEnd)) {
                  if (current.has(uMid) && !current.has(uEnd)) {
                    endGame = false;
                    break;
                  }
                }

                if (cross.has(dMid) && cross.has(dEnd)) {
                  if (current.has(dMid) && !current.has(dEnd)) {
                    endGame = false;
                    break;
                  }
                }
              }

              if (endGame) {
                clearInterval(interval);

                const score = Math.round(((pegs.length - count) / (pegs.length - 1)) * 100);
                const stats = new PIXI.Text('Score\n' + score.toString() + '%', style);
                stats.anchor.set(0.5);
                stats.x = 285;
                stats.y = 665;
                container.addChild(stats);

                const next = new PIXI.Text('Continue', style);
                next.anchor.set(0.5);
                next.x = 570;
                next.y = 665;
                next.interactive = true;
                next.buttonMode = true;
                next
                  .on('mousedown', onNextStart)
                  .on('mouseup', onNextEnd)
                  .on('touchstart', onNextStart)
                  .on('touchend', onNextEnd)
                  container.addChild(next);
              }
            }

            this.data = null;
            this.alpha = 1;
          }
        }

        function onNextStart() {
          this.alpha = 0.5;
        }

        function onNextEnd() {
          this.alpha = 1;

          container.destroy({
            children: true,
            texture: true,
            baseTexture: true
          });

          app.stage.removeChild(container);

          ++level;
          start();
        }
      }

      return () => {
        app.destroy({
          children: true,
          texture: true,
          baseTexture: true
        });

        app.stop();
      }
    }).catch(function () {
      
    });
  }, [app]);

  return (
    <div className="App">
      <header className="App-header">
        <div id="container" style={{ width: window.innerWidth, height: window.innerHeight, backgroundColor: "#131342" }} />
      </header>
    </div>
  );
}

export default App;