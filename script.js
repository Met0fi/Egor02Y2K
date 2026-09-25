(function(){
  function load(i, acc){
    if(i>3){
      var s=document.createElement("script");
      s.textContent=acc.join("");
      document.head.appendChild(s);
      return;
    }
    var r=new XMLHttpRequest();
    r.open("GET","s"+i+".txt",true);
    r.onreadystatechange=function(){
      if(r.readyState===4){
        acc.push(r.responseText||"");
        load(i+1,acc);
      }
    };
    r.send();
  }
  load(1,[]);
})();
