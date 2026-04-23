export type Customer = {
  id: number;
  name: string;
  kana: string;
  company: string;
  email: string;
  phone: string;
  address: string;
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "山田 太郎",
    kana: "ヤマダ タロウ",
    company: "株式会社ヤマダ商事",
    email: "yamada@example.com",
    phone: "090-1111-1111",
    address: "東京都千代田区丸の内1-1-1",
  },
  {
    id: 2,
    name: "鈴木 花子",
    kana: "スズキ ハナコ",
    company: "スズキ工業株式会社",
    email: "suzuki@example.com",
    phone: "090-2222-2222",
    address: "東京都港区六本木2-2-2",
  },
  {
    id: 3,
    name: "佐藤 健",
    kana: "サトウ ケン",
    company: "佐藤建設",
    email: "sato@example.com",
    phone: "090-3333-3333",
    address: "神奈川県横浜市西区みなとみらい3-3-3",
  },
  {
    id: 4,
    name: "田中 美咲",
    kana: "タナカ ミサキ",
    company: "田中デザイン事務所",
    email: "tanaka@example.com",
    phone: "090-4444-4444",
    address: "大阪府大阪市北区梅田4-4-4",
  },
  {
    id: 5,
    name: "高橋 誠",
    kana: "タカハシ マコト",
    company: "株式会社タカハシ物流",
    email: "takahashi@example.com",
    phone: "090-5555-5555",
    address: "愛知県名古屋市中区栄5-5-5",
  },
  {
    id: 6,
    name: "伊藤 さくら",
    kana: "イトウ サクラ",
    company: "伊藤ファーム",
    email: "ito@example.com",
    phone: "090-6666-6666",
    address: "北海道札幌市中央区大通6-6-6",
  },
  {
    id: 7,
    name: "渡辺 聡",
    kana: "ワタナベ サトシ",
    company: "渡辺コンサルティング",
    email: "watanabe@example.com",
    phone: "090-7777-7777",
    address: "福岡県福岡市博多区博多駅前7-7-7",
  },
  {
    id: 8,
    name: "小林 真由美",
    kana: "コバヤシ マユミ",
    company: "小林薬品株式会社",
    email: "kobayashi@example.com",
    phone: "090-8888-8888",
    address: "京都府京都市中京区烏丸8-8-8",
  },
  {
    id: 9,
    name: "中村 拓也",
    kana: "ナカムラ タクヤ",
    company: "中村システム",
    email: "nakamura@example.com",
    phone: "090-9999-9999",
    address: "兵庫県神戸市中央区三宮9-9-9",
  },
  {
    id: 10,
    name: "加藤 優子",
    kana: "カトウ ユウコ",
    company: "加藤商店",
    email: "kato@example.com",
    phone: "090-1010-1010",
    address: "宮城県仙台市青葉区一番町10-10-10",
  },
];
