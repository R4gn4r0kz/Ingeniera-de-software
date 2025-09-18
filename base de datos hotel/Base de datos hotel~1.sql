--ciente
INSERT INTO Cliente (nombre, apellido, rut_pasaporte, email, telefono, direccion, pais)
VALUES ('Juan', 'Pérez', '12345678-9', 'juan.perez@gmail.com', 987654321, 'Av. Siempre Viva 123', 'Chile');

INSERT INTO Cliente (nombre, apellido, rut_pasaporte, email, telefono, direccion, pais)
VALUES ('María', 'López', '87654321-0', 'maria.lopez@hotmail.com', 912345678, 'Calle Los Olivos 456', 'Argentina');

INSERT INTO Cliente (nombre, apellido, rut_pasaporte, email, telefono, direccion, pais)
VALUES ('Carlos', 'Ramírez', '11223344-5', 'carlos.ramirez@outlook.com', 998877665, 'Calle Luna 789', 'Perú');

--usuario
INSERT INTO Usuario (username, password, rol)
VALUES ('admin1', 'Admin2025!', 'ADMIN');

INSERT INTO Usuario (username, password, rol)
VALUES ('recep1', 'Recep2025!', 'RECEPCIONISTA');

INSERT INTO Usuario (username, password, rol)
VALUES ('gerente1', 'Gerente2025!', 'GERENTE');

--habitacion
INSERT INTO Habitacion (numero_habitacion, tipo, capacidad, precio_noche, estado)
VALUES ('101', 'Single', 1, 45000, 'DISPONIBLE');

INSERT INTO Habitacion (numero_habitacion, tipo, capacidad, precio_noche, estado)
VALUES ('202', 'Doble', 2, 65000, 'DISPONIBLE');

INSERT INTO Habitacion (numero_habitacion, tipo, capacidad, precio_noche, estado)
VALUES ('303', 'Suite', 4, 120000, 'OCUPADA');

--reserva
INSERT INTO Reserva (id_cliente, id_habitacion, fecha_checkin, fecha_checkout, cantidad_personas, estado_reserva)
VALUES (1, 2, TO_DATE('2025-09-20','YYYY-MM-DD'), TO_DATE('2025-09-25','YYYY-MM-DD'), 2, 'CONFIRMADA');

INSERT INTO Reserva (id_cliente, id_habitacion, fecha_checkin, fecha_checkout, cantidad_personas, estado_reserva)
VALUES (2, 1, TO_DATE('2025-10-01','YYYY-MM-DD'), TO_DATE('2025-10-05','YYYY-MM-DD'), 1, 'PENDIENTE');

--pago
INSERT INTO Pago (id_reserva, monto_total, metodo_pago, estado_pago)
VALUES (1, 325000, 'Tarjeta', 'PAGADO');

INSERT INTO Pago (id_reserva, monto_total, metodo_pago, estado_pago)
VALUES (2, 180000, 'Transferencia', 'PENDIENTE');

--servicio
INSERT INTO Servicio (nombre, descripcion, precio)
VALUES ('Desayuno Buffet', 'Acceso al buffet del hotel', 8000);

INSERT INTO Servicio (nombre, descripcion, precio)
VALUES ('Spa', 'Acceso al spa con sauna y masajes', 30000);

INSERT INTO Servicio (nombre, descripcion, precio)
VALUES ('Tour', 'Excursión guiada por la ciudad', 20000);

--reserva de servicio
INSERT INTO Reserva_Servicio (id_reserva, id_servicio, cantidad)
VALUES (1, 1, 2); -- 2 desayunos buffet en la reserva 1

INSERT INTO Reserva_Servicio (id_reserva, id_servicio, cantidad)
VALUES (1, 2, 1); -- 1 spa en la reserva 1

--empleado
INSERT INTO Empleado (nombre, apellido, cargo, telefono, email)
VALUES ('Diego', 'González', 'Recepcionista', '999888777', 'diego.gonzalez@pacificreef.com');

INSERT INTO Empleado (nombre, apellido, cargo, telefono, email)
VALUES ('Antonia', 'Zúñiga', 'Administradora', '987654321', 'antonia.zuniga@pacificreef.com');

INSERT INTO Empleado (nombre, apellido, cargo, telefono, email)
VALUES ('Juan', 'Gajardo', 'Gerente', '912345678', 'juan.gajardo@pacificreef.com');

COMMIT;
