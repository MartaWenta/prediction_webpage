// Render the whole page from the parsed content and initialise the interactive widgets.
function renderAll(){
  var data=parseContent();

  document.getElementById('intro-body').innerHTML=renderIntro(data.intro);

  var main=document.getElementById('main'), html='';
  for(var i=0;i<data.phases.length;i++) html+=renderPhase(data.phases[i]);
  main.innerHTML=html;

  var gHtml='';
  for(var d=0;d<data.glossary.length;d++){
    gHtml+='<div class="glos-item"><div class="glos-term">'+data.glossary[d].term+'</div><div class="glos-def">'+data.glossary[d].def+'</div></div>';
  }
  var glosOut=document.getElementById('glos-out');
  if(glosOut) glosOut.innerHTML=gHtml;

  var hHtml='';
  for(var h=0;h<data.checklist.length;h++){
    var item=data.checklist[h];
    var jump=item.link?' <a href="#'+item.link+'" style="color:#cc3333;font-weight:600;text-decoration:none">&rarr;</a>':'';
    hHtml+='<div style="display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--rule);border-left:3px solid #cc3333;border-radius:7px;padding:9px 13px;margin-bottom:7px;font-size:0.84rem;color:var(--ink-mid);line-height:1.6"><span style="flex-shrink:0">&#128276;</span><span>'+item.text+jump+'</span></div>';
  }
  var highlightOut=document.getElementById('highlight-out');
  if(highlightOut) highlightOut.innerHTML=hHtml;

  if(window.CitationTools){
    window.CitationTools.hydrate({
      biblioGlobal:'BASIS_BIBLIO',
      citationSelector:'.cite-ref[data-cite]',
      footnoteSupSelector:'.footnote-ref',
      missingPrefix:'Reference details not found in central bibliography for '
    });
  }

  autoDefine(document.getElementById('main'),data.glossary);
  autoDefine(document.getElementById('intro-body'),data.glossary);
  autoDefine(highlightOut,data.glossary);
  if(typeof enableTapTooltips==='function') enableTapTooltips();

  buildSidebar(data.phases);
  collectConnectors(data.phases);
  drawConnectors();
}

document.addEventListener('DOMContentLoaded',renderAll);
document.addEventListener('beforematch',function(e){
  revealCollapsedForSearch(e.target);
},true);

function setFindHidden(el, hidden){
  if(!el) return;
  if(hidden) el.setAttribute('hidden','until-found');
  else el.removeAttribute('hidden');
}

// Expand sections that become relevant after search or navigation updates.
function revealCollapsedForSearch(target){
  var node=target;
  while(node&&node!==document.body){
    if(node.classList){
      if(node.classList.contains('sub-card-body')){
        node.parentElement.classList.add('open');
        setFindHidden(node,false);
      }else if(node.classList.contains('card-body')){
        node.parentElement.classList.add('open');
        setFindHidden(node,false);
      }else if(node.classList.contains('phase-nodes')){
        node.parentElement.classList.remove('collapsed');
        setFindHidden(node,false);
      }else if(node.classList.contains('sec-collapsed')){
        node.classList.remove('sec-collapsed');
        setFindHidden(node,false);
        if(node.previousElementSibling&&node.previousElementSibling.classList&&node.previousElementSibling.classList.contains('sec-title')){
          node.previousElementSibling.classList.remove('collapsed');
        }
      }
    }
    node=node.parentElement;
  }
  setTimeout(drawConnectors,0);
}

function toggleCard(card){
  card.classList.toggle('open');
  setFindHidden(card.querySelector('.card-body'),!card.classList.contains('open'));
  setTimeout(drawConnectors,220);
}

function toggleSubCard(card){
  card.classList.toggle('open');
  setFindHidden(card.querySelector('.sub-card-body'),!card.classList.contains('open'));
  setTimeout(drawConnectors,220);
}

function togglePhase(phase){
  phase.classList.toggle('collapsed');
  setFindHidden(phase.querySelector('.phase-nodes'),phase.classList.contains('collapsed'));
  setTimeout(drawConnectors,220);
}

function toggleSection(id,titleEl){
  var content=document.getElementById(id);
  var collapsed=content.classList.toggle('sec-collapsed');
  titleEl.classList.toggle('collapsed',collapsed);
  setFindHidden(content,collapsed);
  setTimeout(drawConnectors,220);
}

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
  for(var i=0;i<phases.length;i++){
    phases[i].classList.toggle('collapsed',!expanded);
    setFindHidden(phases[i].querySelector('.phase-nodes'),!expanded);
  }

  var cards=document.querySelectorAll('.card');
  for(var j=0;j<cards.length;j++){
    cards[j].classList.toggle('open',expanded);
    setFindHidden(cards[j].querySelector('.card-body'),!expanded);
  }

  var subCards=document.querySelectorAll('.sub-card');
  for(var k=0;k<subCards.length;k++){
    subCards[k].classList.toggle('open',expanded);
    setFindHidden(subCards[k].querySelector('.sub-card-body'),!expanded);
  }

  var secTitles=document.querySelectorAll('.sec-title:not(.no-toggle)');
  for(var m=0;m<secTitles.length;m++) secTitles[m].classList.toggle('collapsed',!expanded);

  var sections=document.querySelectorAll('#s-checklist, #s-glossary');
  for(var n=0;n<sections.length;n++){
    sections[n].classList.toggle('sec-collapsed',!expanded);
    setFindHidden(sections[n],!expanded);
  }

  drawConnectors();
}

window.addEventListener('resize', drawConnectors, {passive:true});
