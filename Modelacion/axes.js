import * as THREE from 'https://unpkg.com/three/build/three.module.js';


export default class Axes extends THREE.AxesHelper {
    constructor(size = 10, visible = true) {
        super(size);
        this.size = size;
        this.visible = visible;
        this.position.set(0, 1, 0);
    }
    setVisible(value) {
        this.visible = value;
    }
}