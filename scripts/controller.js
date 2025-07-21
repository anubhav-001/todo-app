// glue b/w view and models
import todoOperations from "./service.js";
import { validateName } from "./validation.js";
import { init } from "./utils.js";
window.addEventListener('load',initialize);
let autoId;
function initialize(){
    bindEvents();
    autoId = init();
    showId();
    renderLocaldata();
}

function bindEvents() {
    document.getElementById('add').addEventListener('click', addTask);
    document.getElementById('delete').addEventListener('click' , deleteForEver);  
    document.querySelector('#clearAll').addEventListener('click', clearAllFields);  
    document.querySelector('#update').addEventListener('click', updateTask);
    document.querySelector('#sortName').addEventListener('click', sortByName);
    document.querySelector('#sortId').addEventListener('click', sortById);
    document.querySelector('#save').addEventListener('click', saveTasks);
    document.querySelector('#searchName').addEventListener('click', searchByName);
}

function saveTasks(){
    localStorage.setItem('localData' , JSON.stringify(todoOperations.tasks));
}

function deleteForEver(){
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    todoOperations.removeTask();
    printAllTasks();
    setDltClass();
    saveTasks();    
}

function setDltClass(){
    if(todoOperations.markCount() > 0){
        document.querySelector('#delete').classList.remove('dlt-IsEnable');
    }
    else{
        document.querySelector('#delete').classList.add('dlt-IsEnable');
    }
}

function setUpdateClass(){
    document.querySelector('#update').classList.toggle('update-IsEnable');
    document.querySelector('#add').classList.toggle('add-IsEnable');
}

function clearAllFields(){
    const FIELDS = ['name', 'desc', 'date', 'time', 'photo'];
    for (let field of FIELDS){
        document.getElementById(field).value = '';
    }
}

function updateTask(event){
    const button = event.currentTarget;
    const id = button.getAttribute('update-id');
    const taskToUpdate = todoOperations.tasks.find(task => task.id == id);

    const FIELDS = ['id', 'name', 'desc', 'date', 'time', 'photo'];
    // var task = {};
    for (let field of FIELDS){
        if (field === 'id') {
            taskToUpdate[field] = document.getElementById(field).innerText;
        } else {
            taskToUpdate[field] = document.getElementById(field).value;
        }
    }
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    printAllTasks();
    // document.getElementById('id').innerText = prev+1;
    showId();
    setUpdateClass();
    saveTasks();
    clearAllFields();
}

function sortByName(){
    todoOperations.tasks.sort((a, b) => a.name.localeCompare(b.name));
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    printAllTasks();
    saveTasks();
}

function sortById(){
    todoOperations.tasks.sort((a, b) => a.id - b.id);
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    printAllTasks();
}

function searchByName(){
    const nameTo = document.getElementById('nameToSearch').value;
    const searched = todoOperations.filterByName(nameTo);
    console.log(searched);
    if(searched.length >0){
        const tbody = document.querySelector('#task-list');
        tbody.innerHTML = '';
        searched.forEach(printTask);
    }
    else{
        alert('No task matched');
    }  
    document.getElementById('nameToSearch').value = '';
}

function renderLocaldata(){
    todoOperations.tasks = JSON.parse(localStorage.getItem('localData'));
    printAllTasks();
}

function showId() {
    document.getElementById('id').innerText = autoId();
}

function addTask(){
    var task = readFields();
    if(verifyFields(task)){
        todoOperations.addTask(task);
    };
    printTask(task);
    computeTotal();
    showId();
    clearAllFields();
}

// function printAllTasks(){
//     todoOperations.tasks.forEach(printTask);
//     computeTotal();
// }

function printTask(task){
    const tbody = document.querySelector('#task-list');
    const tr = tbody.insertRow();
    let index = 0;
    for(let key in task){
        if(key === 'isMarked'){
            continue;
        }
        tr.insertCell(index).innerText = task[key];
        index++;
    }
    const td = tr.insertCell(index);
    td.appendChild(createIcon(task.id, toggleMarking, 'fa-trash'));
    td.appendChild(createIcon(task.id, editTask, 'fa-pen'));
}

function printAllTasks(){
    todoOperations.tasks.forEach(printTask);
    computeTotal();
}

function readFields() {
    const FIELDS = ['id', 'name', 'desc', 'date', 'time', 'photo'];
    var task = {};
    for (let field of FIELDS){
        if (field === 'id') {
            task[field] = document.getElementById(field).innerText;
        } else {
            task[field] = document.getElementById(field).value;
        }
    }
    return task;
}

const editTask = (id) => {
    const taskObj = todoOperations.tasks.find(task => task.id == id);
    setFieldsToUpdate(taskObj);
    setUpdateClass();
    document.querySelector('#update').setAttribute('update-id', id);
}

function setFieldsToUpdate(task){
    const FIELDS = ['id', 'name', 'desc', 'date', 'time', 'photo'];
    for (let field of FIELDS){        
        if (field === 'id') {    
            document.getElementById(field).innerText = task[field];
        } else {
            document.getElementById(field).value = task[field];
        }
    }
}


function computeTotal(){
    document.querySelector('#total').innerText = todoOperations.getTotal();
    document.querySelector('#marked').innerText = todoOperations.markCount();
    document.querySelector('#unmarked').innerText = todoOperations.unmarkCount();
}

function toggleMarking(){
    const currentButton = this;
    const id  = currentButton.getAttribute('task-id')
    console.log('toggleMarking' , id);
    todoOperations.toggleTask(id);
    computeTotal();
    setDltClass();
    console.log(todoOperations.tasks);
    currentButton.parentNode.parentNode.classList.toggle('red');
}

function createIcon(id , fn , className='fa-trash'){
    const iTag = document.createElement('i');
    iTag.addEventListener('click',className == 'fa-pen' ? () => fn(id) : fn);
    iTag.className = `fa-solid ${className} hand`;
    iTag.setAttribute('task-id', id);
    return iTag;
}

function verifyFields(task) {
    var errorMessage = "";
    errorMessage = validateName(task.name);
    if (errorMessage) {
        document.getElementById('name-error').innerText = errorMessage;
        return false;
    }
    return true;
}
