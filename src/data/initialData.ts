import { SiteConfig, PortfolioItem, ServiceDetail, ReviewItem, QuoteRequest } from '../types';

export const initialSiteConfig: SiteConfig = {
  brandName: '도지클린시스템',
  heroBadge: '전북 전지역 에어컨 정밀 세척 & 제빙기 분해 살균 종합 케어',
  heroTitle: '보이지 않는 곳까지 깨끗하게, 에어컨 & 제빙기 케어의 표준',
  heroSubtitle: '단순 겉면 필터 청소가 아닌 송풍팬·열교환기·드레인판까지 꼼꼼한 정밀 분해 세척. 제빙기 130℃ 초고온 스팀 살균과 에어컨 고압 제트 세척으로 안심 호흡과 깨끗한 얼음을 약속합니다.',
  primaryPhone: '0507-1338-4626',
  secondaryPhone: '0507-1338-4626',
  kakaoUrl: 'https://pf.kakao.com',
  instagramUrl: 'https://instagram.com',
  naverBlogUrl: 'https://blog.naver.com',
  operatingHours: '연중무휴 08:00 - 21:00 (야간/주말 작업 가능)',
  companyAddress: '전북 익산시 서동로 151-7',
  ceoName: '김도지',
  businessNumber: '214-88-90123',
  primaryColor: '#0062FF',
  fontMode: 'pretendard',
  seoTitle: '도지클린시스템 - 전북 익산·전주·군산 에어컨 & 제빙기 정밀 분해 살균세척',
  seoDescription: '전북 익산시 서동로 151-7 위치. 에어컨 정밀 분해 세척, 업소용·가정용 제빙기 고온스팀 살균, 카드결제 및 현금영수증 발행 가능, 30일 무상 A/S 도지클린시스템',
  formspreeEndpoint: 'https://formspree.io/f/xqpejjvp'
};

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'case-1',
    title: '익산 영등동 대형 베이커리 카페 호시자키 150kg 제빙기 분해 살균',
    category: '업소용 제빙기',
    location: '전북 익산시 영등동',
    beforeImage: '/src/assets/images/icemaker_cleaning_detail_1792396307580.jpg',
    afterImage: '/src/assets/images/icemaker_cleaning_detail_1792396307580.jpg',
    description: '물때와 석회 스케일, 물받이 오염을 전용 식품등급 세척액과 130도 고압 스팀으로 철저히 살균. 투명하고 단단한 얼음 품질 회복.',
    highlights: ['전극봉 및 수중펌프 분해', '식품첨가물 구연산 스케일링', '130℃ 초고온 스팀 노즐 살균'],
    date: '2026.10.15'
  },
  {
    id: 'case-2',
    title: '전주 신시가지 메디컬 빌딩 천장형 4Way 시스템 에어컨 12대 정기 케어',
    category: '에어컨 정밀세척',
    location: '전북 전주시 완산구 효자동',
    beforeImage: '/src/assets/images/young_korean_tech_hero_1792405760085.jpg',
    afterImage: '/src/assets/images/ac_cleaning_detail_1792396307135.jpg',
    description: '병원 진료실 집중 냉난방으로 드레인판에 누적된 슬러지와 송풍팬 곰팡이를 정밀 고압 제트 세척. 쾌적한 실내 공기질 확보.',
    highlights: ['진료실 보양 비닐 작업', '친환경 알루미늄 핀 전용 세제', '피톤치드 연무 항균 마감'],
    date: '2026.10.12'
  },
  {
    id: 'case-3',
    title: '익산 모현동 현대아이파크 34평 가정용 스탠드+벽걸이 2in1 정밀 세척',
    category: '가정용 토탈케어',
    location: '전북 익산시 모현동',
    beforeImage: '/src/assets/images/ac_cleaning_detail_1792396307135.jpg',
    afterImage: '/src/assets/images/young_korean_tech_hero_1792405760085.jpg',
    description: '영유아가 거주하는 가정으로 유기화학 물질이 없는 미 환경청(EPA) 인증 친환경 세척제만 사용하여 송풍팬 깊은 곳의 미세 오염까지 고압 물세척.',
    highlights: ['영유아 안심 친환경 약품 사용', '정밀 분해 부품 물세척', '자외선 UV 살균 건조'],
    date: '2026.10.08'
  },
  {
    id: 'case-4',
    title: '군산 수송동 디저트 카페 카이저(KAISER) 공랭식 제빙기 케어',
    category: '업소용 제빙기',
    location: '전북 군산시 수송동',
    beforeImage: '/src/assets/images/icemaker_cleaning_detail_1792396307580.jpg',
    afterImage: '/src/assets/images/icemaker_cleaning_detail_1792396307580.jpg',
    description: '얼음 생성 속도 저하 및 냄새 개선을 위해 출동. 급수 밸브 슬러지 제거 및 130℃ 스팀 에바포레이터 냉판 특수 세척으로 본래 성능 복원.',
    highlights: ['맞춤 시간대 방문 시공', '130℃ 스팀 배관 살균', '얼음 생성 효율 복원'],
    date: '2026.10.03'
  }
];

