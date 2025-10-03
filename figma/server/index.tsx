import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Initialize sample data in KV store
async function initializeSampleData() {
  try {
    // Check if data already exists
    const existingRooms = await kv.get('habitaciones');
    if (!existingRooms) {
      // Initialize sample rooms
      const sampleRooms = [
        {
          id_habitacion: 1,
          numero_habitacion: '101',
          tipo: 'Single',
          capacidad: 1,
          precio_noche: 45000,
          estado: 'DISPONIBLE'
        },
        {
          id_habitacion: 2,
          numero_habitacion: '202',
          tipo: 'Doble',
          capacidad: 2,
          precio_noche: 65000,
          estado: 'DISPONIBLE'
        },
        {
          id_habitacion: 3,
          numero_habitacion: '303',
          tipo: 'Suite',
          capacidad: 4,
          precio_noche: 120000,
          estado: 'DISPONIBLE'
        },
        {
          id_habitacion: 4,
          numero_habitacion: '404',
          tipo: 'Familiar',
          capacidad: 6,
          precio_noche: 95000,
          estado: 'DISPONIBLE'
        }
      ];
      
      await kv.set('habitaciones', sampleRooms);
      await kv.set('reservas', []);
      await kv.set('clientes', []);
      
      console.log('Sample data initialized in KV store');
    }
  } catch (error) {
    console.log('Error initializing sample data:', error);
  }
}

// Check if PostgreSQL tables exist, fallback to KV store
async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('habitacion')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('PostgreSQL tables not found, using KV store fallback');
      return false;
    }
    
    console.log('PostgreSQL tables available');
    return true;
  } catch (error) {
    console.log('Database connection check failed, using KV store');
    return false;
  }
}

// Initialize on startup
let useDatabase = false;
checkDatabaseConnection().then(result => {
  useDatabase = result;
  if (!useDatabase) {
    initializeSampleData();
  }
});

// Health check endpoint
app.get("/make-server-c8bcc102/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth endpoints
app.post("/make-server-c8bcc102/auth/signup", async (c) => {
  try {
    const { email, password, firstName, lastName, phone, role, rut_pasaporte, direccion, pais } = await c.req.json();
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name: firstName, 
        last_name: lastName,
        role: role || 'cliente'
      },
      email_confirm: true // Auto-confirm since email server not configured
    });
    
    if (authError) {
      return c.json({ error: 'Error creating user: ' + authError.message }, 400);
    }
    
    // Insert cliente data if role is cliente
    if (role === 'cliente' || !role) {
      const { error: clienteError } = await supabase
        .from('cliente')
        .insert({
          nombre: firstName,
          apellido: lastName,
          rut_pasaporte: rut_pasaporte || `${Date.now()}`,
          email,
          telefono: phone ? parseInt(phone) : null,
          direccion: direccion || null,
          pais: pais || null
        });
        
      if (clienteError) {
        console.log('Error inserting cliente:', clienteError);
      }
    }
    
    // Insert employee data if role is empleado
    if (role === 'empleado') {
      const { error: empleadoError } = await supabase
        .from('empleado')
        .insert({
          nombre: firstName,
          apellido: lastName,
          cargo: 'Recepcionista',
          telefono: phone || null,
          email
        });
        
      if (empleadoError) {
        console.log('Error inserting empleado:', empleadoError);
      }
    }
    
    return c.json({ 
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName,
        role: role || 'cliente'
      }
    });
    
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup: ' + error.message }, 500);
  }
});

app.post("/make-server-c8bcc102/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return c.json({ error: 'Invalid credentials: ' + error.message }, 401);
    }
    
    return c.json({ 
      message: 'Login successful',
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name || '',
        lastName: data.user.user_metadata?.last_name || '',
        role: data.user.user_metadata?.role || 'cliente'
      }
    });
    
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Internal server error during signin: ' + error.message }, 500);
  }
});

// Protected route helper
async function getUser(c: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }
  
  return { user };
}

