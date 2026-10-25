import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Boton from '../components/atoms/Boton';

function Nosotros() {
  const navigate = useNavigate();

  return (
    <PlantillaPublica>
      <section className="contenedor-principal text-start">
        <header className="mb-4">
          <h2 className="titulo-seccion">Sobre Sonido Vivo</h2>
          <p className="subtitulo-catalogo text-start">
            Una tienda de instrumentos hecha por músicos, para músicos y aficionados al sonido.
          </p>
        </header>

        <div className="row g-4 mb-4">
          <article className="col-12 col-md-4">
            <div className="card card-body h-100">
              <h3 className="h5">Quiénes somos</h3>
              <p className="mb-0">
                Somos una tienda de Viña del Mar dedicada a la venta de instrumentos musicales,
                equipos de sonido y accesorios, con atención presencial y venta en línea.
              </p>
            </div>
          </article>

          <article className="col-12 col-md-4">
            <div className="card card-body h-100">
              <h3 className="h5">Nuestra misión</h3>
              <p className="mb-0">
                Acercar la música a todas las personas, con instrumentos de calidad a precios
                accesibles y asesoría adaptada a cada músico, desde quien empieza hasta el profesional.
              </p>
            </div>
          </article>

          <article className="col-12 col-md-4">
            <div className="card card-body h-100">
              <h3 className="h5">Qué ofrecemos</h3>
              <ul className="mb-0">
                <li>Guitarras, bajos, teclados y baterías</li>
                <li>Amplificadores, pedales y equipos de estudio</li>
                <li>Accesorios y repuestos</li>
                <li>Despacho a todo Chile y retiro en tienda</li>
              </ul>
            </div>
          </article>
        </div>

        <section className="card card-body mb-4">
          <h3 className="h5">Dónde estamos</h3>
          <address className="mb-2">
            Av. Libertad 450, Viña del Mar, Región de Valparaíso
          </address>
          <p className="mb-0">Lunes a viernes de 10:00 a 19:00 · Sábado de 10:00 a 14:00</p>
        </section>

        <Boton texto="Ver nuestro catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} />
      </section>
    </PlantillaPublica>
  );
}

export default Nosotros;