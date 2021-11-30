import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/OBJLoader.js";

// COMPONENTES DEL ESCENARIO
// CALLE
class Skybox extends THREE.Mesh {
  constructor(size = 1) {
    super();
    this.size = size;
    this.geometry = new THREE.BoxGeometry(size, size, size);
    this.material = [
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_ft.png"),
        side: THREE.DoubleSide,
      }), // frontal
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_ft.png"),
        side: THREE.DoubleSide,
      }), // back
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_up.png"),
        side: THREE.DoubleSide,
      }), // up
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_dn.png"),
        side: THREE.DoubleSide,
      }), // down
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_rt.png"),
        side: THREE.DoubleSide,
      }), // right
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("./textures/skybox/sky_rt.png"),
        side: THREE.DoubleSide,
      }), // left
    ];
    this.position.set(0, this.size / 2 - 10, 0);
  }
  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

class Street extends THREE.Group {
  constructor(
    width = 100,
    height = 100,
    filename = "./textures/street.png",
    x = 0,
    z = 0,
    rX = 1,
    rY = 1
  ) {
    super();
    this.visible = true;
    this.width = width;
    this.height = height;
    this.filename = filename;
    this.x = x;
    this.z = z;
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    this.texture = new THREE.TextureLoader().load(this.filename);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      wireframe: false,
      color: 0xffffff,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(rX, rY);
    this.position.set(this.x, 0, this.z);
    // CHILDREN
    this.add(this.mesh);
  }
  setVisible(value = true) {
    this.visible = value;
  }
}

class Intersection extends THREE.Group {
  constructor() {
    super();
    this.visible = true;
    this.cross = new Street(25, 25, "./textures/center_street.png");

    this.crosswalk1 = new Street(25, 5, "./textures/crosswalk.png", 0, 15);
    this.crosswalk2 = new Street(25, 5, "./textures/crosswalk.png", 0, -15);
    this.crosswalk2.rotation.y = Math.PI;
    this.crosswalk3 = new Street(25, 5, "./textures/crosswalk.png", 15, 0);
    this.crosswalk3.rotation.y = Math.PI / 2;
    this.crosswalk4 = new Street(25, 5, "./textures/crosswalk.png", -15, 0);
    this.crosswalk4.rotation.y = -Math.PI / 2;

    this.street1 = new Street(
      25,
      300,
      "./textures/street.png",
      0,
      167.5,
      1,
      20
    );
    this.street2 = new Street(
      25,
      300,
      "./textures/street.png",
      0,
      -167.5,
      1,
      20
    );
    this.street3 = new Street(
      25,
      200,
      "./textures/street.png",
      -117.5,
      0,
      1,
      13
    );
    this.street3.rotation.y = Math.PI / 2;
    this.street4 = new Street(
      25,
      200,
      "./textures/street.png",
      117.5,
      0,
      1,
      13
    );
    this.street4.rotation.y = Math.PI / 2;

    this.add(this.cross);
    this.add(this.crosswalk1);
    this.add(this.crosswalk2);
    this.add(this.crosswalk3);
    this.add(this.crosswalk4);
    this.add(this.street1);
    this.add(this.street2);
    this.add(this.street3);
    this.add(this.street4);
  }

  setVisible(value = true) {
    this.visible = value;
  }
}

class Sidewalk extends THREE.Mesh {
  constructor(x = 0, z = 0) {
    super();
    this.geometry = new THREE.BoxGeometry(205, 0.3, 305);
    const texture = new THREE.TextureLoader().load("./textures/sidewalk.jpeg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    this.position.set(x, 0, z);
    this.material = new THREE.MeshBasicMaterial({ map: texture });

    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
    });
    this.materialColor = new THREE.MeshBasicMaterial({ color: 0x808080 });

    this.setOnFloor();
  }

  setTexture() {
    this.material = this.materialTexture;
  }

  setWireframe() {
    this.material = this.materialWire;
  }

  setColor() {
    this.material = this.materialColor;
  }

  setVisible(value = true) {
    this.visible = value;
  }

  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

class SidewalkGroup extends THREE.Group {
  constructor() {
    super();
    this.visible = true;

    this.sidewalk1 = new Sidewalk(-115, -165);
    this.sidewalk2 = new Sidewalk(-115, 165);
    this.sidewalk3 = new Sidewalk(115, -165);
    this.sidewalk4 = new Sidewalk(115, 165);

    this.add(this.sidewalk1);
    this.add(this.sidewalk2);
    this.add(this.sidewalk3);
    this.add(this.sidewalk4);
  }

  setTexture() {
    this.children.forEach((element) => {
      element.setTexture();
    });
  }

  setWireframe() {
    this.children.forEach((element) => {
      element.setWireframe();
    });
  }

