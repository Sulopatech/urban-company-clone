import { gql } from "@apollo/client";

export const GETSEARCHLIST = gql`
  query Search($term: String!) {
    search(input: {
      term: $term
    }) {
      items {
        __typename
        productVariantName
        productName
        description
        # Include other fields you need
      }
      totalItems
    }
  }
`;
