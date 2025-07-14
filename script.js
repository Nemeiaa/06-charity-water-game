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
    // Scene 0
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
    // Scene 1
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
    // Scene 2 - Market scene
    {
        text: `My feet grate against the gritty sand that encroaches into my sandals slowly with every step. Looking up - blocking the sun with my hand - the hustle and bustle of the market district draws my attention.<br><br>Sighing in my head, I find slight anger at the me a few hours ago thinking finding a good water source was just as easy as declaring I was gonna find one for us. What do I even do?`,
        choices: [
            {
                label: `"Money's everything, so..." - Ask around for jobs to afford a filter.`,
                action: () => {
                    // Fill 33% of progress bar after market scene
                    progressFill.style.width = '33%';
                    nextScene(9);
                }
            },
            {
                label: `"If people can build a village, surely..." - If it doesn't exist, then make it yourself.`,
                action: () => {
                    // Fill 33% of progress bar after market scene
                    progressFill.style.width = '33%';
                    nextScene(8);
                }
            }
        ]
    },
    // Scene 3 - Satchel scene
    {
        text: `I go back inside, a sense of forgetfulness I dispel going into my room. I grab my water satchel, knowing I need it to stay hydrated in this heat.`,
        choices: [
            {
                label: 'Step outside again.',
                action: () => {
                    // Fill 33% of progress bar after satchel scene
                    progressFill.style.width = '33%';
                    nextScene(4);
                }
            }
        ]
    },
    // Scene 4 - Timer scene
    {
        // Timer scene
        text: `
            <div class="timer-display timer-centered">Time left: 10</div>
            At the entrance to the market district, a man in a ripped t-shirt and jeans reaches for my sachel.<br><br>
            I: 
        `,
        choices: [
            {
                label: "Let him take it.",
                action: () => {
                    // Remove "water satchel" from inventory if it exists
                    const index = inventory.indexOf("water satchel");
                    if (index !== -1) {
                        inventory.splice(index, 1);
                    }
                    // Add "Ending A Key" to inventory
                    if (!inventory.includes("Ending A Key")) {
                        inventory.push("Ending A Key");
                    }
                    nextScene(5);
                }
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
        timer: 10, // seconds
        timerAction: () => nextScene(6) // If timer runs out, run away
    },
    // Scene 5
    {
        text: `I let him take it. Maybe he needs it more than me.`,
        choices: [
            {
                label: "I went on my way.",
                action: () => nextScene(2)
            }
        ]
    },
    // Scene 6
    {
        text: `After running what felt like half a mile, I put my hands on my knees to regain my breath.<br><br>
        "At least... to get through... today..."<br><br>I'll need this.`,
        choices: [
            {
                label: "I keep my satchel packaged tightly within my bag.",
                action: () => nextScene(2)
            }
        ]
    },
    // Scene 7
    {
        text: `His howl-like cries and (attempt at) persuasion came clear, but all in through one ear and out the other. I didn't understand a bit of what he was trying to say. I think he's some sort of engineer?`,
        choices: [
            {
                label: "I awkwardly walk away from him.",
                action: () => nextScene(2)
            }
        ]
    },
    // Scene 8
    {
        text: `The idea which I found to be a magnum opus soon extinguished its own flame when my thoughts continued to stop at a dead end.<br><br>It was on the verges of giving up when I simply... looked up. Of course. I should've realized it sooner. <br><br>Like a drooling dog that noticed a biscuit on the ground, my eyes traced the construction worker walking past me. Mom and I used to talk to him often. But more than that- knowledge! My walking pace sped up towards the only source of advice I could rely on.`,
        choices: [
            {
                label: "I told him about everything.",
                action: () => nextScene(10) 
            }
        ]
    },
    // Scene 9 - "Ask around for jobs." scene
    {
        text: `I asked around for jobs. To my luck, there were two places looking for part-time work:`,
        choices: [
            {
                label: "Nursery - sounds fun.",
                action: () => {
                    progressFill.style.width = '66%';
                    nextScene(14);
                }
            },
            {
                label: "Tech shop - 'wonder what work I'd even do here.",
                action: () => {
                    progressFill.style.width = '66%';
                    nextScene(15);
                }
            }
        ]
    },
    // Scene 10 - After "I told him about everything."
    {
        text: `He listened attentively, periodic head nods and all, and brought out a pen and paper. Like a robot whose performed the same function hundreds of times, he drew up a quick sketch of directions, places, necessary tools and the materials to make it happen.<br><br>The rising beating of my heart, the desire to get up and move reignited the fire in me.`,
        choices: [
            {
                label: "Time to get to work.",
                action: () => nextScene(11)
            }
        ]
    },
    // Scene 11
    {
        text: `With such a straightforward - and easier than expected - plan, there's no room for failure.<br><br>Which is where failure visited.<br><br>Going to several scrap shops, managing to let a few of them lend some tools, I followed the building instructions at home. I followed them! And nothing. Nothing's working. <i>ughhhhhhhh...</i>`,
        choices: [
            {
                label: "I try looking for the construction worker again.",
                // Lock this option if the player does not have "Ending A Key"
                locked: () => !inventory.includes("Ending A Key"),
                action: () => {
                    progressFill.style.width = '66%';
                    nextScene(12);
                }
            },
            {
                label: `Kick down the contraption you made - let's just try making money instead.`,
                action: () => {
                    progressFill.style.width = '66%';
                    nextScene(9);
                }
            }
        ]
    },
    // Scene 12 - Seeking the construction worker
    {
        text: `A slow start to my search soon became a slow middle, and then a slow end when I spent the rest of the day with no luck. Halfway through the search, I realized my mom should have his phone number, and when I went, she... didn't. have it. And I had to go all. the way. back. to the market district. Still to find nothing.<br><br>My sizzling skin disappeared along with the sunset, replaced with the gentle wind flow to pet my skin as if to console me. Sitting on the stairs to an empty lot, I emptily gaze at the blueprint. Despite being a rough draft, it specifies all the right things, and if you had any doubt, there were already sidenotes to clear them.<br><br>You know, I'm not even upset that I couldn't make it. It's that I have such a well crafted plan, not even thought up of by me, made by someone who didn't need to spend that time to help me, and I'm here, with no good news to report back.`,
        choices: [
            {
                label: `"Excuse me..." - I turn my head up to the man behind me.`,
                action: () => {
                    // Go to the next new scene (index 13)
                    nextScene(13);
                }
            }
        ]
    },
    // Scene 13 - Follow up to index 12
    {
        text: `To my surprise, a homeless came up to me, seeming to point at my blueprint. Wait.<br><br>Now that I get a good look at him, it's the same guy who took my satchel! Before I even take the time to look at his face, I spring up from the stairs I was sat and took a few steps back.<br><br>Even with rugged clothes, I can tell his complexion got a bit better. I guess the satchel did someth- okay, not the time to be thinking about that!<br><br>"What do you want!?"<br><br>And that's when he apologized and thanked me for the water, and explained. His experience as an engineer. That he has people to help too. That just like us all, he was unsatisfied with letting himself and those he love rot away without doing something about it. But in the reaches of a dead end, his health gave, and I happened to come across that this morning.<br><br>In a way, we seemed to be quite alike. His ambitions were definitely more grand than mine though.<br><br>His hand reaches out to me, promising to help me.`,
        choices: [
            {
                label: "I shake his hand.",
                action: () => {
                    progressFill.style.width = '100%';
                    // Add Ending A Completed to inventory
                    if (!inventory.includes("Ending A Completed")) {
                        inventory.push("Ending A Completed");
                    }
                    nextScene(20);
                }
            }
        ]
    },
    // Scene 14 - Nursery job
    {
        text: `...Thank you Ma.<br><br>I reflect on my own caretaker as I face the reality of what it's like to be one for work. But even then, my cheek muscles can't help curling in this unexplainable mix of happiness, love, and a bit of pride. If watching growth feels like this, I can't wait to have a kid myself.<br><br>Gently waving goodbye to a kid holding the hand of her parent, in the corner of my eye is another kid, whining to his parents. When I thought the parents were on the older side, I noticed my misunderstanding when I got a better look at them- they were just so thin I thought otherwise.<br><br>The parents seemed to almost be holding back tears as the kid beat on the back of the dad. The topic of discussion was drink- specifically, the lack thereof. I:`,
        choices: [
            {
                label: "Walk up to the family.",
                locked: () => !inventory.includes("water satchel"),
                action: () => nextScene(16)
            },
            {
                label: "Pray for their health.",
                action: () => nextScene(17)
            }
        ]
    },
    // Scene 15 - Tech shop job
    {
        text: `Starting work at a tech shop was not something I expected myself to be doing, but here I am.<br><br>The name "tech shop" made me think of working somewhere a bit more... cooler than I thought, but it felt more like a tiny little repair shop. Most of the customers were looking to trade anything for anything, or repair what they had. Almost no one came in looking to buy something from here. And for some reason, grandmas and grandpas looking for help on their cell phone troubles came in droves. My coworker was ignoring them all, so I went and helped them. (I don't know much tech but I'm at least confident enough for THIS...)<br><br>I turned to my coworker right after handing a phone back to a satisfied grandma.`,
        choices: [
            {
                label: `"Hey, why don't you come and help too?"`,
                action: () => nextScene(19)
            }
        ]
    },
    // Scene 16 - Walk up to the family
    {
        text: `With a strange sense of filial piety moving me forward despite not having any kids of my own, the family gave me a look of confusion when I suddenly stopped in front of them- well, to be specific, the kid. I crouched down, and started shuffling through my bag. Found it.<br><br>I handed him the water satchel, and only was able to notice because we were this close now how cracked and dry his lips were. His parents were silently watching the situation unfold.<br><br>I couldn't tell what was on his mind, but he paused, and the instant his eyes went wide-open, the satchel was swiftly gone from my hand. And before I knew it, he was chugging it.<br><br>Don't worry little guy, no one's gonna take this from you.`,
        choices: [
            {
                label: "Well, back to work.",
                action: () => {
                    // Remove water satchel from inventory if present
                    const index = inventory.indexOf("water satchel");
                    if (index !== -1) {
                        inventory.splice(index, 1);
                    }
                    nextScene(18);
                }
            }
        ]
    },
    // Scene 17 - Pray for their health
    {
        text: `The door to the nursery closes, and a luggage of weight lifts off my shoulders along with a long exhalation. I came in knowing the job would only be for today, but at the same level as my relief, a nonexistant weight tugged at my heart, which I hope would heal after a good nights rest.<br><br>"I wonder if that tech shop's still offering work..." `,
        choices: [
            {
                label: "Sleep, looking forward to starting work at the tech shop (hopefully.)",
                action: () => nextScene(15)
            }
        ]
    },
    // Scene 18 - After helping the family
    {
        text: `If making money was this easy I should've been doing this a loooong time ago. I don't know why, but the manager (and.. the entire staff?) seemed to really like me, so I got to keep working here. I really like the work too so that's a win-win. Seeing the kids getting just one more question right than they did yesterday, something about that is so incredible, even though I know its obvious.<br><br>Anyways, time to tell Ma the good news!`,
        choices: [
            {
                label: "I go home- ah, I don't think this smile is gonna come off my face.",
                action: () => {
                    progressFill.style.width = '100%';
                    // Add Ending B Completed to inventory
                    if (!inventory.includes("Ending B Completed")) {
                        inventory.push("Ending B Completed");
                    }
                    nextScene(20);
                }
            }
        ]
    },
    // Scene 19 - After tech shop job
    {
        text: `Luckily, I got to keep working here. I don't really like the guy I work with... but anything to get enough money. It wasn't the part-time I dreamed of, but I made a whole lot of (older) friends, who keep the work plentiful and the shift-time quick even when the shop is dead.<br><br>It's been months since I started this job, and soon, I'll get my next paycheck. I already called my mom's friend, and he's coming to build the water source, full payment upfront of course. Why he... or any other construction business won't allow payments over time is over my head, but we can finally get things moving now.`,
        choices: [
            {
                label: "I walk back home, paycheck clenched in my hand.",
                action: () => {
                    progressFill.style.width = '100%';
                    // Add Ending C Completed to inventory
                    if (!inventory.includes("Ending C Completed")) {
                        inventory.push("Ending C Completed");
                    }
                    nextScene(20);
                }
            }
        ]
    },
    // Scene 20 - End scene
    {
        text: `You reached the end! Thank you for playing.<br><br>
        If you want to donate to help with charity: water's mission to bring healthy water to all, click on the link below:<br>
        <a href="https://www.charitywater.org/?utm_source=adwords&utm_medium=paid-ppc&utm_campaign=donor-acq-usrow&utm_term=cBC_CW_G_PAID_PMAX_ALL_US+ROW_EVERGREEN&utm_content=performance_max&gad_source=1&gad_campaignid=21335452962&gbraid=0AAAAADNj5D_OWZn5WbWJhuOCS1DYKKOeZ&gclid=CjwKCAjwg7PDBhBxEiwAf1CVu16YPADyuJSLJfeNP_eXj6sH2y-NSGrdEZwAAJKHpaTPLZ9hBepOYxoC4GoQAvD_BwE" target="_blank" rel="noopener">charity: water - Donate</a>`,
        choices: [
            {
                label: "Start from the beginning",
                action: () => {
                    // Remove "Ending A Key" and "water satchel" from inventory if present
                    const endingAIndex = inventory.indexOf("Ending A Key");
                    if (endingAIndex !== -1) {
                        inventory.splice(endingAIndex, 1);
                    }
                    const satchelIndex = inventory.indexOf("water satchel");
                    if (satchelIndex !== -1) {
                        inventory.splice(satchelIndex, 1);
                    }
                    // Optionally remove all "Ending X Completed" keys if you want a clean restart:
                    // inventory = [];
                    resetGame();
                }
            }
        ]
    }
];

// Track the current scene index
let currentScene = 0;
let timerId = null;
let intervalId = null;

// Easy/Hint Mode state
let easyMode = false;

// Function to update menu highlight for easy mode
function updateEasyModeHighlight() {
    // Highlight the menu section if easy mode is on
    if (easyMode) {
        easyModeBtn.classList.add("active");
    } else {
        easyModeBtn.classList.remove("active");
    }
}

// Add Easy/Hint Mode button to the menu
const easyModeBtn = document.createElement('button');
easyModeBtn.textContent = "Easy/Hint Mode";
easyModeBtn.className = "easy-mode-btn";

// --- FIX: Insert Easy/Hint Mode button into the dropdown menu, not after resetBtn (which is outside the dropdown) ---
const dropdownMenu = document.querySelector('.dropdown-menu');
dropdownMenu.appendChild(easyModeBtn);

easyModeBtn.addEventListener('click', function() {
    easyMode = !easyMode;
    updateEasyModeHighlight();
    // Refresh the current scene to apply/remove hints and timer
    showScene(currentScene);
});

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
    let scene = scenes[index];

    // --- EASY MODE: Remove timer from scene 4 if enabled ---
    let sceneCopy = { ...scene };
    let storyHtml = sceneCopy.text;
    if (easyMode && index === 4) {
        // Remove timer and timerAction for this scene only
        sceneCopy = { ...scene, timer: undefined, timerAction: undefined };
        // Remove the timer display HTML from the story text using a simple replace
        storyHtml = sceneCopy.text.replace(/<div class="timer-display[^>]*">.*?<\/div>/, "");
    }

    // Show the story text (use innerHTML for formatting)
    storyDiv.innerHTML = storyHtml;

    // Remove all choice buttons except the template one
    document.querySelectorAll('.choice').forEach(btn => {
        if (btn !== choiceBtn) btn.remove();
    });

    // --- FIX: Always enable and clean up the template button before use ---
    choiceBtn.disabled = false;
    choiceBtn.classList.remove('disabled');
    while (choiceBtn.firstChild) {
        choiceBtn.removeChild(choiceBtn.firstChild);
    }

    choiceBtn.style.display = 'none';

    // Add choice buttons
    sceneCopy.choices.forEach((choice, i) => {
        let btn;
        if (i === 0) {
            btn = choiceBtn;
            btn.style.display = '';
        } else {
            btn = document.createElement('button');
            btn.className = 'choice';
            progressBar.parentNode.insertBefore(btn, progressBar);
        }
        btn.disabled = false;
        btn.classList.remove('disabled');
        while (btn.firstChild) {
            btn.removeChild(btn.firstChild);
        }
        btn.textContent = choice.label;

        // --- EASY MODE: Add yellow hint text for specific choices ONLY IF LOCKED ---
        // Scene 14, choice 1
        if (
            easyMode &&
            index === 14 &&
            i === 0 &&
            typeof choice.locked === 'function' &&
            choice.locked()
        ) {
            const hint = document.createElement('span');
            hint.textContent = " (Requires Erzi to have a water satchel.)";
            hint.style.color = "#FFC907";
            hint.style.marginLeft = "6px";
            btn.appendChild(hint);
        }
        // Scene 11, choice 1
        if (
            easyMode &&
            index === 11 &&
            i === 0 &&
            typeof choice.locked === 'function' &&
            choice.locked()
        ) {
            const hint = document.createElement('span');
            hint.textContent = " (Requires Erzi's water satchel to be stolen by the man in rugged clothing)";
            hint.style.color = "#FFC907";
            hint.style.marginLeft = "6px";
            btn.appendChild(hint);
        }

        // Check if this choice should be locked (disabled)
        if (typeof choice.locked === 'function' && choice.locked()) {
            btn.disabled = true;
            btn.classList.add('disabled');
            const lockMsg = document.createElement('span');
            lockMsg.textContent = "(LOCKED)";
            btn.appendChild(lockMsg);
        } else {
            // Remove previous click listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                // For debugging: log inventory
                // console.log('Inventory:', inventory);
                const allChoices = Array.from(document.querySelectorAll('.choice'));
                fadeOutElements([storyDiv, ...allChoices, progressBar], () => {
                    choice.action();
                    setTimeout(() => {
                        const newChoices = Array.from(document.querySelectorAll('.choice'));
                        fadeInElements([storyDiv, ...newChoices, progressBar]);
                    }, 10);
                });
            });
            if (i === 0) choiceBtn = newBtn;
        }
    });

    // --- EASY MODE: Don't run timer for scene 4 if easyMode is on ---
    if (sceneCopy.timer && !(easyMode && index === 4)) {
        const timerDisplay = storyDiv.querySelector('.timer-display');
        let timeLeft = sceneCopy.timer; // This will now be 10
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
            const allChoices = Array.from(document.querySelectorAll('.choice'));
            fadeOutElements([storyDiv, ...allChoices, progressBar], () => {
                if (typeof sceneCopy.timerAction === 'function') {
                    sceneCopy.timerAction();
                    setTimeout(() => {
                        const newChoices = Array.from(document.querySelectorAll('.choice'));
                        fadeInElements([storyDiv, ...newChoices, progressBar]);
                    }, 10);
                }
            });
        }, sceneCopy.timer * 1000); // This will now be 10 * 1000
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
    // Remove only "water satchel" and "Ending A Key" from inventory
    inventory = inventory.filter(item => item !== "water satchel" && item !== "Ending A Key");
    progressFill.classList.remove('show');
    progressFill.style.width = '0%'; // Reset progress bar fill
    // Remove any special classes from storyDiv
    storyDiv.classList.remove('story-small-border');
    // Show the first scene
    showScene(0);
}

// Dropdown menu logic
const menuBtn = document.querySelector('.menu');
// const dropdownMenu = document.querySelector('.dropdown-menu'); // already declared above
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
// Remove (GAME START) note logic
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
    // Remove (GAME START) note logic
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