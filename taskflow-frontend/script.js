const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );
// PROTECT DASHBOARD
if (!loggedInUser) {

    window.location.href = "index.html";
}
// SHOW USER NAME
document.getElementById("welcomeText")
    .textContent =
    `Welcome, ${loggedInUser.name}`;
const API_URL = "http://localhost:8080/tasks";
const openModal = document.getElementById("openModal");
const logoutBtn =document.getElementById("logoutBtn");
const taskModal = document.getElementById("taskModal");

const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const createTaskBtn = document.getElementById("createTaskBtn");

const todoTasks = document.getElementById("todoTasks");
const doingTasks = document.getElementById("doingTasks");
const doneTasks = document.getElementById("doneTasks");
let editingTask = null;
const searchInput =
    document.getElementById("searchInput");

const priorityFilter =
    document.getElementById("priorityFilter");
// OPEN MODAL
openModal.addEventListener("click", () => {

    taskModal.classList.remove("hidden");
    taskModal.classList.add("flex");

});


// CLOSE MODAL
closeModal.addEventListener("click", () => {
taskModal.classList.add("hidden");
taskModal.classList.remove("flex");

});


// CANCEL BUTTON
cancelModal.addEventListener("click", () => {
taskModal.classList.add("hidden");
taskModal.classList.remove("flex");

});
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
});
function getDeadlineText(deadline) {

    const today = new Date();

    const dueDate = new Date(deadline);

    // REMOVE TIME DIFFERENCE ISSUES
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);

    // DIFFERENCE IN DAYS
    const diffTime = dueDate - today;

    const diffDays =
        Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    
    if (diffDays < 0) {
        return "Overdue";
    }

    if (diffDays === 0) {
        return "Due Today";
    }

    if (diffDays === 1) {
        return "Due Tomorrow";
    }

    return `Due in ${diffDays} days`;
}
async function loadTasks() {

    // FETCH TASKS
    const response =
    await fetch(
        `${API_URL}/user/${loggedInUser.id}`
    );

    const tasks =
        await response.json();


    // CLEAR EXISTING TASKS
    todoTasks.innerHTML =
        `<p class="empty-message text-gray-500 text-center py-4">
            No tasks yet
        </p>`;

    doingTasks.innerHTML =
        `<p class="empty-message text-gray-500 text-center py-4">
            No tasks yet
        </p>`;

    doneTasks.innerHTML =
        `<p class="empty-message text-gray-500 text-center py-4">
            No tasks yet
        </p>`;

const searchText =
    searchInput.value.toLowerCase();

const selectedPriority =
    priorityFilter.value;
    // LOOP TASKS
    tasks.forEach(task => {

    const matchesSearch =
        task.title.toLowerCase()
            .includes(searchText);

    const matchesPriority =
        selectedPriority === "ALL" ||
        task.priority === selectedPriority;


    if (matchesSearch && matchesPriority) {

        createTaskCard(task);
    }
});
    
    updateTaskCounts();
}

function createTaskCard(task) {

    // PRIORITY COLORS
    let borderColor = "border-green-500";

    if (task.priority === "Medium Priority") {
        borderColor = "border-yellow-500";
    }

    if (task.priority === "High Priority") {
        borderColor = "border-red-500";
    }


    // CREATE CARD
const taskCard = document.createElement("div");    
taskCard.dataset.id = task.id;
    taskCard.className =
        `task-card bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-l-4 ${borderColor} mb-4 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer`;


    taskCard.innerHTML = `

        <h3 class="font-bold text-lg">
            ${task.title}
        </h3>

        <p class="hidden priority-value">
            ${task.priority}
        </p>

        <p class="task-description text-gray-600 text-sm mt-2">
            ${task.description}
        </p>

        <div class="mt-4 flex justify-between items-center">

            <span class="text-sm font-semibold text-gray-700">
                ${getDeadlineText(task.deadline)}
            </span>

            <div class="flex gap-2">

                <button class="editBtn text-gray-500 hover:text-blue-500">
                    ✏️
                </button>

                <button class="deleteBtn text-gray-500 hover:text-red-500">
                    ✖
                </button>

            </div>

        </div>
    `;

    // PLACE IN CORRECT COLUMN
    if (task.status === "TODO") {

        todoTasks.appendChild(taskCard);

    } else if (task.status === "DOING") {

        doingTasks.appendChild(taskCard);

    } else {

        doneTasks.appendChild(taskCard);
    }


    // DELETE BUTTON
    const deleteBtn =
        taskCard.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", () => {
            fetch(`${API_URL}/${task.id}`, {
                method: "DELETE"
            })
            .then(() => {
                loadTasks();
            });
        });


    // EDIT BUTTON
    const editBtn =
        taskCard.querySelector(".editBtn");

    editBtn.addEventListener("click", () => {

        editingTask = task;

        document.getElementById("taskTitle").value =
            task.title;

        document.getElementById("taskDescription").value =
            task.description;

        document.getElementById("taskPriority").value =
            task.priority;

        document.getElementById("taskDeadline").value =
            task.deadline;


        taskModal.classList.remove("hidden");

        taskModal.classList.add("flex");
    });
}

