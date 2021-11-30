import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// COMPONENTES DE AUTO
// Uso de Buffer Geometry
class TriangularPrism extends THREE.Mesh {
    constructor() {
        super();
        const vertices = new Float32Array([
            0.2, 0, 0,
            -0.2, 0, 0,
            -0.2, 0, 0.5,

            0.2, 1, 0,
            -0.2, 1, 0,
            -0.2, 1, 0.5,
        ]);

        const indices = [
            0, 1, 2, // Top
            5, 4, 3, // Bottom
            3, 1, 0, // Back
            1, 3, 4, // Back
            0, 2, 3, // Left
            5, 3, 2, // Left
            4, 2, 1, // Right
            2, 4, 5, // Right
        ];


        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometry.setIndex(indices);
        this.material = new THREE.MeshBasicMaterial({color: 0x00008b});
        this.rotation.x = -Math.PI/2;   
    }
    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

class Tire extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.CylinderGeometry( 0.2, 0.2, 1.2, 32 ); // radius top, radius bottom, height, segments
        const material = new THREE.MeshBasicMaterial( {color: 0x5a5a5a} );
        const cylinder = new THREE.Mesh( geometry, material );
        super(geometry, material);
        this.rotation.x = Math.PI/2;    
        this.color = 0x5a5a5a;
    }

    getColor() {
        return this.color;
    }

    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

class SideWindow extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxBufferGeometry(1, 0.3, 1.1); // width, height, depth
        const material = new THREE.MeshBasicMaterial( {color: 0xdce9f5} );
        super(geometry, material);
        this.color = 0xdce9f5;
    }
    getColor() {
        return this.color;
    }

    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

class FrontWindow extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxBufferGeometry(0.1, 0.3, .8);
        const material = new THREE.MeshBasicMaterial( {color: 0xdce9f5} );
        super(geometry, material);
    }
    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

class CarBottom extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxBufferGeometry(2, 0.5, 1);
        const material = new THREE.MeshBasicMaterial( {color: 0x00008b} ); //00008b
        super(geometry, material);
        this.color = 0x00008b;
    }
    getColor() {
        return this.color;
    }

    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

class CarTop extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxBufferGeometry(1.2, 0.4, 1);
        const material = new THREE.MeshBasicMaterial( {color: 0xf1f1f1} );
        super(geometry, material);
        this.color = 0xf1f1f1;
    }
    getColor() {
        return this.color;
    }

    setColor(hexColor) {
        this.material.color.setHex(hexColor);
    }
}

// CLASE AUTO, AGRUPA COMPONENTES 
// Uso de THREE.Group
class ClaseCarDetailed extends THREE.Group {
    constructor(x = 0, z = 0) {
        super();
        this.x = x;
        this.z = z;
        this.material = false;
        this.scaleFactor = 5;
        this.rotate = true;

        // Llantas traseras
        this.rearTires = new Tire();
        this.rearTires.position.y = 0.1;
        this.rearTires.position.x = -0.6;
        this.tiresColor = this.rearTires.getColor();

        // Llantas frontales
        this.frontTires = new Tire();
        this.frontTires.position.y = 0.1;
        this.frontTires.position.x = 0.6;

        // Parte de abajo
        this.carBottom = new CarBottom();
        this.carBottom.position.y = 0.3;
        this.carBottom.position.x = 0;
        this.carBottomColor = this.carBottom.getColor();

        // Parte enfrente
        this.frontPart = new TriangularPrism();
        this.frontPart.position.y = 0.05;
        this.frontPart.position.x = 1.2;
        this.frontPart.position.z = 0.5;

        // Parte de arriba
        this.carTop = new CarTop();
        this.carTop.position.y = 0.75;
        this.carTop.position.x = -0.1;
        this.carTopColor = this.carTop.getColor();

        // Ventanas de lados
        this.sideWindow = new SideWindow();
        this.sideWindow.position.y = 0.75;
        this.sideWindow.position.x = -0.1;
        this.windowsColor = this.sideWindow.getColor();

        // Ventana frontal
        this.frontWindow = new FrontWindow();
        this.frontWindow.position.y = 0.75;
        this.frontWindow.position.x = .5;

        this.add(this.rearTires);
        this.add(this.frontTires);
        this.add(this.carBottom);
        this.add(this.frontPart);
        this.add(this.carTop);
        this.add(this.sideWindow);
        this.add(this.frontWindow);

        this.setScale(this.scaleFactor);
        this.rotation.y = Math.PI /2;
        this.animate = false;
        this.position.set(x, 0, z);
    }

    // WIREFRAME
    setWireframe(value) {
        this.rearTires.material.wireframe = value;
        this.frontTires.material.wireframe = value;
        this.carBottom.material.wireframe = value;
        this.frontPart.material.wireframe = value;
        this.carTop.material.wireframe = value;
        this.sideWindow.material.wireframe = value;
        this.frontWindow.material.wireframe = value;
    }

    // COLOR
    setCarBottomColor(hexColor) {
        this.color = hexColor;
        this.carBottom.setColor(this.color);
        this.frontPart.setColor(this.color);
    }
    
    setCarTopColor(hexColor) {
        this.carTop.setColor(hexColor);
    }
    
    setWindowsColor(hexColor) {
        this.sideWindow.setColor(hexColor);
        this.frontWindow.setColor(hexColor);
    }
    
    setTiresColor(hexColor) {
        this.rearTires.setColor(hexColor);
        this.frontTires.setColor(hexColor);
    }

    // ESCALAR
    setScale(value) {
        this.scale.set(value, value, value);
    }

    // ROTAR
    updateRotation(value) {
        this.rotate = value;
        renderLoop();
    }
}

export default class ClaseCar extends THREE.LOD {
    constructor(){
        super();
        const geometryCube = new THREE.BoxBufferGeometry();
        const material = new THREE.MeshBasicMaterial();
        const materialWire = new THREE.MeshBasicMaterial({wireframe: true});
        this.low = new THREE.Group()
        this.low.solid = new THREE.Mesh(geometryCube, material);
        this.low.wire = new THREE.Mesh(geometryCube, materialWire);
        this.low.add(this.low.solid);
        this.low.add(this.low.wire);
        this.high = new ClaseCarDetailed();
        this.addLevel(this.high, 100);
        this.addLevel(this.low, 300);
        this.color = this.high.carBottomColor;
        this.setCarBottomColor(this.color);
        this.animate = false;
        this.low.scale.set(7, 7, 7);
    }
    // WIREFRAME
    setWireframe(value) {
        this.high.setWireframe(value);
        this.low.wire.visible = value;
    }

    // COLOR
    setCarBottomColor(hexColor) {
        this.high.setCarBottomColor(hexColor);
        //this.color = color;
        this.low.solid.material.color.setHex(hexColor);
    }
    
    setCarTopColor(hexColor) {
        this.high.setCarTopColor(hexColor);
    }
    
    setWindowsColor(hexColor) {
        this.high.setWindowsColor(hexColor);
    }
    
    setTiresColor(hexColor) {
        this.high.setTiresColor(hexColor);
    }

    // ESCALAR
    setScale(value) {
        this.scale.set(value, value, value);
    }

    // ROTAR
    updateRotation(value) {
        this.rotate = value;
        renderLoop();
    }
}