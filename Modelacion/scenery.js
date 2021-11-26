import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import {OBJLoader} from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/OBJLoader.js';
import Axes from './axes.js';
import Floor from './floor.js';

// COMPONENTES DEL ESCENARIO

class Cube extends THREE.Group {
    constructor(x = 0, z = 0, front = 50, depth = 50, height = 10, color = 0xcc0000, wireColor = 0xffffff) {
        super();
        this.front = front;
        this.length = length;
        this.height = height;
        this.position.set(x, 0, z);
        this.color = color;
        this.wireColor = wireColor;
        this.doubleSide = false;
        this.rotate = false;
        const geometry = new THREE.BoxGeometry(front, height, depth);
        const material = new THREE.MeshBasicMaterial({color});
        const materialWire = new THREE.MeshBasicMaterial({wireframe: true, color: wireColor});
        this.solid = new THREE.Mesh(geometry, material);
        this.wire = new THREE.Mesh(geometry, materialWire);
        this.setOnFloor();
        // CHILDREN
        this.add(this.solid);
        this.add(this.wire);
    }
    setWireframe(value = true) {
        this.solid.setVisible(value);
    }
    setColor(hexColor) {
        this.color = hexColor;
        this.solid.material.color.setHex(hexColor);
    }
    setWireColor(hexColor) {
        this.wireColor = hexColor;
        this.wire.material.color.setHex(hexColor);
    }
    setDoubleSide(value) {
        this.doubleSide = value;
        if(value) {
            this.solid.material.side = THREE.DoubleSide;
        } else {
            this.solid.material.side = THREE.FrontSide;
        }
    }
    setOnFloor() {
        this.solid.geometry.computeBoundingBox();
        const bBox = this.solid.geometry.boundingBox;
        this.position.y = -bBox.min.y;
    }
}

class ScenaryComponent extends THREE.Group {
    constructor(color = 0x808080, scaleFactor = 1, objFileName = "./assets/obj/GasStation.obj", vertical = true, x = 0, z = 0, y = 0) {
        super();
        this.x = x;
        this.z = z;
        this.y = y;
        this.position.set(x, y, z);
        this.color = color;
        this.scaleFactor = scaleFactor;
        this.vertical = vertical;
        this.wireColor = 0xffffff;
        this.objFileName = objFileName;
        this.loadOBJModel(objFileName);
    }
    loadOBJModel(objFileName) {
        const loader = new OBJLoader();// instantiate a loader
        let component = this; // load a resource
        loader.load(objFileName,
            function (object) { 
                // SOLID
                object.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({color: component.color});
                    }
                });
                component.solid = object;
                // WIRE
                component.wire = object.clone();
                component.wire.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({wireframe: true, color: component.wireColor});
                    }
                });

                component.setRotation(component.vertical);

                component.scale.set(component.scaleFactor, component.scaleFactor, component.scaleFactor);
                // CHILDREN
                component.add(component.solid);
                component.add(component.wire);
                //scene.add(component);
                //component.setOnFloor();
            },
                // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
                // called when loading has errors
            function (error) {
                console.log( 'An error happened' + error );
            }
        );
    }
    setOnFloor() {
        const bBox = new THREE.Box3();
        bBox.setFromObject(this.solid);
        this.position.y = -bBox.min.y;
    }

    setColor(color) {
        this.mesh.material.color.setHex(color);
    }

    setRotation(vertical = true) {
        if (vertical) {
            this.rotation.y = Math.PI;
        } else {
            this.rotation.y = 2 * Math.PI;
        }
    }
}

class GasStation extends ScenaryComponent {
    constructor(x = 0, z = 0, vertical = true, color = 0x808080, scaleFactor = 2, y = 0, objFileName = "./assets/obj/GasStation.obj") {
        super(color, scaleFactor, objFileName, vertical, x, z, y);
    }
}

class House extends ScenaryComponent {
    constructor(x = 0, z = 0, vertical = true, color = 0x808080, scaleFactor = 0.3, y = 0, objFileName = "./assets/obj/house.obj") {
        super(color, scaleFactor, objFileName, vertical, x, z, y);
        this.rotation.x = Math.PI/2;
    }
}

class Gate extends ScenaryComponent {
    constructor(x = 0, z = 0, vertical = true, color = 0x808080, scaleFactor = 0.15, y = 0, objFileName = "./assets/obj/fence.obj") {
        super(color, scaleFactor, objFileName, vertical, x, z, y);
    }

    setRotation(rotate = true) {
        if (rotate) {
            this.rotation.y = 2*Math.PI;
        } else {
            this.rotation.y =Math.PI/2;
        }
    }
}

