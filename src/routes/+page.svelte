<script lang="ts">
    import { formatDate, getNextWeekdayDate, calculateHours, calculateTotalHours, type TimeEntry } from '$lib/utils';

    let date = new Date().toISOString().split('T')[0];
    let startTime = '09:00';
    let endTime = '11:45';
    let entries: TimeEntry[] = [];
    let showTable = false;

    $: totalHours = calculateTotalHours(entries);

    function addEntry(): void {
        if (!date || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        entries = [...entries, {
            id: Date.now(),
            date,
            startTime,
            endTime,
            hours: calculateHours(date, startTime, endTime)
        }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        showTable = true;
        date = getNextWeekdayDate(date);
        startTime = '09:00';
        endTime = '11:45';
    }

    function deleteEntry(id: number): void {
        entries = entries.filter((entry: TimeEntry) => entry.id !== id);
        if (entries.length === 0) {
            showTable = false;
        }
    }

</script>

<svelte:head>
    <title>Work Time Tracker</title>
</svelte:head>

<div class="container">
    <h1>Work Time Tracker</h1>

    <div class="input-section">
        <div class="form-group">
            <div>
                <label for="date">Date</label>
                <input type="date" id="date" bind:value={date}>
            </div>
            <div>
                <label for="startTime">Start Time</label>
                <input type="time" id="startTime" bind:value={startTime}>
            </div>
            <div>
                <label for="endTime">End Time</label>
                <input type="time" id="endTime" bind:value={endTime}>
            </div>
        </div>
        <button on:click={addEntry}>Add Work Period</button>
    </div>

    <div class="summary-section">
        <div class="summary-label">Total Hours Worked</div>
        <div class="summary-value">{totalHours}</div>
    </div>

    <table id="timeTable" class:visible={showTable}>
        <thead>
            <tr>
                <th>Date</th>
                <th>Times</th>
                <th>Hours Worked</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {#each entries as entry (entry.id)}
                <tr>
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.startTime} ➡️ {entry.endTime}</td>
                    <td class="time-display">{entry.hours}</td>
                    <td><button class="delete-btn" on:click={() => deleteEntry(entry.id)}>Delete</button></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
