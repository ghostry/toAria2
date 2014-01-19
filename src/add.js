chrome.downloads.onDeterminingFilename.addListener(add);
var size = localStorage["size"] * 1024 * 1024;
var path = localStorage["path"];
function add(down) {
    if (!path || !size) {
	alert("插件尚未配置");
	chrome.tabs.create({"url": "options.html"}, function(s) {
	});
	return 0;
    }
    if (Math.abs(down.fileSize) > size) {
	this.aria2_obj = combination(down.url, down.filename);
	var ifpostback = postaria2obj(this.aria2_obj);
	if (ifpostback == "base64_error") {
	    //alert('提交到aria2出错');
	    /*document.body.innerHTML += '<div id="aria2-false" style="position: fixed;top:5px;right:5px;background: #e55858;border: 1px solid  #d55252;border-radius: 7px;padding: 10px 15px;color:#fff;font-size: 16px;box-shadow: 0 2px 7px 0 rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.2);">&#10005; 添加任务至 aria2 失败！</div>';
	    var aria2_false = document.getElementById("aria2-false");
	    setTimeout(function() {
		document.body.removeChild(aria2_false);
	    }, 5000);*/
	    var notification = webkitNotifications.createNotification('', '失败！', // 通知标题
		    '添加任务至 aria2 出错！'  // 通知正文文本
		    );
	} else {
	    chrome.downloads.cancel(down.id, function(s) {
	    });
	    //alert('下载已送往aria2，请前往确认');
	    /*
	     chrome.tabs.executeScript({
	     code: ' console.log(document.body);document.body.innerHTML = \'<div id="aria2-true" style="position: fixed;top:5px;right:5px;background: #acd953;border: 1px solid  #add552;border-radius: 7px;padding: 10px 15px;color:#fff;font-size: 16px;box-shadow: 0 2px 7px 0 rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.2);">&#10003; 成功添加下载任务至 aria2！</div>\';\
	     var aria2_true = document.getElementById("aria2-true");\
	     setTimeout(function() {\
	     document.body.removeChild(aria2_true);\
	     }, 5000);'
	     });
	     */
	    var notification = webkitNotifications.createNotification('', '成功！', // 通知标题
		    '下载已送往aria2，请前往确认'  // 通知正文文本
		    );

// 然后显示通知。
	    notification.show();
	}
    }
    //alert(down.fileSize);
}
function postaria2obj(addobj) {
    var httppost = new XMLHttpRequest();
    this.aria2jsonrpcpath = path;
    httppost.open("POST", this.aria2jsonrpcpath + "?tm=" + (new Date()).getTime().toString(), true);
    var ifregurl = aria2url_reg(this.aria2jsonrpcpath);
    if (ifregurl) {
	if (!window.btoa) {
	    return "base64_error";
	} else {
	    httppost.setRequestHeader("Authorization", "Basic " + btoa(ifregurl));
	}
    }
    httppost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    httppost.send(JSON.stringify(addobj));
    return "ok";

}
function aria2url_reg(url) {
    if (url.split("@")[0] == url) {
	return null;
    }
    return url.split("@")[0].match("/^(http:\\/\\/\|https:\\/\\/)?(.*)\/")[2];
}
function combination(url, name) {
    var post_obj = [{
	    "jsonrpc": "2.0",
	    "method": "aria2.addUri",
	    "id": (new Date()).getTime().toString(),
	    "params": [[url], {
		    "out": decodeURI(name)
		}]
	}];
    return post_obj;
}
