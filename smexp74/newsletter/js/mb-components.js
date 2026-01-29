


Vue.component('mb-footer', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<v-footer dark app fixed fluid color="grey darken-3 white--text">' +
    '  <div class="flex-grow-1"></div>' +
    '  <div>&copy; {{ new Date().getFullYear() }} - {{$store.getters.getSiteName}}</div>' +
    '  <div class="flex-grow-1"></div>' +
    '</v-footer>'
});

Vue.component('mb-navigation', {
  props: ['items'],
  template: '<v-navigation-drawer dark app expand-on-hover>' +
    '               <v-list-item>' +
    '                    <v-list-item-content>' +
    '                        <v-list-item-title class="title">' +
    '                            ' +
    '                        </v-list-item-title>' +
    '                    </v-list-item-content>' +
    '                </v-list-item>' +
    '               <v-divider></v-divider>' +
    '               <v-list dense nav>' +
    '                   <v-list-item v-for="item in items" :key="item.title" :href="item.url">' +
    '                       <v-list-item-icon>' +
    '                           <v-icon>{{ item.icon }}</v-icon>' +
    '                       </v-list-item-icon>' +
    '                       <v-list-item-content>' +
    '                           <v-list-item-title>{{ item.title }}</v-list-item-title>' +
    '                       </v-list-item-content>' +
    '                   </v-list-item>' +
    '               </v-list>' +
    '           </v-navigation-drawer>'
});

Vue.component('mb-appbar', {
  props: ['title', 'showbar'],
  // '<v-app-bar color="black" dark fixed fluid v-show="showbar">'+
  template: '<v-app-bar color="black" dark app v-show="showbar">' +
    '<v-btn text icon color="white" href="/backoffice"><v-icon>mdi-home</v-icon></v-btn>' +
    ' <v-toolbar-title>{{$store.getters.getSiteName}}</v-toolbar-title>' +
    ' <v-spacer></v-spacer>' +
    ' <div>{{title}}</div>' +
    ' <v-spacer></v-spacer>' +
    ' <span>{{$store.getters.getUserName}}</span>' +
    ' <a href="/c/portal/logout"><v-btn class="ml-4" outlined >ESCI</v-btn></a>'+
    '</v-app-bar>'
});


Vue.component('mb-notauthorized', {
  props: ['showelement'],
  template: '<v-container fluid v-show="showelement">' +
    '  <v-layout row wrap>' +
    '    <v-flex xs12 pa-2>' +
    '      <v-alert :value="true" type="error">' +
    '        Non si dispongono i ruoli necessari. Contattare Suggesto' +
    '        del Trentino.' +
    '      </v-alert>' +
    '    </v-flex>' +
    '  </v-layout>' +
    '</v-container>'
});


Vue.component('mb-debug', {
  props: ['object'],
  data: function() {
    return {
      showDebug: false
    } 
  },
  template: '<v-content><v-btn @click="showDebug = !showDebug" color="white" small fab class="ma-2"><v-icon>mdi-bug-outline</v-icon></v-btn><pre v-show="showDebug"><code>{{object}}</code></pre></v-content>'
});


Vue.component('mb-datepicker', {
  props: ["value", "label", "outlined", "dense"],
  data: function () {
    return {
      dataValue: null,
      modal: false,
      date: null
    }
  },
  watch: {
    modal: function (val) {
      if (val == true) {
        if (typeof(this.value) !== "undefined") {
          if(this.value !== null && this.value !== "") {
              if (this.value.substr(10,1) == "T") {
                this.date = this.value.substr(0, 10);
              }
          }
        }
      }
    }
  },
  computed: {
    dateFormatted() {
      var retVal = "";
      if (typeof(this.value) !== "undefined") {
        if(this.value !== null && this.value !== "") {
            if (this.value.substr(10,1) == "T") {
              retVal = this.formatDate(this.value.substr(0, 10));
            }
        }
      }
      return retVal;
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    saveRemote() {
      this.$emit('input', this.date+"T00:00:00");
      this.modal = false;
    },
    annulla() {
      this.date = this.value.substr(0, 10);
      this.modal = false;
    },
  },
  template: 
  '<v-dialog' +
  ' ref="dialog"' +
  ' v-model="modal"' +
  ' persistent' +
  ' width="290px"' +
  '>' +
    '  <template v-slot:activator="{ on }">' +
    '    <v-text-field '+
    '      v-model="dateFormatted" '+
    '      :label="label" '+
    '      hint="Formato GG/MM/AAAA"'+
    '      readonly '+
    '      v-on="on" '+
    '      prepend-icon="mdi-calendar"'+
    '      :outlined="outlined" '+
    '      >' +
    '    </v-text-field>' +
    '    <!-- DEBUG dateFormatted[{{dateFormatted}}],data:[{{date}}], dataValue[{{dataValue}}], modal[{{modal}}] -->'+
    '  </template>' +
    '  <v-date-picker :dense="dense" locale="it" ref="picker" v-model="date">' +
    '   <v-spacer></v-spacer>'+
    '     <v-btn text color="primary" @click="annulla()">Annulla</v-btn>'+
    '     <v-btn text color="primary" @click="saveRemote()">Salva</v-btn>'+
    '  </v-date-picker>' +
    '</v-dialog>'
});


      

