import { gql } from "@apollo/client";

export const SIGNUP = gql`
 mutation registerCustomerAccount(
    $firstName: String!,
    $emailAddress: String!,
    $password: String!,
    $phoneNumber: String
  ) {
    registerCustomerAccount(input: {
      firstName: $firstName,
      emailAddress: $emailAddress,
      password: $password,
      phoneNumber: $phoneNumber
    }) {
      __typename  
    }
  }
`;
