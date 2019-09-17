$(document).ready(function () {

    $('#Form input').on('change', function () {

        difficulty = $('input[name=difficulty]:checked', '#Form').val();


        if (difficulty == 1) {
            document.cookie = "MaxGameArea = 30";
            document.cookie = "GameTime = 500";

        } else if (difficulty == 2) {
            document.cookie = "MaxGameArea = 20";
            document.cookie = "GameTime = 250";
        } else if (difficulty == 3) {
            document.cookie = "MaxGameArea = 15";
            document.cookie = "GameTime = 150";
        }
    });
});