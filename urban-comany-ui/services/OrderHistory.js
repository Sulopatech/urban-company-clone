import { gql } from "@apollo/client";

export const ORDER_HISTORY = gql`
 query activeCustomer {
    activeCustomer {
      firstName
      lastName
      phoneNumber
      orders {
        items {
          id
          total
          totalWithTax
          state
          shippingAddress{
            streetLine1
            city
            postalCode
            country
          }
          lines {
            id
            productVariant {
              id
              name
              priceWithTax
              product {
                name
                slug
                featuredAsset{
                  id
                  preview
                }
              }
            }
            featuredAsset {
              id
              preview
            }
          }
          customFields{
            Schedule{
              currentStartDate
              currentEndDate
              currentStartTime
              currentEndTime
              rescheduleFrequency
            }
            time
          }
        }
        totalItems
      }
    }
  }
`;
