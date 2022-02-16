/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDidData = /* GraphQL */ `
  query GetDidData($id: ID!) {
    getDidData(id: $id) {
      id
      name
      pub
      private
      createdAt
      updatedAt
    }
  }
`;
export const listDidData = /* GraphQL */ `
  query ListDidData(
    $filter: ModelDidDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDidData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        pub
        private
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
