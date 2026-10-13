/**
 * 桃園市立楊梅高級中等學校 - 語音電話分機資料庫
 * Taoyuan Municipal Yangmei Senior High School Extension Directory Database
 */

const SCHOOL_INFO = {
  name: "桃園市立楊梅高級中等學校",
  shortName: "楊梅高中",
  englishName: "Taoyuan Municipal Yangmei Senior High School (YMHS)",
  mainPhone: "(03) 478-9618",
  altPhone1: "(03) 478-0449",
  altPhone2: "(03) 478-0740",
  address: "326002 桃園市楊梅區高獅路5號",
  faxNumbers: {
    教務處: "(03) 488-2675",
    學務處: "(03) 478-2322 / (03) 475-7034",
    總務處: "(03) 478-0164",
    輔導室: "(03) 475-8437",
    圖書館: "(03) 478-0586"
  },
  website: "https://www.ymhs.tyc.edu.tw",
  updateDate: "113學年度最新修訂版"
};

// 處室分類定義（附色彩主題與圖示）
const CATEGORIES = [
  { id: "all", name: "全部處室", icon: "grid", color: "#3B82F6", lightBg: "#EFF6FF" },
  { id: "principal", name: "校長室及幕僚", icon: "award", color: "#8B5CF6", lightBg: "#F5F3FF" },
  { id: "academic", name: "教務處", icon: "book-open", color: "#0284C7", lightBg: "#F0F9FF" },
  { id: "student", name: "學務處 / 教官室", icon: "users", color: "#10B981", lightBg: "#ECFDF5" },
  { id: "general", name: "總務處", icon: "tool", color: "#F59E0B", lightBg: "#FFFBEB" },
  { id: "counseling", name: "輔導室", icon: "heart", color: "#EC4899", lightBg: "#FDF2F8" },
  { id: "library", name: "圖書館", icon: "compass", color: "#6366F1", lightBg: "#EEF2FF" },
  { id: "vocational", name: "實習處 / 專科", icon: "cpu", color: "#06B6D4", lightBg: "#ECFEFF" },
  { id: "faculty", name: "教師辦公室 / 導師室", icon: "briefcase", color: "#14B8A6", lightBg: "#F0FDFA" },
  { id: "facilities", name: "專科教室及設施", icon: "map-pin", color: "#F97316", lightBg: "#FFF7ED" }
];

// 校園館舍定義
const BUILDINGS = [
  { id: "admin", name: "行政大樓", desc: "校長室、人事室、會計室、教務處、學務處、總務處", floors: "1F~4F" },
  { id: "yunhui", name: "蘊慧樓", desc: "專任第一、第二辦公室、家政烹飪教室", floors: "1F~3F" },
  { id: "rixin", name: "日新樓", desc: "專任第三辦公室、特教資源教室、實習專科", floors: "1F~4F" },
  { id: "huaide", name: "懷德樓", desc: "高一導師室、學生活動中心、音樂美術教室", floors: "1F~3F" },
  { id: "hongdao", name: "弘道樓", desc: "高二、高三導師室、普通教室", floors: "1F~4F" },
  { id: "library_bld", name: "圖資大樓", desc: "圖書館主任、閱覽室、資訊媒體組、電腦教室", floors: "1F~3F" },
  { id: "gym", name: "體育館", desc: "體育組、器材室、室內球場", floors: "1F~2F" },
  { id: "gate", name: "大門及其他", desc: "校門警衛室、車道出入口", floors: "1F" }
];

