import { gql } from "@apollo/client";

export const GETSEARCHLIST = gql`
  query Search($term: String!) {
    search(input: { term: $term }) {
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

export const GET_SEARCH_FILTER_LIST = gql`
  query {
    search(
      input: {
        filter: {
          facets: {
            priceRange: { min: 0, max: 100 }
            category: ["category_id_1", "category_id_2"]
          }
          custom: [{}]
        }
      }
    ) {
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