export const initialServices: ServiceDetail[] = [
  {
    id: 'srv-wall',
    title: '벽걸이 에어컨 정밀 분해 세척',
    category: 'aircon',
    tag: '원룸 · 안방 · 소형평수 필수',
    target: '일반 가정, 원룸, 오피스텔, 원룸텔',
    duration: '약 60분 ~ 80분 소요',
    priceStart: '80,000원부터~',
    summary: '전면 커버와 송풍 날개, 송풍팬(블로워팬)을 정밀 탈거하여 후면 냉각핀 속 숨은 곰팡이까지 전용 고압 제트로 분사 세척합니다.',
    features: ['송풍팬 모터 안전 분리', '특수 방수 보양 가대 설치', '친환경 알루미늄 핀 전용 세제', '강력 고압 제트 린스 세척'],
    recommendedPeriod: '연 1회 (봄~여름 가동 전)'
  },
  {
    id: 'srv-stand',
    title: '스탠드 에어컨 정밀 분해 세척',
    category: 'aircon',
    tag: '거실 · 매장 메인 냉방',
    target: '아파트 거실, 상가, 식당, 학원',
    duration: '약 90분 ~ 120분 소요',
    priceStart: '130,000원부터~',
    summary: '하부 드레인 팬과 상부 듀얼 송풍팬, 복합 열교환기를 정밀 분해하여 묵은 먼지와 슬러지, 찌든 냄새를 고압 세척으로 말끔히 제거합니다.',
    features: ['스마트 인버터 회로 기판 안전 차단', '하부 물받이 슬러지 세척', '친환경 전용 핀 세정제', '피톤치드 연무 탈취 마감'],
    recommendedPeriod: '연 1회 정기 클리닝'
  },
  {
    id: 'srv-system',
    title: '천장형 시스템 에어컨 (1Way / 4Way)',
    category: 'aircon',
    tag: '오피스 · 프랜차이즈 · 아파트 시스템',
    target: '사무실, 병의원, 카페 매장, 아파트',
    duration: '대당 약 80분 ~ 100분 소요',
    priceStart: '110,000원부터~ (다량 할인)',
    summary: '천장에 매립된 물받이 드레인판과 대형 블로워 팬을 안전하게 분해하여 낙수 피해 없는 전용 드레인 백 시스템으로 고압 제트 세척합니다.',
    features: ['맞춤형 천장 방수 드레인백 장착', '송풍팬 및 물받이 분해 세척', '다량 보유 기업/매장 특별 할인', '야간/휴일 비영업시간 방문 시공 가능'],
    recommendedPeriod: '여름 냉방 및 겨울 난방 전'
  },
  {
    id: 'srv-ice-cafe',
    title: '카페/업소용 제빙기 고온스팀 분해 살균',
    category: 'icemaker',
    tag: '호시자키 · 카이저 · 제아 · 네오트 전 모델',
    target: '카페, 베이커리, 호프, 식당, 호텔',
    duration: '약 90분 ~ 120분 소요',
    priceStart: '105,000원부터~',
    summary: '얼음 생성 냉판(에바포레이터), 급수 노즐, 워터 커튼, 수중 펌프를 분해하여 130℃ 초고온 스팀과 식품등급 약품으로 석회 스케일과 유해 세균을 박멸합니다.',
    features: ['130℃ 초고온 스팀 집중 살균', '식품첨가물 등급 스케일 전용 제거제 사용', '도금 손상 없는 전용 브러시 수작업', '부품별 정밀 세척 및 살균 완료'],
    recommendedPeriod: '분기별 1회 (최소 반기 1회)'
  },
  {
    id: 'srv-package',
    title: '에어컨 + 제빙기 매장 위생 토탈 패키지',
    category: 'icemaker',
    tag: '매장 점주님 만족도 1위 패키지',
    target: '신규 오픈 매장, 카페 및 레스토랑',
    duration: '약 180분 ~ 240분 소요',
    priceStart: '패키지 15% 특별 우대 할인',
    summary: '매장 내 냉난방기 고압 정밀 세척과 제빙기 130℃ 초고온 스팀 살균을 하루에 일괄 케어하여 영업 손실을 최소화하는 올인원 플랜입니다.',
    features: ['비영업시간(새벽/야간) 방문 스케줄링', '위생 점검 리포트 제공', '사후 하자 30일 안심 보증', '패키지 동시 진행 시 우대 할인 적용'],
    recommendedPeriod: '가동 전 정기 케어'
  }
];

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    author: '박*훈 점주님',
    role: '전주 신시가지 카페 라운지 운영',
    serviceType: '호시자키 100kg 제빙기 + 천장형 4Way 2대',
    rating: 5,
    date: '2026.10.14',
    content: '전주 효자동에서 카페를 운영 중인데 얼음에서 살짝 냄새가 나서 급하게 의뢰했습니다. 제빙기는 130도 고온 스팀과 식품용 세정제로 뽀얗게 소독해주시고, 에어컨도 고압 제트로 꼼꼼하게 때를 빼주셨어요. 카드결제도 깔끔하게 되고 익산 본점에서 직접 출동해주셔서 더욱 신뢰가 갔습니다.',
    verified: true
  },
  {
    id: 'rev-2',
    author: '이*영 님',
    role: '익산 모현동 현대아이파크 입주민',
    serviceType: '스탠드 에어컨 + 벽걸이 에어컨 2in1',
    rating: 5,
    date: '2026.10.09',
    content: '모현동 아파트인데 아이 비염 때문에 청소 신청했어요. 기사님이 송풍팬을 모터에서 분리해서 화장실에서 고압 물세척해주시는데 시커먼 먼지물이 나오는 걸 보고 맡기길 정말 잘했다 싶었습니다. 벽지 보양도 완벽했고 현금영수증까지 바로 발급해주셔서 아주 만족스럽습니다.',
    verified: true
  },
  {
    id: 'rev-3',
    author: '최*민 원장',
    role: '군산 수송동 대형 어학원',
    serviceType: '천장형 4Way 시스템 에어컨 8대',
    rating: 5,
    date: '2026.09.28',
    content: '학원 주말 휴무에 맞춰 8대 시공 부탁드렸는데 군산까지 제시간에 딱 맞춰 와주셨습니다. 시공 전후 사진과 작동 테스트 결과까지 꼼꼼히 확인시켜 주셨어요. 카드결제로 간편하게 결제했고 30일 A/S 보증서까지 주셔서 학원생들에게 쾌적한 환경을 만들어줬습니다.',
    verified: true
  },
  {
    id: 'rev-4',
    author: '정*우 사장님',
    role: '익산 영등동 베이커리 펍 운영',
    serviceType: '카이저 제빙기 스케일링 & 130℃ 스팀 살균',
    rating: 5,
    date: '2026.09.15',
    content: '영등동 매장 제빙기 얼음 얼리는 속도가 현저히 느려져서 불렀는데, 130도 고온 스팀과 스케일 제거제로 냉판과 배관을 완전히 새것처럼 뚫어주셨습니다. 얼음 떨어지는 시간이 확 줄었네요. 카드결제 가능해서 더 편했습니다.',
    verified: true
  }
];