// 完整分機清單資料庫
const EXTENSION_DATA = [
  // --- 校長室及行政幕僚 ---
  {
    ext: "1101",
    dept: "校長室",
    category: "principal",
    title: "校長",
    name: "鄒校長",
    location: "行政大樓 2F",
    building: "admin",
    duties: "綜理全校校務發展與行政決策",
    isKey: true,
    tags: ["校長", "決策", "校務"]
  },
  {
    ext: "1102",
    dept: "校長室",
    category: "principal",
    title: "秘書",
    name: "秘書室",
    location: "行政大樓 2F",
    building: "admin",
    duties: "校務規劃、文稿審核、新聞聯繫、跨處室協調、校友事務",
    isKey: true,
    tags: ["秘書", "新聞", "發言", "公共關係"]
  },
  {
    ext: "1103",
    dept: "校長室",
    category: "principal",
    title: "技工 / 校長室協調",
    name: "行政服務",
    location: "行政大樓 2F",
    building: "admin",
    duties: "校長室公文收發、行政事務支援",
    isKey: false,
    tags: ["行政支援"]
  },
  {
    ext: "1110",
    dept: "警衛室",
    category: "principal",
    title: "駐衛警 / 保全",
    name: "值班人員",
    location: "校門口大門",
    building: "gate",
    duties: "校園大門門禁管制、來訪貴賓登記、信件包裹收發、校園安全守護",
    isKey: true,
    isEmergency: true,
    tags: ["警衛", "大門", "包裹", "會客", "緊急"]
  },
  {
    ext: "1121",
    dept: "人事室",
    category: "principal",
    title: "主任",
    name: "人事主任",
    location: "行政大樓 2F",
    building: "admin",
    duties: "綜理人事規章、教職員任免、考核獎懲、組織編制",
    isKey: true,
    tags: ["人事", "考核", "聘任"]
  },
  {
    ext: "1122",
    dept: "人事室",
    category: "principal",
    title: "組員",
    name: "人事室夥伴",
    location: "行政大樓 2F",
    building: "admin",
    duties: "差勤請假審核、公保勞保、福利互助、退休撫卹業務",
    isKey: false,
    tags: ["請假", "差勤", "保險", "福利"]
  },
  {
    ext: "1131",
    dept: "會計室",
    category: "principal",
    title: "主任",
    name: "會計主任",
    location: "行政大樓 2F",
    building: "admin",
    duties: "綜理年度預算編審、經費分配、會計決算與財務監督",
    isKey: true,
    tags: ["會計", "預算", "經費"]
  },
  {
    ext: "1132",
    dept: "會計室",
    category: "principal",
    title: "佐理員 / 組員",
    name: "會計同仁",
    location: "行政大樓 2F",
    building: "admin",
    duties: "原始憑證審核、記帳登錄、專案經費核銷",
    isKey: false,
    tags: ["核銷", "發票", "憑證", "報帳"]
  },

  // --- 教務處 ---
  {
    ext: "1201",
    dept: "教務處",
    category: "academic",
    title: "教務主任",
    name: "教務處主任",
    location: "行政大樓 1F",
    building: "admin",
    duties: "綜理全校教務行政、課程發展、教師專業發展、教學革新",
    isKey: true,
    fax: "(03) 488-2675",
    tags: ["教務", "課程", "教學改革"]
  },
  {
    ext: "1211",
    dept: "教務處 - 教學組",
    category: "academic",
    title: "教學組長",
    name: "教學組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "全校日課表編排、調代課管理、教學進度查核、巡堂及作業抽查",
    isKey: true,
    tags: ["課表", "調課", "代課", "鐘點費", "作業檢查"]
  },
  {
    ext: "1212",
    dept: "教務處 - 教學組",
    category: "academic",
    title: "教學組幹事",
    name: "教學組同仁",
    location: "行政大樓 1F",
    building: "admin",
    duties: "調代課單據登錄、兼代課鐘點造冊、教學日誌查核",
    isKey: false,
    tags: ["調課單", "教學日誌", "兼代課"]
  },
  {
    ext: "1221",
    dept: "教務處 - 註冊組",
    category: "academic",
    title: "註冊組長",
    name: "註冊組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "學生學籍管理、成績登錄、學雜費減免、各項獎助學金、大學繁星推薦",
    isKey: true,
    tags: ["成績單", "學籍", "繁星推薦", "獎學金", "畢業證書"]
  },
  {
    ext: "1222",
    dept: "教務處 - 註冊組",
    category: "academic",
    title: "註冊組幹事",
    name: "註冊組夥伴",
    location: "行政大樓 1F",
    building: "admin",
    duties: "成績證明書核發、在學證明、學生證補發、轉學休學復學手續",
    isKey: false,
    tags: ["在學證明", "學生證", "休學", "復學", "轉學"]
  },
  {
    ext: "1262",
    dept: "教務處 - 註冊組",
    category: "academic",
    title: "註冊組協助教師",
    name: "原佑誠 老師",
    location: "行政大樓 1F",
    building: "admin",
    duties: "升學報名統籌、多元入學報名作業、學習歷程檔案中央資料庫上傳",
    isKey: false,
    tags: ["多元入學", "學測報名", "分科測驗", "學習歷程"]
  },
  {
    ext: "1231",
    dept: "教務處 - 設備組",
    category: "academic",
    title: "設備組長",
    name: "設備組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "教學儀器設備採購借用、專科教室管理、教科書評選與分發發放",
    isKey: true,
    tags: ["教科書", "教材", "設備借用", "專科教室", "投影機"]
  },
  {
    ext: "1232",
    dept: "教務處 - 設備組",
    category: "academic",
    title: "設備組幹事",
    name: "設備組夥伴",
    location: "行政大樓 1F",
    building: "admin",
    duties: "各學科教科書發放、教具設備出借登記、專科教室鑰匙借還",
    isKey: false,
    tags: ["課本領取", "教具借用", "教室鑰匙"]
  },
  {
    ext: "1241",
    dept: "教務處 - 實驗研究組",
    category: "academic",
    title: "實研組長",
    name: "實驗研究組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "高中優質化專案、彈性自主學習課程、科學展覽競賽、跨領域專題",
    isKey: true,
    tags: ["優質化", "科展", "自主學習", "實驗班", "新課綱"]
  },
  {
    ext: "1261",
    dept: "教務處 - 專案計畫",
    category: "academic",
    title: "優質化協助教師",
    name: "李慧敏 老師",
    location: "行政大樓 1F",
    building: "admin",
    duties: "教育部高中優質化計畫推動執行、前瞻計畫管考",
    isKey: false,
    tags: ["優質化計畫", "教學創新", "教育部專案"]
  },
  {
    ext: "1251",
    dept: "教務處 - 試務組",
    category: "academic",
    title: "試務組長",
    name: "試務組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "全校定期評量考查（段考）、模擬考排程、印卷保管、考場監考規劃",
    isKey: true,
    tags: ["段考", "模擬考", "考場", "監考", "印卷"]
  },
  {
    ext: "1281",
    dept: "專科教室",
    category: "facilities",
    title: "家政烹飪教室",
    name: "烹飪專科管理",
    location: "蘊慧樓 3F",
    building: "yunhui",
    duties: "烹飪家政實作課程教學、烘焙廚藝教學設備維護",
    isKey: false,
    tags: ["家政", "烹飪", "廚藝", "實作"]
  },
  {
    ext: "1282",
    dept: "專科教室",
    category: "facilities",
    title: "自然科學實驗室",
    name: "物理化學生物實驗",
    location: "日新樓 3F",
    building: "rixin",
    duties: "基礎科學實驗、藥品安全管理、器材借用登記",
    isKey: false,
    tags: ["實驗室", "理化", "生物", "顯微鏡"]
  },

  // --- 學務處 ---
  {
    ext: "1301",
    dept: "學務處",
    category: "student",
    title: "學務主任",
    name: "學務處主任",
    location: "行政大樓 1F",
    building: "admin",
    duties: "綜理全校學生事務、品德輔導、學生活動、安全防護全盤事宜",
    isKey: true,
    fax: "(03) 478-2322",
    tags: ["學務", "學生事務", "校規", "輔導管教"]
  },
  {
    ext: "1311",
    dept: "學務處 - 訓育組",
    category: "student",
    title: "訓育組長",
    name: "訓育組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "班級幹部訓練、週會與專題演講、公民教育、校外教學（畢旅）規劃",
    isKey: true,
    tags: ["畢業旅行", "幹部訓練", "週會", "品德教育", "校外教學"]
  },
  {
    ext: "1312",
    dept: "學務處 - 訓育組",
    category: "student",
    title: "訓育組幹事",
    name: "訓育同仁",
    location: "行政大樓 1F",
    building: "admin",
    duties: "學生助學貸款申請、平安保險理賠申辦、藝文社教活動",
    isKey: false,
    tags: ["平安保險", "理賠", "就學貸款"]
  },
  {
    ext: "1321",
    dept: "學務處 - 課外活動組",
    category: "student",
    title: "活動組長",
    name: "課外活動組長",
    location: "行政大樓 1F",
    building: "admin",
    duties: "全校學生社團運作選填、校慶園遊會、跨年晚會、畢業典禮籌備、學生自治會",
    isKey: true,
    tags: ["社團", "學生會", "校慶", "園遊會", "畢業典禮"]
  },
  {
    ext: "1325",
    dept: "學務處 - 學生自治組織",
    category: "student",
    title: "學生會 / 畢聯會",
    name: "自治幹部辦公室",
    location: "懷德樓 1F",
    building: "huaide",
    duties: "學生自治會會務運作、高三畢聯會活動籌劃",
    isKey: false,
    tags: ["學生會辦公室", "畢聯會", "社團教室"]
  },
  {
    ext: "1331",
    dept: "學務處 - 體育組",
    category: "student",
    title: "體育組長",
    name: "體育組主管",
    location: "體育館 1F",
    building: "gym",
    duties: "全校體育運動會、班際球賽、校隊培訓集訓、體育場館借用與器材保管",
    isKey: true,
    tags: ["運動會", "體育器材", "班際比賽", "球場借用", "校隊"]
  },
  {
    ext: "1335",
    dept: "學務處 - 體育組",
    category: "facilities",
    title: "體育器材室 / 館長",
    name: "體育器材管理",
    location: "體育館 1F",
    building: "gym",
    duties: "運動球類球具借還、重訓室使用登記、體育館安全維護",
    isKey: false,
    tags: ["借球", "球具", "重訓室", "羽球場", "籃球場"]
  },
  {
    ext: "1341",
    dept: "學務處 - 衛生組",
    category: "student",
    title: "衛生組長",
    name: "衛生組主管",
    location: "行政大樓 1F",
    building: "admin",
    duties: "校園環境整潔區域分配、垃圾分類與資源回收、登革熱防治、校園綠美化",
    isKey: true,
    tags: ["外掃區", "資源回收", "垃圾分類", "打掃評分", "衛生清潔"]
  },
  {
    ext: "1119",
    dept: "學務處 - 健康中心",
    category: "student",
    title: "護理師 (一線)",
    name: "校園護理師",
    location: "行政大樓 1F",
    building: "admin",
    duties: "學生傷病緊急處理、傷口包紮換藥、緊急救護、新生健康檢查安排",
    isKey: true,
    isEmergency: true,
    tags: ["生病", "受傷", "健康檢查", "包紮", "緊急醫護"]
  },
  {
    ext: "1342",
    dept: "學務處 - 健康中心",
    category: "student",
    title: "護理師 (二線)",
    name: "健康管理師",
    location: "行政大樓 1F",
    building: "admin",
    duties: "學生傳染病防疫通報、慢性病與特殊疾病管理、急救器材 AED 保養",
    isKey: true,
    isEmergency: true,
    tags: ["健康中心", "AED", "防疫通報", "請假休息", "護理紀錄"]
  },
  {
    ext: "1351",
    dept: "學務處 - 教官室",
    category: "student",
    title: "主任教官",
    name: "主任教官",
    location: "行政大樓 1F",
    building: "admin",
    duties: "綜理全民國防教育、學生校內外生活輔導安全、春暉反毒防制",
    isKey: true,
    tags: ["教官", "校園安全", "國防教育", "反毒"]
  },
  {
    ext: "1352",
    dept: "學務處 - 生輔組",
    category: "student",
    title: "生活輔導組長",
    name: "生輔組長",
    location: "行政大樓 1F",
    building: "admin",
    duties: "學生出缺席請假簽核、早自習遲到登記、獎懲銷過管理、服裝儀容規範",
    isKey: true,
    tags: ["請假", "銷過", "警告", "遲到", "缺曠課", "服儀"]
  },
  {
    ext: "1353",
    dept: "學務處 - 教官室",
    category: "student",
    title: "值勤教官 / 校安中心",
    name: "24H 緊急值勤",
    location: "行政大樓 1F",
    building: "admin",
    duties: "校園 24 小時緊急事件應變、校安通報、夜間輪值安全巡查",
    isKey: true,
    isEmergency: true,
    tags: ["緊急電話", "校安中心", "值勤教官", "24H通報", "突發事故"]
  },
  {
    ext: "1354",
    dept: "學務處 - 教官室",
    category: "student",
    title: "生輔教官 (高一高二)",
    name: "責任區教官",
    location: "行政大樓 1F",
    building: "admin",
    duties: "高一高二學生生活輔導、防制校園霸凌、交通安全專案",
    isKey: false,
    tags: ["霸凌防制", "校車交通", "生活常規"]
  },
  {
    ext: "1355",
    dept: "學務處 - 教官室",
    category: "student",
    title: "生輔教官 (高三實習)",
    name: "責任區教官",
    location: "行政大樓 1F",
    building: "admin",
    duties: "高三生活常規、畢業生校園安全、學生賃居生訪視輔導",
    isKey: false,
    tags: ["賃居生", "租屋訪視", "交通安全"]
  },
  {
    ext: "1356",
    dept: "學務處 - 校安中心",
    category: "student",
    title: "學務創新人員 / 校安夥伴",
    name: "校安人員",
    location: "行政大樓 1F",
    building: "admin",
    duties: "日間校園巡邏防護、學生安全守護、校園突發狀況支援協助",
    isKey: false,
    tags: ["巡邏", "校安夥伴", "走廊秩序"]
  },

  // --- 總務處 ---
  {
    ext: "1401",
    dept: "總務處",
    category: "general",
    title: "總務主任",
    name: "總務處主任",
    location: "行政大樓 2F",
    building: "admin",
    duties: "綜理全校總務行政、校園重大工程採購規劃、環境安全與綠能校園",
    isKey: true,
    fax: "(03) 478-0164",
    tags: ["總務", "重大採購", "營繕工程", "校園空間"]
  },
  {
    ext: "1411",
    dept: "總務處 - 文書組",
    category: "general",
    title: "文書組長",
    name: "文書組主管",
    location: "行政大樓 2F",
    building: "admin",
    duties: "全校公文收發收件、電子公文交換、檔案歸檔借調、學校印信大印典守",
    isKey: true,
    tags: ["公文", "蓋用印信", "公印", "公文收發", "檔案調閱"]
  },
  {
    ext: "1412",
    dept: "總務處 - 文書組",
    category: "general",
    title: "文書組幹事 / 郵件分發",
    name: "文書同仁",
    location: "行政大樓 2F",
    building: "admin",
    duties: "各處室信件掛號包裹分發、公文郵寄郵資核算",
    isKey: false,
    tags: ["掛號信", "郵件包裹", "郵資"]
  },
  {
    ext: "1421",
    dept: "總務處 - 出納組",
    category: "general",
    title: "出納組長",
    name: "出納組主管",
    location: "行政大樓 2F",
    building: "admin",
    duties: "教職員薪資發放、學生各期註冊三聯單製發、保證金收取、各項公款收付",
    isKey: true,
    tags: ["薪水", "註冊單繳費", "退費", "學雜費", "收據"]
  },
  {
    ext: "1431",
    dept: "總務處 - 庶務組",
    category: "general",
    title: "庶務組長",
    name: "庶務組主管",
    location: "行政大樓 2F",
    building: "admin",
    duties: "校園水電維修申報、修繕工程發包、校舍課桌椅調度、辦公用品採購分配",
    isKey: true,
    tags: ["報修", "水電故障", "冷氣遙控器", "課桌椅更換", "電燈修繕"]
  },
  {
    ext: "1432",
    dept: "總務處 - 庶務組",
    category: "general",
    title: "庶務幹事 / 工友主管",
    name: "庶務夥伴",
    location: "行政大樓 2F",
    building: "admin",
    duties: "校園財產盤點清查、公務車輛調派、教室冷氣卡儲值管理",
    isKey: false,
    tags: ["冷氣卡", "儲值", "公務車", "班級設備"]
  },
  {
    ext: "1433",
    dept: "員生消費合作社",
    category: "general",
    title: "合作社經理 / 出納",
    name: "員生社",
    location: "日新樓 1F",
    building: "rixin",
    duties: "學生制服運動服購買、班級便當訂購、文具用品供應、校園販賣機維護",
    isKey: false,
    tags: ["制服購買", "運動服", "麵包點心", "合作社", "便當"]
  },
  {
    ext: "1435",
    dept: "總務處 - 機電維護",
    category: "facilities",
    title: "水電營繕工程室",
    name: "機電技術同仁",
    location: "行政大樓 1F 後側",
    building: "admin",
    duties: "高低壓變電室、校園飲水機定期換濾心、消防安檢配合",
    isKey: false,
    tags: ["飲水機", "跳電", "停水停電", "消防設備"]
  },

  // --- 輔導室 ---
  {
    ext: "1502",
    dept: "輔導室",
    category: "counseling",
    title: "輔導主任",
    name: "輔導室主管",
    location: "行政大樓 3F",
    building: "admin",
    duties: "綜理全校學生輔導與諮商工作、特殊教育業務、親職教育講座與家長會溝通",
    isKey: true,
    fax: "(03) 475-8437",
    tags: ["輔導", "諮商", "特教", "親職教育", "身心健康"]
  },
  {
    ext: "1501",
    dept: "輔導室 - 學生諮商",
    category: "counseling",
    title: "專任輔導教師 (高一)",
    name: "高一輔導老師",
    location: "行政大樓 3F",
    building: "admin",
    duties: "高一新生適應輔導、性向與興趣測驗施測與個別解釋、人際關係輔導",
    isKey: true,
    tags: ["新生適應", "心理測驗", "高一輔導", "情緒排解"]
  },
  {
    ext: "1503",
    dept: "輔導室 - 生涯輔導",
    category: "counseling",
    title: "專任輔導教師 (高二)",
    name: "高二輔導老師",
    location: "行政大樓 3F",
    building: "admin",
    duties: "高二類組選修輔導、學群探索生涯規劃、個別晤談預約",
    isKey: true,
    tags: ["選組輔導", "生涯探索", "高二晤談", "學群介紹"]
  },
  {
    ext: "1504",
    dept: "輔導室 - 升學輔導",
    category: "counseling",
    title: "專任輔導教師 (高三)",
    name: "高三輔導老師",
    location: "行政大樓 3F",
    building: "admin",
    duties: "大學甄選入學備審資料指導、模擬面試實戰演練、落點分析輔導",
    isKey: true,
    tags: ["備審資料", "模擬面試", "升學諮詢", "高三落點"]
  },
  {
    ext: "1505",
    dept: "輔導室 - 特教組",
    category: "counseling",
    title: "特教組長",
    name: "特教主管",
    location: "行政大樓 3F",
    building: "admin",
    duties: "身心障礙學生個別化教育計畫 (IEP) 擬定、特教通報、特殊輔具申請",
    isKey: true,
    tags: ["特教", "IEP", "身心障礙", "特殊考試服務", "輔具"]
  },
  {
    ext: "1506",
    dept: "輔導室 - 資源班",
    category: "counseling",
    title: "特教資源班教師",
    name: "特教老師",
    location: "日新樓 2F",
    building: "rixin",
    duties: "資源教室課業輔導、社會技巧學習課程、個別加強訓練",
    isKey: false,
    tags: ["資源班", "課業抽離", "社會技巧"]
  },
  {
    ext: "1508",
    dept: "輔導室 - 專業教室",
    category: "counseling",
    title: "生涯輔導資訊室",
    name: "升學資料專區",
    location: "行政大樓 3F",
    building: "admin",
    duties: "全國各大學大專院校科系簡章陳列、心理叢書借閱、自主選校選系查閱",
    isKey: false,
    tags: ["大學簡章", "生涯資訊", "科系資料庫"]
  },
  {
    ext: "1509",
    dept: "輔導室 - 諮商專區",
    category: "counseling",
    title: "個別與團體諮商室",
    name: "溫馨會談室",
    location: "行政大樓 3F",
    building: "admin",
    duties: "隱密一對一心理深度晤談、小型心靈成長團體工作坊",
    isKey: false,
    tags: ["預約諮商", "隱私晤談", "心靈放鬆"]
  },

  // --- 圖書館 ---
  {
    ext: "1601",
    dept: "圖書館",
    category: "library",
    title: "圖書館主任",
    name: "圖書館主任",
    location: "圖資大樓 1F",
    building: "library_bld",
    duties: "綜理全校圖書閱讀推廣、數位學習資源建置、自主學習空間營造",
    isKey: true,
    fax: "(03) 478-0586",
    tags: ["圖書館", "閱讀推廣", "數位學習"]
  },
  {
    ext: "1602",
    dept: "圖書館 - 讀者服務組",
    category: "library",
    title: "讀者服務組長",
    name: "讀服組主管",
    location: "圖資大樓 1F",
    building: "library_bld",
    duties: "全校圖書借還登記、中英文新書採購推薦、全國高中跨校小論文競賽輔導",
    isKey: true,
    tags: ["借書", "還書", "小論文競賽", "閱讀心得", "新書推薦"]
  },
  {
    ext: "1605",
    dept: "圖書館 - 讀者服務組",
    category: "library",
    title: "讀者服務組幹事",
    name: "圖書館夥伴",
    location: "圖資大樓 1F",
    building: "library_bld",
    duties: "讀者借書證辦理、館藏圖書期刊登錄加工、閱覽室自習秩序維護",
    isKey: false,
    tags: ["借書證", "自習室", "雜誌借閱", "逾期罰款"]
  },
  {
    ext: "1603",
    dept: "圖書館 - 資訊媒體組",
    category: "library",
    title: "資訊媒體組長",
    name: "資媒組主管",
    location: "圖資大樓 2F",
    building: "library_bld",
    duties: "校園核心骨幹網路建置、校園入口網站維運、校園資通安全防護、教育雲帳號管理",
    isKey: true,
    tags: ["校園網路", "WiFi密碼", "校網", "教育雲帳號", "資安"]
  },
  {
    ext: "1604",
    dept: "圖書館 - 資訊媒體組",
    category: "library",
    title: "資訊系統技術人員",
    name: "資訊工程師",
    location: "圖資大樓 2F",
    building: "library_bld",
    duties: "電腦教室軟硬體維護、教職員電腦帳號密碼重設、網路故障排除",
    isKey: false,
    tags: ["忘記密碼", "電腦故障", "網路不通", "印表機維修"]
  },
  {
    ext: "1611",
    dept: "專科教室",
    category: "facilities",
    title: "第一電腦教室",
    name: "多媒體教學室",
    location: "圖資大樓 2F",
    building: "library_bld",
    duties: "高中資訊科技課程教學、程式設計實作練習、檢定考場",
    isKey: false,
    tags: ["電腦課", "程式設計", "檢定考"]
  },
  {
    ext: "1612",
    dept: "專科教室",
    category: "facilities",
    title: "第二電腦教室",
    name: "數位互動學習室",
    location: "圖資大樓 2F",
    building: "library_bld",
    duties: "各科多媒體教學借用、自主學習數位教室",
    isKey: false,
    tags: ["電腦教室", "自主學習", "簡報投影"]
  },
  {
    ext: "1608",
    dept: "專科教室",
    category: "facilities",
    title: "演藝廳 / 國際會議廳",
    name: "影音控制室",
    location: "圖資大樓 3F",
    building: "library_bld",
    duties: "全校大型講座、演藝展演、跨校學術研討會音控設備操作借用",
    isKey: false,
    tags: ["演藝廳", "會議廳", "麥克風借用", "舞台音響"]
  },

  // --- 實習處及職業類科專科 ---
  {
    ext: "1701",
    dept: "實習處",
    category: "vocational",
    title: "實習處主任",
    name: "簡樹桐 主任",
    location: "日新樓 1F",
    building: "rixin",
    duties: "綜理職業類科技術教育、全國技藝競賽指導、產學合作專案、實習工廠安全",
    isKey: true,
    tags: ["實習", "技藝競賽", "產學合作", "技能檢定"]
  },
  {
    ext: "1702",
    dept: "實習處 - 實習組",
    category: "vocational",
    title: "實習組長",
    name: "實習組主管",
    location: "日新樓 1F",
    building: "rixin",
    duties: "學生校外業界實習媒合、工廠安全衛生檢查、專業實習耗材材料採購分發",
    isKey: true,
    tags: ["校外實習", "耗材", "工安", "材料採購"]
  },
  {
    ext: "1703",
    dept: "資訊科",
    category: "vocational",
    title: "資訊科主任",
    name: "資訊科主管",
    location: "日新樓 2F",
    building: "rixin",
    duties: "資訊科專業課程規劃、單晶片微電腦實習、網路架設丙乙級檢定培訓",
    isKey: true,
    tags: ["資訊科", "單晶片", "物聯網", "網路架設"]
  },
  {
    ext: "1704",
    dept: "資訊科",
    category: "vocational",
    title: "資訊科專業辦公室",
    name: "專業任課教師",
    location: "日新樓 2F",
    building: "rixin",
    duties: "資訊科任課教師辦公室、學生專題指導、科展製作討論",
    isKey: false,
    tags: ["專題製作", "資訊科老師"]
  },
  {
    ext: "1705",
    dept: "電子科",
    category: "vocational",
    title: "電子科主任",
    name: "電子科主管",
    location: "日新樓 2F",
    building: "rixin",
    duties: "電子科專業課程、基本電學實習、工業電子與視聽電子檢定培育",
    isKey: true,
    tags: ["電子科", "電路板", "基本電學", "工業電子"]
  },
  {
    ext: "1706",
    dept: "電子科",
    category: "vocational",
    title: "電子科專業辦公室",
    name: "專業任課教師",
    location: "日新樓 2F",
    building: "rixin",
    duties: "電子科專業實習指導、儀器儀表調校與保養",
    isKey: false,
    tags: ["電子科老師", "示波器", "實習工廠"]
  },

  // --- 教師辦公室與導師室 ---
  {
    ext: "1271",
    dept: "專任教師辦公室",
    category: "faculty",
    title: "蘊慧樓 1 樓專一辦公室 (一線)",
    name: "語文與社會學科",
    location: "蘊慧樓 1F",
    building: "yunhui",
    duties: "國文科、英文科、社會科專任教師辦公室、課業問題解惑晤談",
    isKey: false,
    tags: ["國文老師", "英文老師", "歷史地理公民", "問問題"]
  },
  {
    ext: "1275",
    dept: "專任教師辦公室",
    category: "faculty",
    title: "蘊慧樓 1 樓專一辦公室 (二線)",
    name: "專一教師聯繫",
    location: "蘊慧樓 1F",
    building: "yunhui",
    duties: "專一辦公室第二線分機、學生課後輔導聯繫",
    isKey: false,
    tags: ["專一辦公室", "找老師"]
  },
  {
    ext: "1272",
    dept: "專任教師辦公室",
    category: "faculty",
    title: "蘊慧樓 2 樓專二辦公室",
    name: "數學與自然科學",
    location: "蘊慧樓 2F",
    building: "yunhui",
    duties: "數學科、物理科、化學科、生物科、地球科學專任教師辦公室",
    isKey: false,
    tags: ["數學老師", "物理化學老師", "問數學", "理化答疑"]
  },
  {
    ext: "1273",
    dept: "專任教師辦公室",
    category: "faculty",
    title: "日新樓 2 樓專三辦公室",
    name: "藝能與專業群科",
    location: "日新樓 2F",
    building: "rixin",
    duties: "藝能學科（音樂、美術、家政、健護）及專業群科專任教師辦公室",
    isKey: false,
    tags: ["美術老師", "音樂老師", "體育老師", "專業群科"]
  },
  {
    ext: "1276",
    dept: "導師室",
    category: "faculty",
    title: "高一導師室",
    name: "一年級各班導師",
    location: "懷德樓 2F",
    building: "huaide",
    duties: "高一各班班級導師辦公室、家長電話聯繫、班級經營與日常學習訪談",
    isKey: true,
    tags: ["高一導師", "班導", "家長聯絡", "請假報備"]
  },
  {
    ext: "1277",
    dept: "導師室",
    category: "faculty",
    title: "高二導師室",
    name: "二年級各班導師",
    location: "弘道樓 2F",
    building: "hongdao",
    duties: "高二各班班級導師辦公室、家長親師溝通、高二生活常規關注",
    isKey: true,
    tags: ["高二導師", "班導師", "親師交流"]
  },
  {
    ext: "1278",
    dept: "導師室",
    category: "faculty",
    title: "高三導師室",
    name: "三年級各班導師",
    location: "弘道樓 3F",
    building: "hongdao",
    duties: "高三各班班級導師辦公室、大考備考叮嚀、志願選填交流、家長專線",
    isKey: true,
    tags: ["高三導師", "考學測", "分科測驗", "高三班導"]
  }
];

