// Common Functions
function isPage(pageName) {
    return document.body.classList.contains(pageName);
}

// Initialize TODOs List
function renderTodos() {
    const tableBody = document.getElementById("table_body");
    let todosJsonArray = localStorage.getItem("todosJson") ? JSON.parse(localStorage.getItem("todosJson")) : [];

    let rows = "";
    todosJsonArray.forEach((item, index) => {
        rows += `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td><button class="btn btn-success" onclick="markAsFinished(${index})">✔</button></td>
          <td><button class="btn btn-danger" onclick="deleteTask(${index})">Delete</button></td>
        </tr>`;
    });

    tableBody.innerHTML = rows;
}

// Add Task to Local Storage
function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (title && description) {
        let todosJsonArray = localStorage.getItem("todosJson") ? JSON.parse(localStorage.getItem("todosJson")) : [];
        todosJsonArray.push([title, description]);
        localStorage.setItem("todosJson", JSON.stringify(todosJsonArray));
        renderTodos();
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    } else {
        alert("Please fill in both fields!");
    }
}

// Mark Task as Finished
function markAsFinished(index) {
    let todosJsonArray = JSON.parse(localStorage.getItem("todosJson"));
    let historyJsonArray = localStorage.getItem("historyJson") ? JSON.parse(localStorage.getItem("historyJson")) : [];

    const finishedTask = todosJsonArray.splice(index, 1)[0];
    finishedTask.push(new Date().toISOString());
    historyJsonArray.push(finishedTask);

    localStorage.setItem("todosJson", JSON.stringify(todosJsonArray));
    localStorage.setItem("historyJson", JSON.stringify(historyJsonArray));
    renderTodos();
}

// Delete Task from TODOs
function deleteTask(index) {
    let todosJsonArray = JSON.parse(localStorage.getItem("todosJson"));
    todosJsonArray.splice(index, 1);
    localStorage.setItem("todosJson", JSON.stringify(todosJsonArray));
    renderTodos();
}

// Clear All Tasks
function clearAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("todosJson");
        renderTodos();
    }
}

// History Page Logic: Display tasks from the last 24 hours
function renderHistory() {
    const historyBody = document.getElementById("history_body");
    let historyJsonArray = localStorage.getItem("historyJson") ? JSON.parse(localStorage.getItem("historyJson")) : [];

    let rows = "";
    historyJsonArray.forEach((item, index) => {
        const completionTime = new Date(item[2]);
        const timeAgoStr = completionTime.toLocaleString();

        rows += `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${timeAgoStr}</td>
        </tr>`;
    });

    historyBody.innerHTML = rows;
}

// Initialize
window.onload = () => {
    if (isPage("todos-page")) {
        renderTodos();
        document.getElementById("add").addEventListener("click", addTask);
    } else if (isPage("history-page")) {
        renderHistory();
    }
};
