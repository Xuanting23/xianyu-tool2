export interface BannedWord {
  word: string
  level: 'high' | 'medium' | 'copyright'
  suggestion?: string
}

// ── 自定义违禁词（绝对化/虚假宣传/医疗/仿品）──
const CUSTOM_BANNED: BannedWord[] = [
  { word: '最好', level: 'high', suggestion: '超好用 / 非常好' },
  { word: '最佳', level: 'high', suggestion: '优质 / 精选' },
  { word: '最低价', level: 'high', suggestion: '超低价 / 特惠价' },
  { word: '最便宜', level: 'high', suggestion: '超实惠 / 价格很低' },
  { word: '最优惠', level: 'high', suggestion: '超优惠 / 特价' },
  { word: '最高端', level: 'high', suggestion: '高端 / 品质优良' },
  { word: '最新款', level: 'high', suggestion: '新款 / 新品' },
  { word: '第一', level: 'high', suggestion: '领先 / 优质' },
  { word: '唯一', level: 'high', suggestion: '独特 / 专属' },
  { word: '极致', level: 'high', suggestion: '出色 / 优秀' },
  { word: '顶级', level: 'high', suggestion: '高品质 / 优质' },
  { word: '国家级', level: 'high', suggestion: '专业级 / 高品质' },
  { word: '世界级', level: 'high', suggestion: '国际品质' },
  { word: '全网最低', level: 'high', suggestion: '超低价' },
  { word: '史上最低', level: 'high', suggestion: '超低价 / 特惠' },
  { word: '假一赔十', level: 'high', suggestion: '正品保证' },
  { word: '假一赔百', level: 'high', suggestion: '正品保证' },
  { word: '100%正品', level: 'high', suggestion: '正品 / 品质保证' },
  { word: '绝对正品', level: 'high', suggestion: '正品' },
  { word: '纯正品', level: 'high', suggestion: '正品' },
  { word: '官方正品', level: 'high', suggestion: '正品' },
  { word: '保真', level: 'high', suggestion: '正品' },
  { word: '治疗', level: 'high', suggestion: '改善 / 缓解' },
  { word: '治愈', level: 'high', suggestion: '改善' },
  { word: '根治', level: 'high', suggestion: '有效改善' },
  { word: '特效', level: 'high', suggestion: '效果好' },
  { word: '速效', level: 'high', suggestion: '快速见效' },
  { word: '神效', level: 'high', suggestion: '效果显著' },
  { word: '药效', level: 'high', suggestion: '效果' },
  { word: '医疗级', level: 'high', suggestion: '专业级' },
  { word: '临床', level: 'high', suggestion: '经过验证' },
  { word: '处方', level: 'high' },
  { word: '消炎', level: 'high', suggestion: '舒缓' },
  { word: '杀菌', level: 'high', suggestion: '清洁 / 抑菌' },
  { word: '抗癌', level: 'high', suggestion: '健康养生' },
  { word: '减肥', level: 'high', suggestion: '塑形 / 管理体重' },
  { word: '瘦身', level: 'high', suggestion: '塑形' },
  { word: '燃脂', level: 'high', suggestion: '运动辅助' },
  { word: '仿品', level: 'high' },
  { word: '高仿', level: 'high' },
  { word: '1:1', level: 'high' },
  { word: '复刻版', level: 'high' },
  { word: '精仿', level: 'high' },
  { word: '超A', level: 'high' },
  { word: '莆田', level: 'high' },
  { word: '超级', level: 'medium', suggestion: '非常 / 很' },
  { word: '神器', level: 'medium', suggestion: '好用的 / 实用' },
  { word: '爆款', level: 'medium', suggestion: '热销 / 畅销' },
  { word: '秒杀', level: 'medium', suggestion: '特价 / 限时优惠' },
  { word: '清仓', level: 'medium', suggestion: '特价处理' },
  { word: '亏本', level: 'medium', suggestion: '特惠' },
  { word: '跳楼价', level: 'medium', suggestion: '超低价' },
  { word: '骨折价', level: 'medium', suggestion: '超低价' },
  { word: '白菜价', level: 'medium', suggestion: '超低价' },
  { word: '无效退款', level: 'medium', suggestion: '支持退换' },
  { word: '无理由退款', level: 'medium', suggestion: '支持退换' },
  { word: '永久', level: 'medium', suggestion: '长期 / 持久' },
  { word: '终身', level: 'medium', suggestion: '长期' },
  { word: '无限', level: 'medium', suggestion: '大量 / 充足' },
  { word: '免费', level: 'medium', suggestion: '赠送 / 附赠' },
  { word: '送礼', level: 'medium', suggestion: '附赠 / 搭配' },
  { word: '暴利', level: 'medium' },
  { word: '内部价', level: 'medium', suggestion: '优惠价' },
  { word: '出厂价', level: 'medium', suggestion: '优惠价' },
  { word: '批发价', level: 'medium', suggestion: '优惠价' },
]

