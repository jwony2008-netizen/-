# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Every path not explicitly matched is denied by `match /{document=**} { allow read, write: if false; }`.
2. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) enforces `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
3. **Zero Unprotected List Queries**: `allow list: if false;` is enforced across all collections; public visitors read known document IDs (`site_content/main`, `service_items/{id}`, `portfolio_items/{id}`) via `get`.
4. **Strict Validation Blueprints & Shadow-Key Prevention**: Every `create` and `update` must pass `isValidSiteContent(incoming())`, `isValidServiceItem(incoming())`, or `isValidPortfolioItem(incoming())` enforcing `keys().hasAll(...)` and `keys().hasOnly(...)`.
5. **Identity & Temporal Integrity**:
   - Every write enforces `incoming().updatedBy == request.auth.uid`.
   - Every `create` enforces `incoming().createdAt == request.time && incoming().updatedAt == request.time`.
   - Every `update` enforces `incoming().createdAt == existing().createdAt && incoming().updatedAt == request.time`.
6. **Email Verification & Admin RBAC**:
   - `isAdmin()` checks `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or `(request.auth.token.email == 'jwony2008@gmail.com' && request.auth.token.email_verified == true)`.
   - Unverified email tokens cannot spoof admin privileges.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Unauthenticated Write to `site_content/main`)**:
   ```json
   { "brandName": "Hacked", "updatedBy": "anon" }
   ```
2. **Payload 2 (Shadow Field Injection on `site_content/main`)**:
   ```json
   { "brandName": "도지클린시스템", "isSuperAdmin": true }
   ```
3. **Payload 3 (Email Spoofing with `email_verified: false` on `/admins/{uid}`)**:
   ```json
   { "uid": "attacker-uid", "createdAt": "SERVER_TIMESTAMP" }
   ```
4. **Payload 4 (Identity Spoofing: `updatedBy != request.auth.uid` on `portfolio_items/case-1`)**:
   ```json
   { "id": "case-1", "updatedBy": "other-admin-uid" }
   ```
5. **Payload 5 (ID Poisoning: 200-char or special-char document ID)**:
   Path: `/portfolio_items/invalid$id!@#`
6. **Payload 6 (Denial of Wallet: Oversized `heroTitle` > 300 chars)**:
   ```json
   { "heroTitle": "A... (500 chars)" }
   ```
7. **Payload 7 (Value Poisoning on Update: `primaryColor` as number instead of string)**:
   ```json
   { "primaryColor": 12345 }
   ```
8. **Payload 8 (Immortal Field Mutation: modifying `createdAt` during update)**:
   ```json
   { "createdAt": "2099-01-01T00:00:00Z" }
   ```
9. **Payload 9 (Client Forged Timestamp: `updatedAt != request.time`)**:
   ```json
   { "updatedAt": "2020-01-01T00:00:00Z" }
   ```
10. **Payload 10 (Unbounded Array Injection: `portfolioIds` with 100 items > max 50)**:
    ```json
    { "portfolioIds": ["id1", "...100 items"] }
    ```
11. **Payload 11 (Array Element Type Poisoning: `highlights[0]` is a number)**:
    ```json
    { "highlights": [12345] }
    ```
12. **Payload 12 (Unauthorized Collection Scraping via `list` query on `portfolio_items`)**:
    Operation: `list` on `/portfolio_items` -> Rejected (`allow list: if false;`).
