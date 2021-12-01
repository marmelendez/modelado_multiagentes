import * as THREE from "https://unpkg.com/three/build/three.module.js";
// LUCES
// Luz direccional
export default class DirectionalLight extends THREE.DirectionalLight {
    constructor(color = 0xffffff, intensity = 0) {
      super(color, intensity);
      this.strColor = color;
      this.position.set(0, 10, 0);
    }
    setColor(strColor) {
      this.color.setHex(strColor);
    }
}