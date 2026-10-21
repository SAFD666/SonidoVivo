import PlantillaAdmin from '../components/templates/PlantillaAdmin';

function AdminProductos() {
  return (
    <PlantillaAdmin titulo="Gestión de productos">
      <section aria-label="Listado de productos">
        <p className="subtitulo-catalogo">Aquí irá el CRUD de productos </p>
      </section>
    </PlantillaAdmin>
  );
}

export default AdminProductos;