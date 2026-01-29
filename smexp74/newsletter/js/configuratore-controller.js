/*
    Configuratore Controller
*/
new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    store,
    data: {
        items: [],
        totalItems: 0,
        view: "list",
        loading: false,
        valid: false,
        b: {},
        dialog: false,
        dialogClone: false,
        dialogJSONError: false,
        JSONError: "",
        emptyDefault:
        {

        },
        headers: [
            { text: 'Servizio', value: 'd40Service', align: 'start' },
            { text: 'Componente', value: 'componentId' },
            { text: 'Azioni', value: 'action', sortable: false, align:'center', width:100 }
        ],
        clonedItem: {}

    },
    methods: {
        saveItem() {
            var that = this;

            /* Controllo validità JSON */
            try {
              JSON.parse(that.b.serviceConfig)
            } catch(err) {
              this.dialogJSONError = true;
              this.JSONError = err.message;
              return;
            }
            
            var updatedObj =
            {
                groupId: that.b.groupId,
                d40Service: that.b.d40Service,
                componentId: that.b.componentId,
                multiInstance: that.b.multiInstance,
                d40ServiceConfig: JSON.stringify(JSON.parse(that.b.serviceConfig))
            }

            if (typeof (that.b["_id"]) == "undefined") {
                Liferay.Service('/destinazione.d40config/add-d40-service-config',
                    updatedObj,
                    function (obj) {
                        that.getDataFromApi();
                    }
                );
            } else {
                Liferay.Service(
                    '/destinazione.d40config/update-d40-service-config',
                    updatedObj,
                    function (obj) {
                        that.getDataFromApi();
                    }
                );
            }

        },
        cloneItem(item) {
            this.clonedItem = JSON.parse(JSON.stringify(item));
            this.dialogClone = true;
        },
        addClonedItem() {
            var that = this;
            var clonedObj = {
                groupId: this.clonedItem.groupId,
                d40Service: this.clonedItem.d40Service,
                componentId: this.clonedItem.componentId,
                multiInstance: this.clonedItem.multiInstance,
                d40ServiceConfig: JSON.stringify(this.clonedItem.serviceConfig)
            };

            Liferay.Service(
                '/destinazione.d40config/add-d40-service-config',
                clonedObj,
                function (obj) {
                    that.getDataFromApi();
                    that.dialogClone = false;
                }
            );
        },
        delItem() {
            var that = this;
            Liferay.Service(
                '/destinazione.d40config/delete-d40-service-config',
                {
                  groupId: this.b.groupId,
                  d40Service: this.b.d40Service,
                  componentId: this.b.componentId
                },
                function(obj) {
                    that.getDataFromApi();
                    that.dialog = false;
                }
              );
        },
        editItem(item) {
            this.b = JSON.parse(JSON.stringify(item));
            this.b.serviceConfig = JSON.stringify(item.serviceConfig, null, 2);
            this.view = 'detail';
        },
        closeDetail() {
            this.view = 'list';
        },
        getDataFromApi() {
            var that = this;
            that.loading = true;
            that.loading = false;
            that.view = 'list';
            
            /* getD40ServiceConfigList */
            Liferay.Service('/destinazione.d40config/get-d40-service-config-list',
                {
                    groupId: themeDisplay.getScopeGroupId()
                },
                function (obj) {
                    that.items = obj.data;
                    that.view = 'list';
                }
            );

        },
        formatDate(date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        parseDate(date) {
            if (!date) return null
            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
    },
    mounted() {
        this.$store.dispatch('initialize');
        this.getDataFromApi();
    }

})