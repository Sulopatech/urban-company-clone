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