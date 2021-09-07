document.addEventListener("DOMContentLoaded", () => {
    Vue.filter("time", (value) => {
        var sec_num = parseInt(value, 10),
            hours = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - hours * 3600) / 60),
            seconds = sec_num - hours * 3600 - minutes * 60,
            toRtn = "";

        if (hours > 0) {
            hours < 10 ? (hours = "0" + hours) : hours;
            minutes < 10 ? (minutes = "0" + minutes) : minutes;
            seconds < 10 ? (seconds = "0" + seconds) : seconds;

            toRtn = `${hours}:${minutes}:${seconds}`;
        } else {
            if (minutes > 0) {
                minutes < 10 ? (minutes = "0" + minutes) : minutes;
                seconds < 10 ? (seconds = "0" + seconds) : seconds;

                toRtn = `${minutes}:${seconds}`;
            } else {
                if (seconds > 0) {
                    seconds < 10 ? (seconds = "0" + seconds) : seconds;

                    toRtn = `00:${seconds}`;
                }
            }
        }

        return toRtn;
    });
});
