document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const addRowButton = document.getElementById('addRow');
    const tableBody = document.getElementById('tableBody');
    const totalHoursDisplay = document.getElementById('totalHours');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

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

    // Delete row function
    window.deleteRow = function(button) {
        const row = button.closest('tr');
        row.remove();
        calculateTotalHours();
    };
});