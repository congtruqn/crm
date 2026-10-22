# Hướng dẫn tạo Nội dung Bài Viết (News Content) & Sản phẩm

Khi người dùng yêu cầu tạo bài viết hoặc sản phẩm, tuân theo hướng dẫn chi tiết dưới đây để đảm bảo chất lượng và định dạng HTML chuẩn (dùng inline style, không dùng class/CSS ngoài).

## 0. KHUNG HTML CHUNG

Nội dung trả về cho field `content` là HTML thuần, bọc trong `<div>`, dùng **inline style**, font chính `'Source Sans 3', sans-serif`, heading `'Merriweather'` (nếu cần). Màu chủ đạo theo thương hiệu (ví dụ xanh lá `#5a9620` / `#80c241` — có thể đổi theo yêu cầu khách hàng), text `#2d2d2d` / `#444` / `#555`.

Có 2 dạng khung tùy loại bài:

### Dạng A — Có đầy đủ Header/TOC/CTA (dùng cho bài so sánh, bài PR, landing-style)
```
<div style="font-family:'Source Sans 3',sans-serif;...">
  <div><!-- Header: gradient background, phụ đề, H1, meta info --></div>
  <div><!-- Nội dung: mở đầu, mục lục, các section, FAQ, kết luận, CTA --></div>
  <div><!-- Footer: disclaimer nhỏ --></div>
</div>
```

### Dạng B — Chỉ phần nội dung thuần (dùng khi nhúng vào page đã có layout/header riêng)
```
<div>
  <div>
    <!-- MỞ ĐẦU: 2 đoạn p -->
    <hr>
    <!-- Section 1, 2, 3... mỗi section id="slug-section" -->
    <!-- FAQ -->
    <!-- KẾT LUẬN -->
  </div>
</div>
```
Dạng B **không có** mục lục, header gradient, hay CTA — nội dung đi thẳng vào vấn đề. Phù hợp khi field `content` sẽ được chèn vào template CMS đã có sẵn tiêu đề/khung trang.

**Mặc định dùng Dạng B** trừ khi người dùng yêu cầu rõ "có banner/CTA/mục lục".

---

## 1. CÁC DẠNG BÀI VIẾT

### Dạng 1: SO SÁNH (A vs B)
**Mục đích**: Giúp người dùng hiểu tại sao lựa chọn A tốt/phổ biến hơn B, hoặc khi nào dùng A/B.

**Cấu trúc section**:
1. Tổng quan thị trường / xu hướng dịch chuyển
2. Bảng so sánh trực tiếp (6–9 tiêu chí: vật liệu, độ bền, giá, tuổi thọ, thoáng khí...)
3. Lý do 1 — thường là **sức khỏe/trải nghiệm người dùng**
4. Lý do 2 — thường là **điều kiện môi trường/khí hậu/thói quen sử dụng**
5. Lý do 3 — **chi phí dài hạn** (kèm bảng tính chi phí vòng đời 10 năm)
6. Lý do 4 — **thị trường, giá cả, xu hướng cung-cầu**
7. Khi nào chọn A, khi nào vẫn nên chọn B (khuyến nghị theo từng hoàn cảnh cụ thể, dùng `<strong>tình huống:</strong> giải thích`)
8. FAQ (5–6 câu)
9. Kết luận (3 đoạn: nền tảng xu hướng → B không biến mất, chỉ thu hẹp phân khúc → lời khuyên đầu tư đúng chất lượng)
10. *(tùy chọn)* CTA liên hệ tư vấn

### Dạng 2: GIẢI THÍCH CHUYÊN SÂU / ĐỊNH NGHĨA ("X là gì?")
**Mục đích**: Giáo dục người dùng về 1 khái niệm/vật liệu/sản phẩm, giải quyết sự nhầm lẫn thuật ngữ.

**Cấu trúc section** (theo mẫu `nệm foam là gì`):
1. **Định nghĩa + lịch sử phát triển** của khái niệm chính, kèm 1 h3 phân biệt với khái niệm dễ nhầm lẫn
2. **Phân loại** — liệt kê 3–4 loại con bằng h3 riêng, mỗi loại: đặc điểm, ưu/nhược điểm ngắn, "thường được gọi là..." (gắn với cách gọi dân gian). Kết bằng bảng so sánh nhanh các loại (4–5 cột: đàn hồi, thoáng khí, tuổi thọ, giá)
3. **Cấu tạo/cấu trúc bên trong** — dùng khối "card" viền trái màu nhấn (`border-left:3px solid`) cho mỗi lớp/thành phần, kết bằng hộp lưu ý kỹ thuật quan trọng (nền nhạt màu nhấn)
4. **Ưu điểm & nhược điểm** — 2 h3 con, mỗi bên 4–5 đoạn `<strong>tên ưu/nhược điểm:</strong> giải thích`
5. **So sánh với các lựa chọn khác trên thị trường** — bảng nhiều cột (4+ sản phẩm/giải pháp) theo cùng bộ tiêu chí
6. **Hướng dẫn chọn/sử dụng phù hợp** — chia theo tiêu chí cá nhân hóa: tư thế ngủ/mục đích dùng, cân nặng/đặc điểm người dùng, điều kiện môi trường, ngân sách (mỗi mức ngân sách 1 đoạn `<strong>mức giá:</strong> gợi ý cụ thể`)
7. **Hướng dẫn bảo quản/sử dụng đúng cách** — 5 đoạn `<strong>nguyên tắc:</strong> giải thích ngắn`
8. FAQ (4–5 câu, ưu tiên câu hỏi thực dụng: "có tốt cho X không", "có an toàn/dị ứng không", "bao nhiêu là đủ", "X hay Y tốt hơn")
9. Kết luận (3 đoạn: khái niệm là một "họ" đa dạng không phải 1 sản phẩm → câu hỏi đúng cần hỏi là gì, không phải "tốt hay không" → đây là khoản đầu tư sức khỏe/dài hạn)

