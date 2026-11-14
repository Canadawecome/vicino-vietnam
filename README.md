# Vicino Vietnam

Website tiếng Ý cho concept du lịch bản địa, dùng tên thương hiệu tạm theo xác nhận của chủ dự án.

## Tạo bản riêng trên Vercel

1. Sau khi nhận lời mời GitHub, mở repo và chọn **Fork → Create fork** để có thể gửi Pull Request về sau. Nếu chỉ cần bản độc lập, chọn **Use this template → Create a new repository**. Giữ bản sao ở chế độ **Private**.
2. Trong tài khoản Vercel của bạn, mở [New Project](https://vercel.com/new) và import repo vừa tạo. Giữ thư mục gốc mặc định. Repo đã cấu hình lệnh build và thư mục đầu ra trong `vercel.json`.
3. Bấm **Deploy** và gửi link Vercel để xem thử. Các thay đổi trên nhánh chính của bản sao sẽ cập nhật project riêng của bạn. Nếu cần URL canonical của bản sao, đặt biến `SITE_URL` thành URL đầy đủ của project mới rồi deploy lại.

Website và trình lập lịch cơ bản chạy được với cấu hình mặc định. Phần giải thích bằng AI là tùy chọn và cần thông tin dịch vụ riêng.

## Chạy và triển khai

Yêu cầu Node.js 22 trở lên.

```sh
npm ci
npm run build
npm test
npm start
```

Xem http://127.0.0.1:4173/it/. Vercel chạy `npm run build`, xuất `dist/`.

## Các phần đã làm

- 18 trang HTML dựng sẵn: landing, trải nghiệm, lịch trình miền Bắc, quy trình, giới thiệu, liên hệ, trạng thái review, 5 trang thông tin/chính sách, credit ảnh, 3 bài hướng dẫn và trang mục lục, wizard.
- Thiết kế Lora + Manrope; nền giấy, xanh rêu; ảnh Việt Nam có nguồn, bản WebP theo kích thước; font lưu cục bộ.
- Bộ chọn sở thích; wizard 4 bước; kiểm tra số người; quay lại giữ lựa chọn; tải tóm tắt TXT; reset; bàn phím và reduced-motion.
- Metadata riêng, canonical, hreflang it/x-default, Open Graph, WebSite/WebPage/BreadcrumbList JSON-LD, robots và sitemap theo cấu hình.
- Menu mobile, FAQ native, 404, HTTPS qua Vercel và header bảo vệ cơ bản.

## Trạng thái xem thử

`site.config.json` có `preview: true`. Tất cả trang có `noindex,follow`; sitemap chưa đưa URL xem thử vào. Không thu thập tên/email/điện thoại, không gửi email/CRM/WhatsApp, không nhận tiền. Wizard xử lý trong RAM của trình duyệt, chỉ xuất file khi người dùng bấm tải. Không có tracking/cookie ứng dụng.

Chưa phải website bán tour đang hoạt động. Tên doanh nghiệp, đội ngũ, giấy phép, đối tác, giá, số WhatsApp, email và điều khoản thương mại chưa được xác minh. Các trang pháp lý mô tả bản demo; không phải bộ hợp đồng thương mại hoàn chỉnh.

## Trước khi mở bán và index

1. Xác nhận brand/domain, pháp nhân và thông tin người tổ chức, cung cấp ảnh team và tư liệu có quyền sử dụng.
2. Kết nối contact backend/CRM/email/WhatsApp thật; bổ sung thông báo xử lý dữ liệu và consent tương ứng; kiểm thử gửi nhận end-to-end. Trường email/whatsapp trong config hiện là chỗ giữ cấu hình, chưa có tích hợp.
3. Xác nhận hoạt động với nhà cung cấp, lịch trình và giá; thay nội dung trạng thái bằng thông tin đã kiểm chứng; duyệt tiếng Ý bản ngữ và điều kiện thương mại.
4. Đổi `url` thành tên miền chính thức; chuyển `preview` sang false sau khi các nội dung đã sẵn sàng. Kiểm tra lại cờ `noindex` riêng từng trang trong `build.mjs` trước khi quyết định công khai chúng.
5. Build và deploy lại. Khi preview=false, sitemap chỉ chứa trang không có cờ noindex riêng. Sau đó xác minh Search Console và gửi sitemap.

## Cấu trúc mã nguồn

- `build.mjs`: nội dung và templates, tạo trang/metadata/sitemap.
- `public/style.css`: responsive, thiết kế và motion.
- `public/app.js`: menu, lựa chọn, wizard và xuất tóm tắt an toàn bằng textContent.
- `public/images/credits.json` và `/it/crediti/`: nguồn và giấy phép ảnh.
- `test.mjs`: liên kết, metadata, ảnh, schema JSON và trạng thái robots.
- `vercel.json`: build, redirect root, security/cache headers.

## Kết quả kiểm tra

Không có dữ liệu Search Console, traffic, xếp hạng hoặc Core Web Vitals thực tế cho website mới này.

## Personalized order planner and optional AI

`/it/il-tuo-vietnam/` builds an itinerary locally from explicit preferences and the existing catalog. It preserves custom requests in a downloadable text plan. It is a recommendation tool, not a booking engine or a matching service. Guide/interpreter/host/date options are requests for later confirmation.

The optional server endpoint is `api/plan.js`, using the OpenAI-compatible chat completions API at `https://api.trouter.cloud/v1/chat/completions`. To activate, configure these **server-side Vercel Production environment variables**, then redeploy:

- `TROUTER_API_KEY`: project API key (never paste into chat, source or public files).
- `TROUTER_MODEL`: a model returned by the gateway `/models` endpoint (configured: `gpt-5.6-luna`).
- `PLANNER_AI_ENABLED`: `true`.

Without all three, GET `/api/plan` returns `available:false` and POST returns 503. The client keeps the working local plan. The AI action explicitly sends preferences to GPT-5.6 Luna via Trouter only after a separate button click; The gateway’s retention policy applies; no zero-retention guarantee is made. No user prompts are logged by application code or stored in a database.

Endpoint restrictions: allowed production/preview origins, POST JSON with a 12 KB application limit, fixed upstream URL, output limit, timeout, generic error responses and a best-effort in-memory limit of 5 requests / 10 minutes per hashed IP. The limiter is per function instance, not a global usage cap. Configure provider project budgets and Vercel edge rate limiting before exposing a funded AI service broadly.

Test the local recommendation logic and disabled endpoint: `node test-order.mjs`. Browser tests in QA cover generated plans, exclusions, family/adult state, stale plan invalidation and responsive layout. Actual model generation has not been tested without credentials.


## English / Italian
The header language control links between matching `/it/` and `/en/` pages, preserving query strings and anchors. `build-languages.mjs` uses the `translations.en.json` dictionary to generate English HTML and interactive script variants after the Italian build. Add translations when introducing copy; rerun `npm run build` and `npm test`. Internal form/filter values stay stable. The AI request sends the current document locale so English pages receive English responses. No API key or translation API call is needed during deployment builds.

### Interactive destination planner
The existing `/it/il-tuo-vietnam/` and `/en/il-tuo-vietnam/` routes include a destination map with 16 destinations and 80 editorial activity ideas. `map-builder.mjs` creates the shell; `public/map-data.js` contains bilingual content and verified local image/detail references; `public/journey-map.js` handles selection, wishlist, mobile navigation and consultation summary. Wishlist IDs persist in sessionStorage, without contact information. `public/map-plan.js` integrates validated IDs into browser and server plans, respecting exclusions and retaining unscheduled choices explicitly. Routes are indicative north-to-south outlines, not verified transport connections. Some ideas are alternatives within one visit, clearly labelled in the UI.

WhatsApp is intentionally deferred at the owner's request. With blank contact configuration, the consultation dialog only copies/downloads a summary and explicitly says nothing is sent. Configure `site.config.json` to activate the contact link later.

Map shape: Natural Earth 1:10m public-domain country geometry, simplified for destination navigation. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson ; terms: https://www.naturalearthdata.com/about/terms-of-use/ . The drawing is an exploration map, not a complete administrative/boundary map.

Validation: `node test-map.mjs`, `node test-order.mjs`, `npm test`. Browser checks cover IT desktop / EN mobile, all 5 activity cards, map selection, wishlist, route, consultation, generated plan and horizontal overflow. Motion respects prefers-reduced-motion.

Local-experience expansion (2026-10-27): research references in local-experience-sources.json and each new activity.source. Community encounters replace many attraction-only options; no partnership, bookability or named host availability is implied. New ideas without verified matching imagery use editorial type cards. Existing selection IDs were retained only for unchanged activities; replacement activities have new IDs. Hoàng Sa and Trường Sa inset sizes reduced to 56%.
