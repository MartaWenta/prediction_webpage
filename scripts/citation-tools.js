(function(){
  var listenersBound=false;
  var tooltipEl=null;
  var pinnedEl=null;

  function numberToLetters(num){
    var n=Math.max(1,num), out='';
    while(n>0){
      n--;
      out=String.fromCharCode(97+(n%26))+out;
      n=Math.floor(n/26);
    }
    return out;
  }

  function escapeHtml(s){
    return (s||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/\"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  // Turn bare URLs in a bibliography entry into anchors. `label` replaces the
  // visible URL text when given (used in tooltips, where space is tight).
  function linkifyUrls(detail, label){
    return escapeHtml(detail||'').replace(/https?:\/\/[^\s)<]+/gi,function(url){
      var href=url.replace(/[.,;:]+$/,'');
      var trailing=url.slice(href.length);
      return '<a href="'+href+'" target="_blank" rel="noopener noreferrer">'+(label||href)+'</a>'+trailing;
    });
  }

  function citationHtml(detail){
    return linkifyUrls(detail,'link');
  }

  function ensureTooltip(){
    if(tooltipEl) return tooltipEl;
    tooltipEl=document.createElement('div');
    tooltipEl.id='cite-tooltip';
    tooltipEl.className='cite-tooltip';
    tooltipEl.hidden=true;
    tooltipEl.addEventListener('mouseleave',hideTooltip);
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function showTooltip(el){
    if(!el) return;
    var tip=ensureTooltip();
    tip.innerHTML=citationHtml(el.getAttribute('data-ref')||'');
    tip.hidden=false;
    tip.classList.toggle('is-pinned', !!pinnedEl && pinnedEl===el);
    var r=el.getBoundingClientRect();
    var w=260;
    var x=Math.max(10,Math.min(window.innerWidth-w-10,r.left+r.width/2-w/2));
    var y=Math.max(10,r.top-10-tip.offsetHeight);
    tip.style.left=x+'px';
    tip.style.top=y+'px';
  }

  function hideTooltip(){
    pinnedEl=null;
    if(tooltipEl) tooltipEl.hidden=true;
  }

  function keepTooltipVisible(el){
    pinnedEl=el;
    showTooltip(el);
  }

  function bindListeners(citationSelector){
    if(listenersBound) return;
    listenersBound=true;

    document.addEventListener('mouseover',function(e){
      var cite=e.target.closest?e.target.closest(citationSelector):null;
      if(cite) showTooltip(cite);
    });

    document.addEventListener('mouseout',function(e){
      var cite=e.target.closest?e.target.closest(citationSelector):null;
      if(!cite) return;
      var tip=ensureTooltip();
      if(tip.contains(e.relatedTarget) || (pinnedEl && pinnedEl===cite)) return;
      hideTooltip();
    });

    document.addEventListener('focusin',function(e){
      var cite=e.target.closest?e.target.closest(citationSelector):null;
      if(cite) showTooltip(cite);
    });

    document.addEventListener('focusout',function(e){
      var cite=e.target.closest?e.target.closest(citationSelector):null;
      if(cite && !(pinnedEl && pinnedEl===cite)) hideTooltip();
    });

    document.addEventListener('click',function(e){
      var cite=e.target.closest?e.target.closest(citationSelector):null;
      if(cite){
        if(pinnedEl && pinnedEl===cite) hideTooltip();
        else keepTooltipVisible(cite);
        e.preventDefault();
        return;
      }
      if(tooltipEl && !tooltipEl.contains(e.target)) hideTooltip();
    });

    document.addEventListener('scroll',hideTooltip,{passive:true});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') hideTooltip(); });
  }

  function getBiblio(opts){
    if(opts&&opts.biblio) return opts.biblio;
    if(opts&&opts.biblioGlobal&&window[opts.biblioGlobal]) return window[opts.biblioGlobal];
    return {};
  }

  function renderReferences(outEl, orderedKeys, bib, missingPrefix){
    if(!outEl) return;
    var html=[];
    for(var i=0;i<orderedKeys.length;i++){
      var key=orderedKeys[i];
      var detail=bib[key]||(missingPrefix+key+'.');
      html.push('<p>['+(i+1)+'] '+linkifyUrls(detail)+'</p>');
    }
    outEl.innerHTML=html.join('');
  }

  function hydrate(opts){
    opts=opts||{};
    var biblio=getBiblio(opts);
    var citationSelector=opts.citationSelector||'.cite-ref[data-cite]';
    var footnoteSupSelector=opts.footnoteSupSelector||'.footnote-ref';
    var footnoteLabelSelector=opts.footnoteLabelSelector||null;
    var missingPrefix=opts.missingPrefix||'Reference details not found for ';

    var seen={}, orderedKeys=[], nextNum=1;
    var cites=document.querySelectorAll(citationSelector);
    for(var i=0;i<cites.length;i++){
      var cite=cites[i];
      var raw=(cite.getAttribute('data-cite')||'').trim();
      if(!raw) continue;
      var key=raw.toLowerCase();
      if(!seen[key]){ seen[key]=nextNum++; orderedKeys.push(key); }
      var num=seen[key];
      var detail=biblio[key]||(missingPrefix+raw+'.');
      cite.textContent=String(num);
      cite.setAttribute('data-ref','['+num+'] '+detail);
      cite.setAttribute('aria-label','Reference '+num+': '+detail);
      cite.setAttribute('tabindex','0');
      cite.removeAttribute('title');
    }

    var sups=document.querySelectorAll(footnoteSupSelector);
    for(var j=0;j<sups.length;j++){
      sups[j].textContent=numberToLetters(j+1);
      if(!sups[j].getAttribute('tabindex')) sups[j].setAttribute('tabindex','0');
    }

    if(footnoteLabelSelector){
      var labels=document.querySelectorAll(footnoteLabelSelector);
      for(var k=0;k<labels.length;k++) labels[k].textContent=numberToLetters(k+1)+'. ';
    }

    if(opts.referencesOutSelector){
      renderReferences(document.querySelector(opts.referencesOutSelector),orderedKeys,biblio,missingPrefix);
    }

    bindListeners(citationSelector);
  }

  window.CitationTools={ hydrate:hydrate, hideTooltip:hideTooltip };
})();
