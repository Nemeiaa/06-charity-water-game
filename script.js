// Simple interactive story game for beginners

// Select the story, button, and progress bar elements
const storyDiv = document.querySelector('.story');
let choiceBtn = document.querySelector('.choice'); // let, so we can reassign after cloning
const progressBar = document.querySelector('.progress');
const progressFill = document.querySelector('.progress-fill');

// Create an inventory array to store items the player collects
let inventory = []; // This will hold strings like "water satchel"

// Define the story as an array of scenes
const scenes = [
    {
        text: `"Erzi... are you really sure?"`,
        choices: [
            {
                label: 'You know the answer, Ma.',
                action: () => {
                    // Don't fill progress bar at start
                    nextScene();
                }
            }
        ]
    },
    {
        text: `Opening the door, I squint my eyes- a sheet of humidity envelops my body as my eyes slowly adjust to the sun.`,
        choices: [
            {
                label: 'I walk outside.',
                // Go to the new "market" scene (index 2)
                action: () => nextScene(2)
            },
            {
                label: 'Wait...',
                action: () => {
                    // Add water satchel to inventory
                    if (!inventory.includes("water satchel")) {
                        inventory.push("water satchel");
                    }
                    nextScene(3); // Jump to the satchel scene (now index 3)
                }
            }
        ]
    },
    // New market scene
    {
        text: `My feet melt into the gritty sand a little with every step, encroaching into my barefeet sandals slowly. Looking up - blocking the sun with my hand - the hustle and bustle of the market district draws my attention.<br><br>Sighing in my head, I find slight anger at the me a few hours ago thinking finding a water source was just as easy as declaring I was gonna find one for us. What do I even do?`,
        choices: [
            {
                label: `"Money's everything, so..." - Ask around for jobs.`,
                action: () => {
                    // Fill 20% of progress bar after market scene
                    progressFill.style.width = '20%';
                    nextScene(8);
                }
            },
            {
                label: `"If people can build a village, surely..." - Hunt for scraps; if it doesn't exist, then make it.`,
                action: () => {
                    // Fill 20% of progress bar after market scene
                    progressFill.style.width = '20%';
                    nextScene(8);
                }
            }
        ]
    },
    // Satchel scene (now index 3)
    {
        text: `I go back inside, a sense of forgetfulness I dispel going into my room. I grab my water satchel, knowing I need it to stay hydrated in this heat.`,
        choices: [
            {
                label: 'Step outside again.',
                action: () => {
                    // Fill 20% of progress bar after satchel scene
                    progressFill.style.width = '20%';
                    nextScene(4);
                }
            }
        ]
    },
    {
        // Timer scene
        text: `
            <div class="timer-display timer-centered">Time left: 7</div>
            At the entrance to the market district, a man in a ripped t-shirt and jeans reaches for my sachel.<br><br>
            I: 
        `,
        choices: [
            {
                label: "Let him take it.",
                action: () => nextScene(5)
            },
            {
                label: "Run away.",
                action: () => nextScene(6)
            },
            {
                label: "Try to talk to him.",
                action: () => nextScene(7)
            }
        ],
        timer: 7, // seconds
        timerAction: () => nextScene(6) // If timer runs out, run away
    },
    {
        text: `You let him take it. Maybe he needs it more than you.`,
        choices: [
            {
                label: "Continue",
                action: () => nextScene(8)
            }
        ]
    },
    {
        text: `[Unwritten Scene - Will be added later]`,
        choices: [
            {
                label: "Continue",
                action: () => nextScene(8)
            }
        ]
    },
    {
        text: `[Unwritten Scene - Will be added later]`,
        choices: [
            {
                label: "Continue",
                action: () => nextScene(8)
            }
        ]
    },
    {
        text: `You made it to the end of the game prototype!`,
        choices: [
            {
                label: "Restart",
                action: () => resetGame()
            }
        ]
    }
];

// Track the current scene index
let currentScene = 0;
let timerId = null;
let intervalId = null;

// Helper function to fade in elements (for beginners, just show them)
function fadeInElements(elements) {
    elements.forEach(el => {
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
        el.style.opacity = '1';
    });
}

// Helper function to fade out elements
function fadeOutElements(elements, callback) {
    let finished = 0;
    elements.forEach(el => {
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
        el.style.opacity = '0';
        // Listen for transition end to call callback after all elements faded out
        el.addEventListener('transitionend', function handler() {
            el.removeEventListener('transitionend', handler);
            finished++;
            if (finished === elements.length && typeof callback === 'function') {
                callback();
            }
        });
    });
}

