AP.add('color', function (A) {
    
    var rgbRegEx = /rgba?\([\d\s,]+\)/;
    
    
    A.Color = function (color) {
        this.color = this.set(color) || '';
    };
    
    A.Color.prototype = {
        set : function (color) {
            console.log(color);
            if (/rgb/.test(color)) {
                this.color = AP.ColorUtils.rgbToHex(color);
            } else {
                // assume this is hex color
                this.color = A.ColorUtils.convertShortHexToFull(color);
            }
            
            this.hex = this.color;
            
            this.rgb = A.ColorUtils.hexToRgb(this.color);
        },
        
        toRgb : function () { return this.rgb; },
        
        toHex : function () { return this.hex; },
        
        toString : function () { return this.hex; },
        
        toArray : function () {
            return AP.ColorUtils.hexToRgb(this.hex, 1);
        }
    };
    
    A.ColorUtils = A.ColorUtils || {
        rgbToHex : function (color, array) {
    		var rgb = color.match(/\d{1,3}/g);
    		
    		if (rgb.length < 3) return null;
    		if (rgb.length == 4 && rgb[3] == 0 && !array) return 'transparent';
    		var hex = [];
    		for (var i = 0; i < 3; i++){
    			var bit = (rgb[i] - 0).toString(16);
    			hex.push((bit.length == 1) ? '0' + bit : bit);
    		}
    		return (array) ? hex : '#' + hex.join('');
        },
        
        convertShortHexToFull : function (color) {
            if (color.length == 3) color = '#' + color + color;
            if (color.length == 4) color = color + color.substr(1, 3);
            if (color.length == 6) color = '#' + color;
            return color;
        },
        
        hexToRgb : function (color, array) {
            this.convertShortHexToFull(color);
            color = color.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/).slice(1);
            
            if (color.length != 3) return null;
    		
    		var i = 0;
    		
    		for (; i < 3; i++) {
    		    color[i] = parseInt(color[i], 16);
    		}
    		
    		return (array) ? color : 'rgb(' + color.join(', ') + ')';
        }
    };
}, '0.0.1', []);