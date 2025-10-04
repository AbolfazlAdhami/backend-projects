# Task Tracker CLI

A simple command-line interface (CLI) tool to manage tasks, built with Node.js. Tasks are stored in a JSON file in the current directory, and the tool supports adding, updating, deleting, and listing tasks with various statuses. Terminal output is styled with colors for better readability.

Sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh/).

## Requirements

- Node.js (version 14 or higher recommended)

## Installation

1. Save the `task-cli.js` file in your project directory.
2. Make the script executable (on Unix-like systems):
   ```bash
   chmod +x task-cli.js
   ```
3. Optionally, create a symbolic link to run it globally:
   ```bash
   sudo ln -s $(pwd)/task-cli.js /usr/local/bin/task-cli
   ```

## Usage

Run the commands using the `task-cli` command (or `node task-cli.js` if not linked globally). The tasks are stored in a `tasks.json` file in the current directory.

### Commands

- **Add a new task**:

  ```bash
  task-cli add "Buy groceries"
  ```

  Output: `Task added successfully (ID: 1)` (in green)

- **Update a task**:

  ```bash
  task-cli update 1 "Buy groceries and cook dinner"
  ```

  Output: `Task updated successfully` (in green)

- **Delete a task**:

  ```bash
  task-cli delete 1
  ```

  Output: `Task deleted successfully` (in green)

- **Mark a task as in-progress**:

  ```bash
  task-cli mark-in-progress 1
  ```

  Output: `Task marked as in-progress` (in green, with status in yellow)

- **Mark a task as done**:

  ```bash
  task-cli mark-done 1
  ```

  Output: `Task marked as done` (in green, with status in green)

- **List all tasks**:

  ```bash
  task-cli list
  ```

  Output: Lists all tasks with their ID, description, status (color-coded: red for todo, yellow for in-progress, green for done), createdAt, and updatedAt.

- **List tasks by status**:
  ```bash
  task-cli list done
  task-cli list todo
  task-cli list in-progress
  ```
  Output: Lists tasks filtered by the specified status with color-coded formatting.

## Task Properties

Each task stored in `tasks.json` has the following properties:

- `id`: Unique identifier for the task
- `description`: Short description of the task
- `status`: Status of the task (`todo`, `in-progress`, `done`)
- `createdAt`: ISO date string when the task was created
- `updatedAt`: ISO date string when the task was last updated

## Example `tasks.json`

```json
[
  {
    "id": 1,
    "description": "Buy groceries",
    "status": "todo",
    "createdAt": "2025-10-05T00:08:00.000Z",
    "updatedAt": "2025-10-05T00:08:00.000Z"
  }
]
```

## Output Styling

- Success messages are displayed in green.
- Error messages are displayed in red.
- Task statuses are color-coded:
  - `todo`: Red
  - `in-progress`: Yellow
  - `done`: Green
- Task listings use bold text for labels and cyan for the "Tasks" header.
- Usage instructions use blue for commands.

## Error Handling

The tool handles various edge cases:

- Missing arguments (e.g., no description for `add` or no ID for `delete`)
- Invalid task IDs
- Invalid status for listing tasks
- File system errors (e.g., creates `tasks.json` if it doesn't exist)

## Development

- Clone the repository or copy the `task-cli.js` file.
- Run `node task-cli.js <command>` to test the CLI.
- Ensure the script has write permissions in the directory to create/update `tasks.json`.

## Contributing

Feel free to submit issues or pull requests to improve the tool.

## License

MIT License