  setColor() {
    this.children.forEach((element) => {
      element.setColor();
    });
  }

  setVisible(value = true) {
    this.visible = value;
  }
}

class Cube extends THREE.Mesh {
  constructor(
    x = 0,
    z = 0,
    front = 50,
    depth = 50,
    height = 10,
    color = 0xcc0000,
    wireColor = 0xffffff
  ) {
    super();
    this.front = front;
    this.length = length;
    this.height = height;
    this.position.set(x, 0, z);
    this.color = color;
    this.wireColor = wireColor;
    this.geometry = new THREE.BoxGeometry(front, height, depth);

    this.materialWire = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: this.wireColor,
    });
    this.materialColor = new THREE.MeshBasicMaterial({ color: this.color });
    this.material = this.materialColor;

    this.setOnFloor();
  }
  setWireframe() {
    this.material = this.materialWire;
  }
  setColor() {
    this.material = this.materialColor;
  }
  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

class CubeGroup extends THREE.Group {
  constructor() {
    super();
    //SW - TEC - SORIANA
    this.add(new Cube(-57.5, 37.5, 20, 30, 10, 0x5ca1b1)); // Gasolinera-seven -57.5, 37.5, 20, 40, 10, "./textures/seven_front.png"
    this.add(new Cube(-42.5, 37.5, 50, 40, 0.4, 0x808080));
    this.add(new Cube(-42.5, 69.5, 50, 20, 15, 0xc6d5d8)); // Tires
    this.add(new Cube(-42.5, 96.5, 50, 30, 10, 0xef8f63)); // Peak a bo
    this.add(new Cube(-42.5, 121.5, 50, 20, 0.4, 0x5aa897));
    this.add(new Cube(-42.5, 218.5, 50, 170, 15, 0x325288)); // Tec
    this.add(new Cube(-137, 92.5, 120, 50, 20, 0xd43a36)); // Soriana
    this.add(new Cube(-137, 42.5, 120, 50, 0.4, 0x808080)); //soriana

    //NW - RECINTO
    this.add(new Cube(-115, -165, 195, 295, 15, 0xc7e988)); // recinto

    //SE - ESQUINA SQUARE MARKET
    this.add(new Cube(45, 77.5, 55, 120, 25, 0xff414d)); // Square
    this.add(new Cube(45, 159.5, 55, 40, 40, 0xebdfcf)); // Edificio en construccion 1
    this.add(new Cube(45, 199, 55, 35, 10, 0xe9e9e9)); // pet
    this.add(new Cube(45, 243.5, 55, 50, 50, 0xc2b2a3)); // Edificio en construccion 2
    this.add(new Cube(45, 293, 55, 45, 7, 0xe9ca7c)); // Cochera

    this.add(new Cube(92, 52.5, 35, 70, 10, 0xbce5e5)); // Guarderia
    this.add(new Cube(124, 52.5, 25, 70, 10, 0xdfc159)); // Edificio en construccion 3
    this.add(new Cube(168.5, 52.5, 60, 70, 20, 0xa2d0c0)); // Plaza

    // NE - WALMART
    this.add(new Cube(37.5, -57.5, 40, 20, 10, 0xd54e2f)); // Gasolinera
    this.add(new Cube(37.5, -32.5, 40, 30, 0.4, 0x808080));
    this.add(new Cube(77.5, -129.5, 120, 120, 0.4, 0x808080)); // Walmart
    this.add(new Cube(169.5, -129.5, 64, 120, 20, 0x2e82c1));
    this.add(new Cube(52.5, -251.5, 70, 120, 10, 0xb3dbac)); // Valle real
    this.add(new Cube(79.5, -42.5, 40, 50, 15, 0x403244));
    this.add(new Cube(151.5, -43.5, 100, 52, 0.4, 0x808080));
  }
  setWireframe() {
    this.children.forEach((element) => {
      element.setWireframe();
    });
  }

  setColor() {
    this.children.forEach((element) => {
      element.setColor();
    });
  }
}

class TrafficLight extends THREE.Group {
  constructor(x = 0, z = 0, color = 0x79de79) {
    super();
    this.x = x;
    this.z = z;
    this.position.set(x, 0, z);
    this.color = color;
    this.wireColor = color;
    this.loadOBJModel("./assets/traffic.obj");
  }
  loadOBJModel(objFileName) {
    const loader = new OBJLoader(); // instantiate a loader
    let component = this; // load a resource
    loader.load(
      objFileName,
      function (object) {
        // SOLID
        object.traverse(function (child) {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: component.color,
            });
          }
        });
        component.solid = object;
        // WIRE
        component.wire = object.clone();
        component.wire.traverse(function (child) {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              wireframe: true,
              color: component.wireColor,
            });
          }
        });

        component.scale.set(0.05, 0.05, 0.05);
        // CHILDREN
        component.add(component.solid);
        component.add(component.wire);
        component.setOnFloor();
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened" + error);
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
}

