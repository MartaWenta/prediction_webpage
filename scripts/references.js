// Central bibliography used by the citation and reference tooltip system.
window.BASIS_BIBLIO={
  'barber 2012':'Barber, D. (2012). Bayesian Reasoning and Machine Learning. Cambridge University Press.',
  'bishop 2024':'Bishop, C. M., & Bishop, H. (2024). Deep Learning: Foundations and Concepts. Springer.',
  'hastie 2009':'Hastie, T., Tibshirani, R. J., & Friedman, J. H. (2009). The Elements of Statistical Learning: Data Mining, Inference, and Prediction (2nd ed.). Springer.',
  'hyndman 2021':'Hyndman, R. J., & Athanasopoulos, G. (2021). Forecasting: Principles and Practice (3rd ed.). OTexts. https://otexts.com/fpp3/',
  'west 1997':'West, M., & Harrison, J. (1997). Bayesian Forecasting and Dynamic Models (2nd ed). Springer.',
  'farmer 2024':'Farmer, J. D. (2024). Making Sense of Chaos: A Better Economics for a Better World. Yale University Press.',
  'kaye 2012':'Kaye, N. R., Hartley, A., & Hemming, D. (2012). Mapping the climate: Guidance on appropriate techniques to map climate variables and their uncertainty. Geoscientific Model Development, 5(1), 245-256. https://doi.org/10.5194/gmd-5-245-2012',
  'spiegelhalter 2025':'Spiegelhalter, D. (2025). The Art of Uncertainty: How to Navigate Chance, Ignorance, Risk and Luck. W. W. Norton & Company, New York, NY.',
  'grimm 2010':'Grimm, V., Berger, U., DeAngelis, D. L., Polhill, J. G., Giske, J., & Railsback, S. F. (2010). The ODD protocol: A review and first update. Ecological Modelling, 221(23), 2760-2768. https://doi.org/10.1016/j.ecolmodel.2010.08.019',
  'swannack 2025':'Swannack, T. M., Cushway, K. C., Carrillo, C. C., Calvo, C., Determan, K. R., Mierzejewski, C. M., Quintana, V. M., Riggins, C. L., Sams, M. D., & Wadsworth, W. E. (2025). Cracking the code: Linking good modeling and coding practices for new ecological modelers. Ecological Modelling, 499, 110926. https://doi.org/10.1016/j.ecolmodel.2024.110926',
  'schmolke 2010':'Schmolke, A., Thorbek, P., DeAngelis, D. L., & Grimm, V. (2010). Ecological models supporting environmental decision making: A strategy for the future. Trends in Ecology and Evolution, 25(8), 479-486. https://doi.org/10.1016/j.tree.2010.05.001',
  'getz 2018':'Getz, W. M., Marshall, C. R., Carlson, C. J., Giuggioli, L., Ryan, S. J., Romanach, S. S., Boettiger, C., Chamberlain, S. D., Larsen, L., D\'Odorico, P., & O\'Sullivan, D. (2018). Making ecological models adequate. Ecology Letters, 21(2), 153-166. https://doi.org/10.1111/ele.12893',
  'sun 2015':'Sun, N.-Z., & Sun, A. (2015). Model Calibration and Parameter Estimation: For Environmental and Water Resource Systems. Springer.',
  'benaroya 2005':'Benaroya, H., & Han, S. M. (2005). Probability Models in Engineering and Science. Taylor & Francis.',
  'committee 2012':'Committee on Mathematical Foundations of Verification, Validation, and Uncertainty Quantification, & Board on Mathematical Sciences and Their Applications, Division on Engineering and Physical Sciences, National Research Council. (2012). Assessing the Reliability of Complex Models: Mathematical and Statistical Foundations of Verification, Validation and Uncertainty Quantification. The National Academic Press. https://doi.org/10.17226/13395',
  'dormann 2018':'Dormann, C. F., Calabrese, J. M., Guillera-Arroita, G., Matechou, E., Bahn, V., Barton, K., ... & Hartig, F. (2018). Model averaging in ecology: A review of Bayesian, information-theoretic, and tactical approaches for predictive inference. Ecological Monographs, 88(4), 485-504. https://doi.org/10.1002/ecm.1309',
  'roberts 2017':'Roberts, D. R., Bahn, V., Ciuti, S., Boyce, M. S., Elith, J., Guillera-Arroita, G., ... & Dormann, C. F. (2017). Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure. Ecography, 40(8), 913-929. https://doi.org/10.1111/ecog.02881',
  'dormann 2026':'Dormann, C. F., Kaber, Y., & Hartig, F. (2026). Full prediction uncertainty quantification: A plea from science and decision making. In Advances in Ecological Research (Vol. 74, pp. 191-212). Elsevier. https://doi.org/10.1016/bs.aecr.2026.02.003',
  'matheson 1976':'Matheson, J. E., & Winkler, R. L. (1976). Scoring rules for continuous probability distributions. Management Science, 22(10), 1087-1096. https://doi.org/10.1287/mnsc.22.10.1087',
  'taylor 1997':'Taylor, J. R. (1997). An Introduction to Error Analysis: The Study of Uncertainties in Physical Measurements (2nd ed.). University Science Books.',
  'wesselkamp 2025':'Wesselkamp, M., Albrecht, J., Pinnington, E., Castillo, W. J., Pappenberger, F., & Dormann, C. F. (2025). The ecological forecast limit revisited: Potential, absolute and relative system predictability. Methods in Ecology and Evolution, 16(7), 1521-1541. https://doi.org/10.1111/2041-210X.70049',
  'wolter 2007':'Wolter, K. M. (2007). Introduction to Variance Estimation (2nd ed.). Springer.',
  'marjoram 2003':'Marjoram, P., Molitor, J., Plagnol, V., & Tavare, S. (2003). Markov chain Monte Carlo without likelihoods. Proceedings of the National Academy of Sciences, 100(26), 15324-15328. https://doi.org/10.1073/pnas.0306899100',
  'luo 2009':'Luo et al. (2009). [please add full bibliographic details].',
  'oberpriller 2021':'Oberpriller et al. (2021). [please add full bibliographic details].'
};

window.MODEL_INVERSION_BIBLIO=window.BASIS_BIBLIO;

// Enable tap-friendly tooltip behaviour for glossary and footnote references.
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
