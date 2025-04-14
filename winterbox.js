class Player {
    constructor() {
        this.name = "Tetus"

        //flags
        this.climbing_mountain_flag = false;
        this.inside_flag = true;
        this.fire_flag = false;
        this.active_button_flag = false;
        this.merchant_flag = false;
        this.full_moon_flag = false;
        this.sick_flag = false;
        this.cook_meat_flag = false;
        this.boiling_flag = false;
        this.boil_water_flag = false;
        this.boil_sinew_flag = false;
        this.trap_flag = false;
        this.hunt_favor = false;
        this.trap_favor = false;

        //time
        this.time_of_day = "Night";
        this.too_dark_to_see = true;

        //items
        this.icebox = false;
        this.bow_flag = false;
        this.icepick = false;
        this.flute_flag = false;
        this.satchel_flag = false;
        this.torch_flag = false;
        this.torch_durability = 5;

        this.cloak_flag = false;
        this.gloves_flag = false;
        this.coat_flag = false;
        this.longjohns_flag = false;
        this.snowboots_flag = false;

        //resources
        this.wood = 100;
        this.hides = 0;
        this.leather = 0;
        this.raw_meat = 0;
        this.meat = 5;
        this.buckets = 0;
        this.ice = 0;
        this.water = 5;
        this.sinew = 0;
        this.adhesive = 0;
        this.rope = 3;
        this.flint = 0;
        this.arrows = 0;
        this.snow_berries = 10;
        this.arctic_willow = 0;
        this.tonics = 0;
        this.traps = 0;

        //satchel resources
        this.satchel_weight = 0;
        this.satchel_wood = 0;
        this.satchel_hides = 0;
        this.satchel_meat = 0;
        this.satchel_snow_berries = 0;
        this.satchel_tonics = 0;
        this.satchel_water = 0;
        this.satchel_rope = 0;

        //status
        this.time_room_temperature = -1.5;
        this.room_temperature = -40;
        this.temperature = 45;
        this.cold_resist = 0;
        this.hunger = 100;
        this.thirst = 100;
        this.cabin_health = 0;
        this.cabin_health_temperature = 0;

        //misc
        this.girl_happiness = 0;
        this.girl_happiness_flag1 = false;
        this.girl_happiness_flag2 = false;
        this.girl_happiness_flag3 = false;
        this.girl_happiness_flag4 = false;
        this.girl_happiness_flag5 = false;
        this.girl_hunger = 100;
        this.girl_thirst = 100;
        this.strange_girl = false;
        this.girl_sick_flag = false;
        this.girl_flute_flag = false;
        this.girl_dead_flag = false;

        this.bow_durability = 10;
    }
}
let player = new Player(); // Global variable to store the instance

/////////////////////////////////////////
function DevButton() {
    console.log(player.torch_durability)
}

