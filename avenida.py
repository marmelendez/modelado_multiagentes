import agentpy as ap
import numpy as np
import math
import random
import json

# inicializa un semafor en verde con vuelta a la izq
# Se apaga para vuelta y se enciende el de lado contrario para enfrente
# Se apaga el verde del semaforo incial y el


class Semaphore(ap.Agent):

    #   Clase que define semaforo dentro de la simulacion

    def setup(self):
        # Inicializar el samaforo

        self.step_time = 0.1         # Tiempo que dura cada paso de la simulacion

        self.direction = [0, 1]      # Direccion a la que apunta el semaforo

        self.state = 0               # Estado del semaforo 0 = verde, 1 = amarillo, 2 = rojo
        self.state_time = 0          # Tiempo que ha durado el semaforo en el estado actual

        self.green_duration = 5     # Duracion del semaforo en verde
        self.yellow_duration = 1    # Duracion del semaforo en amarillo
        self.red_duration = 6       # Duracion del semaforo en rojo

        self.type = 0

        self.total_wait_time = 0    # Tiempo total de espera de los carros en el mismo carril
        self.flag_last = False
        self.flag = False

    def update(self):
        # Actualizar el estado del semaforo
        self.state_time += self.step_time

        if self.state == 0:
            # Caso en el que el semaforo esta en verde
            if self.state_time >= self.green_duration:
                self.state = 1
                self.state_time = 0
                self.total_wait_time = 0
        elif self.state == 1:
            # Caso en el que el semaforo esta en amarillo
            if self.state_time >= self.yellow_duration:
                self.state = 2
                self.state_time = 0
                self.flag = True
        elif self.state == 2:
            # Caso en el que el semaforo esta en rojo
            if self.state_time >= self.red_duration:
                self.state = 0
                self.state_time = 0

    def count_wait_time(self):
        self.total_wait_time = 0
        for car in self.model.cars:
            p = self.model.avenue.positions[self]
            # Verifica si el carro apunta hacia el semaforo
            dot_p1 = car.direction[0]*self.direction[0] + \
                car.direction[1]*self.direction[1]

            # Suma de espera de todos los carros
            if dot_p1 < 0:
                self.total_wait_time += car.wait_counter


