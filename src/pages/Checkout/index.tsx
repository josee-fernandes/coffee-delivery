import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPinLine,
  Money,
} from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Container } from '../../styles/Container'
import {
  AddressContainer,
  AddressInputsContainer,
  CheckoutContainer,
  FinishOrderButton,
  FormInputFieldsContainer,
  FormWrapper,
  PaymentContainer,
  PaymentMethodButton,
  PaymentMethodsContainer,
  PricingInfoTableContainer,
  SelectedCoffeesContainer,
  SelectedCoffeesList,
} from './styles'
import { SelectedCoffeeItem } from './components/SelectedCoffeeItem'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext, coffees } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/currency'

export const paymentMethods = {
  creditCard: 'Cartão de crédito',
  debitCard: 'Cartão de débito',
  money: 'Dinheiro',
} as const

const keys = Object.keys(paymentMethods) as [keyof typeof paymentMethods]

const paymentMethodEnum = z.enum(keys)

const finishOrderSchema = z.object({
  cep: z
    .string()
    .length(8, { message: 'O CEP é obrigatório (8 caracteres)' })
    .regex(/^\d{5}(-\d{3})?$/, { message: 'CEP inválido' }),
  street: z.string().min(1, { message: 'A rua é obrigatória' }),
  number: z.number().min(1, { message: 'O número é obrigatório' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, { message: 'O bairro é obrigatório' }),
  city: z.string().min(1, { message: 'A cidade é obrigatória' }),
  state: z
    .string()
    .length(2, { message: 'A sigla do estado é obrigatória (2 caracteres)' }),
  paymentMethod: paymentMethodEnum,
})

export type FinishOrderSchemaType = z.infer<typeof finishOrderSchema>

export function Checkout() {
  const { cart, wipeCart } = useContext(CartContext)

  const navigate = useNavigate()

  const checkoutForm = useForm<FinishOrderSchemaType>({
    defaultValues: {
      cep: '',
      street: '',
      number: 0,
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      paymentMethod: 'creditCard',
    },
  })

  const { register, handleSubmit, watch, setValue, reset } = checkoutForm

  function finishOrder(data: FinishOrderSchemaType) {
    navigate('/success', { state: data, replace: true })
    reset()
    wipeCart()
  }

  function checkPaymentOption(event: React.MouseEvent<HTMLButtonElement>) {
    const target = event.target as HTMLButtonElement

    setValue(
      'paymentMethod',
      target.value as keyof typeof paymentMethodEnum.enum,
    )
  }

  const complement = watch('complement')
  const isComplementTyped =
    typeof complement === 'string' && complement.length > 0

  const coffeeTotal = cart.reduce((previous, obj) => {
    return previous + obj.price
  }, 0)
  const deliveryValue = 3.5
  const total = coffeeTotal + deliveryValue

  const coffeeTotalFormatted = formatCurrency(coffeeTotal)
  const deliveryValueFormatted = formatCurrency(deliveryValue)
  const totalFormatted = formatCurrency(total)

  const disableInputs = cart.length === 0

  return (
    <CheckoutContainer>
      <Container>
        <FormProvider {...checkoutForm}>
          <FormWrapper onSubmit={handleSubmit(finishOrder)}>
            <main>
              <h2>Complete seu pedido</h2>
              <FormInputFieldsContainer>
                <AddressContainer>
                  <header>
                    <MapPinLine size={22} />
                    <div>
                      <strong>Endereço de entrega</strong>
                      <p>Informe o endereço onde deseja receber seu pedido</p>
                    </div>
                  </header>

                  <AddressInputsContainer>
                    <input
                      type="text"
                      placeholder="CEP"
                      minLength={1}
                      maxLength={9}
                      required
                      disabled={disableInputs}
                      {...register('cep')}
                    />
                    <input
                      type="text"
                      placeholder="Rua"
                      minLength={1}
                      required
                      disabled={disableInputs}
                      {...register('street')}
                    />
                    <div>
                      <input
                        type="text"
                        placeholder="Número"
                        minLength={1}
                        required
                        disabled={disableInputs}
                        {...register('number')}
                      />
                      <span>
                        <input
                          type="text"
                          placeholder="Complemento"
                          minLength={1}
                          disabled={disableInputs}
                          {...register('complement')}
                        />
                        {!isComplementTyped && <p>Opcional</p>}
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Bairro"
                        minLength={1}
                        required
                        disabled={disableInputs}
                        {...register('neighborhood')}
                      />
                      <input
                        type="text"
                        placeholder="Cidade"
                        minLength={1}
                        required
                        disabled={disableInputs}
                        {...register('city')}
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        minLength={1}
                        required
                        disabled={disableInputs}
                        {...register('state')}
                      />
                    </div>
                  </AddressInputsContainer>
                </AddressContainer>
                <PaymentContainer>
                  <header>
                    <CurrencyDollar size={22} />
                    <div>
                      <strong>Pagamento</strong>
                      <p>
                        O pagamento é feito na entrega. Escolha a forma que
                        deseja pagar
                      </p>
                    </div>
                  </header>
                  <PaymentMethodsContainer>
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value={paymentMethodEnum.Enum.creditCard}
                    />
                    <PaymentMethodButton
                      type="button"
                      onClick={checkPaymentOption}
                      value={paymentMethodEnum.Enum.creditCard}
                      disabled={disableInputs}
                    >
                      <CreditCard size={16} />
                      <p>CARTÃO DE CRÉDITO</p>
                    </PaymentMethodButton>
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value={paymentMethodEnum.Enum.debitCard}
                      disabled={disableInputs}
                    />
                    <PaymentMethodButton
                      type="button"
                      onClick={checkPaymentOption}
                      value={paymentMethodEnum.Enum.debitCard}
                      disabled={disableInputs}
                    >
                      <Bank size={16} />
                      <p>CARTÃO DE DÉBITO</p>
                    </PaymentMethodButton>
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value={paymentMethodEnum.Enum.money}
                    />
                    <PaymentMethodButton
                      type="button"
                      value={paymentMethodEnum.Enum.money}
                      onClick={checkPaymentOption}
                      disabled={disableInputs}
                    >
                      <Money size={16} />
                      <p>DINHEIRO</p>
                    </PaymentMethodButton>
                  </PaymentMethodsContainer>
                </PaymentContainer>
              </FormInputFieldsContainer>
            </main>
            {cart.length > 0 && (
              <SelectedCoffeesContainer>
                <h2>Cafés selecionados</h2>
                <div>
                  <SelectedCoffeesList>
                    {cart.map((cartCoffee) => (
                      <SelectedCoffeeItem
                        key={cartCoffee.id}
                        coffee={coffees[cartCoffee.type]}
                      />
                    ))}
                  </SelectedCoffeesList>
                  <PricingInfoTableContainer>
                    <table>
                      <tbody>
                        <tr>
                          <td>Total de itens</td>
                          <td>{coffeeTotalFormatted}</td>
                        </tr>
                        <tr>
                          <td>Entrega</td>
                          <td>{deliveryValueFormatted}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Total</strong>
                          </td>
                          <td>
                            <strong>{totalFormatted}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </PricingInfoTableContainer>

                  <FinishOrderButton type="submit">
                    CONFIRMAR PEDIDO
                  </FinishOrderButton>
                </div>
              </SelectedCoffeesContainer>
            )}
          </FormWrapper>
        </FormProvider>
      </Container>
    </CheckoutContainer>
  )
}
