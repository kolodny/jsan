var jsan = require('../');
var mobx = require('mobx');

var todoFactory = function (title, store) {
  return mobx.observable({
      store: store, // <-- remove this line to get it work
      title: title
    }
  );
};

var todoListFactory = function () {
  return mobx.observable({
    todos: [],
    addTodo: mobx.action(function addTodo (todo) {
      this.todos.push(todo);
    })
  });
};

var store = todoListFactory();
store.addTodo(todoFactory('Write simpler code', store));

console.log(jsan.stringify(store, null, null, true))