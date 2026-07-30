// Scan content for glossary terms and add hoverable definition spans.
function autoDefine(root, glossary){
  if(!root) return;
  var lookup={}, terms=[];
  for(var i=0;i<glossary.length;i++){
    lookup[glossary[i].term.toLowerCase()]=glossary[i].def;
    terms.push(glossary[i].term);
  }
  terms.sort(function(a,b){ return b.length-a.length; });

  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
  var textNodes=[], node;
  while((node=walker.nextNode())){
    var skip=false, anc=node.parentNode;
    while(anc&&anc!==root){
      var cls=anc.className&&anc.className.indexOf?anc.className:'', tag=anc.nodeName;
      if(tag==='A'||tag==='H2'||tag==='H1'||
        (cls&&(cls.indexOf('def')!==-1||cls.indexOf('badge')!==-1||
               cls.indexOf('role-tag')!==-1||cls.indexOf('rat-label')!==-1||
               cls.indexOf('card-hd')!==-1||cls.indexOf('card-title')!==-1||
               cls.indexOf('phase-hd')!==-1||cls.indexOf('sub-item')!==-1))){
        skip=true;
        break;
      }
      anc=anc.parentNode;
    }
    if(!skip&&node.nodeValue&&node.nodeValue.trim().length>1) textNodes.push(node);
  }

  function isWordChar(ch){ return /[A-Za-z0-9_]/.test(ch); }

  for(var t=0;t<textNodes.length;t++){
    var tn=textNodes[t], text=tn.nodeValue, lower=text.toLowerCase();
    var bestIdx=-1, bestTerm=null;

    for(var k=0;k<terms.length;k++){
      var term=terms[k], tl=term.toLowerCase(), searchFrom=0, idx;
      while((idx=lower.indexOf(tl,searchFrom))!==-1){
        var before=idx===0?' ':text.charAt(idx-1);
        var afterPos=idx+tl.length;
        var after=afterPos>=text.length?' ':text.charAt(afterPos);
        if(!isWordChar(before)&&!isWordChar(after)){
          if(bestIdx===-1||idx<bestIdx||(idx===bestIdx&&term.length>bestTerm.length)){
            bestIdx=idx;
            bestTerm=term;
          }
          break;
        }
        searchFrom=idx+1;
      }
    }

    if(bestTerm!==null){
      var matchEnd=bestIdx+bestTerm.length;
      var def=lookup[bestTerm.toLowerCase()];
      var frag=document.createDocumentFragment();
      if(bestIdx>0) frag.appendChild(document.createTextNode(text.substring(0,bestIdx)));
      var span=document.createElement('span');
      span.className='def';
      span.setAttribute('data-def',def);
      span.setAttribute('tabindex','0');
      span.textContent=text.substring(bestIdx,matchEnd);
      frag.appendChild(span);
      if(matchEnd<text.length) frag.appendChild(document.createTextNode(text.substring(matchEnd)));
      tn.parentNode.replaceChild(frag,tn);
    }
  }
}

function enableTapTooltips(){
  document.addEventListener('click',function(e){
    var tip=e.target.closest?e.target.closest('.def, .footnote-ref'):null;
    if(tip){
      var wasOpen=tip.classList.contains('tapped');
      var open=document.querySelectorAll('.def.tapped, .footnote-ref.tapped');
      for(var i=0;i<open.length;i++) open[i].classList.remove('tapped');
      if(!wasOpen) tip.classList.add('tapped');
      e.stopPropagation();
      return;
    }
    var all=document.querySelectorAll('.def.tapped, .footnote-ref.tapped');
    for(var j=0;j<all.length;j++) all[j].classList.remove('tapped');
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      var all=document.querySelectorAll('.def.tapped, .footnote-ref.tapped');
      for(var i=0;i<all.length;i++) all[i].classList.remove('tapped');
    }
  });
}
