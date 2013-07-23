/*global jQuery:false, alert:false */

/*
 * Default text - jQuery plugin for html5 dragging files from desktop to browser
 *
 * Author: Weixi Yen
 *
 * Email: [Firstname][Lastname]@gmail.com
 *
 * Copyright (c) 2010 Resopollution
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/weixiyen/jquery-filedrop
 *
 * Version:  0.1.0
 *
 * Features:
 *      Allows sending of extra parameters with file.
 *      Works with Firefox 3.6+
 *      Future-compliant with HTML5 spec (will work with Webkit browsers and IE9)
 * Usage:
 *  See README at project homepage
 *
 */
(function(e){function a(){}jQuery.event.props.push("dataTransfer");var t={fallback_id:"",url:"",refresh:1e3,paramname:"userfile",allowedfiletypes:[],maxfiles:25,maxfilesize:1,queuefiles:0,queuewait:200,data:{},headers:{},drop:a,dragStart:a,dragEnter:a,dragOver:a,dragLeave:a,docEnter:a,docOver:a,docLeave:a,beforeEach:a,afterAll:a,rename:a,error:function(e,t,n,r){alert(e)},uploadStarted:a,uploadFinished:a,progressUpdated:a,globalProgressUpdated:a,speedUpdated:a},n=["BrowserNotSupported","TooManyFiles","FileTooLarge","FileTypeNotAllowed","NotFound","NotReadable","AbortError","ReadError"],r,i=false,s=0,o,u=window.FileReader&&!jQuery.isFunction(FileReader.prototype.readAsBinaryString);e.fn.filedrop=function(a){function c(e){if(f.drop.call(this,e)===false)return false;o=e.dataTransfer.files;if(o===null||o===undefined||o.length===0){f.error(n[0]);return false}s=o.length;v();e.preventDefault();return false}function h(t,n,r,i){var s="--",o="\r\n",a="";if(f.data){var l=e.param(f.data).replace(/\+/g,"%20").split(/&/);e.each(l,function(){var e=this.split("=",2),t=decodeURIComponent(e[0]),n=decodeURIComponent(e[1]);a+=s;a+=i;a+=o;a+='Content-Disposition: form-data; name="'+t+'"';a+=o;a+=o;a+=n;a+=o})}a+=s;a+=i;a+=o;a+='Content-Disposition: form-data; name="'+f.paramname+'"';a+='; filename="'+t+'"';a+=o;a+="Content-Type: "+r;a+=o;a+=o;if(u){if(n!==null){a+=atob(n.split(",")[1])}}else{a+=n}a+=o;a+=s;a+=i;a+=s;a+=o;return a}function p(e){if(e.lengthComputable){var t=Math.round(e.loaded*100/e.total);if(this.currentProgress!==t){this.currentProgress=t;f.progressUpdated(this.index,this.file,this.currentProgress);l[this.global_progress_index]=this.currentProgress;d();var n=(new Date).getTime();var r=n-this.currentStart;if(r>=f.refresh){var i=e.loaded-this.startData;var s=i/r;f.speedUpdated(this.index,this.file,s);this.startData=e.loaded;this.currentStart=n}}}}function d(){if(l.length===0){return}var e=0,t;for(t in l){if(l.hasOwnProperty(t)){e=e+l[t]}}f.globalProgressUpdated(Math.round(e/l.length))}function v(){i=false;if(!o){f.error(n[0]);return false}if(f.allowedfiletypes.push&&f.allowedfiletypes.length){for(var t=o.length;t--;){if(!o[t].type||e.inArray(o[t].type,f.allowedfiletypes)<0){f.error(n[3],o[t]);return false}}}var r=0,a=0;if(s>f.maxfiles&&f.queuefiles===0){f.error(n[1]);return false}var c=[];var v=[];var w=[];for(var E=0;E<s;E++){c.push(E)}var S=function(e){setTimeout(x,e);return};var x=function(){var e;if(i){return false}if(f.queuefiles>0&&v.length>=f.queuefiles){return S(f.queuewait)}else{e=c[0];c.splice(0,1);v.push(e)}try{if(y(o[e])!==false){if(e===s){return}var t=new FileReader,r=1048576*f.maxfilesize;t.index=e;if(o[e].size>r){f.error(n[2],o[e],e);v.forEach(function(t,n){if(t===e){v.splice(n,1)}});a++;return true}t.onerror=function(e){switch(e.target.error.code){case e.target.error.NOT_FOUND_ERR:f.error(n[4]);return false;case e.target.error.NOT_READABLE_ERR:f.error(n[5]);return false;case e.target.error.ABORT_ERR:f.error(n[6]);return false;default:f.error(n[7]);return false}};t.onloadend=!f.beforeSend?T:function(t){f.beforeSend(o[e],e,function(){T(t)})};if(!u){t.readAsBinaryString(o[e])}else{t.readAsDataURL(o[e])}}else{a++}}catch(l){v.forEach(function(t,n){if(t===e){v.splice(n,1)}});if(window.console){console.error(l)}f.error(n[0]);return false}if(c.length>0){x()}};var T=function(t){var n=(typeof t.srcElement==="undefined"||t.srcElement===null?t.target:t.srcElement).index;if(t.target.index===undefined){t.target.index=m(t.total)}var u=new XMLHttpRequest,c=u.upload,y=o[t.target.index],E=t.target.index,S=(new Date).getTime(),x="------multipartformboundary"+(new Date).getTime(),T=l.length,N,C=g(y.name),k=y.type;if(typeof C==="string"){N=h(C,t.target.result,k,x)}else{N=h(y.name,t.target.result,k,x)}c.index=E;c.file=y;c.downloadStartTime=S;c.currentStart=S;c.currentProgress=0;c.global_progress_index=T;c.startData=0;c.addEventListener("progress",p,false);if(jQuery.isFunction(f.url)){u.open("POST",f.url(),true)}else{u.open("POST",f.url,true)}if(f.withCredentials){u.withCredentials=f.withCredentials}u.setRequestHeader("content-type","multipart/form-data; boundary="+x);e.each(f.headers,function(e,t){u.setRequestHeader(e,t)});u.sendAsBinary(N);l[T]=0;d();f.uploadStarted(E,y,s);u.onload=function(){var e=null;if(u.responseText){try{e=jQuery.parseJSON(u.responseText)}catch(t){e=u.responseText}}var o=(new Date).getTime(),c=o-S,h=f.uploadFinished(E,y,e,c,u);r++;v.forEach(function(e,t){if(e===n){v.splice(t,1)}});w.push(n);l[T]=100;d();if(r===s-a){b()}if(h===false){i=true}if(u.status<200||u.status>299){f.error(u.statusText,y,n,u.status)}}};x()}function m(e){for(var t=0;t<s;t++){if(o[t].size===e){return t}}return undefined}function g(e){return f.rename(e)}function y(e){return f.beforeEach(e)}function b(){return f.afterAll()}function w(e){clearTimeout(r);e.preventDefault();f.dragEnter.call(this,e)}function E(e){clearTimeout(r);e.preventDefault();f.docOver.call(this,e);f.dragOver.call(this,e)}function S(e){clearTimeout(r);f.dragLeave.call(this,e);e.stopPropagation()}function x(e){e.preventDefault();f.docLeave.call(this,e);return false}function T(e){clearTimeout(r);e.preventDefault();f.docEnter.call(this,e);return false}function N(e){clearTimeout(r);e.preventDefault();f.docOver.call(this,e);return false}function C(e){r=setTimeout(function(t){return function(){f.docLeave.call(t,e)}}(this),200)}var f=e.extend({},t,a),l=[];this.on("drop",c).on("dragstart",f.dragStart).on("dragenter",w).on("dragover",E).on("dragleave",S);e(document).on("drop",x).on("dragenter",T).on("dragover",N).on("dragleave",C);e("#"+f.fallback_id).change(function(e){f.drop(e);o=e.target.files;s=o.length;v()});return this};try{if(XMLHttpRequest.prototype.sendAsBinary){return}XMLHttpRequest.prototype.sendAsBinary=function(e){function t(e){return e.charCodeAt(0)&255}var n=Array.prototype.map.call(e,t);var r=new Uint8Array(n);this.send(r.buffer)}}catch(f){}})(jQuery)