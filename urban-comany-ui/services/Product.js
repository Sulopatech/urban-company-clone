import { gql } from "@apollo/client";

export const GETCOLLECTIONSLIST = gql`
  query {
    products {
      items {
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
      totalItems
    }
  }
`;

export const GETSINGLECOLLECTIONLIST = gql`
  query getProduct($id: ID! = 1) {
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
      variantList {
        items {
          name
          product {
            name
          }
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
        }
      }
    }
  }
`;
