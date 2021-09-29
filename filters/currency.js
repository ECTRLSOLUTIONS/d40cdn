document.addEventListener("DOMContentLoaded", () => {
    Vue.filter("currency", (value, symbol = "€") => {
        return parseFloat(value).toFixed(2) + symbol;
    });
});
