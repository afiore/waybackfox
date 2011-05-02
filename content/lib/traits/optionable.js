(function(){

/**
 * Trivial trait adding initialisation options to an instance
 *
 */

  var OptionableTrait = Trait({
    options: Trait.required
  });

  this.Optionable = OptionableTrait;

}).call(WaybackFox.Traits);
