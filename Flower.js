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

    this.init();
  }

  pickNewColors() {
    this.colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  }

  die() {
    this.pickNewColors();
  }

  fadeTo(newEnergy) {

  }

  growTo(newEnergy) {

  }

  tweenToEnergy(newEnergy) {
    if (newEnergy < this.currEnergy) {
      this.isHealthy = false;
      this.fadeTo(newEnergy);
    } else {
      this.isHealthy = true;
      this.growTo(newEnergy);
    }

    this.currEnergy = newEnergy;
  }

  updateEnergy(newEnergy) {
    if (newEnergy <= this.minEnergy && this.currEnergy !== this.minEnergy) {
      this.die();
    } else {
      this.tweenToEnergy(newEnergy);
    }
  }

  init() {
    const height = (this.width / 326) * 903.1;
    const snap = Snap(this.width, height);
    snap.attr({
      'id': `snap-${ this.index }`,
      'class': 'snap'
    });

    snap.node.style.left = this.width * this.index;

    Snap.load('flower.svg', (fragment) => {
      console.log(fragment);

      snap.append(fragment);
    });
  }
}
