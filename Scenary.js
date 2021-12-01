import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/OBJLoader.js";

// COMPONENTES DEL ESCENARIO
// SKYBOX
// Muestra cubo simulando el cielo y suelo
class Skybox extends THREE.Mesh {
  constructor(size = 1) {
    super();
    this.size = size;
    this.geometry = new THREE.BoxGeometry(size, size, size);
    this.material = [
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_ft.png"),side: THREE.DoubleSide}), // frontal
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_ft.png"),side: THREE.DoubleSide}), // back
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_up.png"),side: THREE.DoubleSide}), // up
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_dn.png"),side: THREE.DoubleSide}), // down
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_rt.png"),side: THREE.DoubleSide}), // right
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/skybox/sky_rt.png"),side: THREE.DoubleSide}), // left
    ];
    this.position.set(0, this.size / 2 - 200, 0);
  }

  setOnFloor() {
    this.geometry.computeBoundingBox();
    const bBox = this.geometry.boundingBox;
    this.position.y = -bBox.min.y;
  }
}

// STREET
// Crea la carretera de las calles
class Street extends THREE.Group {
  constructor(width = 100,height = 100,filename = "./textures/street.png",x = 0,z = 0,rS = 1,rT = 1, y = 0) {
    super();
    // Atributos
    this.visible = true;
    this.width = width;
    this.height = height;
    this.filename = filename;
    this.x = x;
    this.z = z;
    this.y = y;
    
    // Geometria y material
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    this.texture = new THREE.TextureLoader().load(this.filename);
    this.material = new THREE.MeshPhongMaterial({ map: this.texture, wireframe: false, color: 0xffffff});
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    
    // Repeticiones en S y T
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(rS, rT);
    
    // Posicion
    this.position.set(this.x, this.y, this.z);
    this.add(this.mesh);
  }

  setVisible(value = true) {
    this.visible = value;
  }
}

// INTERSECTION
// Este grupo junta las calles, cruces peatonales y centro de las avenidas
class Intersection extends THREE.Group {
  constructor() {
    super();
    this.visible = true;
    this.cross = new Street(50, 50, "./textures/center_street.png", 0, 0, 1, 1, 0.01);

    this.crosswalk1 = new Street(50, 5, "./textures/crosswalk.png", 0, 27.5, 1, 1, 0.01);
    this.crosswalk2 = new Street(50, 5, "./textures/crosswalk.png", 0, -27.5, 1, 1, 0.01);
    this.crosswalk2.rotation.y = Math.PI;
    this.crosswalk3 = new Street(50, 5, "./textures/crosswalk.png", 27.5, 0, 1, 1, 0.01);
    this.crosswalk3.rotation.y = Math.PI / 2;
    this.crosswalk4 = new Street(50, 5, "./textures/crosswalk.png", -27.5, 0, 1, 1, 0.01);
    this.crosswalk4.rotation.y = -Math.PI / 2;

    this.street1 = new Street(
      50,
      500,
      "./textures/street.png",
      0,
      267.5,
      1,
      20
    );
    this.street2 = new Street(
      50,
      500,
      "./textures/street.png",
      0,
      -267.5,
      1,
      20
    );
    this.street3 = new Street(
      50,
      500,
      "./textures/street.png",
      -267.5,
      0,
      1,
      13
    );
    this.street3.rotation.y = Math.PI / 2;
    this.street4 = new Street(
      50,
      500,
      "./textures/street.png",
      267.5,
      0,
      1,
      13
    );
    this.street4.rotation.y = Math.PI / 2;

    
    this.add(this.street1);
    this.add(this.street2);
    this.add(this.street3);
    this.add(this.street4);
    this.add(this.cross);
    this.add(this.crosswalk1);
    this.add(this.crosswalk2);
    this.add(this.crosswalk3);
    this.add(this.crosswalk4);
  }

  setVisible(value = true) {
    this.visible = value;
  }
}

