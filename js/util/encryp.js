;define(['md5','base64'],function (md5, base64) {
// var str = '{"systemSource":1,"type":1,"userId":1}14797060227784d31731564c0464f533d1dbb2c36dc59';
// var re = md5.hex_md5(str);
// console.log(re);
// var str2 = '{"systemSource":1,"type":1,"userId":1,"token":"03af10789e477e300fb516b3f7ba417c"}';
// var re2 = base64.encode(str2)

// console.log(re2);

// var obj = {systemSource:1,type:1,userId:1};
var appId = '1479706022778';
var appSecret = '4d31731564c0464f533d1dbb2c36dc59';

// generateEncryp(obj)

	function generateEncryp(obj){
		// obj = {userId: "1", pageIndex: "1", pageSize: "150"};
		console.log("已进入加密区域：原生参数：")
		// for(prop in obj){
		// 	obj[prop] = obj[prop].toString();
		// }
		var str = JSON.stringify(obj) + appId + appSecret;
		console.log(str)	
		var token = md5.hex_md5(str);
		// var obj2 = {};
		 obj.token = token;
		 // console.log(token)
		console.log(JSON.stringify(obj))	

		var final = base64.encode(JSON.stringify(obj));
		console.log(final)
		return final;
	}

	return generateEncryp;
});