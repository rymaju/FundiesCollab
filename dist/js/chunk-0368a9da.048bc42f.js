(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0368a9da"],{"13ca":function(n,t){var e=9007199254740991,r="[object Arguments]",o="[object Function]",i="[object GeneratorFunction]",a=/^(?:0|[1-9]\d*)$/;function u(n,t,e){switch(e.length){case 0:return n.call(t);case 1:return n.call(t,e[0]);case 2:return n.call(t,e[0],e[1]);case 3:return n.call(t,e[0],e[1],e[2])}return n.apply(t,e)}function l(n,t){var e=-1,r=Array(n);while(++e<n)r[e]=t(e);return r}var c=Object.prototype,s=c.hasOwnProperty,f=c.toString,d=c.propertyIsEnumerable,h=Math.max;function m(n,t){var e=E(n)||A(n)?l(n.length,String):[],r=e.length,o=!!r;for(var i in n)!t&&!s.call(n,i)||o&&("length"==i||k(i,r))||e.push(i);return e}function p(n,t,e,r){return void 0===n||_(n,c[e])&&!s.call(r,e)?t:n}function v(n,t,e){var r=n[t];s.call(n,t)&&_(r,e)&&(void 0!==e||t in n)||(n[t]=e)}function g(n){if(!q(n))return R(n);var t=x(n),e=[];for(var r in n)("constructor"!=r||!t&&s.call(n,r))&&e.push(r);return e}function b(n,t){return t=h(void 0===t?n.length-1:t,0),function(){var e=arguments,r=-1,o=h(e.length-t,0),i=Array(o);while(++r<o)i[r]=e[t+r];r=-1;var a=Array(t+1);while(++r<t)a[r]=e[r];return a[t]=i,u(n,this,a)}}function y(n,t,e,r){e||(e={});var o=-1,i=t.length;while(++o<i){var a=t[o],u=r?r(e[a],n[a],a,e,n):void 0;v(e,a,void 0===u?n[a]:u)}return e}function w(n){return b((function(t,e){var r=-1,o=e.length,i=o>1?e[o-1]:void 0,a=o>2?e[2]:void 0;i=n.length>3&&"function"==typeof i?(o--,i):void 0,a&&j(e[0],e[1],a)&&(i=o<3?void 0:i,o=1),t=Object(t);while(++r<o){var u=e[r];u&&n(t,u,r,i)}return t}))}function k(n,t){return t=null==t?e:t,!!t&&("number"==typeof n||a.test(n))&&n>-1&&n%1==0&&n<t}function j(n,t,e){if(!q(e))return!1;var r=typeof t;return!!("number"==r?S(e)&&k(t,e.length):"string"==r&&t in e)&&_(e[t],n)}function x(n){var t=n&&n.constructor,e="function"==typeof t&&t.prototype||c;return n===e}function R(n){var t=[];if(null!=n)for(var e in Object(n))t.push(e);return t}function _(n,t){return n===t||n!==n&&t!==t}function A(n){return C(n)&&s.call(n,"callee")&&(!d.call(n,"callee")||f.call(n)==r)}var E=Array.isArray;function S(n){return null!=n&&M(n.length)&&!O(n)}function C(n){return L(n)&&S(n)}function O(n){var t=q(n)?f.call(n):"";return t==o||t==i}function M(n){return"number"==typeof n&&n>-1&&n%1==0&&n<=e}function q(n){var t=typeof n;return!!n&&("object"==t||"function"==t)}function L(n){return!!n&&"object"==typeof n}var U=w((function(n,t,e,r){y(t,H(t),n,r)})),$=b((function(n){return n.push(void 0,p),u(U,void 0,n)}));function H(n){return S(n)?m(n,!0):g(n)}n.exports=$},"3d55":function(n,t,e){"use strict";var r=e("c7a4"),o=e.n(r);o.a},"498a":function(n,t,e){"use strict";var r=e("23e7"),o=e("58a8").trim,i=e("c8d2");r({target:"String",proto:!0,forced:i("trim")},{trim:function(){return o(this)}})},"566e":function(n,t,e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(e("5dba")),o=i(e("13ca"));function i(n){return n&&n.__esModule?n:{default:n}}function a(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}var u=["aged","ancient","autumn","billowing","bitter","black","blue","bold","broad","broken","calm","cold","cool","crimson","curly","damp","dark","dawn","delicate","divine","dry","empty","falling","fancy","flat","floral","fragrant","frosty","gentle","green","hidden","holy","icy","jolly","late","lingering","little","lively","long","lucky","misty","morning","muddy","mute","nameless","noisy","odd","old","orange","patient","plain","polished","proud","purple","quiet","rapid","raspy","red","restless","rough","round","royal","shiny","shrill","shy","silent","small","snowy","soft","solitary","sparkling","spring","square","steep","still","summer","super","sweet","throbbing","tight","tiny","twilight","wandering","weathered","white","wild","winter","wispy","withered","yellow","young"],l=["art","band","bar","base","bird","block","boat","bonus","bread","breeze","brook","bush","butterfly","cake","cell","cherry","cloud","credit","darkness","dawn","dew","disk","dream","dust","feather","field","fire","firefly","flower","fog","forest","frog","frost","glade","glitter","grass","hall","hat","haze","heart","hill","king","lab","lake","leaf","limit","math","meadow","mode","moon","morning","mountain","mouse","mud","night","paper","pine","poetry","pond","queen","rain","recipe","resonance","rice","river","salad","scene","sea","shadow","shape","silence","sky","smoke","snow","snowflake","sound","star","sun","sun","sunset","surf","term","thunder","tooth","tree","truth","union","unit","violet","voice","water","waterfall","wave","wildflower","wind","wood"],c={delimiter:"-",tokenLength:4,tokenHex:!1,tokenChars:"0123456789"},s=function(){function n(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.adjectives=t.adjectives||u,this.nouns=t.nouns||l,this.random=r.default.create(t.seed),this.config=(0,o.default)(t.defaults,c)}var t,e,i;return t=n,(e=[{key:"haikunate",value:function(n){var t=(0,o.default)(n,this.config);!0===t.tokenHex&&(t.tokenChars="0123456789abcdef");var e=this._randomElement(this.adjectives),r=this._randomElement(this.nouns);t.tokenLength||(t.tokenLength=0);for(var i="",a=0;a<t.tokenLength;a++)i+=this._randomElement(t.tokenChars);return[e,r,i].filter((function(n){return!!n})).join(t.delimiter)}},{key:"_randomElement",value:function(n){if(n)return n[this.random(n.length)]}}])&&a(t.prototype,e),i&&a(t,i),n}();t.default=s,n.exports=t.default},5899:function(n,t){n.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(n,t,e){var r=e("1d80"),o=e("5899"),i="["+o+"]",a=RegExp("^"+i+i+"*"),u=RegExp(i+i+"*$"),l=function(n){return function(t){var e=String(r(t));return 1&n&&(e=e.replace(a,"")),2&n&&(e=e.replace(u,"")),e}};n.exports={start:l(1),end:l(2),trim:l(3)}},"5dba":function(n,t,e){"use strict";var r=e("dff0"),o=function(){var n=4022871197,t=function(t){if(t){t=t.toString();for(var e=0;e<t.length;e++){n+=t.charCodeAt(e);var r=.02519603282416938*n;n=r>>>0,r-=n,r*=n,n=r>>>0,r-=n,n+=4294967296*r}return 2.3283064365386963e-10*(n>>>0)}n=4022871197};return t},i=function(n){return function(){var t,e,i=48,a=1,u=i,l=new Array(i),c=0,s=new o;for(t=0;t<i;t++)l[t]=s(Math.random());var f=function(){++u>=i&&(u=0);var n=1768863*l[u]+2.3283064365386963e-10*a;return l[u]=n-(a=0|n)},d=function(n){return Math.floor(n*(f()+11102230246251565e-32*(2097152*f()|0)))};d.string=function(n){var t,e="";for(t=0;t<n;t++)e+=String.fromCharCode(33+d(94));return e};var h=function(){var n=Array.prototype.slice.call(arguments);for(t=0;t<n.length;t++)for(e=0;e<i;e++)l[e]-=s(n[t]),l[e]<0&&(l[e]+=1)};return d.cleanString=function(n){return n=n.replace(/(^\s*)|(\s*$)/gi,""),n=n.replace(/[\x00-\x1F]/gi,""),n=n.replace(/\n /,"\n"),n},d.hashString=function(n){for(n=d.cleanString(n),s(n),t=0;t<n.length;t++)for(c=n.charCodeAt(t),e=0;e<i;e++)l[e]-=s(c),l[e]<0&&(l[e]+=1)},d.seed=function(n){"undefined"!==typeof n&&null!==n||(n=Math.random()),"string"!==typeof n&&(n=r(n,(function(n,t){return"function"===typeof t?t.toString():t}))),d.initState(),d.hashString(n)},d.addEntropy=function(){var n=[];for(t=0;t<arguments.length;t++)n.push(arguments[t]);h(c+++(new Date).getTime()+n.join("")+Math.random())},d.initState=function(){for(s(),t=0;t<i;t++)l[t]=s(" ");a=1,u=i},d.done=function(){s=null},"undefined"!==typeof n&&d.seed(n),d.range=function(n){return d(n)},d.random=function(){return d(Number.MAX_VALUE-1)/Number.MAX_VALUE},d.floatBetween=function(n,t){return d.random()*(t-n)+n},d.intBetween=function(n,t){return Math.floor(d.random()*(t-n+1))+n},d}()};i.create=function(n){return new i(n)},n.exports=i},b41b:function(n,t,e){"use strict";e.r(t);var r=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("b-overlay",{attrs:{show:n.creatingRoom,rounded:"lg","spinner-variant":"primary"}},[e("b-container",{staticClass:"form-container"},[e("b-form",{staticClass:"create-room"},[e("h2",[n._v("Create a room")]),e("b-form-group",{attrs:{id:"input-group-1",label:"Room ID:","label-for":"input-1",description:"Your room ID is a unique indentifier that will allow you to share your work just by sharing the link"}},[e("b-form-input",{attrs:{state:n.validation()},model:{value:n.room,callback:function(t){n.room=t},expression:"room"}}),e("b-form-invalid-feedback",{attrs:{state:n.validation()}},[n._v(n._s(n.validationErrors))]),e("b-form-valid-feedback",{attrs:{state:n.validation()}},[n._v("Looks good!")])],1),e("b-button",{attrs:{variant:"success",disabled:!n.validation()},on:{click:n.createRoom}},[n._v("Create Room")])],1)],1)],1)},o=[],i=(e("d3b7"),e("ac1f"),e("1276"),e("498a"),e("bc3a")),a=e.n(i),u=e("566e"),l=e.n(u),c=new l.a,s={name:"Home",components:{},data:function(){return{creatingRoom:!1,isUniqueRoom:!1,room:this.generateHaiku()}},computed:{validationErrors:function(){return this.room.length<8||this.room.length>50?"Room ID must be between 8-50 characters.":this.room.split(" ").length>1?"Rooms cannot have spacces":/^[a-zA-Z0-9-_]+$/.test(this.room)?this.isUniqueRoom?"":"Room is taken, try another name.":"Room can only be comprised of alphanumeric characters, underscores, and dashes."}},methods:{validation:function(){return this.isUniqueRoom=!0,0===this.validationErrors.length},generateHaiku:function(){return c.haikunate()},createRoom:function(){var n=this;this.creatingRoom=!0,a.a.get("https://fundiescollab.com/api/room/"+this.room).then((function(){n.isUniqueRoom=!1})).catch((function(t){400===t.response.status&&n.$router.push("room/".concat(n.room.trim()))})).finally((function(){n.creatingRoom=!1}))}}},f=s,d=(e("3d55"),e("2877")),h=Object(d["a"])(f,r,o,!1,null,null,null);t["default"]=h.exports},c7a4:function(n,t,e){},c8d2:function(n,t,e){var r=e("d039"),o=e("5899"),i="​᠎";n.exports=function(n){return r((function(){return!!o[n]()||i[n]()!=i||o[n].name!==n}))}},dff0:function(n,t){function e(n,t,e,o){return JSON.stringify(n,r(t,o),e)}function r(n,t){var e=[],r=[];return null==t&&(t=function(n,t){return e[0]===t?"[Circular ~]":"[Circular ~."+r.slice(0,e.indexOf(t)).join(".")+"]"}),function(o,i){if(e.length>0){var a=e.indexOf(this);~a?e.splice(a+1):e.push(this),~a?r.splice(a,1/0,o):r.push(o),~e.indexOf(i)&&(i=t.call(this,o,i))}else e.push(i);return null==n?i:n.call(this,o,i)}}t=n.exports=e,t.getSerialize=r}}]);
//# sourceMappingURL=chunk-0368a9da.048bc42f.js.map