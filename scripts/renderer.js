var PAGE_COLORS={ c1:'#2d6a4f', c2:'#1a5276', c3:'#6c3483', c4:'#b7471c', c5:'#117a65' };

function renderSubItems(items, bgWhite){
  if(!items||!items.length) return '';
  var html='<ul class="sub-list">';
  for(var i=0;i<items.length;i++){
    var s=items[i], hasDetail=s.detail&&s.detail!=='[text]';
    html+='<li><div class="sub-item" '+(bgWhite?'style="background:var(--parchment)"':'')+' onclick="toggleSub(this)">';
    html+='<span class="si-icon">'+s.icon+'</span>';
    html+='<div class="si-body">';
    html+='<div class="si-name">'+s.name+(s.role==='sh'?'<span class="role-tag role-sh">Stakeholder</span>':'')+'</div>';
    if(s.desc&&s.desc!=='[text]') html+='<div class="si-desc">'+s.desc+'</div>';
    if(hasDetail) html+='<div class="si-detail" hidden="until-found">'+s.detail+'</div>';
    html+='</div>';
    if(hasDetail) html+='<span class="si-chev">&#9658;</span>';
    html+='</div></li>';
  }
  html+='</ul>';
  return html;
}

function renderSubNodes(nodes, color){
  if(!nodes||!nodes.length) return '';
  var html='<div style="margin-top:10px">';
  for(var i=0;i<nodes.length;i++){
    var n=nodes[i];
    var roleTag=n.role==='sh'?'<span class="role-tag role-sh">Stakeholder</span>':'';
    var bodyHtml=(n.body&&n.body!=='[text]')?'<p>'+n.body+'</p>':'';
    var xlHtml='';
    for(var x=0;x<n.xlinks.length;x++){
      var xl=n.xlinks[x];
      xlHtml+='<div class="xlink">&#8596; <strong>Cross-phase:</strong> '+xl.text+' <a href="#'+xl.target+'">Jump &rarr;</a></div>';
    }
    var exHtml=(n.example&&n.example!=='[text]')?'<div class="example">'+n.example+'</div>':'';
    var impHtml=(n.important&&n.important!=='[text]')?'<div class="important">'+n.important+'</div>':'';
    html+='<div class="sub-card" id="'+n.id+'" style="border-left-color:'+color+'">'
      +'<div class="sub-card-hd" onclick="toggleSubCard(this.parentElement)">'
      +'<span class="sub-card-title">'+n.title+roleTag+'</span>'
      +'<svg class="sub-card-chev" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      +'</div>'
      +'<div class="sub-card-body" hidden="until-found">'+bodyHtml+renderSubItems(n.subItems,true)+xlHtml+exHtml+impHtml+'</div></div>';
  }
  html+='</div>';
  return html;
}

function renderNode(node, color){
  var xlHtml='';
  for(var x=0;x<node.xlinks.length;x++){
    var xl=node.xlinks[x];
    xlHtml+='<div class="xlink">&#8596; <strong>Cross-phase:</strong> '+xl.text+' <a href="#'+xl.target+'">Jump &rarr;</a></div>';
  }
  var exHtml=(node.example&&node.example!=='[text]')?'<div class="example">'+node.example+'</div>':'';
  var impHtml=(node.important&&node.important!=='[text]')?'<div class="important">'+node.important+'</div>':'';
  var roleTag=node.role==='sh'?'<span class="role-tag role-sh">Stakeholder</span>':'';
  var bodyHtml=(node.body&&node.body!=='[text]')
    ?'<p>'+node.body+'</p>'
    :'<p style="color:var(--ink-muted);font-style:italic;font-size:.81rem">[text to be added]</p>';

  return '<div class="card" id="'+node.id+'" style="border-left-color:'+color+'">'
    +'<div class="card-hd" onclick="toggleCard(this.parentElement)">'
    +'<span class="card-title">'+node.title+roleTag+'</span>'
    +'<svg class="chevron" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    +'</div>'
    +'<div class="card-body" hidden="until-found">'+bodyHtml+renderSubItems(node.subItems,false)
    +(node.subNodes&&node.subNodes.length?renderSubNodes(node.subNodes,color):'')
    +xlHtml+exHtml+impHtml+'</div></div>';
}

function renderPhase(phase){
  var color=PAGE_COLORS[phase.color]||'#2d6a4f';
  var nodesHtml='';
  for(var n=0;n<phase.nodes.length;n++) nodesHtml+=renderNode(phase.nodes[n],color);
  var ratHtml=(phase.rationale&&phase.rationale!=='[text]')
    ?'<div class="rationale"><span class="rat-label">Rationale</span><span class="rat-text">'+phase.rationale+'</span></div>'
    :'';

  return '<section class="phase collapsed" id="'+phase.id+'" style="border-top-color:'+color+'">'
    +'<div class="phase-hd" onclick="togglePhase(this.parentElement)">'
    +'<div class="phase-num-badge" style="background:'+color+'">'+phase.phaseNum+'</div>'
    +'<h2 class="phase-title">'+phase.title+'</h2>'
    +(phase.role?'<span class="phase-role">'+phase.role+'</span>':'')
    +'<svg class="phase-chev" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    +'</div>'
    +'<div class="phase-nodes" hidden="until-found">'+ratHtml+nodesHtml+'</div>'
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
