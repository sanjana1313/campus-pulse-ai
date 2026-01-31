let tasks = JSON.parse(localStorage.getItem("lifeos_tasks")) || [];

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('planBtn').addEventListener('click', planToday);

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const category = document.getElementById('category').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

    if (!taskName) {
        alert('Please enter a task name.');
        return;
    }

    if (!deadline) {
        alert('Please select a deadline date.');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        category: category,
        deadline: deadline,
        priority: priority
    };

    tasks.push(task);
    localStorage.setItem("lifeos_tasks", JSON.stringify(tasks));
    renderTasks();
    clearForm();
}
function clearTasks() {
  localStorage.removeItem("lifeos_tasks");
  tasks = [];
  displayTasks();
}

function clearForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('category').value = 'Academic';
    document.getElementById('priority').value = 'Low';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    document.getElementById('result').classList.add('hidden');
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    taskCount.textContent = `(${tasks.length})`;

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message">No tasks added yet. Add your first task above!</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => {
        const categoryClass = task.category === 'Personal' ? 'personal' : '';
        const priorityClass = `priority-${task.priority.toLowerCase()}`;
        const formattedDate = new Date(task.deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <div class="task-item ${categoryClass}">
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-details">${task.category} | Due: ${formattedDate}</div>
                </div>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            </div>
        `;
    }).join('');
}

function planToday() {
    if (tasks.length === 0) {
        alert('Please add some tasks first before planning your day.');
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const priorityWeight = {
        'High': 3,
        'Medium': 2,
        'Low': 1
    };

    const scoredTasks = tasks.map(task => {
        const deadlineDate = new Date(task.deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        let urgencyScore;
        if (daysUntil <= 0) {
            urgencyScore = 10;
        } else if (daysUntil === 1) {
            urgencyScore = 8;
        } else if (daysUntil <= 3) {
            urgencyScore = 6;
        } else if (daysUntil <= 7) {
            urgencyScore = 4;
        } else {
            urgencyScore = 2;
        }

        const totalScore = urgencyScore + priorityWeight[task.priority];

        return {
            ...task,
            daysUntil: daysUntil,
            score: totalScore
        };
    });

    scoredTasks.sort((a, b) => b.score - a.score);

    const todayRecommended = scoredTasks.filter(task => task.daysUntil <= 3 || task.priority === 'High').slice(0, 5);

    displayResults(todayRecommended);
}

function displayResults(recommendedTasks) {
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const explanation = document.getElementById('explanation');
    const todayTasks = document.getElementById('todayTasks');

    resultTitle.textContent = "Today's Focus";
    explanation.textContent = "These tasks are most important today based on urgency and priority.";

    if (recommendedTasks.length === 0) {
        todayTasks.innerHTML = '<p class="no-tasks-today">No urgent tasks for today. Great job staying ahead!</p>';
    } else {
        todayTasks.innerHTML = recommendedTasks.map((task, index) => {
            const statusText = task.daysUntil <= 0 ? 'Overdue!' : 
                              task.daysUntil === 1 ? 'Due tomorrow' : 
                              `${task.daysUntil} days left`;

            return `
                <div class="today-task">
                    <div class="task-number">${index + 1}</div>
                    <div class="task-info">
                        <div class="task-name">${task.name}</div>
                        <div class="task-details">${task.category} | ${statusText} | ${task.priority} priority</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}
window.addEventListener("load", () => {
    renderTasks();
});
