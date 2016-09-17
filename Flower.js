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
        last: 0
      },
      {
        id: '.leaf1',
        dir: 5,
        start: .15,
        end: .3,
        last: 0
      },
      {
        id: '.leaf3',
        dir: 6,
        start: .3,
        end: .45,
        last: 0
      },
      {
        id: '.leaf2',
        dir: 5,
        start: .45,
        end: .6,
        last: 0
      },
      {
        id: '.leaf4',
        dir: 6,
        start: .6,
        end: .75,
        last: 0
      },
      {
        id: '.blossom',
        dir: 4,
        start: .75,
        end: 1,
        last: 0
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
      offsetY = (1-scale) * dims.cy;
    }

    part.attr({
      transform: `translate(${offsetX}, ${offsetY}) scale(${scale})`
    })

    timing.last = scale;
  }

  pickNewColors() {
    this.colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  }

  die() {
    this.sprout.attr({
      opacity: 1
    });
    this.reset();
    this.pickNewColors();
  }

  fadeTo(newEnergy, maxEnergy) {
    
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
      this.isHealthy = false;
      this.fadeTo(newEnergy, maxEnergy);
    } else {
      this.isHealthy = true;
      this.growTo(newEnergy);
    }

    this.currEnergy = newEnergy;
  }

  updateEnergy(newEnergy, maxEnergy) {
    if (newEnergy <= this.minEnergy && this.currEnergy !== this.minEnergy) {
      this.die();
    } else {
      this.tweenToEnergy(newEnergy, maxEnergy);
    }
    if (this.index === 0) {
      console.log(newEnergy, maxEnergy);
    }
    this.sprout.attr({
      opacity: newEnergy / maxEnergy
    })
  }

  createPart(fragment, timing) {
    let part = fragment.selectAll(timing.id)[0];
    this.parts.push(part);
    this.transform(timing, part, .01);
  }

  reset() {
    for (let i in this.parts) {
      i = parseInt(i);
      let part = this.parts[i];
      let timing = this.timings[i];
      this.transform(timing, part, .01);
    }
  }

  init() {
    const height = (this.width / 326) * 903.1;
    this.sprout = Snap(this.width, height);
    this.sprout.attr({
      'id': this.sprout,
      'class': 'sprout'
    });

    this.sprout.node.style.left = this.width * this.index;

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
  }
}
