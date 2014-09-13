///////////////////// 
// shim layer with setTimeout fallback -- http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();
/////////////////////
/////////////////////

// 
//  Alchemist's Nightmare 
//  Made for js13kgames 2014
//

var SO_ID = 0
var SO_NAME = 1;
var SO_TYPE = 2;
var SO_COLOUR = 3;
var SO_X = 4;
var SO_Y = 5;
var SO_WIDTH = 6;
var SO_HEIGHT = 7;
var SO_HOVER = 8;
var SO_TARGET_X = 9;
var SO_TARGET_Y = 10;
var SO_LIFETIME = 11;
var SO_CLICKABLE = 12;
var SO_CLICK_EVENT = 13;
var SO_MOVESPEED = 14;
var SO_SHOWNAME = 15;
var SO_SHOWGRAPHIC = 16;
var SO_TEXTSTYLE = 17;
var SO_TARGET_WIDTH = 18;
var SO_TARGET_HEIGHT = 19;
var SO_HEALTH = 20;
var SO_HEALTH_MAX = 21;
var SO_SIZE_SPEED = 22;
var SO_COLLIDEABLE = 23;
var SO_TAKING_DAMAGE = 24;

var SCENE_MENU = 0;
var SCENE_GAME = 1;
var SCENE_SCORE = 2;

var SKILL_NONE = 0;
var SKILL_FIRE = 1;
var SKILL_WATER = 2;
var SKILL_EARTH = 3;
var SKILL_AIR = 4;

var HEALTH_EFFECT_NONE = 0;
var HEALTH_EFFECT_DAMAGE = 1;
var HEALTH_EFFECT_HEAL = 2;

var playerTakingDamage = HEALTH_EFFECT_NONE;

function clearRect(c, x, y, w, h, isLine) {
    context.beginPath();
    context.rect(x, y, w, h);
    if (isLine) {
        context.lineWidth = 4;
        context.strokeStyle = c;
        context.stroke();
    }
    else {
        context.fillStyle = c;
        context.fillRect(x, y, w, h);
    }
    context.closePath();
}

function drawRect(c, x, y, w, h, isLine)
{
    context.beginPath();
    context.rect(x, y, w, h);
    if (isLine || true)
    {
        context.lineWidth = 4;
        context.strokeStyle = c;
        context.stroke();
    }
    else
    {
        context.fillStyle = c;
        context.fillRect(x, y, w, h);
    }
    context.closePath();
}

function drawElement(element, c, x, y, w, h, isLine, health, maxHealth, takingDamage) {
    context.beginPath();

    context.lineWidth = 3;
    context.strokeStyle = c;

    if (element === "FIRE")
    {
        drawFireSymbol(c, x, y, w, h);
    }
    else if (element === "WATER")
    {
        drawWaterSymbol(c, x, y, w, h);
    }
    else if (element === "AIR") {
        drawAirSymbol(c, x, y, w, h);
    }
    if (element === "EARTH") {
        drawEarthSymbol(c, x, y, w, h);
    }

    drawHealth(x, y - (h / 4), w, h, health, maxHealth, takingDamage);

    context.closePath();
}

function drawFire(c, x, y, w, h, isLine, health, maxHealth, takingDamage)
{
    drawElement("FIRE", c, x, y, w, h, isLine, health, maxHealth, takingDamage);
}

function drawWater(c, x, y, w, h, isLine, health, maxHealth, takingDamage)
{
    drawElement("WATER", c, x, y, w, h, isLine, health, maxHealth, takingDamage);
}

function drawEarth(c, x, y, w, h, isLine, health, maxHealth, takingDamage)
{
    drawElement("EARTH", c, x, y, w, h, isLine, health, maxHealth, takingDamage);
}

function drawAir(c, x, y, w, h, isLine, health, maxHealth, takingDamage)
{
    drawElement("AIR", c, x, y, w, h, isLine, health, maxHealth, takingDamage);
}

function drawFireSymbol(c, x, y, w, h)
{
    context.strokeStyle = c;

    // left
    context.moveTo(x + (w / 2), y);
    context.lineTo(x + w, y + h);

    // right
    context.moveTo(x + (w / 2), y);
    context.lineTo(x, y + h);

    // bottom
    context.moveTo(x, y + h);
    context.lineTo(x + w, y + h);

    context.stroke();
}

function drawWaterSymbol(c, x, y, w, h)
{
    context.strokeStyle = c;

    // left
    context.moveTo(x, y);
    context.lineTo(x + (w / 2), y + h);

    // right
    context.moveTo(x + w, y);
    context.lineTo(x + (w / 2), y + h);

    // bottom
    context.moveTo(x, y);
    context.lineTo(x + w, y);

    context.stroke();
}

function drawAirSymbol(c, x, y, w, h)
{
    context.strokeStyle = c;

    // left
    context.moveTo(x + (w / 2), y);
    context.lineTo(x + w, y + h);

    // right
    context.moveTo(x + (w / 2), y);
    context.lineTo(x, y + h);

    // bottom
    context.moveTo(x, y + h);
    context.lineTo(x + w, y + h);

    //var lineHeight = y + h;

    // line
    context.moveTo(x, y + h / 3);
    context.lineTo(x + w, y + h / 3);

    context.stroke();
}