function DevButton2() {
    player.wood = 1000;
    player.hides = 1000;
    player.leather = 1000;
    player.raw_meat = 1000;
    player.meat = 1000;
    player.buckets = 1000;
    player.ice = 1000;
    player.water = 1000;
    player.sinew = 1000;
    player.adhesive = 1000;
    player.rope = 1000;
    player.flint = 1000;
    player.arrows = 1000;
    player.snow_berries = 1000;
    player.arctic_willow = 1000;
    player.tonics = 1000;
    player.traps = 1000;

    player.temperature = 100;
    player.room_temperature = 100;

    player.torch_flag = true;
    player.icebox = true;
    player.bow_flag = true;
    player.icepick = true;
    player.cloak_flag = true;
    player.gloves_flag = true;
    player.coat_flag = true;
    player.longjohns_flag = true;
    player.snowboots_flag = true;
    player.flute_flag = true;
    UpdateLabels();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*GAME LOGIC*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/////////////////////////////////////////
//GAME LOOP
let pause_flag = false;
let time = 0;
let score = 0;
let day = 1;
let lastUpdate = performance.now();
let timeAccumulator = 0; // Accumulator for deltaTime
let previousRoomTemperature = player.room_temperature;
let previousTemperature = player.temperature;
let previousHunger = player.hunger;
let previousThirst = player.thirst;
let previousCabin = player.cabin_health;
let previousGirlHunger = player.girl_hunger;
let previousGirlThirst = player.girl_thirst;

function gameLoop(timestamp) {
    if (!pause_flag) {
        let deltaTime = timestamp - lastUpdate;
        lastUpdate = timestamp;
        timeAccumulator += deltaTime;

        // Time Progression
        if (timeAccumulator >= 1000) {
            timeAccumulator -= 1000
            time += 1;
            score += 1;
            if (time === 60) {
                createScrollingText("Twilight brings a new dawn", "#eeeeee");
                player.time_of_day = "Dawn";
                player.time_room_temperature = -2;
                player.too_dark_to_see = false;
            } else if (time === 120) {
                createScrollingText("The sun shines on the snow and ice", "#eeeeee");
                player.time_of_day = "Noon";
                player.time_room_temperature = -1;
            } else if (time === 180) {
                createScrollingText("Dusk approaches", "#eeeeee");
                player.time_of_day = "Dusk";
                player.time_room_temperature = -2;
            } else if (time === 240) {
                createScrollingText("The sun has receded", "#eeeeee");
                player.time_of_day = "Night";
                player.time_room_temperature = -3;
                player.too_dark_to_see = true;
            } else if (time === 270) {
                RaiderCheck();
            } else if (time >= 300) { //also new day i.e. 0 time
                time = 0;
                day += 1;
                player.time_room_temperature = -1.5; //if changed, change in player init too
                createScrollingText("A new day has begun", "#eeeeee");
                DayChecker();
                let randomNum = getRandomInt(1, 2);
                if (randomNum === 1) {
                    SnowChecker();
                }
                if (randomNum === 2) {
                    RainChecker();
                }
            }

            // Vitality Decrease
            if (time % 6 === 0) player.hunger -= 1;
            if (time % 6 === 0) player.thirst -= 1;
            if (time % 30 === 0) player.cabin_health -= 1;
            if (player.strange_girl) {
                if (time % 6 === 0) player.girl_hunger -= 1;
                if (time % 6 === 0) player.girl_thirst -= 1;
            }
            if (time % 3 === 0 && !player.fire_flag) {
                if (player.time_of_day === "Night") {
                    player.room_temperature -= 20 + player.cabin_health_temperature;}
                else if (player.time_of_day === "Dawn") {
                    player.room_temperature -= 15 + player.cabin_health_temperature;}
                else if (player.time_of_day === "Noon") {
                    player.room_temperature -= 10 + player.cabin_health_temperature;}
                else if (player.time_of_day === "Dusk") {
                    player.room_temperature -= 15 + player.cabin_health_temperature;}
            }

            //toggle backgrounds
            if (time % 60 === 0) toggleBackground();

            //cabin health temp
            if (player.cabin_health >= 80) {
                player.cabin_health_temperature = 2;
            }
            else if (player.cabin_health >= 60) {
                player.cabin_health_temperature = 1.5;
            }
            else if (player.cabin_health >= 40) {
                player.cabin_health_temperature = 1;
            }
            else if (player.cabin_health >= 20) {
                player.cabin_health_temperature = 0.5;
            }
            else if (player.cabin_health >= 0) {
                player.cabin_health_temperature = 0;
            }

            // room temp
            if (player.inside_flag) {
                if (player.room_temperature > 90) {
                    player.temperature += 5 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > 75) {
                    player.temperature += 3.5 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > 60) {
                    player.temperature += 2.5 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > 40) {
                    player.temperature += 2 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > 20) {
                    player.temperature += 1 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > 0) {
                    player.temperature += 0.5 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else if (player.room_temperature > -20) {
                    player.temperature += -1.5 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                } else {
                    player.temperature += -3 + player.cold_resist + player.time_room_temperature + player.cabin_health_temperature;
                }
            }
            else {
                if (time >= 240) {
                    player.temperature -= 4 + player.cold_resist;  //20 to ~24/0
                }
                else if (time >= 180) {
                    player.temperature -= 3 + player.cold_resist; //15 to 20
                }
                else if (time >= 120) {
                    player.temperature -= 2 + player.cold_resist;  //10 to 15
                }
                else if (time >= 60) {
                    player.temperature -= 3 + player.cold_resist; //5 to 10
                }
                else if (time >= 0) {  //0 to ~5
                    player.temperature -= 5 + player.cold_resist;
                }
            }

            // Fire Mechanic
            if (fire_time > 0 && player.fire_flag) {
                fire_time--;
                console.log(`fire time ${fire_time}`)
                if (firelog_count === 1) {
                    player.room_temperature += 2;
                }
                else if (firelog_count === 2) {
                    player.room_temperature += 2.5;
                }
                else if (firelog_count === 3) {
                    player.room_temperature += 3;
                }
                else if (firelog_count === 4) {
                    player.room_temperature += 4;
                }
                else if (firelog_count === 5) {
                    player.room_temperature += 5;
                    CabinFire();
                }

                console.log(`log #: ${firelog_count}`)
                if (fire_time === 120) {
                    firelog_count -= 1;
                    createScrollingText("The fire is roaring", "#FFA500");
                }
                else if (fire_time === 90) {
                    firelog_count -= 1;
                    createScrollingText("The fire is hot", "#FFA500");
                }
                else if (fire_time === 60) {
                    firelog_count -= 1;
                    createScrollingText("The fire is weakening", "#FFA500");
                }
                else if (fire_time === 15) {
                    createScrollingText("The fire is almost out", "#FFA500");
                }
                if (fire_time <= 0) {
                    FireInactive();
                }
            }

            //random events for day time
            if (time === 90) {
                let randomNum = getRandomInt(1, 7);
                if (randomNum === 1) {
                    createScrollingText("A winter wren calls into the wild", "#FFA500");
                    let bird_ran = document.getElementById("bird_ran");
                    bird_ran.currentTime = 0;
                    bird_ran.play()
                }
                else if (randomNum === 2) {
                    createScrollingText("The cabin bares the weight of the ice", "#FFA500");
                    let woodcreak_ran = document.getElementById("woodcreak_ran");
                    woodcreak_ran.currentTime = 0;
                    woodcreak_ran.play()
                }
                else if (randomNum === 3) {
                    createScrollingText("Trees sway in the winter breeze", "#FFA500");
                    let rustling_trees_ran = document.getElementById("rustling_trees_ran");
                    rustling_trees_ran.currentTime = 0;
                    rustling_trees_ran.play()
                }
                else if (randomNum === 4) {
                    createScrollingText("Icicle's resonate along the cabin", "#FFA500");
                    let icicle_ran = document.getElementById("icicle_ran");
                    icicle_ran.currentTime = 0;
                    icicle_ran.play()
                }
                else if (randomNum === 5) {
                    createScrollingText("Something ruffles in the snow", "#FFA500");
                    let ruffle_snow_ran = document.getElementById("ruffle_snow_ran");
                    ruffle_snow_ran.currentTime = 0;
                    ruffle_snow_ran.play()
                }
                else if (randomNum === 6) {
                    createScrollingText("Something casted a shadow through the cabin window", "#FFA500");
                    let shadowed_sound_ran = document.getElementById("shadowed_sound_ran");
                    shadowed_sound_ran.currentTime = 0;
                    shadowed_sound_ran.play()
                }
                else if (randomNum === 7) {
                    createScrollingText("Some snow fell off the trees", "#FFA500");
                    let tree_snow_ran = document.getElementById("tree_snow_ran");
                    tree_snow_ran.currentTime = 0;
                    tree_snow_ran.play()
                }
            }

            //random events for night time
            if (time === 210) {
                let randomNum = getRandomInt(1, 8);
                if (randomNum === 1) {
                    createScrollingText("An owl calls into the approaching night", "#FFA500");
                    let owl_ran = document.getElementById("owl_ran");
                    owl_ran.currentTime = 0;
                    owl_ran.play()
                }
                else if (randomNum === 2) {
                    createScrollingText("Wolves howl into the tundra", "#FFA500");
                    let wolf_howl_ran = document.getElementById("wolf_howl_ran");
                    wolf_howl_ran.currentTime = 0;
                    wolf_howl_ran.play()
                }
                else if (randomNum === 3) {
                    createScrollingText("A bear is nearby", "#FFA500");
                    let bear_ran = document.getElementById("bear_ran");
                    bear_ran.currentTime = 0;
                    bear_ran.play()
                }
                else if (randomNum === 4) {
                    if (!player.full_moon_flag)
                        createScrollingText("A full moon illuminates the blanketed tundra", "#FFA500");
                        let full_moon_ran = document.getElementById("full_moon_ran");
                        full_moon_ran.currentTime = 0;
                        full_moon_ran.play()
                        player.full_moon_flag = true;
                }
                else if (randomNum === 5) {
                    createScrollingText("The Ursa Major constellation is high above", "#FFA500");
                    let constellation_ran = document.getElementById("constellation_ran");
                    constellation_ran.currentTime = 0;
                    constellation_ran.play()
                }
                else if (randomNum === 6) {
                    createScrollingText("The north star radiates in the sky", "#FFA500");
                    let north_star_ran = document.getElementById("north_star_ran");
                    north_star_ran.currentTime = 0;
                    north_star_ran.play()
                }
                else if (randomNum === 7) {
                    createScrollingText("A strange noise is heard outside the cabin", "#FFA500");
                    let strange_noise_ran = document.getElementById("strange_noise_ran");
                    strange_noise_ran.currentTime = 0;
                    strange_noise_ran.play()
                }
                else if (randomNum === 8) {
                    createScrollingText("An aurora rest in the distant sky", "#FFA500");
                    let aurora_ran = document.getElementById("aurora_ran");
                    aurora_ran.currentTime = 0;
                    aurora_ran.play()
                }
            }


            //flute randoms
            if (time === 150) {
                let randomNum = getRandomInt(1, 3);
                if (randomNum === 1) {
                    if (player.girl_flute_flag) {
                        let randomNum = getRandomInt(1, 3);
                        if (randomNum === 1) {
                            createScrollingText("Strange Girl breathes the heart of the forest into the flute", "#FFA500");
                            let girl_flute_1_sfx = document.getElementById("girl_flute_1_sfx");
                            girl_flute_1_sfx.currentTime = 0;
                            girl_flute_1_sfx.play()
                            }
                        else if (randomNum === 2) {
                            createScrollingText("Strange Girl's flute echoes into the tundra", "#FFA500");
                            let girl_flute_2_sfx = document.getElementById("girl_flute_2_sfx");
                            girl_flute_2_sfx.currentTime = 0;
                            girl_flute_2_sfx.play()
                            }
                        else if (randomNum === 3) {
                            createScrollingText("Strange Girl plays her flute into the night", "#FFA500");
                            let girl_flute_3_sfx = document.getElementById("girl_flute_3_sfx");
                            girl_flute_3_sfx.currentTime = 0;
                            girl_flute_3_sfx.play()
                            }
                        }
                    }
                }

            // Status Updates
            if (!player.climbing_mountain_flag) {
                RoomTemperatureText();
                CabinText();}
            TemperatureText();
            HungerText();
            ThirstText();
            UpdateLabels();
            VitalityCap();
            toggleBackground();
        }
    requestAnimationFrame(gameLoop);
    }
    else {
        console.log('paused')
    }
}
requestAnimationFrame(gameLoop);


/////////////////////////////////////////
function saveScoreToStorage() {
    // Retrieve existing scores from localStorage, or initialize an empty array if none exist
    let scores = JSON.parse(localStorage.getItem('gameScores')) || [];

    // Avoid appending the same score if it's already stored
    if (scores[scores.length - 1]?.score !== score) {
        // Add the player's name and score as an object
        const playerData = {
            name: player.name,  // Assuming the player's name is stored in player.name
            score: score
        };

        scores.push(playerData);  // Add the current player name and score
        localStorage.setItem('gameScores', JSON.stringify(scores)); // Save the updated list
    }
}

/////////////////////////////////////////
//FULL SCREEN
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

/////////////////////////////////////////
//PAUSE GAME

let pause_message = null; // Declare outside to persist across function calls
function PauseGame() {
    let button = document.getElementById("Pause-Button"); // Define button
    if (!pause_flag) {
        pause_flag = true;
        button.textContent = `Resume`;

        // Create the "PAUSED" message only once
        if (!pause_message) {
            pause_message = document.createElement("p");
            pause_message.textContent = "PAUSED";
            pause_message.style.position = "absolute";
            pause_message.style.top = "30%";
            pause_message.style.left = "50%";
            pause_message.style.transform = "translate(-50%, -50%)";
            pause_message.style.fontSize = "64px";
            pause_message.style.color = "#4ec1db";
            pause_message.style.fontFamily = "Arial, sans-serif";
            pause_message.style.textAlign = "center";
            pause_message.style.textShadow = "2px 2px 5px black";
            pause_message.style.zIndex = "999";
            document.body.appendChild(pause_message);
        }
    } else {
        pause_flag = false;
        button.textContent = `Pause`;

        // Remove the "PAUSED" message when unpausing
        if (pause_message) {
            pause_message.remove();
            pause_message = null; // Reset the reference
        }
        requestAnimationFrame(gameLoop);
    }
}

/////////////////////////////////////////
function RoomTemperatureText() {
    let room_temperatureText = document.getElementById("Room-Temperature");
    if (player.room_temperature <= -20) {
        room_temperatureText.style.color = "#c60000"; // Red
    } else if (player.room_temperature < 0) {
        room_temperatureText.style.color = "#4ec1db"; // Cyan
    } else if (player.room_temperature > 0) {
        room_temperatureText.style.color = "#FFA500"; // Orange
    }

    if (player.room_temperature < -40 && previousRoomTemperature >= -40 && previousRoomTemperature > -45) {
        createScrollingText("The cabin is as cold as the tundra", "#c60000");
    } else if (player.room_temperature < -20 && previousRoomTemperature >= -20) {
        createScrollingText("The cabin is fatally cold", "#4ec1db");
    } else if (player.room_temperature < 0 && previousRoomTemperature >= 0) {
        createScrollingText("The cabin is freezing", "#FFA500");
    } else if (player.room_temperature < 20 && previousRoomTemperature >= 20) {
        createScrollingText("The cabin is cold", "#FFA500");
    } else if (player.room_temperature < 40 && previousRoomTemperature >= 40) {
        createScrollingText("The cabin is mildly cold", "#FFA500");
    } else if (player.room_temperature < 60 && previousRoomTemperature >= 60) {
        createScrollingText("The cabin is warm", "#FFA500");
    } else if (player.room_temperature < 80 && previousRoomTemperature >= 80) {
        createScrollingText("The cabin is hot", "#FFA500");
    }
    previousRoomTemperature = player.room_temperature;
}

function TemperatureText() {
    let temperatureText = document.getElementById("Temperature");
    if (player.temperature <= -20) {
        temperatureText.style.color = "#c60000"; // Red
    } else if (player.temperature < 0) {
        temperatureText.style.color = "#4ec1db"; // Cyan
    } else if (player.temperature > 0) {
        temperatureText.style.color = "#FFA500"; // Orange
    }
    if (player.temperature <= -20 && previousTemperature > -20) {
        createScrollingText("You are freezing to death", "#c60000");
    } else if (player.temperature < 0 && previousTemperature >= 0) {
        createScrollingText("You are freezing", "#4ec1db");
    } else if (player.temperature < 20 && previousTemperature >= 20) {
        createScrollingText("You are cold", "#FFA500");
    } else if (player.temperature < 40 && previousTemperature >= 40) {
        createScrollingText("You are chilly", "#FFA500");
    } else if (player.temperature < 60 && previousTemperature >= 60) {
        createScrollingText("You are warm", "#FFA500");
    } else if (player.temperature < 80 && previousTemperature >= 80) {
        createScrollingText("You are hot", "#FFA500");
    }
    previousTemperature = player.temperature;
}

function HungerText() {
    let hungerText = document.getElementById("Hunger");
    if (player.hunger < 20) {
        hungerText.style.color = "#c60000"; // Red
    } else if (player.hunger < 40) {
        hungerText.style.color = "#4ec1db"; // Cyan
    } else if (player.hunger >= 40) {
        hungerText.style.color = "#FFA500"; // Orange
    }
    if (player.hunger <= 0 && previousHunger > 0) {
        createScrollingText("You are starving to death", "#c60000");
    } else if (player.hunger <= 20 && previousHunger > 20) {
        createScrollingText("You are very hungry", "#4ec1db");
    } else if (player.hunger <= 40 && previousHunger > 40) {
        createScrollingText("You are hungry", "#FFA500");
    } else if (player.hunger <= 60 && previousHunger > 60) {
        createScrollingText("You could still eat", "#FFA500");
    } else if (player.hunger <= 80 && previousHunger > 80) {
        createScrollingText("You are satisfied", "#FFA500");
    } else if (player.hunger > 80 && previousHunger <= 80) {
        createScrollingText("You are stuffed", "#FFA500");
    }
    previousHunger = player.hunger;

    if (player.girl_hunger < 20) {
        hungerText.style.color = "#c60000"; // Red
    } else if (player.girl_hunger < 40) {
        hungerText.style.color = "#4ec1db"; // Cyan
    } else if (player.girl_hunger >= 40) {
        hungerText.style.color = "#FFA500"; // Orange
    }
    if (player.girl_hunger <= 0 && previousGirlHunger > 0) {
        createScrollingText("Strange Girl is starving to death", "#c60000");
    } else if (player.girl_hunger <= 20 && previousGirlHunger > 20) {
        createScrollingText("Strange Girl is very hungry", "#4ec1db");
    } else if (player.girl_hunger <= 40 && previousGirlHunger > 40) {
        createScrollingText("Strange Girl is hungry", "#FFA500");
    } else if (player.girl_hunger <= 60 && previousGirlHunger > 60) {
        createScrollingText("Strange Girl could still eat", "#FFA500");
    } else if (player.girl_hunger <= 80 && previousGirlHunger > 80) {
        createScrollingText("Strange Girl is satisfied", "#FFA500");
    } else if (player.girl_hunger > 80 && previousGirlHunger <= 80) {
        createScrollingText("Strange Girl is stuffed", "#FFA500");
    }
    previousGirlHunger = player.girl_hunger;
}

function ThirstText() {
    let thirstText = document.getElementById("Thirst");
    if (player.thirst < 20) {
        thirstText.style.color = "#c60000"; // Red
    } else if (player.thirst < 40) {
        thirstText.style.color = "#4ec1db"; // Cyan
    } else if (player.thirst >= 40) {
        thirstText.style.color = "#FFA500"; // Orange
    }
    if (player.thirst <= 0 && previousThirst > 0) {
        createScrollingText("You are dying of dehydration", "#c60000");
    } else if (player.thirst <= 20 && previousThirst > 20) {
        createScrollingText("You are very thirsty", "#4ec1db");
    } else if (player.thirst <= 40 && previousThirst > 40) {
        createScrollingText("You are thirsty", "#FFA500");
    } else if (player.thirst <= 60 && previousThirst > 60) {
        createScrollingText("You could still drink", "#FFA500");
    } else if (player.thirst <= 80 && previousThirst > 80) {
        createScrollingText("You are hydrated", "#FFA500");
    } else if (player.thirst > 80 && previousThirst <= 80) {
        createScrollingText("You are very hydrated", "#FFA500");
    }
    previousThirst = player.thirst;

    if (player.girl_hunger < 20) {
        thirstText.style.color = "#c60000"; // Red
    } else if (player.girl_hunger < 40) {
        thirstText.style.color = "#4ec1db"; // Cyan
    } else if (player.girl_hunger >= 40) {
        thirstText.style.color = "#FFA500"; // Orange
    }
    if (player.girl_thirst <= 0 && previousGirlThirst > 0) {
        createScrollingText("Strange Girl is dying of dehydration", "#c60000");
    } else if (player.girl_thirst <= 20 && previousGirlThirst > 20) {
        createScrollingText("Strange Girl is very thirsty", "#4ec1db");
    } else if (player.girl_thirst <= 40 && previousGirlThirst > 40) {
        createScrollingText("Strange Girl is thirsty", "#FFA500");
    } else if (player.girl_thirst <= 60 && previousGirlThirst > 60) {
        createScrollingText("Strange Girl could still drink", "#FFA500");
    } else if (player.girl_thirst <= 80 && previousGirlThirst > 80) {
        createScrollingText("Strange Girl is hydrated", "#FFA500");
    } else if (player.girl_thirst > 80 && previousGirlThirst <= 80) {
        createScrollingText("Strange Girl is very hydrated", "#FFA500");
    }
    previousGirlThirst = player.girl_thirst;
}

function CabinText() {
    let thirstText = document.getElementById("Cabin");
    if (player.cabin_health < 20) {
        thirstText.style.color = "#c60000"; // Red
    } else if (player.cabin_health < 40) {
        thirstText.style.color = "#4ec1db"; // Cyan
    } else if (player.cabin_health >= 40) {
        thirstText.style.color = "#FFA500"; // Orange
    }
    if (player.cabin_health <= 0 && previousCabin > 0) {
        createScrollingText("The cabin is crumbling", "#c60000");
    } else if (player.cabin_health <= 20 && previousCabin > 20) {
        createScrollingText("The cabin is suffering the elements", "#4ec1db");
    } else if (player.cabin_health <= 40 && previousCabin > 40) {
        createScrollingText("The cabin is degrading", "#FFA500");
    } else if (player.cabin_health <= 60 && previousCabin > 60) {
        createScrollingText("The cabin is moderately stable", "#FFA500");
    } else if (player.cabin_health <= 80 && previousCabin > 80) {
        createScrollingText("The cabin is enduring the ice", "#FFA500");
    } else if (player.cabin_health > 80 && previousCabin <= 80) {
        createScrollingText("The cabin is well maintained", "#FFA500");
    }
    previousCabin = player.cabin_health;
}

/////////////////////////////////////////
function VitalityCap() {
    if (player.hunger >= 100) {
        player.hunger = 100;
    }
    if (player.hunger <= 0) {
        gameOverReason = "YOU STARVED TO DEATH"
        GameOver();
    }
    if (player.thirst >= 100) {
        player.thirst = 100;
    }
    if (player.thirst <= 0) {
        gameOverReason = "YOU DIED OF THIRST"
        GameOver();
    }
    if (player.room_temperature >= 100) {
        player.room_temperature = 100;
    }
    if (player.room_temperature <= -40) {
        player.room_temperature = -40;
    }
    if (player.temperature >= 100) {
        player.temperature = 100;
    }
    if (player.temperature <= -40) {
        gameOverReason = "YOU FROZE TO DEATH"
        GameOver();
    }
    if (player.cabin_health >= 100) {
        player.cabin_health = 100;
    }
    if (player.cabin_health <0) {
        player.cabin_health = 0;
    }
    if (player.girl_hunger >= 100) {
        player.girl_hunger = 100;
    }
    if (player.girl_thirst >= 100) {
        player.girl_thirst = 100;
    }
}

/////////////////////////////////////////
function UpdateLabels() { //+UPDATE
    // Use an object to map the IDs to player properties
    const labels = {
        "Wood": player.wood,
        "Hides": player.hides,
        "Leather": player.leather,
        "Raw-Meat": player.raw_meat,
        "Meat": player.meat,
        "Buckets": player.buckets,
        "Ice": player.ice,
        "Water": player.water,
        "Sinew": player.sinew,
        "Adhesive": player.adhesive,
        "Rope": player.rope,
        "Flint": player.flint,
        "Arrows": player.arrows,
        "Snow-Berries": player.snow_berries,
        "Arctic-Willow": player.arctic_willow,
        "Tonics": player.tonics,
        "Traps": player.traps,

        "Room-Temperature": `${player.room_temperature.toFixed(1)}°F`,
        "Temperature": `${player.temperature.toFixed(1)}°F`,
        "Time": `${player.time_of_day}`,
        "Day": `${day}`,

        "Hunger": `${player.hunger}%`,
        "Thirst": `${player.thirst}%`,
        "Cabin": `${player.cabin_health}%`,

        "Icebox": `${player.icebox}`,
        "Icepick": `${player.icepick}`,
        "Torch": `${player.torch_flag}`,

        "Bow": `${player.bow_flag}`,
        "Cloak": `${player.cloak_flag}`,
        "Gloves": `${player.gloves_flag}`,
        "Coat": `${player.coat_flag}`,
        "LongJohns": `${player.longjohns_flag}`,
        "SnowBoots": `${player.snowboots_flag}`,

        //dev
        "t": `${time}`,
    };

    const GirlmenuContainer = document.getElementById("girl-menu-container");
    if (GirlmenuContainer) {
        labels["Girl-Hunger"] = `${player.girl_hunger}%`;
        labels["Girl-Thirst"] = `${player.girl_thirst}%`;
    }

    const SatchelMenu = document.getElementById("satchelmenu");
    if (SatchelMenu) {
        labels["Satchel-Weight"] = `${player.satchel_weight}/20`;
        labels["Wood2"] = `${player.wood}`;
        labels["Satchel-Wood"] = `${player.satchel_wood}`;
        labels["Hides2"] = `${player.hides}`;
        labels["Satchel-Hides"] = `${player.satchel_hides}`;
        labels["Rope2"] = `${player.rope}`;
        labels["Satchel-Rope"] = `${player.satchel_rope}`;
        labels["Meat2"] = `${player.meat}`;
        labels["Satchel-Meat"] = `${player.satchel_meat}`;
        labels["Snow-Berries2"] = `${player.snow_berries}`;
        labels["Satchel-Snow-Berries"] = `${player.satchel_snow_berries}`;
        labels["Water2"] = `${player.water}`;
        labels["Satchel-Water"] = `${player.satchel_water}`;
    }

    const SatchelInventoryMenu = document.getElementById("satchelinventorymenu");
    if (SatchelInventoryMenu) {
        labels["Satchel-Wood2"] = `${player.satchel_wood}`;
        labels["Satchel-Hides2"] = `${player.satchel_hides}`;
        labels["Satchel-Rope2"] = `${player.satchel_rope}`;
        labels["Satchel-Meat2"] = `${player.satchel_meat}`;
        labels["Satchel-Snow-Berries2"] = `${player.satchel_snow_berries}`;
        labels["Satchel-Water2"] = `${player.satchel_water}`;
    }

    // Loop through the label IDs and update text content efficiently
    Object.entries(labels).forEach(([id, value]) => {
        document.getElementById(id).textContent = `${id}: ${value}`;
    });
}
UpdateLabels();

/////////////////////////////////////////
function toggleBackground() {
    const backgroundContainer = document.querySelector(".background");
    // Create a new background layer
    const newLayer = document.createElement("div");
    newLayer.classList.add("background", "fade-layer");

    // Determine the new background class
    let newClass = "";
    if (player.fire_flag && cabin_fire_flag) {
        newClass = "cabin-fire-background";
    } else if (player.fire_flag) {
        newClass = player.time_of_day.toLowerCase() + "-fire-background";
    } else {
        newClass = player.time_of_day.toLowerCase() + "-background";
    }

    newLayer.classList.add(newClass);
    newLayer.style.opacity = "0"; // Start invisible

    // Append new background layer
    document.body.appendChild(newLayer);

    // Fade in the new background
    requestAnimationFrame(() => {
        newLayer.style.opacity = "1";
    });

    // Remove old background after transition
    setTimeout(() => {
        const oldLayer = document.querySelector(".background:not(.fade-layer)");
        if (oldLayer) oldLayer.remove();
        newLayer.classList.remove("fade-layer"); // Remove transition class
    }, 3000); // Match transition duration
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PIXELS
const container = document.getElementById("pixel-container");

//fire and cabin burn embers
function createSingleBurnPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("burn-pixel");
    const randomTop = Math.random() * 90;
    const randomLeft = Math.random() * 90;
    pixel.style.top = `${randomTop}%`;
    pixel.style.left = `${randomLeft}%`
    pixel.style.animationDelay = `${-Math.random() * 3}s`; // Random delay to start with;
    container.appendChild(pixel);
}
function createFirePixels() {
    for (let i = 0; i < 25; i++) {
        createSingleBurnPixel();
    }
}
function createBurnPixels() {
    for (let i = 0; i < 100; i++) {
        createSingleBurnPixel();
    }
}
function deleteBurnPixels() {
    const pixels = document.querySelectorAll(".burn-pixel");
    pixels.forEach(pixel => pixel.remove());  // Remove each pixel element
}

//snow
function createSingleSnowPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("snow-pixel");
    const randomTop = Math.random() * 90;
    const randomLeft = Math.random() * 90;
    pixel.style.top = `${randomTop}%`;
    pixel.style.left = `${randomLeft}%`
    pixel.style.animationDelay = `${-Math.random() * 3}s`; // Random delay to start with;
    container.appendChild(pixel);
}
function createLightSnowPixels() {
    for (let i = 0; i < 50; i++) {
        createSingleSnowPixel();
    }
}
function createHeavySnowPixels() {
    for (let i = 0; i < 250; i++) {
        createSingleSnowPixel();
    }
}
function deleteSnowPixels() {
    const pixels = document.querySelectorAll(".snow-pixel");
    pixels.forEach(pixel => pixel.remove());  // Remove each pixel element
}

//rain
function createSingleRainPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("rain-pixel");
    const randomTop = Math.random() * 90;
    const randomLeft = Math.random() * 90;
    pixel.style.top = `${randomTop}%`;
    pixel.style.left = `${randomLeft}%`
    pixel.style.animationDelay = `${-Math.random() * 3}s`; // Random delay to start with;
    container.appendChild(pixel);
}
function createLightRainPixels() {
    for (let i = 0; i < 50; i++) {
        createSingleRainPixel();
    }
}
function createHeavyRainPixels() {
    for (let i = 0; i < 200; i++) {
        createSingleRainPixel();
    }
}
function deleteRainPixels() {
    const pixels = document.querySelectorAll(".rain-pixel");
    pixels.forEach(pixel => pixel.remove());  // Remove each pixel element
}

