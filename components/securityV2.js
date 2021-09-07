document.addEventListener("DOMContentLoaded", () => {
    if (Liferay.ThemeDisplay.isSignedIn()) {
        Liferay.Service(
            "/role/get-user-roles",
            {
                userId: Liferay.ThemeDisplay.getUserId(),
            },
            (res) => {
                if (res.some((role) => role.name === "Administrator")) {
                    console.log("User is admin");
                } else {
                    console.log("User is not an admin");
                    Vue.config.devtools = false;
                }
            }
        );
    } else {
        console.log("User is not signed in, not an admin");
        Vue.config.devtools = false;
    }
});
