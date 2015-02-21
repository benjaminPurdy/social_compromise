module.exports = function(max_main_length) {
  return function(string) {
    if (!string){return '';}
    var letters = string.match(/\b(\w)/g),
        bigLetters = letters.splice(0, max_main_length);

    return {
      mainAcronym: bigLetters.join(''),
      subAcronym: letters.join('')
    }
  }
}