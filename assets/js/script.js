var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form")
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

// create function that makes li when clicking add task 
var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check i finput values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");

    //has data attribute, so get task id and call function to complte edit process 
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function (taskDataObj) {
    // create list item 
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as custome attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item 
    var taskInfoEl = document.createElement("div");

    //give it a class name 
    taskInfoEl.className = "task-info";

    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    //getting current id # of task and assigning it to id property of taskDataObj
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // create task actions (buttons and select) for task
    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    //increase task counter for next unique id
    taskIdCounter++;

    saveTasks();
}

var createTaskActions = function (taskId) {

    //create edit button 
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    //create delete button 
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    //create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);

    //create option elements
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option elements
        var statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

var completeEditTask = function (taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };


    alert("Task Updated!");

    //remove data attribute from form
    formEl.removeAttribute("data-task-id");
    //update formEl button to go back to saying "add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};

var taskButtonHandler = function (event) {
    //get target element from event 
    var targetEl = event.target;

    //edit button was clicked 
    if (targetEl.matches(".edit-btn")) {
        console.log("edit was picked", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked 
    else if (targetEl.matches(".delete-btn")) {
        //get the element's task id
        console.log("delete was picked ", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function (event) {
    console.log(event.target.value);

    //find task list item based on even.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    //console.log(event.target.getAttribute("data-task-id"));

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update task's in task's array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var editTask = function (taskId) {
    console.log(taskId);
    //get task list item element 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type 
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //write values of taskname and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //set data attribute to the form with a value of the task's id so it knows which one is being edited 
    formEl.setAttribute("data-task-id", taskId);
    //update form's button to reflect editing a task rather than creating a new one
    document.querySelector('#save-task').textContent = "Save Task";
};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //console.log(taskSelected);
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskID, lets keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTask = function () {
    //get tasks item from local storage
    var savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return false;
    }
    //convert tasks from a string format back into an array of objects
    savedTasks = JSON.parse(savedTasks);
        
    // loop through savedTasks array
for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }

    //integrates though tasks array and creates task elements on page 
//     for (var i = 0; i < tasks.length; i++) {
//         // console.log(tasks[i]);
//         tasks[i].id = taskIdCounter;
//         console.log(tasks[i].id);
//         var listItemEl = document.createElement("li");
//         listItemEl.className = "task-item";
//         listItemEl.setAttribute("data-task-id", tasks[i].id);
//         console.log(listItemEl);

//         //div element created 
//         var taskInfoEl = document.createElement("div");
//         taskInfoEl.className = "task-info";
//         taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

//         //append taskInfoEl to parent listItemEl
//         listItemEl.appendChild(taskInfoEl);

//         var taskActionsEl = createTaskActions(tasks[i].id);
//         listItemEl.appendChild(taskActionsEl);
//         console.log(listItemEl);

//         //checking dropdown
//         if (tasks[i].status === "to do") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
//             tasksToDoEl.appendChild(listItemEl);
//         } else if (tasks[i].status === "in progress") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
//             taskInProgressEl.appendChild(listItemEl);
//         } else if (tasks[i].status === "complete") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
//             tasksCompletedEl.appendChild(listItemEl);
//         }

//         taskIdCounter++;
//         console.log(listItemEl);
//     }
// };
}
//create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing status 
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTask();


