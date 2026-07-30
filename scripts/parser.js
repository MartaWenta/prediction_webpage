// Parse the source content into structured sections for the page renderer.
function parseContent() {
  var raw=document.getElementById('page-content').textContent;
  var lines=raw.split('\n');
  var result={ intro:[], glossary:[], checklist:[], phases:[] };
  var section=null, curPhase=null, curNode=null, curSubNode=null, curSub=null, curField=null;

  function flush(){ curField=null; }

  // Walk the content line by line and build the structured phase, node, and glossary data.
  function trimVal(s){ return s.replace(/^\s+|\s+$/g,''); }
  function indentOf(line){ var m=line.match(/^(\s*)/); return m?m[1].length:0; }
  function colorFor(num){ return ['c1','c2','c3','c4','c5'][num-1]||'c1'; }
  function splitDefinedId(text){
    var match=text.match(/^(.*?)(?:\s+#([a-z0-9\-]+))?\s*$/);
    return { label:trimVal(match?match[1]:text), id:match&&match[2]?match[2]:'' };
  }
  function appendField(target,key,text){
    if(!target) return;
    if(!target[key]) target[key]=text;
    else target[key]+=' '+text;
  }
  function isMultilineField(name){
    return name==='rationale'||name==='text'||name==='text-after'||name==='sub-desc'||name==='example'||name==='important';
  }
  function addFieldParagraphBreak(){
    if(!isMultilineField(curField)) return false;
    if(curField==='rationale'&&curPhase&&!curNode){ curPhase.rationale+='\n\n'; return true; }
    if(curField==='text'){
      var t=curSubNode||curNode;
      if(t){ t.body+='\n\n'; return true; }
      if(curPhase&&!curNode){ curPhase.body+='\n\n'; return true; }
      return false;
    }
    if(curField==='text-after'){
      var ta=curSubNode||curNode;
      if(ta){ ta.bodyAfter+='\n\n'; return true; }
      return false;
    }
    if(curField==='sub-desc'&&curSub){ curSub.desc+='\n\n'; return true; }
    if(curField==='example'){
      var ex=curSubNode||curNode;
      if(ex){ if(!ex.example) ex.example=''; ex.example+='\n\n'; return true; }
      return false;
    }
    if(curField==='important'){
      var imp=curSubNode||curNode;
      if(imp){ if(!imp.important) imp.important=''; imp.important+='\n\n'; return true; }
      return false;
    }
    return false;
  }
  function isKeyword(line){
    return line.indexOf('--- ')===0||line.indexOf('>>> ')===0||
           line.indexOf('ROLE ')===0||line.indexOf('RATIONALE ')===0||
           line==='RATIONALE'||line.indexOf('TEXT ')===0||line==='TEXT'||
           line.indexOf('EXAMPLE ')===0||line==='EXAMPLE'||line.indexOf('IMPORTANT ')===0||line==='IMPORTANT'||
           line.indexOf('LINK ')===0;
  }

  for(var i=0;i<lines.length;i++){
    var raw_line=lines[i], line=trimVal(raw_line);
    if(line===''){
      if(section==='INTRO'&&curField==='intro') result.intro.push('');
      if(!addFieldParagraphBreak()) curField=null;
      continue;
    }
    if(line.indexOf('## ')===0){
      section=trimVal(line.slice(3));
      curPhase=null; curNode=null; curSubNode=null; curSub=null; curField=null;
      continue;
    }
    if(line.indexOf('=== ')===0){
      flush();
      var phaseMeta=splitDefinedId(trimVal(line.slice(4))), dotPos=phaseMeta.label.indexOf('.');
      var pNum=dotPos>-1?parseInt(phaseMeta.label.slice(0,dotPos),10):(result.phases.length+1);
      var pTitle=dotPos>-1?trimVal(phaseMeta.label.slice(dotPos+1)):phaseMeta.label;
      curPhase={id:phaseMeta.id||('phase-'+pNum),title:pTitle,role:'',color:colorFor(pNum),phaseNum:String(pNum),rationale:'',body:'',nodes:[]};
      result.phases.push(curPhase);
      curNode=null; curSubNode=null; curSub=null;
      continue;
    }
    if(line.indexOf('--- ')===0){
      flush();
      var isSubNode=indentOf(raw_line)>=2&&curNode;
      var nodeMeta=splitDefinedId(trimVal(line.slice(4)));
      if(isSubNode){
        var subNodeId=nodeMeta.id||('sub-node-'+((curNode.subNodes?curNode.subNodes.length:0)+1));
        curSubNode={id:subNodeId,title:nodeMeta.label,role:null,body:'',bodyAfter:'',subItems:[],xlinks:[],example:null,important:null};
        if(!curNode.subNodes) curNode.subNodes=[];
        curNode.subNodes.push(curSubNode);
        curSub=null;
      }else{
        var nodeId=nodeMeta.id||('node-'+((curPhase&&curPhase.nodes)?curPhase.nodes.length+1:1));
        curSubNode=null;
        curNode={id:nodeId,title:nodeMeta.label,role:null,badges:[],body:'',bodyAfter:'',subItems:[],xlinks:[],example:null,important:null,subNodes:[]};
        if(curPhase) curPhase.nodes.push(curNode);
        curSub=null;
      }
      continue;
    }
    if(line.indexOf('>>> ')===0){
      flush();
      var sRaw=trimVal(line.slice(4)), iconMatch=sRaw.match(/^(\S+)\s+(.*)/);
      var subMeta=splitDefinedId(iconMatch?trimVal(iconMatch[2]):sRaw);
      var subName=subMeta.label;
      var siTarget=curSubNode||curNode;
      var subId=subMeta.id||('sub-item-'+((siTarget&&siTarget.subItems)?siTarget.subItems.length+1:1));
      curSub={id:subId,icon:iconMatch?iconMatch[1]:'',name:subName,role:null,desc:''};
      if(siTarget) siTarget.subItems.push(curSub);
      curField='sub-desc';
      continue;
    }
    if((line.indexOf('ROLE ')===0||line==='ROLE')&&(curSub||curSubNode||curNode||curPhase)){
      var roleValue=line==='ROLE'?'':trimVal(line.slice(5));
      if(curSub) curSub.role=roleValue;
      else if(curSubNode) curSubNode.role=roleValue;
      else if(curNode) curNode.role=roleValue;
      else curPhase.role=roleValue;
      flush();
      continue;
    }
    if((line.indexOf('RATIONALE ')===0||line==='RATIONALE')&&curPhase&&!curNode){
      curPhase.rationale=line==='RATIONALE'?'':trimVal(line.slice(10));
      curField='rationale';
      continue;
    }
    if((line.indexOf('TEXT ')===0||line==='TEXT')&&(curSubNode||curNode||(curPhase&&!curNode))){
      var textVal=line==='TEXT'?'':trimVal(line.slice(5));
      if(curSubNode||curNode){
        var tgt=curSubNode||curNode;
        if(tgt.subItems&&tgt.subItems.length>0){
          tgt.bodyAfter=textVal;
          curField='text-after';
        }else{
          tgt.body=textVal;
          curField='text';
        }
      }else{
        curPhase.body=textVal;
        curField='text';
      }
      continue;
    }
    if((line.indexOf('EXAMPLE ')===0||line==='EXAMPLE')&&(curSubNode||curNode)){
      (curSubNode||curNode).example=(line==='EXAMPLE')?'':'<strong>'+trimVal(line.slice(8))+'</strong>';
      curField='example';
      continue;
    }
    if((line.indexOf('IMPORTANT ')===0||line==='IMPORTANT')&&(curSubNode||curNode)){
      (curSubNode||curNode).important=(line==='IMPORTANT')?'':'<strong>'+trimVal(line.slice(10))+'</strong>';
      curField='important';
      continue;
    }
    if((line.indexOf('LINK ')===0)&&(curSubNode||curNode)){
      var xTarget=curSubNode||curNode;
      xTarget.xlinks.push({text:'',target:trimVal(line.slice(5))});
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
    if(!isKeyword(line)&&curField==='rationale'&&curPhase&&!curNode){
      appendField(curPhase,'rationale',line);
      continue;
    }
    if(!isKeyword(line)&&curField==='text'){
      if(curSubNode||curNode){
        appendField(curSubNode||curNode,'body',line);
        continue;
      }
      if(curPhase&&!curNode){
        appendField(curPhase,'body',line);
        continue;
      }
    }
    if(!isKeyword(line)&&curField==='text-after'){
      appendField(curSubNode||curNode,'bodyAfter',line);
      continue;
    }
    if(!isKeyword(line)&&curField==='example'){
      var te=curSubNode||curNode;
      if(te){ appendField(te,'example',line); continue; }
    }
    if(!isKeyword(line)&&curField==='important'){
      var ti=curSubNode||curNode;
      if(ti){ appendField(ti,'important',line); continue; }
    }
    if(!isKeyword(line)&&curField==='sub-desc'&&curSub){
      appendField(curSub,'desc',line);
      continue;
    }
  }

  return result;
}
