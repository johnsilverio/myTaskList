"use strict";

const inputTask = document.querySelector(".input-new-task");
const btnAddTask = document.querySelector(".btn-add-task");
const listTask = document.querySelector(".list-tasks");

let isEditing = false;
let currentTask = null;

function createLi() {
    const li = document.createElement("li");
    return li;
}

function createSpan(li, text) {
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;
    li.appendChild(span);
}

function createTaskActions(li) {
    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";
    li.appendChild(taskActions);

    editButton(taskActions);
    removeButton(taskActions);
}

function editButton(taskActions) {
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editButton.classList.add('btnEdit');
    taskActions.appendChild(editButton);
}

function removeButton(taskActions) {
    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
    taskActions.appendChild(removeButton);
    removeButton.classList.add('btnRemove');
}

function createTask(inputText) {
    const li = createLi();
    createSpan(li, inputText);
    createTaskActions(li);
    listTask.appendChild(li);
    clearInput();
}

function clearInput() {
    inputTask.value = "";
    inputTask.focus();
    btnAddTask.innerHTML = '<i class="fa-solid fa-plus"></i>';
    isEditing = false;
    currentTask = null;
}

inputTask.addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        if (!inputTask.value) return;

        if (isEditing) {
            updateTask(inputTask.value);
        } else {
            createTask(inputTask.value);
        }

        saveTasks();
    }
});

btnAddTask.addEventListener("click", function () {
    if (!inputTask.value) return;

    if (isEditing) {
        updateTask(inputTask.value);
    } else {
        createTask(inputTask.value);
    }

    saveTasks();
});

listTask.addEventListener('click', function (e) {
    const target = e.target;

    if (target.matches('.btnRemove') || target.closest('.btnRemove')) {
        e.stopPropagation();
        target.closest('li').remove();
        saveTasks();
    }

    if (target.matches('.btnEdit') || target.closest('.btnEdit')) {
        startEditingTask(target.closest('li'));
    }
});

function startEditingTask(li) {
    const taskText = li.querySelector('.task-text').textContent;
    inputTask.value = taskText;
    inputTask.focus();
    btnAddTask.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
    isEditing = true;
    currentTask = li;
}

function updateTask(newText) {
    if (currentTask) {
        const taskText = currentTask.querySelector('.task-text');
        taskText.textContent = newText;
        clearInput();
    }
}

function saveTasks() {
    let liTasks = listTask.querySelectorAll('li');
    const listOfTasks = [];

    for (let task of liTasks) {
        let taskText = task.innerText;
        taskText = taskText.replace('<i class="fa-solid fa-minus"></i>', '');
        taskText = taskText.replace('<i class="fa-solid fa-pencil"></i>', '');
        listOfTasks.push(taskText);
    }

    const taskJSON = JSON.stringify(listOfTasks);
    localStorage.setItem('task', taskJSON);
    console.log(taskJSON);
}

function restoreTasksInStorage() {
    const tasks = localStorage.getItem('task');
    if (tasks) {
        const listOfTasks = JSON.parse(tasks);
        for (let task of listOfTasks) {
            createTask(task);
        }
    }
}

restoreTasksInStorage();
