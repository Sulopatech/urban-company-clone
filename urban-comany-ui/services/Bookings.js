import { gql } from "@apollo/client";

export const SERVICE_BOOKING = gql`
mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      __typename
      ... on Order {
        id
        code
        state
        active
        lines {
          id
          productVariant {
            id
            name
            sku
            price
            priceWithTax
            product {
              id
              name
              description
              featuredAsset {
                preview
              }
            }
          }
          quantity
          linePrice
          linePriceWithTax
          discountedLinePrice
          discountedLinePriceWithTax
          taxRate
        }
        subTotal
        subTotalWithTax
        totalQuantity
        total
        totalWithTax
        discounts {
          adjustmentSource
          amount
          amountWithTax
          description
          type
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
  
`;

export const UPDATE_BOOKING = gql`
mutation SetOrderCustomFields($input: UpdateOrderInput!) {
  setOrderCustomFields(input: $input) {
    __typename
    ... on Order {
      id
      code
      state
      active
      lines {
        id
        productVariant {
          id
          name
          sku
          price
          priceWithTax
          product {
            id
            name
            description
            featuredAsset {
              preview
            }
          }
        }
        quantity
        linePrice
        linePriceWithTax
        discountedLinePrice
        discountedLinePriceWithTax
        taxRate
      }
      subTotal
      subTotalWithTax
      totalQuantity
      total
      totalWithTax
      discounts {
        adjustmentSource
        amount
        amountWithTax
        description
        type
      }
      customFields{
        date
        time
      }
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
`

export const REMOVE_BOOKING = gql`
mutation removeOrderLine($orderLineId: ID!) {
  removeOrderLine(orderLineId: $orderLineId) {
      __typename
      ... on Order {
        id
        code
        state
        active
        lines {
          id
          productVariant {
            id
            name
            sku
            price
            priceWithTax
            product {
              id
              name
              description
              featuredAsset {
                preview
              }
            }
          }
          quantity
          linePrice
          linePriceWithTax
          discountedLinePrice
          discountedLinePriceWithTax
          taxRate
        }
        subTotal
        subTotalWithTax
        totalQuantity
        total
        totalWithTax
        discounts {
          adjustmentSource
          amount
          amountWithTax
          description
          type
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// export const COUNTRIES = gql`
// query countries{
//   availableCountries {
//     code
//     name
//   }
// }`


// CreateAddressInput: {
//   fullName:"ABCDEdd"
//   streetLine1:"Bangalore"
//   city:"Bangalore"
//   countryCode:"IN"
// }

// export const ADDING_ADDRESS = gql`
// mutation addingAddress($input: CreateAddressInput!!){
// setOrderShippingAddress(input: $input){
//   ... on Order{
//     id
//     shippingAddress{
//       fullName
//       streetLine1
//       city
//       countryCode
//     }
//     shippingLines{
//       id
//       shippingMethod{
//         id
//         description
//         name
//       languageCode
//         code
//       }
//     }
//   }
// }
// }`

// export const SHIPPING_METHOD = gql`
// query shippingmethod{
//   eligibleShippingMethods{
//     id
//     name
//   }
// }`

// export const ADD_SHIPPING_METHOD = gql`
// mutation addingShippingMethod{
//   setOrderShippingMethod(shippingMethodId:1){
//     ... on Order{
//       shippingLines{
//         shippingMethod{
//           id
//           name
//         }
//       }
//     }
//   }
// }`

// export const ACTIVE_ORDER = gql`
// query activeOrder{
//   activeOrder{
//     id
//     state
//   }
// }`

export const NEXT_ORDER_STATE = gql`
query NextStates {
  nextOrderStates
}`

export const CHANGE_STATE = gql`
mutation changingState($nextOrder: String! = "ArrangingPayment"){
  transitionOrderToState(state: $nextOrder) {
   ... on Order{
     id
     state
   }
  }
}
`

export const ADD_PAYMENT = gql`
mutation addingPayment($method: String!) {
addPaymentToOrder(input:{
  method: $method,
  metadata: {}
}){
  ... on Order{
    id
    state
    payments{
      id
      transactionId
      method
    }
  }
}  
}
`

// export const CHANGING_STATE = gql`
// mutation changingState{
//   transitionOrderToState(state: "ArrangingPayment") {
//    ... on Order{
//      id
//      state
//    }
//   }
// }`

export const ELIGIBLE_PAYMENT = gql`
query eligiblePayment {
  eligiblePaymentMethods{
    id
    name
    code
    description
  }
}`

export const PAYMENT_INFO = gql`
query neworder{
    activeOrder{
      id
          type
          total
          subTotal
      subTotalWithTax
          totalWithTax
          totalQuantity
      shipping
      lines{
        id
        quantity
        productVariant{
          name
          price
        }
        featuredAsset{
              preview
            }
      }
          discounts{
            description
            amount
            amountWithTax
          }
    }
  }
`

// export const ADD_PAYMENT = gql`
// mutation addingPayment {
// addPaymentToOrder(input:{
//   method: "standard-payment"
//   metadata:{}
// }){
//   ... on Order{
//     id
//     state
//     payments{
//       id
//       transactionId
//       method
//     }
//   }
// }  
// }`

// export const CURRENT_PAYMENT_STATE = gql`
// query currentpaymentstate{
//   activeOrder{
//     id
//     state
//     total
//   }
// }`

// export const CREATE_ORDER = gql`
// query CreateOrder {
//   nextOrderStates
// }`

// export const ADD_BILLING_ADDRESS = gql`
// mutation addingBillingAddress{
//   setOrderBillingAddress(input:{
//     fullName:"Rishi"
//     streetLine1:"Bangalore"
//     city:"Bangalore"
//     countryCode:"IN"
//   }){
//     ... on Order{
//       id
//       billingAddress{
//         fullName
//         streetLine1
//         city
//         countryCode
//       }
//       shippingLines{
//         id
//         shippingMethod{
//           id
//           description
//           name
//         languageCode
//           code
//         }
//       }
//     }
//   }
//   }
// `