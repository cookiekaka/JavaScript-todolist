// Model ----------------------------------------------------------------------------------------------------------------------------

/* 获取getID */
function getID() {
  let todoList = getTodoData();
  todoList === [] && localStorage.setItem('id', 0);
  let id = JSON.parse(localStorage.getItem('id'));
  localStorage.setItem('id', ++id);
  return id;
}

/* 读取本地存储的任务列表，并转为数组todoList */
function getTodoData() { 
  if (localStorage.length === 0) {
    return [];
  }
  let todoList = [];
  let idArr = Object.keys(localStorage).slice(0, -1).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });
  for (let key of idArr) {
    if (key !== 'id') {
      let todoItem = JSON.parse(localStorage.getItem(key));
      todoList.push(todoItem);
    } 
  }
  return todoList;
}

/* 添加单项任务 */
function setTodoData(id, todo) {
  localStorage.setItem(id, JSON.stringify(todo));
}

/* 删除/修改单项任务 */
function deleteTodoData(id) {
  localStorage.removeItem(id);
}

/* 获取指定id的任务 */
function getTodoItemData(id) {
  return JSON.parse(localStorage.getItem(id));
}

// ModelView ----------------------------------------------------------------------------------------------------------------------------

/* 初次加载页面，要根据localStorage 渲染DOM */
window.onload = onLoading;

function onLoading() {
  // localStorage.clear();
  let todoList = getTodoData();
  console.log(todoList);
  for (let todoItem of todoList) {
    renderTodoDOM(todoItem);
  }
  onUpdateCount(todoList);

  onCheckedAll();
}

/* 添加单项任务 */
function onAddTodo() {
  const todoText = getAddTodoDOM().value;
  if (todoText === '') {
    return;
  }
  const id = getID();
  const todoItem = {
    id: id,
    todoText: todoText,
    isDone: false,
  }
  setTodoData(id, todoItem);
  onUpdateCount();

  resetFormDOM();
  renderTodoDOM(todoItem);

  onCheckedAll();
}

/* 删除单项任务 */
function onDeleteTodo(id) {
  deleteTodoData(id);
  onUpdateCount();

  deleteTodoDOM(id);

  onCheckedAll();
}

/* 改变选框状态 */
function onChangeChecked(id, checked) {
  let todoItem = getTodoItemData(id);
  todoItem.isDone = checked;
  setTodoData(id, todoItem);
  const todoList = getTodoData();
  onCalDoneCount(todoList);

  // changeCheckedDOM(todoItem);

  onCheckedAll();
}

/* 监测是否所有任务完成 */
function onCheckedAll() {
  let todoList = getTodoData();
  let doneCount = 0;
  for (let todoItem of todoList) {
    todoItem.isDone === true && doneCount++;
  }
  if (todoList.length === 0) {
    selectAllDOM(false);
    document.querySelector('.no-todo').style.display = 'block';
  }
  else if (doneCount === todoList.length) {
    selectAllDOM(true);
    document.querySelector('.no-todo').style.display = 'none';    
  } else {
    selectAllDOM(false);
    document.querySelector('.no-todo').style.display = 'none';
  }
}

/* 清除已完成任务 */
function onClearDone() {
  let todoList = getTodoData();
  for (let todoItem of todoList) {
    if (todoItem.isDone) {
      deleteTodoData(todoItem.id);
      deleteTodoDOM(todoItem.id);
    }
  }
  onUpdateCount();

  onCheckedAll();
}

/* 全选 */
function onSelectAll(checked) {
  let todoList = getTodoData();
  for (let todoItem of todoList) {
    todoItem.isDone = checked;
    setTodoData(todoItem.id, todoItem);
    console.log(todoItem);
    changeCheckedDOM(todoItem);
  }
  checked && renderDoneCountDOM(todoList.length);
  !checked && renderDoneCountDOM(0);
}

/* 底部 已完成/全部 信息 */
function onUpdateCount() {
  let todoList = Array.from(arguments)[0] || getTodoData();
  onCalDoneCount(todoList);
  onCalTodoCount(todoList);
}

function onCalDoneCount(todoList) {
  let doneCount = 0;
  for (let todoItem of todoList) {
    todoItem.isDone === true && doneCount++;
  }
  renderDoneCountDOM(doneCount);
};

function onCalTodoCount(todoList) {
  renderTodoCountDOM(todoList.length);
}


// View ----------------------------------------------------------------------------------------------------------------------------

/* 绑定监听器 */
document.querySelector('.todo-main').addEventListener('click', (e) => {
  /* 删除单项任务 */
  if(e.target && e.target.nodeName.toUpperCase() === 'BUTTON') {
    onDeleteTodo(e.target.id.slice(4)); // btn-id
  }
  /* 点击改变checkbox状态 */
  if(e.target && e.target.nodeName.toUpperCase() === 'INPUT') {
    onChangeChecked(e.target.id.slice(6), e.target.checked); // input-id
  }
});

/* 获取输入框的任务文字 */
function getAddTodoDOM() {
  return document.querySelector('.add-input');
}

/* 获取任务列表容器ul */
function getTodoListDOM() {
  return document.querySelector('.todo-main');
}

/* 清空输入表单 */
function resetFormDOM() {
  document.querySelector('.form').reset();
}

/* 添加单项任务 */
function renderTodoDOM(todoItem) {
  let todoListDOM = getTodoListDOM();
  let todoItemDOM = 
    `<li class="todo-item-li">
    <input class="todo-item-input" id="input-${todoItem.id}" type="checkbox" />
    <span>${todoItem.todoText}</span>
    <button class="todo-list-btn"  id="btn-${todoItem.id}">删 除</button>
    </li>`;
  todoListDOM.innerHTML += todoItemDOM;
  changeCheckedDOM(todoItem);
}

/* 删除单项任务 */
function deleteTodoDOM(id) {
  const todoItemDOM = document.getElementById(`btn-${id}`).parentNode;
  let todoListDOM = getTodoListDOM();
  todoListDOM.removeChild(todoItemDOM);
}

/* 设置选框状态 */
function changeCheckedDOM(todoItem) {
  if (todoItem.isDone) {
    document.getElementById(`input-${todoItem.id}`).setAttribute('checked', true);
    document.getElementById(`input-${todoItem.id}`).checked = true;
  } else {
    console.log(todoItem.id);
    document.getElementById(`input-${todoItem.id}`).removeAttribute('checked');
    document.getElementById(`input-${todoItem.id}`).checked = false;
  }
}

/* 监测是否所有任务完成 */
function selectAllDOM(isSelectAll) {
  if (isSelectAll) {
    document.querySelector('.select-all').setAttribute('checked', true);
    document.querySelector('.select-all').checked = true;
  } else {
    document.querySelector('.select-all').removeAttribute('checked');
    document.querySelector('.select-all').checked = false;
  }
}

/* 清除已完成任务 按钮 */
document.querySelector('.clear-done').addEventListener('click', () => {
  onClearDone();  
})

/* 全选 按钮 */
document.querySelector('.select-all').addEventListener('click', (e) => {
  onSelectAll(e.target.checked);
});

/* 底部 已完成/全部 信息 */
function renderDoneCountDOM(count) {
  document.querySelector('.done-count').innerHTML = count;
}

function renderTodoCountDOM(count) {
  document.querySelector('.todo-count').innerHTML = count;
}