// Habitaciones endpoints
app.get("/make-server-c8bcc102/habitaciones", async (c) => {
  try {
    if (useDatabase) {
      const { data, error } = await supabase
        .from('habitacion')
        .select('*')
        .order('numero_habitacion');
      
      if (error) {
        throw new Error('Database error: ' + error.message);
      }
      
      return c.json({ habitaciones: data });
    } else {
      // Use KV store fallback
      const habitaciones = await kv.get('habitaciones') || [];
      return c.json({ habitaciones });
    }
  } catch (error) {
    console.log('Error fetching habitaciones:', error);
    // Fallback to KV store
    try {
      const habitaciones = await kv.get('habitaciones') || [];
      return c.json({ habitaciones });
    } catch (kvError) {
      return c.json({ error: 'Error fetching habitaciones: ' + error.message }, 500);
    }
  }
});

app.get("/make-server-c8bcc102/habitaciones/disponibles", async (c) => {
  try {
    const checkIn = c.req.query('checkIn');
    const checkOut = c.req.query('checkOut');
    const guests = parseInt(c.req.query('guests') || '1');
    
    if (useDatabase) {
      let query = supabase
        .from('habitacion')
        .select('*')
        .gte('capacidad', guests);
      
      // If dates provided, filter out occupied rooms
      if (checkIn && checkOut) {
        const { data: occupiedRooms } = await supabase
          .from('reserva')
          .select('id_habitacion')
          .in('estado_reserva', ['CONFIRMADA', 'PENDIENTE'])
          .or(`fecha_checkin.lte.${checkOut},fecha_checkout.gte.${checkIn}`);
          
        const occupiedIds = occupiedRooms?.map(r => r.id_habitacion) || [];
        
        if (occupiedIds.length > 0) {
          query = query.not('id_habitacion', 'in', `(${occupiedIds.join(',')})`);
        }
      }
      
      const { data, error } = await query.order('precio_noche');
      
      if (error) {
        throw new Error('Database error: ' + error.message);
      }
      
      return c.json({ habitaciones: data });
    } else {
      // Use KV store fallback
      const habitaciones = await kv.get('habitaciones') || [];
      const reservas = await kv.get('reservas') || [];
      
      // Filter by capacity
      let availableRooms = habitaciones.filter(room => room.capacidad >= guests);
      
      // Filter by dates if provided
      if (checkIn && checkOut) {
        const occupiedRoomIds = reservas
          .filter(reserva => 
            (reserva.estado_reserva === 'CONFIRMADA' || reserva.estado_reserva === 'PENDIENTE') &&
            (reserva.fecha_checkin <= checkOut && reserva.fecha_checkout >= checkIn)
          )
          .map(reserva => reserva.id_habitacion);
        
        availableRooms = availableRooms.filter(room => 
          !occupiedRoomIds.includes(room.id_habitacion)
        );
      }
      
      // Sort by price
      availableRooms.sort((a, b) => a.precio_noche - b.precio_noche);
      
      return c.json({ habitaciones: availableRooms });
    }
  } catch (error) {
    console.log('Error fetching available rooms:', error);
    // Fallback to KV store
    try {
      const habitaciones = await kv.get('habitaciones') || [];
      const availableRooms = habitaciones.filter(room => room.capacidad >= guests);
      return c.json({ habitaciones: availableRooms });
    } catch (kvError) {
      return c.json({ error: 'Error fetching available rooms: ' + error.message }, 500);
    }
  }
});