function drawEarthSymbol(c, x, y, w, h) {
    // left
    context.moveTo(x, y);
    context.lineTo(x + (w / 2), y + h);

    // right
    context.moveTo(x + w, y);
    context.lineTo(x + (w / 2), y + h);

    // bottom
    context.moveTo(x, y);
    context.lineTo(x + w, y);

    var lineHeight = y + h;

    // line
    context.moveTo(x, lineHeight - h / 3);
    context.lineTo(x + w, lineHeight - h / 3);

    context.stroke();
}

function drawPlayer(c, x, y, w, h, isLine, health, maxHealth, takingDamage)
{
    context.beginPath();

    if (selectedSkill === SKILL_NONE)
    {
        context.fillStyle = c;
    }
    else
    {
        context.fillStyle = "#000000";
    }

    context.fill();
    
    if (selectedSkill === SKILL_FIRE)
    {
        context.strokeStyle = "#FF1000";
        context.arc(x, y, w, 0, 2 * Math.PI, false);
        drawFireSymbol("#FF1000", x - (w / 2), y - (h / 2), w, h);
    }
    else if (selectedSkill === SKILL_WATER)
    {
        context.strokeStyle = "#007BFF";
        context.arc(x, y, w, 0, 2 * Math.PI, false);
        drawWaterSymbol("#007BFF", x - (w / 2), y - (h / 2), w, h);
    }
    else if (selectedSkill === SKILL_AIR)
    {
        context.strokeStyle = "#FFFF07";
        context.arc(x, y, w, 0, 2 * Math.PI, false);
        drawAirSymbol("#FFFF07", x - (w / 2), y - (h / 2), w, h);
    }
    else if (selectedSkill === SKILL_EARTH)
    {
        context.strokeStyle = "#0CFF00";
        context.arc(x, y, w, 0, 2 * Math.PI, false);
        drawEarthSymbol("#0CFF00", x - (w / 2), y - (h / 2), w, h);
    }

    context.stroke();

    drawHealth(x - w, (y - w) - (w / 4), w * 2, h, health, maxHealth, playerTakingDamage);

    context.closePath();
}

function drawText(str, c, x, y, style)
{
    context.beginPath();

    context.fillStyle = "#" + c;
    context.font = style;
    context.fillText(str, x - str.length * 4.5, y);

    context.closePath();
}

function drawHealth(x, y, w, h, health, maxHealth, damageState)
{
    if (health !== 0)
    {
        var healthPercentage = health / maxHealth * 100;

        context.fillStyle = "#404040";
        context.fillRect(x, y, w, 5);

        if (damageState === HEALTH_EFFECT_DAMAGE)
        {
            context.fillStyle = "#FF1500";
        }
        else if(damageState === HEALTH_EFFECT_HEAL)
        {
            context.fillStyle = "#00A5FF";
        }
        else
        {
            context.fillStyle = "#1CFF60";
        }

        context.fillRect(x, y, (((w) / 100) * healthPercentage), 5);
    }
}

