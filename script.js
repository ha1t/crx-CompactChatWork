// http://blog.fenrir-inc.com/jp/2012/09/jquery-chrome-extension.html
// AC.getAvatarId(id) -> 画像ファイル名を返す
// CS
// CW.getRoomName(rid)
// RD
// RL.getDefaultRomm() -> マイチャット
// RL.getFocusedRoomId() -> アクティブなroomのidを返す
// RM -> 現在のroom
// RM.member_dat -> ルームメンバーの id: role
// cw_chattext

/*
(function($) {
	$.fn.listFilter = function(inputSelector){
		this.find('li').each(function(index, elm){
			$(elm).attr('data-list-filter', $(elm).text().toLowerCase());
			console.log();
		});

		var $targetLi = this.find('li');
		var $input = $(inputSelector);
		$input.keyup(function() {
			var text = $input.val().toLowerCase();

			if (text === '') {
				$targetLi.show();
				return;
			}

			$targetLi.hide();
			$targetLi.filter('[data-list-filter*="' + text + '"]').show();
			console.log($input.val());
		});
	};

	return this;
})(jQuery);
*/

// http://okisaragi.blog136.fc2.com/blog-entry-30.html
// http://stackoverflow.com/questions/8293465/chrome-extension-injecting-code-which-references-a-script-that-i-am-also-inject
// http://jqueryui.com/demos/autocomplete/#custom-data
// jQuery UI Autocompleteで、@の時に補完する

/*
var tID1 = setInterval("main_wait()",3000);　
function main_wait() {
	if (CW.init_loaded) {
		alert('<div id="aaa">の中に何か表示されました');
		clearInterval(tID1);
		return;
	}
}
*/

(function ($) {
	$.fn.getMemberList = function () {
		// id とユーザ名の連想配列を作る
		var ids = [];
		for (var id in RM.member_dat) {
			ids.push({name: AC.getName(id), id: id});
		}
		console.log(ids);
	}
})(jQuery);

/*
$('#cw_chattext').keyup(function () {
	var text = this.val().
	if (
*/

function injectScript(source)
{
     
    // Utilities
    var isFunction = function (arg) { 
        return (Object.prototype.toString.call(arg) == "[object Function]"); 
    };
     
    var jsEscape = function (str) { 
        // Replaces quotes with numerical escape sequences to
        // avoid single-quote-double-quote-hell, also helps by escaping HTML special chars.
        if (!str || !str.length) return str;
        // use \W in the square brackets if you have trouble with any values.
        var r = /['"<>\/]/g, result = "", l = 0, c; 
        do{    c = r.exec(str);
            result += (c ? (str.substring(l, r.lastIndex-1) + "\\x" + 
                c[0].charCodeAt(0).toString(16)) : (str.substring(l)));
        } while (c && ((l = r.lastIndex) > 0))
        return (result.length ? result : str);
    };
 
    var bFunction = isFunction(source);
    var elem = document.createElement("script");    // create the new script element.
    var script, ret, id = "";
 
    if (bFunction)
    {
        // We're dealing with a function, prepare the arguments.
        var args = [];
 
        for (var i = 1; i < arguments.length; i++)
        {
            var raw = arguments[i];
            var arg;
 
            if (isFunction(raw))    // argument is a function.
                arg = "eval(\"" + jsEscape("(" + raw.toString() + ")") + "\")";
            else if (Object.prototype.toString.call(raw) == '[object Date]') // Date
                arg = "(new Date(" + raw.getTime().toString() + "))";
            else if (Object.prototype.toString.call(raw) == '[object RegExp]') // RegExp
                arg = "(new RegExp(" + raw.toString() + "))";
            else if (typeof raw === 'string' || typeof raw === 'object') // String or another object
                arg = "JSON.parse(\"" + jsEscape(JSON.stringify(raw)) + "\")";
            else
                arg = raw.toString(); // Anything else number/boolean
 
            args.push(arg);    // push the new argument on the list
        }
 
        // generate a random id string for the script block
        while (id.length < 16) id += String.fromCharCode(((!id.length || Math.random() > 0.5) ?
            0x61 + Math.floor(Math.random() * 0x19) : 0x30 + Math.floor(Math.random() * 0x9 )));
 
        // build the final script string, wrapping the original in a boot-strapper/proxy:
        script = "(function(){var value={callResult: null, throwValue: false};try{value.callResult=(("+
            source.toString()+")("+args.join()+"));}catch(e){value.throwValue=true;value.callResult=e;};"+
            "document.getElementById('"+id+"').innerText=JSON.stringify(value);})();";
 
        elem.id = id;
    }
    else // plain string, just copy it over.
    {
        script = source;
    }
 
    elem.type = "text/javascript";
    elem.innerHTML = script;
 
    // insert the element into the DOM (it starts to execute instantly)
    document.head.appendChild(elem);
 
    if (bFunction)
    {
        // get the return value from our function:
        ret = JSON.parse(elem.innerText);
 
        // remove the now-useless clutter.
        elem.parentNode.removeChild(elem);
 
        // make sure the garbage collector picks it instantly. (and hope it does)
        delete (elem);
 
        // see if our returned value was thrown or not
        if (ret.throwValue)
            throw (ret.callResult);
        else
            return (ret.callResult);
    }
    else // plain text insertion, return the new script element.
        return (elem);
}

//injectScript(source);

