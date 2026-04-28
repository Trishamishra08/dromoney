/**
 * Task Storage Service (Simulated Backend)
 * 
 * This utility handles saving and retrieving tasks and completions from LocalStorage.
 * When a real backend is ready, we only need to replace these functions with API calls.
 */

const TASKS_KEY = 'dromoney_tasks';
const COMPLETED_TASKS_KEY = 'dromoney_completed_tasks';

// Initial Mock Tasks (Exactly what client asked for)
const INITIAL_TASKS = [
    { 
        id: '1', 
        type: 'Web', 
        title: 'Visit Website Page', 
        description: 'Stay for 15s to earn coins.', 
        reward: 1, 
        icon: 'Monitor',
        config: { url: 'https://google.com', timer: 15 }
    },
    { 
        id: '2', 
        type: 'Video', 
        title: 'Watch Video Task', 
        description: 'Watch this short video to gain coins.', 
        reward: 1, 
        icon: 'Youtube',
        config: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', timer: 30 }
    },
    { 
        id: '3', 
        type: 'Quiz', 
        title: 'Simple Quiz Task', 
        description: 'Answer 1 question correctly.', 
        reward: 1, 
        icon: 'Lightbulb',
        config: { question: 'What is the color of the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Blue' }
    },
    { 
        id: '4', 
        type: 'Spin', 
        title: 'Spin Wheel Task', 
        description: 'Try your luck and win coins!', 
        reward: 1, 
        icon: 'Disc',
        config: { min: 1, max: 10 }
    },
    { 
        id: '5', 
        type: 'Memory', 
        title: 'Memory Master', 
        description: 'Match emoji pairs in a grid.', 
        reward: 1, 
        icon: 'Zap',
        config: { grid: 6 } 
    },
    { 
        id: '6', 
        type: 'Treasure', 
        title: 'Treasure Chest', 
        description: 'Pick the right box!', 
        reward: 1, 
        icon: 'Rocket',
        config: { boxes: 3 }
    },
    { 
        id: '7', 
        type: 'Tapper', 
        title: 'Speed Tapper', 
        description: 'Tap 25 times fast!', 
        reward: 1, 
        icon: 'Zap',
        config: { target: 25, duration: 10 }
    },
    { 
        id: '8', 
        type: 'Scratch', 
        title: 'Magic Scratch Card', 
        description: 'Rub to reveal hidden coins.', 
        reward: 1, 
        icon: 'Sparkles',
        config: { threshold: 80 }
    },
    { 
        id: '9', 
        type: 'Share', 
        title: 'Share Platform Task', 
        description: 'Share on WhatsApp / Social.', 
        reward: 1, 
        icon: 'MessageCircle',
        config: { url: 'https://dromoney.com', text: 'Hey, join Dromoney and start earning daily coins!' }
    },
    { 
        id: '10', 
        type: 'Proof', 
        title: 'Like & Follow Task', 
        description: 'Follow our page and upload proof.', 
        reward: 1, 
        icon: 'Instagram',
        config: { url: 'https://instagram.com', instructions: 'Go to the link, follow, and take a screenshot.' }
    }
];

export const taskStorage = {
    // Get all active tasks
    getTasks: () => {
        const stored = localStorage.getItem(TASKS_KEY);
        const currentTasks = stored ? JSON.parse(stored) : null;

        // Force update if tasks are missing or the list is old (less than 10 tasks)
        if (!currentTasks || currentTasks.length < 10) {
            localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
            return INITIAL_TASKS;
        }
        return currentTasks;
    },

    // Add a new task (Admin Side)
    saveTask: (task) => {
        const tasks = taskStorage.getTasks();
        const newTask = { 
            ...task, 
            id: Date.now().toString(),
            status: 'Active' 
        };
        const updated = [...tasks, newTask];
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
        return newTask;
    },

    // Delete a task (Admin Side)
    deleteTask: (id) => {
        const tasks = taskStorage.getTasks();
        const updated = tasks.filter(t => t.id !== id);
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    },

    // Update an existing task (Admin Side)
    updateTask: (id, updatedData) => {
        const tasks = taskStorage.getTasks();
        const updated = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    },

    // Mark task as completed for a user
    markComplete: (taskId) => {
        const completed = taskStorage.getCompletedTasks();
        if (!completed.includes(taskId)) {
            const updated = [...completed, taskId];
            localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updated));
        }
    },

    // Get list of completed task IDs
    getCompletedTasks: () => {
        const stored = localStorage.getItem(COMPLETED_TASKS_KEY);
        return stored ? JSON.parse(stored) : [];
    }
};
