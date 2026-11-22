import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import PlantillaAdmin from './PlantillaAdmin'
import { renderConProveedores, admin, vendedor } from '../../test/renderConProveedores'

describe('PlantillaAdmin', () => {
  it('muestra el título (props.titulo) y el contenido (props.children)', async () => {
    await renderConProveedores(
      <PlantillaAdmin titulo="Gestión de productos"><p>Tabla de productos</p></PlantillaAdmin>,
      { usuario: admin }
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Gestión de productos' })).toBeInTheDocument()
    expect(screen.getByText('Tabla de productos')).toBeInTheDocument()
  })

  it('el administrador ve el enlace a Usuarios', async () => {
    await renderConProveedores(<PlantillaAdmin titulo="Inicio"><p>Panel</p></PlantillaAdmin>, { usuario: admin })
    expect(screen.getByRole('link', { name: 'Usuarios' })).toBeInTheDocument()
  })

  it('el vendedor no ve el enlace a Usuarios', async () => {
    await renderConProveedores(<PlantillaAdmin titulo="Inicio"><p>Panel</p></PlantillaAdmin>, { usuario: vendedor })
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
  })
})