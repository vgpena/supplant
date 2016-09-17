"use strict";

export default class Segment {
  constructor(startingEnergy, entropy, totalSegments) {
    this.entropy = entropy;
    this.totalSegments = totalSegments;
    this.currEnergy = startingEnergy;
    this.maxEnergy = this.currEnergy;
  }

  increase() {
    this.currEnergy += this.entropy;
    this.maxEnergy = Math.max(this.currEnergy, this.maxEnergy);
  }

  decrease(numSegments = this.totalSegments - 1) {
    this.currEnergy -= Number(this.entropy / Number(numSegments)) * (this.totalSegments - numSegments);

    if (this.currEnergy < this.entropy) {
      this.currEnergy = this.entropy;
      this.maxEnergy = this.currEnergy;
    }

  }
}