class Tree extends ScenaryComponent {
    constructor(x = 0, z = 0, vertical = true, color = 0x32cd32, scaleFactor = 0.7, y = 0, objFileName = "./assets/obj/tree.obj") {
        super(color, scaleFactor, objFileName, vertical, x, z, y);
    }
    setRotation(rotate = true) {
        if (rotate) {
            this.rotation.y = Math.PI;
        } else {
            this.rotation.y = Math.PI/2;
        }
    }
}

export default class Scenary extends THREE.Group {
    constructor(size = 1000) {
        super();
        this.axes = new Axes(size);
        this.floor = new Floor(size);
        this.cubes = [];
        this.trees = [];

         //SW - TEC - SORIANA
         this.cubes.push(new Cube(-38, 33, 50, 40, 0.3, 0x5AA897)); // Gasolinera-seven
         this.add(new GasStation(-45, 45, true, 0x5AA897));

         this.cubes.push(new Cube(-38, 65, 50, 20, 7));// Tires

         this.cubes.push(new Cube(-38, 102, 50, 50, 0.3, 0xB983FF));// Peak a bo
         this.add(new House(-38,110, true, 0xB983FF));

         this.cubes.push(new Cube(-38, 214, 50, 170, 15, 0x325288));// Tec

         this.cubes.push(new Cube(-132.5, 50.5, 135, 75, 20, 0xFFC93C));// Soriana


        //NW - RECINTO
        this.cubes.push(new Cube(-113, -161, 200, 296, .3, 0x9FE6A0));// recinto
        this.trees.push(new Tree(-33, -25));
        this.trees.push(new Tree(-90, -25));
        this.trees.push(new Tree(-147, -25));
        this.trees.push(new Tree(-25, -55, false));
        this.trees.push(new Tree(-25, -100, false));
        this.trees.push(new Tree(-25, -150, false));
        this.trees.push(new Tree(-25, -200, false));
        this.trees.push(new Tree(-25, -250, false));
        //this.add(new Tree(38, 12));// recinto

        //SE - ESQUINA SQUARE MARKET
        this.cubes.push(new Cube(38, 73, 55, 120, 25,0xFF414D)); // Square
        this.cubes.push(new Cube(38, 160, 55, 50, 10, 0x1AA6B7)); // Edificio en construccion 1
        this.cubes.push(new Cube(38, 209.5, 55, 45, 15, 0xEDC988)); // Edificio en construccion 2

        this.cubes.push(new Cube(38, 256.5, 55, 45, 0.3, 0x214252)); // Cochera
        this.add(new Gate(25, 250, false));
        this.add(new Gate(25, 265, false)); 

        this.cubes.push(new Cube(87.5, 48, 35, 70, 0.3, 0x693C72)); // Guarderia
        this.add(new House(87.5,20, true, 0x693C72));

        this.cubes.push(new Cube(119.5, 48, 25, 70, 0.3, 0xDE8971)); // Edificio en construccion 3
        this.add(new Gate(119, 20));

        this.cubes.push(new Cube(154, 48, 40, 70, 15, 0xD1CEBD)); // Plaza

        this.cubes.push(new Cube(186, 48, 20, 70, 0.3, 0xA0937D)); // Altamira
        this.add(new Gate(186, 20));
        
        // NE - WALMART
        this.cubes.push(new Cube(33, -38, 40, 50, 0.3, 0x808080)); // Gasolinera
        this.add(new GasStation(40, -45, false, 0x808080, 2));

        this.cubes.push(new Cube(105, -125, 184, 120, 20, 0xA7D0CD)); // Walmart

        this.cubes.push(new Cube(48, -247, 70, 120, 0.3, 0x4AA96C)); // Valle real
        this.trees.push(new Tree(20, -260, false));
        this.trees.push(new Tree(20, -210, false));

        this.cubes.push(new Cube(75, -38, 40, 50, 7, 0xFFC93C)); // Restaurant

        this.cubes.push(new Cube(147, -39, 100, 52, 20, 0xA7D0CD)); // Walmart aviacion

        // this.add(new Lane(113, 0, 200, 1));
        // this.add(new Lane(-113, 0, 200, 1));

        // let lane = new Lane(0, 163, 300, 1);
        // lane.rotation.y = Math.PI/2;
        // this.add(lane);

        // lane = new Lane(0, -163, 300, 1);
        // lane.rotation.y = Math.PI/2;
        // this.add(lane);

        // CHILDREN
        this.add(this.axes);
        this.add(this.floor);
        for(let i = 0; i < this.cubes.length; i++) {
            this.add(this.cubes[i]);
        }

        for(let i = 0; i < this.trees.length; i++) {
            this.add(this.trees[i]);
        }
    }
}