//wind
function createSingleWindPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("wind-pixel");
    const randomTop = Math.random() * 90;
    const randomLeft = Math.random() * 90;
    pixel.style.top = `${randomTop}%`;
    pixel.style.left = `${randomLeft}%`
    pixel.style.animationDelay = `${-Math.random() * 3}s`; // Random delay to start with;
    container.appendChild(pixel);
}
function createWindPixels() {
    for (let i = 0; i < 30; i++) {
        createSingleWindPixel();
    }
}
function deleteWindPixels() {
    const pixels = document.querySelectorAll(".wind-pixel");
    pixels.forEach(pixel => pixel.remove());  // Remove each pixel element
}

function clearAllPixels() {
    deleteBurnPixels();
    deleteSnowPixels();
    deleteRainPixels();
    deleteWindPixels();
}

/////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    triggerFadeIn();
});
let OpeningMessage = "CLIMB THE MOUNTAIN"; // Default message
function triggerFadeIn() {
    const fadeOverlay = document.getElementById("fade-overlay");
    fadeOverlay.style.transition = "none";
    fadeOverlay.style.opacity = "1";
    fadeOverlay.offsetHeight; // Force reflow
    setTimeout(() => {
        fadeOverlay.style.transition = "opacity 4s ease"; // Reapply transition
        fadeOverlay.style.opacity = "0"; // Start fading out
        const opening_message = document.createElement("p");
        opening_message.textContent = OpeningMessage;
        opening_message.style.position = "absolute";
        opening_message.style.top = "30%";
        opening_message.style.left = "50%";
        opening_message.style.transform = "translate(-50%, -50%)";
        opening_message.style.fontSize = "64px";
        opening_message.style.color = "#4ec1db";
        opening_message.style.fontFamily = "Arial, sans-serif";
        opening_message.style.textAlign = "center";
        opening_message.style.textShadow = "2px 2px 5px black";
        opening_message.style.opacity = "1"; // Ensure it's fully visible initially
        opening_message.style.transition = "opacity 3s ease"; // Fade-out transition
        opening_message.style.zIndex = "999";
        document.body.appendChild(opening_message);
        // **Fade out text after 2 seconds**
        setTimeout(() => {
            opening_message.style.opacity = "0";

            // **Remove message from DOM after fade-out completes (3s delay)**
            setTimeout(() => {
                opening_message.remove();
            }, 3000); // Wait for fade-out to finish before removing
        }, 2000); // Start fading after 2 seconds
    }, 50); // Slight delay to ensure effect is applied
}
triggerFadeIn();

function triggerFadeOut() {
    const fadeOverlay = document.getElementById("fade-overlay");
    fadeOverlay.style.opacity = 1; // First, fade the overlay
    const elements = document.body.children; // Apply fade-out to all elements on the page
    for (let element of elements) {
        element.classList.add("fade-out");
    }
    setTimeout(function() { // Wait for the fade to finish before clearing the page content
        document.body.innerHTML = ''; // Clear all elements
    }, 2000); // 2 seconds to match the fade-out duration
}

/////////////////////////////////////////
let gameOverReason = "YOU DIED"; //default
function GameOver() {
    triggerFadeOut();
    setTimeout(function() {
        const message = document.createElement("p");
        message.textContent = gameOverReason;
        message.style.position = "absolute";
        message.style.top = "30%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.fontSize = "64px";
        message.style.color = "#4ec1db";
        message.style.fontFamily = "Arial, sans-serif";
        message.style.textAlign = "center";
        message.style.textShadow = "2px 2px 5px black";

        const message2 = document.createElement("p");
        message2.textContent = `You survived ${day} days`;
        message2.style.position = "absolute";
        message2.style.top = "40%";
        message2.style.left = "50%";
        message2.style.transform = "translate(-50%, -50%)";
        message2.style.fontSize = "24px";
        message2.style.color = "#FFFFFF";
        message2.style.fontFamily = "Arial, sans-serif";
        message2.style.textAlign = "center";
        message2.style.textShadow = "2px 2px 5px black";

        const message3 = document.createElement("p");
        message3.textContent = "winterbox";
        message3.style.position = "absolute";
        message3.style.bottom = "10%";
        message3.style.left = "50%";
        message3.style.transform = "translate(-50%, -50%)";
        message3.style.fontSize = "24px";
        message3.style.color = "#FFA500";
        message3.style.fontFamily = "Arial, sans-serif";
        message3.style.textAlign = "center";
        message3.style.textShadow = "2px 2px 5px black";

        const restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        restartButton.style.position = "absolute";
        restartButton.style.top = "50%";
        restartButton.style.left = "50%";
        restartButton.style.transform = "translate(-50%, -50%)";
        restartButton.style.fontSize = "20px";
        restartButton.style.padding = "10px 20px";
        restartButton.style.cursor = "pointer";
        restartButton.style.background = "linear-gradient(to bottom, #111111, #555555)";
        restartButton.style.color = "#FFA500";
        restartButton.style.textShadow = "2px 2px 5px black";
        restartButton.style.border = "2px solid #777777";
        restartButton.style.borderRadius = "4px";

        const audioElement = document.createElement("audio");
        audioElement.id = "gameover_flute"; // Give it an ID
        audioElement.src = "audio/gameover_flute.wav"; // Set the source path
        audioElement.style.position = "absolute";
        audioElement.style.top = "10%"; // You can adjust the position as needed
        audioElement.style.left = "50%";
        audioElement.style.transform = "translate(-50%, -50%)";
        audioElement.style.width = "0"; // Optionally hide it visually, as it doesn't need to be shown
        audioElement.style.height = "0"; // Hide the player controls
        audioElement.autoplay = true; // Control when it plays
        audioElement.loop = false; // Disable looping if needed

        restartButton.addEventListener("click", function() {
            location.reload(); // Reload the page to restart
            score = 0;
        });

        document.body.appendChild(audioElement);
        document.body.appendChild(message);
        document.body.appendChild(message2);
        document.body.appendChild(message3);
        document.body.appendChild(restartButton);
        saveScoreToStorage();
    }, 2000); // Delay by 2000 milliseconds (2 seconds) to match the fade duration
}


function GameWin() {
    triggerFadeOut();
    setTimeout(function() {
        // Create the game over message
        const message = document.createElement("p");
        message.textContent = "YOU CLIMBED THE MOUNTAIN";
        message.style.position = "absolute";
        message.style.top = "30%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.fontSize = "64px";
        message.style.color = "#FFA500";
        message.style.fontFamily = "Arial, sans-serif";
        message.style.textAlign = "center";
        message.style.textShadow = "2px 2px 5px black";

        const message2 = document.createElement("p");
        message2.textContent = `You survived ${day} days`;
        message2.style.position = "absolute";
        message2.style.top = "40%";
        message2.style.left = "50%";
        message2.style.transform = "translate(-50%, -50%)";
        message2.style.fontSize = "24px";
        message2.style.color = "#FFFFFF";
        message2.style.fontFamily = "Arial, sans-serif";
        message2.style.textAlign = "center";
        message2.style.textShadow = "2px 2px 5px black";

        const message3 = document.createElement("p");
        message3.textContent = "winterbox";
        message3.style.position = "absolute";
        message3.style.bottom = "10%";
        message3.style.left = "50%";
        message3.style.transform = "translate(-50%, -50%)";
        message3.style.fontSize = "24px";
        message3.style.color = "#FFA500";
        message3.style.fontFamily = "Arial, sans-serif";
        message3.style.textAlign = "center";
        message3.style.textShadow = "2px 2px 5px black";

        const audioElement = document.createElement("audio");
        audioElement.id = "gameover_flute"; // Give it an ID
        audioElement.src = "audio/gameover_flute.wav"; // Set the source path
        audioElement.style.position = "absolute";
        audioElement.style.top = "10%"; // You can adjust the position as needed
        audioElement.style.left = "50%";
        audioElement.style.transform = "translate(-50%, -50%)";
        audioElement.style.width = "0"; // Optionally hide it visually, as it doesn't need to be shown
        audioElement.style.height = "0"; // Hide the player controls
        audioElement.autoplay = true; // Control when it plays
        audioElement.loop = false; // Disable looping if needed

        document.body.appendChild(audioElement);
        document.body.appendChild(message);
        document.body.appendChild(message2);
        document.body.appendChild(message3);
        saveScoreToStorage();
    }, 2000); // Delay by 2000 milliseconds (2 seconds) to match the fade duration
}

