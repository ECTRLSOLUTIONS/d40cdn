var app = new Vue({
	el: '#app',
	data: {
		items: [],
		totalItems: 0,
		mailingLists: [],
		mailingListsTotalItems: 0,   
		groupId: parseInt(themeDisplay.getScopeGroupId()),
		options: {},
		view: "list",
		loading: false,
		valid: false,
		selected_article: {},
		selected_mailingList: {},
		dialog: false,
		dialogselector: false,
		status: "",
		alertText: "",
		alertType: "",
		alert: false,
		previewLink: "about:blank",
		defaultTemplateId: "2157920",
		senderAddress: 'news@d40.it',
		senderName: 'news',
		replyToAddress: 'news@d40.it',
		shortName:"news",
		replyToName: 'news',
		emptyDefault: {
			'email': ''
		},
		headers: [
			{ text: 'articleGroupId', value: 'articleGroupId' },
			{ text: 'articleId', value: 'articleId' },
			{ text: 'title', value: 'titolo' }
		]
	},
	mounted: function(){
		var that = this;
		this.senderAddress=customconfig?.senderAddress;
		this.senderName=customconfig?.senderName;
		this.replyToAddress=customconfig?.replyToAddress;
		this.replyToName=customconfig?.replyToName;
		this.shortName=customconfig?.shortName;
		
		this.getDataFromApi().then(function(data){
			console.log(data);
			that.items = data.items;
			that.totalItems = data.total;
		});
		
		this.getMailingListsFromApi().then(function(data){
			that.mailingLists =  data.items;
			that.mailingListsTotalItems = data.total;
		});
	},
	methods: {
		sendItem: function(){
			var that = this;
			
			console.log("selected_article", this.selected_article);
			console.log("selected_mailingList", this.selected_mailingList);
			console.log("groupId", this.groupId);
			console.log("senderAddress", this.senderAddress);
			console.log("senderName", this.senderName);	
			console.log("replyToAddress", this.replyToAddress);
			console.log("replyToName", this.replyToName);
			console.log("shortName", this.shortName);	
			console.log("portalUrl -", themeDisplay.getPortalURL());

			Liferay.Service('/dopenemm.openemm/send-mailinglist', {
				groupId: this.groupId,
				mailingListId: this.selected_mailingList.id,
				articleGroupId: this.selected_article.articleGroupId,
				articleId: this.selected_article.articleId,
				senderAddress: this.senderAddress,
				senderName: this.senderName,
				replyToAddress: this.replyToAddress,
				replyToName: this.replyToName,
				shortName: this.shortName,
				portalUrl: themeDisplay.getPortalURL(),
				charset: 'utf-8',
				format: 'online-html',
				test: false,
				blockName: 'emailHtml'
			}, function(res){
				console.log("sendItem: ", res);
				that.status = JSON.stringify(res);
				
				if(res.success){
					that.showAlert("success", "Newsletter in coda di invio!");
				}else{
					that.showAlert("error", "Errore durante l'invio, " + res.errorMsg);
				}
			});
		
		},
		showAlert: function(type, msg){
			this.alertType = type;
			this.alertText = msg;
			this.alert = true;
		},
		closeAlert: function(){
			this.alert = false;
			this.alertText = "";
			this.alertType = "";
		},
		newItem: function(){
			console.log("newItem", this.selected_article);
			var that = this;
		},
		delItem: function(){
			console.log("delItem", this.selected_article);
			var that = this;
		},
		editItem: function(item){
			if(Object.keys(this.selected_mailingList).length === 0){
				this.showAlert("error", "Seleziona una mailing list");
			}else{
				this.closeAlert();
				console.log("editItem", item);
				this.selected_article = item;
				this.view = 'detail';
				this.createPreviewLink();
				this.status = "";
			}
		},
		createPreviewLink: function(){
			//Test: https://editor.d40.it/web/d40owner-demo-newsletter/preview?p_p_id=articledetail&_articledetail_siteid=568003&_articledetail_cmsid=568084
			
//			var baseUrl = Liferay.ThemeDisplay.getPortalURL() + "/web/d40owner-demo-newsletter/preview",
      var baseUrl = themeDisplay.getCanonicalURL().replace("newsletter-admin","newsletter-preview");
				parameterPortlet = "?p_p_id=articledetail",
				parameterSiteId = "&_articledetail_siteid=" + this.selected_article.articleGroupId,
				parameterCmsId = "&_articledetail_cmsid=" + this.selected_article.articleId,
				parameterLifecycle = "&p_p_lifecycle=2",
				finalLink = baseUrl + parameterPortlet + parameterSiteId + parameterCmsId + parameterLifecycle;
			
			this.previewLink = finalLink;
		},
		closeDetail: function(){
			this.view = 'list';
		},
		sendNewsLetter: function(){
			console.log("to send newsletter");
		},
		getMailingListsFromApi: function(){
			var that = this;
			that.loading = true;
			that.view = 'list';
			
			return new Promise(function(resolve, reject){
				var items = [];
				var total = 0;
				var that = this;

				AUI().use('aui-base', function(A){
					Liferay.Service('/dopenemm.openemm/get-mailing-lists', {
						groupId: parseInt(themeDisplay.getScopeGroupId()),
						componentId: '',
						skipRows: 0,
						numRows: 99
					}, function (res) {
						items = res.data.items;
						total = res.data.total;
						that.loading = false;
						resolve({ items, total });
					});
				});
			});
		},
		getDataFromApi: function(){
			var that = this;
			that.loading = true;
			that.view = 'list';
			
			return new Promise(function(resolve, reject){
				var items = [];
				var total = 0;
				var that = this;

				AUI().use('aui-base', function(A){
					Liferay.Service('/dopenemm.openemm/get-newsletter-articles', {
						groupId: parseInt(themeDisplay.getScopeGroupId()),
						structureName: 'NEWSLETTER',
						skipRows: 0,
						numRows: 99
					}, function(res){
						items = res.data.items;
						total = res.totalItems;
						that.loading = false;
						resolve({ items, total });
					});
				});
			});
		},
		fixIframe: function(){
			var iframe = this.$refs.preview.contentDocument.getElementsByTagName('html')[0];
			iframe.style.overflowX = "hidden";
		}
	}
});