# LifeOS AI

## Overview
A beginner-friendly hackathon project that works as a daily student life planner. Uses client-side JavaScript to manage tasks and provide AI-style daily planning recommendations.

## Features

### Phase 1: Task Input
- Add multiple tasks with name, category, deadline, and priority
- Tasks displayed in a visual list with color-coded priorities
- Delete tasks with one click
- Separate styling for Academic vs Personal tasks

### Phase 2: Daily Planning
- "What Should I Do Today?" analyzes all tasks
- Prioritizes by deadline proximity and priority level
- Shows top 5 recommended tasks for today
- AI-style explanation for recommendations

## Project Structure
- `index.html` - Main HTML structure with task form and list
- `style.css` - Modern styling with gradient design
- `script.js` - Task management and planning logic

## How It Works
Tasks are scored based on:
- **Urgency**: Days until deadline (overdue = 10pts, tomorrow = 8pts, etc.)
- **Priority**: High = 3pts, Medium = 2pts, Low = 1pt

Recommended tasks are those with:
- Deadline within 3 days, OR
- High priority level

## Running the Project
Click the Run button to start the web server. The app will be served on port 5000.
