YAHOO.env.classMap = {"Lang": "json", "Supreme": "supreme", "Observer": "ap", "AP~specification": "ap", "ImageLoader.pngBgImgObj": "imageloader", "ImageLoader.backgroundImage": "imageloader", "AP~array": "cookie", "SpinnerOnSteroids": "spinner", "Queue": "queue", "AP": "ap", "ImageLoader.image": "imageloader", "String": "ap", "ImageLoader.group": "imageloader", "AP~OOP": "ap", "AP.JSON": "imageloader", "AP~object": "json", "ImageLoader.imgObj": "imageloader", "History": "history", "AP~Cookie": "cookie", "StringBuffer": "ap", "Browser": "cookie"};

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