function main()
{
    // globals

    // time
    lastTime = Date.now();

    ENEMY_TIMER_MAX = 2.0;
    newEnemyTimer = ENEMY_TIMER_MAX;

    MAX_ENEMY_COUNT = 100;
    
    // canvas size
    width = 1200;
    height = 700;

    var temp = (width / 8) - 10;

    selectedSkill = SKILL_NONE;

    playerScore = 0;

    // scene
    scenes =
        [
            // Menu scene
            [
                //[0, "0026FF", 200, 200, 100, 100, false, 200, 200, 0, true],
                [0, "Alchemist's", drawRect, "FFFFFF", width / 2 - (200 / 2), -1100, 200, 50, false, width / 2 - (200 / 2) - 70, 60, 0, false, null, 3, true, false, "bold 42px Arial", 200, 50, 0, 0, 3, false, 0],
                [0, "NIGHT", drawRect, "FF0000", width / 2 - (200 / 2) - 8000, 200, 200, 50, false, width / 2 - (200 / 2) - 130, 120, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "MARE", drawRect, "FF0000", width / 2 - (200 / 2) + 8000, 200, 200, 50, false, width / 2 - (200 / 2) + 35, 120, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "Fire", drawFire, "FF1000", temp * 1 - 400, 350, 50, 50, false, temp * 1, 350, 0, false, null, 3, true, true, "bold 16px Arial", 50, 50, 0, 0, 3, false, 0],
                [0, "Water", drawWater, "007BFF", temp * 3 + 1000, 350, 50, 50, false, temp * 3, 350, 0, false, null, 3, true, true, "bold 16px Arial", 50, 50, 0, 0, 3, false, 0],
                [0, "Air", drawAir, "FFFF07", temp * 5, 350 - 1000, 50, 50, false, temp * 5, 350, 0, false, null, 3, true, true, "bold 16px Arial", 50, 50, 0, 0, 3, false, 0],
                [0, "Earth", drawEarth, "0CFF00", temp * 7, 350 + 1000, 50, 50, false, temp * 7, 350, 0, false, null, 3, true, true, 14, 50, 50, 0, 0, 3, false, 0],
                //[0, "Player", drawPlayer, "727272", width / 2, height / 2 + 150, 0, 0, false, width / 2, height / 2 + 150, 0, false, null, 1, false, true, "bold 16px Arial", 40, 40, 0, 1000, 3, true, 0],
                //[0, "What a nightmare!", drawPlayer, "E8FFFB", width / 2 + 120, height / 2 + 80, 0, 0, false, width / 2 + 120, height / 2 + 80, 0, false, null, 1, true, false, "italic 14px Arial", 40, 40, 0, 1000, 10, true, 0],
                [0, "Start Game", drawRect, "FFFFFF", width / 2 - (200 / 2), height + 200, 200, 50, false, width / 2 - (200 / 2), height - 100, 0, false, "startGame", 3, true, true, "bold 16px Arial", 200, 50, 0, 0, 3, false, 0],
            ],
            // Game scene
            [
                [0, "Player", drawPlayer, "727272", width / 2, height / 2, 0, 0, false, width / 2, height / 2, 0, false, null, 1, false, true, "bold 16px Arial", 40, 40, 1000, 1000, 3, true, 0],

                [0, "The large symbol above is you!", drawPlayer, "E8FFFB", width / 2 + 20, height / 2 + 20, 0, 0, false, width / 2 + 20, height / 2 + 20, 2, false, null, 1, true, false, "italic 14px Arial", 40, 40, 0, 1000, 10, true, 0],
                [0, "Right clicking moves; Q, W, E, R switches element and left click shoots the current element.", drawPlayer, "E8FFFB", width / 2 + 100, height / 2 + 45, 0, 0, false, width / 2 + 100, height / 2 + 45, 4, false, null, 1, true, false, "italic 14px Arial", 40, 40, 0, 1000, 10, true, 0],

                [0, "Fire", drawFire, "A0A0A0", width - 400, height + 100, 30, 30, false, width - 320, height - 80, 0, false, null, 3, true, true, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],
                [0, "Fire_ACTIVE", drawFire, "FF1000", width - 400, height + 100, 30, 30, false, width - 320, height - 80, 0, false, null, 3, false, false, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],
               
                [0, "Water", drawWater, "A0A0A0", width - 300, height + 100, 30, 30, false, width - 240, height - 80, 0, false, null, 3, true, true, "bold 16px Arial", 30, 30, 0, 0, 3, false, false],
                [0, "Water_ACTIVE", drawWater, "007BFF", width - 300, height + 100, 30, 30, false, width - 240, height - 80, 0, false, null, 3, false, false, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],

                [0, "Air", drawAir, "A0A0A0", width - 200, height + 100, 30, 30, false, width - 160, height - 80, 0, false, null, 3, true, true, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],
                [0, "Air_ACTIVE", drawAir, "FFFF07", width - 200, height + 100, 30, 30, false, width - 160, height - 80, 0, false, null, 3, false, false, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],

                [0, "Earth", drawEarth, "A0A0A0", width - 100, height + 100, 30, 30, false, width - 80, height - 80, 0, false, null, 3, true, true, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],
                [0, "Earth_ACTIVE", drawEarth, "0CFF00", width - 100, height + 100, 30, 30, false, width - 80, height - 80, 0, false, null, 3, false, false, "bold 16px Arial", 30, 30, 0, 0, 3, false, 0],

                [0, "End Game", drawRect, "FFFFFF", width - 110, -110, 100, 50, false, width - 110, 10, 0, false, "endCurrentGame", 3, true, true, "bold 16px Arial", 100, 50, 0, 0, 3, false, 0],
            ],
            // Score scene
            [
               // [0, "Alchemist's", drawRect, "FFFFFF", width / 2 - (200 / 2), -1100, 200, 50, false, width / 2 - (200 / 2) - 70, 60, 0, false, null, 3, true, false, "bold 42px Arial", 200, 50, 0, 0, 3, false, 0],
               // [0, "NIGHT", drawRect, "FF0000", width / 2 - (200 / 2) - 8000, 200, 200, 50, false, width / 2 - (200 / 2) - 130, 120, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
               // [0, "MARE", drawRect, "FF0000", width / 2 - (200 / 2) + 8000, 200, 200, 50, false, width / 2 - (200 / 2) + 35, 120, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "GAME", drawRect, "FF0000", width / 2 - (200 / 2) - 32000, 450, 250, 50, false, width / 2 - (200 / 2) - 130, 250, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "OVER", drawRect, "FF0000", width / 2 - (200 / 2) + 32000, 450, 250, 50, false, width / 2 - (200 / 2) + 40, 250, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "Score: ", drawRect, "FFFFFF", width / 2 - (200 / 2) - 60, 200, 120, 50, false, width / 2 - (200 / 2) - 60, 120, 0, false, null, 3, true, false, "bold 50px Times New Roman", 200, 50, 0, 0, 3, false, 0],
                [0, "Thanks for playing!", drawPlayer, "FFFFF", width / 2, height / 2 + 45, 0, 0, false, width / 2, height / 2 + 45, 0, false, null, 1, true, false, "italic 16px Arial", 40, 40, 0, 1000, 10, true, 0],
                [0, "Restart", drawRect, "FFFFFF", width / 2 - (200 / 2), height + 200, 200, 50, false, width / 2 - (200 / 2), height - 100, 0, false, "restartGame", 3, true, true, "bold 16px Arial", 200, 50, 0, 0, 3, false, 0],
            ]
        ];

    changeScene(SCENE_MENU);

    // active object
    activeObject = null;

    // canvas and context
    c = document.getElementById("canvas");
    context = c.getContext("2d");


    c.width = width;
    c.height = height;

    // see bounding boxes
    boundingBoxes = false;

    // mouse position
    mousePosition = { "x": 0, "y": 0 };

    setupInput();

    // Main loop
    (function mainLoop()
    {
        var currentTime = Date.now();
        var elapsed = (currentTime - lastTime) / 1000;

        requestAnimationFrame(mainLoop);
        update(elapsed);
        render();

        lastTime = currentTime;
    })();
}