// ── 闲鱼平台商品违禁词（来源：商品违禁词.txt）──
const PLATFORM_BANNED_RAW = '天涯神贴,闲鱼兼职,恋爱交友攻略,个人写真,病历,代考,法治思想,网红私照,写真图集,撩妹话术,情感咨询,打牌技巧,网赚教程,代查,开锁,代写,拼多多砍价,算命服务,易经风水教程,代下,代找,百度网盘不限速,租号,耽美,电视剧直播技术,变现,僵尸末日,防疫,手机号码标记取消,测试男友,拼夕夕助力,懒人快速赚钱项目,怎样在股市获得稳健收益,A股脱水研报,金融分析训练营,约会加速器,聊天A咖,聊天恋爱教程,聊天a咖,JK制服校园写真,游戏攻略,股票理财,影视会员,抖音运营,道歉代发,表白代发,复合代发,男女社交处事,魅男,撩术,禁漫天堂,千门108局,AI视频换脸,洗脑神书,PUA原理,手抄报电子模版,创业融资企划书,变声器,抖音纯佣达人,撩妹套路话术,恋爱撩天术,短视频抖音快手小红书,p站小说合集,实用AI视频工具,小说文包海棠文,PUA,爬虫,按键精灵,代做,体检,投票,基金,姐妹照,地方债,泡妞秘籍,禁书,金融,黄皮书,股市,融资,麻将,理财,期货,探探,陌陌,二十届三中全会,券商,奖状荣誉证书,经营环境指数,营商环境指数,风水,私域,负z,油管,尸变,gpt,chat,女性撒娇话术,狐狸精,名家仿写,名媛,刀枪不入,chatgpt,家庭医生,A股,脱水研报,华尔街见闻,体检报告,医疗健康表,现金流预测,盈亏平衡点,保险,平安,人寿,工伤,人保,跨境电商,货源号,车展模特,数字经济,gis,dem,水文,获奖证书,高端光影艺术,青年志愿者,社会调研实践报告,碳排放,体检表,泡妞,星座,艺术摄影,电销,炒股,尤物,引流,男粉,JK制服,红头文件,舞蹈形体,风控,工会,荣誉学生聘证书,报关,清关,出口流程,外贸进出口,贸易商检,商业授权书,财务自由,财务管理,爆粉,私房育儿,妇科,转发好运,审计报告,商业计划书,述职报告,文献汇报,学术会议,人体结构,打粉,防伪证书,质检合格证,赚钱,武术,养生,武功,丹田,太极,尸体,碎尸,解剖,俄罗斯教材,锁维修,个税,AIGC,航天器,航天,政治密押,武林秘籍,香港杂志,千川投放,图书馆联盟,城市空气质量,绕线,汇圈,k12教育,测绘,美容院,投屏,银行,K12,轻食,外贸,直播,微信,二维码,手机号,兼职,帖子,互想要,互赞,互关,互粉,主页,唯品会,拼多多,网易考拉,国美,京东,58同城,转转,苏宁易购,云资源,破解,链接,VIP,迅雷,百度云,网络游戏账号,q币,闲鱼币,淘金币,游戏币,兑换码,充值码,优惠券,仿真枪,危险武器,毒品,催情用品,药品,医疗器械,婴幼儿食品,奶粉,保健食品,迷信,低俗,隐形眼镜,胎心仪,血糖仪,体温计,助听器,避孕套,减肥药,急救箱,论文代写,VPN,翻墙,SS账号,SSR,菠菜,荷官,算命,上门服务,人肉'

