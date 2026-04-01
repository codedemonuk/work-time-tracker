document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const addRowButton = document.getElementById('addRow');
    const tableBody = document.getElementById('tableBody');
    const totalHoursDisplay = document.getElementById('totalHours');

    // Set default date to today
    dateInput.value = new Date().toISOString().split('T')[0];

    // Add row to table
    addRowButton.addEventListener('click', function() {
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        // Validate inputs
        if (!date || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }

        // Validate time order
        if (startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        // Add row to table
        const hoursId = `hours-${Date.now()}`;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td data-raw-date="${date}">${formatDate(date)}</td>
            <td>${startTime}</td>
            <td>${endTime}</td>
            <td class="time-display" id="${hoursId}">0h 0m</td>
            <td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>
        `;

        tableBody.appendChild(newRow);

        // Show table with fade-in on first row
        const timeTable = document.getElementById('timeTable');
        if (!timeTable.classList.contains('visible')) {
            timeTable.classList.add('visible');
        }

        // Calculate hours for this row
        calculateHours(date, startTime, endTime, hoursId);

        // Set date to next weekday
        dateInput.value = getNextWeekdayDate(date);

        // Reset inputs to defaults
        startTimeInput.value = '09:00';
        endTimeInput.value = '11:45';

        // Recalculate total hours
        calculateTotalHours();
    });

    // Calculate hours for a single row
    function calculateHours(date, startTime, endTime, elementId) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById(elementId).textContent = `${hours}h ${minutes}m`;
    }

    // Calculate total hours
    function calculateTotalHours() {
        let totalMs = 0;

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const dateCell = row.querySelector('td[data-raw-date]');
            const startTimeCell = row.querySelector('td:nth-child(2)');
            const endTimeCell = row.querySelector('td:nth-child(3)');

            if (dateCell && startTimeCell && endTimeCell) {
                const rawDate = dateCell.getAttribute('data-raw-date');
                const startTime = startTimeCell.textContent;
                const endTime = endTimeCell.textContent;

                if (rawDate && startTime && endTime) {
                    const start = new Date(`${rawDate}T${startTime}`);
                    const end = new Date(`${rawDate}T${endTime}`);

                    totalMs += (end - start);
                }
            }
        });

        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

        totalHoursDisplay.textContent = `${hours}h ${minutes}m`;
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Helper function to get next weekday date (Monday-Friday) based on input date
    function getNextWeekdayDate(inputDateStr) {
        // Parse the input date string (YYYY-MM-DD format)
        const inputDate = new Date(inputDateStr);
        
        // Calculate the next day
        const nextDay = new Date(inputDate);
        nextDay.setDate(inputDate.getDate() + 1);
        
        // If it's a weekend, set to Monday of next week
        if (nextDay.getDay() === 0) { // Sunday
            nextDay.setDate(inputDate.getDate() + 6); // Add 6 days to get to Monday
        } else if (nextDay.getDay() === 6) { // Saturday
            nextDay.setDate(inputDate.getDate() + 2); // Add 2 days to get to Monday
        }
        
        // If it's already a weekday, set to the next weekday
        if (nextDay.getDay() >= 1 && nextDay.getDay() <= 5) { // Monday to Friday
            // If it's Friday, set to Monday of next week (next weekday)
            if (nextDay.getDay() === 5) {
                nextDay.setDate(inputDate.getDate() + 3); // Add 3 days to get to Monday
            }
        }
        
        // Format date as YYYY-MM-DD
        const year = nextDay.getFullYear();
        const month = String(nextDay.getMonth() + 1).padStart(2, '0');
        const day = String(nextDay.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Delete row function
    window.deleteRow = function(button) {
        const row = button.closest('tr');
        row.remove();
        calculateTotalHours();
    };
});