-- Create database functions for table creation

-- Function to create cliente table
CREATE OR REPLACE FUNCTION create_cliente_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS cliente (
        id_cliente SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        rut_pasaporte VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefono BIGINT,
        direccion VARCHAR(100),
        pais VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create usuario table
CREATE OR REPLACE FUNCTION create_usuario_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        rol VARCHAR(30) CHECK (rol IN ('ADMIN', 'RECEPCIONISTA', 'GERENTE')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create habitacion table
CREATE OR REPLACE FUNCTION create_habitacion_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS habitacion (
        id_habitacion SERIAL PRIMARY KEY,
        numero_habitacion VARCHAR(10) UNIQUE NOT NULL,
        tipo VARCHAR(30) NOT NULL,
        capacidad INTEGER CHECK (capacidad > 0),
        precio_noche DECIMAL(10,2) CHECK (precio_noche >= 0),
        estado VARCHAR(20) DEFAULT 'DISPONIBLE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create reserva table
CREATE OR REPLACE FUNCTION create_reserva_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS reserva (
        id_reserva SERIAL PRIMARY KEY,
        id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
        id_habitacion INTEGER NOT NULL REFERENCES habitacion(id_habitacion),
        fecha_reserva TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_checkin DATE NOT NULL,
        fecha_checkout DATE NOT NULL,
        estado_reserva VARCHAR(20) DEFAULT 'PENDIENTE',
        cantidad_personas INTEGER CHECK (cantidad_personas > 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create pago table
CREATE OR REPLACE FUNCTION create_pago_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS pago (
        id_pago SERIAL PRIMARY KEY,
        id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva),
        monto_total DECIMAL(10,2) CHECK (monto_total >= 0),
        metodo_pago VARCHAR(30) NOT NULL,
        fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        estado_pago VARCHAR(20) DEFAULT 'PENDIENTE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create servicio table
CREATE OR REPLACE FUNCTION create_servicio_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS servicio (
        id_servicio SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(200),
        precio DECIMAL(10,2) CHECK (precio >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create reserva_servicio table
CREATE OR REPLACE FUNCTION create_reserva_servicio_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS reserva_servicio (
        id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva),
        id_servicio INTEGER NOT NULL REFERENCES servicio(id_servicio),
        cantidad INTEGER DEFAULT 1 CHECK (cantidad > 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (id_reserva, id_servicio)
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create empleado table
CREATE OR REPLACE FUNCTION create_empleado_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS empleado (
        id_empleado SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        cargo VARCHAR(50) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;