/////////////////////////////////////////
function InitializeStuff() {
    let gamestart_flute = document.getElementById("gamestart_flute");
    gamestart_flute.currentTime = 0;
    gamestart_flute.play()
    createScrollingText("You found an old, abandoned cabin...", "#FFA500");
    setTimeout(function() {
        createScrollingText("There appears to be an axe, a shovel, and a wood pile here", "#FFA500");
    }, 2000);
    setTimeout(function() {
        createScrollingText("Winter begins...", "#4ec1db");
    }, 4000);
}
InitializeStuff()

/////////////////////////////////////////
function fadeOutAudio(audioElement, duration) {
    let fadeInterval = setInterval(function() {
        if (audioElement.volume > 0) {
            audioElement.volume = Math.max(audioElement.volume - 0.2, 0); // Prevent volume from going below 0
        } else {
            clearInterval(fadeInterval); // Stop the interval once volume reaches 0
            audioElement.pause();        // Pause the audio
            audioElement.currentTime = 0; // Reset the audio to the beginning (optional)
            audioElement.volume = 1;
        }
    }, duration / 5); // This will run 5 times during the fade (adjust for smoother effect)
}

/////////////////////////////////////////
//TORCH
function TorchChecker() {
    if (player.time_of_day === "Night") {
        if (player.torch_flag) {
            if (player.torch_durability <= 0) {
                player.torch_flag = false;
                createScrollingText("Your torch has extinguished and is no longer usable", "#4ec1db");
            }
        }
    }
}

/////////////////////////////////////////
function DayChecker() {
    if (day === 3) {
        if (player.strange_girl === false && !player.girl_dead_flag) {
            StrangeGirl()}
    }
    if (day === 10) {
        createScrollingText("Frost has covered the landscape", "#4ec1db");
    }
    if (day === 20) {
        createScrollingText("Winds chill your blood and bones", "#4ec1db");
    }
    if (day === 30) {
        createScrollingText("Snow and ice blankets the province", "#4ec1db");
    }
    if (day === 40) {
        createScrollingText("The brutality of winter is setting in", "#4ec1db");
    }
    if (day === 45) {
        createScrollingText("Halfway through winter...", "#4ec1db");
    }
    if (day === 50) {
        createScrollingText("The land has become a tundra", "#4ec1db");
    }
    if (day === 60) {
        createScrollingText("The forest is silent", "#4ec1db");
    }
    if (day === 70) {
        createScrollingText("All things are frozen and covered", "#4ec1db");
    }
    if (day === 80) {
        createScrollingText("Winter is almost over...", "#4ec1db");
    }
    if (day === 90) {
        createScrollingText("WINTERBOX", "#4ec1db");
    }
}

let snowing_flag = false;
let raining_flag = false;
let wind_flag = false;
rain_sfx.pause();
wind_sfx.pause();

function toggleWeather(currentFlag, createWeatherEffect, deleteWeatherEffect, message) {
    if (currentFlag) {
        clearAllPixels();
        WeatherAudioManager();
        return false; // Turn off the weather
    } else {
        clearAllPixels();
        createWeatherEffect();
        createScrollingText(message, "#4ec1db");
        WeatherAudioManager();
        return true; // Turn on the weather
    }
}

function SnowChecker() {
    snowing_flag = toggleWeather(
        snowing_flag,
        () => {
            raining_flag = false;
            wind_flag = false;
            getRandomInt(1, 2) === 1 ? createLightSnowPixels() : createHeavySnowPixels();
        },
        deleteSnowPixels,
        "It's snowing"
    );
}

function RainChecker() {
    // Update the flag and immediately call WeatherAudioManager
    raining_flag = toggleWeather(
        raining_flag,
        () => {
            snowing_flag = false;
            wind_flag = false;
            getRandomInt(1, 2) === 1 ? createLightRainPixels() : createHeavyRainPixels();
        },
        deleteRainPixels,
        "It's raining"
    );
    WeatherAudioManager();  // Directly call after updating the flag
}

function WindChecker() {
    wind_flag = toggleWeather(
        wind_flag,
        () => {
            snowing_flag = false;
            raining_flag = false;
            createWindPixels();
        },
        deleteWindPixels,
        "Wind is blowing"
    );
    WeatherAudioManager();
}

function WeatherAudioManager() {
    let rain_sfx = document.getElementById("rain_sfx");
    let wind_sfx = document.getElementById("wind_sfx");

    // Play rain sound immediately when raining_flag is true
    if (raining_flag) {
        if (rain_sfx) {
            rain_sfx.currentTime = 0;
            rain_sfx.loop = true;
            rain_sfx.play();  // Play the sound immediately when the flag is true
        }
    } else {
        if (rain_sfx) {
            rain_sfx.pause();  // Pause the sound when the flag is false
        }
    }
    if (wind_flag) {
        if (wind_sfx) {
            wind_sfx.currentTime = 0;
            wind_sfx.loop = true;
            wind_sfx.play();  // Play the sound immediately when the flag is true
        }
    } else {
        if (wind_sfx) {
            wind_sfx.pause();  // Pause the sound when the flag is false
        }
    }
}


