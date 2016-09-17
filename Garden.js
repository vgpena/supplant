"use strict";

const startingEnergy = 0;
const entropy = 0.001;
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
    // console.log(data);
    // return new Promise((res, rej) => {
      const active = [];
      data.forEach((datum) => {
        active.push(datum);
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
    //   res();
    // });
  }

  renderBg() {
    this.ctx.fillStyle = 'aliceblue';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#5CC121';
    this.ctx.fillRect(0, this.height - 50, this.width, 50);
  }

  setAttributes(element, attributes, callback) {
    for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }

    if (callback) {
      callback();
    }
  }

  renderSegment(startX, width, segment, index) {
    // const height = (width / 326) * 903.1;
    // const snap = Snap(width, height);
    // snap.attr({
    //   'id': `snap-${ index }`,
    //   'class': 'snap'
    // });
    //
    // // console.log(snap.node);
    // // snap.node.setAttribute("transform", "translate(" + startX + ", " + (window.innerHeight - height) + ")");
    //
    // Snap.load('flower.svg', (fragment) => {
    //   snap.append(fragment);
    // });
  }

  renderSegments() {
    const width = this.width / this.histogram.length;
    this.histogram.forEach((segment, index) => {
      // this.ctx.fillStyle = 'black';
      // this.ctx.strokeStyle = 'red';
      // this.ctx.lineWidth = 2;
      const startX = index * width;
      // this.ctx.strokeRect(startX, this.height - 50, width, 50);
      this.renderSegment(startX, width, segment, index);
    });
  }

  render() {
    // this.renderBg();
    this.renderSegments();

    // requestAnimationFrame(() => {
    //   this.render();
    // });
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    for (let i = 0; i < totalSegments; i++) {
      this.histogram.push(new Segment(startingEnergy, entropy, totalSegments, i));
    }

    requestAnimationFrame(() => {
      this.render();
      // this.renderBg();
    });
  }
}
