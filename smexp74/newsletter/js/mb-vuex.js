var store = new Vuex.Store({
    state: {
        count: 0,
        userName: Liferay.ThemeDisplay.getUserName(),
        siteName: 'Zainetto Verde',
        menu: [
            {
                "title": "RICHIESTE",
                "image": "urlimage",
                "url": "/backoffice/gestione-richieste",
                "description": "Gestione Richieste",
                "label": "Entra",
                "color": "indigo darken-3",
                "icon": "mdi-clipboard-text-outline"
            },
            {
                "title": "ORDINI",
                "image": "urlimage",
                "url": "/backoffice/gestione-ordini",
                "description": "Gestione Ordini",
                "label": "Entra",
                "color": "orange darken-4",
                "icon": "mdi-card-bulleted-outline"
            },
            {
                "title": "UTENTI",
                "image": "urlimage",
                "url": "/backoffice/gestione-utenti",
                "description": "Gestione Utenti",
                "label": "Entra",
                "color": "purple darken-3",
                "icon": "mdi-account-multiple"
            },
            {
                "title": "TRANSAZIONI",
                "image": "urlimage",
                "url": "/backoffice/gestione-transazioni",
                "description": "Gestione Transazioni",
                "label": "Entra",
                "color": "teal darken-3",
                "icon": "mdi-currency-eur"
            },

            {
                "title": "PACCHETTI",
                "image": "urlimage",
                "url": "/backoffice/gestione-pacchetti",
                "description": "Gestione Pacchetti",
                "label": "Entra",
                "color": "green darken-3",
                "icon": "mdi-package"
            },
            
        ]
    },
    mutations: {
        increment(state) {
            state.count++
        },
    },

    actions: {
        initialize({ commit }) {
            if (Liferay.ThemeDisplay.isSignedIn()) {
                if (document.getElementById("p_p_id_com_liferay_login_web_portlet_LoginPortlet_") !== null) {
                    document.getElementById("p_p_id_com_liferay_login_web_portlet_LoginPortlet_").style.display = "none";
                }
            }

            var elem = document.getElementById("skpinner");
            if (elem !== null) {
               elem.parentElement.removeChild(elem);
            }
        }
    },
    getters: {
        calcMenu: (state) => {
            return state.menu.filter(item => 1==1);
        },
        isSignedIn: (state) => {
            return Liferay.ThemeDisplay.isSignedIn();
        },
        getUserName: (state) => {
            return state.userName
        },
        getSiteName: (state) => {
            return state.siteName
        }
    }
})