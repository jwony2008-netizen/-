export interface SiteConfig {
  brandName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryPhone: string;
  secondaryPhone: string;
  kakaoUrl: string;
  daangnUrl: string;
  naverBlogUrl: string;
  instagramUrl?: string;
  operatingHours: string;
  companyAddress: string;
  ceoName: string;
  businessNumber: string;
  primaryColor: string;
  fontMode: 'pretendard' | 'serif' | 'clean';
  seoTitle: string;
  seoDescription: string;
  formspreeEndpoint?: string;
  adminPassword?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: '에어컨 정밀세척' | '업소용 제빙기' | '시스템/기업' | '가정용 토탈케어';
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  highlights: string[];
  date: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  category: 'aircon' | 'icemaker';
  tag: string;
  target: string;
  duration: string;
  priceStart: string;
  summary: string;
  features: string[];
  recommendedPeriod: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  serviceType: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  serviceType: string;
  units: number;
  spaceType: string;
  region: string;
  preferredDate: string;
  notes: string;
  status: '신규접수' | '상담완료' | '예약확정' | '시공완료';
}
