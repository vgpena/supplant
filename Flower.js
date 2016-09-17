"use strict";

import { colorSchemes as colorSchemes } from 'colors';
import { deadColors as deadColors } from 'colors';

export default class Flower {
  constructor(minEnergy = 0, colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)], width, segIndex) {
    this.minEnergy = minEnergy;
    this.colors = colors;
    this.isHealthy = true;
    this.currEnergy = minEnergy;
    this.width = width;
    this.index = segIndex;
    this.sprout;
    this.id = `snap-${ this.index }`;

    this.timings = [
      {
        id: '.stem',
        dir: 7,
        start: 0,
        end: .3,
        yOffset: 0,
        last: 0
      },
      {
        id: '.leaf1',
        dir: 5,
        start: .15,
        end: .3,
        yOffset: .2,
        last: 0
      },
      {
        id: '.leaf3',
        dir: 6,
        start: .3,
        end: .45,
        yOffset: .2,
        last: 0
      },
      {
        id: '.leaf2',
        dir: 5,
        start: .45,
        end: .6,
        yOffset: .2,
        last: 0
      },
      {
        id: '.leaf4',
        dir: 6,
        start: .6,
        end: .75,
        yOffset: .2,
        last: 0
      },
      {
        id: '.blossom',
        dir: 4,
        start: .75,
        end: 1,
        yOffset: 0,
        last: 0,
        rotate: Math.random() * 90
      }
    ]

    this.parts = [];

    this.init();
  }


  transform(timing, part, scale, force) {
    let dims = part.getBBox();

    let offsetX;
    let offsetY;

    if (timing.dir === 7 || timing.dir === 4) {
      offsetX = (1-scale) * dims.cx;
    } else if (timing.dir === 6) {
      offsetX = (1-scale) * (dims.x);
    } else {
      offsetX = (1-scale) * (dims.x + dims.width);
    }

    if (timing.dir === 7) {
      offsetY = (1-scale) * (dims.y + dims.height);
    } else {
      offsetY = (1-scale) * (dims.cy) + (part.yOffset ? part.yOffset * 400 : 0) * scale;
      // offsetY = (1-scale) * (dims.cy);
    }

    part.attr({
      transform: `translate(${offsetX}, ${offsetY}) scale(${scale}) rotate(${timing.rotate ? timing.rotate * scale : 0}deg)`
    })

    timing.last = scale;
  }

  pickNewColors() {
    this.colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  }

  die() {
    console.log('dead')
    this.sprout.attr({
      opacity: 1
    });
    this.bloomed = false;
    this.pickNewColors();
    this.reset();
    this.skull.addClass('animate');

  }

  fadeTo(newEnergy, maxEnergy) {
    
  }

  rgbToInt(color) {
    const bits = color.split(',');
    const r = parseInt(bits[0].split('(')[1]);
    const g = parseInt(bits[1]);
    const b = parseInt(bits[2].split(')')[0]);
    return [r, g, b];
  }

  colorTween(colors, perc) {
    const color1 = this.rgbToInt(colors[0]);
    const color2 = this.rgbToInt(colors[1]);
    const r = Math.ceil(parseInt(color1[0] * perc + color2[0] * (1-perc)));
    const g = Math.ceil(parseInt(color1[1] * perc + color2[1] * (1-perc)));
    const b = Math.ceil(parseInt(color1[2] * perc + color2[2] * (1-perc)));
    return `rgb(${r}, ${g}, ${b})`;
  }

  growTo(newEnergy) {
    for (let i in this.parts) {
      let part = this.parts[i];
      let timing = this.timings[i];
      let scale = ((this.currEnergy - (timing.start))) * (1 / (timing.end - timing.start));

      if (scale > 1) {
        scale = 1;
        timing.last = 1;
        this.transform(timing, part, scale);
      } else if (scale > 0) {
        if (scale >= timing.last) {
          this.transform(timing, part, scale);
        }
      }
    }
  }

  tweenToEnergy(newEnergy, maxEnergy) {
    if (newEnergy < this.currEnergy) {
      this.crown.removeClass('animate');
      this.isHealthy = false;
      this.fadeTo(newEnergy, maxEnergy);
    } else {
      this.skull.removeClass('animate');
      this.isHealthy = true;
      this.growTo(newEnergy);
    }

    this.currEnergy = newEnergy;
  }

  updateEnergy(newEnergy, maxEnergy) {
    if (newEnergy <= this.minEnergy && this.currEnergy !== this.minEnergy) {
      if (this.sprouted) {
        this.die();
      }
      this.sprouted = false;
    } else {
      if (this.currEnergy === 1 && !this.bloomed) {
        this.crown.addClass('animate');
        this.bloomed = true;
      }
      this.sprouted = true;
      this.tweenToEnergy(newEnergy, maxEnergy);
    }
    const lifePerc = newEnergy / maxEnergy;
    if (lifePerc !== 1 &&  maxEnergy > .01) {
      this.sprout.attr({
        opacity: lifePerc
      })

      this.sprout.selectAll('.st0').attr({ fill: this.colorTween([this.colors.stem, deadColors.stem], lifePerc) });
      this.sprout.selectAll('.st1').attr({ fill: this.colorTween([this.colors.main, deadColors.main], lifePerc) });
      this.sprout.selectAll('.st2').attr({ fill: this.colorTween([this.colors.center, deadColors.center], lifePerc) });
      this.sprout.selectAll('.st3').attr({ fill: this.colorTween([this.colors.lines, deadColors.lines], lifePerc) });
    }
  }

  createPart(fragment, timing) {
    let part = fragment.selectAll(timing.id)[0];
    part.yOffset = timing.yOffset ? Math.random() * timing.yOffset - (timing.yOffset / 2) : false;
    this.parts.push(part);
    this.transform(timing, part, 0.01);
  }

  reset() {
    for (let i in this.parts) {
      i = parseInt(i);
      let part = this.parts[i];
      let timing = this.timings[i];
      this.transform(timing, part, 0.01);
      this.sprout.selectAll('.st0').attr({ fill: this.colors.stem});
      this.sprout.selectAll('.st1').attr({ fill: this.colors.main});
      this.sprout.selectAll('.st2').attr({ fill: this.colors.center});
      this.sprout.selectAll('.st3').attr({ fill: this.colors.lines});
    }
  }

  init() {

    const rand = 1 + Math.random() * .2;
    const height = (this.width / 326) * 903.1;
    this.sprout = Snap(this.width * rand, height * rand);
    this.sprout.attr({
      'id': this.sprout,
      'class': 'sprout'
    });

    this.sprout.node.style.left = 150 + (this.width - 30) * this.index + (Math.random() * 80 - 40);

    Snap.load('flower.svg', (fragment) => {
      this.sprout.append(fragment);

      fragment.selectAll('.st0').attr({ fill: this.colors.stem });
      fragment.selectAll('.st1').attr({ fill: this.colors.main });
      fragment.selectAll('.st2').attr({ fill: this.colors.center });
      fragment.selectAll('.st3').attr({ fill: this.colors.lines });

      for (let i in this.timings) {
        i = parseInt(i);
        let timing = this.timings[i];
        this.createPart(fragment, timing);
      }
    });

    const skullRatio = (this.width / 464) * 354.4;
    this.skull = Snap(this.width, skullRatio);
    this.skull.attr({
      'class': 'skullClass'
    });
    this.skull.node.style.left = this.sprout.node.style.left;
    this.skull.node.style.bottom = height - 50;
    Snap.load('skull.svg', (fragment) => {
      this.skull.append(fragment);
    });

    const crownRatio = (this.width / 464) * 354.4;
    this.crown = Snap(this.width, crownRatio);
    this.crown.attr({
      'class': 'crownClass'
    });
    this.crown.node.style.left = this.sprout.node.style.left;
    this.crown.node.style.bottom = height - 50;
    Snap.load('crown.svg', (fragment) => {
      this.crown.append(fragment);
    });

  }
}
