import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

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

function Example() {
    const [app, setApp] = useState(new PIXI.Application({
        width: 1848,
        height: 973,
        backgroundColor: 0x131342,
        resolution: 1,
        antialias: true
    }));

    useEffect(() => {
        document.getElementById('container').appendChild(app.view);

        const container = new PIXI.Container();
        app.stage.addChild(container);

        const empty = PIXI.Texture.from('./wow.png');
        const bad = PIXI.Texture.from('./og.png');
        const peg = PIXI.Texture.from('./peg_tut.png');
        const hole = PIXI.Texture.from('./hole_tut.png');

        let cross = new ArraySet();
        let current = new ArrayMap();
        let pegs = [1, 2];

        for (let i = 0; i < 3; ++i) {
            const x = (i % 7) * 395;
            const y = Math.floor(i / 7) * 395;

            let emptySprite;

            if (i == 0) {
                emptySprite = new PIXI.Sprite(empty);
            }
            else if (i == 2) {
                emptySprite = new PIXI.Sprite(bad);
            }
            else {
                emptySprite = new PIXI.Sprite(hole);
            }

            emptySprite.anchor.set(0.5);
            emptySprite.x = x;
            emptySprite.y = y;
            container.addChild(emptySprite);

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
        }

        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        let originX, originY;

        function onDragStart(event) {
            this.data = event.data;
            this.tint = 0xfec257;
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

                const destX = Math.abs(Math.round(this.x / 395) * 395);
                const destY = Math.abs(Math.round(this.y / 395) * 395);

                const distX = Math.abs(destX - originX);
                const distY = Math.abs(destY - originY);

                if (cross.has([destX, destY])) {
                    if (distX === 790 && distY === 0) { //Horizontal
                        if (!(destX > originX)) { //Left
                            if (current.has([originX - 395, originY]) && !current.has([destX, destY])) {
                                this.x = destX;
                                this.y = destY;

                                container.removeChild(current.get([originX - 395, originY]));
                                current.delete([originX, originY]);
                                current.delete([originX - 395, originY]);
                                current.set([destX, destY], this);

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
                    console.log('Aw Yeah!');
                }

                this.data = null;
                this.tint = 0xffffff;
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

    }, [app]);

    return (
        <div id="container" style={{ width: window.innerWidth, height: window.innerHeight, backgroundColor: "#131342" }} />
    );
}

export default Example;