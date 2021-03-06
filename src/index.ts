import an22 from '@mmstudio/an000022';
import config from '@mmstudio/config';
import fetch from 'node-fetch';

const { wx: { appid, appsecret } } = config;

interface UserInfo {
	subscribe: number;			// 用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
	openid: string;				// 用户的标识，对当前公众号唯一
	nickname: string;			// 用户的昵称
	sex: 1 | 2 | 0;				// 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
	language: string;			// 用户的语言，简体中文为zh_CN
	city: string;				// 用户所在城市
	province: string;			// 用户所在省份
	country: string;			// 用户所在国家
	headimgurl: string;			// 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
	subscribe_time: number;		// 用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
	unionid: string;			// 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
	remark: string;				// 公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
	groupid: number;			// 用户所在的分组ID（兼容旧的用户分组接口）
	tagid_list: number[];		// 用户被打上的标签ID列表
	subscribe_scene: string;	// 返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENE_PROFILE_ LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_OTHERS 其他
	qr_scene: number;			// 二维码扫码场景（开发者自定义）
	qr_scene_str: string;		// 二维码扫码场景描述（开发者自定义）
}

interface Session {
	openid: string;			// 用户唯一标识
	session_key: string;	// 会话密钥
	unionid: string;		// 用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回，详见 UnionID 机制说明。
	errcode: number;		// 错误码
	errmsg: string;		// 错误信息
}

async function code2openid(code: string) {
	const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
	const result = await fetch(url, {
		method: 'GET'
	});
	if (result.status >= 200 && result.status < 400) {
		const data = await result.json() as Session & { errcode: number; errmsg: string };
		if (data.errcode) {
			throw new Error(data.errmsg);
		} else {
			return data.openid;
		}
	} else {
		throw new Error(result.statusText);
	}
}

export default async function get_user_info(code: string) {
	const access_token = await an22();
	const openid = await code2openid(code);
	const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
	const result = await fetch(url, {
		method: 'GET'
	});
	if (result.status >= 200 && result.status < 400) {
		const data = await result.json() as UserInfo & { errcode: number; errmsg: string };
		if (data.errcode) {
			throw new Error(data.errmsg);
		} else {
			return data as UserInfo;
		}
	} else {
		throw new Error(result.statusText);
	}
}
