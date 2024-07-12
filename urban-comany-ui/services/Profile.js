import { gql } from "@apollo/client";

export const GET_ACTIVE_CUSTOMER = gql`
  query {
    activeCustomer {
      firstName
      lastName
    }
  }
`;

export const SET_CUSTOMER_PROFILE_PIC = gql`
  mutation SetCustomerProfilePic($file: Upload!) {
    setCustomerProfilePic(file: $file) {
      id
      name
      type
    }
  }
`;
