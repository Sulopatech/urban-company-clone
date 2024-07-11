// src/plugins/customer-profile-pic/api/api-extensions.ts

import gql from 'graphql-tag';

export const shopApiExtensions = gql`
    extend type Mutation {
        setCustomerProfilePic(file: Upload!): Asset
    }
`;