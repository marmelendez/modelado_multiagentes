import * as THREE from 'https://unpkg.com/three/build/three.module.js';

export default class Floor extends THREE.Group {
    constructor(size = 100) {
        super();
        this.size = size;
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({color: 0x505050});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.gridHelper = new THREE.GridHelper(size, 10, 0xff0000, 0x000000);
        // CHILDREN
        this.add(this.mesh);
        this.add(this.gridHelper);
    }
    setVisible(value = true) {
        this.visible = value;
    }
    setWireframe(value = true) {
        this.material.wireframe = value;
    }
    setColor(color) {
        this.mesh.material.color.setHex(color);
    }
}