// 常見情境快速引導問答 (FAQ / 快速幫手)
const QUICK_GUIDE_TOPICS = [
  {
    title: "🚨 緊急身體不適、受傷需要急救？",
    desc: "立即聯繫健康中心護理師或值勤教官",
    exts: ["1119", "1342", "1353"],
    badge: "緊急醫療"
  },
  {
    title: "📝 請假、遲到、銷過或服裝儀容問題？",
    desc: "請洽學務處生活輔導組 (生輔組)",
    exts: ["1352", "1354"],
    badge: "學生生活"
  },
  {
    title: "🎓 成績單、學生證補發、在學證明？",
    desc: "請洽教務處註冊組或試務組",
    exts: ["1221", "1222"],
    badge: "教務學籍"
  },
  {
    title: "❤️ 升學焦慮、心理壓力、想找人聊聊？",
    desc: "預約輔導室個別諮商老師傾聽你的心聲",
    exts: ["1501", "1503", "1504", "1502"],
    badge: "溫暖諮商"
  },
  {
    title: "🔧 教室電燈不亮、冷氣遙控器故障、課桌椅損壞？",
    desc: "填報修單或直接聯絡總務處庶務組",
    exts: ["1431", "1432"],
    badge: "修繕設備"
  },
  {
    title: "💻 校園 WiFi 密碼、教育雲忘記密碼、電腦教室借用？",
    desc: "請洽圖書館資訊媒體組",
    exts: ["1603", "1604"],
    badge: "資訊科技"
  },
  {
    title: "🚪 校門訪客登記、家長送餐、包裹查詢？",
    desc: "請聯繫大門警衛室保全同仁",
    exts: ["1110"],
    badge: "校門安全"
  }
];