// Reservas endpoints
app.post("/make-server-c8bcc102/reservas", async (c) => {
  try {
    const { 
      id_habitacion, 
      fecha_checkin, 
      fecha_checkout, 
      cantidad_personas,
      cliente_data 
    } = await c.req.json();
    
    if (useDatabase) {
      const userResult = await getUser(c);
      if (userResult.error) {
        return c.json({ error: userResult.error }, userResult.status);
      }
      
      // Get or create cliente
      let clienteId;
      const { data: existingCliente } = await supabase
        .from('cliente')
        .select('id_cliente')
        .eq('email', userResult.user.email)
        .single();
      
      if (existingCliente) {
        clienteId = existingCliente.id_cliente;
      } else {
        // Create new cliente
        const { data: newCliente, error: clienteError } = await supabase
          .from('cliente')
          .insert({
            nombre: cliente_data.firstName,
            apellido: cliente_data.lastName,
            rut_pasaporte: cliente_data.rut || `${Date.now()}`,
            email: userResult.user.email,
            telefono: cliente_data.phone ? parseInt(cliente_data.phone) : null,
            direccion: cliente_data.address || null,
            pais: cliente_data.country || null
          })
          .select('id_cliente')
          .single();
          
        if (clienteError) {
          return c.json({ error: 'Error creating cliente: ' + clienteError.message }, 500);
        }
        
        clienteId = newCliente.id_cliente;
      }
      
      // Create reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reserva')
        .insert({
          id_cliente: clienteId,
          id_habitacion,
          fecha_checkin,
          fecha_checkout,
          cantidad_personas,
          estado_reserva: 'CONFIRMADA'
        })
        .select('*')
        .single();
      
      if (reservaError) {
        return c.json({ error: 'Error creating reserva: ' + reservaError.message }, 500);
      }
      
      return c.json({ 
        message: 'Reserva created successfully',
        reserva,
        reservationId: `RES-${reserva.id_reserva.toString().padStart(6, '0')}`
      });
    } else {
      // Use KV store fallback
      const clientes = await kv.get('clientes') || [];
      const reservas = await kv.get('reservas') || [];
      const habitaciones = await kv.get('habitaciones') || [];
      
      // Find room
      const habitacion = habitaciones.find(h => h.id_habitacion === id_habitacion);
      if (!habitacion) {
        return c.json({ error: 'Room not found' }, 404);
      }
      
      // Create or find cliente
      let cliente = clientes.find(c => c.email === cliente_data.email);
      if (!cliente) {
        cliente = {
          id_cliente: clientes.length + 1,
          nombre: cliente_data.firstName,
          apellido: cliente_data.lastName,
          rut_pasaporte: cliente_data.rut || `${Date.now()}`,
          email: cliente_data.email,
          telefono: cliente_data.phone ? parseInt(cliente_data.phone) : null,
          direccion: cliente_data.address || null,
          pais: cliente_data.country || null
        };
        clientes.push(cliente);
        await kv.set('clientes', clientes);
      }
      
      // Create reserva
      const nuevaReserva = {
        id_reserva: reservas.length + 1,
        id_cliente: cliente.id_cliente,
        id_habitacion,
        fecha_reserva: new Date().toISOString(),
        fecha_checkin,
        fecha_checkout,
        cantidad_personas,
        estado_reserva: 'CONFIRMADA',
        cliente: {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email
        },
        habitacion: {
          numero_habitacion: habitacion.numero_habitacion,
          tipo: habitacion.tipo,
          precio_noche: habitacion.precio_noche
        }
      };
      
      reservas.push(nuevaReserva);
      await kv.set('reservas', reservas);
      
      return c.json({ 
        message: 'Reserva created successfully',
        reserva: nuevaReserva,
        reservationId: `RES-${nuevaReserva.id_reserva.toString().padStart(6, '0')}`
      });
    }
    
  } catch (error) {
    console.log('Error creating reserva:', error);
    return c.json({ error: 'Internal server error: ' + error.message }, 500);
  }
});

app.get("/make-server-c8bcc102/reservas", async (c) => {
  try {
    if (useDatabase) {
      const userResult = await getUser(c);
      if (userResult.error) {
        return c.json({ error: userResult.error }, userResult.status);
      }
      
      const { data, error } = await supabase
        .from('reserva')
        .select(`
          *,
          cliente (nombre, apellido, email),
          habitacion (numero_habitacion, tipo, precio_noche)
        `)
        .order('fecha_reserva', { ascending: false });
      
      if (error) {
        return c.json({ error: 'Error fetching reservas: ' + error.message }, 500);
      }
      
      return c.json({ reservas: data });
    } else {
      // Use KV store fallback
      const reservas = await kv.get('reservas') || [];
      return c.json({ reservas: reservas.reverse() }); // Most recent first
    }
  } catch (error) {
    console.log('Error fetching reservas:', error);
    // Fallback to KV store
    try {
      const reservas = await kv.get('reservas') || [];
      return c.json({ reservas: reservas.reverse() });
    } catch (kvError) {
      return c.json({ error: 'Internal server error: ' + error.message }, 500);
    }
  }
});

