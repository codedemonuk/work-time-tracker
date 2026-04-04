<div align="center">

# Work Time Tracker

[![Test, Build, Deploy](https://github.com/codedemonuk/work-time-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/codedemonuk/work-time-tracker/actions/workflows/ci.yml)

</div>

A simple web-based time tracking application for recording work periods and calculating total hours worked.

## How It Works

### Adding Work Periods

1. Select a **Date** using the date picker
2. Enter a **Start Time** (e.g., 09:00)
3. Enter an **End Time** (e.g., 17:00)
4. Click **Add Work Period** to add the entry to the table

> Note: End time must be after start time.

### Table Display

Each row shows:
- **Date** - When the work was performed
- **Start Time** - When the work period began
- **End Time** - When the work period ended
- **Hours Worked** - Duration calculated automatically
- **Action** - Delete button to remove the row

### Total Hours Calculation

The **Total Hours Worked** summary at the top automatically updates whenever you:
- Add a new work period
- Delete an existing row

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
