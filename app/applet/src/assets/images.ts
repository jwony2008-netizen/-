import youngKoreanTechHero from './images/young_korean_tech_hero_1792405760085.jpg';
import acCleaningDetail from './images/ac_cleaning_detail_1792396307135.jpg';
import icemakerCleaningDetail from './images/icemaker_cleaning_detail_1792396307580.jpg';
import technicianPortrait from './images/technician_team_portrait_1792396308618.jpg';
import dogeHomeCareLogo from './images/doge_home_care_logo_1792415686592.jpg';
import acBeforeMold from './images/ac_before_mold_1792415717821.jpg';
import acAfterClean from './images/ac_after_clean_1792415732361.jpg';
import icemakerBeforeScale from './images/icemaker_before_scale_1792415749041.jpg';
import icemakerAfterClean from './images/icemaker_after_clean_1792415768911.jpg';

export const IMAGES = {
  hero: youngKoreanTechHero || '/images/hero.jpg',
  acDetail: acCleaningDetail || '/images/ac_detail.jpg',
  icemakerDetail: icemakerCleaningDetail || '/images/icemaker_detail.jpg',
  technicianPortrait: technicianPortrait || '/images/technician.jpg',
  logo: dogeHomeCareLogo || '/images/logo.png',
  acBefore: acBeforeMold,
  acAfter: acAfterClean,
  icemakerBefore: icemakerBeforeScale,
  icemakerAfter: icemakerAfterClean,
};
