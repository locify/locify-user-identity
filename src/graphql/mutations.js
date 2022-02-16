/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createDidData = /* GraphQL */ `
  mutation CreateDidData(
    $input: CreateDidDataInput!
    $condition: ModelDidDataConditionInput
  ) {
    createDidData(input: $input, condition: $condition) {
      id
      name
      pub
      private
      createdAt
      updatedAt
    }
  }
`;
export const updateDidData = /* GraphQL */ `
  mutation UpdateDidData(
    $input: UpdateDidDataInput!
    $condition: ModelDidDataConditionInput
  ) {
    updateDidData(input: $input, condition: $condition) {
      id
      name
      pub
      private
      createdAt
      updatedAt
    }
  }
`;
export const deleteDidData = /* GraphQL */ `
  mutation DeleteDidData(
    $input: DeleteDidDataInput!
    $condition: ModelDidDataConditionInput
  ) {
    deleteDidData(input: $input, condition: $condition) {
      id
      name
      pub
      private
      createdAt
      updatedAt
    }
  }
`;
