document.addEventListener('DOMContentLoaded',function(){
  if(window.CitationTools){
    window.CitationTools.hydrate({
      biblioGlobal:'MODEL_INVERSION_BIBLIO',
      citationSelector:'.cite-ref[data-cite]',
      footnoteSupSelector:'.footnote-ref',
      footnoteLabelSelector:'.footnote-label',
      missingPrefix:'Reference details not found for '
    });
  }

  if(typeof enableTapTooltips==='function') enableTapTooltips();
});
