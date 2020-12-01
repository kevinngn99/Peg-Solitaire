import React, { useEffect, useState } from 'react';
import './ClickSelect.css';
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

function ClickSelect() {
  const wi = 1920;
  const hi = 1080;
  const ws = window.screen.width;
  const hs = window.screen.height;
  const ratio = Math.min((wi / ws), (hi / hs));
  const scale = 1 / ratio;

  const [app, setApp] = useState(new PIXI.Application({ 
    width: window.innerWidth * ratio,
    height: window.innerHeight * ratio,
    backgroundColor: 0x01013d,
    resolution: 1,
    antialias: true
  }));

  useEffect(() => {
    const font = new FontFaceObserver('Dosis-ExtraBold');
  
    font.load().then(function () {
      document.getElementById('container').appendChild(app.view);
      let level = 1;
      start();

      function start() {
        const container = new PIXI.Container();
        app.stage.addChild(container);

        const empty = PIXI.Texture.from('./hole.png');
        empty.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;

        const peg = PIXI.Texture.from('./peg.png');
        peg.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;

        const green = PIXI.Texture.from('./green.png');
        green.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;

        const yellow = PIXI.Texture.from('./yellow.png');
        yellow.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        
        let cross = new ArraySet();
        let current = new ArrayMap();
        let holes = new ArrayMap();
        const corners = [0, 1, 5, 6, 7, 8, 12, 13, 35, 36, 40, 41, 42, 43, 47, 48];
        let pegs;
        
        if (level === 1) {
          pegs = [10, 16, 22, 18, 25];
        }
        else if (level === 2) {
          pegs = [10, 16, 18, 22, 24, 26, 30, 32, 38, 45];
        }
        else if (level === 3) {
          pegs = [3, 9, 10, 11, 15, 16, 18, 19, 21, 22, 26, 27, 29, 30, 32, 33, 37, 38, 39, 45];
        }
        else {
          pegs = [2, 3, 4, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 44, 45, 46];
        }

        for (let i = 0; i < 49; ++i) {
          const x = (i % 7) * 95;
          const y = Math.floor(i / 7) * 95;

          if (!corners.includes(i)) {
            const emptySprite = new PIXI.Sprite(empty);
            emptySprite.anchor.set(0.5);
            emptySprite.x = x;
            emptySprite.y = y;
            emptySprite
                .on('mousedown', onHint)
                .on('touchstart', onHint);
            container.addChild(emptySprite);

            holes.set([x, y], emptySprite);
          }
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
              pegSprite.alpha = 0.85;
              pegSprite.interactive = true;
              pegSprite.buttonMode = true;
              pegSprite
                .on('mousedown', onDown)
                .on('touchstart', onDown);
              container.addChild(pegSprite);
      
              current.set([x, y], pegSprite);
            }

            cross.add([x, y]);
          }
        }

        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.x = 570 / 2;
        container.pivot.y = 570 / 2;

        const style = new PIXI.TextStyle({
          fill: '#FFFFFF',
          fontSize: 30,
          fontFamily: 'Dosis-ExtraBold',
          fontWeight: 'bold',
          align: 'center'
        });

        const status = new PIXI.Text('PEGS\n' + pegs.length.toString() + ' OF ' + pegs.length.toString(), style);
        status.anchor.set(0.5);
        status.x = 570;
        status.y = -95;
        status.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        container.addChild(status);

        const timer = new PIXI.Text('TIME\n3:00', style);
        timer.anchor.set(0.5);
        timer.x = 285;
        timer.y = -95;
        timer.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        container.addChild(timer);

        const round = new PIXI.Text('ROUND\n' + level + ' OF 4', style);
        round.anchor.set(0.5);
        round.x = 0;
        round.y = -95;
        round.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        container.addChild(round);

        let originX, originY;
        let count = pegs.length;
        let time = 180;
        let selected = [];
        let clicked = false;

        const interval = setInterval(() => {
          --time;
          const min = Math.floor(time / 60).toString();
          const sec = (time % 60).toString();
          timer.text = (sec < 10) ? 'TIME\n' + min + ':0' + sec : 'TIME\n' + min + ':' + sec;

          if (time === 0) {
            clearInterval(interval);

            const score = Math.round(((pegs.length - count) / (pegs.length - 1)) * 100);
            const stats = new PIXI.Text('SCORE\n' + score.toString() + '%', style);
            stats.anchor.set(0.5);
            stats.x = 285;
            stats.y = 665;
            stats.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
            container.addChild(stats);

            if (level !== 4) {
              const next = new PIXI.Text('CONTINUE', style);
              next.anchor.set(0.5);
              next.x = 570;
              next.y = 665;
              next.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
              next.interactive = true;
              next.buttonMode = true;
              next
                .on('mousedown', onNextStart)
                .on('mouseup', onNextEnd)
                .on('touchstart', onNextStart)
                .on('touchend', onNextEnd)
                container.addChild(next);
            }

            for (let [pos, sprite] of current) {
              sprite.interactive = false;
            }
          }
        }, 1000);

        function onDown(event) {
          if (!clicked) {
            this.data = event.data;
            this.tint = 0xfec257;
            originX = this.x;
            originY = this.y;
  
            selected.push([originX, originY]);
  
            const rMid = [originX + 95, originY], rEnd = [originX + 190, originY];
            const lMid = [originX - 95, originY], lEnd = [originX - 190, originY];
            const uMid = [originX, originY + 95], uEnd = [originX, originY + 190];
            const dMid = [originX, originY - 95], dEnd = [originX, originY - 190];
  
            if (cross.has(rMid) && cross.has(rEnd)) {
              if (current.has(rMid) && !current.has(rEnd)) {
                holes.get(rEnd).texture = green;
                holes.get(rEnd).interactive = true;
                holes.get(rEnd).buttonMode = true;
                selected.push(rEnd);
              }
            }
  
            if (cross.has(lMid) && cross.has(lEnd)) {
              if (current.has(lMid) && !current.has(lEnd)) {
                holes.get(lEnd).texture = green;
                holes.get(lEnd).interactive = true;
                holes.get(lEnd).buttonMode = true;
                selected.push(lEnd);
              }
            }
  
            if (cross.has(uMid) && cross.has(uEnd)) {
              if (current.has(uMid) && !current.has(uEnd)) {
                holes.get(uEnd).texture = green;
                holes.get(uEnd).interactive = true;
                holes.get(uEnd).buttonMode = true;
                selected.push(uEnd);
              }
            }
  
            if (cross.has(dMid) && cross.has(dEnd)) {
              if (current.has(dMid) && !current.has(dEnd)) {
                holes.get(dEnd).texture = green;
                holes.get(dEnd).interactive = true;
                holes.get(dEnd).buttonMode = true;
                selected.push(dEnd);
              }
            }

            for (const [key, value] of current) {
                current.get(key).interactive = false;
                current.get(key).buttonMode = false;
            }

            current.get([originX, originY]).interactive = true;
            current.get([originX, originY]).buttonMode = true;

            clicked = true;
          }
          else {
            const position = this.data.getLocalPosition(this.parent);
            const x = Math.abs(Math.round(position.x / 95) * 95);
            const y = Math.abs(Math.round(position.y / 95) * 95);

            if (x == originX && y == originY) {
                for (const pos of selected) {
                    holes.get(pos).texture = empty;
                    holes.get(pos).interactive = false;
                    holes.get(pos).buttonMode = false;
                }
    
                selected = [];

                for (const [key, value] of current) {
                    current.get(key).interactive = true;
                    current.get(key).buttonMode = true;
                }

                clicked = false;
                this.data = null;
                this.tint = 0xffffff;
            }
          }
        }

        function onHint(event) {
            let moved = false;

            const position = event.data.getLocalPosition(this.parent);

            const destX = Math.abs(Math.round(position.x / 95) * 95);
            const destY = Math.abs(Math.round(position.y / 95) * 95);

            const distX = Math.abs(destX - originX);
            const distY = Math.abs(destY - originY);

            if (distX === 190 && distY === 0) { //Horizontal
                if (destX > originX) { //Right
                    current.get([originX, originY]).x = destX;
                    current.get([originX, originY]).y = destY;

                    container.removeChild(current.get([originX + 95, originY]));
                    current.delete([originX + 95, originY]);
                    current.set([destX, destY], current.get([originX, originY]));
                    current.get([destX, destY]).tint = 0xffffff;
                    current.delete([originX, originY]);

                    --count;
                    status.text = 'PEGS\n' + count.toString() + ' OF ' + pegs.length.toString();
                    moved = true;
                }
                else { //Left
                    current.get([originX, originY]).x = destX;
                    current.get([originX, originY]).y = destY;

                    container.removeChild(current.get([originX - 95, originY]));
                    current.delete([originX - 95, originY]);
                    current.set([destX, destY], current.get([originX, originY]));
                    current.get([destX, destY]).tint = 0xffffff;
                    current.delete([originX, originY]);

                    --count;
                    status.text = 'PEGS\n' + count.toString() + ' OF ' + pegs.length.toString();
                    moved = true;
                }
            }
            else if (distX === 0 && distY === 190) { //Vertical
                if (destY > originY) { //Up
                    current.get([originX, originY]).x = destX;
                    current.get([originX, originY]).y = destY;

                    container.removeChild(current.get([originX, originY + 95]));
                    current.delete([originX, originY + 95]);
                    current.set([destX, destY], current.get([originX, originY]));
                    current.get([destX, destY]).tint = 0xffffff;
                    current.delete([originX, originY]);

                    --count;
                    status.text = 'PEGS\n' + count.toString() + ' OF ' + pegs.length.toString();
                    moved = true;
                }
                else { //Down
                    current.get([originX, originY]).x = destX;
                    current.get([originX, originY]).y = destY;

                    container.removeChild(current.get([originX, originY - 95]));
                    current.delete([originX, originY - 95]);
                    current.set([destX, destY], current.get([originX, originY]));
                    current.get([destX, destY]).tint = 0xffffff;
                    current.delete([originX, originY]);

                    --count;
                    status.text = 'PEGS\n' + count.toString() + ' OF ' + pegs.length.toString();
                    moved = true;
                }
            }

            clicked = false;

            for (const pos of selected) {
                holes.get(pos).texture = empty;
                holes.get(pos).interactive = false;
                holes.get(pos).buttonMode = false;
            }

            selected = [];

            for (const [key, value] of current) {
                current.get(key).interactive = true;
                current.get(key).buttonMode = true;
            }

            if (moved) {
                let endGame = true;

                for (const [key, value] of current) {
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
                    const stats = new PIXI.Text('SCORE\n' + score.toString() + '%', style);
                    stats.anchor.set(0.5);
                    stats.x = 285;
                    stats.y = 665;
                    stats.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                    container.addChild(stats);

                    if (level !== 4) {
                        const next = new PIXI.Text('CONTINUE', style);
                        next.anchor.set(0.5);
                        next.x = 570;
                        next.y = 665;
                        next.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
                        next.interactive = true;
                        next.buttonMode = true;
                        next
                            .on('mousedown', onNextStart)
                            .on('mousemove', onNextMove)
                            .on('mouseup', onNextEnd)
                            .on('mouseupoutside', onNextMove)
                            .on('touchstart', onNextStart)
                            .on('touchmove', onNextMove)
                            .on('touchend', onNextEnd)
                            .on('touchendoutside', onNextMove);
                        container.addChild(next);
                    }

                    for (let [pos, sprite] of current) {
                        sprite.interactive = false;
                    }
                }
            }

            //this.data = null;
            //this.tint = 0xffffff;
        }

        function onNextStart() {
          this.alpha = 0.5;
          this.begin = true;
        }

        function onNextMove() {
          this.alpha = 1;
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
    <div id="container" style={{ transform: `scale(${scale})`, transformOrigin: `0 0`, width: `${100 * (1 / scale)}%`, height: window.innerHeight }} />
  );
}

export default ClickSelect;