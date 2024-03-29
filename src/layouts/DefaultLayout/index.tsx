import { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { MapPin, ShoppingCart } from 'phosphor-react'

import { CartContext } from '../../contexts/CartContext'
import {
  CartButton,
  LayoutContainer,
  LocationButton,
  NavActions,
  NavContainer,
} from './styles'
import { Container } from '../../styles/Container'

import logoCoffeeDelivery from '../../assets/logo-coffee-delivery.svg'

export function DefaultLayout() {
  const { cart } = useContext(CartContext)

  return (
    <LayoutContainer>
      <NavContainer>
        <Container>
          <NavLink to="/">
            <img src={logoCoffeeDelivery} alt="Logotipo do Coffee Delivery" />
          </NavLink>
          <div>
            <NavActions>
              <LocationButton>
                <MapPin size={22} weight="fill" />
                Porto Alegre, RS
              </LocationButton>
              <NavLink to="/checkout">
                <CartButton
                  title="Visualizar carrinho"
                  $cartItemsAmount={cart.length}
                >
                  <ShoppingCart size={22} weight="fill" />
                </CartButton>
              </NavLink>
            </NavActions>
          </div>
        </Container>
      </NavContainer>
      <Outlet />
    </LayoutContainer>
  )
}
