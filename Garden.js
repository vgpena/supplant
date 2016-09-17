"use strict";

const startingEnergy = 10;
const entropy = 0.5;
const totalSegments = 10;
const totalEnergy = 500;

import Segment from 'Segment';

export default class Garden {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.histogram = [];

    this.init();
  }

  addEnergy(data) {
    return new Promise((res, rej) => {
      const active = [];
      data.forEach((datum) => {
        active.push(Math.floor(datum * 10));
      });
      if (active.length) {
        this.histogram.forEach((segment, index) => {
          if (active.indexOf(index) > -1) {
            segment.increase();
          } else {
            segment.decrease(totalSegments - active.length);
          }
        });
      }
      res();
    });
  }

  renderBg() {
    this.ctx.fillStyle = 'aliceblue';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#5CC121';
    this.ctx.fillRect(0, this.height - 50, this.width, 50);
  }

  renderSegments() {
    const width = this.width / this.histogram.length;
    this.histogram.forEach((segment, index) => {
      this.ctx.fillStyle = 'black';
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      const startX = index * width;
      this.ctx.strokeRect(startX, this.height - 50, width, 50);
      this.ctx.fillText(`+${ segment.posHealth }`, startX + 4, this.height - 20, width);
      this.ctx.fillText(`-${ segment.negHealth }`, startX + 4, this.height - 8, width);
    });
  }

  render() {
    this.renderBg();
    this.renderSegments();

    requestAnimationFrame(() => {
      this.render();
    });
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    for (let i = 0; i < totalSegments; i++) {
      this.histogram.push(new Segment(startingEnergy, entropy, totalSegments));
    }

    requestAnimationFrame(() => {
      this.render();
      // this.renderBg();
    });
  }
}
