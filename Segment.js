"use strict";

export default class Segment {
  constructor(startingEnergy, entropy, totalSegments) {
    this.entropy = entropy;
    this.totalSegments = totalSegments;
    this.posHealth = startingEnergy;
    this.negHealth = 0;
  }

  increase() {
    this.posHealth += this.entropy;
  }

  decrease(numSegments = this.totalSegments - 1) {
    this.negHealth += (this.entropy / numSegments);
  }
}
