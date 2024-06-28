import gql from 'graphql-tag';

const customoreProfilePictureAdminApiExtensions = gql`
  type CustomoreProfilePicture implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
  }

  type CustomoreProfilePictureList implements PaginatedList {
    items: [CustomoreProfilePicture!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input CustomoreProfilePictureListOptions

  extend type Query {
    customoreProfilePicture(id: ID!): CustomoreProfilePicture
    customoreProfilePictures(options: CustomoreProfilePictureListOptions): CustomoreProfilePictureList!
  }

  input CreateCustomoreProfilePictureInput {
    code: String!
  }

  input UpdateCustomoreProfilePictureInput {
    id: ID!
    code: String
  }

  extend type Mutation {
    createCustomoreProfilePicture(input: CreateCustomoreProfilePictureInput!): CustomoreProfilePicture!
    updateCustomoreProfilePicture(input: UpdateCustomoreProfilePictureInput!): CustomoreProfilePicture!
    deleteCustomoreProfilePicture(id: ID!): DeletionResponse!
  }

  extend type Customer {
    profilePic: CustomoreProfilePicture
  }
`;
export const adminApiExtensions = gql`
  ${customoreProfilePictureAdminApiExtensions}
`;