class TrafficLightGroup extends THREE.Group {
  constructor() {
    super();
    this.traffic1 = new TrafficLight(-7, -13);
    this.traffic2 = new TrafficLight(7, 13);
    this.traffic2.rotation.y = Math.PI;
    this.traffic3 = new TrafficLight(-13, 7);
    this.traffic3.rotation.y = Math.PI / 2;
    this.traffic4 = new TrafficLight(13, -7);
    this.traffic4.rotation.y = -Math.PI / 2;

    this.add(this.traffic1);
    this.add(this.traffic2);
    this.add(this.traffic3);
    this.add(this.traffic4);
  }
}

class Building extends THREE.Mesh {
  constructor(
    x = 0,
    z = 0,
    width = 50,
    depth = 10,
    height = 10,
    file = "./textures/seven_",
    color = 0xffe5b9
  ) {
    super();
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.file = file;
    this.color = color;
    const texture_front = new THREE.TextureLoader().load(
      this.file + "front.png"
    );
    const texture_side = new THREE.TextureLoader().load(this.file + "side.png");
    const texture_back = new THREE.TextureLoader().load(this.file + "back.png");

    this.position.set(x, 0, z);

    this.material = [
      new THREE.MeshBasicMaterial({
        map: texture_front,
        side: THREE.FrontSide,
      }),
      new THREE.MeshBasicMaterial({ map: texture_back, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture_side, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture_side, side: THREE.FrontSide }),
    ];

    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
    });
    this.materialColor = new THREE.MeshBasicMaterial({ color: this.color });

    this.position.set(x, 0, z);
    this.setOnFloor();
  }

  setTexture() {
    this.material = this.materialTexture;
  }

  setWireframe() {
    this.material = this.materialWire;
  }

  setColor() {
    this.material = this.materialColor;
  }

  setVisible(value = true) {
    this.visible = value;
  }

  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

class BuildingFloor extends THREE.Mesh {
  constructor(
    x = 0,
    z = 0,
    width = 50,
    depth = 10,
    height = 10,
    file = "./textures/seven_parking.png",
    color = 0xffe5b9
  ) {
    super();
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.file = file;
    this.color = color;
    const texture = new THREE.TextureLoader().load(this.file);

    this.position.set(x, 0, z);

    this.material = [
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
    ];

    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
    });
    this.materialColor = new THREE.MeshBasicMaterial({ color: this.color });

    this.position.set(x, 0, z);
    this.setOnFloor();
  }

  setTexture() {
    this.material = this.materialTexture;
  }

  setWireframe() {
    this.material = this.materialWire;
  }

  setColor() {
    this.material = this.materialColor;
  }

  setVisible(value = true) {
    this.visible = value;
  }

  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

