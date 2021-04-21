function initAssetPubApp(divApp,myPortletId,myPortletNamespace,filterConfig) {
    console.log(filterConfig);

    var  dataFrom = "",
        dataTo = "";
        
    Vue.filter("money", function(value){
        return parseFloat(value).toFixed(2);
    });
    
    var routes = [], router = new VueRouter({
        routes: routes
    });
    
    var filterSearch = new Vue({
        router: router,
        el: divApp,
        components: {
          	Multiselect: window.VueMultiselect.default
        },
        data: {
            allItems: [],
            docs: [],
            wishList: [],
            filterConfig: filterConfig,
            jsonParams: {},
            packageDates: {
                packageId: "",
                packageName: "",
                available: []
            },
            totalItems: 0,
            loading: true,
            signedIn: Liferay.ThemeDisplay.isSignedIn(),
            packageMore: {},
            dates: {
                ready: false,
                minDate: new Date(),
                selection: {
                    start: null,
                    end: null,
                    textStart: "",
                    textEnd: "",
                    text: ""
                },
                available: {
                    start: new Date(),
                    end: null
                }
            },
            toastText: ""
        },
        created() {
            moment.locale(navigator.language.split("-")[0]);
            
            this.initFilter();
            
            if(this.signedIn){
                this.getWishList();
            }
            
            this.fetchData();
            this.setPreselectedDates();
        },
        mounted(){
            this.dates.ready = true;
        },
        methods: {
            datesSelected: function(dates){
                this.dates.selection.start = dates.start;
                this.dates.selection.end = dates.end;
                
                this.dates.selection.textStart = moment(this.dates.selection.start).format("DD MMMM YYYY");
                this.dates.selection.textEnd = moment(this.dates.selection.end).format("DD MMMM YYYY");
                this.dates.selection.text = moment(this.dates.selection.start).format("DD MMM YYYY") + " - " + moment(this.dates.selection.end).format("DD MMM YYYY");
                
                for(i = 0; i < this.filterConfig.filterGroup.length; i++){
                    if(this.filterConfig.filterGroup[i].type === "datainput"){
                        if(this.filterConfig.filterGroup[i].paramName === "d1"){
                            this.filterConfig.filterGroup[i].value = moment(this.dates.selection.start).format("YYYY-MM-DD");
                        }
                        if(this.filterConfig.filterGroup[i].paramName === "d2"){
                            this.filterConfig.filterGroup[i].value = moment(this.dates.selection.end).format("YYYY-MM-DD");
                        }
                    }
                }
                
                this.fetchData();
            },
            cleanDates: function(){
                this.dates.selection.text = "";
                this.dates.selection.start = null;
                this.dates.selection.end = null;
                this.dates.selection.textStart = "";
                this.dates.selection.textEnd = "";
                
                for(i = 0; i < this.filterConfig.filterGroup.length; i++){
                    if(this.filterConfig.filterGroup[i].type === "datainput"){
                        this.filterConfig.filterGroup[i].value = "";
                    }
                }
                
                this.fetchData();
            },
            setPreselectedDates: function(){
                if(dataFrom != "" && dataTo != ""){
                    this.dates.selection.text = moment(dataFrom).format("DD MMM YYYY") + " - " + moment(dataTo).format("DD MMM YYYY");
                    this.dates.selection.start = moment(dataFrom).toDate();
                    this.dates.selection.end = moment(dataTo).toDate();
                }
            },
            selectThis: function(id, index){
                var result = this.docs.filter(function(doc){
                    return doc.id === id;
                })[0];
                
                sessionStorage.setItem("packageIndex", index);
                
                //window.location = "${themeDisplay.getPortalURL()}" + result.viewUrl;
            },
            showMore: function(num){
                var that = this,
                    itemsToShow = this.docs.length + num;
                
                this.docs = [];
                
                this.allItems.forEach(function(item, index){
                    if(index < itemsToShow){
                        that.docs.push(item);
                    }
                });
            },
            hasOtherDates: function(item){
                var res = false;
                
                if(item.date.length > 1){
                    res = true;
                }
                
                return res;
            },
            seeMoreDates: function(){
                sessionStorage.setItem("seeMoreDates", true);
            },
            getFilter: function(pName){
                var some = _.find(this.filterConfig.filterGroup, ["paramName", pName]);
                
                console.log(some);
                return some;
            },
            initFilter: function(){
                var i, j, k, query = router.history.current.query;
                console.log(query);
                if(typeof (query.num) !== "undefined")
                    filterConfig.pageSize = query.num;
                if(typeof (query.so) !== "undefined")
                    filterConfig.so = query.so;
                if(typeof (query.qry) !== "undefined")
                    filterConfig.qry = query.qry;
        
                for(i = 0; i < this.filterConfig.filterGroup.length; i++) {
                    var paramName = this.filterConfig.filterGroup[i].paramName,
                        value = query[paramName];
                         console.log("value"+value);
                    if(typeof(value) !== "undefined"){
                        if(this.filterConfig.filterGroup[i].type === "textinput" || this.filterConfig.filterGroup[i].type === "datainput"){
                            this.filterConfig.filterGroup[i].value = value;
                        }
                        if(this.filterConfig.filterGroup[i].type === "select") {
                            if (value === "0"){
                                value = "";
                            }
                            this.filterConfig.filterGroup[i].selected = value;
                        }
                        if(this.filterConfig.filterGroup[i].type === "multiselect") {
                            var catSelected = value.split(",");
                            
                            for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++) {
                                var found = false;
                                for(k = 0; k < catSelected.length; k++) {
                                    if(catSelected[k].trim() == this.filterConfig.filterGroup[i].categories[j].categoryId){
                                        found = true;
                                    }
                                }
                                this.filterConfig.filterGroup[i].categories[j].selected = found;
                                console.log("catSelected"+this.filterConfig.filterGroup[i].categories[j].categoryId+":"+found);
                            }
                        }
                        if(this.filterConfig.filterGroup[i].type === "checkboxes") {
                            var catSelected = value.split(",");
                            for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++) {
                                var found = [];
                                for(k = 0; k < catSelected.length; k++) {
                                    if(catSelected[k].trim() == this.filterConfig.filterGroup[i].categories[j].categoryId){
                                        found += catSelected[k].trim();
                                    }
                                }
                                this.filterConfig.filterGroup[i].selected = found;
                            }
                        }
                    }
                }
            },
            fetchData: function(){
                console.log("Fetching data...");
                
                var that = this;
                var i, j, k, l;
                this.loading = true;
                this.jsonParams.num = this.filterConfig.pageSize;
                this.jsonParams.qry = this.filterConfig.qry;
                this.jsonParams.so = this.filterConfig.so;
                this.jsonParams.structureKey = this.filterConfig.structureKey;
                this.jsonParams.f0 = this.filterConfig.f0;
                this.jsonParams.f1 = this.filterConfig.f1;
                this.jsonParams.c1 = this.filterConfig.c1;
                this.jsonParams.queryAndOperator0 = this.filterConfig.queryAndOperator0;
                this.jsonParams.queryAndOperator1 = this.filterConfig.queryAndOperator1;
                this.jsonParams.queryAndOperatorC1=this.filterConfig.queryAndOperatorC1;
                this.jsonParams.orderByColumn1 = this.filterConfig.orderByColumn1;
                this.jsonParams.orderByType1 = this.filterConfig.orderByType1;
                this.jsonParams.orderByColumn2 = this.filterConfig.orderByColumn2;
                this.jsonParams.orderByType2 = this.filterConfig.orderByType2;

                for(i = 0; i < this.filterConfig.filterGroup.length; i++){
                    var value = "";
                    
                    if(this.filterConfig.filterGroup[i].type === "textinput" || this.filterConfig.filterGroup[i].type === "datainput"){
                        value = this.filterConfig.filterGroup[i].value;
                    }
                    
                    if(this.filterConfig.filterGroup[i].type === "select"){
                        value = this.filterConfig.filterGroup[i].selected.trim();
                        if(value === "0"){
                            value = "";
                        }
                    }
                    
                    if(this.filterConfig.filterGroup[i].type === "multiselect"){
                        for(l = 0; l < this.filterConfig.filterGroup[i].selected.length; l++){
                            if(this.filterConfig.filterGroup[i].selected[l].categoryId){
                                if(value.length > 0){
                                    value += ", ";
                                }
                                value += this.filterConfig.filterGroup[i].selected[l].categoryId.trim();
                            }
                        }
                    }
                    
                    if(this.filterConfig.filterGroup[i].type === "checkboxes"){
                        for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++){
                            if(this.filterConfig.filterGroup[i].categories[j].selected){
                                if(value.length > 0){
                                    value += ", ";
                                }
                                value += this.filterConfig.filterGroup[i].categories[j].categoryId.trim();
                            }
                        }
                    }
                    
                    this.jsonParams[this.filterConfig.filterGroup[i].paramName] = value;
                }
    
                router.push({
                    path: '',
                    query: this.jsonParams
                }).catch(function(err){});
                
                this.jsonParams.num = this.filterConfig.pageSize;
                url = this.filterConfig.endPoint + JSON.stringify(this.jsonParams);
    
                axios.get(
                    url
                ).then(function(response){
                    console.log("Data fetched, result: ", response.data);
                    
                    if(typeof(response.data.facetedValues) !== "undefined"){
                        that.applyFacets(response.data.facetedValues);
                    }                   
                    
                    if(typeof(response.data.docs) !== "undefined"){
                       response.data.docs.forEach(function(item, index){
                            if(index < that.filterConfig.pageSize){
                                that.docs.push(item);
                            }
                        });
                        var allDocs = response.data.docs;
                        var hashItems = {};
                        that.allItems = [];
                        allDocs.forEach(function(item, index){
                            that.allItems.push(item);
                        });
                        that.docs = [];
                        that.allItems.forEach(function(item, index){
                            if(index < that.filterConfig.pageSize){
                                that.docs.push(item);
                            }
                        });
                           
                    }else{
                        that.docs = [];
                        that.totalItems = 0;
                    }
                    if(typeof(response.data.metadata) !== "undefined"){
                        //that.totalItems = response.data.metadata.numFound;
                        that.totalItems=that.allItems.length;
                        console.log("totalItems: ", that.totalItems);
                    }else{
                        that.totalItems = 0;
                    }
    
                    that.loading = false;
                    if(typeof that.filterConfig.dataReady!=="undefined") {
                        Vue.nextTick(function () {
                            that.filterConfig.dataReady();
                        })
                    }
                }).catch(function(e){
                    console.log("error here: ", e);
                    that.totalItems = 0;
                    that.loading = false;
                }).finally(function(){
                    that.initFilter();
                });
            },
            applyFacets: function(facetedValues){
                console.log("faceted values: ", facetedValues);
                
                var i, j;
                for(i = 0; i < this.filterConfig.filterGroup.length; i++){
                    if(this.filterConfig.filterGroup[i].type === "select"){
                        for (j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++){
                            this.filterConfig.filterGroup[i].categories[j].counter = facetedValues[this.filterConfig.filterGroup[i].paramName].values[this.filterConfig.filterGroup[i].categories[j].categoryId];
                            if(typeof this.filterConfig.filterGroup[i].categories[j].counter === "undefined"){
                                if(this.filterConfig.filterGroup[i].categories[j].categoryId !== "0"){
                                    this.filterConfig.filterGroup[i].categories[j].counter = "(0)";
                                }else{
                                    this.filterConfig.filterGroup[i].categories[j].counter = "";
                                }
                            }else{
                                this.filterConfig.filterGroup[i].categories[j].counter = "(" + this.filterConfig.filterGroup[i].categories[j].counter + ")";
                            }
                        }
                    }
                    if(this.filterConfig.filterGroup[i].type === "multiselect"){
                        for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++) {
                            if(facetedValues[this.filterConfig.filterGroup[i].paramName]){
                                this.filterConfig.filterGroup[i].categories[j].counter = facetedValues[this.filterConfig.filterGroup[i].paramName].values[this.filterConfig.filterGroup[i].categories[j].categoryId];
                                if(typeof this.filterConfig.filterGroup[i].categories[j].counter === "undefined"){
                                    if(this.filterConfig.filterGroup[i].categories[j].categoryId !== "0"){
                                        this.filterConfig.filterGroup[i].categories[j].counter = "(0)";
                                        this.filterConfig.filterGroup[i].categories[j].$isDisabled = true;
                                    }else{
                                        this.filterConfig.filterGroup[i].categories[j].counter = "";
                                    }
                                }else{
                                    this.filterConfig.filterGroup[i].categories[j].counter = "(" + this.filterConfig.filterGroup[i].categories[j].counter + ")";
                                    this.filterConfig.filterGroup[i].categories[j].$isDisabled = false;
                                }
                            }else{
                                this.filterConfig.filterGroup[i].categories[j].counter = "(0)";
                                this.filterConfig.filterGroup[i].categories[j].$isDisabled = true;
                            }
                        }
                    }
                    if(this.filterConfig.filterGroup[i].type === "checkboxes"){
                        for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++){
                            this.filterConfig.filterGroup[i].categories[j].counter = facetedValues[this.filterConfig.filterGroup[i].paramName].values[this.filterConfig.filterGroup[i].categories[j].categoryId];
                            if(typeof this.filterConfig.filterGroup[i].categories[j].counter === "undefined"){
                                this.filterConfig.filterGroup[i].categories[j].counter = "(0)";
                            }else{
                                this.filterConfig.filterGroup[i].categories[j].counter = "(" + this.filterConfig.filterGroup[i].categories[j].counter + ")";
                            }
                        }
                    }
                }
            },
            resetFilter: function(){
                var i, j;
                for(i = 0; i < this.filterConfig.filterGroup.length; i++){
                    if(this.filterConfig.filterGroup[i].type === "select"){
                        this.filterConfig.filterGroup[i].selected = "";
                    }
                    if(this.filterConfig.filterGroup[i].type === "multiselect"){
                        this.filterConfig.filterGroup[i].selected = [];
                    }
                    if(this.filterConfig.filterGroup[i].type === "checkboxes"){
                        for(j = 0; j < this.filterConfig.filterGroup[i].categories.length; j++){
                            this.filterConfig.filterGroup[i].categories[j].selected = "";
                        }
                    }
                    if(this.filterConfig.filterGroup[i].type === "textinput"){
                        this.filterConfig.filterGroup[i].value = "";
                    }
                    if(this.filterConfig.filterGroup[i].type === "datainput"){
                        this.filterConfig.filterGroup[i].value = "";
                        this.dates.selection.start = null;
                        this.dates.selection.end = null;
                        this.dates.selection.textStart = "";
                        this.dates.selection.textEnd = "";
                        this.dates.selection.text = "";
                    }
                }
                this.fetchData();
            },
            getWishList: function(){
                var that = this;
                
                Liferay.Service('/destinazione.favorite/get-wish-list', {
                    groupId: Liferay.ThemeDisplay.getScopeGroupId(),
                    sessionId: String(Liferay.ThemeDisplay.getSessionId()),
                    userId: String(Liferay.ThemeDisplay.getUserId()),
                }, function(res){
                    console.log("getWishList response: ", res);
                    if(res.data){
                        res.data.forEach(function(elem){
                            that.wishList.push(elem);
                        });
                    }
                }).catch(function(err){
                    console.log("Error adding to wishlist: ", err);
                });
            },
            setFavourite: function(e, elemId){
                e.preventDefault();
                
                if(this.signedIn){
                    var that = this;
                    
                    Liferay.Service('/destinazione.favorite/add-to-wish-list', {
                        groupId: Liferay.ThemeDisplay.getScopeGroupId(),
                        sessionId: String(Liferay.ThemeDisplay.getSessionId()),
                        userId: String(Liferay.ThemeDisplay.getUserId()),
                        itemGroupId: 11,
                        itemId: String(elemId)
                    }, function(res) {
                        console.log("addToWishList response: ", res);
                        
                        res.data.forEach(function(elem){
                            if(elem.itemId == elemId){
                                that.wishList.push(elem);
                            }
                        });
                    }).catch(function(err){
                        console.error("Error adding to wishlist: ", err);
                    });
                }else{
                    this.sendToAccess();
                }
            },
            removeFavourite: function(e, id){
                e.preventDefault();
                var that = this, elemOid = "";
                
                this.wishList.forEach(function(item){
                    if(item.itemId == id){
                        elemOid = item._id.$oid;
                    }
                });
                
                Liferay.Service('/destinazione.favorite/delete-item-from-wish-list', {
                    oid: elemOid
                }, function(res) {
                    console.log("deleteFromWishList response: ", res);
                    that.wishList.forEach(function(item, index){
                        if(item._id.$oid == res.data.document){
                            that.wishList.splice(index, 1);
                        }
                    });
                }).catch(function(err){
                    console.error("Error removing from wishlist: ", err);
                });
            },
            isSavedItem: function(id){
                return this.wishList.filter(function(doc){
                    return doc.itemId === id;
                })[0];
            },
            showToast: function(text){
                this.toastText = text;
                document.getElementById("toast").classList.add("show");
                
                var that = this;
                setTimeout(function(){
                    document.getElementById("toast").classList.remove("show");
                    that.toastText = "";
                }, 3000);
            },
            openModal: function(id){
                $(id).modal("show");
            },
            closeSelects: function(){
                for (let [key, value] of Object.entries(this.$refs)) {
                    if (/^ms/.test(key)) {
                        this.$refs[key].isOpen = false;
                    }
                }
            },
            toggleMultiselect: function(e = null, ref){
                this.$refs[ref].isOpen = !this.$refs[ref].isOpen;
                
                if(e != null){
                    e.currentTarget.classList.toggle("opened");
                    e.currentTarget.querySelector('.fas').classList.toggle("fa-plus");
                    e.currentTarget.querySelector('.fas').classList.toggle("fa-minus");
                }
            },
            getPrefix: function (image, w, h) {
                var prefix = "",
                    imgCdn = "https://d28r45jypu6nt9.cloudfront.net/o/d40/img/",
                    siteUrl = window.location.origin.replace("://", ".");
    
                if (imgCdn !== "") {
                    if (_.startsWith(image, "http") || image == "/documentsundefined") {
                        if (image == "/documentsundefined") {
                            image = "https://via.placeholder.com/450x300?text=Anteprima";
                        }
                    } else {
                        if (typeof h === "string") {
                            prefix = imgCdn + "w_" + w + "/" + siteUrl;
                        } else {
                            prefix = imgCdn + "w_" + w + ",h_" + h + "/" + siteUrl;
                        }
                    }
                }
    
                return prefix + image;
            },            
            sendToAccess: function(){
                window.location.href = window.location.origin + "/login";
            }
        }
    });
    return filterSearch;
}   
