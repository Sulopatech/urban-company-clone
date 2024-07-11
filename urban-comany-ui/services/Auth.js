import { gql } from "@apollo/client";



export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {

    login(username: $username, password: $password) {
      __typename
      ... on CurrentUser
      {
        channels
        {
          id 
          token
          code
          __typename
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
      
    }
  }
  
`;


export const SIGNUP = gql`
  mutation registerCustomerAccount(
    $firstName: String!,
    $lastName: String!,
    $emailAddress: String!,
    $password: String!,
    $phoneNumber: String
  ) {
    registerCustomerAccount(input: {
      firstName: $firstName,
      lastName :$lastName,
      emailAddress: $emailAddress,
      password: $password,
      phoneNumber: $phoneNumber
    }) {
      __typename  
    }
  }
`;