// SIDEWALK
// Componente de banqueta 
class Sidewalk extends THREE.Mesh {
  constructor(x = 0, z = 0) {
    super();
    this.geometry = new THREE.BoxGeometry(205, 0.3, 305);
    const texture = new THREE.TextureLoader().load("./textures/sidewalk.jpeg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    this.material = new THREE.MeshBasicMaterial({ map: texture });
    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({wireframe: true,color: 0xffffff,});
    this.materialColor = new THREE.MeshBasicMaterial({ color: 0xBBBBBB });
    
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

// SIDEWALKGROUP
// Grupo que crea y junta todas las banquetas
class SidewalkGroup extends THREE.Group {
  constructor() {
    super();
    this.visible = true;

    this.sidewalk1 = new Sidewalk(-127.5, -177.5);
    this.sidewalk2 = new Sidewalk(-127.5, 177.5);
    this.sidewalk3 = new Sidewalk(127.5, -177.5);
    this.sidewalk4 = new Sidewalk(127.5, 177.5);

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

// CUBE
// Cubo basico con solido y mesh
class Cube extends THREE.Mesh {
  constructor( x = 0, z = 0, front = 50, depth = 50, height = 10, color = 0xcc0000, wireColor = 0xffffff) {
    super();
    this.front = front;
    this.length = length;
    this.height = height;
    this.color = color;
    this.wireColor = wireColor;

    this.geometry = new THREE.BoxGeometry(front, height, depth);
    this.materialWire = new THREE.MeshBasicMaterial({ wireframe: true, color: this.wireColor,});
    this.materialColor = new THREE.MeshPhongMaterial({ color: this.color });
    this.material = this.materialColor;
    
    this.position.set(x, 0, z);
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

class Floor extends THREE.Mesh {
  constructor(
    x = 0,
    y = 0,
    z = 0,
    size = 100,
    color = 0xcc0000,
    wireColor = 0xffffff,
  ) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
    this.position.set(x, y, z);
    this.color = color;
    this.wireColor = wireColor;
    this.geometry = new THREE.BoxGeometry(size, 0.1, size);

    this.materialWire = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: this.wireColor,
    });
    this.materialColor = new THREE.MeshBasicMaterial({ color: this.color });
    this.material = this.materialColor;
  }

  setTexture() {
    this.material = this.materialColor;
  }

  setWireframe() {
    this.material = this.materialWire;
  }
  setColor() {
    this.material = this.materialColor;
  }
}

class CubeGroup extends THREE.Group {
  constructor() {
    super();
    // FLOOR
    this.add(new Floor(0, -0.2, 0, 1050, 0xBBBBBB, 0xBBBBBB)) // Floor

    //SW - TEC - SORIANA
    this.add(new Cube(-70, 50, 20, 30, 10, 0x5ca1b1)); // Gasolinera-seven
    this.add(new Cube(-55, 50, 50, 40, 0.4, 0x808080));
    this.add(new Cube(-55, 82, 50, 20, 15, 0xc6d5d8)); // Tires
    this.add(new Cube(-55, 109, 50, 30, 10, 0xef8f63)); // Peak a bo
    this.add(new Cube(-55, 134, 50, 20, 0.4, 0x5aa897));
    this.add(new Cube(-55, 231, 50, 170, 15, 0x325288)); // Tec
    this.add(new Cube(-149.5, 105, 120, 50, 20, 0xd43a36)); // Soriana
    this.add(new Cube(-149.5, 55, 120, 50, 0.4, 0x808080)); //soriana

    //NW - RECINTO
    this.add(new Cube(-127.5, -177.5, 195, 295, 15, 0xc7e988)); // recinto

    //SE - ESQUINA SQUARE MARKET
    this.add(new Cube(57.5, 90, 55, 120, 25, 0xff414d)); // Square
    this.add(new Cube(57.5, 172, 55, 40, 40, 0xebdfcf)); // Edificio en construccion 1
    this.add(new Cube(57.5, 211.5, 55, 35, 10, 0xe9e9e9)); // pet
    this.add(new Cube(57.5, 256, 55, 50, 50, 0xc2b2a3)); // Edificio en construccion 2
    this.add(new Cube(57.5, 305.5, 55, 45, 7, 0xe9ca7c)); // Cochera

    this.add(new Cube(104.5, 65, 35, 70, 10, 0xbce5e5)); // Guarderia
    this.add(new Cube(136.5, 65, 25, 70, 10, 0xdfc159)); // Edificio en construccion 3
    this.add(new Cube(181, 65, 60, 70, 20, 0xa2d0c0)); // Plaza

    // NE - WALMART
    this.add(new Cube(50, -70, 40, 20, 10, 0xd54e2f)); // Gasolinera
    this.add(new Cube(50, -45, 40, 30, 0.4, 0x808080));
    this.add(new Cube(90, -142, 120, 120, 0.4, 0x808080)); // Walmart
    this.add(new Cube(182, -142, 64, 120, 20, 0x2e82c1));
    this.add(new Cube(65, -264, 70, 120, 10, 0xb3dbac)); // Valle real
    this.add(new Cube(92, -55, 40, 50, 15, 0x403244));
    this.add(new Cube(164, -56, 100, 52, 0.4, 0x808080));
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
// TRAFFICLIGHT
// Semaforo objeto tipo obj
class TrafficLight extends THREE.Group {
  constructor(x = 0, z = 0, color = 0x79de79) {
    super();
    this.x = x;
    this.z = z;
    this.color = color;
    this.wireColor = color;

    this.position.set(x, 0, z);
    this.loadOBJModel("./assets/traffic.obj");
  }
  // CARGAR EL OBJETO
  loadOBJModel(objFileName) {
    const loader = new OBJLoader(); 
    let component = this; 
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
  setColor(hexColor) {
    this.color = hexColor;
    this.traverse(function(child) {
      if (child.isMesh) {
          child.material.color.setHex(hexColor);
      }
    });
  }
}

// TRAFFICLIGHT GROUP
// Crea y posiciona los 4 semáforos
class TrafficLightGroup extends THREE.Group {
  constructor() {
    super();
    this.traffic1 = new TrafficLight(-19.5, 25.5);
    this.traffic2 = new TrafficLight(19.5, -25.5);
    this.traffic2.rotation.y = Math.PI;
    this.traffic3 = new TrafficLight(25.5, 19.5);
    this.traffic3.rotation.y = Math.PI / 2;
    this.traffic4 = new TrafficLight(-25.5, -19.5);
    this.traffic4.rotation.y = -Math.PI / 2;

    this.add(this.traffic1);
    this.add(this.traffic2);
    this.add(this.traffic3);
    this.add(this.traffic4);
  }
}

// BUILDING
// Componente con texturas que representa un edificio
class Building extends THREE.Mesh {
  constructor(
    x = 0,
    z = 0,
    width = 50,
    depth = 10,
    height = 10,
    file_front = "./textures/buildings/", 
    file_back = "./textures/buildings/", 
    file_side = "./textures/buildings/",
    color = 0xffe5b9
  ) {
    super();
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.file = "./textures/buildings/";
    this.color = color;
    const texture_front = new THREE.TextureLoader().load(this.file + file_front);
    const texture_side = new THREE.TextureLoader().load(this.file + file_side);
    const texture_back = new THREE.TextureLoader().load(this.file + file_back);

    this.position.set(x, 0, z);

    this.material = [
      new THREE.MeshBasicMaterial({ map: texture_front, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture_back, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture_side, side: THREE.FrontSide }),
      new THREE.MeshBasicMaterial({ map: texture_side, side: THREE.FrontSide }),
    ];

    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff});
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

// BUILDING FLOOR
// Representa estacionamientos
class BuildingFloor extends THREE.Mesh {
  constructor( x = 0, z = 0, width = 50, depth = 10, height = 10, file = "./textures/seven_parking.png", color = 0xffe5b9) {
    super();
    this.file = file;
    this.color = color;
    
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    const texture = new THREE.TextureLoader().load(this.file);

    
    this.material = [
      new THREE.MeshPhongMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ color: this.color, side: THREE.FrontSide }),
      new THREE.MeshPhongMaterial({ color: this.color, side: THREE.FrontSide }),
    ];
    
    this.materialTexture = this.material;
    this.materialWire = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
    this.materialColor = new THREE.MeshPhongMaterial({ color: this.color });
    
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

// BUILDING GROUP
// Crea y agrupa los edificos con texturas y estacionamientos, con las clases Building y BuildingFloor
class BuildingGroup extends THREE.Group {
  constructor() {
    super();
    // FLOOR
    this.add(new Floor(0, -0.2, 0, 900, 0xBBBBBB, 0xBBBBBB)) // Floor

    //SW - TEC - SORIANA
    this.add(new Building(  -70,  50,  20,  30,  10,  "seven_front.png", "seven_back.png", "seven_side.png", 0x544C42)); // Gasolinera-seven -57.5, 37.5, 20, 40, 10, "./textures/seven_front.png"
    this.add(new BuildingFloor(  -55,  50,  50,  40,  0.4,  "./textures/seven_parking.png",  0x5aa897));
    this.add(new Building(  -55,  82,  50,  20,  10,  "taller_front.png", "taller_back.png", "taller_side.png",  0xd9dad1)); // Tires
    this.add(new Building(  -55,  109,  50,  30,  10, "kinder_front.png", "kinder_back.png", "kinder_back.png",  0xF4F4F4)); // Peak a bo
    this.add(new BuildingFloor(  -55,  134,  50,  20,  0.4,  "./textures/kinder_parking.png",  0x5aa897));
    this.add(new Building(-55, 186, 50, 80, 50,"resi_front.png",  "resi.png",  "resi.png", 0xF07348));// resi
    this.add(new Building(-55, 253, 50, 50, 20,"tec_front.png",  "tec.png",  "tec.png", 0xD5D5D5));// Tec

    this.soriana = new Building( -149.5, 105, 50, 120, 20, "soriana_front.png", "soriana_back.png", "soriana_side.png", 0xD43A36 );
    this.soriana.rotation.y = Math.PI / 2;
    this.add(this.soriana); // Soriana

    this.add(new BuildingFloor(  -149.5,  55,  120,  50,  0.4,  "./textures/soriana_parking.png",  0x5aa897)); //soriana

    //NW - RECINTO
    this.add(new Building(  -127.5,  -177.5,  195,  295,  15,  "recinto.png",  "recinto.png",  "recinto.png",  0xA5E1FB)); // recinto

    //SE - ESQUINA SQUARE MARKET
    this.add(new Building(  57.5,  90,  55,  120,  25, "square_front.png", "square_back.png", "square_side.png",  0xff414d)); // Square
    this.add(new Building(  57.5,  172,  55,  40,  35, "build1.png", "build1_back.png", "build1.png",  0xBAA8A8)); // Edificio en construccion 1
    this.add(new Building(57.5, 211.5, 55, 35, 10, "pet.png", "pet_back.png", "pet.png", 0xFFFEF1)); // pet
    this.add(new Building(  57.5,  256,  55,  50,  40, "build2.png", "build2_back.png", "build2.png",  0xffffff)); // Edificio en construccion 
    this.add(new Building(57.5, 305.5, 55, 45, 7, "porton.png", "porton_back.png", "porton.png", 0xe9ca7c)); // Cochera
    this.add(new Building(  104.5,  65,  35,  70,  10,"school.png", "school.png", "school_side.png",  0xEEDBFD)); // Guarderia
    this.add(new Building(  136.5,  65,  25,  70,  10,  "const.png", "const.png", "const_side.png",  0x808080)); // Edificio en construccion 3
    this.add(new Building(  181,  65,  60,  70,  20,  "plaza.png", "plaza.png", "plaza_side.png",  0x939AB3)); // Plaza

    // NE - WALMART
    this.oxxo = new Building( 50, -70, 20, 40, 10, "oxxo_front.png", "oxxo.png", "oxxo.png", 0xe53f39);
    this.oxxo.rotation.y = -Math.PI / 2;
    this.add(this.oxxo); // Gasolinera
    
    this.add(new BuildingFloor(  50,  -55,  40,  30,  0.4,  "./textures/kinder_parking.png",  0x5aa897));
    this.add(new BuildingFloor( 90, -142, 120, 120, 0.3, "./textures/walmart_parking.png", 0xa7d0cd)); // Walmart

    this.walmart = new Building( 182, -142 , 64, 120, 20, "walmart_front.png", "walmart_back.png", "walmart_side.png", 0x2e82c1);
    this.walmart.rotation.y = Math.PI;
    this.add(this.walmart);

    this.add(new Building( 65, -264, 70, 120, 15, "valle.png", "valle_back.png", "valle.png", 0x0F272F)); // Valle real

    this.restaurant = new Building( 92, -55, 50, 40, 15, "rest_front.png", "rest.png","rest.png", 0x404040);
    this.restaurant.rotation.y = -Math.PI / 2;
    this.add(this.restaurant);

    this.add(new BuildingFloor( 164,  -56,  100,  52,  0.4,  "./textures/walmart_parking_av.png",  0x5aa897));
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

// SCENARY
// Escenario integrado por Skybox, intersección, banquetas, semaforos y edificios (Cube o Building).
export default class Scenary extends THREE.LOD {
  constructor() {
    super();

    this.low = new THREE.Group();
    this.low.add(new Skybox(900));
    this.low.add(new Intersection());
    this.low.add(new SidewalkGroup());
    this.trafficLightsLow = new TrafficLightGroup()
    this.low.add(this.trafficLightsLow);
    this.low.add(new CubeGroup());

    this.high = new THREE.Group();
    this.high.add(new Skybox(900));
    this.high.add(new Intersection());
    this.high.add(new SidewalkGroup());
    this.trafficLightsHigh = new TrafficLightGroup()
    this.high.add(this.trafficLightsHigh);
    this.high.add(new BuildingGroup());

    this.addLevel(this.high, 300);
    this.addLevel(this.low,400);
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
