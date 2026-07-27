# Cross-Platform Theme Regressions Design

## Mục tiêu

Sửa ba lỗi hồi quy trong `AI-Theme-Custom.user.js` mà không thay đổi mô hình dữ liệu theme hay các tính năng ngoài phạm vi:

1. Chuỗi tiếng Việt và emoji hiển thị sai do mojibake.
2. Theme nền ô nhập ChatGPT phủ lên toàn bộ composer thay vì đúng bề mặt nhập liệu.
3. Nút bảng màu `AI Theme Custom` không xuất hiện ổn định trong composer Gemini.

## Bằng chứng và nguyên nhân gốc

### Mojibake

File userscript đang là UTF-8 hợp lệ nhưng chứa các literal đã bị giải mã sai rồi ghi trở lại source, ví dụ `Theme Ä‘ang Ã¡p dá»¥ng`. Vì dữ liệu sai đã nằm trong chuỗi JavaScript, đổi font hoặc khai báo charset không thể khắc phục.

Các dấu hiệu tương tự cũng xuất hiện trong `README.md` và một số assertion của test. Chúng cần được sửa cùng source để tài liệu và regression test không hợp thức hóa dữ liệu hỏng.

### Composer ChatGPT

CSS hiện tại áp dụng `background-color` cho danh sách selector quá rộng gồm `form`, mọi `[contenteditable="true"]` và mọi `textarea`. Trên ChatGPT, `form` bao phủ cả composer nên màu nền bị kéo thành một dải lớn. Cách này cũng có thể tô nhầm editor của UI do userscript tạo.

`AI-UX-Customizer` dùng hai target riêng:

- Bề mặt composer: `form[data-type="unified-composer"] div[style*="border-radius"]`
- Trường nhập: `div.ProseMirror#prompt-textarea`

### Nút Gemini

Điểm gắn hiện tại vẫn đúng với DOM Gemini ngày 2026-07-27:
`input-area-v2 .trailing-actions-wrapper`.

Lỗi nằm ở vòng đời DOM. Script chạy ở `document-start`, nhưng phát hiện hiện tại có thể bỏ lỡ `input-area-v2` nếu sự kiện animation xảy ra trước khi listener được đăng ký hoặc khi Angular thay toàn bộ input root. Các test hiện tại chỉ chứng minh hàm placement hoạt động khi anchor đã có sẵn.

## Thiết kế được chọn

### 1. Khôi phục văn bản UTF-8

- Thay các literal mojibake trong userscript bằng Unicode đúng.
- Sửa các chuỗi tương ứng trong regression test và README.
- Thêm kiểm tra source không còn các marker mojibake đã biết.
- Giữ file ở UTF-8 và không thêm bước chuyển đổi encoding lúc runtime.

### 2. Tách selector input theo nền tảng

Thêm một helper trả về contract selector theo `CURRENT_PLATFORM`:

| Nền tảng | Background target | Text target |
| --- | --- | --- |
| ChatGPT | `form[data-type="unified-composer"] div[style*="border-radius"]` | `div.ProseMirror#prompt-textarea` |
| Gemini | `input-area-v2` | `rich-textarea .ql-editor` |

Khi theme có màu nền:

- Áp màu lên background target.
- Đặt background của text target thành `transparent` để lộ màu của vỏ, giống kiến trúc tham chiếu.

Khi theme có màu chữ:

- Chỉ áp lên text target của nền tảng hiện tại.

Không dùng selector toàn cục `form`, `[contenteditable]` hoặc `textarea`.

### 3. Làm vòng đời nút Gemini có khả năng tự phục hồi

Giữ cơ chế event-driven và không quay lại polling định kỳ:

1. Đăng ký listener sentinel trước khi chèn rule animation.
2. Sau khi sentinel được khởi tạo, quét các message/input root đã tồn tại.
3. Khi một input root mới xuất hiện, gắn `MutationObserver` vào root đó và lên lịch placement bằng `requestAnimationFrame`.
4. Nếu Angular thay input root, chuyển observer sang root mới.
5. Placement vẫn idempotent: chỉ có một nút và nút phải là con trực tiếp của `.trailing-actions-wrapper`.

ChatGPT tiếp tục dùng anchor trailing hiện tại và fallback nổi chỉ khi composer chưa tồn tại.

## Kiểm thử

Thực hiện theo red-green:

1. Test encoding thất bại khi userscript, test fixture hoặc README chứa marker mojibake.
2. Test CSS thất bại nếu input theme còn dùng selector toàn cục; đồng thời xác nhận đúng selector ChatGPT/Gemini và editor trong suốt.
3. Test lifecycle thất bại khi input Gemini xuất hiện sau init hoặc khi toàn bộ `input-area-v2` bị thay.
4. Chạy toàn bộ suite bằng Node với test isolation tắt do sandbox Windows không cho test runner spawn tiến trình con.
5. Chạy kiểm tra cú pháp userscript và `git diff --check`.
6. Đối chiếu selector với DOM Gemini thật; nếu phiên browser không chạy Tampermonkey, báo rõ giới hạn và không tuyên bố đã kiểm chứng trực quan userscript trong trình duyệt đó.

## Ngoài phạm vi

- Không chép toàn bộ engine 800 KB của `AI-UX-Customizer`.
- Không thay schema config hoặc preset.
- Không sửa `AI-Prompt-Deck.user.js`.
- Không thêm polling hoặc interval nền.
- Không commit các thay đổi đang có ngoài file spec trong commit thiết kế.