function changeScene(sceneType) {
    currentScene = sceneType;

    workingScene = [];

    for (var i = 0; i < scenes[currentScene].length; i++)
    {
        addToWorkingScene(scenes[currentScene][i].slice(0));
    }
}

function addToWorkingScene(object)
{
    if (object.length !== 25)
    {
        console.log(object[SO_NAME] + " is not the right length");
    }

    workingScene.push(object);
    updateSceneIDs();
}

function updateSceneIDs()
{
    for (var i = 0; i < workingScene.length; i++)
    {
        workingScene[i][SO_ID] = i;
    }
}

function setupInput()
{
    window.onmousemove = mouseMove;
    window.onclick = mouseClick;

    var html = document.getElementsByTagName("html")[0];

    html.oncontextmenu = canvasContextMenu;

    window.onkeypress = keyPress;

    function mouseMove(event)
    {
        event = event || window.event;
        mousePosition.x = event.pageX - canvas.getBoundingClientRect().left;
        mousePosition.y = event.pageY - canvas.getBoundingClientRect().top;
    }

    function mouseClick(event)
    {
        if (event.button === 0)
        {
            if (currentScene === SCENE_GAME)
            {
                useSkill();
            }

            leftClick();
        }
    }

    function canvasContextMenu(event)
    {
        if (event.button === 2)
        {
            rightClick();
        }
        event.preventDefault();
    }

    function keyPress(event)
    {
        var key = (event.keyCode || event.charCode);

        if (key === 49)
        {
            boundingBoxes = !boundingBoxes;
        }

        if (currentScene === SCENE_GAME)
        {
            if (key === 113)
            {
                if (selectedSkill === SKILL_FIRE)
                {
                    //selectedSkill = SKILL_NONE;
                }
                else
                {
                    selectedSkill = SKILL_FIRE;
                }
            }
            else if (key === 119)
            {
                if (selectedSkill === SKILL_WATER) {
                    //selectedSkill = SKILL_NONE;
                }
                else {
                    selectedSkill = SKILL_WATER;
                }
            }
            else if (key === 114)
            {
                if (selectedSkill === SKILL_EARTH)
                {
                    //selectedSkill = SKILL_NONE;
                }
                else
                {
                    selectedSkill = SKILL_EARTH;
                }
            }
            else if (key === 101)
            {
                if (selectedSkill === SKILL_AIR) {
                    //selectedSkill = SKILL_NONE;
                }
                else {
                    selectedSkill = SKILL_AIR;
                }
            }
        }
    }
}

function useSkill()
{
    if (selectedSkill !== SKILL_NONE)
    {
        var playerSO = findSceneObject("Player");

        var activeSO;
        var SO;

        if (selectedSkill === SKILL_FIRE)
        {
            activeSO = findSceneObject("Fire_ACTIVE");
            SO = findSceneObject("Fire");
        }
        else if (selectedSkill === SKILL_WATER)
        {
            activeSO = findSceneObject("Water_ACTIVE");
            SO = findSceneObject("Water");
        }
        else if (selectedSkill === SKILL_EARTH)
        {
            activeSO = findSceneObject("Earth_ACTIVE");
            SO = findSceneObject("Earth");
        }
        else if (selectedSkill === SKILL_AIR)
        {
            activeSO = findSceneObject("Air_ACTIVE");
            SO = findSceneObject("Air");
        }

        var size = 15;
        addToWorkingScene([0, SO[SO_NAME].toUpperCase() + "_PROJECTILE", SO[SO_TYPE], activeSO[SO_COLOUR], playerSO[SO_X], playerSO[SO_Y], size / 4, size / 4, false, mousePosition.x - (size / 2), mousePosition.y - (size / 2), 5, false, null, 8, false, true, "bold 16px Arial", size, size, 0, 0, 3, true, 0]);
    }
}

function startGame()
{
    ENEMY_TIMER_MAX = 2
    newEnemyTimer = ENEMY_TIMER_MAX;
    selectedSkill = SKILL_FIRE;
    playerScore = 0;
    changeScene(SCENE_GAME);
}

function endCurrentGame()
{
    changeScene(SCENE_SCORE);
}

function restartGame()
{
    selectedSkill = SKILL_NONE;
    changeScene(SCENE_MENU);
}

function pointInRectangle(point, rectangle)
{
    return (point[0] >= rectangle[0] && point[0] <= rectangle[0] + rectangle[2] && point[1] >= rectangle[1] && point[1] <= rectangle[1] + rectangle[3]);
}

function leftClick()
{
    activeObject = null;
    for (var i = 0; i < workingScene.length; i++) {
        if (pointInRectangle([mousePosition.x, mousePosition.y], getObjectRectangle(workingScene[i])))
        {
            if (workingScene[i][SO_CLICKABLE])
            {
                activeObject = i;
            }

            if (workingScene[i][SO_CLICK_EVENT] !== null) {
                var eventFunction = window[workingScene[i][SO_CLICK_EVENT]];

                if (typeof eventFunction === "function") {
                    eventFunction();
                }
            }
        }
    }
}

