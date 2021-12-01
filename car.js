import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/OBJLoader.js";

// MODELO AUTO
class CarHigh extends THREE.Group {
  constructor(x = 0,z = 0,color = 0x9ddac6,direction = false,id = 0,objFileName = "./assets/car.obj") {
    super();
    this.car_id = id;
    this.x = x;
    this.z = z;
    this.objFileName = objFileName;
    this.position.set(x, 0, z);
    this.color = color;
    this.wireColor = 0xf7f7f7;
    this.doubleSide = true;
    this.rotate = false;
    this.direction = direction;
    this.loadOBJModel(objFileName);
  }
  loadOBJModel(objFileName) {
    // instantiate a loader
    const loader = new OBJLoader();
    // load a resource
    const model = this;
    loader.load(
      objFileName,
      function (object) {
        // SOLID
        object.traverse(function (child) {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: model.color,
            });
          }
        });
        model.solid = object;

        // WIRE
        model.wire = object.clone();
        model.wire.traverse(function (child) {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              wireframe: true,
              color: model.wireColor,
            });
          }
        });

        if (model.direction) {
          model.rotation.y = Math.PI * 2;
        } else {
          model.rotation.y = Math.PI;
        }

        model.scale.set(0.5, 0.5, 0.5);
        // CHILDREN
        model.add(model.solid);
        model.add(model.wire);
        model.setOnFloor();
      },

      function (xhr) {
        // called when loading is in progresses
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      function (error) {
        // called when loading has errors
        console.log("An error happened" + error);
      }
    );
  }

  setMatWireframe(value) {
    this.wire.visible = value;
  }

  setMatColor(value) {
    this.solid.visible = value;
  }

  setColor(hexColor) {
    this.color = hexColor;
    this.solid.traverse(function (child) {
      if (child.isMesh) {
        child.material.color.setHex(hexColor);
      }
    });
  }
  setWireColor(hexColor) {
    this.wireColor = hexColor;
    this.wire.traverse(function (child) {
      if (child.isMesh) {
        child.material.color.setHex(hexColor);
      }
    });
  }
  setDoubleSide(value) {
    this.doubleSide = value;
    this.solid.traverse(function (child) {
      if (child.isMesh) {
        if (value) {
          child.material.side = THREE.DoubleSide;
        } else {
          child.material.side = THREE.FrontSide;
        }
      }
    });
  }
  setOnFloor() {
    const bBox = new THREE.Box3();
    bBox.setFromObject(this.solid);
    this.position.y = -bBox.min.y;
  }

  setPosition(x, z) {
    this.x = x;
    this.z = z;
    this.position.set(x, 0, z);
  }
}


class CarLow extends THREE.Group {
    constructor(x, z, color) {
        super();
        this.color = color;  // white
        const geometry = new THREE.BoxGeometry(2, 2, 4);
        this.materialColor = new THREE.MeshBasicMaterial({color: this.color});
        this.materialWire = new THREE.LineBasicMaterial({color: 0xffffff});
        this.mesh = new THREE.Mesh(geometry, this.materialColor);
        this.lines = new THREE.Line(geometry, this.materialWire);
        // CHILDREN
        this.add(this.mesh);
        this.add(this.lines);
        this.position.set(x, 0, z);
        this.setOnFloor();
    }

    setMatWireframe(value) {
        this.lines.visible = value;
    }
    setMatColor(value) {
        this.mesh.visible = value;
    }
    
    setColor(hexColor) {
        this.mesh.material.color.setHex(hexColor);
    }

    setWireColor(hexColor) {
        this.lines.material.color.setHex(hexColor);
    }
    setOnFloor() {
        const bBox = new THREE.Box3();
        bBox.setFromObject(this);
        this.position.y = -bBox.min.y;
    }
    
} 

export default class Car extends THREE.LOD {
  constructor(x = 0, z = 0, color = 0x9ddac6) {
    super();

    this.low = new CarLow(x, z, color);
    this.high = new CarHigh(x, z, color);

    this.addLevel(this.high, 100);
    this.addLevel(this.low, 150);
  }

  setVisible(value) {
    this.visible = value;
  }

  setMatWireframe(value) {
    this.low.setMatWireframe(value);
    this.high.setMatWireframe(value);
  }

  setMatColor(value) {
    this.low.setMatColor(value);
    this.high.setMatColor(value);
  }

  setColor(hexColor) {
    this.low.setColor(hexColor);
    this.high.setColor(hexColor);
  }

  setWireColor(hexColor) {
    this.low.setWireColor(hexColor);
    this.high.setWireColor(hexColor);
  }
}
