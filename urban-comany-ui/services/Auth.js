import { gql } from "@apollo/client";

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

 export const LOGIN = gql `
     mutation login($email: String!, $password: String! )
     {
       login(username: $email, password: $password) 
       {
             __typename
       } 

     }
       
 `; 
