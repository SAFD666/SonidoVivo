// DTO de entrada (Guía 20): convierte el formulario en el cuerpo que exige POST/PUT /api/v1/productos.
// Los inputs entregan texto; la API exige números en precio y stock.
export function crearProductoRequestDto(formulario) {
  return {
    codigo: String(formulario.codigo).trim().toUpperCase(),
    nombre: formulario.nombre.trim(),
    marca: formulario.marca.trim(),
    modelo: formulario.modelo?.trim() || null,
    categoria: formulario.categoria,
    precio: Number(formulario.precio),
    stock: Number(formulario.stock),
    imagen: formulario.imagen?.trim() || null,
    descripcion: formulario.descripcion?.trim() || null,
    esOferta: Boolean(formulario.esOferta),
  }
}