// ── 版权/盗版词（来源：平台盗版违规词.txt + 商品版权词.txt）──
const COPYRIGHT_RAW = 'Navicat16软件,永久激活2025,Adobe全家桶中文破解版,达芬奇破解版永久激活,剪映永久会员破解版,亿图图示终身VIP,吾爱破解工具箱,福晰高级PDF编辑器,手机端隐约软件永久会员全解锁,各音乐软件内置会员,酷我音乐安卓手机电脑去广告版,鬼谷八荒安卓直装,软件资源分享,破解版,永久激活,会员破解,去广告版,内置会员,斑马英语,斑马思维,斑马阅读,斑马白科,剑来有声小说,冯唐经典合集,SSS儿歌489集,中医十四五教材全套,BL动漫,韩漫,肖秀荣考研政治,25注会,CPA注会,注册会计,电子书PDF,PDF电子书,电子版pdf,名侦探柯南,天官赐福,镇魂街,百妖谱,元龙,天宝伏妖录,妖神记,风灵玉秀,山海绝伦,虚无边境,长夜开拓者,永生之无尽仙途,斗神姬,异人君莫邪,恰同学少年,君有云,两不疑,谎颜,秘宝之国,凸变英雄,猫之茗,李林克的小馆儿,仙王的日常生活,异常生物见闻录,上海故事,火凤燎原,神之一脚,小魔头暴露啦,一世之尊,披着狼皮的羊,女神有点灵,爱上她的理由,燃夏,怪兽小馆,山海际会,希灵纪元,长歌行,哔哩哔哩原石计划,胶囊计划,探照灯计划,维权骑士,刀豆网络,昭昭医考,昭昭老师,昭昭考研'

export const BANNED_WORDS: BannedWord[] = [
  ...CUSTOM_BANNED,
  ...PLATFORM_BANNED_RAW.split(',').map((w) => ({ word: w.trim(), level: 'high' as const })),
  ...COPYRIGHT_RAW.split(',').map((w) => ({ word: w.trim(), level: 'copyright' as const })),
]

export interface DetectionResult {
  word: string
  level: 'high' | 'medium' | 'copyright'
  suggestion?: string
  indices: Array<{ start: number; end: number }>
}

export function detectBannedWords(text: string): DetectionResult[] {
  const results: DetectionResult[] = []
  const lowerText = text.toLowerCase()

  for (const item of BANNED_WORDS) {
    const lowerWord = item.word.toLowerCase()
    if (!lowerWord) continue
    const indices: Array<{ start: number; end: number }> = []
    let pos = 0
    while (pos < lowerText.length) {
      const idx = lowerText.indexOf(lowerWord, pos)
      if (idx === -1) break
      indices.push({ start: idx, end: idx + item.word.length })
      pos = idx + 1
    }
    if (indices.length > 0) {
      results.push({ word: item.word, level: item.level, suggestion: item.suggestion, indices })
    }
  }

  results.sort((a, b) => {
    const order = { high: 0, medium: 1, copyright: 2 }
    if (a.level !== b.level) return order[a.level] - order[b.level]
    return a.indices[0].start - b.indices[0].start
  })

  return results
}
