import { gql } from "@apollo/client";

const UPDATE_PROFILE_PIC = gql`
  mutation SetCustomerProfilePic($file: Upload!) {
    setCustomerProfilePic(file: $file) {
      id
      name
      preview
    }
  }
`;

export const GET_ACTIVE_CUSTOMER = gql`
  query {
    activeCustomer {
      firstName
      lastName
    }
  }
`;