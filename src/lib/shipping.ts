export type ShippingMethod = "sf-station" | "sf-locker" | "home-delivery";

export interface ShippingRate {
  method: ShippingMethod;
  label: string;
  description: string;
  fee: number;
}

export const FREE_SHIPPING_THRESHOLD = 599;

const RATES: Record<ShippingMethod, Omit<ShippingRate, "method">> = {
  "sf-station": {
    label: "順豐站自取",
    description: "全港 200+ 順豐站 / 順便智能櫃，1-2 工作天到達",
    fee: 30,
  },
  "sf-locker": {
    label: "順豐智能櫃",
    description: "智能櫃 24 小時自取，1-2 工作天到達",
    fee: 30,
  },
  "home-delivery": {
    label: "順豐住宅派送",
    description: "送貨上門（住宅 / 商業地址），1-2 工作天",
    fee: 50,
  },
};

export function calculateShipping(method: ShippingMethod, subtotal: number): ShippingRate {
  const base = RATES[method];
  const fee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : base.fee;
  return { method, ...base, fee };
}

export function listShippingMethods(subtotal: number): ShippingRate[] {
  return (Object.keys(RATES) as ShippingMethod[]).map((m) =>
    calculateShipping(m, subtotal)
  );
}

export interface ServicePoint {
  id: string;
  name: string;
  address: string;
  district: string;
  type: "station" | "locker";
}

/**
 * Static list of representative SF Express HK service points.
 * Phase 2: replace with live SF Open Platform API call.
 */
export const SF_SERVICE_POINTS: ServicePoint[] = [
  { id: "852HKG001", name: "順豐站・銅鑼灣崇光", district: "灣仔區", address: "銅鑼灣百德新街 SOGO 崇光百貨地下", type: "station" },
  { id: "852HKG002", name: "順豐站・中環", district: "中西區", address: "中環德輔道中 19 號環球大廈地下 N8 號舖", type: "station" },
  { id: "852HKG003", name: "順豐站・尖沙咀", district: "油尖旺區", address: "尖沙咀彌敦道 132 號美麗華廣場一期", type: "station" },
  { id: "852HKG004", name: "順豐站・旺角", district: "油尖旺區", address: "旺角西洋菜南街 60 號好景商業中心", type: "station" },
  { id: "852HKG005", name: "順豐站・觀塘", district: "觀塘區", address: "觀塘巧明街 96 號至 98 號", type: "station" },
  { id: "852HKG006", name: "順豐站・荃灣", district: "荃灣區", address: "荃灣大涌道 30-32 號華邦工業中心", type: "station" },
  { id: "852HKG007", name: "順豐站・沙田", district: "沙田區", address: "沙田正街 21-27 號偉華中心", type: "station" },
  { id: "852HKG008", name: "順豐站・元朗", district: "元朗區", address: "元朗教育路 1-7 號元朗廣場", type: "station" },
  { id: "852HKG009", name: "順豐站・將軍澳", district: "西貢區", address: "將軍澳坑口培成路 18 號", type: "station" },
  { id: "852HKG010", name: "順豐站・屯門", district: "屯門區", address: "屯門屯利街 1 號華都花園", type: "station" },
  { id: "EFL-CWB-01", name: "順便智能櫃・銅鑼灣", district: "灣仔區", address: "銅鑼灣禮頓道", type: "locker" },
  { id: "EFL-MK-01", name: "順便智能櫃・旺角", district: "油尖旺區", address: "旺角朗豪坊", type: "locker" },
  { id: "EFL-TST-01", name: "順便智能櫃・尖沙咀", district: "油尖旺區", address: "尖沙咀港鐵站 B1 出口", type: "locker" },
];
