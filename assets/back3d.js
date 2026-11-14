// If this page was opened from the 3D portfolio, make its "back to portfolio"
// links return there (to the room you left) instead of the classic page.
(function(){
  var KEY='rv-from-3d',v=null;
  try{v=sessionStorage.getItem(KEY);}catch(e){}
  if(!v)return;
  var root=new URL(document.currentScript.src,location.href).pathname.replace(/assets\/back3d\.js$/,'');
  function fix(){
    var links=document.querySelectorAll('a[href]');
    for(var i=0;i<links.length;i++){
      var raw=links[i].getAttribute('href');if(/^[a-z]+:/i.test(raw))continue; // leave absolute links alone
      var u;try{u=new URL(raw,location.href);}catch(e){continue;}
      if(u.origin!==location.origin)continue;
      if(u.pathname===root||u.pathname===root+'index.html')links[i].href=root+'3d.html'+(v.charAt(0)==='#'?v:'');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
})();
