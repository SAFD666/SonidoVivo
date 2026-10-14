export const pedidosIniciales = [
  {
    id: "PED-1001",
    fecha: "2026-10-10",
    clienteCorreo: "cliente@correo.cl",
    clienteNombre: "Cliente Prueba",
    direccion: "Av. Libertad 450, Viña del Mar",
    telefono: "+56912345678",
    tipoEntrega: "Retiro en Tienda (Viña del Mar)",
    estado: "Entregado",
    total: 129990,
    items: [
      {
        codigo: "GA001",
        nombre: "Guitarra Acústica Folk",
        precio: 129990,
        cantidad: 1
      }
    ]
  },
  {
    id: "PED-1002",
    fecha: "2026-10-13",
    clienteCorreo: "cliente@correo.cl",
    clienteNombre: "Cliente Prueba",
    direccion: "O'Higgins 820, Concepción",
    telefono: "+56987654321",
    tipoEntrega: "Despacho Starken",
    estado: "En preparación",
    total: 309980,
    items: [
      {
        codigo: "GE001",
        nombre: "Guitarra Eléctrica Stratocaster",
        precio: 249990,
        cantidad: 1
      },
      {
        codigo: "EF001",
        nombre: "Pedal Distorsión Clásico",
        precio: 59990,
        cantidad: 1
      }
    ]
  }
];