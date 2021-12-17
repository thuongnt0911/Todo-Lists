const dataList = document.querySelector('[ data-list]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteList = document.querySelector('[data-delete-list]');
const listDisplayContainer = document.querySelector('[data-list-display]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountUnComplete = document.querySelector('[data-list-count-remaining]');
const listCountComplete = document.querySelector('[data-list-count-complete]');
const taskItem = document.querySelector('[data-item]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearItem = document.querySelector('[data-clear-item]');
const dataItemList = document.querySelector('[data-item]');

//save data to localstorage
const localStorage_key = 'task.lists';
const localStorage_selected_key = 'task.selectedListId';

var lists = JSON.parse(localStorage.getItem(localStorage_key)) || [];
var selectedListId = localStorage.getItem(localStorage_selected_key);

function save() {
    localStorage.setItem(localStorage_key, JSON.stringify(lists));
    localStorage.setItem(localStorage_selected_key, selectedListId);
}

//save selected list ID
dataList.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedListId = event.target.dataset.listId;
        saveAndRender();
        console.log(selectedListId);
    }
})

//check task item
taskItem.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === event.target.id);
        selectedTask.complete = event.target.checked;
        save();
        countTask(selectedList);
        countComplete(selectedList);
    }
})

//submit input - new list
newListForm.addEventListener('submit', event => {
    const listName = newListInput.value;
    if (listName == null || listName === '')// input null
        return
    {
        const list = createList(listName);
        newListInput.value = null;
        lists.push(list);
        saveAndRender();
    }
})

//submit input - new item
newTaskForm.addEventListener('submit', event => {
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === '')
        return
    {
        const task = createTask(taskName);
        newTaskInput.value = null;
        const selectedList = lists.find(list => list.id === selectedListId);
        selectedList.tasks.push(task);

        saveAndRender();
    }
})

function createList(name) {
    return {
        id: Date.now().toString(), //
        name: name,
        tasks: []
    }
}

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}

//delete List
deleteList.addEventListener('click', event => {
    lists = lists.filter(list => list.id != selectedListId);
    selectedListId = null;
    saveAndRender();
})

//render
function render() {
    clearElement(dataList);
    renderList();
    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerHTML = selectedList.name;
        countTask(selectedList);
        countComplete(selectedList);
        clearElement(taskItem);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        taskItem.appendChild(taskElement);
    })
}

function renderList() {
    lists.forEach(list => {
        const listElement = document.createElement('li');//create tag li
        listElement.classList.add("tasks__list-name");//create classname for tag li
        listElement.dataset.listId = list.id;
        listElement.innerText = list.name;//add content
        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        dataList.appendChild(listElement);//add to array
    })
}

//Count
function countTask(selectedList) {
    const remainingTask = selectedList.tasks.filter(task => !task.complete).length;
    const showString = remainingTask <= 1 ? "task" : "tasks";
    listCountUnComplete.innerHTML = ` ${remainingTask} ${showString} remaining`;
}

function countComplete(selectedList) {
    const completeTask = selectedList.tasks.filter(task => task.complete).length;
    const showString = completeTask <= 1 ? "task" : "tasks";
    listCountComplete.innerHTML = ` ${completeTask} ${showString} complete`;
}

//Clear Item completed
clearItem.addEventListener('click', event => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})

//save and render :))
function saveAndRender() {
    save();
    render();
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
render();