// Function to show a scene by index (with fade in)
function showScene(index) {
    // Clear any running timers
    if (timerId) clearTimeout(timerId);
    if (intervalId) clearInterval(intervalId);

    // Remove any special classes from storyDiv
    storyDiv.classList.remove('story-small-border');

    currentScene = index;
    const scene = scenes[index];

    // Show the story text (use innerHTML for formatting)
    storyDiv.innerHTML = scene.text;

    // Remove all choice buttons except the template one
    document.querySelectorAll('.choice').forEach(btn => {
        if (btn !== choiceBtn) btn.remove();
    });

    // Hide the template button for multi-choice scenes
    choiceBtn.style.display = 'none';

    // Add choice buttons
    scene.choices.forEach((choice, i) => {
        let btn;
        if (i === 0) {
            // Use the template button for the first choice
            btn = choiceBtn;
            btn.style.display = '';
        } else {
            btn = document.createElement('button');
            btn.className = 'choice';
            progressBar.parentNode.insertBefore(btn, progressBar);
        }
        btn.textContent = choice.label;
        // Remove previous click listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        // Add click event with fade-out/fade-in animation
        newBtn.addEventListener('click', () => {
            // For debugging: log inventory
            // console.log('Inventory:', inventory);
            // Fade out story, all choices, and progress bar before changing scene
            const allChoices = Array.from(document.querySelectorAll('.choice'));
            fadeOutElements([storyDiv, ...allChoices, progressBar], () => {
                // After fade out, perform the choice action (which calls nextScene or similar)
                choice.action();
                // Fade in new scene elements
                // Use setTimeout to ensure DOM updates before fade in
                setTimeout(() => {
                    const newChoices = Array.from(document.querySelectorAll('.choice'));
                    fadeInElements([storyDiv, ...newChoices, progressBar]);
                }, 10);
            });
        });
        // If first choice, update reference
        if (i === 0) choiceBtn = newBtn;
    });

    // Handle timer if present
    if (scene.timer) {
        const timerDisplay = storyDiv.querySelector('.timer-display');
        let timeLeft = scene.timer;
        if (timerDisplay) {
            timerDisplay.textContent = `Time left: ${timeLeft}`;
            intervalId = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Time left: ${timeLeft}`;
                if (timeLeft <= 0) {
                    clearInterval(intervalId);
                }
            }, 1000);
        }
        timerId = setTimeout(() => {
            // Fade out story, all choices, and progress bar before timer action
            const allChoices = Array.from(document.querySelectorAll('.choice'));
            fadeOutElements([storyDiv, ...allChoices, progressBar], () => {
                if (typeof scene.timerAction === 'function') {
                    scene.timerAction();
                    // Fade in new scene elements after timer action
                    setTimeout(() => {
                        const newChoices = Array.from(document.querySelectorAll('.choice'));
                        fadeInElements([storyDiv, ...newChoices, progressBar]);
                    }, 10);
                }
            });
        }, scene.timer * 1000);
    }
}

// Go to the next scene (or to a specific index)
function nextScene(forcedIndex) {
    let nextIndex = typeof forcedIndex === 'number' ? forcedIndex : currentScene + 1;
    // If at the end, loop to game over
    if (nextIndex >= scenes.length) {
        nextIndex = scenes.length - 1;
    }
    showScene(nextIndex);
}

// Reset the game to the first scene
function resetGame() {
    // Hide dropdown
    dropdownMenu.classList.remove('show');
    // Clear inventory and progress
    inventory = [];
    progressFill.classList.remove('show');
    progressFill.style.width = '0%'; // Reset progress bar fill
    // Remove any special classes from storyDiv
    storyDiv.classList.remove('story-small-border');
    // Show the first scene
    showScene(0);
}

// Dropdown menu logic
const menuBtn = document.querySelector('.menu');
const dropdownMenu = document.querySelector('.dropdown-menu');
const resetBtn = document.querySelector('.reset-btn');

menuBtn.addEventListener('click', function() {
    dropdownMenu.classList.toggle('show');
});
document.addEventListener('click', function(e) {
    if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});
resetBtn.addEventListener('click', resetGame);

// On page load, show the first scene
showScene(0);
// Add (GAME START) note to the first button if missing
if (!choiceBtn.querySelector('.game-start-note')) {
    const note = document.createElement('span');
    note.className = 'game-start-note';
    note.textContent = '(GAME START)';
    choiceBtn.appendChild(note);
}
fadeInElements([storyDiv, choiceBtn, progressBar]);
document.addEventListener('click', function(e) {
    if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Reset button logic: return to first scene
resetBtn.addEventListener('click', function() {
    // Hide dropdown
    dropdownMenu.classList.remove('show');

    // Reset inventory and progress
    inventory = [];
    progressFill.classList.remove('show');
    progressFill.style.width = '0%'; // Reset progress bar fill

    // Restore initial story and button
    storyDiv.innerHTML = `"Erzi... are you really sure?"`;
    choiceBtn.textContent = 'You know the answer, Ma.';
    // Restore the game start note if missing
    if (!choiceBtn.querySelector('.game-start-note')) {
        const note = document.createElement('span');
        note.className = 'game-start-note';
        note.textContent = '(GAME START)';
        choiceBtn.appendChild(note);
    }
    choiceBtn.style.display = '';
    // Remove any extra buttons
    document.querySelectorAll('.choice').forEach(btn => {
        if (btn !== choiceBtn) btn.remove();
    });

    // Remove any special classes from storyDiv
    storyDiv.classList.remove('story-small-border');

    // Fade in the main elements
    fadeInElements([storyDiv, choiceBtn, progressBar]);
});