class BuildingGroup extends THREE.Group {
  constructor() {
    super();
    //SW - TEC - SORIANA
    this.add(
      new Building(
        -57.5,
        37.5,
        20,
        30,
        10,
        "./textures/buildings/seven_",
        0x0c0c0c
      )
    ); // Gasolinera-seven -57.5, 37.5, 20, 40, 10, "./textures/seven_front.png"
    this.add(
      new BuildingFloor(
        -42.5,
        37.5,
        50,
        40,
        0.4,
        "./textures/seven_parking.png",
        0x5aa897
      )
    );
    this.add(
      new Building(
        -42.5,
        69.5,
        50,
        20,
        15,
        "./textures/buildings/taller_",
        0xd9dad1
      )
    ); // Tires

    this.add(
      new Building(
        -42.5,
        96.5,
        50,
        30,
        10,
        "./textures/buildings/kinder_",
        0xef8f63
      )
    ); // Peak a bo
    this.add(
      new BuildingFloor(
        -42.5,
        121.5,
        50,
        20,
        0.4,
        "./textures/kinder_parking.png",
        0x5aa897
      )
    );

    //this.add(new Building(-42.5, 218.5, 50, 170, 15,"./textures/buildings/tec_", 0x325288));// Tec

    this.soriana = new Building(
      -137,
      92.5,
      50,
      120,
      20,
      "./textures/buildings/soriana_",
      0xd43a36
    );
    this.soriana.rotation.y = Math.PI / 2;
    this.add(this.soriana); // Soriana
    this.add(
      new BuildingFloor(
        -137,
        42.5,
        120,
        50,
        0.4,
        "./textures/soriana_parking.png",
        0x5aa897
      )
    ); //soriana

    //NW - RECINTO
    this.add(
      new Building(
        -115,
        -165,
        195,
        295,
        15,
        "./textures/buildings/recinto_",
        0xc7e988
      )
    ); // recinto

    //SE - ESQUINA SQUARE MARKET
    this.add(
      new Building(
        45,
        77.5,
        55,
        120,
        25,
        "./textures/buildings/square_",
        0xff414d
      )
    ); // Square

    this.add(
      new Building(
        45,
        159.5,
        55,
        40,
        40,
        "./textures/buildings/build2_",
        0xd5cdba
      )
    ); // Edificio en construccion 1
    this.add(
      new Building(45, 199, 55, 35, 10, "./textures/buildings/pet_", 0xe9e9e9)
    ); // pet
    this.add(
      new Building(
        45,
        243.5,
        55,
        50,
        50,
        "./textures/buildings/build_",
        0xc2b2a3
      )
    ); // Edificio en construccion 2

    this.add(
      new Building(45, 293, 55, 45, 7, "./textures/buildings/porton_", 0xe9ca7c)
    ); // Cochera

    this.add(
      new Building(
        92,
        52.5,
        35,
        70,
        10,
        "./textures/buildings/school_",
        0xbce5e5
      )
    ); // Guarderia
    this.add(
      new Building(
        124,
        52.5,
        25,
        70,
        10,
        "./textures/buildings/const_",
        0x808080
      )
    ); // Edificio en construccion 3
    this.add(
      new Building(
        168.5,
        52.5,
        60,
        70,
        20,
        "./textures/buildings/plaza_",
        0x767b84
      )
    ); // Plaza

    // NE - WALMART
    this.oxxo = new Building(
      37.5,
      -57.5,
      20,
      40,
      10,
      "./textures/buildings/oxxo_",
      0xe53f39
    );
    this.oxxo.rotation.y = -Math.PI / 2;
    this.add(this.oxxo); // Gasolinera
    this.add(
      new BuildingFloor(
        37.5,
        -32.5,
        40,
        30,
        0.4,
        "./textures/kinder_parking.png",
        0x5aa897
      )
    );

    this.add(
      new BuildingFloor(
        77.5,
        -129.5,
        120,
        120,
        0.3,
        "./textures/walmart_parking.png",
        0xa7d0cd
      )
    ); // Walmart
    this.walmart = new Building(
      169.5,
      -129.5,
      64,
      120,
      20,
      "./textures/buildings/walmart_",
      0x2e82c1
    );
    this.walmart.rotation.y = Math.PI;
    this.add(this.walmart);

    this.add(
      new Building(
        52.5,
        -251.5,
        70,
        120,
        10,
        "./textures/buildings/valle_",
        0xb3dbac
      )
    ); // Valle real

    this.restaurant = new Building(
      79.5,
      -42.5,
      50,
      40,
      15,
      "./textures/buildings/rest_",
      0x404040
    );
    this.restaurant.rotation.y = -Math.PI / 2;
    this.add(this.restaurant);

    this.add(
      new BuildingFloor(
        151.5,
        -43.5,
        100,
        52,
        0.4,
        "./textures/walmart_parking_av.png",
        0x5aa897
      )
    );
  }

  setTexture() {
    this.children.forEach((element) => {
      element.setTexture();
    });
  }

  setWireframe() {
    this.children.forEach((element) => {
      element.setWireframe();
    });
  }

  setColor() {
    this.children.forEach((element) => {
      element.setColor();
    });
  }
}

export default class Scenary extends THREE.LOD {
  constructor(size = 1000) {
    super();

    this.low = new THREE.Group();
    this.low.add(new Skybox(1000));
    this.low.add(new Intersection());
    this.low.add(new SidewalkGroup());
    this.low.add(new TrafficLightGroup());
    this.low.add(new CubeGroup());

    this.high = new THREE.Group();
    this.high.add(new Skybox(1000));
    this.high.add(new Intersection());
    this.high.add(new SidewalkGroup());
    this.high.add(new TrafficLightGroup());
    this.high.add(new BuildingGroup());

    this.addLevel(this.high, 100);
    this.addLevel(this.low, 200);
  }

  setTexture() {
    this.high.children[2].setTexture();
    this.high.children[4].setTexture();
    this.low.children[2].setTexture();
    this.low.children[4].setColor();
  }

  setWireframe() {
    this.high.children[2].setWireframe();
    this.high.children[4].setWireframe();
    this.low.children[2].setWireframe();
    this.low.children[4].setWireframe();
  }

  setColor() {
    this.high.children[2].setColor();
    this.high.children[4].setColor();
    this.low.children[2].setColor();
    this.low.children[4].setColor();
  }
}
