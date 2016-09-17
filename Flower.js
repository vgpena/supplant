"use strict";

import { colorSchemes as colorSchemes } from 'colors';
import { deadColors as deadColors } from 'colors';

export default class Flower {
  constructor(minEnergy = 0, colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]) {
    this.minEnergy = minEnergy;
    this.colors = colors;
    this.isHealthy = true;
    this.currEnergy = minEnergy;

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
    // console.log(this.colors);
  }
}
