var $K=function(el) {
    var D = {
        gN: function(el) {
            return document.getElementsByName(el);
        },
        gI: function(el) {
            return document.getElementById(el);
        }
    };
    if (D.gN(el) !== 'undefined' && D.gN(el).length > 0) {
        return D.gN(el);
    }
    if (D.gI(el) !== 'undefined') {
        return D.gI(el);
    }
    return 'undefined';
};
