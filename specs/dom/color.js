(function () {
    var rgbColor = new AP.Color('rgb(162, 194, 64)');
    var hexColor = new AP.Color('#a2c240');
    describe('color', {
        'should exist at the AP namespace' : function () {
            value_of(!!AP.Color).should_be_true();
            value_of(typeof AP.Color).should_be('function');
        },
        
        'before all' : function () {
            var rgbColor = new AP.Color('rgb(162, 194, 64)');
            var hexColor = new AP.Color('#a2c240');
        },
        
        'should convert to valid hex string' : function () {
            value_of(rgbColor.hex).should_be('#a2c240');
            value_of(rgbColor.toHex()).should_be('#a2c240');
        },
        
        'should convert to valid rgb string' : function () {
            value_of(hexColor.rgb).should_be('rgb(162, 194, 64)');
            value_of(hexColor.toRgb()).should_be('rgb(162, 194, 64)');
        },
        
        'should accept rgb and hex string as params' : function () {
            rgbColor.set('#cc4cc4');
            value_of(rgbColor.toRgb()).should_be('rgb(204, 76, 196)');
            rgbColor.set('rgb(162, 194, 64)');
            value_of(rgbColor.hex).should_be('#a2c240');
        },
        
        'should accept hex colors without #' : function () {
            var x = new AP.Color('cccccc');
            value_of(x.hex).should_be('#cccccc');
        },
        
        'should accept even 3-letter length hex-color' : function () {
            var x = new AP.Color('#ccc');
            value_of(x.hex).should_be('#cccccc');
        },
        
        'should return hex color as string value' : function () {
            value_of(hexColor.toString()).should_be('#a2c240');
        },
        
        'should return rgb coefficients as result of toArray method' : function () {
            value_of(hexColor.toArray()).should_be([162, 194, 64]);
        }
    });
})();