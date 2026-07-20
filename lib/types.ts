// 콘텐츠 데이터 공용 타입.
//
// 왜 필요한가: 콘텐츠 배열에 `as const` 를 붙이면 각 원소가 서로 다른 리터럴 타입이 되고,
// 일부 원소에만 있는 선택 속성(emphasis 등)을 읽을 때 TS 가 유니온 전체에서 못 찾아 에러난다.
// 배열마다 `as Step[]` 처럼 타입을 명시해 이 문제를 없앤다.

/** 번호가 붙은 단계. emphasis 를 켜면 그 단계가 강조 표시된다. */
export type Step = {
  n: string;
  name: string;
  body: string;
  emphasis?: boolean;
};

/** 라벨-값 한 쌍. KeyValueList 에서 쓴다. */
export type KeyValue = { k: string; v: string };

/** 5단 파이프라인 도식의 한 단계. */
export type PipelineStage = {
  /** 단 이름: 현장 / 수집 / 품질 게이트 / 추론 / 안착·확산 */
  label: string;
  title: string;
  lines: string[];
  /** 품질 게이트에만 켠다. 두 사업 도식 모두 같은 단을 강조해야 논지가 산다. */
  emphasis?: boolean;
};

/**
 * 사업 하나를 한 장으로 보여주는 도식.
 * 두 사업이 같은 타입을 공유하므로 단 구성이 어긋날 수 없다.
 */
export type Pipeline = {
  stages: PipelineStage[];
  footer: { label: string; items: string[] };
};