function rightClick()
{
    if (activeObject != null)
    {
        var size = 20;
        addToWorkingScene([0, workingScene[activeObject][SO_NAME], workingScene[activeObject][SO_TYPE], workingScene[activeObject][SO_COLOUR], workingScene[activeObject][SO_X], workingScene[activeObject][SO_Y], size / 6, size / 6, false, mousePosition.x - (size / 2), mousePosition.y - (size / 2), 5, false, null, 8, true, true, "bold 16px Arial", size, size, 0, 0, 3, false, 0]);
    }
    else
    {
        if (currentScene === SCENE_GAME)
        {
            workingScene[0][SO_TARGET_X] = mousePosition.x;
            workingScene[0][SO_TARGET_Y] = mousePosition.y;
        }
    }
}

function checkInput()
{
    if (currentScene === SCENE_GAME)
    {
        var fireActiveSO = findSceneObject("Fire_ACTIVE");
        var waterActiveSO = findSceneObject("Water_ACTIVE");
        var airActiveSO = findSceneObject("Air_ACTIVE");
        var earthActiveSO = findSceneObject("Earth_ACTIVE");

        var fireSO = findSceneObject("Fire");
        var waterSO = findSceneObject("Water");
        var airSO = findSceneObject("Air");
        var earthSO = findSceneObject("Earth");

        if (fireActiveSO && waterActiveSO && airActiveSO && earthActiveSO)
        {
            fireActiveSO[SO_SHOWGRAPHIC] = false;
            waterActiveSO[SO_SHOWGRAPHIC] = false;
            airActiveSO[SO_SHOWGRAPHIC] = false;
            earthActiveSO[SO_SHOWGRAPHIC] = false;

            fireSO[SO_COLOUR] = "A0A0A0";
            waterSO[SO_COLOUR] = "A0A0A0";
            airSO[SO_COLOUR] = "A0A0A0";
            earthSO[SO_COLOUR] = "A0A0A0";

            if (selectedSkill === SKILL_FIRE) {
                fireActiveSO[SO_SHOWGRAPHIC] = true;
                fireSO[SO_COLOUR] = fireActiveSO[SO_COLOUR];
            }
            else if (selectedSkill === SKILL_WATER) {
                waterActiveSO[SO_SHOWGRAPHIC] = true;
                waterSO[SO_COLOUR] = waterActiveSO[SO_COLOUR];
            }
            else if (selectedSkill === SKILL_AIR) {
                airActiveSO[SO_SHOWGRAPHIC] = true;
                airSO[SO_COLOUR] = airActiveSO[SO_COLOUR];
            }
            else if (selectedSkill === SKILL_EARTH) {
                earthActiveSO[SO_SHOWGRAPHIC] = true;
                earthSO[SO_COLOUR] = earthActiveSO[SO_COLOUR];
            }
        }
    }
}

function findSceneObject(name)
{
    var foundObject = null;

    for(var i = 0; i < workingScene.length; i++)
    {
        if (name === workingScene[i][SO_NAME])
        {
            foundObject = workingScene[i];
        }
    }

    return foundObject;
}

function findSceneObjects(name)
{
    var foundObjects = [];

    for(var i = 0; i < workingScene.length; i++)
    {
        if (name === workingScene[i][SO_NAME])
        {
            
            foundObjects.push(workingScene[i]);
        }
    }
    return foundObjects;
}

function checkHover()
{
    for (var i = 0; i < workingScene.length; i++)
    {
        if (workingScene[i][SO_CLICKABLE])
        {
            if (pointInRectangle([mousePosition.x, mousePosition.y], getObjectRectangle(workingScene[i])))
            {
                workingScene[i][SO_HOVER] = true;
            }
            else
            {
                workingScene[i][SO_HOVER] = false;
            }
        }
    }
}

function checkLifetimes(elapsed)
{
    var itemsToRemove = [];

    for (var i = 0; i < workingScene.length; i++)
    {
        if (workingScene[i][SO_LIFETIME] !== 0)
        {

            workingScene[i][SO_LIFETIME] -= elapsed;

            if (workingScene[i][SO_LIFETIME] < 0)
            {
                itemsToRemove.push(workingScene[i]);
            }
        }
    }

    for(var i = 0; i < itemsToRemove.length; i++)
    {
        removeSceneObject(itemsToRemove[i][SO_ID]);
    }
}

function update(elapsed)
{
    checkInput();
    checkHover();

    checkLifetimes(elapsed);

    //doMove();

    moveObjects(elapsed);
    sizeObjects(elapsed);

    pruneProjectiles();

    if (playerScore > 50)
    {
        ENEMY_TIMER_MAX = 0.15;
    }
    else if (playerScore > 35)
    {
        ENEMY_TIMER_MAX = 0.20;
    }
    else if (playerScore > 25)
    {
        ENEMY_TIMER_MAX = 0.5;
    }
    else if (playerScore > 15)
    {
        ENEMY_TIMER_MAX = 0.75;
    }
    else if (playerScore > 10)
    {
        ENEMY_TIMER_MAX = 1.0;
    }
    else if (playerScore > 5)
    {
        ENEMY_TIMER_MAX = 1.5;
    }

    if (currentScene === SCENE_GAME)
    {
        enemyGeneration(elapsed);
        enemyMovement();

        checkCollisions(elapsed);
    }
    else if (currentScene === SCENE_SCORE)
    {
        workingScene[2][SO_NAME] = "Score: " + playerScore;
    }
}

