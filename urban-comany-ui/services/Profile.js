import { gql } from "@apollo/client";

export const UPDATE_PROFILE_PIC = gql`
  mutation createCustomoreProfilePicture($code: String!) {
    createCustomoreProfilePicture(input: { code: $code }) {
      __typename
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