class Car(ap.Agent):

    # Clase que define a un carro dentro de la simulacion

    def setup(self):
        #   Inicializacion de un carro
        self.step_time = 0.1         # Tiempo que dura cada paso de la simulacion

        self.direction = [1, 0]     # Direccion a la que viaja el auto
        self.speed = 0.0             # Velocidad en metros por segundo
        self.max_speed = 30          # Maxima velocidad en metros por segundo
        self.state = 1               # Car state: 1 = funcionando, 0 = choque
        self.x = 0
        self.y = 0

        self.wait_counter = 0

    def update_position(self):
        # Inicializar posicion de carro

        # Verifica si el auto no ha chocado
        if self.state == 0:
            return

         # Actualiza la posicion segun la velocidad actual
        self.model.avenue.move_by(
            self, [self.speed*self.direction[0], self.speed*self.direction[1]])

    def update_speed(self):
        # Definir la velocidad del carro

        if (self.speed == 0):
            self.wait_counter += 1
        else:
            self.wait_counter = 0

        # Verifica si el auto no ha chocado
        if self.state == 0:
            return

        # Obten la distancia mws pequena a uno de los autos que vaya en la misma direccion y este dentro del mismo carril
        p = self.model.avenue.positions[self]

        min_car_distance = 1000000

        # Inicializar valor para carro que puede chocar
        crashed_car = self

        # Guardar carro m??s cercano de todos (no solo en tu misma direccion)
        if (self.model.cars[0] != self):
            closest_car = self.model.cars[0]
        else:
            closest_car = self.model.cars[1]

        p2 = self.model.avenue.positions[closest_car]
        closest_car_distance = math.sqrt((p[0]-p2[0])**2 + (p[1]-p2[1])**2)

        for car in self.model.cars:
            if car != self:
                # Verifica si el carro va en la misma direccion (Producto punto entre dos vectores positivo significa que apuntan a la misma direccion)
                dot_p1 = self.direction[0]*car.direction[0] + \
                    self.direction[1]*car.direction[1]

                # Verifica si el carro esta atras o adelante
                p2 = self.model.avenue.positions[car]
                dot_p2 = (p2[0]-p[0])*self.direction[0] + \
                    (p2[1]-p[1])*self.direction[1]

                # Verifica si el carro esta dentro del mismo carril
                dot_p3 = True
                if (self.direction[0] >= 0.5 and car.direction[0] >= 0.5 or self.direction[0] <= -0.5 and car.direction[0] <= -0.5):
                    if(abs(p[1] - p2[1]) >= 60):
                        dot_p3 = False
                elif(self.direction[1] >= 0.5 and car.direction[1] >= 0.5 or self.direction[1] <= -0.5 and car.direction[1] < -0.5):
                    if(abs(p[0] - p2[0]) >= 60):
                        dot_p3 = False

                curr_car_distance = math.sqrt(
                    (p[0]-p2[0])**2 + (p[1]-p2[1])**2)
                if(curr_car_distance < closest_car_distance):
                    closest_car_distance = curr_car_distance
                    closest_car = car

                if dot_p1 > 0 and dot_p2 > 0 and dot_p3:
                    d = math.sqrt((p[0]-p2[0])**2 + (p[1]-p2[1])**2)

                    if min_car_distance > d:
                        min_car_distance = d
                        if min_car_distance < 20:
                            crashed_car = car

        # Obten la distancia al proximo semaforo
        min_semaphore_distance = 1000000
        semaphore_state = 0
        for semaphore in self.model.semaphores:

            # Verifica si el semaforo apunta hacia el vehiculo
            dot_p1 = semaphore.direction[0]*self.direction[0] + \
                semaphore.direction[1]*self.direction[1]

            # Verifica si el semaforo esta adelante o atras del vehiculo
            p2 = self.model.avenue.positions[semaphore]
            dot_p2 = (p2[0]-p[0])*self.direction[0] + \
                (p2[1]-p[1])*self.direction[1]

            if dot_p1 < 0 and dot_p2 > 0:
                d = math.sqrt((p[0]-p2[0])**2 + (p[1]-p2[1])**2)

                if min_semaphore_distance > d:
                    min_semaphore_distance = d
                    semaphore_state = semaphore.state

        # Actualiza la velocidad del auto

        # Carro choca con caulquier otro carro
        if (closest_car_distance < 40):
            self.speed = -1
            self.state = 0
            closest_car.speed = -1
            closest_car.state = 0

        # Carro choca con otro de su carril
        if min_car_distance < 40:
            self.speed = -1
            self.state = 0
            crashed_car.speed = -1
            crashed_car.state = 0

        # Se encontro un carro adelante cercano -> frenar mucho
        elif min_car_distance < 150:
            self.speed = np.maximum(self.speed - 150*self.step_time, 0)

        # Se encontro un carro adelante lejano -> frenar poco
        elif min_car_distance < 150:
            self.speed = np.maximum(self.speed - 80*self.step_time, 0)

        # Semaforo en rojo y se paso el cruce -> acelerar
        elif min_semaphore_distance < 600 and (semaphore_state == 1 or semaphore_state == 2):
            self.speed = np.minimum(
                self.speed + 10*self.step_time, self.max_speed)

        # Semaforo en rojo o amarillo, no se encontro carro enfrente, el carro tiene poca velocidad
        elif self.speed <= 20 and min_car_distance > 50 and (semaphore_state == 2 or semaphore_state == 1):
            # Si esta lejos del semaforo -> acelerar poco
            if(min_semaphore_distance > 700):
                self.speed = np.minimum(self.speed + 5*self.step_time, 20)
            # Si esta cerca del semaforo -> frenar mucho
            else:
                self.speed = np.maximum(self.speed - 200*self.step_time, 0)

        # Semaforo cercano y en amarillo -> acelerar
        elif min_semaphore_distance < 740 and semaphore_state == 1:
            self.speed = np.minimum(
                self.speed + 10*self.step_time, self.max_speed)

        # Semaforo lejano y en amarillo -> frenar
        elif min_semaphore_distance < 800 and semaphore_state == 1:
            self.speed = np.maximum(self.speed - 80*self.step_time, 0)

        # Semaforo en rojo y lejano -> frenar medio
        elif min_semaphore_distance < 800 and semaphore_state == 2:
            self.speed = np.maximum(self.speed - 90*self.step_time, 0)

        # Otro caso -> acelerar poco
        else:
            self.speed = np.minimum(
                self.speed + 5*self.step_time, self.max_speed)


