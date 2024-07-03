import { gql } from "@apollo/client";

export const GET_PRODUCT_DETAIL = gql`
  query GetProductDetail($slug: String!) {
    product(slug: $slug) {
      id
      name
      description
      variants {
        id
        name
        price
        priceWithTax
        sku
        options {
          code
          name
        }
        assets {
          id
          width
          height
          name
          preview
          focalPoint {
            x
            y
          }
        }
      }
      featuredAsset {
        id
        width
        height
        name
        preview
        focalPoint {
          x
          y
        }
      }
      assets {
        id
        width
        height
        name
        preview
        focalPoint {
          x
          y
        }
      }
      collections {
        id
        slug
        breadcrumbs {
          id
          name
          slug
        }
      }
    }
  }
`;
