// Parse the source content into structured sections for the page renderer.
function parseContent() {
  var raw=document.getElementById('page-content').textContent;
  var lines=raw.split('\n');
  var result={ intro:[], glossary:[], checklist:[], contentions:[], phases:[] };
  var section=null, curPhase=null, curNode=null, curSubNode=null, curSub=null, curField=null;

  function flush(){ curField=null; }
  function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

  // Walk the content line by line and build the structured phase, node, and glossary data.
  function stripHtml(s){ return s.replace(/<[^>]*>/g,''); }
  function trimVal(s){ return s.replace(/^\s+|\s+$/g,''); }
  function indentOf(line){ var m=line.match(/^(\s*)/); return m?m[1].length:0; }
  function colorFor(num){ return ['c1','c2','c3','c4','c5'][num-1]||'c1'; }
  function isKeyword(line){
    return line.indexOf('--- ')===0||line.indexOf('>>> ')===0||
           line.indexOf('ROLE ')===0||line.indexOf('RATIONALE ')===0||
           line==='STAKEHOLDER'||line.indexOf('TEXT ')===0||
           line.indexOf('EXAMPLE ')===0||line.indexOf('IMPORTANT ')===0||
           line.indexOf('XLINK ')===0;
  }

  for(var i=0;i<lines.length;i++){
    var raw_line=lines[i], line=trimVal(raw_line);
    if(line===''){
      if(section==='INTRO'&&curField==='intro') result.intro.push('');
      curField=null;
      continue;
    }
    if(line.indexOf('## ')===0){
      section=trimVal(line.slice(3));
      curPhase=null; curNode=null; curSubNode=null; curSub=null; curField=null;
      continue;
    }
    if(line.indexOf('=== ')===0){
      flush();
      var pRaw=trimVal(line.slice(4)), dotPos=pRaw.indexOf('.');
      var pNum=dotPos>-1?parseInt(pRaw.slice(0,dotPos),10):(result.phases.length+1);
      var pTitle=dotPos>-1?trimVal(pRaw.slice(dotPos+1)):pRaw;
      curPhase={id:'phase'+pNum,title:pTitle,role:'',color:colorFor(pNum),phaseNum:String(pNum),rationale:'',nodes:[]};
      result.phases.push(curPhase);
      curNode=null; curSubNode=null; curSub=null;
      continue;
    }
    if(line.indexOf('--- ')===0){
      flush();
      var nTitleRaw=trimVal(line.slice(4));
      var nId, nTitle;
      var idMatch=nTitleRaw.match(/^(.*?)\s+#([a-z0-9\-]+)\s*$/);
      if(idMatch){ nTitle=trimVal(idMatch[1]); nId=idMatch[2]; }
      else { nTitle=nTitleRaw; nId=slugify(nTitleRaw); }
      if(indentOf(raw_line)>=2&&curNode){
        curSubNode={id:nId,title:nTitle,role:null,body:'',subItems:[],xlinks:[],example:null,important:null};
        if(!curNode.subNodes) curNode.subNodes=[];
        curNode.subNodes.push(curSubNode);
        curSub=null;
      }else{
        curSubNode=null;
        curNode={id:nId,title:nTitle,role:null,badges:[],body:'',subItems:[],xlinks:[],example:null,important:null,subNodes:[]};
        if(curPhase) curPhase.nodes.push(curNode);
        curSub=null;
      }
      continue;
    }
    if(line.indexOf('>>> ')===0){
      flush();
      var sRaw=trimVal(line.slice(4)), iconMatch=sRaw.match(/^(\S+)\s+(.*)/);
      var subName=iconMatch?trimVal(iconMatch[2]):sRaw;
      var subBaseId=slugify(stripHtml(subName))||'item';
      var siTarget=curSubNode||curNode;
      var subId=subBaseId;
      if(siTarget&&siTarget.subItems){
        var suffix=2;
        var exists=true;
        while(exists){
          exists=false;
          for(var si=0;si<siTarget.subItems.length;si++){
            if(siTarget.subItems[si].id===subId){ exists=true; break; }
          }
          if(exists){ subId=subBaseId+'-'+suffix; suffix++; }
        }
      }
      curSub={id:subId,icon:iconMatch?iconMatch[1]:'',name:subName,role:null,desc:''};
      if(siTarget) siTarget.subItems.push(curSub);
      curField='sub-desc';
      continue;
    }
    if(line.indexOf('ROLE ')===0&&curPhase&&!curNode){ curPhase.role=trimVal(line.slice(5)); flush(); continue; }
    if(line.indexOf('RATIONALE ')===0&&curPhase&&!curNode){ curPhase.rationale=trimVal(line.slice(10)); curField='rationale'; continue; }
    if(line==='STAKEHOLDER'){
      if(curSub) curSub.role='sh'; else if(curSubNode) curSubNode.role='sh'; else if(curNode) curNode.role='sh';
      flush();
      continue;
    }
    if(line.indexOf('TEXT ')===0&&(curSubNode||curNode)){
      var tgt=curSubNode||curNode;
      tgt.body=trimVal(line.slice(5));
      curField='text';
      continue;
    }
    if(line.indexOf('EXAMPLE ')===0&&(curSubNode||curNode)){
      (curSubNode||curNode).example='<strong>'+trimVal(line.slice(8))+'</strong>';
      curField='example';
      continue;
    }
    if(line.indexOf('IMPORTANT ')===0&&(curSubNode||curNode)){
      (curSubNode||curNode).important='<strong>'+trimVal(line.slice(10))+'</strong>';
      curField='important';
      continue;
    }
    if((line.indexOf('XLINK ')===0)&&(curSubNode||curNode)){
      var xTarget=curSubNode||curNode;
      var body=line.slice(6);
      var xlParts=body.split('|');
      xTarget.xlinks.push({text:trimVal(xlParts[0]),target:xlParts[1]?trimVal(xlParts[1]):''});
      flush();
      continue;
    }
    if(section==='INTRO'){ result.intro.push(line); curField='intro'; continue; }
    if(section==='GLOSSARY'){
      var gp=line.split('|');
      if(gp.length>=2) result.glossary.push({term:trimVal(gp[0]),def:trimVal(gp[1])});
      continue;
    }
    if(section==='CHECKLIST'){
      var cp=line.split('|'), lm=cp[1]&&trimVal(cp[1]).match(/LINK\s+(\S+)/);
      result.checklist.push({text:trimVal(cp[0]),link:lm?lm[1]:null});
      continue;
    }
    if(section==='CONTENTION'){
      if(indentOf(raw_line)===0) result.contentions.push({q:line,body:''});
      else if(result.contentions.length>0){
        var last=result.contentions[result.contentions.length-1];
        last.body=last.body?last.body+' '+line:line;
      }
      continue;
    }
    if(!isKeyword(line)&&indentOf(raw_line)>=2){
      if(curField==='rationale'&&curPhase&&!curNode){ curPhase.rationale+=' '+line; continue; }
      if(curField==='text'){ var tt=curSubNode||curNode; if(tt){ tt.body+=' '+line; } continue; }
      if(curField==='example'){ var te=curSubNode||curNode; if(te){ te.example+=' '+line; } continue; }
      if(curField==='important'){ var ti=curSubNode||curNode; if(ti){ ti.important+=' '+line; } continue; }
      if(curField==='sub-desc'&&curSub){ curSub.desc=curSub.desc?curSub.desc+' '+line:line; continue; }
    }
  }

  return result;
}
