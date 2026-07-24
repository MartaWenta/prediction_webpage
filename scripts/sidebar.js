function buildSidebar(phases){
  var track=document.getElementById('sb-track');
  var html='';

  for(var i=0;i<phases.length;i++){
    var p=phases[i], color=PAGE_COLORS[p.color]||'#2d6a4f';
    if(i>0) html+='<div class="sb-connector"></div>';
    html+='<a class="sb-item" id="sb-'+p.id+'" href="#'+p.id+'">'
      +'<div class="sb-dot" style="border-color:'+color+'60"></div>'
      +'<div class="sb-phase-num">'+p.phaseNum+'</div>'
      +'<span class="sb-label">'+p.phaseNum+'. '+p.title+'</span>'
      +'</a>';
  }
  track.innerHTML=html;

  if(!window.IntersectionObserver) return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var dot=document.getElementById('sb-'+entry.target.id);
      if(dot){
        if(entry.isIntersecting) dot.classList.add('active');
        else dot.classList.remove('active');
      }
    });
  },{threshold:0.1,rootMargin:'-10% 0px -60% 0px'});

  for(var j=0;j<phases.length;j++){
    var sec=document.getElementById(phases[j].id);
    if(sec) obs.observe(sec);
  }
}
