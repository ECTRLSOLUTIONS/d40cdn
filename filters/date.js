document.addEventListener("DOMContentLoaded", () => {
    Vue.filter("date", (value, format = "DD/MM/YYYY") => {
        return moment(value).format(format);
    });
});
