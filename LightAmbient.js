import * as THREE from "https://unpkg.com/three/build/three.module.js";
// LUCES
// Luz ambiental
export default class AmbientLight extends THREE.AmbientLight {
    constructor(color = 0xffffff, intensity = 1) {
      super(color, intensity);
      this.strColor = color;
    }
    setColor(strColor) {
      this.color.setHex(strColor);
    }
}
