import gql from 'graphql-tag';

const productReviewShopApiExtensions = gql`
  type ProductReview implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    summary: String!
    body: String!
    author: Customer!
    rating: Int!
    upvotes: Int!
    downvotes: Int!
    product: Product!
    productVariant: ProductVariant
  }

  type ProductReviewList implements PaginatedList {
    items: [ProductReview!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input ProductReviewListOptions

  extend type Query {
    productReview(id: ID!): ProductReview
    productReviews(productId: ID!, options: ProductReviewListOptions): ProductReviewList!
  }

  input CreateProductReviewInput {
    productId: ID!
    productVariantId: ID
    summary: String
    body: String!
    rating: Int
  }

  input UpdateProductReviewInput {
    id: ID!
    summary: String
    body: String
    rating: Int
  }

  extend type Product {
    reviews: ProductReviewList
  }

  extend type Mutation {
    createProductReview(input: CreateProductReviewInput!): ProductReview!
    updateProductReview(input: UpdateProductReviewInput!): ProductReview!
    deleteProductReview(id: ID!): DeletionResponse!
  }


`;
export const shopApiExtensions = gql`
  ${productReviewShopApiExtensions}
`;