export const initialQuotes: QuoteRequest[] = [
  {
    id: 'Q-20261018-01',
    createdAt: '2026-10-18 14:22',
    customerName: '김민준',
    phone: '010-4821-9932',
    serviceType: '천장형 시스템 에어컨 4Way (3대)',
    units: 3,
    spaceType: '카페/식당',
    region: '전북 전주시 완산구 효자동',
    preferredDate: '2026-10-24 오전',
    notes: '영업 시작 전인 오전 8시~11시 사이에 작업 가능할까요?',
    status: '상담완료'
  },
  {
    id: 'Q-20261017-02',
    createdAt: '2026-10-17 19:05',
    customerName: '이지연',
    phone: '010-3321-7788',
    serviceType: '카페/업소용 제빙기 분해 살균 (1대)',
    units: 1,
    spaceType: '카페/식당',
    region: '전북 익산시 영등동',
    preferredDate: '2026-10-22 오후',
    notes: '호시자키 IM-100 모델입니다. 얼음 냄새 제거 부탁드립니다.',
    status: '예약확정'
  },
  {
    id: 'Q-20261019-03',
    createdAt: '2026-10-19 09:12',
    customerName: '황보건',
    phone: '010-9182-4451',
    serviceType: '스탠드 + 벽걸이 2in1 세트',
    units: 2,
    spaceType: '아파트/주택',
    region: '전북 군산시 수송동',
    preferredDate: '2026-10-25 주말',
    notes: '아이가 있어서 친환경 약품 꼭 사용 부탁드립니다. 현금영수증 요청합니다.',
    status: '신규접수'
  }
];
