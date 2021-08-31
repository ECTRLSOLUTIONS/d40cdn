document.addEventListener("DOMContentLoaded", function () {
    if (Liferay.ThemeDisplay.isSignedIn()) {
        Liferay.Service(
            "/role/get-user-roles",
            {
                userId: Liferay.ThemeDisplay.getUserId(),
            },
            (res) => {
                if (res.some((role) => role.name === "Administrator")) {
                    console.log("user is admin");
                } else {
                    console.log("user is NOT an admin");
                    Vue.config.devtools = false;
                }
            }
        );
    } else {
        console.log("user is not signed in, so is NOT an admin");
        Vue.config.devtools = false;
    }
});
