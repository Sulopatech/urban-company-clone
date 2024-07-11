import { gql } from "@apollo/client";

export const GET_PRODUCT_LIST = gql`
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

export const GETCOLLECTIONSLIST = gql`
query {
  collections {
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
}`

export const GET_SINGLE_COLLECTION_LIST = (slug) => gql`
query collection {
  collection(slug: "${slug}") {
    children {
      id
      name
      slug
      createdAt
      __typename
      featuredAsset {
        id
        createdAt
        name
        preview
      }
    }
    name
    productVariants {
      items {
        name
        productId
        price
        stockLevel
        product {
          id
          name
          slug
          featuredAsset {
            id
            preview
          }
        }
      }
      totalItems
    }
  }
  activeOrder{
      totalQuantity
    }
}`

export const GET_PRODUCT_DETAIL = (prodSlug) => gql`
query {
  product(slug: "${prodSlug}") {
    id
    name
    slug
    featuredAsset {
      preview
      id
      createdAt
    }
    __typename
    description
    createdAt
    variants {
      id
      name
      priceWithTax
      price
      taxCategory {
        id
        name
      }
      taxRateApplied {
        name
      }
    }
  }
  activeOrder{
      totalQuantity
    }
}
`;