Dạng 2 **không cần bảng chi phí vòng đời** như Dạng 1, vì trọng tâm là giáo dục kiến thức, không phải thúc đẩy quyết định chuyển đổi.

---

## 2. HƯỚNG DẪN VIẾT NỘI DUNG CHI TIẾT

### A. Tone & Style
- Lịch sự, chuyên gia, dễ tiếp cận — không hàn lâm quá mức
- Câu ngắn (dưới 20 chữ), mỗi paragraph 3–5 câu
- Dùng `<strong>` cho thuật ngữ/ý chính mở đầu đoạn, `<em>` cho nhấn nhẹ hoặc trích dẫn ý nghĩ người dùng

### B. Cấu trúc Paragraph
- Câu mở: nêu ý chính (topic sentence)
- Câu giữa: 2–3 chi tiết hỗ trợ (ví dụ, số liệu, lý do)
- Câu kết: liên kết sang ý tiếp theo

### C. Dữ liệu & con số
- Luôn có ngữ cảnh nguồn: "Theo khảo sát thị trường gần đây", "Theo chuyên gia/bác sĩ..."
- Dùng khoảng số thay vì số tuyệt đối khi không chắc chắn (VD: "5–8 năm")
- Dùng bảng khi so sánh ≥ 3 tiêu chí hoặc ≥ 2 đối tượng

### D. Heading
- h2: tiêu đề section, có số thứ tự, border-bottom màu nhấn
- h3: mệnh đề ngắn + từ khóa chính, border-left màu nhấn, KHÔNG viết mơ hồ (tránh "Giới thiệu về...")

### E. Khối nhấn (callout box)
Dùng cho số liệu quan trọng, lưu ý kỹ thuật, hoặc khuyến nghị chuyên gia — nền nhạt màu nhấn + border-left 4px màu nhấn đậm hơn.

---

## 3. HƯỚNG DẪN TẠO SẢN PHẨM (Product Content)

Khi tạo nội dung sản phẩm (field `content` của `create_product`), áp dụng cấu trúc tương tự Dạng 2 nhưng tập trung vào 1 sản phẩm cụ thể:

1. **Tóm tắt ngắn gọn** (50–100 chữ): lợi ích chính, đối tượng phù hợp, 2–3 điểm nổi bật
2. **Đặc tính kỹ thuật** — bảng 8–12 thông số (vật liệu, kích thước, độ cứng, tuổi thọ, bảo hành...)
3. **Lợi ích & tính năng** — 4–5 h3, mỗi h3 `<strong>tên lợi ích:</strong> giải thích tại sao quan trọng`
4. **Ai nên mua sản phẩm này** — 4–5 đối tượng lý tưởng, mỗi đối tượng 1 đoạn giải thích lý do phù hợp
5. **So sánh với sản phẩm/giải pháp tương tự** — bảng, tô đậm điểm mạnh của sản phẩm đang bán
6. **Hướng dẫn bảo quản/sử dụng**
7. FAQ đặc thù sản phẩm (mùi, bảo hành, dị ứng, kích thước...)
8. *(tùy chọn)* CTA mua ngay / tư vấn

---

## 4. KIỂM TRA CHẤT LƯỢNG TRƯỚC KHI GỬI

- [ ] Chọn đúng Dạng A (đầy đủ khung) hoặc Dạng B (chỉ nội dung) theo yêu cầu người dùng
- [ ] Chọn đúng kiểu bài: So sánh (Dạng 1) hay Giải thích/Định nghĩa (Dạng 2)
- [ ] Mở đầu 2 đoạn, đúng cỡ chữ/line-height như mẫu (16px/1.95 rồi 15px/1.9)
- [ ] Mỗi h2 có số thứ tự + border-bottom màu nhấn, id slug tiếng Việt không dấu
- [ ] Có ít nhất 1 bảng so sánh với inline style đầy đủ (header nền màu nhấn, chữ trắng)
- [ ] Có FAQ dạng box (nền nhạt header + nền trắng nội dung)
- [ ] Kết luận 3 đoạn theo đúng mạch: nền tảng → hai lựa chọn cùng tồn tại → lời khuyên đầu tư đúng
- [ ] Không spam từ khóa, không lặp câu
- [ ] seourl/seo_url: chữ thường, không dấu, nối bằng `-`

---

## 5. VÍ DỤ THAM KHẢO ĐÃ CÓ

- **Dạng 1 (So sánh)**: "Vì Sao Nệm Cao Su Non Ngày Càng Phổ Biến Hơn Nệm Bông Ép Tại Việt Nam?" — có đủ Header/TOC/CTA (Dạng A)
- **Dạng 2 (Giải thích/Định nghĩa)**: "Nệm Foam Là Gì?" — chỉ có phần nội dung thuần (Dạng B), không TOC/CTA/Header

AI nên hỏi lại người dùng muốn bài theo dạng nào (so sánh hay giải thích) và có cần Header/CTA đầy đủ hay chỉ nội dung thuần, nếu ngữ cảnh chưa rõ.
