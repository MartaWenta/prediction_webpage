(function(){
  var CONNECTOR_PAIRS=[];
  var SVG_NS='http://www.w3.org/2000/svg';
  var LINK_COLORS=['#1f6f8b','#2d8f65','#bd6f1a','#8b3f9c','#b53d2f','#2a5f9e','#6b7d1e','#8b5a3c'];
  var CONNECTOR_STROKE_WIDTH='2.4';
  var CONNECTOR_OPACITY='0.95';
  var CONNECTOR_DOT_RADIUS='3.2';
  var CONNECTOR_OUTSET=70;
  var CONNECTOR_SKEW=22;
  var CONNECTOR_Y_LIFT=6;
  var CONNECTOR_X_PAD=12;

  function collectConnectors(phases){
    CONNECTOR_PAIRS=[];
    for(var i=0;i<phases.length;i++){
      var nodes=phases[i].nodes;
      for(var j=0;j<nodes.length;j++){
        var node=nodes[j];
        collectFromNode(node);
        if(node.subNodes) for(var k=0;k<node.subNodes.length;k++) collectFromNode(node.subNodes[k]);
      }
    }
  }

  function collectFromNode(node){
    for(var x=0, xLen=node.xlinks.length;x<xLen;x++){
      var xl=node.xlinks[x], t=xl.target;
      if(t&&t!==node.id) CONNECTOR_PAIRS.push({from:node.id,to:t});
    }
  }

  function isVisible(el){
    var p=el;
    while(p&&p!==document.body){
      if(p.style&&p.style.display==='none') return false;
      var cls=p.className||'';
      if(cls.indexOf('collapsed')!==-1) return false;
      p=p.parentElement;
    }
    return true;
  }

  function getAnchorPoint(el, originLeft, originTop){
    var hd=el.querySelector ? (el.querySelector('.card-hd') || el.querySelector('.sub-card-hd') || el.querySelector('.phase-hd')) : null;
    var target=hd || el;
    var r=target.getBoundingClientRect();

    if(r.width===0 && r.height===0){
      var anc=el.parentElement;
      while(anc && anc !== document.body){
        if(anc.classList && anc.classList.contains('phase')){
          var ph=anc.querySelector('.phase-hd');
          if(ph){
            var pr=ph.getBoundingClientRect();
            if(pr.width!==0 || pr.height!==0){
              return { right: pr.right-originLeft, y: pr.top+pr.height/2-originTop };
            }
          }
        }
        anc=anc.parentElement;
      }
      return null;
    }

    return { right: r.right-originLeft, y: r.top+r.height/2-originTop };
  }

  function addCurveSegment(g,x1,y1,cx1,cy1,cx2,cy2,x2,y2,color){
    var path=document.createElementNS(SVG_NS,'path');
    path.setAttribute('d','M'+x1+','+y1+' C'+cx1+','+cy1+' '+cx2+','+cy2+' '+x2+','+y2);
    path.setAttribute('fill','none');
    path.setAttribute('stroke',color);
    path.setAttribute('stroke-width',CONNECTOR_STROKE_WIDTH);
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('opacity',CONNECTOR_OPACITY);
    g.appendChild(path);
  }

  function addDot(g,cx,cy,color){
    var dot=document.createElementNS(SVG_NS,'circle');
    dot.setAttribute('cx',String(cx));
    dot.setAttribute('cy',String(cy));
    dot.setAttribute('r',CONNECTOR_DOT_RADIUS);
    dot.setAttribute('fill',color);
    dot.setAttribute('opacity',CONNECTOR_OPACITY);
    g.appendChild(dot);
  }

  function drawConnectors(){
    var svg=document.getElementById('connector-svg');
    var g=document.getElementById('connector-lines');
    if(!svg||!g) return;

    g.textContent='';
    if(!document.body.classList.contains('show-links')) return;

    var pageBody=document.querySelector('.page-body');
    if(!pageBody) return;

    var pbRect=pageBody.getBoundingClientRect();
    var originLeft=pbRect.left;
    var originTop=pbRect.top;

    svg.style.height=pageBody.scrollHeight+'px';

    var pbWidth=pageBody.clientWidth;
    var maxCx=pbWidth-CONNECTOR_X_PAD;

    for(var i=0, len=CONNECTOR_PAIRS.length;i<len;i++){
      var pair=CONNECTOR_PAIRS[i];
      var fromEl=document.getElementById(pair.from);
      var toEl=document.getElementById(pair.to);
      if(!fromEl||!toEl) continue;
      if(!isVisible(fromEl)&&!isVisible(toEl)) continue;

      var fromA=getAnchorPoint(fromEl, originLeft, originTop);
      var toA=getAnchorPoint(toEl, originLeft, originTop);
      if(!fromA||!toA) continue;

      var x1=fromA.right, y1=fromA.y;
      var x4=toA.right, y4=toA.y;

      var dirSign=(y4>=y1)?1:-1;
      var cx1=Math.min(x1+CONNECTOR_OUTSET, maxCx);
      var cy1=y1 + dirSign*CONNECTOR_Y_LIFT;
      var cx2=Math.min(x4+CONNECTOR_OUTSET, maxCx);
      var cy2=y4 - dirSign*CONNECTOR_SKEW;

      var color=LINK_COLORS[i%LINK_COLORS.length];
      addCurveSegment(g,x1,y1,cx1,cy1,cx2,cy2,x4,y4,color);
      addDot(g,x1,y1,color);
      addDot(g,x4,y4,color);
    }
  }

  window.collectConnectors=collectConnectors;
  window.drawConnectors=drawConnectors;
})();
