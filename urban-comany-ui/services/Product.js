import { gql } from "@apollo/client";

export const GETCOLLECTIONSLIST = gql`
 query {
  products {
    items {
      id
      name
      slug
      description
      assets{
        id
        name
        type
        fileSize
        width
        height
        preview
        source
      }
      featuredAsset {
        id
        preview
      }
    }
    totalItems
  }
}
`;

export const GETSINGLECOLLECTIONLIST = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      assets {
        id
        name
        type
        fileSize
        width
        height
        preview
        source
      }
      featuredAsset {
        id
        preview
      }
    }
  }
`;