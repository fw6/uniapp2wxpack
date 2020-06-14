"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("del")),n=e(require("gulp")),a=e(require("path")),r=e(require("commander")),s=e(require("single-line-log")),i=e(require("gulp-load-plugins")),p=e(require("htmlparser2")),o=e(require("parse5")),c=e(require("fs-extra")),u=e(require("strip-json-comments")),l=e(require("gulp-strip-comments"));const{program:g}=r;g.option("--scope <type>","运行目录",process.cwd()).option("--plugin","插件模式").option("--type <type>","解耦包类型(哪种小程序)","weixin"),g.parse(process.argv);const f={weixin:{html:"wxml",css:"wxss",globalObject:"wx",mainMpPath:"mainWeixinMpPath",directivePrefix:"wx:"},baidu:{html:"swan",css:"css",globalObject:"swan",mainMpPath:"mainBaiduMpPath",directivePrefix:"s-"},toutiao:{html:"ttml",css:"ttss",globalObject:"tt",mainMpPath:"mainToutiaoMpPath",directivePrefix:"tt:"}},h=f[g.type];if(!h)throw Error("小程序类型错");process.env.PACK_TYPE=g.type;const d=g.scope,m=function(){return require.apply(null,arguments)}(a.resolve(d,"./projectToSubPackageConfig")),b=m.wxResourcePath||`src/${h.globalObject}resource`,P=m.wxResourceAlias||"@wxResource",w=RegExp(P+"\\/","g"),v=m.uniRequireApiName||"__uniRequireWx",y=RegExp(v+"\\(([a-zA-Z.\\/\"'@\\d]+)\\)","g"),k=m.uniImportWxssApiName||"__uniWxss",j=RegExp(`(}|^|\\s|;)${k}\\s*{([^{}]+)}`,"g");let x="dev";"production"===process.env.NODE_ENV&&(x="build");const N="dist/"+x+"/mp-"+g.type;let S="dist/"+x+`/mp-${g.type}-pack`;g.plugin&&(S="dist/"+x+`/mp-${g.type}-pack-plugin`);var $={currentNamespace:h,program:g,cwd:d,projectToSubPackageConfig:m,wxResourcePath:b,wxResourceAlias:P,regExpWxResources:w,uniRequireApiName:v,regExpUniRequire:y,uniImportWxssApiName:k,regExpUniImportWxss:j,configWxResourceKey:m.configWxResourceKey||"wxResource",env:x,base:N,target:S,basePath:a.resolve(d,N),subModePath:a.resolve(d,S,m.subPackagePath),targetPath:a.resolve(d,S),packIsSubpackage:{mode:!1},mpTypeNamespace:f};let _;const E=s.stdout;var O={tryAgain:async function(e){return new Promise(async t=>{setTimeout(async()=>{t(await e())},100)})},getLevelPath:function(e){return Array(e).fill("../").join("")},getLevel:function(e){return e.split(/[\\/]/).length-1},writeLastLine:function(e){E(e),clearTimeout(_),_=setTimeout(()=>{E("解耦构建，正在监听中......(此过程如果出现权限问题，请使用管理员权限运行)")},300)},deepFind:function e(t,n,a,r){n&&(n(t,a,r),t.childNodes&&t.childNodes.forEach((t,a,r)=>{e(t,n,a,r)}))}};const{basePath:A}=$,{tryAgain:C}=O;n.task("clean:base",(async function e(n){try{await t([A+"/**/*"],{force:!0})}catch(t){return void await C(async()=>{await e(n)})}n()}));const{subModePath:R}=$,{tryAgain:L}=O;n.task("clean:subModePath",(async function e(n){try{await t([R+"/**/*"],{force:!0})}catch(t){return void await L(async()=>{await e(n)})}n()}));const{targetPath:M}=$,{tryAgain:T}=O;n.task("clean:previewDist",(async function e(n){try{await t([M+"/**/*"],{force:!0})}catch(t){return void await T(async()=>{await e(n)})}n()}));const{deepFind:J}=O,q=/^(wxs|sjs)$/i;var W=class{constructor(e){var t,n;this.topNode={childNodes:[]},this.currentNode=this.topNode,this.documentFragment=o.parseFragment(e),this.init(e),n=this.documentFragment,J(t=this.topNode,e=>{e.nodeName&&e.nodeName.match(q)&&(e.nodeName="#text",e.childNodes=[],e.value="")}),J(n,e=>{if(e.nodeName&&e.nodeName.match(q)){const{nodeName:n,attrs:a,childNodes:r}=e,s={};a.forEach(e=>{s[e.name]=e.value});const i={nodeName:n,attrs:s,parentNode:t};null!=r[0]&&"#text"===r[0].nodeName&&(i.childNodes=[{nodeName:"#text",value:r[0].value,parentNode:i}]),t.childNodes.unshift(i)}})}init(e){const t=new p.Parser({onopentag:(e,t)=>{this.appendElement({nodeName:e,attrs:t,childNodes:[]})},ontext:e=>{this.appendText({nodeName:"#text",value:e})},onclosetag:e=>{this.closeElement()}},{decodeEntities:!1,xmlMode:!0});t.write(e),t.end()}appendElement(e){e.parentNode=this.currentNode,this.currentNode.childNodes.push(e),this.currentNode=e}appendText(e){e.parentNode=this.currentNode,this.currentNode.childNodes.push(e)}closeElement(){this.currentNode=this.currentNode.parentNode||this.currentNode}render(e=this.topNode.childNodes,t=""){return e.reduce((e,t)=>{if(t.removed)return e;if("#text"===t.nodeName)return e+=this.writeText(t);const{nodeName:n,attrs:a,childNodes:r=[]}=t;return e+=this.writeOpenTag(n,a),e+=this.render(r),e+=this.writeCloseTag(n)},t)}writeOpenTag(e,t){return`<${e}${(t=Object.keys(t).map(e=>`${e}="${t[e]}"`)).length>0?" "+t.join(" "):""}>`}writeText(e){return e.value}writeCloseTag(e){return`</${e}>`}};const{currentNamespace:B,mpTypeNamespace:F}=$,{deepFind:I}=O,U=Object.keys(F).map(e=>F[e].directivePrefix),D=Object.keys(F).map(e=>F[e].html),K=RegExp(`^(${U.join("|")})`),H=RegExp(`\\.(${D.join("|")})$`,"i");var Y=function(e,t){if(t.relative.match(H)){const t=new W(e);return I(t.topNode,e=>{if(e.nodeName&&"#text"!==e.nodeName){if("toutiao"===process.env.PACK_TYPE&&"wxs"===e.nodeName)return e.nodeName="#text",void(e.value="");e.nodeName.match(/^(include|import|wxs)$/)&&e.attrs.src&&(e.attrs.src=e.attrs.src.replace(H,"."+B.html)),Object.keys(e.attrs).forEach(t=>{if(t.match(K)){const n=t.replace(K,B.directivePrefix);e.attrs[n]=e.attrs[t],n!==t&&delete e.attrs[t]}})}}),t.render()}return e};const{currentNamespace:z,mpTypeNamespace:V}=$,Z=Object.keys(V).map(e=>V[e].css),G=RegExp(`\\.(${Z.join("|")})$`,"i");var Q={htmlMixinPlugin:Y,cssMixinPlugin:function(e,t){return t.relative.match(G)&&(e=e.replace(/@import\s+['"](\S+)['"]/g,(function(e,t){return`@import '${t.replace(G,"."+z.css)}'`}))),e},polyfillPlugin:function(e,{relative:t}){return"toutiao"===process.env.PACK_TYPE&&t.match(/^\/app.js$/i)?"\nif (!Promise.prototype.finally) {\n    Promise.prototype.finally = function (callback) {\n        let P = this.constructor;\n        return this.then(\n            value  => P.resolve(callback()).then(() => value),\n            reason => P.resolve(callback()).then(() => { throw reason })\n        );\n    };\n}\n;\n"+e:e}};const{projectToSubPackageConfig:X,targetPath:ee}=$;(!X.plugins||!X.plugins instanceof Array)&&(X.plugins=[]);var te={runPlugins:function(e){return function(t){const{plugins:n}=X;if(!n||!n instanceof Array)return;const r=a.resolve(e,this.file.relative),s={relative:r.replace(RegExp("^"+ee.replace(/\\/g,"\\\\")),"").replace(/\\/g,"/"),absolute:r};return n.reduce((e,t)=>{if("string"==typeof t&&(t=Q[t]),"function"!=typeof t)return e;const n=t(e,s,Q);return null==n?e:n},t)}}};const ne=i(),{cwd:ae,projectToSubPackageConfig:re,target:se,env:ie}=$,{writeLastLine:pe}=O,{runPlugins:oe}=te;n.task("watch:pluginJson",(function(){return n.src("src/plugin.json",{allowEmpty:!0,cwd:ae}).pipe(ne.if("dev"===ie,ne.watch("src/plugin.json",{cwd:ae},(function(e){pe("处理"+e.relative+"......")})))).pipe(ne.replace(/[\s\S]*/,oe(a.resolve(ae,se+"/"+re.subPackagePath)))).pipe(n.dest(se+"/"+re.subPackagePath,{cwd:ae}))}));const ce=i(),{cwd:ue,target:le,env:ge,targetPath:fe}=$,{writeLastLine:he}=O,{runPlugins:de}=te;n.task("watch:projectConfigJson",(function(){return n.src("project.config.json",{allowEmpty:!0,cwd:ue}).pipe(ce.if("dev"===ge,ce.watch("project.config.json",{cwd:ue},(function(e){he("处理"+e.relative+"......")})))).pipe(ce.replace(/[\s\S]*/,de(fe))).pipe(n.dest(le,{cwd:ue}))}));const{program:me,cwd:be,projectToSubPackageConfig:Pe,basePath:we,subModePath:ve,targetPath:ye,packIsSubpackage:ke,currentNamespace:je}=$;var xe=function(){if(me.plugin)return;const e=a.resolve(be,Pe[je.mainMpPath]+"/app.js");if(c.existsSync(e)){const t=c.readFileSync(e,"utf8");let n=`require('${`./${Pe.subPackagePath}/`}app.js');\n`;if(ve===ye){n=c.readFileSync(we+"/app.js","utf8")+";\n"}(ke.mode||me.plugin)&&(n=""),c.outputFileSync(ye+"/app.js",n+t)}};const Ne=i(),{program:Se,cwd:$e,projectToSubPackageConfig:_e,configWxResourceKey:Ee,base:Oe,packIsSubpackage:Ae,currentNamespace:Ce}=$,{writeLastLine:Re}=O;var Le=function(e){return Re("处理app.json......"),Ne.replace(/[\s\S]+/,(function(t){if(Se.plugin&&"mainAppJson"===e)return t;Ae.mode=!1;let n,r,s,i={};({pagesJson(){try{n=JSON.parse(u(t))}catch(e){n={}}},baseAppJson(){try{r=JSON.parse(t)}catch(e){r={}}},mainAppJson(){try{s=JSON.parse(t)}catch(e){s={}}}})[e]();try{n||(n=JSON.parse(u(c.readFileSync(a.resolve($e,"src/pages.json"),"utf8"))))}catch(e){n={}}try{r||(r=JSON.parse(c.readFileSync(a.resolve($e,Oe+"/app.json"),"utf8")))}catch(e){r={}}try{s||(s=JSON.parse(c.readFileSync(a.resolve($e,_e[Ce.mainMpPath]+"/app.json"),"utf8")))}catch(e){s={}}function p(e){return _e.subPackagePath+(_e.subPackagePath?"/":"")+e}if(s.subPackages){let e=s.subPackages.find(e=>e.root===_e.subPackagePath);if(e){Ae.mode=!0;let t=[...n[Ee]&&n[Ee].pages||[],...r.pages||[]];return r.subPackages&&r.subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),n[Ee]&&n[Ee].subPackages&&n[Ee].subPackages.forEach(e=>{t=[...t,...(e.pages||[]).map(t=>e.root+(e.root?"/":"")+t)]}),e.pages=t,xe(),delete r.pages,delete r.subPackages,JSON.stringify({...r,...s},null,2)}}r.pages&&r.pages.forEach((e,t)=>{r.pages[t]=p(e)}),r.subPackages&&r.subPackages.forEach(e=>{e.root=p(e.root)}),n[Ee]&&(n[Ee].pages&&n[Ee].pages.forEach((e,t)=>{n[Ee].pages[t]=p(e)}),n[Ee].subPackages&&n[Ee].subPackages.forEach(e=>{e.root=p(e.root)})),r.tabBar&&r.tabBar.list&&r.tabBar.list.forEach(({pagePath:e,iconPath:t,selectedIconPath:n,...a},s)=>{r.tabBar.list[s]={pagePath:e?p(e):"",iconPath:t?p(t):"",selectedIconPath:n?p(n):"",...a}}),i={...r,...s},i.pages=Array.from(new Set([...n.indexPage?[p(n.indexPage)]:[],...s.pages||[],...r.pages||[],...n[Ee]&&n[Ee].pages||[]]));let o=[],l={};function g(e){e.forEach(e=>{l[e.root]=l[e.root]?Array.from(new Set([...l[e.root],...e.pages])):e.pages})}g(n[Ee]&&n[Ee].subPackages||[]),g(r.subPackages||[]),g(s.subPackages||[]);for(let e in l)o.push({root:e,pages:l[e]});if(i.subPackages=[...o],r.usingComponents){for(let e in r.usingComponents)r.usingComponents[e]="/"+_e.subPackagePath+r.usingComponents[e];i.usingComponents={...i.usingComponents||{},...r.usingComponents}}return xe(),"toutiao"===Se.type&&i.subPackages&&(i.subPackages.forEach(e=>{e.pages.forEach(t=>{i.pages.push(e.root+"/"+t)})}),delete i.subPackages),JSON.stringify(i,null,2)}),{skipBinary:!1})};const Me=i(),{cwd:Te,target:Je,env:qe,targetPath:We}=$,{writeLastLine:Be}=O,{runPlugins:Fe}=te;n.task("watch:pagesJson",(function(){return n.src("src/pages.json",{allowEmpty:!0,cwd:Te}).pipe(Me.if("dev"===qe,Me.watch("src/pages.json",{cwd:Te},(function(e){Be("处理"+e.relative+"......")})))).pipe(Le("pagesJson")).pipe(Me.rename("app.json")).pipe(Me.replace(/[\s\S]*/,Fe(We))).pipe(n.dest(Je,{cwd:Te}))}));const Ie=i(),{cwd:Ue,target:De,env:Ke,base:He,targetPath:Ye}=$,{writeLastLine:ze}=O,{runPlugins:Ve}=te;n.task("watch:baseAppJson",(function(){return n.src(He+"/app.json",{allowEmpty:!0,cwd:Ue}).pipe(Ie.if("dev"===Ke,Ie.watch(He+"/app.json",{cwd:Ue},(function(e){ze("处理"+e.relative+"......")})))).pipe(Le("baseAppJson")).pipe(Ie.replace(/[\s\S]*/,Ve(Ye))).pipe(n.dest(De,{cwd:Ue}))}));const Ze=i(),{cwd:Ge,target:Qe,env:Xe,projectToSubPackageConfig:et,program:tt,currentNamespace:nt}=$,{writeLastLine:at}=O,{runPlugins:rt}=te;n.task("watch:mainAppJson",(function(){let e=et[nt.mainMpPath];return n.src(e+"/app.json",{allowEmpty:!0,cwd:Ge}).pipe(Ze.if("dev"===Xe,Ze.watch(e+"/app.json",{cwd:Ge},(function(e){at("处理"+e.relative+"......")})))).pipe(Le("mainAppJson")).pipe(Ze.replace(/[\s\S]*/,rt(a.resolve(Ge,Qe+(tt.plugin?"/miniprogram":""))))).pipe(n.dest(Qe+(tt.plugin?"/miniprogram":""),{cwd:Ge}))}));const st=i(),{cwd:it,target:pt,env:ot,projectToSubPackageConfig:ct,program:ut,basePath:lt,currentNamespace:gt,mpTypeNamespace:ft}=$,{writeLastLine:ht}=O,{runPlugins:dt}=te;n.task("watch:topMode-mainAppJsAndAppWxss",(function(){let e=ct[gt.mainMpPath];const t=Object.keys(ft).map(t=>`${e}/app.${ft[t].css}`),r=st.filter([...t],{restore:!0}),s=st.filter([e+"/app.js"],{restore:!0});return n.src([e+"/app.js",...t],{allowEmpty:!0,cwd:it}).pipe(st.if("dev"===ot,st.watch([e+"/app.js",`${e}/app.${gt.css}`],{cwd:it},(function(e){ht("处理"+e.relative+"......")})))).pipe(s).pipe(st.replace(/^/,(function(e){return c.readFileSync(lt+"/app.js","utf8")+";\n"}),{skipBinary:!1})).pipe(s.restore).pipe(r).pipe(st.replace(/^/,(function(e){return c.readFileSync(`${lt}/app.${gt.css}`,"utf8")+"\n"}),{skipBinary:!1})).pipe(st.rename((function(e){e.extname="."+gt.css}))).pipe(r.restore).pipe(st.replace(/[\s\S]*/,dt(a.resolve(it,pt+(ut.plugin?"/miniprogram":""))))).pipe(n.dest(pt+(ut.plugin?"/miniprogram":""),{cwd:it}))}));const{mpTypeNamespace:mt,currentNamespace:bt}=$,Pt=(process,new Set(Object.keys(mt).map(e=>mt[e].globalObject)));var wt={mixinsEnvCode:function(e){let t="";return Pt.forEach(e=>{bt.globalObject!==e&&(t+=`var ${e} = ${bt.globalObject};\n`)}),t}};const vt=i(),{cwd:yt,target:kt,env:jt,projectToSubPackageConfig:xt,base:Nt,wxResourcePath:St,currentNamespace:$t,mpTypeNamespace:_t}=$,{writeLastLine:Et}=O,{mixinsEnvCode:Ot}=wt,{runPlugins:At}=te;n.task("watch:mainWeixinMpPackPath",(function(){const e=xt[$t.mainMpPath],r=e+"/"+xt.subPackagePath,s=kt+"/"+xt.subPackagePath,i=[],p=[];Object.keys(_t).forEach(e=>{i.push(`${r}/**/*.${_t[e].css}`),p.push(`${r}/**/*.${_t[e].html}`)});const o=vt.filter([...p],{restore:!0}),u=vt.filter([...i],{restore:!0}),l=vt.filter([r+"/**/*.js"],{restore:!0});return n.src([r,r+"/**/*","!"+r+"/pack.config.js"],{allowEmpty:!0,cwd:yt}).pipe(vt.if("dev"===jt,vt.watch([r,r+"/**/*","!/"+r+"/pack.config.js"],{cwd:yt},(function(e){Et("处理"+e.relative+"......")})))).pipe(vt.filter((function(n){if(!function(e){const t=xt[$t.mainMpPath]+"/"+xt.subPackagePath;return!c.existsSync(e.path.replace(a.resolve(yt,t),a.resolve(yt,Nt)))&&!c.existsSync(e.path.replace(a.resolve(yt,t),a.resolve(yt,St)))}(n))return!1;if("unlink"===n.event){try{t.sync([n.path.replace(a.resolve(yt,e),a.resolve(yt,kt))],{force:!0})}catch(e){}return!1}return!0}))).pipe(o).pipe(vt.rename((function(e){e.extname="."+$t.html}))).pipe(o.restore).pipe(u).pipe(vt.rename((function(e){e.extname="."+$t.css}))).pipe(u.restore).pipe(l).pipe(vt.replace(/[\s\S]*/,(function(e){return Ot(e)+e}))).pipe(l.restore).pipe(vt.replace(/[\s\S]*/,At(a.resolve(yt,s)))).pipe(n.dest(s,{cwd:yt}))}));const Ct=i(),{cwd:Rt,target:Lt,env:Mt,projectToSubPackageConfig:Tt,basePath:Jt,subModePath:qt,targetPath:Wt,program:Bt,packIsSubpackage:Ft,currentNamespace:It,mpTypeNamespace:Ut}=$,{writeLastLine:Dt}=O,{mixinsEnvCode:Kt}=wt,{runPlugins:Ht}=te;n.task("watch:mainWeixinMp",(function(){const e=Tt[It.mainMpPath],r=e+"/"+Tt.subPackagePath,s=[],i=[];Object.keys(Ut).forEach(t=>{s.push(`${e}/**/*.${Ut[t].css}`),i.push(`${e}/**/*.${Ut[t].html}`)});const p=Ct.filter([e+"/app.js"],{restore:!0}),o=Ct.filter([e+"/**/*.js"],{restore:!0}),c=Ct.filter([...i],{restore:!0}),u=Ct.filter([...s],{restore:!0});return n.src([e+"/**/*","!"+e+"/app.json","!"+e+"/**/*.json___jb_tmp___","!"+e+`/**/*.${It.html}___jb_tmp___`,"!"+e+`/**/*.${It.css}___jb_tmp___`,"!"+e+"/**/*.js___jb_tmp___","!"+r+"/**/*"],{base:a.resolve(Rt,e),allowEmpty:!0,cwd:Rt}).pipe(Ct.if("dev"===Mt,Ct.watch([e+"/**/*","!/"+e+"/app.json","!/"+r+"/**/*"],{cwd:Rt},(function(e){Dt("处理"+e.relative+"......")})))).pipe(Ct.filter((function(n){if("unlink"===n.event){try{t.sync([n.path.replace(a.resolve(Rt,e),a.resolve(Rt,Lt))],{force:!0})}catch(e){}return!1}return!0}))).pipe(o).pipe(Ct.replace(/[\s\S]*/,(function(e){return Kt(e)+e}))).pipe(o.restore).pipe(p).pipe(Ct.replace(/^/,(function(e){if(Ft.mode||Bt.plugin)return"";let t=`./${Tt.subPackagePath}/`;if(qt===Wt){return fs.readFileSync(Jt+"/app.js","utf8")+";\n"}return`require('${t}app.js');\n`}),{skipBinary:!1})).pipe(p.restore).pipe(c).pipe(Ct.rename((function(e){e.extname="."+It.html}))).pipe(c.restore).pipe(u).pipe(Ct.rename((function(e){e.extname="."+It.css}))).pipe(u.restore).pipe(Ct.replace(/[\s\S]*/,Ht(a.resolve(Rt,Lt+(Bt.plugin?"/miniprogram":""))))).pipe(n.dest(Lt+(Bt.plugin?"/miniprogram":""),{cwd:Rt}))}));var Yt={fakeUniBootstrap:function(e,t,n,a){globalObject.__uniapp2wxpack||(globalObject.__uniapp2wxpack={platform:a});var r=globalObject.__uniapp2wxpack[t.replace("/","")]={__packInit:{}};if(e)for(var s in e)"function"!=typeof e[s]?r.__packInit[s]=e[s]:function(t){r.__packInit[t]=function(){return e[t].apply(e,arguments)}}(s);else e={};if("none"!==n){var i=Page,p=Component,o="",c=1,u=1;"function"==typeof e.onError&&globalObject.onError&&globalObject.onError((function(){return e.onError.apply(e,arguments)})),"function"==typeof e.onPageNotFound&&globalObject.onPageNotFound&&globalObject.onPageNotFound((function(){return e.onPageNotFound.apply(e,arguments)})),"function"==typeof e.onUnhandledRejection&&globalObject.onUnhandledRejection&&globalObject.onUnhandledRejection((function(){return e.onUnhandledRejection.apply(e,arguments)})),globalObject.onAppRoute((function(a){"top"!==n&&0!==("/"+a.path).indexOf(t+"/")&&(c=1,e.onHide.call(e,globalObject.getLaunchOptionsSync())),o=a.path})),globalObject.onAppHide((function(){if("top"===n)return e.onHide.call(e,globalObject.getLaunchOptionsSync());var a=getCurrentPages();return 0===("/"+(null==a[a.length-1].route?a[a.length-1].__route__:a[a.length-1].route)).indexOf(t+"/")?(c=1,o="",e.onHide.call(e,globalObject.getLaunchOptionsSync())):void 0})),globalObject.onAppShow((function(){"top"===n&&"function"==typeof e.onShow&&e.onShow.call(e,globalObject.getLaunchOptionsSync()),u&&getApp()&&(getApp().globalData||(getApp().globalData={}),Object.assign(getApp().globalData,e.globalData||{})),u=0})),"top"===n&&u&&"function"==typeof e.onLaunch&&e.onLaunch.call(e,globalObject.getLaunchOptionsSync()),Page=function(e){return l(e),i.call(this,e)},Component=function(e){return l(e.methods||{}),p.call(this,e)}}function l(a){if("top"!==n){var r=a.onShow;"function"!=typeof e.onShow&&"function"!=typeof e.onLaunch||(a.onShow=function(){var n=getCurrentPages(),a=null==n[n.length-1].route?n[n.length-1].__route__:n[n.length-1].route;if(o&&0===("/"+o).indexOf(t+"/")||0!==("/"+a).indexOf(t+"/")||(c&&(c=0,e.onLaunch.call(e,globalObject.getLaunchOptionsSync())),e.onShow.call(e,globalObject.getLaunchOptionsSync())),"function"==typeof r)return r.apply(this,arguments)})}}},fakeUniBootstrapName:"fakeUniBootstrap"};const zt=i(),{regExpWxResources:Vt,regExpUniRequire:Zt}=$,{getLevelPath:Gt,getLevel:Qt}=O;var Xt={uniRequireWxResource:function(){return zt.replace(Zt,(function(e,t){const n=Qt(this.file.relative);return console.log(`\n编译${e}--\x3erequire(${t.replace(Vt,Gt(n))})`),`require(${t.replace(Vt,Gt(n))})`}),{skipBinary:!1})}};const en=i(),{fakeUniBootstrapName:tn,fakeUniBootstrap:nn}=Yt,{cwd:an,env:rn,program:sn,basePath:pn,targetPath:on,subModePath:cn,base:un,regExpUniRequire:ln,regExpWxResources:gn,regExpUniImportWxss:fn,wxResourceAlias:hn,currentNamespace:dn,mpTypeNamespace:mn}=$,bn=process.env.PACK_TYPE,{writeLastLine:Pn,getLevel:wn,getLevelPath:vn,deepFind:yn}=O,{mixinsEnvCode:kn}=wt,{uniRequireWxResource:jn}=Xt,{runPlugins:xn}=te,Nn=Object.keys(mn).map(e=>mn[e].css);n.task("subMode:createUniSubPackage",(function(){c.mkdirsSync(pn);const e=en.filter(un+"/**/*.js",{restore:!0}),r=en.filter([un+"/common/vendor.js"],{restore:!0}),s=en.filter([un+"/common/main.js"],{restore:!0}),i=en.filter([un+"/**/*.js","!"+un+"/app.js","!"+un+"/common/vendor.js","!"+un+"/common/main.js","!"+un+"/common/runtime.js"],{restore:!0}),p=en.filter([`${un}/**/*.${dn.css}`,`!${un}/app.${dn.css}`,`!${un}/common/main.${dn.css}`],{restore:!0}),o=en.filter([`${un}/**/*.${dn.css}`,`!${un}/app.${dn.css}`],{restore:!0}),u=en.filter([un+"/**/*.json"],{restore:!0}),g=en.filter([`${un}/**/*.${dn.html}`],{restore:!0});return n.src([un+"/**","!"+un+"/*.*",un+"/app.js",`${un}/app.${dn.css}`],{allowEmpty:!0,cwd:an}).pipe(en.if("dev"===rn,en.watch([un+"/**/*","!/"+un+"/*.json"],{cwd:an},(function(e){Pn("处理"+e.relative+"......")})))).pipe(en.filter((function(e){if(function(e){const t=a.resolve(on,"app.js"),n=a.resolve(on,"app."+dn.css),r=e.path.replace(pn,cn);return t===r||n===r}(e))return!1;if("unlink"===e.event){try{t.sync([e.path.replace(pn,a.resolve(an,cn))],{force:!0})}catch(e){}return!1}return!0}))).pipe(g).pipe(en.replace(/[\s\S]*/,(function(e){const t=new W(e);let n=0;return yn(t.topNode,e=>{if("#text"===e.nodeName&&"wxs"===e.parentNode.nodeName){e.value.replace(ln,(t,a,r,s)=>{const i=wn(this.file.relative),p=a.replace(gn,vn(i)).replace(/['"]/g,"");e.parentNode.attrs.src=p,e.parentNode.childNodes=[],n=1,console.log(`\n编译${t}--\x3erequire(${p})`)})}}),n?t.render():e}),{skipBinary:!1})).pipe(g.restore).pipe(r).pipe(en.replace(/^/,(function(e){return sn.plugin?`var App=function(packInit){};${dn.globalObject}.canIUse=function(){return false};`:`var __packConfig=require('../pack.config.js');var App=function(packInit){var ${tn}=${(""+nn).replace(/globalObject/g,dn.globalObject)};${tn}(packInit,__packConfig.packPath,__packConfig.appMode,'${bn}');};`}),{skipBinary:!1})).pipe(r.restore).pipe(e).pipe(l()).pipe(jn()).pipe(en.replace(/[\s\S]*/,(function(e){return kn(e)+e}))).pipe(e.restore).pipe(s).pipe(en.replace(/^/,(function(e){return"var __uniPluginExports={};\n"}),{skipBinary:!1})).pipe(en.replace(/$/,(function(e){return"\nmodule.exports=__uniPluginExports;"}),{skipBinary:!1})).pipe(s.restore).pipe(i).pipe(en.replace(/^/,(function(e){if(c.existsSync(a.resolve(an,"src",this.file.relative)))return e;return`require('${vn(wn(this.file.relative))}app.js');\n`}),{skipBinary:!1})).pipe(i.restore).pipe(u).pipe(en.replace(/[\s\S]*/,(function(e){if(!c.existsSync(a.resolve(an,"src",this.file.relative.replace(/json$/,"vue")))&&!c.existsSync(a.resolve(an,"src",this.file.relative.replace(/json$/,"nvue"))))return e;let t=JSON.parse(""+this.file.contents);for(let e in t.usingComponents)0===t.usingComponents[e].indexOf("/")&&(t.usingComponents[e]=vn(wn(this.file.relative))+t.usingComponents[e].replace(/^\//,""));return JSON.stringify(t)}),{skipBinary:!1})).pipe(u.restore).pipe(o).pipe(en.stripCssComments()).pipe(en.replace(fn,(function(e,t,n){let a="",r=wn(this.file.relative);return(n+=";").replace(/\s*import\s*:\s*(('[^\s';]*')|("[^\s";]*"))/g,(function(e,t){const n=RegExp(`(${Nn.join("|")})(['"])$`);t=t.replace(n,dn.css+"$2"),a+=`@import ${t.replace(gn,vn(r))};\n`})),t+a}),{skipBinary:!1})).pipe(o.restore).pipe(p).pipe(en.stripCssComments()).pipe(en.replace(/^[\s\S]*$/,(function(e){if(cn===on)return e;let t=wn(this.file.relative);return"@import "+`"${hn}/app.${dn.css}";`.replace(gn,vn(t))+("\n"+e)}),{skipBinary:!1})).pipe(p.restore).pipe(en.replace(/[\s\S]*/,xn(cn))).pipe(n.dest(cn,{cwd:an}))}));const Sn=i(),{cwd:$n,env:_n,targetPath:En,subModePath:On,regExpWxResources:An,regExpUniImportWxss:Cn,wxResourceAlias:Rn,wxResourcePath:Ln,currentNamespace:Mn,mpTypeNamespace:Tn}=$,{writeLastLine:Jn,getLevel:qn,getLevelPath:Wn}=O,{mixinsEnvCode:Bn}=wt,{uniRequireWxResource:Fn}=Xt,{runPlugins:In}=te,Un=[],Dn=[],Kn=[];Object.keys(Tn).forEach(e=>{Un.push(Tn[e].css),Dn.push(`${Ln}/**/*.${Tn[e].css}`),Kn.push(`${Ln}/**/*.${Tn[e].html}`)}),n.task("subMode:copyWxResource",(function(){const e=Sn.filter([Ln+"/**/*.js"],{restore:!0}),r=Sn.filter([...Dn],{restore:!0}),s=Sn.filter([...Kn],{restore:!0});return n.src([Ln+"/**",Ln],{allowEmpty:!0,cwd:$n}).pipe(Sn.if("dev"===_n,Sn.watch([Ln+"/**",Ln,`!/${Ln}/**/*.*___jb_tmp___`],{cwd:$n},(function(e){Jn("处理"+e.relative+"......")})))).pipe(e).pipe(Sn.replace(/[\s\S]*/,(function(e){return Bn(e)+e}))).pipe(Sn.replace(/^/,(function(e){return`require('${Wn(qn(this.file.relative))}app.js');\n`}),{skipBinary:!1})).pipe(l()).pipe(Fn()).pipe(e.restore).pipe(r).pipe(Sn.stripCssComments()).pipe(Sn.replace(Cn,(function(e,t,n){let a="";qn(this.file.relative);return t+a}),{skipBinary:!1})).pipe(Sn.replace(/^[\s\S]*$/,(function(e){if(On===En)return e;let t=qn(this.file.relative);return"@import "+`"${Rn}/app.${Mn.css}";`.replace(An,Wn(t))+("\n"+e)}),{skipBinary:!1})).pipe(Sn.rename((function(e){e.extname="."+Mn.css}))).pipe(r.restore).pipe(s).pipe(Sn.rename((function(e){e.extname="."+Mn.html}))).pipe(s.restore).pipe(Sn.filter((function(e){if("unlink"===e.event){try{t.sync([e.path.replace(a.resolve($n,Ln),a.resolve($n,On))],{force:!0})}catch(e){}return!1}return!0}))).pipe(Sn.replace(/[\s\S]*/,In(On))).pipe(n.dest(On,{cwd:$n}))}));const{cwd:Hn,env:Yn,targetPath:zn,subModePath:Vn,projectToSubPackageConfig:Zn,program:Gn,currentNamespace:Qn}=$,{tryAgain:Xn}=O;n.task("mpWxSubMode",n.series((function(e){console.log("对uni-app进行解耦构建，解除uni-app对原生小程序方法的改写，此过程如果出现权限问题，请使用管理员权限运行"),e()}),"clean:previewDist",(async function e(t){if(Gn.plugin)t();else{try{let e={packPath:(Zn.subPackagePath?"/":"")+Zn.subPackagePath,appMode:Zn.appMode};await c.outputFile(Vn+"/pack.config.js","module.exports="+JSON.stringify(e,null,4))}catch(n){return void await Xn(async()=>{await e(t)})}t()}}),function(){let e=[async function(e){let t=a.resolve(Hn,Zn[Qn.mainMpPath],"app.js");await c.exists(t)||await c.outputFile(t,"App({});"),e()},"subMode:createUniSubPackage","subMode:copyWxResource",...Gn.plugin?["watch:pluginJson"]:["watch:baseAppJson","watch:pagesJson",...Zn.mergePack?["watch:mainWeixinMpPackPath"]:[],...Vn===zn?["watch:topMode-mainAppJsAndAppWxss"]:[]],"watch:mainAppJson","watch:mainWeixinMp","watch:projectConfigJson"];return"build"===Yn?n.series.apply(this,e):n.parallel.apply(this,e)}(),(function(e){e(),"build"===Yn&&process.exit()})));const{cwd:ea,basePath:ta,base:na}=$;n.task("startToPackServe",n.series((async function(e){await c.exists(ta)||await c.mkdirs(ta),e()}),"clean:base",(function(e){n.watch(na+"/app.json",{events:["all"],cwd:ea},(function(){e()}))}),"mpWxSubMode")),process.on("unhandledRejection",()=>{});
