
// import { gql } from "@apollo/client";

// export const GET_PRODUCT_DETAIL = gql`
// query GetProductDetail($slug: String!) {
//   product(slug: $slug) {
//     id
//     name
//     description
//     variants {
//       id
//       name
//       price
//       priceWithTax
//       sku
//       options {
//         code
//         name
//       }
//     }
//     featuredAsset {
//       id
//       width
//       height
//       name
//       preview
//       focalPoint {
//         x
//         y
//       }
//     }
//     assets {
//       id
//       width
//       height
//       name
//       preview
//       focalPoint {
//         x
//         y
//       }
//     }
//     collections {
//       id
//       slug
//       breadcrumbs {
//         id
//         name
//         slug
//       }
//     }
//   }
// }
// `;

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
    }
    featuredAsset {
      id
      preview  # Assuming 'preview' is a URL or base64-encoded image data
      width
      height
      name
      focalPoint {
        x
        y
      }
    }
    assets {
      id
      preview  # Assuming 'preview' is a URL or base64-encoded image data
      width
      height
      name
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