// Admin endpoints
app.get("/make-server-c8bcc102/admin/stats", async (c) => {
  try {
    if (useDatabase) {
      const userResult = await getUser(c);
      if (userResult.error) {
        return c.json({ error: userResult.error }, userResult.status);
      }
      
      // Check if user is admin
      if (userResult.user.user_metadata?.role !== 'administrador') {
        return c.json({ error: 'Access denied' }, 403);
      }
      
      // Get various stats
      const [habitacionesResult, reservasResult, clientesResult] = await Promise.all([
        supabase.from('habitacion').select('*', { count: 'exact' }),
        supabase.from('reserva').select('*', { count: 'exact' }),
        supabase.from('cliente').select('*', { count: 'exact' })
      ]);
      
      const stats = {
        totalHabitaciones: habitacionesResult.count || 0,
        totalReservas: reservasResult.count || 0,
        totalClientes: clientesResult.count || 0,
        occupancyRate: 75 // Placeholder calculation
      };
      
      return c.json({ stats });
    } else {
      // Use KV store fallback
      const habitaciones = await kv.get('habitaciones') || [];
      const reservas = await kv.get('reservas') || [];
      const clientes = await kv.get('clientes') || [];
      
      const stats = {
        totalHabitaciones: habitaciones.length,
        totalReservas: reservas.length,
        totalClientes: clientes.length,
        occupancyRate: reservas.length > 0 ? Math.round((reservas.filter(r => r.estado_reserva === 'CONFIRMADA').length / habitaciones.length) * 100) : 0
      };
      
      return c.json({ stats });
    }
  } catch (error) {
    console.log('Error fetching admin stats:', error);
    // Fallback to KV store
    try {
      const habitaciones = await kv.get('habitaciones') || [];
      const reservas = await kv.get('reservas') || [];
      const clientes = await kv.get('clientes') || [];
      
      const stats = {
        totalHabitaciones: habitaciones.length,
        totalReservas: reservas.length,
        totalClientes: clientes.length,
        occupancyRate: 50
      };
      
      return c.json({ stats });
    } catch (kvError) {
      return c.json({ error: 'Internal server error: ' + error.message }, 500);
    }
  }
});

// Initialize sample data
app.post("/make-server-c8bcc102/init-data", async (c) => {
  try {
    if (useDatabase) {
      // Insert sample habitaciones
      const { error: habitacionError } = await supabase
        .from('habitacion')
        .upsert([
          {
            numero_habitacion: '101',
            tipo: 'Single',
            capacidad: 1,
            precio_noche: 45000,
            estado: 'DISPONIBLE'
          },
          {
            numero_habitacion: '202',
            tipo: 'Doble',
            capacidad: 2,
            precio_noche: 65000,
            estado: 'DISPONIBLE'
          },
          {
            numero_habitacion: '303',
            tipo: 'Suite',
            capacidad: 4,
            precio_noche: 120000,
            estado: 'DISPONIBLE'
          },
          {
            numero_habitacion: '404',
            tipo: 'Familiar',
            capacidad: 6,
            precio_noche: 95000,
            estado: 'DISPONIBLE'
          }
        ], { onConflict: 'numero_habitacion' });
      
      if (habitacionError) {
        console.log('Error inserting habitaciones:', habitacionError);
      }
      
      return c.json({ message: 'Sample data initialized in database' });
    } else {
      // Initialize in KV store (already done on startup)
      await initializeSampleData();
      return c.json({ message: 'Sample data initialized in KV store' });
    }
  } catch (error) {
    console.log('Error initializing data:', error);
    return c.json({ error: 'Error initializing data: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);