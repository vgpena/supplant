"use strict";

import Flower from 'Flower';
const energyCeiling = 1;

export default class Segment {
  constructor(startingEnergy, entropy, totalSegments, segIndex) {
    this.entropy = entropy;
    this.totalSegments = totalSegments;
    this.currEnergy = startingEnergy;
    this.maxEnergy = this.currEnergy;
    this.index = segIndex;
    this.flower = new Flower(entropy, undefined, window.innerWidth / totalSegments, segIndex);
  }

  updateEnergy(newEnergy) {
    this.flower.updateEnergy(newEnergy, this.maxEnergy);
  }

  increase() {
    this.currEnergy = Math.min(energyCeiling, this.currEnergy + this.entropy);
    this.maxEnergy = Math.max(this.currEnergy, this.maxEnergy);
    this.updateEnergy(this.currEnergy, this.maxEnergy);
  }

  decrease(numSegments = this.totalSegments - 1) {
    this.currEnergy -= (Number(this.entropy / Number(numSegments)) * (this.totalSegments - numSegments)) * 10;

    if (this.currEnergy < this.entropy) {
      this.currEnergy = this.entropy;
      this.maxEnergy = this.currEnergy;
    }

    this.updateEnergy(this.currEnergy, this.maxEnergy);
  }
}
