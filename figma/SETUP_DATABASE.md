# Configuración de Base de Datos PostgreSQL en Supabase

## Estado Actual
El sistema funciona actualmente con almacenamiento KV como respaldo automático. Para usar la base de datos PostgreSQL completa, sigue estos pasos:

## Pasos para crear las tablas en Supabase:

### 1. Accede a tu Dashboard de Supabase
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto

### 2. Ve al Editor SQL
- En el menú lateral, selecciona "SQL Editor"
- Haz clic en "New Query"

### 3. Ejecuta el siguiente script SQL:

```sql
-- Create Cliente table
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

-- Create Habitacion table
CREATE TABLE IF NOT EXISTS habitacion (
    id_habitacion SERIAL PRIMARY KEY,
    numero_habitacion VARCHAR(10) UNIQUE NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    capacidad INTEGER CHECK (capacidad > 0),
    precio_noche DECIMAL(10,2) CHECK (precio_noche >= 0),
    estado VARCHAR(20) DEFAULT 'DISPONIBLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reserva table
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

-- Create Pago table
CREATE TABLE IF NOT EXISTS pago (
    id_pago SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva),
    monto_total DECIMAL(10,2) CHECK (monto_total >= 0),
    metodo_pago VARCHAR(30) NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado_pago VARCHAR(20) DEFAULT 'PENDIENTE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Servicio table
CREATE TABLE IF NOT EXISTS servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) CHECK (precio >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reserva_Servicio table
CREATE TABLE IF NOT EXISTS reserva_servicio (
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva),
    id_servicio INTEGER NOT NULL REFERENCES servicio(id_servicio),
    cantidad INTEGER DEFAULT 1 CHECK (cantidad > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id_reserva, id_servicio)
);

-- Create Empleado table
CREATE TABLE IF NOT EXISTS empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO habitacion (numero_habitacion, tipo, capacidad, precio_noche, estado) 
VALUES 
    ('101', 'Single', 1, 45000, 'DISPONIBLE'),
    ('202', 'Doble', 2, 65000, 'DISPONIBLE'),
    ('303', 'Suite', 4, 120000, 'DISPONIBLE'),
    ('404', 'Familiar', 6, 95000, 'DISPONIBLE')
ON CONFLICT (numero_habitacion) DO NOTHING;

INSERT INTO servicio (nombre, descripcion, precio)
VALUES 
    ('Desayuno Buffet', 'Acceso al buffet del hotel', 8000),
    ('Spa', 'Acceso al spa con sauna y masajes', 30000),
    ('Tour', 'Excursion guiada por la ciudad', 20000)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva ENABLE ROW LEVEL SECURITY;
ALTER TABLE pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE empleado ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing authenticated users to access all data)
CREATE POLICY "Allow authenticated users" ON cliente FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON habitacion FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON reserva FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON pago FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON servicio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON reserva_servicio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON empleado FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Ejecuta el script
- Haz clic en "Run" para ejecutar el script
- Verifica que no haya errores

### 5. Verifica las tablas
- Ve a "Table Editor" en el menú lateral
- Deberías ver todas las tablas creadas con datos de ejemplo

## ¡Importante!
Una vez que ejecutes este script SQL, la aplicación automáticamente detectará las tablas y comenzará a usar PostgreSQL en lugar del almacenamiento KV de respaldo.

## Verificación
La aplicación debería funcionar normalmente y mostrar las habitaciones disponibles desde la base de datos PostgreSQL.