class AvenueModel(ap.Model):
    # """ Esta clase define un modelo para una avenida de dos carriles con semaforo peatonal. """

    def setup(self):
        # """ Este metodo se utiliza para inicializar la avenida con varios autos y semaforos. """

        # Inicializa los agentes los autos y los semaforos
        self.cars = ap.AgentList(self, self.p.cars, Car)
        self.cars.step_time = self.p.step_time

        # Numero de carros por calle
        c_north = random.randint(int(self.p.cars/8), int(self.p.cars/3.5))
        c_south = random.randint(int(self.p.cars/8), int(self.p.cars/3.5))
        c_east = random.randint(int(self.p.cars/8), int(self.p.cars/3.5))
        c_west = int(self.p.cars - c_north - c_south - c_east)

        # Direcciones de carros
        for k in range(c_north):
            self.cars[k].direction = [0, 1]

        for k in range(c_south):
            self.cars[k+c_north].direction = [0, -1]

        for k in range(c_east):
            self.cars[k+c_north + c_south].direction = [1, 0]

        for k in range(c_west):
            self.cars[k + int(self.p.cars) - c_west].direction = [-1, 0]

        self.semaphores = ap.AgentList(self, 4, Semaphore)
        self.semaphores.step_time = self.p.step_time
        self.semaphores.green_duration = self.p.green
        self.semaphores.yellow_duration = self.p.yellow
        self.semaphores.red_duration = self.p.red

        # Direcciones de semaforos
        self.semaphores[0].direction = [0, 1]
        self.semaphores[1].direction = [0, -1]
        self.semaphores[2].direction = [1, 0]
        self.semaphores[3].direction = [-1, 0]

        # Estados de semaforos
        self.semaphores[0].state = 0
        self.semaphores[1].state = 2
        self.semaphores[2].state = 2
        self.semaphores[3].state = 2

        # Flag de semaforo
        self.semaphores[0].flag_last = True

        # Inicializa el entorno
        self.avenue = ap.Space(
            self, shape=[self.p.size, self.p.size], torus=True)

        # Agrega los semaforos al entorno
        self.avenue.add_agents(self.semaphores, random=True)
        self.avenue.move_to(self.semaphores[0], [
                            self.p.size*0.5 + 85, self.p.size*0.5 - 300])
        self.avenue.move_to(self.semaphores[1], [
                            self.p.size*0.5 - 85, self.p.size*0.5 + 300])
        self.avenue.move_to(self.semaphores[2], [
                            self.p.size*0.5 - 300, self.p.size*0.5 - 85])  # Derecho
        self.avenue.move_to(self.semaphores[3], [
                            self.p.size*0.5 + 300, self.p.size*0.5 + 85])

        # Agrega los autos al entorno
        self.avenue.add_agents(self.cars, random=True)

        # Acomodar carros en carriles

        # Carril horizontal derecho
        c_north1 = random.randint(int(c_north/5), int(c_north/2))
        c_north2 = random.randint(int(c_north/4), int(c_north/2.5))

        for k in range(c_north1):
            self.avenue.move_to(
                self.cars[k], [self.p.size*0.5 - 50, 75*(k+1)])
        for k in range(c_north1, c_north1 + c_north2, 1):
            self.avenue.move_to(
                self.cars[k], [self.p.size*0.5 - 120, 75*(k+1)])
        for k in range(c_north1 + c_north2, c_north, 1):
            self.avenue.move_to(
                self.cars[k], [self.p.size*0.5 - 190, 75*(k+1)])

        # Carril horizontal izquierdo
        c_south1 = random.randint(int(c_south/5), int(c_south/2))
        c_south2 = random.randint(int(c_south/4), int(c_south/2.5))

        for k in range(int(c_south1)):
            self.avenue.move_to(
                self.cars[k+c_north], [self.p.size*0.5 + 50, self.p.size - (k+1)*75])
        for k in range(c_south1, c_south1 + c_south2, 1):
            self.avenue.move_to(
                self.cars[k+c_north], [self.p.size*0.5 + 120, self.p.size - (k+2)*80])
        for k in range(c_south1 + c_south2, c_south, 1):
            self.avenue.move_to(
                self.cars[k+c_north], [self.p.size*0.5 + 190, self.p.size - (k+2)*80])

        # Carril vertical derecho
        c_east1 = random.randint(int(c_east/5), int(c_east/2))
        c_east2 = random.randint(int(c_east/4), int(c_east/2.5))

        for k in range(c_east1):
            self.avenue.move_to(
                self.cars[k+c_north+c_south], [75*(k+1), self.p.size*0.5 + 50])
        for k in range(c_east1, c_east1 + c_east2, 1):
            self.avenue.move_to(
                self.cars[k+c_north+c_south], [75*(k+1), self.p.size*0.5 + 120])
        for k in range(c_east1 + c_east2, c_east, 1):
            self.avenue.move_to(
                self.cars[k+c_north+c_south], [75*(k+1), self.p.size*0.5 + 190])

        # Carril vertical izquierdo
        c_west1 = random.randint(int(c_west/5), int(c_west/2))
        c_west2 = random.randint(int(c_west/4), int(c_west/2.5))

        for k in range(c_west1):
            self.avenue.move_to(
                self.cars[k + int(self.p.cars) - c_west], [self.p.size - 85*(k+1), self.p.size*0.5 - 50])
        for k in range(c_west1, c_west1 + c_west2, 1):
            self.avenue.move_to(
                self.cars[k + int(self.p.cars) - c_west], [self.p.size - 85*(k-c_west1+1), self.p.size*0.5 - 120])
        for k in range(c_west1 + c_west2, c_west, 1):
            self.avenue.move_to(
                self.cars[k + int(self.p.cars) - c_west], [self.p.size - 85*(k - c_west1 - c_west2 + 1), self.p.size*0.5 - 190])

        # Frame counter
        self.frames = 0

        # Archivo json
        self.data = {}
        self.data['size'] = []
        self.data['size'].append({'size': self.p.size})
        self.data['cars'] = []
        self.data['semaphores'] = []
        self.data['frames'] = []

        # Carga de carros
        for k in range(self.p.cars):
            self.data['cars'].append({
                'id': k,
                'x': self.model.avenue.positions[self.cars[k]][0],
                'z': self.model.avenue.positions[self.cars[k]][1],
                'dir': math.atan2(self.cars[k].direction[0], self.cars[k].direction[1]) * 180 / math.pi,
                'type': random.randint(0, 6)
            })

        # Carga de semaforos
        for k in range(len(self.semaphores)):
            self.data['semaphores'].append({
                'id': k + model.p.cars,
                'x': self.model.avenue.positions[self.semaphores[k]][0],
                'z': self.model.avenue.positions[self.semaphores[k]][1],
                'dir': math.atan2(self.semaphores[k].direction[0], self.semaphores[k].direction[1]) * 180 / math.pi,
                'state': self.semaphores[k].state
            })

    def step(self):
        # """ Este metodo se invoca para actualizar el estado de la avenida. """
        self.semaphores.update()
        self.cars.update_position()
        self.cars.update_speed()

        for semaphore in self.semaphores:
            if(semaphore.flag):
                print("entra 1")
                semaphore.flag = False
                if (semaphore.flag_last):
                    print("entra 2")

                    semaphore.flag_last = False
                    self.semaphores.count_wait_time()
                    counter = 0
                    id_semaphore = 0
                    id_front_semaphore = 0

                    for k in range(len(self.semaphores)):
                        if (self.semaphores[k].total_wait_time > counter):
                            id_semaphore = k
                            counter = self.semaphores[k].total_wait_time

                    for k in range(len(self.semaphores)):
                        if (self.semaphores[id_semaphore].direction[0] == 0 and self.semaphores[k].direction[0] == 0 and id_semaphore != k):
                            id_front_semaphore = k
                        elif(self.semaphores[id_semaphore].direction[1] == 0 and self.semaphores[k].direction[1] == 0 and id_semaphore != k):
                            id_front_semaphore = k

                    self.semaphores[id_semaphore].state = 0
                    self.semaphores[id_semaphore].state_time = 0
                    self.semaphores[id_semaphore].green_duration = self.p.green
                    self.semaphores[id_semaphore].red_duration = (
                        self.p.green/2) + (self.p.yellow/2)
                    self.semaphores[id_front_semaphore].state = 2
                    self.semaphores[id_front_semaphore].state_time = 0
                    self.semaphores[id_front_semaphore].green_duration = self.p.green
                    self.semaphores[id_front_semaphore].red_duration = (
                        self.p.green/2) + (self.p.yellow/2) - (self.p.step_time)
                    self.semaphores[id_front_semaphore].flag_last = True

                    for k in range(len(self.semaphores)):
                        if (k != id_semaphore and k != id_front_semaphore):
                            self.semaphores[k].state = 2
                            self.semaphores[k].state_time = 0
                            self.semaphores[k].red_duration = self.p.steps / \
                                self.p.step_time

        car_list = []
        for k in range(self.p.cars):
            car_list.append({
                'id': k,
                'x': self.model.avenue.positions[self.cars[k]][0],
                'z': self.model.avenue.positions[self.cars[k]][1],
                'dir': math.atan2(self.cars[k].direction[0], self.cars[k].direction[1]) * 180 / math.pi
            })
        sempahore_list = []
        for k in range(len(self.semaphores)):
            sempahore_list.append({
                'id': k + model.p.cars,
                'state': self.semaphores[k].state
            })

        self.data['frames'].append({
            'frame': self.frames,
            'cars': car_list,
            'semaphores': sempahore_list
        })

        self.frames += 1

    def end(self):
        # Calcular cantidad total de choques
        choques = 0
        for car in model.cars:
            if car.state == 0:
                choques += 1
        self.report('Autos chocados', choques)

        # Escribir datos recopilados en archivo JSON
        json_file = json.dumps(self.data)
        with open('simul_data.json', 'w') as outfile:
            outfile.write(json_file)


# 1 segundo = 4 steps
parameters = {
    'step_time': 0.1,    # Tiempo de step
    'size': 10000,        # Tamano en metros de la avenida
    'green': 30,          # Duracion de la luz verde
    'yellow': 4,         # Duracion de la luz amarilla
    'red': 34,           # Duracion de la luz roja
    'cars': 120,          # Numero de autos en la simulacion
    'steps': 2500,       # Numero de pasos de la simulacion
}

model = AvenueModel(parameters)
results = model.run()
print(results.reporters)
