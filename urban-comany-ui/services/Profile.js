import { gql } from "@apollo/client";


export const GET_ACTIVE_CUSTOMER = gql`
  query {
    activeCustomer {
      firstName
    }
  }
`;