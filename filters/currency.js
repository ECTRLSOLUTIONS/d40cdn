document.addEventListener("DOMContentLoaded", () => {
    Vue.filter("currency", (value) => {
        return parseFloat(value).toFixed(2) + "€";
    });
});
