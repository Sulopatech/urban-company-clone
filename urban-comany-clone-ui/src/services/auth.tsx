import {gql} from "@apollo/client"

export const LOGIN = gql`
mutation login($email: String!,$password: String!,$rememberMe: Boolean){
 login(username: $email,password: $password, rememberMe: $rememberMe){

    ... on CurrentUser{
        id 
        identifier 
        channels{
            id 
            token
            code 
            permissions
            __typename
        }
    }
        ...on ErrorResult{
        errorCode
        message
        }
  }
}
 `;