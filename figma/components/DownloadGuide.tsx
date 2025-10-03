import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, Database, FileText } from "lucide-react";

const GUIDE_CONTENT = `# 🚀 Guía Paso a Paso: Ejecutar Script SQL en Supabase

## 📋 Resumen Rápido
Vas a copiar un script SQL y ejecutarlo en el dashboard de Supabase para crear las tablas de la base de datos del hotel.

---

## ✅ PASO 1: Acceder al Dashboard

### Opción A - Acceso Directo (Recomendado)
Haz clic en este enlace:
\`\`\`
https://supabase.com/dashboard/project/rzandxnywvdounuxoctk
\`\`\`

### Opción B - Acceso Manual
1. Ve a https://supabase.com/dashboard
2. Inicia sesión con tu cuenta
3. Busca y selecciona el proyecto: \`rzandxnywvdounuxoctk\`

---

## ✅ PASO 2: Abrir el SQL Editor

Una vez en el dashboard de tu proyecto:

1. **Mira el menú lateral izquierdo**
2. **Busca la sección "SQL Editor"** (tiene un ícono de código \`</>\`)
3. **Haz clic en "SQL Editor"**

La URL debería cambiar a:
\`\`\`
https://supabase.com/dashboard/project/rzandxnywvdounuxoctk/sql
\`\`\`

---

## ✅ PASO 3: Crear una Nueva Query

En el SQL Editor:

1. **Busca el botón "+ New Query"** (esquina superior derecha)
2. **Haz clic en "+ New Query"**
3. Se abrirá un editor de texto vacío

---

## ✅ PASO 4: Copiar el Script SQL

Abre el archivo \`SETUP_DATABASE.md\` de tu proyecto y copia **TODO** el contenido que está dentro de:

\`\`\`sql
-- Create Cliente table
CREATE TABLE IF NOT EXISTS cliente (
    ...
)
\`\`\`

**HASTA**

\`\`\`sql
CREATE POLICY "Allow authenticated users" ON empleado FOR ALL USING (auth.role() = 'authenticated');
\`\`\`

### 📝 Script Completo a Copiar:

\`\`\`sql
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
\`\`\`

---

## ✅ PASO 5: Pegar el Script

1. **Haz clic dentro del editor de texto** en SQL Editor
2. **Pega el script completo** (Ctrl+V o Cmd+V)
3. **Verifica que todo el texto se haya pegado correctamente**

---

## ✅ PASO 6: Ejecutar el Script

1. **Busca el botón "Run"** en la esquina superior derecha del editor
   - También puedes usar el atajo: \`Ctrl+Enter\` (Windows/Linux) o \`Cmd+Enter\` (Mac)
2. **Haz clic en "Run"**
3. **Espera unos segundos** mientras se ejecuta

---

## ✅ PASO 7: Verificar que se Ejecutó Correctamente

### ¿Cómo saber si funcionó?

Deberías ver en la parte inferior del editor:

✅ **Resultado exitoso:**
\`\`\`
Success. No rows returned
\`\`\`
o
\`\`\`
Rows affected: X
\`\`\`

❌ **Si hay errores:**
Verás un mensaje en rojo. Los errores comunes son:
- "relation already exists" - ¡No es problema! Significa que las tablas ya existen
- Otros errores - Copia el mensaje y avísame

---

## ✅ PASO 8: Ver las Tablas Creadas

1. **Ve al menú lateral izquierdo**
2. **Busca "Table Editor"** (ícono de tabla)
3. **Haz clic en "Table Editor"**

Deberías ver **7 tablas**:
- ✅ \`cliente\`
- ✅ \`habitacion\` (con 4 habitaciones de ejemplo)
- ✅ \`reserva\`
- ✅ \`pago\`
- ✅ \`servicio\` (con 3 servicios de ejemplo)
- ✅ \`reserva_servicio\`
- ✅ \`empleado\`

---

## ✅ PASO 9: Verificar los Datos de Ejemplo

### Ver las habitaciones:
1. En el Table Editor, haz clic en la tabla \`habitacion\`
2. Deberías ver 4 habitaciones:
   - 101 - Single - $45,000/noche
   - 202 - Doble - $65,000/noche
   - 303 - Suite - $120,000/noche
   - 404 - Familiar - $95,000/noche

### Ver los servicios:
1. En el Table Editor, haz clic en la tabla \`servicio\`
2. Deberías ver 3 servicios:
   - Desayuno Buffet - $8,000
   - Spa - $30,000
   - Tour - $20,000

---

## 🎉 PASO 10: ¡Listo! Probar la Aplicación

### Tu aplicación ahora usa PostgreSQL

1. **Vuelve a tu aplicación web**
2. **Inicia sesión** con cualquiera de estos usuarios:
   - Admin: \`admin@hotel.com\` / \`admin123\`
   - Empleado: \`empleado@hotel.com\` / \`empleado123\`
   - Cliente: \`cliente@hotel.com\` / \`cliente123\`

3. **Busca habitaciones disponibles**
4. **¡Haz una reserva de prueba!**

### ¿Cómo verificar que funciona?

Después de hacer una reserva:
1. Ve al Table Editor en Supabase
2. Abre la tabla \`reserva\`
3. ¡Deberías ver tu reserva allí!

---

## 🔍 Verificación Adicional

### En la Consola del Navegador (F12):

Abre las DevTools de tu navegador y busca en la consola:

✅ Mensajes que indican éxito:
\`\`\`
Connected to Supabase
PostgreSQL tables detected
\`\`\`

---

## ❓ Solución de Problemas

### Problema 1: No veo el botón "Run"
**Solución:** Asegúrate de estar en el SQL Editor y no en otra sección.

### Problema 2: Error "permission denied"
**Solución:** 
1. Ve a Settings → Database
2. Verifica que estás usando el proyecto correcto
3. Intenta ejecutar el script por secciones

### Problema 3: Las tablas no aparecen en Table Editor
**Solución:**
1. Refresca la página del dashboard (F5)
2. Verifica que el script se ejecutó sin errores
3. Intenta ejecutar solo la primera parte:
\`\`\`sql
CREATE TABLE IF NOT EXISTS habitacion (
    id_habitacion SERIAL PRIMARY KEY,
    numero_habitacion VARCHAR(10) UNIQUE NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    capacidad INTEGER CHECK (capacidad > 0),
    precio_noche DECIMAL(10,2) CHECK (precio_noche >= 0),
    estado VARCHAR(20) DEFAULT 'DISPONIBLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Problema 4: La aplicación sigue usando KV storage
**Solución:**
1. Verifica que las tablas existen en Supabase
2. Cierra y vuelve a abrir la aplicación
3. Limpia el caché del navegador (Ctrl+Shift+Del)
4. Revisa la consola del navegador para mensajes de error

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema:
1. Copia el mensaje de error completo
2. Toma una captura de pantalla del SQL Editor
3. Avísame y te ayudaré a resolverlo

---

## 🎯 Resumen de URLs Importantes

| Acción | URL |
|--------|-----|
| Dashboard Principal | https://supabase.com/dashboard/project/rzandxnywvdounuxoctk |
| SQL Editor | https://supabase.com/dashboard/project/rzandxnywvdounuxoctk/sql |
| Table Editor | https://supabase.com/dashboard/project/rzandxnywvdounuxoctk/editor |
| Authentication | https://supabase.com/dashboard/project/rzandxnywvdounuxoctk/auth/users |

---

## ✨ ¡Eso es todo!

Una vez completados estos pasos, tu sistema de reservas hoteleras estará funcionando con una base de datos PostgreSQL real en Supabase. 🎉`;

