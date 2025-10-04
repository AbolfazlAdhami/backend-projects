#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

// ANSI color codes
const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

// Path to the JSON file
const TASKS_FILE = path.join(process.cwd(), "tasks.json");

// Ensure tasks.json exists
async function initializeFile() {
  try {
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, JSON.stringify([]));
  }
}

// Read tasks from file
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(TASKS_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
}

// Write tasks to file
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Generate unique ID
function generateId(tasks) {
  return tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
}

// Format date
function getCurrentDate() {
  return new Date().toISOString();
}

// Format task status with color
function formatStatus(status) {
  switch (status) {
    case "todo":
      return `${COLORS.red}${status}${COLORS.reset}`;
    case "in-progress":
      return `${COLORS.yellow}${status}${COLORS.reset}`;
    case "done":
      return `${COLORS.green}${status}${COLORS.reset}`;
    default:
      return status;
  }
}

// Add a new task
async function addTask(description) {
  const tasks = await readTasks();
  const newTask = {
    id: generateId(tasks),
    description,
    status: "todo",
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  console.log(`${COLORS.green}Task added successfully (ID: ${newTask.id})${COLORS.reset}`);
}

// Update a task
async function updateTask(id, description) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) {
    console.error(`${COLORS.red}Error: Task not found${COLORS.reset}`);
    return;
  }
  task.description = description;
  task.updatedAt = getCurrentDate();
  await writeTasks(tasks);
  console.log(`${COLORS.green}Task updated successfully${COLORS.reset}`);
}

// Delete a task
async function deleteTask(id) {
  const tasks = await readTasks();
  const filteredTasks = tasks.filter((t) => t.id !== parseInt(id));
  if (filteredTasks.length === tasks.length) {
    console.error(`${COLORS.red}Error: Task not found${COLORS.reset}`);
    return;
  }
  await writeTasks(filteredTasks);
  console.log(`${COLORS.green}Task deleted successfully${COLORS.reset}`);
}

// Mark task status
async function markTask(id, status) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) {
    console.error(`${COLORS.red}Error: Task not found${COLORS.reset}`);
    return;
  }
  task.status = status;
  task.updatedAt = getCurrentDate();
  await writeTasks(tasks);
  console.log(`${COLORS.green}Task marked as ${formatStatus(status)}${COLORS.reset}`);
}

// List tasks
async function listTasks(status) {
  const tasks = await readTasks();
  let filteredTasks = tasks;

  if (status) {
    filteredTasks = tasks.filter((t) => t.status === status);
  }

  if (filteredTasks.length === 0) {
    console.log(`${COLORS.yellow}No tasks found${COLORS.reset}`);
    return;
  }

  console.log(`${COLORS.bold}${COLORS.cyan}Tasks:${COLORS.reset}`);
  filteredTasks.forEach((task) => {
    console.log(
      `${COLORS.bold}ID:${COLORS.reset} ${task.id}, ` +
        `${COLORS.bold}Description:${COLORS.reset} ${task.description}, ` +
        `${COLORS.bold}Status:${COLORS.reset} ${formatStatus(task.status)}, ` +
        `${COLORS.bold}Created:${COLORS.reset} ${task.createdAt}, ` +
        `${COLORS.bold}Updated:${COLORS.reset} ${task.updatedAt}`
    );
  });
}

// Main CLI handler
async function main() {
  await initializeFile();
  const args = process.argv.slice(2);
  const command = args[0];
  const id = args[1];
  const description = args.slice(1).join(" ");

  try {
    switch (command) {
      case "add":
        if (!description) {
          console.error(`${COLORS.red}Error: Description is required${COLORS.reset}`);
          return;
        }
        await addTask(description);
        break;

      case "update":
        if (!id || !description) {
          console.error(`${COLORS.red}Error: ID and description are required${COLORS.reset}`);
          return;
        }
        await updateTask(id, description);
        break;

      case "delete":
        if (!id) {
          console.error(`${COLORS.red}Error: ID is required${COLORS.reset}`);
          return;
        }
        await deleteTask(id);
        break;

      case "mark-in-progress":
        if (!id) {
          console.error(`${COLORS.red}Error: ID is required${COLORS.reset}`);
          return;
        }
        await markTask(id, "in-progress");
        break;

      case "mark-done":
        if (!id) {
          console.error(`${COLORS.red}Error: ID is required${COLORS.reset}`);
          return;
        }
        await markTask(id, "done");
        break;

      case "list":
        const status = args[1];
        if (status && !["done", "todo", "in-progress"].includes(status)) {
          console.error(`${COLORS.red}Error: Invalid status. Use "done", "todo", or "in-progress"${COLORS.reset}`);
          return;
        }
        await listTasks(status);
        break;

      default:
        console.error(
          `${COLORS.red}Usage:${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli add "Task description"${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli update <id> "New description"${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli delete <id>${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli mark-in-progress <id>${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli mark-done <id>${COLORS.reset}\n` +
            `  ${COLORS.blue}task-cli list [done|todo|in-progress]${COLORS.reset}`
        );
    }
  } catch (error) {
    console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
  }
}

main();
