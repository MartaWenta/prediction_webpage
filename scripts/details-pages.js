// Detail page overlay — pages live at details/{id}.html, matching each #id in basis.html.
function typesetDetailFrame(doc){
  if(!doc||!doc.body) return;
  var win=doc.defaultView;
  if(win.MathJax&&win.MathJax.typesetPromise){
    win.MathJax.typesetPromise([doc.body]);
    return;
  }
  var s=doc.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
  s.onload=function(){
    if(win.MathJax&&win.MathJax.typesetPromise) win.MathJax.typesetPromise([doc.body]);
  };
  doc.head.appendChild(s);
}

function openDetailOverlay(page, title){
  var dialog=document.getElementById('detail-overlay');
  var frame=document.getElementById('detail-overlay-frame');
  var titleEl=document.getElementById('detail-overlay-title');
  if(!dialog||!frame){
    window.location.href=page;
    return;
  }

  if(titleEl){
    titleEl.textContent='More details: '+(title||'');
  }
  frame.onload=function(){
    try{
      var doc=frame.contentDocument;
      if(!doc||!doc.body) return;
      doc.body.classList.add('embedded-detail');
      typesetDetailFrame(doc);
    }catch(err){}
  };
  frame.src=page;
  document.body.classList.add('detail-overlay-open');

  if(typeof dialog.showModal==='function') dialog.showModal();
  else dialog.setAttribute('open','open');
}

function closeDetailOverlay(){
  var dialog=document.getElementById('detail-overlay');
  var frame=document.getElementById('detail-overlay-frame');
  if(frame) frame.src='about:blank';
  if(dialog&&dialog.open){
    dialog.close();
  }else if(dialog){
    dialog.removeAttribute('open');
  }
  document.body.classList.remove('detail-overlay-open');
}

document.addEventListener('keydown',function(e){
  if(e.key==='Escape') closeDetailOverlay();
});

document.addEventListener('DOMContentLoaded',function(){
  var dialog=document.getElementById('detail-overlay');
  if(!dialog) return;
  dialog.addEventListener('click',function(e){
    if(e.target===dialog) closeDetailOverlay();
  });
  dialog.addEventListener('close',function(){
    document.body.classList.remove('detail-overlay-open');
    var frame=document.getElementById('detail-overlay-frame');
    if(frame) frame.src='about:blank';
  });
});

document.addEventListener('click',function(e){
  var btn=e.target.closest&&e.target.closest('.more-details-btn[data-detail-page]');
  if(!btn) return;
  e.preventDefault();
  var title=btn.getAttribute('data-detail-title')||'';
  if(!title||/^[a-z0-9-]+$/.test(title)){
    var source=btn.closest('.card,.sub-item,.phase');
    if(source){
      var titleEl=source.querySelector('.card-title,.phase-title,.si-name');
      if(titleEl){
        var clone=titleEl.cloneNode(true);
        var roleTags=clone.querySelectorAll('.role-tag');
        for(var i=0;i<roleTags.length;i++) roleTags[i].remove();
        title=clone.textContent.trim();
      }
    }
  }
  openDetailOverlay(btn.getAttribute('data-detail-page'),title);
});