export function DownloadGuide() {
  const handleDownloadGuide = () => {
    const blob = new Blob([GUIDE_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GUIA_EJECUTAR_SQL.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySQL = () => {
    const sqlScript = `-- Create Cliente table
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
CREATE POLICY "Allow authenticated users" ON empleado FOR ALL USING (auth.role() = 'authenticated');`;

    navigator.clipboard.writeText(sqlScript);
    alert('¡Script SQL copiado al portapapeles! Ahora puedes pegarlo en Supabase SQL Editor.');
  };

  const handleOpenSupabase = () => {
    window.open('https://supabase.com/dashboard/project/rzandxnywvdounuxoctk/sql', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Configuración de Base de Datos</h2>
        <p className="text-muted-foreground">
          Descarga la guía completa o copia el script SQL directamente
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Guía Completa
            </CardTitle>
            <CardDescription>
              Descarga la guía paso a paso con instrucciones detalladas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadGuide} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Descargar Guía (MD)
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Script SQL
            </CardTitle>
            <CardDescription>
              Copia el script SQL listo para ejecutar en Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCopySQL} className="w-full" variant="secondary" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Copiar Script SQL
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>¿Listo para configurar?</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Abre el SQL Editor de Supabase y pega el script
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleOpenSupabase} 
            variant="secondary" 
            size="lg"
            className="w-full"
          >
            Abrir Supabase SQL Editor
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pasos Rápidos:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium">Copia el Script SQL</h4>
              <p className="text-muted-foreground">Haz clic en "Copiar Script SQL" arriba</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium">Abre Supabase SQL Editor</h4>
              <p className="text-muted-foreground">Haz clic en "Abrir Supabase SQL Editor"</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium">Pega y Ejecuta</h4>
              <p className="text-muted-foreground">Pega el script en el editor y haz clic en "Run"</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-medium">¡Listo!</h4>
              <p className="text-muted-foreground">Tu aplicación ahora usa PostgreSQL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Usuarios de Prueba</h3>
        <div className="grid gap-2 text-sm">
          <div><strong>Admin:</strong> admin@hotel.com / admin123</div>
          <div><strong>Empleado:</strong> empleado@hotel.com / empleado123</div>
          <div><strong>Cliente:</strong> cliente@hotel.com / cliente123</div>
        </div>
      </div>
    </div>
  );
}