function pruneProjectiles()
{
    for (var i = 0; i < workingScene.length; i++)
    {
        if (workingScene[i][SO_NAME].indexOf("PROJECTILE") !== -1)
        {
            var currentX = workingScene[i][SO_X];
            var currentY = workingScene[i][SO_Y];

            var targetX = workingScene[i][SO_TARGET_X];
            var targetY = workingScene[i][SO_TARGET_Y];

            var distance = Math.sqrt(Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2));
            
            if (distance < 1.0)
            {
                removeSceneObject(workingScene[i][SO_ID]);
            }
        }
    }
}

function getCollidables()
{
    var objects = [];

    for (var i = 0; i < workingScene.length; i++) {
        if (workingScene[i][SO_COLLIDEABLE])
        {
            objects.push(workingScene[i]);
        }
    }

    return objects;
}

function getBoundingBox(object)
{
    var points = [];

    if (object[SO_NAME] === "Player")
    {
        points = [
            [object[SO_X] - object[SO_WIDTH], object[SO_Y] - object[SO_HEIGHT]],
            [(object[SO_X] + object[SO_WIDTH]), object[SO_Y] - object[SO_HEIGHT]],
            [object[SO_X] - object[SO_WIDTH], (object[SO_Y] + object[SO_HEIGHT])],
            [(object[SO_X] + object[SO_WIDTH]), (object[SO_Y] + object[SO_HEIGHT])]
        ];
    }
    else
    {
        points = [
            [object[SO_X], object[SO_Y]],
            [(object[SO_X] + object[SO_WIDTH]), object[SO_Y]],
            [object[SO_X], (object[SO_Y] + object[SO_HEIGHT])],
            [(object[SO_X] + object[SO_WIDTH]), (object[SO_Y] + object[SO_HEIGHT])]
        ];
    }

    return points;
}

function checkCollidingObjects(collidingObjects, checkValue, exact)
{
    var object = false;

    for (var i = 0; i < collidingObjects.length; i++)
    {
        if (exact)
        {
            if (collidingObjects[i][SO_NAME] === checkValue)
            {
                object = collidingObjects[i];
            }
        }
        else
        {
            if (collidingObjects[i][SO_NAME].indexOf(checkValue) !== -1)
            {
                object = collidingObjects[i];
            }
        }

    }

    return object;
}

function getCollidingObject(collidingObjects, name)
{
    var object;
    for(var i = 0; i < collidingObjects; i++)
    {
        if (collidingObjects[i][SO_NAME] === name)
        {
            object = collidingObjects[i];
        }
    }
    return object;
}

function getPlayerCurrentType()
{
    var type = "";
    if (selectedSkill === SKILL_FIRE)
    {
        type = "FIRE";
    }
    else if (selectedSkill === SKILL_WATER)
    {
        type = "WATER";
    }
    else if (selectedSkill === SKILL_AIR)
    {
        type = "AIR";
    }
    else if (selectedSkill === SKILL_EARTH)
    {
        type = "EARTH";
    }
    return type;
}

function checkCollisions(elapsed)
{
    var objects = getCollidables();

    playerTakingDamage = HEALTH_EFFECT_NONE;

    var itemsToRemove = [];

    for(var i = 0; i < objects.length; i++)
    {
        for(var j = 0; j < objects.length; j++)
        {
            if (i !== j)
            {
                objects[i][SO_TAKING_DAMAGE] = HEALTH_EFFECT_NONE;;
                objects[j][SO_TAKING_DAMAGE] = HEALTH_EFFECT_NONE;

                var object1_points = getBoundingBox(objects[i]);
                var object2_rect = getObjectRectangle(objects[j]);

                for (var p = 0; p < object1_points.length; p++) {
                    if (pointInRectangle(object1_points[p], object2_rect)) {

                        var collidingObjects = [objects[i], objects[j]];

                        if (checkCollidingObjects(collidingObjects, "Player", true) && checkCollidingObjects(collidingObjects, "ENEMY", false))
                        {
                            var enemy = checkCollidingObjects(collidingObjects, "ENEMY", false);
                            var enemyType = enemy[SO_NAME].split('_')[0];

                            var playerCurrentType = getPlayerCurrentType();

                            if (enemyType === playerCurrentType)
                            {
                                addPlayerHealth(elapsed);
                            }
                            else
                            {
                                removePlayerHealth(elapsed);
                            }
                        }

                        if (checkCollidingObjects(collidingObjects, "PROJECTILE", false) && checkCollidingObjects(collidingObjects, "ENEMY", false))
                        {
                            var projectile = checkCollidingObjects(collidingObjects, "PROJECTILE", false);
                            var enemy = checkCollidingObjects(collidingObjects, "ENEMY", false);
                            
                            var objectToRemove = projectileHitEnemy(projectile, enemy, elapsed);

                            if (objectToRemove)
                            {
                                if (itemsToRemove.indexOf(objectToRemove) === -1)
                                {
                                    itemsToRemove.push(objectToRemove);
                                }
                            }
                        }
                    }
                }
            }

        }
    }

    for (var i = 0; i < itemsToRemove.length; i++)
    {
        var enemy = workingScene[itemsToRemove[i]];

        if (enemy !== undefined)
        {
            removeSceneObject(enemy[SO_ID]);
        }
        
        addToPlayerScore(enemy);
    }

}

