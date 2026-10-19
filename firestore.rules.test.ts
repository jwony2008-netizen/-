/**
 * Firestore Security Rules Test Specification (Dirty Dozen Verification)
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const dirtyDozenTests: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated write to site_content/main',
    collection: 'site_content',
    docId: 'main',
    operation: 'create',
    auth: null,
    payload: { brandName: 'Hacked' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Shadow field injection on site_content/main',
    collection: 'site_content',
    docId: 'main',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { brandName: '도지클린시스템', ghostField: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Email spoofing with email_verified: false on admins',
    collection: 'admins',
    docId: 'spoofed_uid',
    operation: 'create',
    auth: { uid: 'spoofed_uid', email: 'jwony2008@gmail.com', email_verified: false },
    payload: { uid: 'spoofed_uid' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Identity spoofing where updatedBy != request.auth.uid',
    collection: 'portfolio_items',
    docId: 'case-1',
    operation: 'create',
    auth: { uid: 'user_a', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { id: 'case-1', updatedBy: 'user_b' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID poisoning with invalid characters',
    collection: 'portfolio_items',
    docId: 'bad$id!@#',
    operation: 'get',
    auth: null,
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Oversized string on heroTitle (> 300 chars)',
    collection: 'site_content',
    docId: 'main',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { heroTitle: 'A'.repeat(305) },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Value poisoning on update (number instead of string)',
    collection: 'site_content',
    docId: 'main',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { primaryColor: 99999 },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immortal field mutation (changing createdAt on update)',
    collection: 'portfolio_items',
    docId: 'case-1',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { createdAt: 'mutated' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Client forged timestamp (updatedAt != request.time)',
    collection: 'service_items',
    docId: 'ac-wall',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { updatedAt: '1999-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unbounded array injection on portfolioIds (> 50 items)',
    collection: 'site_content',
    docId: 'main',
    operation: 'update',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { portfolioIds: new Array(55).fill('case-1') },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Array element type poisoning on highlights[0]',
    collection: 'portfolio_items',
    docId: 'case-1',
    operation: 'create',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    payload: { highlights: [12345] },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized collection list query on portfolio_items',
    collection: 'portfolio_items',
    docId: '*',
    operation: 'list',
    auth: { uid: 'admin1', email: 'jwony2008@gmail.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
];
