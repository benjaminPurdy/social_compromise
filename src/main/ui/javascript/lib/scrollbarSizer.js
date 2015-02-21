
function checkScrollBarSize() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
        isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
        isChromeOrSafari = (isChrome || isSafari),
        w1,
        w2,
        div,
        webkitDiv;

    div = $('<div id="scrollBarDiv" style="width:50px;height:50px;overflow:hidden;position:absolute;top:0px;left:0px;"><div style="background-color: blue; height:100px;"></div></div>');
    webkitDiv = div[0];

    // Append our div, do our calculation and then remove it
    $('body').append(div);

    if (isChromeOrSafari) {
        w1 = webkitDiv.clientWidth;
    } else {
        w1 = $('div', div).innerWidth();
    }

    div.css('overflow-y', 'scroll');

    if (isChromeOrSafari) {
        w2 = webkitDiv.clientWidth;
    } else {
        w2 = $('div', div).innerWidth();
    }

    $(div).remove();
    return checkScrollBarSize.scrollbarSize = (w1 - w2);
}

module.exports = checkScrollBarSize;