function addToPlayerScore(enemy)
{
    var plusOne = [0, "+1", drawFire, "FFF37A", enemy[SO_X], enemy[SO_Y], 0, 0, false, enemy[SO_X], enemy[SO_Y] - 100, 1, false, null, 5, true, false, "bold 16px Arial", 25, 25, 100, 100, 10, true, 0];
    addToWorkingScene(plusOne);
    playerScore++;
}

function projectileHitEnemy(projectile, enemy, elapsed)
{
    var projectileType = projectile[SO_NAME].split('_')[0];
    var enemyType = enemy[SO_NAME].split('_')[0];

    if (enemy[SO_HEALTH] > 0)
    {
        if (enemyType === "FIRE") {
            if (projectileType === "WATER") {
                enemy[SO_HEALTH] -= 100 * elapsed;
                enemy[SO_TAKING_DAMAGE] = HEALTH_EFFECT_DAMAGE;
            }
        }
        else if (enemyType === "WATER") {
            if (projectileType === "FIRE") {
                enemy[SO_HEALTH] -= 100 * elapsed;
                enemy[SO_TAKING_DAMAGE] = HEALTH_EFFECT_DAMAGE;
            }
        }
        else if (enemyType === "AIR") {
            if (projectileType === "EARTH") {
                enemy[SO_HEALTH] -= 100 * elapsed;
                enemy[SO_TAKING_DAMAGE] = HEALTH_EFFECT_DAMAGE;
            }
        }
        else if (enemyType === "EARTH") {
            if (projectileType === "AIR") {
                enemy[SO_HEALTH] -= 100 * elapsed;
                enemy[SO_TAKING_DAMAGE] = HEALTH_EFFECT_DAMAGE;
            }
        }

        if (projectileType === enemyType)
        {
            if (enemy[SO_HEALTH] < 100)
            {
                enemy[SO_HEALTH] += enemy[SO_HEALTH_MAX] * elapsed;
            }
            enemy[SO_TAKING_DAMAGE] = HEALTH_EFFECT_HEAL;
        }

        return false;
    }
    else
    {
        return enemy[SO_ID];
    }
}

function removeSceneObject(id)
{
    if (workingScene[id] !== undefined)
    {
        // FIXME: Enemies with health shouldn't have got this far in the removal process.
        if (workingScene[id][SO_NAME].indexOf("ENEMY") !== -1)
        {
            if (workingScene[id][SO_HEALTH] <= 0)
            {
                workingScene.splice(id, 1);
                updateSceneIDs();
            }
            else
            {
                //console.log("This shouldn't happen...")
            }
        }
        else
        {
            workingScene.splice(id, 1);
            updateSceneIDs();
        }
    }
}

function removePlayerHealth(elapsed)
{
    var player = workingScene[0];


    if (player[SO_HEALTH] > 0)
    {
        player[SO_HEALTH] -= 100 * elapsed;
    }
    else
    {
        changeScene(SCENE_SCORE);
    }

    playerTakingDamage = HEALTH_EFFECT_DAMAGE;
}

function addPlayerHealth(elapsed)
{
    var player = workingScene[0];

    if (player[SO_HEALTH] < player[SO_HEALTH_MAX])
    {
        player[SO_HEALTH] += 100 * elapsed;

    }

    playerTakingDamage = HEALTH_EFFECT_HEAL;
}

function enemyGeneration(elapsed)
{
    newEnemyTimer -= elapsed;

    var enemies = findSceneObjects("FIRE_ENEMY").concat(findSceneObjects("WATER_ENEMY").concat(findSceneObjects("AIR_ENEMY").concat(findSceneObjects("EARTH_ENEMY"))));

    if (newEnemyTimer < 0.0 && enemies.length !== MAX_ENEMY_COUNT)
    {
        createNewEnemy();
        newEnemyTimer = ENEMY_TIMER_MAX;
    }
}

function createNewEnemy()
{
    var size = 25;
    
    var randomX = Math.floor(Math.random() * width);
    var randomY = Math.floor(Math.random() * height);

    var randomSpeed = Math.random();

    var randomType = Math.floor(Math.random() * 4);

    if (randomType === 1)
    {
        addToWorkingScene([0, "FIRE_ENEMY", drawFire, "FF1000", randomX, randomY, 0, 0, false, randomX, randomY, 0, false, null, randomSpeed, false, true, "bold 16px Arial", size, size, 100, 100, 5, true, 0]);
    }
    else if (randomType === 2)
    {
        addToWorkingScene([0, "WATER_ENEMY", drawWater, "007BFF", randomX, randomY, 0, 0, false, randomX, randomY, 0, false, null, randomSpeed, false, true, "bold 16px Arial", size, size, 100, 100, 5, true, 0]);
    }
    else if (randomType === 3)
    {
        addToWorkingScene([0, "AIR_ENEMY", drawAir, "FFFF07", randomX, randomY, 0, 0, false, randomX, randomY, 0, false, null, randomSpeed, false, true, "bold 16px Arial", size, size, 100, 100, 5, true, 0]);
    }
    else if (randomType === 4)
    {
        addToWorkingScene([0, "EARTH_ENEMY", drawEarth, "0CFF00", randomX, randomY, 0, 0, false, randomX, randomY, 0, false, null, randomSpeed, false, true, "bold 16px Arial", size, size, 100, 100, 5, true, 0]);
    }
}

