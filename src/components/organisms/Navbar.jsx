function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container">

        <a className="navbar-brand text-white" href="/">
          Sonido Vivo
        </a>

        <div className="navbar-nav">

          <a className="nav-link text-white" href="/">
            Inicio
          </a>

          <a className="nav-link text-white" href="/catalogo">
            Catálogo
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;