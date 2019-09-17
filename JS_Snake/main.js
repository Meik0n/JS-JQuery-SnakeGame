$(document).ready(function () {
    //para sacar los valores de las cookies
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //variables
    var maxGameArea = parseInt(getCookie("MaxGameArea"));
    var gameTime = parseInt(getCookie("GameTime"));

    //tablero
    var gameArea = $("#game-area");


    //serpiente
    var playerLength = 4;
    var playerPos = {
        "tr": 9,
        "td": 9
    };

    var playerDir = {
        "up": 1,
        "right": 2,
        "down": 3,
        "left": 4,
    };

    //direccion inicial
    var currentPlayerDir = playerDir["right"];


    //puntos
    var pointPosX = Math.floor(Math.random() * (maxGameArea - 1));
    var pointPosY = Math.floor(Math.random() * (maxGameArea - 1));

    var pointPos = {
        "posX": pointPosX,
        "posY": pointPosY
    }

    var frameCount = 0;
    var gameScore = 0;
    var playerIsDead = false;

    //funcion para dibujar la tabla
    function drawGameArea() {
        //añadimos filas y columnas
        for (var index = 0; index < maxGameArea; index++) {
            gameArea.append("<tr class ='tr" + index + "'></tr>");

            var thisTr = $(".tr" + index);

            for (var indexTd = 0; indexTd < maxGameArea; indexTd++) {
                thisTr.append("<td class ='td" + index + "td" + indexTd + "'></td>");
            }
        }
    }

    drawGameArea();


    //funcion para dibujar el punto
    function drawPoint() {

        var setPointPos = $(".td" + pointPos["posX"] + "td" + pointPos["posY"]);

        setPointPos.addClass("draw-point"); //añade la clase para cambiar el color del css
        //console.log("x:" + pointPosX + "y:" + pointPosY);
    }

    drawPoint();

    //cuando el player se come un punto
    function playerEatsPoint() {
        //colocar punto en la posicion random del tablero
        var setPointPos = $(".td" + pointPos["posX"] + "td" + pointPos["posY"]);

        setPointPos.removeClass("draw-point"); //quita el color

        //dibuja uno nuevo
        pointPosX = Math.floor(Math.random() * (maxGameArea - 1));
        pointPosX = Math.floor(Math.random() * (maxGameArea - 1));

        pointPos = {
            "posX": pointPosX,
            "posY": pointPosY
        }

        //coloca y añade el color
        setPointPos = $(".td" + pointPos["posX"] + "td" + pointPos["posY"]);

        setPointPos.addClass("draw-point");

        //console.log("x:" + pointPos["posX"] + "y:" + pointPos["posY"]);

        //suma score y longitud a la serpiente
        gameScore += 1;
        playerLength += 1;
    }

    //cambiar direccion cuando el jugador pulsa W A S D
    document.addEventListener("keydown", function (event) {
        console.log(event);
        if (event.which == 87) {
            currentPlayerDir = playerDir["up"];
        } else if (event.which == 68) {
            currentPlayerDir = playerDir["right"];
        } else if (event.which == 83) {
            currentPlayerDir = playerDir["down"];
        } else if (event.which == 65) {
            currentPlayerDir = playerDir["left"];
        }
    });


    //funcion para dibujar al player
    function drawPlayer() {
        frameCount += 1;
        var getPlayerPos;

        switch (currentPlayerDir) {

            //hacia arriba  W
            case 1:
                //mover a lo largo de una columna hacia el 0
                playerPos["tr"] -= 1;
                getPlayerPos = $(".td" + playerPos["tr"] + "td" + playerPos["td"]);
                //ir dibujando la serpiente cada frame
                getPlayerPos.addClass("draw-player framecount" + frameCount);
                //console.log(playerPos);
                break;

            //derecha  D
            case 2:

                playerPos["td"] += 1;
                getPlayerPos = $(".td" + playerPos["tr"] + "td" + playerPos["td"]);
                getPlayerPos.addClass("draw-player framecount" + frameCount);
                //console.log(playerPos);
                break;

            //abajo  S
            case 3:
                playerPos["tr"] += 1;
                getPlayerPos = $(".td" + playerPos["tr"] + "td" + playerPos["td"]);
                getPlayerPos.addClass("draw-player framecount" + frameCount);
                //console.log(playerPos);
                break;

            //izquierda  A
            case 4:
                playerPos["td"] -= 1;
                getPlayerPos = $(".td" + playerPos["tr"] + "td" + playerPos["td"]);
                getPlayerPos.addClass("draw-player framecount" + frameCount);
                //console.log(playerPos);
                break;
            default:
                alert("Error drawing player");
                break;
        }

        //calcular la distancia desde la cabeza a la cola
        var calcPlayerTailPos = frameCount - playerLength;
        var getPlayerTailPos = $(".framecount" + calcPlayerTailPos);

        //quitar el color en las casillas en las que ya no está
        getPlayerTailPos.removeClass("draw-player framecount" + frameCount);
    }

    //cuando muere el player
    function deathHandler() {
        document.getElementById("game-status").innerHTML = "Has Perdido :(";
    }

    //recalcular gamescore 
    function scoreHandler() {
        document.getElementById("game-score").innerHTML = gameScore;
    }

    scoreHandler();

    //esto sería el update de unity
    setInterval(function () {

        //para saber cuando choca contra si mismo el jugador
        var checkNextPlayerPosX = playerPos["tr"];
        var checkNextPlayerPosY = playerPos["td"];

        switch (currentPlayerDir) {
            case 1:
                checkNextPlayerPosX -= 1;
                break;
            case 2:
                checkNextPlayerPosY += 1;
                break;
            case 3:
                checkNextPlayerPosX += 1;
                break;
            case 4:
                checkNextPlayerPosY -= 1;
                break;
            default:
                alert("Error checking player collision");
                break;
        }
        //muerte pared
        if (playerPos["tr"] == maxGameArea || playerPos["td"] == maxGameArea
            || playerPos["tr"] == -1 || playerPos["td"] == -1) {
            deathHandler();
            playerIsDead = true;
        }
        //muerte tocarse a si mismo
        else if ($(".td" + checkNextPlayerPosX + "td" + checkNextPlayerPosY).hasClass("draw-player")) {
            deathHandler();
            playerIsDead = true;
        }
        //comer punto
        else if (playerPos["tr"] == pointPos["posX"] && playerPos["td"] == pointPos["posY"] && playerIsDead == false) {
            playerEatsPoint();
            drawPlayer();
            scoreHandler();
        }
        //dibujar player
        else if (playerIsDead == false) {
            drawPlayer();
        }
    }, gameTime)
});