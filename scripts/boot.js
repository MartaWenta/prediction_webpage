// Render the whole page from the parsed content and initialise the interactive widgets.
function typesetMath(roots){
  if(!window.MathJax||!MathJax.typesetPromise) return;
  var els=[].concat(roots||[]).filter(Boolean);
  if(els.length) MathJax.typesetPromise(els);
}
window.typesetMath=typesetMath;

function renderAll(raw){
  var data=parseContent(raw);

  document.getElementById('intro-body').innerHTML=renderIntro(data.intro);

  var main=document.getElementById('main'), html='';
  for(var i=0;i<data.phases.length;i++) html+=renderPhase(data.phases[i]);
  main.innerHTML=html;

  var glosOut=document.getElementById('glos-out');
  if(glosOut) glosOut.innerHTML=renderGlossary(data.glossary);

  var highlightOut=document.getElementById('highlight-out');
  if(highlightOut) highlightOut.innerHTML=renderChecklist(data.checklist);

  if(window.CitationTools){
    window.CitationTools.hydrate({
      biblioGlobal:'BASIS_BIBLIO',
      citationSelector:'.cite-ref[data-cite]',
      footnoteSupSelector:'.footnote-ref',
      referencesOutSelector:'#refs-out',
      missingPrefix:'Reference details not found in central bibliography for '
    });
  }

  autoDefine(main,data.glossary);
  autoDefine(document.getElementById('intro-body'),data.glossary);
  autoDefine(highlightOut,data.glossary);
  enableTapTooltips();

  buildSidebar(data.phases);
  collectConnectors(data.phases);
  drawConnectors();
  typesetMath([main, document.getElementById('intro-body'), highlightOut]);
}

function showContentLoadError(err){
  console.error(err);
  var main=document.getElementById('main');
  if(main){
    main.innerHTML='<p style="padding:2rem;color:#cc3333;line-height:1.6">Could not load <code>webpage.html</code>. '
      +'Open the site via a local web server (e.g. <code>python -m http.server</code> in the project folder), then refresh.</p>';
  }
}

function extractPageContent(raw){
  var match=raw.match(/^## INTRO\b/m);
  return match?raw.slice(match.index):raw;
}

function loadPageContent(){
  return fetch('webpage.html').then(function(res){
    if(!res.ok) throw new Error('HTTP '+res.status+' loading webpage.html');
    return res.text();
  }).then(function(html){
    var doc=new DOMParser().parseFromString(html,'text/html');
    var el=doc.getElementById('page-content');
    return extractPageContent(el?el.textContent:html);
  });
}

document.addEventListener('DOMContentLoaded',function(){
  loadPageContent().then(renderAll).catch(showContentLoadError);
});
document.addEventListener('beforematch',function(e){
  revealCollapsedForSearch(e.target);
},true);

function setFindHidden(el, hidden){
  if(!el) return;
  if(hidden) el.setAttribute('hidden','until-found');
  else el.removeAttribute('hidden');
}

function setExpanded(container, bodySel, expanded, inverted){
  var body=container.querySelector(bodySel);
  if(inverted){
    container.classList.toggle('collapsed',!expanded);
    setFindHidden(body,!expanded);
  }else{
    container.classList.toggle('open',expanded);
    setFindHidden(body,!expanded);
  }
}

function toggleContainer(container, bodySel, inverted){
  var expanded=inverted?container.classList.contains('collapsed'):!container.classList.contains('open');
  setExpanded(container, bodySel, expanded, inverted);
  setTimeout(drawConnectors,220);
}

function revealCollapsedForSearch(target){
  var node=target;
  while(node&&node!==document.body){
    if(node.classList){
      if(node.classList.contains('card-body')){
        node.parentElement.classList.add('open');
        setFindHidden(node,false);
      }else if(node.classList.contains('phase-nodes')){
        node.parentElement.classList.remove('collapsed');
        setFindHidden(node,false);
      }else if(node.classList.contains('sec-collapsed')){
        node.classList.remove('sec-collapsed');
        setFindHidden(node,false);
        var prev=node.previousElementSibling;
        if(prev&&prev.classList.contains('sec-title')) prev.classList.remove('collapsed');
      }
    }
    node=node.parentElement;
  }
  setTimeout(drawConnectors,0);
}

function toggleSection(contentId, titleEl){
  var content=document.getElementById(contentId);
  var collapsed=content.classList.toggle('sec-collapsed');
  titleEl.classList.toggle('collapsed',collapsed);
  setFindHidden(content,collapsed);
  setTimeout(drawConnectors,220);
}

document.addEventListener('click',function(e){
  var cardHd=e.target.closest&&e.target.closest('.card-hd');
  if(cardHd){ toggleContainer(cardHd.parentElement,'.card-body',false); return; }
  var phaseHd=e.target.closest&&e.target.closest('.phase-hd');
  if(phaseHd){ toggleContainer(phaseHd.parentElement,'.phase-nodes',true); return; }
  var secTitle=e.target.closest&&e.target.closest('.sec-title[data-sec]');
  if(secTitle){ toggleSection(secTitle.getAttribute('data-sec'),secTitle); return; }
});

function toggleLinksState(enabled){
  document.body.classList.toggle('show-links',enabled);
  drawConnectors();
}

function toggleFloatingControls(btn){
  var dock=document.getElementById('floating-controls');
  if(!dock) return;
  var isCollapsed=dock.classList.toggle('is-collapsed');
  if(btn){
    btn.setAttribute('aria-expanded',isCollapsed?'false':'true');
    btn.setAttribute('aria-label',isCollapsed?'Expand quick controls':'Collapse quick controls');
    btn.title=isCollapsed?'Expand quick controls':'Collapse quick controls';
  }
}

function setAllSectionsExpanded(expanded){
  var phases=document.querySelectorAll('.phase');
  for(var i=0;i<phases.length;i++) setExpanded(phases[i],'.phase-nodes',expanded,true);

  var cards=document.querySelectorAll('.card');
  for(var j=0;j<cards.length;j++) setExpanded(cards[j],'.card-body',expanded,false);

  var secTitles=document.querySelectorAll('.sec-title:not(.no-toggle)');
  for(var m=0;m<secTitles.length;m++) secTitles[m].classList.toggle('collapsed',!expanded);

  var sections=document.querySelectorAll('#s-checklist, #s-glossary, #s-references');
  for(var n=0;n<sections.length;n++){
    sections[n].classList.toggle('sec-collapsed',!expanded);
    setFindHidden(sections[n],!expanded);
  }

  drawConnectors();
}

window.addEventListener('resize', drawConnectors, {passive:true});
