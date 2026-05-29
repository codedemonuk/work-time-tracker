<script lang="ts">
    import {
        formatDate,
        getNextWeekdayDate,
        calculateHours,
        calculateTotalHours,
        type TimeEntry,
        getFirstWeekdayOfMonth
    } from '$lib/utils';
    import { openDB, getAllEntries, addEntry as saveEntry, deleteEntry as removeEntry } from '$lib/db';
    import { onMount } from 'svelte';

    let date = getFirstWeekdayOfMonth(new Date());
    let startTime = '09:00';
    let endTime = '11:45';
    let entries: TimeEntry[] = [];
    let loading = true;

    async function loadEntries() {
        try {
            const dbEntries = await getAllEntries();
            entries = dbEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } catch (error) {
            console.error('Failed to load entries:', error);
        } finally {
            loading = false;
        }
    }

    $: showTable = entries.length > 0;
    $: totalHours = calculateTotalHours(entries);

    async function addEntry(): Promise<void> {
        if (!date || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        const newEntry: TimeEntry = {
            id: Date.now(),
            date,
            startTime,
            endTime,
            hours: calculateHours(date, startTime, endTime)
        };

        entries = [...entries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        try {
            await saveEntry(newEntry);
        } catch (error) {
            console.error('Failed to save entry:', error);
            alert('Failed to save entry');
            return;
        }

        date = getNextWeekdayDate(date);
        startTime = '09:00';
        endTime = '11:45';
    }

    async function deleteEntry(id: number): Promise<void> {
        entries = entries.filter((entry: TimeEntry) => entry.id !== id);

        try {
            await removeEntry(id);
        } catch (error) {
            console.error('Failed to delete entry:', error);
            alert('Failed to delete entry');
            loadEntries();
        }
    }

    onMount(() => {
        loadEntries();
    });

</script>

<svelte:head>
    <title>Work Time Tracker</title>
</svelte:head>

<div class="container">
    <h1>Work Time Tracker</h1>

    {#if loading}
        <p>Loading...</p>
    {:else}
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
    {/if}
</div>
