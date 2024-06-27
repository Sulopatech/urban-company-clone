import { gql } from "@apollo/client";


 export const LOGIN = gql `
     mutation login($email: String!, $password: String! )
     {
       login(username: $email, password: $password) 
       {
             __typename
       } 

     }
 `; 