# 微信-小程序用户基本信息

## 配置

* 需在项目下的mm.json文件中配置`wx.appid`，`wx.appsecret`。
* wx.appid：小程序唯一凭证，即 AppID。
* wx.appsecret：小程序唯一凭证密钥，即 AppSecret。

```json
{
	"wx": {
		"getopenid": false,			// 必须为false或不配置
		"getuserinfo": false,		// 必须为false或不配置
		"appid": "xxx",
		"appsecret": "xxx"
	}
}
```

参数

参数code通过原子操作[获取用户code](https://npmjs.com/package/@mmstudio/awx000001)获取.

## 公众号用户信息获取

当前原子操作适用于微信小程序的用户信息获取,如果在公众号上获取用户信息,请使用[公众号用户信息获取](https://npmjs.com/package/@mmstudio/an000027)
