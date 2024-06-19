import { gql } from "@apollo/client";
import { Token, __Type } from "graphql";

export const LOGIN = gql `
    mutation login($email: String!, $password: String!,$rememberMe: Boolean)
    {
      login(username: $email, password: $password, rememberMe: $rememberMe) 
      {
            __Typename
            ... on CurrentUser
            {
                channels
                {
                    id 
                    Token
                    code
                    permission 
                    __typename
                }
            }
            ... on ErrorResult {
                errorCode
                Message
            }
      } 

    }
'; 