// CREATE TASK
createTaskBtn.addEventListener("click", () => {

    // GET VALUES
    const title = document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const priority =
        document.getElementById("taskPriority").value;

    const deadline =
        document.getElementById("taskDeadline").value;


    // VALIDATION
    if (title === "" || description === "") {

        alert("Please fill all fields");
        return;
    }

    // PRIORITY COLORS
    let borderColor = "border-green-500";

    if (priority === "Medium Priority") {

        borderColor = "border-yellow-500";
    }

    if (priority === "High Priority") {

        borderColor = "border-red-500";
    }
    if (editingTask) {

    const updatedTask = {

        id: editingTask.id,

        title,
        description,
        priority,
        deadline,

        status: editingTask.status
    };


    fetch(`${API_URL}/${editingTask.id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedTask)

    })
    .then(() => {

        loadTasks();

        taskModal.classList.add("hidden");

        taskModal.classList.remove("flex");

        editingTask = null;
    });

    return;
}
    // CREATE CARD
const task = {

    title,
    description,
    priority,
    deadline,
    status: "TODO",
    user: {
        id: loggedInUser.id
    }
};
fetch(API_URL, {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(task)

})
.then(() => {

    // RELOAD TASKS
    loadTasks();


    // CLOSE MODAL
    taskModal.classList.add("hidden");

    taskModal.classList.remove("flex");


    // RESET FORM
    document.getElementById("taskTitle").value = "";

    document.getElementById("taskDescription").value = "";

    document.getElementById("taskPriority").value =
        "Low Priority";

    document.getElementById("taskDeadline").value = "";

});

});
function toggleEmptyState(container) {

    const emptyMessage =
        container.querySelector(".empty-message");

    const taskCards =
        container.querySelectorAll(".task-card");


    if (taskCards.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }
}
// UPDATE TASK COUNTS
function updateTaskCounts() {

    // COUNTS
    document.getElementById("todoCount").textContent =
        todoTasks.querySelectorAll(".task-card").length;

    document.getElementById("doingCount").textContent =
        doingTasks.querySelectorAll(".task-card").length;

    document.getElementById("doneCount").textContent =
        doneTasks.querySelectorAll(".task-card").length;


    // EMPTY STATES
    toggleEmptyState(todoTasks);

    toggleEmptyState(doingTasks);

    toggleEmptyState(doneTasks);
}
function updateTaskStatus(taskId, newStatus) {

    fetch(`${API_URL}/${taskId}`)
        .then(response => response.json())
        .then(task => {

            task.status = newStatus;

            return fetch(`${API_URL}/${taskId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(task)

            });

        })
        .then(() => {

            loadTasks();

        });
}
// SORTABLE TODO
new Sortable(todoTasks, {

    animation: 200,
    group: "tasks",

    ghostClass: "ghost-card",
    chosenClass: "chosen-card",
    dragClass: "drag-card",
    onEnd: function (evt) {

    updateTaskCounts();

    const taskId =
        evt.item.dataset.id;

    const newStatus =
        evt.to.dataset.status;

    updateTaskStatus(taskId, newStatus);
}

});


// SORTABLE DOING
new Sortable(doingTasks, {

    animation: 200,
    group: "tasks",

    ghostClass: "ghost-card",
    chosenClass: "chosen-card",
    dragClass: "drag-card",
    onEnd: function (evt) {

    updateTaskCounts();

    const taskId =
        evt.item.dataset.id;

    const newStatus =
        evt.to.dataset.status;

    updateTaskStatus(taskId, newStatus);
}

});


// SORTABLE DONE
new Sortable(doneTasks, {

    animation: 200,
    group: "tasks",

    ghostClass: "ghost-card",
    chosenClass: "chosen-card",
    dragClass: "drag-card",
    onEnd: function (evt) {

    updateTaskCounts();

    const taskId =
        evt.item.dataset.id;

    const newStatus =
        evt.to.dataset.status;

    updateTaskStatus(taskId, newStatus);
}

});

searchInput.addEventListener("input", () => {

    loadTasks();
});

priorityFilter.addEventListener("change", () => {

    loadTasks();
});
// INITIAL COUNT UPDATE
updateTaskCounts();
loadTasks();