/////////////////////////////////////////
function ButtonDelay(button) {
    button.disabled = true;
    setTimeout(function() {
        button.disabled = false;
    }, 160);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*BUTTON FUNCTIONS*/

//INVENTORY
function toggleInventoryMenu() {
    const inventorymenu = document.getElementById("inventorymenu");
    inventorymenu.classList.toggle("show");  // Toggle the 'show' class to open/close the submenu
}

//EQUIPMENT
function toggleEquipmentMenu() {
    const equipmentmenu = document.getElementById("equipmentmenu");
    equipmentmenu.classList.toggle("show");  // Toggle the 'show' class to open/close the submenu
}

//CRAFTING
function toggleCraftMenu() {
    if (!player.active_button_flag) {
        const craftmenu = document.getElementById("craftmenu");
        craftmenu.classList.toggle("show");  // Toggle the 'show' class to open/close the submenu
    }
}

function CraftArrows() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.wood >= 10 && player.flint >= 2) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Arrows");
            let timer = 5;
            button.textContent = `Crafting arrows... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting arrows... (${timer}s)`;
                if (timer <= 0) {
                    player.wood -= 10;
                    player.flint -= 2;
                    player.arrows += 2;
                    createScrollingText("Crafted some arrows", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Arrows (x2)<br>x10 Wood, x2 Flint`;
                }
            }, 1000);
        }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}


function CraftBucket() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.wood >= 10) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Bucket");
            let timer = 5;
            button.textContent = `Crafting a bucket... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting a bucket... (${timer}s)`;
                if (timer <= 0) {
                    player.wood -= 10;
                    player.buckets += 1;
                    createScrollingText("Crafted a bucket", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Bucket (x1)<br>x10 Wood`;
                }
            }, 1000);
        }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftRope() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.sinew >= 2) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Rope");
            let timer = 5;
            button.textContent = `Crafting rope... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting rope... (${timer}s)`;
                if (timer <= 0) {
                    player.sinew -= 2;
                    player.rope += 1;
                    createScrollingText("Crafted some rope", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Rope<br>x2 Sinew`;
                    }
                }, 1000);
            }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftTonic() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.arctic_willow >= 5 && player.water >= 1) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Tonic");
            let timer = 5;
            button.textContent = `Crafting tonic... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting tonic... (${timer}s)`;
                if (timer <= 0) {
                    player.arctic_willow -= 5;
                    player.water -= 1;
                    player.tonics += 1;
                    createScrollingText("Crafted a tonic", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Tonic<br>x5 Arctic Willow, x1 Water`;
                }
            }, 1000);
        }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftLeather() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.hides >= 2) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Leather");
            let timer = 10;
            button.textContent = `Crafting leather... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting leather... (${timer}s)`;
                if (timer <= 0) {
                    player.hides -= 2;
                    player.leather += 1;
                    createScrollingText("Crafted leather", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Leather(x1)<br>x2 Hides`;
                }
            }, 1000);
        }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftTraps() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (player.wood >= 20 && player.rope >= 1) {
            let craft_start_sfx = document.getElementById("craft_start_sfx");
            craft_start_sfx.currentTime = 0;
            craft_start_sfx.play();
            const button = document.getElementById("Craft-Traps");
            let timer = 10;
            button.textContent = `Crafting a trap... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Crafting a trap... (${timer}s)`;
                if (timer <= 0) {
                    player.wood -= 20;
                    player.rope -= 1;
                    player.traps += 1;
                    createScrollingText("Crafted a trap", "#2eff00");
                    UpdateLabels();
                    let crafting_sfx = document.getElementById("crafting_sfx");
                    crafting_sfx.currentTime = 0;
                    crafting_sfx.play();
                    clearInterval(interval);
                    player.active_button_flag = false;
                    button.innerHTML = `Trap (x1)<br>x20 Wood, x1 Rope`;
                }
            }, 1000);
        }
        else {
            createScrollingText("Not enough materials", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftTorch() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.torch_flag) {
            if (player.wood >= 30) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Torch");
                let timer = 10;
                button.textContent = `Crafting a torch... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting a torch... (${timer}s)`;
                    if (timer <= 0) {
                        player.wood -= 30;
                        player.torch_flag = true;
                        player.torch_durability = 5;
                        createScrollingText("Crafted a torch", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Torch<br>x30 Wood`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a torch", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftFlute() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.flute_flag) {
            if (player.wood >= 30) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Flute");
                let timer = 30;
                button.textContent = `Crafting a flute... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting a flute... (${timer}s)`;
                    if (timer <= 0) {
                        player.wood -= 30;
                        player.flute_flag = true;
                        createScrollingText("Crafted a flute", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Flute<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a flute", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftBow() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.bow_flag) {
            if (player.wood >= 30 && player.sinew >= 2) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Bow");
                let timer = 30;
                button.textContent = `Crafting bow... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting bow... (${timer}s)`;
                    if (timer <= 0) {
                        player.wood -= 30;
                        player.sinew -= 2;
                        player.bow_flag = true;
                        createScrollingText("Crafted a bow", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Bow<br>x30 Wood, x2 Sinew`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a bow", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftIcebox() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.icebox) {
            if (player.wood >= 30 && player.leather >= 5) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Icebox");
                let timer = 30;
                button.textContent = `Crafting icebox... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting icebox... (${timer}s)`;
                    if (timer <= 0) {
                        player.wood -= 30;
                        player.leather -= 5;
                        player.icebox = true;
                        createScrollingText("Crafted an icebox", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Icebox<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have an icebox", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftCloak() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.cloak_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Cloak");
                let timer = 30;
                button.textContent = `Crafting a cloak... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting a cloak... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.cloak_flag = true;
                        player.cold_resist += 0.4;
                        createScrollingText("Crafted a cloak", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Cloak<br>Crafted`;

                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a cloak", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftGloves() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.gloves_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Gloves");
                let timer = 30;
                button.textContent = `Crafting gloves... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting gloves... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.gloves_flag = true;
                        player.cold_resist += 0.4;
                        createScrollingText("Crafted some gloves", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Gloves<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have some gloves", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftCoat() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.coat_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Coat");
                let timer = 30;
                button.textContent = `Crafting a coat... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting a coat... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.coat_flag = true;
                        player.cold_resist += 0.4;
                        createScrollingText("Crafted a coat", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Coat<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a coat", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftLongJohns() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.longjohns_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-LongJohns");
                let timer = 30;
                button.textContent = `Crafting long johns... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting long johns... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.longjohns_flag = true;
                        player.cold_resist += 0.4;
                        createScrollingText("Crafted some long johns", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Long Johns<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have some long johns", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftSnowBoots() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.snowboots_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-SnowBoots");
                let timer = 30;
                button.textContent = `Crafting snow boots... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting snow boots... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.snowboots_flag = true;
                        player.cold_resist += 0.4;
                        createScrollingText("Crafted some snow boots", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Snow Boots<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have some snow boots", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}

function CraftSatchel() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        if (!player.satchel_flag) {
            if (player.leather >= 10) {
                let craft_start_sfx = document.getElementById("craft_start_sfx");
                craft_start_sfx.currentTime = 0;
                craft_start_sfx.play();
                const button = document.getElementById("Craft-Satchel");
                let timer = 30;
                button.textContent = `Crafting a satchel... (${timer}s)`;
                const interval = setInterval(function() {
                    timer--;
                    button.textContent = `Crafting a satchel... (${timer}s)`;
                    if (timer <= 0) {
                        player.leather -= 10;
                        player.satchel_flag = true;
                        createScrollingText("Crafted a satchel", "#2eff00");
                        UpdateLabels();
                        let crafting_sfx = document.getElementById("crafting_sfx");
                        crafting_sfx.currentTime = 0;
                        crafting_sfx.play();
                        clearInterval(interval);
                        player.active_button_flag = false;
                        button.innerHTML = `Satchel<br>Crafted`;
                    }
                }, 1000);
            }
            else {
                createScrollingText("Not enough materials", "#4ec1db");
                player.active_button_flag = false;
            }
        }
        else {
            createScrollingText("You already have a satchel", "#4ec1db");
            player.active_button_flag = false;
        }
    }
}


/////////////////////////////////////////
function CutWood() {
    if (!player.active_button_flag) {
        if (!player.too_dark_to_see || player.torch_flag) {
            player.active_button_flag = true;
            player.inside_flag = false;
            createScrollingText("You went outside to cut wood...", "#FFA500");
            let wood_sfx = document.getElementById("wood_sfx");
            wood_sfx.currentTime = 0;
            wood_sfx.play();
            const button = document.getElementById("Cut-Wood");
            let timer = getRandomInt(4, 8);
            button.textContent = `Cutting wood... (${timer}s)`;
            const interval = setInterval(function() {
                timer--;
                button.textContent = `Cutting wood... (${timer}s)`;
                if (timer <= 0) {
                    player.wood += 10;
                    let randomNum = getRandomInt(1, 6);
                    if (randomNum === 1) {
                        player.hunger -= 2;
                    } else if (randomNum === 2) {
                        player.thirst -= 2;
                    }
                    if (player.torch_flag) {
                        player.torch_durability -= 1;
                        TorchChecker();
                    }
                    UpdateLabels();
                    createScrollingText("Gathered wood", "#FFA500");
                    let wood_chop_sfx = document.getElementById("wood_chop_sfx");
                    wood_chop_sfx.currentTime = 0;
                    wood_chop_sfx.play();
                    clearInterval(interval);
                    button.textContent = "Cut Wood";
                    player.active_button_flag = false;
                    player.inside_flag = true;
                }
            }, 1000);
        }
        else {
            createScrollingText("It's too dark outside to cut wood...", "#4ec1db");
        }
    }
}

/////////////////////////////////////////
//FIRE
let firelog_count = 0
let fire_time = 0
let fireTimeout = null;
function FireActive() {
    if (!player.fire_flag) {
        let match_sfx = document.getElementById("match_sfx");
        match_sfx.currentTime = 0;
        match_sfx.play();
    }
    player.fire_flag = true;
    toggleBackground();
    let fire1_sfx = document.getElementById("fire1_sfx");
    if (fire1_sfx.paused) { // Only play if it"s paused (i.e., hasn"t been played yet)
        fire1_sfx.currentTime = 0; // Reset to start
        fire1_sfx.loop = true; // Ensure it loops while fire is active
        fire1_sfx.play();
    }
}

function FireInactive() {
    createScrollingText("The fire went out", "#4ec1db");
    const button = document.getElementById("Stoke-Fire");
    button.textContent = `Start Fire`;
    firelog_count = 0
    player.fire_flag = false;
    StopCooking;
    StopBoiling();
    deleteBurnPixels();
    toggleBackground();
    fadeOutAudio(fire1_sfx, 1000); // 1000ms = 1 second fade
}

function StokeFire() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        const button = document.getElementById("Stoke-Fire");
        ButtonDelay(button);
        if (player.wood < 30) {
            createScrollingText("Not enough wood", "#4ec1db");
            player.active_button_flag = false;
            return;
        }
        if (firelog_count >= 5) {
            firelog_count = 5;
            player.wood -= 30;
            fire_time = 120;
            createScrollingText("Fire stoked", "#FFA500");
            player.active_button_flag = false;
            UpdateLabels();
            return;
        }
        if (firelog_count <= 0) {
            createScrollingText("Fire started", "#FFA500");
            button.textContent = `Stoke Fire`;
        }
        else {
            createScrollingText("Fire stoked", "#FFA500");
        }
        player.wood -= 30;
        firelog_count += 1
        clearAllPixels();
        createFirePixels();
        if (firelog_count === 1) {
            fire_time = 60
        }
        else if (firelog_count === 2) {
            fire_time = 90
        }
        else if (firelog_count >= 3) {
            fire_time = 120
        }
        if (!player.fire_flag) {
            FireActive();    // Start the fire
        }
        else {
            let stoke_fire_sfx = document.getElementById("stoke_fire_sfx");
            stoke_fire_sfx.currentTime = 0;
            stoke_fire_sfx.play();
        }
        UpdateLabels();
        player.active_button_flag = false;
    }
}

function ExterminateFire() {
    if (!player.active_button_flag) {
        if (!player.fire_flag) {
            createScrollingText("No fire to put out", "#4ec1db");
            return;
        }
        if (player.water >= 1) {
            let randomNum = getRandomInt(1, 5);
            if (randomNum === 1) {
                deleteBurnPixels();
                cabin_fire_flag = false;
                player.water -= 1;
                FireInactive();
                let fire_extinguish_sfx = document.getElementById("fire_extinguish_sfx");
                fire_extinguish_sfx.currentTime = 0;
                fire_extinguish_sfx.play();
            }
            else {
                player.water -= 1;
                createScrollingText("Threw water on the fire but it is still burning", "#4ec1db");
            }
        }
        else {
            createScrollingText("No water to put the fire out with", "#4ec1db");
        }
        UpdateLabels();
    }
}


let cabin_fire_timer = 15;
let cabin_fire_flag = false;
function CabinFire() {
    if (getRandomInt(1, 10) === 1 && !cabin_fire_flag) {
        cabin_fire_flag = true;
        toggleBackground();
        createBurnPixels();
        createScrollingText("The cabin is on fire", "#c60000");
        let fireInterval = setInterval(() => {
            player.cabin_health -= 5;
            if (!player.fire_flag) {
                clearInterval(fireInterval);
                return;
            }
            console.log(`cabin fire timer: ${cabin_fire_timer}`)
            if (--cabin_fire_timer <= 0 && player.fire_flag) {
                clearInterval(fireInterval);
                gameOverReason = "THE CABIN BURNED DOWN"
                GameOver();
            }
            if (cabin_fire_timer === 10) {
                createScrollingText("The cabin is burning rapidly", "#c60000");
            }
            if (cabin_fire_timer === 5) {
                createScrollingText("The cabin is almost burnt to the ground...", "#c60000");
            }
        }, 1000);
    }
}

function RepairCabin() {
    if (!player.active_button_flag) {
        if (player.cabin_health < 100) {
            player.active_button_flag = true;
            const button = document.getElementById("RepairCabin");
            let timer = getRandomInt(10, 20);
            if (player.wood >= 10 && player.adhesive >= 2) {
                createScrollingText("You went outside to repair the cabin...", "#FFA500");
                button.textContent = `Repairing cabin... (${timer}s)`;
                let repair_cabin_start_sfx = document.getElementById("repair_cabin_start_sfx");
                repair_cabin_start_sfx.currentTime = 0;
                repair_cabin_start_sfx.play();
                const interval = setInterval(function () {
                    timer--;
                    button.textContent = `Repairing cabin... (${timer}s)`;
                    if (timer <= 0) {
                        clearInterval(interval); // Stop the countdown
                        player.cabin_health += 10;
                        createScrollingText("You made some repairs to the cabin", "#FFA500");
                        let repair_cabin_finish_sfx = document.getElementById("repair_cabin_finish_sfx");
                        repair_cabin_finish_sfx.currentTime = 0;
                        repair_cabin_finish_sfx.play();
                        UpdateLabels();
                        button.textContent = "Repair Cabin"; // Reset button text
                        player.active_button_flag = false;
                    }
                }, 1000);
            } else if (player.wood < 10) {
                createScrollingText("You don't have enough wood", "#4ec1db");
                player.active_button_flag = false;
            } else if (player.adhesive < 2) {
                createScrollingText("You don't have enough adhesive", "#4ec1db");
                player.active_button_flag = false;
            }
        } else {
            createScrollingText("The cabin does not require repairs", "#FFA500");
        }
    }
}


let cook_meat_interval; // Global variable for interval
let cook_meat_timer = 0; // Global timer
function CookMeat() {
    if (!player.active_button_flag) {
        if (player.fire_flag) {
            if (player.raw_meat >= 1) {
                player.cook_meat_flag = true;
                player.raw_meat -= 1;
                document.getElementById("cook-meat-container").style.display = "block";
                createScrollingText("The pan begins heating in the fire", "#FFA500");
                let cookmeat_start_sfx = document.getElementById("cookmeat_start_sfx");
                cookmeat_start_sfx.currentTime = 0;
                cookmeat_start_sfx.play();
                let button = document.getElementById("Cook-Meat");
                cook_meat_timer = 0; // Use global variable
                button.textContent = `Cooking... (${cook_meat_timer}s)`;
                let cookmeat_sfx = document.getElementById("cookmeat_sfx");
                cookmeat_sfx.currentTime = 0;
                cookmeat_sfx.play();
                clearInterval(cook_meat_interval);
                cook_meat_interval = setInterval(function() {
                    cook_meat_timer++;
                    button.textContent = `Cooking... (${cook_meat_timer}s)`;
                    if (cook_meat_timer >= 20) {
                        cookmeat_sfx.pause();
                        clearInterval(cook_meat_interval);
                        createScrollingText("The meat burnt to a crisp", "#4ec1db");
                        button.textContent = "Cook Meat";
                        document.getElementById("cook-meat-container").style.display = "none"; // Hide when done
                        UpdateLabels();
                        let cookmeat_fail_sfx = document.getElementById("cookmeat_fail_sfx");
                        cookmeat_fail_sfx.currentTime = 0;
                        cookmeat_fail_sfx.play();
                        player.cook_meat_flag = false;
                    } else if (cook_meat_timer === 15) {
                        createScrollingText("The pan is sizzling", "#FFA500");
                    } else if (cook_meat_timer === 10) {
                        createScrollingText("The pan is getting hotter", "#FFA500");
                    }
                    else if (cook_meat_timer === 5) {
                        createScrollingText("The pan is warming up", "#FFA500");
                    }
                }, 1000);
            } else {
                createScrollingText("You have no raw meat to cook", "#4ec1db");
            }
        } else {
            createScrollingText("A fire is needed to cook meat", "#4ec1db");
        }
    }
}

function StopCooking() {
    if (!player.active_button_flag) {
        if (player.cook_meat_flag) {
            if (cook_meat_timer >= 15 && cook_meat_timer < 20) {
                player.meat += 1;
                player.buckets -= 1;
                createScrollingText("You take the cooked meat", "#FFA500");
            }
            else if (cook_meat_timer < 15 && cook_meat_timer > 10) {
                createScrollingText("You took the pot off and tossed the uncooked meat", "#FFA500");
            }
            else if (cook_meat_timer < 10) {
                player.raw_meat += 1;
                createScrollingText("You took the pot off the fire and retrieved the meat", "#FFA500");
            }
            cookmeat_sfx.pause();
            let stop_boiling_sfx = document.getElementById("stop_boiling_sfx"); //uses water stop-boiling for general purpose pan sound
            stop_boiling_sfx.currentTime = 0;
            stop_boiling_sfx.play();
            clearInterval(cook_meat_interval); // Properly stops the interval
            document.getElementById("boilwater_sfx").pause(); // Pause sound
            let button = document.getElementById("Cook-Meat");
            button.textContent = "Cook Meat";
            cook_meat_timer = 0; // Reset timer
            document.getElementById("cook-meat-container").style.display = "none"; // Hide UI
            player.cook_meat_flag = false;
        }
    }
}


function BoilMenu() {
    document.getElementById("boil-water-container").style.display = "block";
}

let boil_interval; // Global variable for interval
let boil_timer = 0; // Global timer
function BoilWater() {
    if (!player.active_button_flag) {
        if (player.fire_flag) {
            player.boiling_water_flag = true;
            if (player.ice >= 1) {
                player.boiling_flag = true;
                player.ice -= 1;
                createScrollingText("The ice pot begins heating in the fire", "#FFA500");
                let boilwater_start_sfx = document.getElementById("boilwater_start_sfx");
                boilwater_start_sfx.currentTime = 0;
                boilwater_start_sfx.play();
                let button = document.getElementById("Boil-Water");
                boil_timer = 0; // Use global variable
                button.textContent = `Boiling... (${boil_timer}s)`;
                let boilwater_sfx = document.getElementById("boilwater_sfx");
                boilwater_sfx.currentTime = 0;
                boilwater_sfx.play();
                clearInterval(boil_interval);
                boil_interval = setInterval(function() {
                    boil_timer++;
                    button.textContent = `Boiling... (${boil_timer}s)`;
                    if (boil_timer >= 20) {
                        boilwater_sfx.pause();
                        clearInterval(boil_interval);
                        createScrollingText("The water evaporated from the pot", "#4ec1db");
                        button.textContent = "Boil Water";
                        document.getElementById("boil-water-container").style.display = "none"; // Hide when done
                        UpdateLabels();
                        let boilwater_fail_sfx = document.getElementById("boilwater_fail_sfx");
                        boilwater_fail_sfx.currentTime = 0;
                        boilwater_fail_sfx.play();
                        player.boiling_flag = false;
                    } else if (boil_timer === 15) {
                        createScrollingText("The water is boiling", "#FFA500");
                    } else if (boil_timer === 10) {
                        createScrollingText("The pot is getting hotter", "#FFA500");
                    }
                    else if (boil_timer === 5) {
                        createScrollingText("The ice is beginning to melt", "#FFA500");
                    }
                }, 1000); // Fixed curly brace
            } else {
                createScrollingText("You have no ice to melt", "#4ec1db");
            }
        } else {
            createScrollingText("A fire is needed to boil water", "#4ec1db");
        }
    }
}

function BoilSinew() {
    if (!player.active_button_flag) {
        if (player.fire_flag) {
            player.boiling_sinew_flag = true;
            if (player.sinew >= 1) {
                player.boiling_flag = true;
                player.sinew -= 1;
                createScrollingText("The pot of sinew begins heating in the fire", "#FFA500");
                let boilwater_start_sfx = document.getElementById("boilwater_start_sfx");
                boilwater_start_sfx.currentTime = 0;
                boilwater_start_sfx.play();
                let button = document.getElementById("Boil-Sinew");
                boil_timer = 0; // Use global variable
                button.textContent = `Boiling... (${boil_timer}s)`;
                let boilwater_sfx = document.getElementById("boilwater_sfx");
                boilwater_sfx.currentTime = 0;
                boilwater_sfx.play();
                clearInterval(boil_interval);
                boil_interval = setInterval(function() {
                    boil_timer++;
                    button.textContent = `Boiling... (${boil_timer}s)`;
                    if (boil_timer >= 20) {
                        boilwater_sfx.pause();
                        clearInterval(boil_interval);
                        createScrollingText("The sinew became too brittle and fell apart", "#4ec1db");
                        button.textContent = "Boil Sinew";
                        document.getElementById("boil-water-container").style.display = "none"; // Hide when done
                        UpdateLabels();
                        let boilwater_fail_sfx = document.getElementById("boilwater_fail_sfx");
                        boilwater_fail_sfx.currentTime = 0;
                        boilwater_fail_sfx.play();
                        player.boiling_flag = false;
                    } else if (boil_timer === 15) {
                        createScrollingText("The sinew is sticky", "#FFA500");
                    } else if (boil_timer === 10) {
                        createScrollingText("The pot is getting hotter", "#FFA500");
                    }
                    else if (boil_timer === 5) {
                        createScrollingText("The sinew begins to heat up in the pot", "#FFA500");
                    }
                }, 1000); // Fixed curly brace
            } else {
                createScrollingText("You have no ice to melt", "#4ec1db");
            }
        } else {
            createScrollingText("A fire is needed to boil water", "#4ec1db");
        }
    }
}

function StopBoiling() {
    if (!player.active_button_flag) {
        if (player.boiling_flag) {
            if (player.boiling_water_flag)
                if (player.buckets >= 1 && boil_timer >= 15 && boil_timer < 20) {
                    player.water += 1;
                    player.buckets -= 1;
                    createScrollingText("You pour the boiled water into a bucket", "#FFA500");
                }
                else if (player.buckets < 1 && boil_timer >= 15 && boil_timer < 20) {
                    createScrollingText("You have no buckets to pour the water into", "#4ec1db");
                }
                else if (boil_timer < 15 && boil_timer > 10) {
                    player.ice += 1;
                    createScrollingText("You took the pot off and tossed the unboiled water", "#FFA500");
                }
                else if (boil_timer < 10) {
                    player.ice += 1;
                    createScrollingText("You took the pot off the fire and retrieved the ice", "#FFA500");
                }
                player.boiling_water_flag = false;
                let button = document.getElementById("Boil-Water");
                button.textContent = "Boil Water";
            }
            if (player.boiling_sinew_flag) {
                if (player.buckets >= 1 && boil_timer >= 15 && boil_timer < 20) {
                    player.adhesive += 1;
                    player.buckets -= 1;
                    createScrollingText("You pour the boiled water into a bucket", "#FFA500");
                }
                else if (player.buckets < 1 && boil_timer >= 15 && boil_timer < 20) {
                    createScrollingText("You have no buckets to pour the water into", "#4ec1db");
                }
                else if (boil_timer < 15 && boil_timer > 10) {
                    createScrollingText("You took the pot off and tossed the goopy sinew", "#FFA500");
                }
                else if (boil_timer < 10) {
                    player.sinew += 1;
                    createScrollingText("You took the pot off the fire and retrieved the unburned sinew", "#FFA500");
                }
                player.boiling_sinew_flag = false;
                let button2 = document.getElementById("Boil-Sinew");
                button2.textContent = "Boil Sinew";
            }
        boilwater_sfx.pause();
        let stop_boiling_sfx = document.getElementById("stop_boiling_sfx");
        stop_boiling_sfx.currentTime = 0;
        stop_boiling_sfx.play();
        clearInterval(boil_interval); // Properly stops the interval
        document.getElementById("boilwater_sfx").pause(); // Pause sound
        boil_timer = 0; // Reset timer
        document.getElementById("boil-water-container").style.display = "none"; // Hide UI
        player.boiling_flag = false;
    }
}

/////////////////////////////////////////
function Hunt() {
    const button = document.getElementById("Hunt");
    if (!player.active_button_flag) {
        if (!player.too_dark_to_see || player.torch_flag) {
            player.active_button_flag = true;
            player.inside_flag = false;
            let timer = getRandomInt(7, 10);

            if (player.bow_flag && player.arrows > 0) {
                let hunt_start_sfx = document.getElementById("hunt_start_sfx");
                hunt_start_sfx.currentTime = 0;
                hunt_start_sfx.play();
                createScrollingText("You went outside to hunt...", "#FFA500");
                button.textContent = `Hunting... (${timer}s)`;

                const interval = setInterval(function() {
                    timer--; // Decrease the countdown by 1
                    button.textContent = `Hunting... (${timer}s)`;

                    if (timer <= 0) {
                        clearInterval(interval);
                        let randomNum = getRandomInt(1, 2);

                        if (randomNum === 1) {
                            player.arrows -= 1;
                            player.thirst -= 5;

                            if (player.hunt_favor) {
                                player.raw_meat += 5;
                                player.hunt_favor = false;
                            } else {
                                player.raw_meat += 2;
                            }

                            let lootNum = getRandomInt(1, 2); // Renamed for clarity
                            if (lootNum === 1) {
                                player.hides += 1;
                                createScrollingText("Prey slain; gathered some hides", "#FFA500");
                            } else {
                                player.sinew += 1;
                                createScrollingText("Prey slain; gathered some sinew", "#FFA500");
                            }

                            player.bow_durability -= 1;
                            if (player.bow_durability === 0) {
                                createScrollingText("Your bow broke apart", "#4ec1db");
                                player.bow_flag = false;
                            }

                            if (player.torch_flag) {
                                player.torch_durability -= 1;
                                TorchChecker();
                            }

                            VitalityCap();
                            let hunted_sfx = document.getElementById("hunted_sfx");
                            hunted_sfx.currentTime = 0;
                            hunted_sfx.play();
                        } else {
                            createScrollingText("Nothing to hunt here...", "#4ec1db");
                            let leaves_sfx = document.getElementById("leaves_sfx");
                            leaves_sfx.currentTime = 0;
                            leaves_sfx.play();
                        }

                        player.active_button_flag = false;
                        player.inside_flag = true;
                        button.textContent = "Hunt";
                        UpdateLabels();
                    }
                }, 1000);

            } else if (player.bow_flag && player.arrows <= 0) {
                createScrollingText("You have no arrows", "#4ec1db");
                player.active_button_flag = false;
                player.inside_flag = true;
                button.textContent = "Hunt";
                UpdateLabels();

            } else {
                createScrollingText("You have nothing to hunt with", "#4ec1db");
                player.active_button_flag = false;
                player.inside_flag = true;
                button.textContent = "Hunt";
                UpdateLabels();
            }
        } else {
            createScrollingText("It's too dark outside to hunt...", "#4ec1db");
        }
    }
}

function Trap() {
    if (!player.active_button_flag) {
        if (!player.too_dark_to_see || player.torch_flag) {
            const button = document.getElementById("Trap");
            if (!player.trap_flag) {
                if (player.traps >= 1) {
                    player.trap_flag = true;
                    createScrollingText("You laid a trap", "#FFA500");
                    let timer = 60;
                    button.textContent = `Trap (${timer}s)`;
                    let trap_start_sfx = document.getElementById("trap_start_sfx");
                    trap_start_sfx.currentTime = 0;
                    trap_start_sfx.play();

                    const interval = setInterval(function () {
                        timer--;
                        button.textContent = `Trap (${timer}s)`;
                        if (timer <= 0) {
                            clearInterval(interval); // Stop the countdown
                            let randomNum = getRandomInt(1, 3);
                            if (randomNum < 3) {
                                player.traps -= 1;
                                if (player.trap_favor) {
                                    player.raw_meat += 3;
                                    player.sinew += 2;
                                    player.hides += 2;
                                    player.trap_favor = false;
                                } else {
                                    player.raw_meat += 1;
                                    player.sinew += 1;
                                    player.hides += 1;
                                }
                                createScrollingText("You caught an animal in the trap", "#FFA500");
                            } else {
                                createScrollingText("You caught nothing and dismantled the trap", "#4ec1db");
                                player.wood += 20;
                                player.rope += 1;
                            }
                            if (player.torch_flag) {
                                player.torch_durability -= 1;
                                TorchChecker();
                            }
                            let trap_finish_sfx = document.getElementById("trap_finish_sfx");
                            trap_finish_sfx.currentTime = 0;
                            trap_finish_sfx.play();
                            UpdateLabels();
                            button.textContent = "Trap"; // Reset button text
                            player.trap_flag = false;
                        }
                    }, 1000);
                } else {
                    createScrollingText("You have no traps to lay", "#4ec1db");
                }
            } else {
                createScrollingText("You already set up a trap", "#4ec1db");
            } // This closing brace is for the else statement
        } else {
            createScrollingText("It's too dark outside to lay traps...", "#4ec1db");
        }
    }
}





/////////////////////////////////////////
function GetIce() {
    if (!player.active_button_flag) {
        player.active_button_flag = true;
        player.inside_flag = false;
        const button = document.getElementById("Get-Ice");
        let timer = getRandomInt(4, 7);

        if (player.too_dark_to_see || !player.torch_flag) {
            player.active_button_flag = false; // This should be outside the nested if/else
            if (player.icebox) {
                createScrollingText("You went outside to get some ice...", "#FFA500");
                button.textContent = `Getting ice... (${timer}s)`;
                let get_ice_start_sfx = document.getElementById("get_ice_start_sfx");
                get_ice_start_sfx.currentTime = 0;
                get_ice_start_sfx.play();
                const interval = setInterval(function () {
                    timer--;
                    button.textContent = `Getting ice... (${timer}s)`;
                    if (timer <= 0) {
                        clearInterval(interval); // Stop the countdown
                        player.ice += 1;
                        if (player.torch_flag) {
                            player.torch_durability -= 1;
                            TorchChecker();
                        }
                        createScrollingText("You put some ice in the icebox", "#FFA500");
                        let get_ice_finish_sfx = document.getElementById("get_ice_finish_sfx");
                        get_ice_finish_sfx.currentTime = 0;
                        get_ice_finish_sfx.play();
                        UpdateLabels();
                        button.textContent = "Get Ice"; // Reset button text
                        player.active_button_flag = false;
                        player.inside_flag = true;
                    }
                }, 1000);
            } else {
                createScrollingText("You have nothing to put the ice in", "#4ec1db");
                player.active_button_flag = false;
            }
        } else {
            createScrollingText("It's too dark outside to get ice...", "#4ec1db");
        }
    }
}



/////////////////////////////////////////
function Gather() {
    if (!player.active_button_flag) {
        if (!player.too_dark_to_see || player.torch_flag) {
            player.active_button_flag = true;
            player.inside_flag = false;
            let gather_start_sfx = document.getElementById("gather_start_sfx");
            gather_start_sfx.currentTime = 0;
            gather_start_sfx.play();
            createScrollingText("You went outside to gather...", "#FFA500");
            const button = document.getElementById("Gather");
            let timer = getRandomInt(7, 12);
            button.textContent = `Gathering... (${timer}s)`;
            const interval = setInterval(function () {
                timer--;
                button.textContent = `Gathering... (${timer}s)`;
                if (timer <= 0) {
                    clearInterval(interval);
                    let randomNum = getRandomInt(1, 3);
                    if (randomNum < 3) {
                        player.flint += 1;
                        createScrollingText("You gathered some flint", "#FFA500");
                    }
                    else {
                        createScrollingText("You couldn't find anything to gather underneath the snow...", "#4ec1db");
                    }
                    if (player.torch_flag) {
                        player.torch_durability -= 1;
                        TorchChecker();
                    }
                    UpdateLabels();
                    button.textContent = "Gather";
                    let gather_finish_sfx = document.getElementById("gather_finish_sfx");
                    gather_finish_sfx.currentTime = 0;
                    gather_finish_sfx.play();
                    player.active_button_flag = false;
                    player.inside_flag = true;
                }
            }, 1000);
        }
        else {
            createScrollingText("It's too dark outside to gather...", "#4ec1db");
        }
    }
}

/////////////////////////////////////////
function Forage() {
    if (!player.active_button_flag) {
        if (!player.too_dark_to_see || player.torch_flag) {
            player.active_button_flag = true;
            player.inside_flag = false;
            let forage_start_sfx = document.getElementById("forage_start_sfx");
            forage_start_sfx.currentTime = 0;
            forage_start_sfx.play();
            createScrollingText("You went outside to forage...", "#FFA500");
            const button = document.getElementById("Forage");
            let timer = getRandomInt(4, 6);
            button.textContent = `Foraging... (${timer}s)`;
            const interval = setInterval(function () {
                timer--;
                button.textContent = `Foraging... (${timer}s)`;
                if (timer <= 0) {
                    let randomNum = getRandomInt(1, 2);
                    if (randomNum === 1) {
                        let berryNum = getRandomInt(1, 3); // Changed variable name for clarity
                        player.snow_berries += berryNum;
                        createScrollingText("You forage some snow berries", "#FFA500");
                    } else {
                        player.arctic_willow += 1;
                        createScrollingText("You forage some arctic willow", "#FFA500");
                    }
                    if (player.torch_flag) {
                        player.torch_durability -= 1;
                        TorchChecker();
                    }
                    button.textContent = "Forage";
                    let forage_finish_sfx = document.getElementById("forage_finish_sfx");
                    forage_finish_sfx.currentTime = 0;
                    forage_finish_sfx.play();
                    clearInterval(interval);
                    UpdateLabels();
                    player.active_button_flag = false;
                    player.inside_flag = true;
                }
            }, 1000);
        } else {
            createScrollingText("It's too dark outside to forage...", "#4ec1db");
        }
    }
}

/////////////////////////////////////////
function toggleSearchMenu() {
    if (!player.too_dark_to_see || player.torch_flag) {
        const searchmenu = document.getElementById("search-menu");
        searchmenu.classList.toggle("show");
    }
    else {
        createScrollingText("It's too dark outside to search...", "#4ec1db");
    }
}

function SearchNear() {
    if (!player.active_button_flag) {
        toggleSearchMenu();
        player.active_button_flag = true;
        player.inside_flag = false;
        let search_start_sfx = document.getElementById("search_start_sfx");
        search_start_sfx.currentTime = 0;
        search_start_sfx.play();
        createScrollingText("You went outside to search nearby...", "#FFA500");
        const button = document.getElementById("Search");
        let timer = getRandomInt(7, 15);
        button.textContent = `Searching... (${timer}s)`;
        const interval = setInterval(function () {
            timer--;
            button.textContent = `Searching... (${timer}s)`;
            if (timer <= 0) {
                let randomNum = getRandomInt(1, 3);
                if (randomNum === 1) {
                    createScrollingText("You spot some elk nearby and note their location", "#1798d8");
                    player.hunt_favor = true;
                }
                else if (randomNum === 2) {
                    createScrollingText("You notice some recent animal footprints in the snow", "#1798d8");
                    player.trap_favor = true;
                }


                else {
                    createScrollingText("You searched nearby but found nothing", "#4ec1db");
                }

                if (player.torch_flag) {
                    player.torch_durability -= 1;
                    TorchChecker();
                }
                button.textContent = "Search";
                let search_finish_sfx = document.getElementById("search_finish_sfx");
                search_finish_sfx.currentTime = 0;
                search_finish_sfx.play();
                clearInterval(interval);
                UpdateLabels();
                player.active_button_flag = false;
                player.inside_flag = true;
            }
        }, 1000);
    }
}

function SearchFar() {
    if (!player.active_button_flag) {
        toggleSearchMenu();
        player.active_button_flag = true;
        player.inside_flag = false;
        let search_start_sfx = document.getElementById("search_start_sfx");
        search_start_sfx.currentTime = 0;
        search_start_sfx.play();
        createScrollingText("You went outside to search far away...", "#FFA500");
        const button = document.getElementById("Search");
        let timer = 60;
        button.textContent = `Searching... (${timer}s)`;
        const interval = setInterval(function () {
            timer--;
            button.textContent = `Searching... (${timer}s)`;
            if (timer <= 0) {
                let randomNum = getRandomInt(1, 2);
                if (randomNum === 1) {
                    createScrollingText("You found a frozen corpse, keyitem 1 ", "#1798d8");
                }
                else if (randomNum === 2) {
                    createScrollingText("keyitem 2", "#1798d8");
                }

                button.textContent = "Search";
                let search_finish_sfx = document.getElementById("search_finish_sfx");
                search_finish_sfx.currentTime = 0;
                search_finish_sfx.play();
                clearInterval(interval);
                UpdateLabels();
                player.active_button_flag = false;
                player.inside_flag = true;
            }
        }, 1000);
    }
}

/////////////////////////////////////////
function EatMeat() {
    if (!player.active_button_flag) {
        if (player.meat >= 1) {
            player.meat -= 1;
            player.hunger += 10;
            createScrollingText("You eat the cooked meat", "#FFA500");
            UpdateLabels();
        } else {
            createScrollingText("You don't have any meat", "#FFA500");
        }
    }
}

function DrinkWater() {
    if (!player.active_button_flag) {
        if (player.water >= 1) {
            player.water -= 1;
            player.thirst += 10;
            createScrollingText("You drink the purified water", "#FFA500");
            UpdateLabels();
        } else {
            createScrollingText("You don't have any water", "#FFA500");
        }
    }
}

function EatBerries() {
    if (!player.active_button_flag) {
        if (player.snow_berries >= 1 && !player.sick_flag) {
            player.snow_berries -= 1;
            player.hunger += 2;
            createScrollingText("You eat a snow berry", "#FFA500");
            UpdateLabels();
            let randomNum = getRandomInt(1, 15);
            if (randomNum === 1) {
                player.sick_flag = true;
                createScrollingText("You don't feel well...", "#4ec1db");
                PlayerSick();
            }
        } else if (player.snow_berries >= 1 && player.sick_flag) {
            createScrollingText("You feel sick from eating the berries...", "#4ec1db");
        } else {
            createScrollingText("You don't have any berries", "#FFA500");
        }
    }
}

function PlayerSick() {
    let sick_timer = 60;
    const interval = setInterval(function () {
        if (player.sick_flag) {
            sick_timer--;
            if (sick_timer <= 0) {
                clearInterval(interval); // Clears the interval before calling GameOver
                gameOverReason = "YOU DIED OF SICKNESS"
                GameOver();
            }
            else if (sick_timer === 40) {
                createScrollingText("You feel very sick...", "#4ec1db");
            }
            else if (sick_timer === 30) {
                createScrollingText("You vomit some snow berries", "#4ec1db");
            }
            else if (sick_timer === 20) {
                createScrollingText("You are dying from sickness", "#c60000");
            }
            else if (sick_timer === 10) {
                createScrollingText("A sick death is imminent", "#c60000");
            }
        }
    }, 1000); // Correctly placed closing brace
}

function DrinkTonic() {
    if (!player.active_button_flag) {
        if (player.tonics >= 1) {
            let drink_tonic_sfx = document.getElementById("drink_tonic_sfx");
            drink_tonic_sfx.currentTime = 0;
            drink_tonic_sfx.play();
            player.tonics -= 1;
            createScrollingText("You drink the tonic", "#FFA500");
            if (player.sick_flag) {
                let randomNum = getRandomInt(1, 5);
                if (randomNum === 1) {
                    player.sick_flag = false;
                    createScrollingText("You start to feel less sick", "#FFA500");
                }
            }
            UpdateLabels();
        }
        else {
            createScrollingText("You don't have any tonics", "#FFA500");
        }
    }
}

/////////////////////////////////////////
let currentBook = "stoic"; // Default book
let survival_currentPage = 1;
const survival_totalPages = 6; // Total number of pages in the book
const survival_bookContent = [
    "<b><u>A Mountaineer's Guide To Survival</u></b><br>________________________________________________________________________________<br><i>by Everest Boone</i><br>1863<br>",
    "<b><i><u>Foreword</u></i></b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Any mountaineer worth his salt must always place common sense and rational thinking before he does anything. The mountains and the wilderness that surrounds them in remote places can be extremely dangerous and hostile places. Patience is a virtue and can often save the mountainman's life. When in doubt, wait it out. Plan each step carefully.",

    "<b><i><u>Staying Warm</u></i></b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If we do not maintain a regular healthy temperature, we can die. The human body will often die in temperatures less than -30 degrees farenheit without protection or shelter, thus in cold places insulation and shelter are paramount. Fire is the antithesis of perishing in the cold. The abundance of wood to burn in forested areas are a gift from above. Fire is the hardest to make when it is needed most; on hot, dry days, making a fire is simple, but on cold & wet days, fire is difficult to start.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The body must adapt to its surrounding temperatures. Warming ones self by a fire is a fantastic way to evade frostbite or hypothermia, but if the fire is not within an insulated enviroment, the effects of the heat may be null. Allow yourself to warm completely before venturing into extremely cold places; <i>it may save your life</i>.",

    "<b><i><u>Food & Water</u></i></b><br><b>Food</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;One needs not express the dire need to remain full on dangerous adventures. All people of even severely-reduced intelligence knows they must eat to live. However, acquiring food without a local farmer or merchant can be difficult. In wild places, wildlife can be abundant. Hunting these creatures are an invaluable way to acquire the necessary sustenance required for adventure. One may also look to the plants for sustenance, such as edible berries or mushrooms. However, it is worth noting that the human body can derive much more energy from carnivorous diets than an herbacious one. Meat must be cooked before consuming as eating raw meats will lead to deathly disease.<br><b>Water</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As stated above, one likely knows the importance of water concerning survival. Hydration is a must, especially for us adventurers who must often trek many miles or tend to our camps with hard labor. However, one cannot simply drink water laying about without fear of dysentery, thus water must be purified before consuming. The best way to purify water is to boil the water over a fire. Satiating thirst is crucial to all other task in the wild.",

    "<b><i><u>Valuable Resources</u></i></b><br><b>Animals</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sinew can be gathered from slain animals with tendons and can be used in various ways. Hides can be skinned off the animal and tanned to make leather, which can be used to make clothing or satchels. Fasten the hide to something solid like wood and brush a knife against its skin to tan the hide. Clean hunting of animals (as opposed to brute-force) will leave more of the hide intact; a well-placed arrow can render wonderful materials for the adventurer to use.",

    "<b><i><u>Illness & Treatment</u></i></b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Having an existing knowledge of plants in nature can be immensely beneficial, even for those without much experience in medicine. Creating concoctions of medicinal herbs can save the life of the adventurer that has fallen ill. Most of the natural medicines passed down from those before almost always use water as the base of the tonic, so be sure to have some on hand. Sickness can greatly decrease your energy, so obtaining the necessary materials to manufacture the remedy after becoming sick can range from difficult to impossible. Prepare for every outcome: a solitary death in the untouched wild by illness is no such story the bard will sing about.",
];

let stoic_currentPage = 1;
const stoic_totalPages = 5; // Total number of pages in the book
const stoic_bookContent = [
    "<b><u>The Frozen Stoic</u></b><br>________________________________________________________________________________<br><i>Author Unknown</i><br>1821<br><br><i>A note to the reader:</i><br>Little is known about Tetus and his expedition...",

    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As Tetus ascended the rigorous and dangerous slopes of Mount Polaris, he reflected on his life through deep contemplative introspection. Tetus could only acquire introspection of such intensity by a lifetime of meditative discipline; he, over time, became fiercely devout to the pursuit of perfection. In all the providences of Greece, Tetus could find no perfect residence, no perfect master to apprentice to, no perfect wife to pledge his vows, and no perfect king to offer his loyalty, so he turned to nature's unforgiving offerings to perfect himself. He desired perfect virtue, perfect wisdom, and perfect being, for Tetus knew these were the only things he could ultimately control. He knew that no scoundrel nor tyrant could accept the limitations of the self, and no prostitute nor archontissa could perfectly sacrifice their despondent need for petty governance. Tetus thought of all those whom he had met, how he had considered that all peoples had earned the dishonorable title of a 'failed ruler' over their own lives, how they had drifted further from enkrateia each sunrise, and he was to have no association with this collective failure.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;What had <i>not</i> failed Tetus was the permanent cycles of the turning of leaves that follow the autumn and vernal equinoxes, the augury of migrating birds, the unyielding winds that trembled the flora, the rains that shaped the mountains. He knew that these natural things were not masters of their world, <i>nor were they trying to be</i>, but they pursued the mastery of themselves. The conifers grew and withstood the elements through ages of resilience that produced a recursive species, a species of self-correction, and so it was true for all the other things above and below the mountain. Tetus had come to understand that the harsher the stasis, the greater the will and endurance that those whom bare its effects have, and so he embarked for the peak of Mount Polaris in the middle of the far reaching, desolate tundra.",

    "It began to rain on Mount Polaris; as the rain glided down the mountainous slopes, Tetus acknowledged that even this substance falling from the sky had no say in its destination, yet it appeared to always seek a place of stillness and rest. As the cold of the dusk came in, the rain turned into snow and fell ever more gently upon the mountain. The snow seemed to care even less about its destination as it shed its heavier liquid form and paradoxically became lighter as it crystallized from being solidified. Tetus knew of the sacred geometry contained within each flake due to mathematicians and philosophers that he had disdainfully entered into discourse with; he pondered the chaotic morphosis of the raindrops becoming symmetrical oddities as they themselves became constituents of the mountain, forming an untarnished blanket of white that clothed the mountain in symbolic purity. The mountain was blameless.",

    "Page 3: Here we are on page three, keep going.",

    "Page 4: Halfway there! You are doing great.",

    "Page 5: This is the final page. Congratulations on completing the book!"
];


function ReadBook() {
    const menu = document.getElementById("book-menu");
    const bookWindow = document.getElementById("bookwindow");
    if (menu.classList.contains("show") || bookWindow.classList.contains("show")) {
        menu.classList.remove("show"); // Close both the book menu and the book window
        bookWindow.classList.remove("show");
    } else {
        menu.classList.add("show");
    }
}

function OpenBook(bookType) {
    currentBook = bookType; // Set the selected book
    document.getElementById("book-menu").classList.remove("show"); // Hide menu
    document.getElementById("bookwindow").classList.add("show"); // Show book
    if (bookType === "stoic") { // Reset page count when opening a new book
        stoic_currentPage = 1;
    } else {
        survival_currentPage = 1;
    }
    updatePage(); // Load the first page
    let book_open_sfx = document.getElementById("book_open_sfx");
    book_open_sfx.currentTime = 0;
    book_open_sfx.play();
}

function updatePage() {
    const bookWindow = document.getElementById("book-content");
    const content = currentBook === "stoic" ? stoic_bookContent : survival_bookContent;
    const currentPage = currentBook === "stoic" ? stoic_currentPage : survival_currentPage;
    bookWindow.innerHTML = content[currentPage - 1];
}

function BookLeft() {
    if (currentBook === "stoic" && stoic_currentPage > 1) {
        stoic_currentPage--;
    } else if (currentBook === "survival" && survival_currentPage > 1) {
        survival_currentPage--;
    }
    updatePage();
    let page_sfx = document.getElementById("page_sfx");
    page_sfx.currentTime = 0;
    page_sfx.play();
}

function BookRight() {
    if (currentBook === "stoic" && stoic_currentPage < stoic_totalPages) {
        stoic_currentPage++;
    } else if (currentBook === "survival" && survival_currentPage < survival_totalPages) {
        survival_currentPage++;
    }
    updatePage();
    let page_sfx = document.getElementById("page_sfx");
    page_sfx.currentTime = 0;
    page_sfx.play();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MOUNTAIN
/////////////////////////////////////////

function toggleMountainWarningMenu() {
    if (!player.active_button_flag) {
        const mountain_warning_menu = document.getElementById("mountainwarningmenu");
        mountain_warning_menu.classList.toggle("show");
    }
}

function toggleSatchelMenu() {
    toggleMountainWarningMenu();
    const satchel_menu = document.getElementById("satchelmenu");
    satchel_menu.classList.toggle("show");
    UpdateLabels();
}

function SatchelRemoveWood() {
    if (player.satchel_wood >= 1) {
        player.wood += 1;
        player.satchel_wood -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddWood() {
    if (player.wood >= 1 && player.satchel_weight < 20) {
        player.wood -= 1;
        player.satchel_wood += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelRemoveHides() {
    if (player.satchel_hides >= 1) {
        player.hides += 1;
        player.satchel_hides -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddHides() {
    if (player.hides >= 1 && player.satchel_weight < 20) {
        player.hides -= 1;
        player.satchel_hides += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelRemoveRope() {
    if (player.satchel_rope >= 1) {
        player.rope += 1;
        player.satchel_rope -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddRope() {
    if (player.rope >= 1 && player.satchel_weight < 20) {
        player.rope -= 1;
        player.satchel_rope += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelRemoveMeat() {
    if (player.satchel_meat >= 1) {
        player.meat += 1;
        player.satchel_meat -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddMeat() {
    if (player.meat >= 1 && player.satchel_weight < 20) {
        player.meat -= 1;
        player.satchel_meat += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelRemoveSnowBerries() {
    if (player.satchel_snow_berries >= 1) {
        player.snow_berries += 1;
        player.satchel_snow_berries -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddSnowBerries() {
    if (player.snow_berries >= 1 && player.satchel_weight < 20) {
        player.snow_berries -= 1;
        player.satchel_snow_berries += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelRemoveWater() {
    if (player.satchel_water >= 1) {
        player.water += 1;
        player.satchel_water -= 1;
        player.satchel_weight -= 1;
        UpdateLabels();
    }
}
function SatchelAddWater() {
    if (player.water >= 1 && player.satchel_weight < 20) {
        player.water -= 1;
        player.satchel_water += 1;
        player.satchel_weight += 1;
        UpdateLabels();
    }
}

function SatchelTakeAll() {
    player.wood += player.satchel_wood;
    player.satchel_wood -= player.satchel_wood;
    player.hides += player.satchel_hides;
    player.satchel_hides -= player.satchel_hides;
    player.rope += player.satchel_rope;
    player.satchel_rope -= player.satchel_rope;
    player.meat += player.satchel_meat;
    player.satchel_meat -= player.satchel_meat;
    player.snow_berries += player.satchel_snow_berries;
    player.satchel_snow_berries -= player.satchel_snow_berries;
    player.water += player.satchel_water;
    player.satchel_water -= player.satchel_water;
    player.satchel_weight = 0;
    UpdateLabels();
}


//MOUNTAIN
let climb_time = 0;
let climbInterval; // Variable to store the climb interval
let descentInterval; // Variable to store the descent interval
let climbPause = false;

let camp_position;

let ropebridge_flag = false;
let madhermit_flag = false;

function ClimbMountain() {
    player.inside_flag = false;
    player.climbing_mountain_flag = true;
    toggleSatchelMenu();
    toggleMountainWarningMenu();
    document.getElementById('UI-container').style.visibility = 'hidden';
    document.getElementById('Mountain-container').style.visibility = 'visible';

    document.getElementById("text-container").innerHTML = ""; // Remove text messages
    createScrollingText("You begin the ascent...", "#adf0ff");

    clearInterval(climbInterval);
    clearInterval(descentInterval); // Clear descent interval if it exists
    climbInterval = setInterval(() => {
        if (!climbPause) {
            climb_time += 1;
            console.log(`Climb: ${climb_time}`);
            if (climb_time === 300) { // Win condition
                createScrollingText("WINTERBOX", "#adf0ff");
                clearInterval(climbInterval); // Stop the interval
                GameWin();
            }

            //camps
            if (climb_time === camp_position) {
                climbPause = true;
                createScrollingText("You arrive to the makeshift camp and quickly warm up by the small fire", "#adf0ff");
                player.temperature += 50;
                climbPause = false;
            }

            //ropebridge
            if (climb_time === 30 && !ropebridge_flag) {
                climbPause = true;
                createScrollingText("You come across a broken rope bridge... no way around it...", "#adf0ff");

                if (player.satchel_wood >= 10 && player.satchel_rope >= 2) {
                    player.satchel_wood -= 10;
                    player.satchel_rope -= 2;
                    createScrollingText("You fixed the rope bridge", "#adf0ff");
                    climbPause = false; // Unpause after fixing the bridge
                    ropebridge_flag = true;
                } else {
                    createScrollingText("You need more wood and rope to fix the bridge", "#adf0ff");
                }
            }
            else if (climb_time === 30 && ropebridge_flag) {
                createScrollingText("You cross the repaired rope bridge...", "#adf0ff");
            }

            //mad hermit
            if (climb_time === 60 && !madhermit_flag) {
                climbPause = true;
                createScrollingText("There's a mad hermit in the mountain cave...", "#adf0ff");

                if (player.satchel_hides >= 10) {
                    player.satchel_hides -= 10;
                    createScrollingText("Mad Hermit evaded", "#adf0ff");
                    climbPause = false; // Unpause after fixing the bridge
                    madhermit_flag = true;
                } else {
                    createScrollingText("You need more hides to bypass the hermit", "#adf0ff");
                }
            }
            else if (climb_time === 60 && madhermit_flag) {
                createScrollingText("You creep past the hermit with your makeshift disguise...", "#adf0ff");
            }

        }
    }, 1000);
}


function GoBack() {
    climbPause = false;
    createScrollingText("You begin descending back to the cabin...", "#adf0ff");
    clearInterval(climbInterval);
    clearInterval(descentInterval); // Clear climb interval if it exists
    descentInterval = setInterval(() => {
        climb_time -= 1;
        console.log(`Climb: ${climb_time}`)
        if (climb_time <= 0) {
            climb_time = 0; // Ensure climb_time doesn't go negative
            player.inside_flag = true;
            SatchelTakeAll();
            document.getElementById("text-container").innerHTML = ""; // Remove text messages
            createScrollingText("Arrived back at the cabin", "#FFA500");
            document.getElementById('UI-container').style.visibility = 'visible';
            document.getElementById('Mountain-container').style.visibility = 'hidden';
            clearInterval(descentInterval); // Stop the descent interval
        }
        if (climb_time === camp_position) {
            climbPause = true;
            createScrollingText("You arrive to the makeshift camp and quickly warm up by the small fire", "#adf0ff");
            player.temperature += 50;
            climbPause = false;
        }
    }, 1000);
}


function MakeCamp() {
    if (player.satchel_wood >= 10 && player.satchel_hides >= 2) {
        player.satchel_wood -= 10;
        player.satchel_hides -= 2;
        createScrollingText("You make camp on the mountain", "#adf0ff");
        camp_position = climb_time
    }
    else {
        createScrollingText("You don't have enough materials to make camp", "#adf0ff");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//NPC"s
/////////////////////////////////////////
function Merchant() {
    if (!player.merchant_flag) {
        player.merchant_flag = true;
        createScrollingText("A charming merchant approaches the cabin...", "#228B22");
        setTimeout(function() {
            let merchant_timer = 20
            const interval = setInterval(function() {
                merchant_timer--;
                if (merchant_timer <= 0) {
                    clearInterval(interval);
                    document.getElementById("merchant-menu-container").style.display = "none";
                    createScrollingText("The merchant departs", "#FFA500");
                    player.merchant_flag = false;
                }
            }, 1000);
            createScrollingText("The merchant asks if you have hides and offers an icepick in return", "#228B22");
            document.getElementById("merchant-menu-container").style.display = "block";
        }, 2000); // Added a 2-second delay
    }
}

function TradeHides() {
    if (player.hides >= 10) {
        player.hides -= 10;
        player.icepick = true;
        createScrollingText("Gained an icepick", "#FFA500");
        document.getElementById("items-label-container").style.display = "block";
    }
    else {
        createScrollingText("Not enough hides", "#4ec1db");
    }
}

/////////////////////////////////////////
function StrangeGirl() {
    if (!player.strange_girl) {
        player.strange_girl = true
        document.getElementById("girl-menu-container").style.display = "block";
        createScrollingText("A young, strange girl approaches the cabin...", "#228B22");
        setTimeout(function() {
            createScrollingText("She seems shy...", "#228B22");
        }, 2000);
        setTimeout(function() {
            createScrollingText("Perhaps she could be of use", "#228B22");
        }, 4000);
    }
}

let taskInterval = null; // Store the active interval
function StrangeGirlWood() {
    if (player.strange_girl) {
        if (player.girl_happiness >= 25) {
            player.wood += 60;
            UpdateLabels();
            createScrollingText("Strange Girl gathers a lot of wood", "#228B22");
        }
        else if (player.girl_happiness >= 20) {
            player.wood += 50;
            UpdateLabels();
            createScrollingText("Strange Girl gathers a good bit of wood", "#228B22");
        }
        else if (player.girl_happiness >= 15) {
            player.wood += 40;
            UpdateLabels();
            createScrollingText("Strange Girl gathers some wood", "#228B22");
        }
        else if (player.girl_happiness >= 10) {
            player.wood += 30;
            UpdateLabels();
            createScrollingText("Strange Girl gathers a little wood", "#228B22");
        }
        else if (player.girl_happiness >= 5) {
            player.wood += 20;
            UpdateLabels();
            createScrollingText("Strange Girl gathers a little wood", "#228B22");
        }
        else {
            player.wood += 10;
            UpdateLabels();
            createScrollingText("Strange Girl gathers a small amount of wood", "#228B22");
        }
    }
}

function StrangeGirlIce() {
    if (player.strange_girl) {
        if (player.icebox) {
            player.ice += 1;
            UpdateLabels();
            createScrollingText("Strange Girl gathers some ice", "#228B22");
        }
        else {
            createScrollingText("Strange Girl has nothing to put the ice in", "#4ec1db");
        }
    }
}

function updateTask() {
    clearInterval(taskInterval); // Stop the previous task
    const selectedTask = document.querySelector("input[name='task']:checked")?.value;
    if (!selectedTask) return;
    taskInterval = setInterval(selectedTask === "cut-wood" ? StrangeGirlWood : StrangeGirlIce, 90000);
}

function toggleGiftMenu() {
    if (!player.active_button_flag) {  // Check player flag
        const giftmenu = document.getElementById("giftmenu");
        giftmenu.classList.toggle("show");  // Toggle the 'show' class to open/close the submenu
    }
}


function GiveMeat () {
    if (!player.active_button_flag) {
        if (player.meat >= 1) {
            player.meat -= 1;
            player.girl_hunger += 10;
            createScrollingText("You gave Strange Girl some meat", "#FFA500");
        }
        else {
            createScrollingText("You don't have any meat", "#4ec1db");
        }
    }
}

function GiveSnowBerries () {
    if (!player.active_button_flag) {
        if (player.snow_berries >= 1) {
            player.snow_berries -= 1;
            player.girl_hunger += 2;
            createScrollingText("You gave Strange Girl some snow berries", "#FFA500");
            let randomNum = getRandomInt(1, 5);
            if (randomNum === 1 && !player.girl_sick_flag) {
                player.girl_sick_flag = true;
                GirlSick();
                }
        }
        else {
            createScrollingText("You don't have any snow berries", "#4ec1db");
        }
    }
}

function GirlSick() {
    let sick_timer = 60;
    const interval = setInterval(function () {
        if (player.girl_sick_flag) {
            sick_timer--;
            if (sick_timer <= 0) {
                clearInterval(interval); // Clears the interval before calling GameOver
                GirlDeath();
            }
            else if (sick_timer === 40) {
                createScrollingText("Strange Girl feels very sick...", "#4ec1db");
            }
            else if (sick_timer === 30) {
                createScrollingText("Strange Girl vomits some snow berries", "#4ec1db");
            }
            else if (sick_timer === 20) {
                createScrollingText("Strange Girl is about to die from sickness", "#c60000");
            }
            else if (sick_timer === 10) {
                createScrollingText("A sick death is imminent for Strange Girl", "#c60000");
            }
        }
    }, 1000); // Correctly placed closing brace
}

function GirlDeath() {
    player.girl_dead_flag = true;
    createScrollingText("Strange Girl died", "#c60000");
    const GirlmenuContainer = document.getElementById("girl-menu-container");
    GirlmenuContainer.parentNode.removeChild(GirlmenuContainer);
}

function GiveWater () {
    if (!player.active_button_flag) {
        if (player.water >= 1) {
            player.water -= 1;
            player.girl_thirst += 10;
            createScrollingText("You gave Strange Girl some water", "#FFA500");
        }
        else {
            createScrollingText("You don't have any water", "#4ec1db");
        }
    }
}

function GiveTonic () {
    if (!player.active_button_flag) {
        if (player.tonic >= 1) {
            player.tonic -= 1;
            player.girl_sick_flag = false;
            createScrollingText("You gave Strange Girl a tonic", "#FFA500");
        }
        else {
            createScrollingText("You don't have any tonics", "#4ec1db");
        }
    }
}

function GiveFlute() {
    if (player.flute_flag) {
        if (!player.girl_flute_flag) {
            createScrollingText("You gave Strange Girl a flute", "#228B22");
            player.girl_flute_flag = true;
            player.girl_happiness += 10;
            UpdateLabels();
            CheckGirlHappiness();
        }
        else {
            createScrollingText("You already gave Strange Girl a flute", "#FFA500");
        }
    }
    else {
        createScrollingText("You don't have a flute", "#4ec1db");
    }
}

function GiveArcticWillow () {
    if (!player.active_button_flag) {
        if (player.arctic_willow >= 1) {
            player.arctic_willow -= 1;
            player.girl_happiness += 1;
            createScrollingText("You gave Strange Girl an arctic willow", "#FFA500");
            CheckGirlHappiness();
        }
        else {
            createScrollingText("You don't have any arctic willow", "#4ec1db");
        }
    }
}

function CheckGirlHappiness() {
    if (player.girl_happiness >= 5 && !player.girl_happiness_flag1) {
        createScrollingText("Strange Girl still seems depressed", "#228B22");
        player.girl_happiness_flag1 = true;
    }
    if (player.girl_happiness >= 10 && !player.girl_happiness_flag2) {
        createScrollingText("Strange Girl's spirits are beginning to be lifted", "#228B22");
        player.girl_happiness_flag2 = true;
    }
    if (player.girl_happiness >= 15 && !player.girl_happiness_flag3) {
        createScrollingText("Strange Girl cannot hide a peaking smile", "#228B22");
        player.girl_happiness_flag3 = true;
    }
    if (player.girl_happiness >= 20 && !player.girl_happiness_flag4) {
        createScrollingText("Strange Girl is visibly merry", "#228B22");
        player.girl_happiness_flag4 = true;
    }
    if (player.girl_happiness >= 25 && !player.girl_happiness_flag5) {
        createScrollingText("Strange Girl is brimming with happiness", "#228B22");
        player.girl_happiness_flag5 = true;
    }
}

/////////////////////////////////////////
function RaiderCheck() {
    let randomNum = getRandomInt(1, 5);
    if (randomNum === 1) {
        createScrollingText("Foreign scoundrels raid your cabin at night, stealing your wood", "#c60000");
        player.wood = 0;
        let scoundrel_woodpile_ran = document.getElementById("scoundrel_woodpile_ran");
        scoundrel_woodpile_ran.currentTime = 0;
        scoundrel_woodpile_ran.play();
        UpdateLabels();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//RANDOM EVENTS
/////////////////////////////////////////
function BearAttack() {
    createScrollingText("A bear approaches the cabin...", "#FFA500");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SCROLL TEXT
function createScrollingText(newText, color) {
    const container = document.getElementById("text-container");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("scrolling-text");
    messageDiv.textContent = newText;
    container.prepend(messageDiv);
    const messages = container.querySelectorAll(".scrolling-text");
    messages.forEach((msg, index) => {
        msg.style.transform = `translateY(${index * -30}px)`;
        if (index === 0) {
            msg.style.color = color; // Apply custom color
            msg.style.opacity = 1;
        } else {
            msg.style.opacity = 1 - (index * 0.1);
        }
    });
    if (messages.length > 10) {
        messages[messages.length - 1].remove();
    }
}