function enemyMovement()
{
    var player = findSceneObject("Player");
    var enemies = findSceneObjects("FIRE_ENEMY").concat(findSceneObjects("WATER_ENEMY").concat(findSceneObjects("AIR_ENEMY").concat(findSceneObjects("EARTH_ENEMY"))));

    if (enemies.length !== 0)
    {
        for(var i = 0; i < enemies.length; i++)
        {
            enemies[i][SO_TARGET_X] = player[SO_X];
            enemies[i][SO_TARGET_Y] = player[SO_Y];
        }
    }
    
}

function getObjectRectangle(object)
{
    var rect = [];

    if (object[SO_NAME] === "Player")
    {
        rect = [object[SO_X] - object[SO_WIDTH], object[SO_Y] - object[SO_WIDTH], object[SO_WIDTH] * 2, object[SO_HEIGHT] * 2];
    }
    else
    {
        rect = [object[SO_X], object[SO_Y], object[SO_WIDTH], object[SO_HEIGHT]];
    }
    return rect;
}

function moveObjects(elapsed)
{
    for (var i = 0; i < workingScene.length; i++)
    {
        var obj = workingScene[i];

        var startingX = obj[SO_X];
        var startingY = obj[SO_Y];

        var targetX = obj[SO_TARGET_X];
        var targetY = obj[SO_TARGET_Y];

        var x = targetX - startingX;
        var y = targetY - startingY;

        workingScene[i][SO_X] += (x * workingScene[i][SO_MOVESPEED] * elapsed);
        workingScene[i][SO_Y] += (y * workingScene[i][SO_MOVESPEED] * elapsed);
    }
}

function sizeObjects(elapsed)
{
    for (var i = 0; i < workingScene.length; i++) {
        var obj = workingScene[i];

        var startingX = obj[SO_WIDTH];
        var startingY = obj[SO_HEIGHT];

        var targetX = obj[SO_TARGET_WIDTH];
        var targetY = obj[SO_TARGET_HEIGHT];

        var x = targetX - startingX;
        var y = targetY - startingY;

        if (elapsed < 1)
        {
           workingScene[i][SO_WIDTH] += (x * workingScene[i][SO_SIZE_SPEED] * elapsed);
           workingScene[i][SO_HEIGHT] += (y * workingScene[i][SO_SIZE_SPEED] * elapsed);
        }
    }
}

function doMove()
{
    moveX = 9;
    moveY = 4;

    workingScene[0][SO_X] += moveX;
    workingScene[0][SO_Y] += moveY;

    if ((workingScene[0][SO_X] + workingScene[0][SO_WIDTH]) > width) {
        workingScene[0][SO_X] -= moveX;
    }

    if ((workingScene[0][SO_Y] + workingScene[0][SO_HEIGHT]) > height) {
        workingScene[0][SO_Y] -= moveY;
    }
}

function render()
{
    clearRect("#000", 0, 0, width, height, false);
    for(var i = 0; i < workingScene.length; i++)
    {
        var drawingFunction = workingScene[i][SO_TYPE];

        if (workingScene[i][SO_SHOWGRAPHIC])
        {
            drawingFunction("#" + workingScene[i][SO_COLOUR], workingScene[i][SO_X], workingScene[i][SO_Y], workingScene[i][SO_WIDTH], workingScene[i][SO_HEIGHT], false, workingScene[i][SO_HEALTH], workingScene[i][SO_HEALTH_MAX], workingScene[i][SO_TAKING_DAMAGE]);
        }


        var col = workingScene[i][SO_HOVER] ? 'red' : 'green';

        if (activeObject != null && activeObject === i)
        {
            col = 'purple';
        }

        if (col !== 'green')
        {
            drawRect(col, workingScene[i][SO_X] - 10, workingScene[i][SO_Y] - 10, workingScene[i][SO_WIDTH] + 20, workingScene[i][SO_HEIGHT] + 45, true);
        }

        var name = workingScene[i][SO_LIFETIME] !== 0 ? workingScene[i][SO_NAME] /*+ " (" + workingScene[i][SO_LIFETIME].toFixed(1) + "s)"*/ : workingScene[i][SO_NAME];

        if (workingScene[i][SO_SHOWNAME])
        {
            if (workingScene[i][SO_TYPE] === drawRect)
            {
                drawText(name, workingScene[i][SO_COLOUR], workingScene[i][SO_X] + (workingScene[i][SO_WIDTH] / 2), workingScene[i][SO_Y] + workingScene[i][SO_HEIGHT] - 20, workingScene[i][SO_TEXTSTYLE]);
            }
            else
            {
                drawText(name, workingScene[i][SO_COLOUR], workingScene[i][SO_X] + (workingScene[i][SO_WIDTH] / 2), workingScene[i][SO_Y] + workingScene[i][SO_HEIGHT] + 25, workingScene[i][SO_TEXTSTYLE]);
            }
            
        }

        if (boundingBoxes)
        {
            var bounds = getBoundingBox(workingScene[i]);

            for(var a = 0; a < bounds.length; a++)
            {
                drawRect("#ffe", bounds[a][0] - 6, bounds[a][1] - 6, 12, 12);
            }

            var rect = getObjectRectangle(workingScene[i]);
            drawRect("#14FF0C", rect[0], rect[1], rect[2], rect[3], true);
        }

        if (currentScene === SCENE_GAME)
        {
            drawText("Score: " + playerScore, "FFFFFF", 70, 40, "bold 30px Arial");
        }
    }
}

main();