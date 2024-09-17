import gql from 'graphql-tag';

const scheduleAdminApiExtensions = gql`
extend type Mutation {
  createOrUpdateOrderSchedule(
    orderId: ID!
    startDate: DateTime!
    endDate: DateTime!
    startTime: String!
    endTime: String!
  ): Schedule!

  rescheduleOrder(
    orderId: ID!
    newStartDate: DateTime!
    newEndDate: DateTime!
    newStartTime: String!
    newEndTime: String!
  ): Schedule!
}

type Schedule {
  id: ID!
  order: Order!
  originalStartDate: DateTime!
  originalEndDate: DateTime!
  originalStartTime: String!
  originalEndTime: String!
  currentStartDate: DateTime!
  currentEndDate: DateTime!
  currentStartTime: String!
  currentEndTime: String!
  rescheduleFrequency: Int
  lastRescheduledDate: DateTime
}

extend type Order {
  schedule: Schedule
}
`;
export const adminApiExtensions = gql`
  ${scheduleAdminApiExtensions}
`;
