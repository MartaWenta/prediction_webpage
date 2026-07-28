// Detail pages for sections, sub-sections, and sub-items.
// Keys are IDs generated from the content parser.
// This registry maps each content leaf to its extra detail page.
// - Node/sub-node: "node-id"
// - Sub-item: "parent-node-id__sub-item-id"
window.DETAIL_PAGES={
  // Phase 1
  'specific-question':'details/specific-question.html',
  'target-that-can-be-modelled-and-observed':'details/target-that-can-be-modelled-and-observed.html',
  'scenario-planning-are-imaginable-results-useful-to-the-question':'details/scenario-planning-are-imaginable-results-useful-to-the-question.html',

  // Phase 2 nodes
  'data-available':'details/data-available.html',
  'modelling-approaches':'details/modelling-approaches.html',
  'specify-required-model-characteristics':'details/specify-required-model-characteristics.html',
  'long-term-planning':'details/long-term-planning.html',

  // Phase 2 sub-items
  'modelling-approaches__expert-statements':'details/modelling-approaches__expert-statements.html',
  'modelling-approaches__ml-dl-ai-statistics':'details/modelling-approaches__ml-dl-ai-statistics.html',
  'modelling-approaches__o-p-de':'details/modelling-approaches__o-p-de.html',
  'modelling-approaches__coded-process-model-incl-agent-based-model':'details/modelling-approaches__coded-process-model-incl-agent-based-model.html',
  'modelling-approaches__other':'details/modelling-approaches__other.html',
  'specify-required-model-characteristics__spatially-implicit-explicit':'details/specify-required-model-characteristics__spatially-implicit-explicit.html',
  'specify-required-model-characteristics__stochastic-deterministic':'details/specify-required-model-characteristics__stochastic-deterministic.html',
  'specify-required-model-characteristics__continuous-discrete-time':'details/specify-required-model-characteristics__continuous-discrete-time.html',
  'specify-required-model-characteristics__discrete-individuals-continuous-biomass':'details/specify-required-model-characteristics__discrete-individuals-continuous-biomass.html',
  'specify-required-model-characteristics__with-without-feedback':'details/specify-required-model-characteristics__with-without-feedback.html',
  'specify-required-model-characteristics__explicit-management-intervention-rules':'details/specify-required-model-characteristics__explicit-management-intervention-rules.html',
  'long-term-planning__efficient-use-of-experts-and-stakeholders':'details/long-term-planning__efficient-use-of-experts-and-stakeholders.html',
  'long-term-planning__data-for-many-validations-in-the-modelling-cycle':'details/long-term-planning__data-for-many-validations-in-the-modelling-cycle.html',
  'long-term-planning__computational-resources':'details/long-term-planning__computational-resources.html',

  // Phase 3 nodes
  'establish-workflow-for-running-models':'details/establish-workflow-for-running-models.html',
  'identifying-trustworthy-models':'details/identifying-trustworthy-models.html',
  'uncertainty-analysis':'details/uncertainty-analysis.html',
  'validation':'details/validation.html',
  'documentation-of-model-code-model-development-model-testing-model-validation-model-usage':'details/documentation-of-model-code-model-development-model-testing-model-validation-model-usage.html',

  // Phase 3 sub-nodes
  'code-verification-unit-testing-for-own-code':'details/code-verification-unit-testing-for-own-code.html',
  'is-model-rich-enough':'details/is-model-rich-enough.html',
  'parameterisation':'details/parameterisation.html',
  'sensitivity-analysis-global-vs-local':'details/sensitivity-analysis-global-vs-local.html',
  'model-inversion':'details/model-inversion.html',

  // Phase 3 sub-items
  'sensitivity-analysis-global-vs-local__global-sa':'details/sensitivity-analysis-global-vs-local__global-sa.html',
  'sensitivity-analysis-global-vs-local__local-sa':'details/sensitivity-analysis-global-vs-local__local-sa.html',
  'model-inversion__optimisation':'details/model-inversion__optimisation.html',
  'model-inversion__mcmc':'details/model-inversion__mcmc.html',
  'model-inversion__abc':'details/model-inversion__abc.html',
  'model-inversion__pom':'details/model-inversion__pom.html',

  // Phase 4
  'best-answer':'details/best-answer.html',
  'uncertainty-decomp':'details/uncertainty-decomp.html',
  'plausibility-check':'details/plausibility-check.html',

  // Phase 5 nodes
  'communication':'details/communication.html',
  'use-exploit-prediction':'details/use-exploit-prediction.html',
  'follow-up-planning':'details/follow-up-planning.html',

  // Phase 5 sub-items
  'communication__communicate':'details/communication__communicate.html',
  'communication__feedback':'details/communication__feedback.html'
};

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
      var style=doc.getElementById('embedded-detail-overrides');
      if(!style){
        style=doc.createElement('style');
        style.id='embedded-detail-overrides';
        style.textContent='body.detail-page.embedded-detail{max-width:none;min-height:0;margin:0;padding:22px 26px 24px;background:transparent;border:0;border-radius:0;box-shadow:none;overflow:visible;box-sizing:border-box}body.detail-page.embedded-detail::before{display:none}body.detail-page.embedded-detail>h1:first-child{margin:0 0 14px;padding:0;border:0}body.detail-page.embedded-detail>p{margin:0 0 10px}';
        doc.head.appendChild(style);
      }
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
    var source=btn.closest('.card,.sub-card,.sub-item');
    if(source){
      var titleEl=source.querySelector('.card-title,.sub-card-title,.si-name');
      if(titleEl){
        title=titleEl.textContent.replace(/\s*Stakeholder\s*$/,'').trim();
      }
    }
  }
  openDetailOverlay(btn.getAttribute('data-detail-page'),title);
});
