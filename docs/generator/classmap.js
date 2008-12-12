YAHOO.env.classMap = {"Queue": "queue", "Supreme": "supreme", "Log": "ap", "Observer": "ap", "ImageLoader.pngBgImgObj": "imageloader", "StringBuffer": "ap", "AP~array": "ap", "SpinnerOnSteroids": "spinner", "AP~Lang": "ap", "AP": "ap", "ImageLoader.image": "imageloader", "String": "ap", "Cookie": "cookie", "AP.JSON": "imageloader", "AP~object": "ap", "ImageLoader.group": "imageloader", "ImageLoader.imgObj": "imageloader", "ImageLoader.backgroundImage": "imageloader", "History": "history"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
