export default class OperationDocsStore {
  static getAll() {
    return `query MyQuery {
      todo {
        user_id
        title
        id
      }
    }
    `;
  }

  static addOne(title) {
    return `mutation MyMutation {
      insert_todo_one(object: {title: "${title}"}) {
        user_id
        title
        id
      }
    }`;
  }

  static deleteById(id) {
    return `mutation MyMutation {
      delete_todo_by_pk(id: "${id}") {
        id
        title
        user_id
      }
    }`;
  }
}
