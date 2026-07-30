var PAGE_COLORS={ c1:'#2d6a4f', c2:'#1a5276', c3:'#6c3483', c4:'#b7471c', c5:'#117a65' };

function escapeAttr(value){
  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function isPlaceholder(text){ return !text||text.trim()==='[text]'; }

function renderDetailsButton(leafId, title){
  var page='details/'+leafId+'.html';
  return '<div class="details-row"><button class="more-details-btn" type="button" data-detail-page="'+escapeAttr(page)+'" data-detail-title="'+escapeAttr(title||leafId)+'">More details</button></div>';
}

function hasBlockHtml(text){
  return /<(p|ul|ol|li|div|table|blockquote|h[1-6]|pre|hr|section|article)\b/i.test(text);
}

function renderRichText(text){
  if(!text) return '';
  if(hasBlockHtml(text)) return text;
  var chunks=text
    .split(/\n\s*\n/)
    .map(function(part){ return part.replace(/\s*\n\s*/g,' ').trim(); })
    .filter(function(part){ return part!==''; });
  return chunks.map(function(part){ return '<p>'+part+'</p>'; }).join('');
}

function renderRoleTag(role){
  return role?'<span class="role-tag">'+escapeAttr(role)+'</span>':'';
}

function renderXlinks(xlinks){
  var html='';
  for(var x=0;x<xlinks.length;x++){
    html+='<div class="xlink">&#8596; <strong>Cross-phase:</strong> <a href="#'+xlinks[x]+'">Jump &rarr;</a></div>';
  }
  return html;
}

function renderOptionalBlock(text, className){
  return isPlaceholder(text)?'':'<div class="'+className+'">'+renderRichText(text)+'</div>';
}

function renderSubItems(items, bgWhite){
  if(!items||!items.length) return '';
  var html='<ul class="sub-list">';
  for(var i=0;i<items.length;i++){
    var s=items[i], subLeafId=s.id||('item-'+i);
    html+='<li><div class="sub-item" '+(bgWhite?'style="background:var(--parchment)"':'')+'>';
    html+='<span class="si-icon">'+s.icon+'</span>';
    html+='<div class="si-body">';
    html+='<div class="si-name">'+s.name+renderRoleTag(s.role)+'</div>';
    if(!isPlaceholder(s.desc)) html+='<div class="si-desc">'+renderRichText(s.desc)+'</div>';
    html+=renderDetailsButton(subLeafId,s.name);
    html+='</div></div></li>';
  }
  return html+'</ul>';
}

function renderNodeBody(node){
  var hasContent=!isPlaceholder(node.body)||node.subItems.length||!isPlaceholder(node.bodyAfter);
  var bodyHtml=!isPlaceholder(node.body)
    ?renderRichText(node.body)
    :(hasContent?'':'<p style="color:var(--ink-muted);font-style:italic;font-size:.81rem">[text to be added]</p>');
  return bodyHtml
    +renderDetailsButton(node.id,node.title)
    +renderSubItems(node.subItems,false)
    +(isPlaceholder(node.bodyAfter)?'':renderRichText(node.bodyAfter))
    +renderXlinks(node.xlinks)
    +renderOptionalBlock(node.example,'example')
    +renderOptionalBlock(node.important,'important');
}

function renderNode(node, color){
  return '<div class="card" id="'+node.id+'" style="border-left-color:'+color+'">'
    +'<div class="card-hd">'
    +'<span class="card-title">'+node.title+renderRoleTag(node.role)+'</span>'
    +'<svg class="chevron" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    +'</div>'
    +'<div class="card-body" hidden="until-found">'+renderNodeBody(node)+'</div></div>';
}

function renderPhase(phase){
  var color=PAGE_COLORS[phase.color]||'#2d6a4f';
  var nodesHtml='';
  for(var n=0;n<phase.nodes.length;n++) nodesHtml+=renderNode(phase.nodes[n],color);
  var ratHtml=isPlaceholder(phase.rationale)?''
    :'<div class="rationale"><span class="rat-label">Rationale</span><div class="rat-text">'+renderRichText(phase.rationale)+'</div></div>';

  return '<section class="phase collapsed" id="'+phase.id+'" style="border-top-color:'+color+'">'
    +'<div class="phase-hd">'
    +'<div class="phase-num-badge" style="background:'+color+'">'+phase.phaseNum+'</div>'
    +'<h2 class="phase-title">'+phase.title+'</h2>'
    +(phase.role?'<span class="phase-role">'+phase.role+'</span>':'')
    +'<svg class="phase-chev" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    +'</div>'
    +'<div class="phase-nodes" hidden="until-found">'+ratHtml+renderDetailsButton(phase.id,phase.title)+nodesHtml+'</div>'
    +'</section>';
}

function renderIntro(lines){
  var paras=[], cur=[];
  for(var i=0;i<lines.length;i++){
    if(lines[i]===''){
      if(cur.length){ paras.push(cur.join(' ')); cur=[]; }
    }else{
      cur.push(lines[i]);
    }
  }
  if(cur.length) paras.push(cur.join(' '));
  return paras.map(function(p){ return '<p>'+p+'</p>'; }).join('');
}

function renderGlossary(entries){
  var html='';
  for(var i=0;i<entries.length;i++){
    html+='<div class="glos-item"><div class="glos-term">'+entries[i].term+'</div><div class="glos-def">'+entries[i].def+'</div></div>';
  }
  return html;
}

function renderChecklist(items){
  var html='';
  for(var i=0;i<items.length;i++){
    var jump=items[i].link?' <a href="#'+items[i].link+'" class="checklist-jump">&rarr;</a>':'';
    html+='<div class="checklist-item"><span class="checklist-icon">&#128276;</span><span>'+items[i].text+jump+'</span></div>';
  }
  return html;
}
