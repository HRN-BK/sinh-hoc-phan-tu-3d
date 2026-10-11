// Bài 5: Thí nghiệm Meselson–Stahl (1958)
import { progress, labels, arrow, ease, lerp, clamp } from './_kit.js';

const H = 0x3d5afe, L = 0xffa94d, HYB = 0xb07cc6;
// vị trí vạch trong ống (gradient CsCl: đáy đặc hơn). Mạch đơn đặc hơn mạch kép.
const Y = { LL: 0.9, HL: 0, HH: -0.9, sL: -1.05, sH: -1.6, sMid: -1.32, disp2: 0.45 };

export default {
  title: 'Thí nghiệm Meselson–Stahl',
  sub: 'Năm 1958: dùng nitơ nặng ¹⁵N và ly tâm trong gradient CsCl để chứng minh DNA sao chép theo kiểu bán bảo toàn. Mỗi phân tử con giữ 1 mạch cũ và có 1 mạch mới.',
  legend: '<span><i style="background:#3d5afe"></i>mạch nặng ¹⁵N (cũ)</span><span><i style="background:#ffa94d"></i>mạch nhẹ ¹⁴N (mới)</span><span><i style="background:#b07cc6"></i>vạch lai ¹⁵N/¹⁴N</span>',

  why: `<p>Watson & Crick (1953) đưa ra mô hình xoắn kép và gợi ý: hai mạch tách ra, <b>mỗi mạch làm khuôn</b> cho một mạch mới. Nhưng đó mới là giả thuyết. Lúc ấy có <b>3 khả năng</b>:</p>
  <ul><li><b>Bảo toàn</b>: phân tử mẹ giữ nguyên, tạo ra một phân tử con hoàn toàn mới.</li>
  <li><b>Bán bảo toàn</b>: mỗi phân tử con gồm <b>1 mạch cũ + 1 mạch mới</b>.</li>
  <li><b>Phân tán</b>: mạch cũ bị cắt vụn, trộn lẫn với đoạn mới trên cả 2 mạch.</li></ul>
  <p>Meselson và Stahl cần một cách <b>phân biệt DNA cũ với DNA mới</b>. Họ đánh dấu DNA cũ bằng đồng vị <b>¹⁵N</b> (nặng hơn), rồi tách DNA theo <b>tỷ trọng</b> bằng ly tâm. Thí nghiệm gọn và rõ đến mức được gọi là "thí nghiệm đẹp nhất trong sinh học".</p>`,

  without: `<ul>
  <li><b>Nếu DNA sao chép kiểu bảo toàn</b>: tế bào con sẽ có một phân tử toàn mạch mới, không có mạch cũ đối chiếu. Hệ <b>sửa bắt cặp sai</b> (MMR) dựa vào việc phân biệt <b>mạch cũ</b> (đã methyl hóa GATC) với <b>mạch mới</b> (chưa methyl hóa) sẽ không hoạt động được.</li>
  <li><b>Nếu sao chép kiểu phân tán</b>: mỗi mạch là "chắp vá" cũ–mới, phải cắt và nối liên tục, rất dễ sai và đứt gãy.</li>
  <li><b>Nếu không có ¹⁵N và ly tâm tỷ trọng</b>: DNA cũ và mới giống hệt nhau về hóa học, không cách nào "nhìn" ra mạch nào cũ, mạch nào mới.</li>
  <li><b>Hệ quả của bán bảo toàn</b>: mạch cũ làm khuôn cho mạch mới. Đó là lý do DNA polymerase luôn cần <b>khuôn</b> và <b>mồi</b> (bài 6), và mỗi tế bào con nhận đúng 1 bản sao thông tin.</li></ul>`,

  foundation: [
    { q: 'Đồng vị là gì? ¹⁵N khác ¹⁴N ở đâu?', a: 'Đồng vị là các dạng của cùng một nguyên tố, có cùng số proton nhưng khác số <b>neutron</b>.<br>• <b>¹⁴N</b>: 7 proton + 7 neutron, dạng phổ biến (~99,6%).<br>• <b>¹⁵N</b>: 7 proton + 8 neutron, <b>nặng hơn</b>.<br>Cả hai đều <b>không phóng xạ</b> và có <b>hóa tính như nhau</b>, nên vi khuẩn dùng ¹⁵N bình thường. Chỉ khác ở khối lượng.' },
    { q: 'Vì sao đánh dấu bằng nitơ mà không phải nguyên tố khác?', a: 'Nitơ có nhiều trong <b>base</b> của DNA (mỗi base có 2–5 nguyên tử N). Vi khuẩn lấy N từ môi trường (muối <b>NH₄Cl</b>) để tổng hợp nucleotide. Vì vậy nuôi trong ¹⁵NH₄Cl đủ lâu thì <b>gần như mọi N trong DNA đều là ¹⁵N</b>, và DNA đặc hơn rõ rệt.<br>(Hershey–Chase trước đó đã dùng ³²P để đánh dấu DNA, ³⁵S để đánh dấu protein.)' },
    { q: 'Tỷ trọng (density) là gì?', a: 'Là <b>khối lượng trên một đơn vị thể tích</b> (g/mL). DNA ¹⁵N có cùng thể tích nhưng nặng hơn, nên <b>tỷ trọng cao hơn</b>:<br>• DNA ¹⁴N: ~1,710 g/mL<br>• DNA lai: ~1,717 g/mL<br>• DNA ¹⁵N: ~1,724 g/mL<br>Chênh lệch chỉ khoảng 1%, nhưng ly tâm gradient CsCl phân biệt được.' },
    { q: 'Ly tâm gradient tỷ trọng CsCl hoạt động thế nào?', a: 'Cho dung dịch <b>CsCl</b> (muối rất nặng) cùng DNA vào ống, rồi quay rất nhanh trong nhiều giờ. Lực ly tâm kéo ion Cs⁺ xuống, tạo một <b>gradient</b>: đáy ống đặc hơn, miệng ống loãng hơn.<br>Mỗi phân tử DNA chìm hoặc nổi đến đúng chỗ có <b>tỷ trọng bằng tỷ trọng của chính nó</b> thì dừng lại (cân bằng, gọi là <b>isopycnic</b>). DNA nặng dừng thấp hơn, DNA nhẹ dừng cao hơn.' },
    { q: 'Làm sao thấy được vạch DNA trong ống?', a: 'Meselson–Stahl chụp ảnh ống bằng <b>tia UV 260 nm</b>. DNA hấp thụ UV (nhờ base, xem bài 4) nên hiện thành <b>vạch tối</b> trên phim. Độ đậm của vạch cho biết lượng DNA ở đó.' },
    { q: 'Một "thế hệ" ở đây là gì?', a: 'Là một lần vi khuẩn <b>phân đôi</b>, tức DNA được <b>sao chép đúng 1 lần</b>. Sau khi chuyển sang ¹⁴N, họ lấy mẫu ở thế hệ 0, 1, 2, 3, 4… và ly tâm DNA của từng mẫu.' },
    { q: 'Vì sao cần nuôi ở ¹⁵N "nhiều thế hệ" trước?', a: 'Để <b>cả 2 mạch</b> của mọi phân tử DNA đều nặng (¹⁵N/¹⁵N). Khi đó điểm xuất phát rõ ràng: thế hệ 0 chỉ có <b>1 vạch nặng</b>.' },
  ],

  steps: [
    { title: '3 giả thuyết về cách DNA sao chép', text: 'Mỗi cột cho thấy DNA mẹ (xanh đậm = mạch cũ) sinh ra thế hệ 1 rồi thế hệ 2 (cam = mạch mới):<br>• <b>Bảo toàn</b>: phân tử mẹ còn nguyên 2 mạch cũ. Phân tử con toàn mạch mới.<br>• <b>Bán bảo toàn</b>: mỗi phân tử con có <b>1 mạch cũ + 1 mạch mới</b>.<br>• <b>Phân tán</b>: mạch cũ bị chia nhỏ, xen kẽ với đoạn mới trên cả 2 mạch.<br>Câu hỏi: làm sao <b>phân biệt</b> mạch cũ với mạch mới?' },
    { title: 'Đánh dấu DNA cũ bằng ¹⁵N', text: 'Nuôi <i>E. coli</i> <b>nhiều thế hệ</b> trong môi trường chỉ có nguồn nitơ là <b>¹⁵NH₄Cl</b>. Vi khuẩn dùng ¹⁵N để làm base mới, nên DNA dần chuyển sang <b>nặng</b> (vòng DNA đổi sang xanh đậm).<br>Sau đó chuyển vi khuẩn sang môi trường <b>¹⁴N</b> (nhẹ). Từ lúc này, mọi mạch <b>mới</b> tổng hợp đều nhẹ, mạch <b>cũ</b> vẫn nặng.' },
    { title: 'Ly tâm trong gradient CsCl', text: 'DNA được trộn với dung dịch CsCl và ly tâm siêu tốc (~45 000 vòng/phút, khoảng 20 giờ).<br>• Cs⁺ bị kéo xuống, tạo <b>gradient tỷ trọng</b>: đáy đặc, miệng loãng.<br>• Mỗi DNA di chuyển đến đúng chỗ có tỷ trọng <b>bằng chính nó</b> rồi đứng yên.<br>Ống thử với hỗn hợp DNA ¹⁵N + DNA ¹⁴N: 2 vạch tách rời, <b>nặng ở dưới, nhẹ ở trên</b>.<br>⚠️ CsCl tách theo <b>tỷ trọng</b>, không phải theo kích thước.' },
    { title: 'Thế hệ 0: chỉ có 1 vạch nặng', text: 'DNA lấy ngay trước khi chuyển sang ¹⁴N: cả 2 mạch đều ¹⁵N, nên chỉ có <b>1 vạch nặng</b> (¹⁵N/¹⁵N, ~1,724 g/mL).<br>Đây là mốc xuất phát để so sánh.' },
    { title: 'Thế hệ 1: 1 vạch LAI → loại "bảo toàn"', text: 'Sau đúng 1 lần nhân đôi trong ¹⁴N: chỉ có <b>1 vạch ở giữa</b> (lai ¹⁵N/¹⁴N, ~1,717 g/mL). Không có vạch nặng, không có vạch nhẹ.<br>So với dự đoán (3 ống nhỏ bên phải):<br>• <b>Bảo toàn</b> dự đoán <b>2 vạch</b> (nặng + nhẹ) ✗ → <b>bị loại</b>.<br>• <b>Bán bảo toàn</b>: 1 vạch lai ✓.<br>• <b>Phân tán</b>: cũng 1 vạch lai, nên <b>chưa loại được</b>.' },
    { title: 'Thế hệ 2: vạch lai + vạch nhẹ → loại "phân tán"', text: 'Sau 2 lần nhân đôi: <b>2 vạch bằng nhau</b>, một vạch <b>lai</b> và một vạch <b>nhẹ</b> (tỉ lệ 1 : 1).<br>• <b>Bán bảo toàn</b> ✓: 2 mạch cũ nằm trong 2 phân tử lai, 2 phân tử còn lại toàn mạch mới.<br>• <b>Phân tán</b> ✗: dự đoán chỉ <b>1 vạch</b> nằm giữa vạch lai và vạch nhẹ (¼ nặng), rồi nhẹ dần qua mỗi thế hệ.<br>• <b>Bảo toàn</b> ✗: đã bị loại (dự đoán ¼ nặng + ¾ nhẹ).<br>Kết luận: DNA sao chép theo kiểu <b>bán bảo toàn</b>.' },
    { title: 'Kiểm tra thêm: đun nóng DNA thế hệ 1', text: 'Bật <b>🔥 Đun nóng</b>: DNA lai bị <b>biến tính</b> thành mạch đơn (bài 4). Meselson–Stahl đã làm đúng phép thử này.<br>• Kết quả: <b>2 vạch mạch đơn</b>, một nặng (¹⁵N) và một nhẹ (¹⁴N). Như vậy mỗi mạch là nguyên khối cũ hoặc nguyên khối mới.<br>• <b>Phân tán</b> dự đoán chỉ <b>1 vạch</b> mạch đơn lưng chừng (mỗi mạch nửa cũ nửa mới) ✗.<br>(Mạch đơn đặc hơn mạch kép nên các vạch nằm thấp hơn. Khoảng cách trên hình không theo đúng tỉ lệ.)' },
    { title: 'Tổng quát: sau n thế hệ', text: 'Kéo thanh <b>Thế hệ</b>. Theo bán bảo toàn:<br>• 2 mạch cũ ban đầu <b>không bao giờ mất</b>, luôn nằm trong đúng <b>2 phân tử lai</b>.<br>• Sau n thế hệ có <b>2ⁿ</b> phân tử, nên tỉ lệ lai = <b>2 / 2ⁿ</b>, còn lại toàn nhẹ.<br>Ví dụ: thế hệ 3 có 8 phân tử, gồm 2 lai và 6 nhẹ (lai : nhẹ = 1 : 3).<br>Vạch lai <b>không biến mất</b>, chỉ <b>mờ dần</b>. Vạch nặng không bao giờ xuất hiện lại.' },
  ],

  application: `<ul>
  <li><b>Nền tảng của sửa bắt cặp sai (MMR)</b>: vì sao chép bán bảo toàn, ngay sau khi sao chép DNA ở trạng thái <b>bán methyl hóa</b>: mạch cũ có methyl ở GATC (do Dam), mạch mới chưa có. Hệ MutS/MutL/MutH dựa vào đó để biết mạch nào mới và chỉ sửa mạch mới (bài 15).</li>
  <li><b>Kiểm soát khởi đầu sao chép</b>: SeqA bám vào oriC đang bán methyl hóa để chặn khởi đầu lại quá sớm. Nhờ vậy mỗi chu kỳ chỉ sao chép 1 lần (bài 7).</li>
  <li><b>Di truyền biểu sinh</b>: dấu methyl CpG được "chép" sang mạch mới nhờ DNMT1 nhận ra DNA bán methyl hóa (bài 14). Cơ chế này chỉ có được vì sao chép bán bảo toàn.</li>
  <li><b>Kỹ thuật ly tâm tỷ trọng</b> vẫn dùng đến nay:<br>• tách DNA plasmid khỏi DNA nhiễm sắc thể (CsCl + ethidium bromide);<br>• tách DNA theo %GC (DNA giàu GC đặc hơn);<br>• <b>DNA-SIP</b> (stable isotope probing): cho vi khuẩn đất ăn chất có ¹³C, rồi tách DNA nặng để biết <b>loài nào đã ăn</b> chất đó.</li>
  <li><b>Đồng vị bền</b> (¹⁵N, ¹³C, ²H) dùng rộng rãi trong <b>proteomics</b> (SILAC) và nghiên cứu chuyển hóa, vì an toàn, không phóng xạ.</li></ul>`,

  distinguish: `<h3>3 giả thuyết và dự đoán từng thế hệ</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Giả thuyết</th><th>Mô tả</th><th>Thế hệ 1</th><th>Thế hệ 2</th><th>Đun nóng thế hệ 1</th></tr>
  <tr><td><b>Bảo toàn</b></td><td>Mẹ giữ nguyên 2 mạch cũ, con toàn mạch mới</td><td>2 vạch: nặng + nhẹ ✗</td><td>¼ nặng + ¾ nhẹ ✗</td><td>2 vạch mạch đơn</td></tr>
  <tr><td><b>Bán bảo toàn</b> ✓</td><td>Mỗi con: 1 mạch cũ + 1 mạch mới</td><td><b>1 vạch lai</b> ✓</td><td><b>½ lai + ½ nhẹ</b> ✓</td><td><b>2 vạch</b>: mạch đơn nặng + nhẹ ✓</td></tr>
  <tr><td><b>Phân tán</b></td><td>Mỗi mạch là đoạn cũ xen đoạn mới</td><td>1 vạch lai (giống bán bảo toàn)</td><td><b>1 vạch</b> giữa lai và nhẹ ✗</td><td><b>1 vạch</b> mạch đơn lưng chừng ✗</td></tr></table></div>
  <h3>Thế hệ nào loại giả thuyết nào?</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Kết quả</th><th>Loại bỏ</th><th>Vì sao</th></tr>
  <tr><td>Thế hệ 1: chỉ 1 vạch lai</td><td><b>Bảo toàn</b></td><td>Bảo toàn phải còn vạch nặng (mẹ nguyên vẹn)</td></tr>
  <tr><td>Thế hệ 2: vạch lai + vạch nhẹ</td><td><b>Phân tán</b></td><td>Phân tán chỉ cho 1 vạch, nhẹ dần đều</td></tr></table></div>
  <h3>Tỉ lệ các vạch theo bán bảo toàn</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Thế hệ</th><th>Số phân tử</th><th>Nặng ¹⁵N/¹⁵N</th><th>Lai ¹⁵N/¹⁴N</th><th>Nhẹ ¹⁴N/¹⁴N</th></tr>
  <tr><td>0</td><td>1</td><td>100%</td><td>0</td><td>0</td></tr>
  <tr><td>1</td><td>2</td><td>0</td><td>100%</td><td>0</td></tr>
  <tr><td>2</td><td>4</td><td>0</td><td>50%</td><td>50%</td></tr>
  <tr><td>3</td><td>8</td><td>0</td><td>25%</td><td>75%</td></tr>
  <tr><td>n</td><td>2ⁿ</td><td>0</td><td>2/2ⁿ</td><td>1 − 2/2ⁿ</td></tr></table></div>
  <h3>Ly tâm tỷ trọng CsCl và điện di</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Ly tâm gradient CsCl</th><th>Điện di gel</th></tr>
  <tr><td>Tách theo</td><td><b>Tỷ trọng</b> (g/mL)</td><td><b>Kích thước</b> (và điện tích, hình dạng)</td></tr>
  <tr><td>Động lực</td><td>Lực ly tâm</td><td>Điện trường</td></tr>
  <tr><td>DNA dừng ở</td><td>Chỗ tỷ trọng gradient = tỷ trọng DNA (cân bằng)</td><td>Không dừng, chạy càng lâu càng xa</td></tr>
  <tr><td>Phân biệt được ¹⁵N/¹⁴N?</td><td><b>Có</b></td><td>Không (cùng kích thước)</td></tr></table></div>`,

  traps: [
    { trap: 'Thế hệ 1 đã chứng minh được bán bảo toàn.', truth: 'Thế hệ 1 chỉ <b>loại bảo toàn</b>. Phân tán cũng cho 1 vạch lai ở thế hệ 1. Phải đến <b>thế hệ 2</b> (hoặc phép thử đun nóng) mới loại được phân tán.' },
    { trap: 'Thế hệ 2 loại giả thuyết bảo toàn.', truth: 'Bảo toàn đã bị loại từ <b>thế hệ 1</b>. Thế hệ 2 loại <b>phân tán</b>.' },
    { trap: 'Ly tâm CsCl tách DNA theo kích thước (hoặc theo khối lượng phân tử).', truth: 'Tách theo <b>tỷ trọng</b> (density). DNA ¹⁵N và ¹⁴N có cùng kích thước, chỉ khác tỷ trọng ~1%. Mỗi DNA dừng tại chỗ gradient có tỷ trọng bằng chính nó.' },
    { trap: 'Càng nhiều thế hệ thì vạch lai càng tiến dần về phía vạch nhẹ.', truth: 'Vạch lai <b>đứng yên</b> ở cùng vị trí, chỉ <b>mờ dần</b> (2/2ⁿ). Vạch "trôi dần" là dự đoán của <b>phân tán</b>.' },
    { trap: 'Ở thế hệ 2 tỉ lệ lai : nhẹ là 1 : 3.', truth: 'Thế hệ 2: 4 phân tử, gồm 2 lai và 2 nhẹ, tức <b>1 : 1</b>. Tỉ lệ 1 : 3 là <b>thế hệ 3</b> (8 phân tử: 2 lai, 6 nhẹ).' },
    { trap: '¹⁵N là đồng vị phóng xạ, phát hiện bằng phim phóng xạ.', truth: '¹⁵N là đồng vị <b>bền, không phóng xạ</b>. Nó được phát hiện nhờ <b>tỷ trọng</b> (ly tâm), còn vạch DNA thấy được nhờ <b>hấp thụ UV 260 nm</b>.' },
    { trap: 'Sau nhiều thế hệ trong ¹⁴N, mạch ¹⁵N ban đầu bị phân hủy hết.', truth: '2 mạch ¹⁵N ban đầu <b>không mất</b>. Chúng luôn nằm trong <b>2 phân tử lai</b>, chỉ là tỉ lệ ngày càng nhỏ so với tổng số.' },
    { trap: 'Bán bảo toàn nghĩa là mỗi mạch con có một nửa cũ, một nửa mới.', truth: 'Đó là <b>phân tán</b>. Bán bảo toàn: mỗi <b>phân tử</b> con có <b>1 mạch cũ nguyên vẹn</b> + <b>1 mạch mới nguyên vẹn</b>.' },
  ],

  quiz: [
    { q: 'Kết quả thế hệ 1 trong thí nghiệm Meselson–Stahl loại bỏ giả thuyết nào?', ops: ['Bán bảo toàn', 'Bảo toàn', 'Phân tán', 'Cả bảo toàn và phân tán'], a: 1, e: 'Thế hệ 1 chỉ có 1 vạch lai. Bảo toàn phải cho 2 vạch (nặng + nhẹ) nên bị loại. Phân tán cũng cho 1 vạch lai nên chưa loại được.' },
    { q: 'Thế hệ 2 cho kết quả nào?', ops: ['1 vạch nặng', '1 vạch lai và 1 vạch nhẹ, tỉ lệ 1 : 1', '1 vạch nằm giữa lai và nhẹ', '1 vạch nặng và 3 vạch nhẹ'], a: 1, e: '4 phân tử: 2 lai (mỗi phân tử chứa 1 mạch ¹⁵N cũ) và 2 nhẹ. Kết quả này loại phân tán.' },
    { q: 'Ly tâm gradient CsCl tách các phân tử DNA dựa trên:', ops: ['Kích thước', 'Điện tích', 'Tỷ trọng', 'Trình tự base'], a: 2, e: 'Mỗi DNA dừng ở chỗ gradient có tỷ trọng bằng tỷ trọng của chính nó. DNA ¹⁵N đặc hơn nên dừng thấp hơn.' },
    { q: 'Sau 3 thế hệ trong ¹⁴N (bán bảo toàn), tỉ lệ DNA lai là:', ops: ['1/2', '1/4', '1/8', '0'], a: 1, e: '2³ = 8 phân tử, chỉ 2 phân tử lai nên tỉ lệ 2/8 = 1/4. Còn lại 6/8 là DNA nhẹ.' },
    { q: 'Nếu sao chép theo kiểu PHÂN TÁN, thế hệ 2 sẽ cho:', ops: ['1 vạch lai và 1 vạch nhẹ', '1 vạch duy nhất nằm giữa vạch lai và vạch nhẹ', '1 vạch nặng và 1 vạch nhẹ', '3 vạch'], a: 1, e: 'Phân tán chia đều mạch cũ cho mọi phân tử. Ở thế hệ 2 mỗi phân tử có ~¼ là ¹⁵N, nên chỉ có 1 vạch, và vạch này nhẹ dần qua từng thế hệ.' },
    { q: 'Đun nóng DNA thế hệ 1 rồi ly tâm. Kết quả nào ủng hộ bán bảo toàn?', ops: ['1 vạch mạch đơn lưng chừng', '2 vạch mạch đơn: nặng (¹⁵N) và nhẹ (¹⁴N)', '1 vạch mạch kép lai', 'Không thấy vạch nào'], a: 1, e: 'Mỗi phân tử lai gồm 1 mạch ¹⁵N nguyên vẹn + 1 mạch ¹⁴N nguyên vẹn. Tách ra thì được 2 loại mạch đơn khác tỷ trọng. Phân tán sẽ chỉ cho 1 vạch lưng chừng.' },
    { q: 'Vì sao Meselson–Stahl chọn đánh dấu bằng nitơ?', ops: ['Vì N phóng xạ nên dễ phát hiện', 'Vì N có nhiều trong base của DNA và vi khuẩn lấy N từ NH₄Cl trong môi trường', 'Vì N chỉ có trong protein', 'Vì ¹⁵N làm DNA phát huỳnh quang'], a: 1, e: 'N có trong mọi base. ¹⁵N là đồng vị bền (không phóng xạ), làm DNA nặng hơn nên tách được bằng ly tâm tỷ trọng.' },
  ],

  recall: [
    'Vẽ tay 3 cột (bảo toàn, bán bảo toàn, phân tán), mỗi cột vẽ thế hệ 0 → 1 → 2 bằng 2 màu bút. Bên dưới mỗi cột vẽ ống ly tâm dự đoán cho thế hệ 1 và 2.',
    'Không nhìn bảng, điền số: thế hệ 0, 1, 2, 3, 4 có bao nhiêu % lai và % nhẹ? Viết công thức tổng quát.',
    'Gấp màn hình lại, nói to: thế hệ nào loại giả thuyết nào, và vì sao? Phép thử đun nóng phân biệt được 2 giả thuyết nào?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

    // ================= 0) Three hypotheses (family trees) =================
    const treeG = api.group();
    const NBP = 12;
    const paint = (d, s1, s2) => d.pairs.forEach((p, i) => {
      const c1 = s1[i], c2 = s2[i];
      p.s1.material.color.setHex(c1); p.base1.material.color.setHex(c1); if (p.bb1) p.bb1.material.color.setHex(c1);
      p.s2.material.color.setHex(c2); p.base2.material.color.setHex(c2); if (p.bb2) p.bb2.material.color.setHex(c2);
    });
    const all = (c) => Array(NBP).fill(c);
    const mix = (hs) => Array.from({ length: NBP }, (_, i) => hs.includes(i) ? H : L);
    const HH = [all(H), all(H)], LL = [all(L), all(L)], HL = [all(H), all(L)], LH = [all(L), all(H)];
    const D1a = [mix([0, 1, 2, 6, 7, 8]), mix([3, 4, 5, 9, 10, 11])], D1b = [mix([3, 4, 5, 9, 10, 11]), mix([0, 1, 2, 6, 7, 8])];
    const D2 = (a, b) => [mix(a), mix(b)];
    const MODELS = [
      { name: 'Bảo toàn', g1: [HH, LL], g2: [HH, LL, LL, LL] },
      { name: 'Bán bảo toàn', g1: [HL, LH], g2: [HL, LL, LL, LH] },
      { name: 'Phân tán', g1: [D1a, D1b], g2: [D2([0, 6, 7], [3, 9, 10]), D2([1, 2, 8], [4, 5, 11]), D2([3, 4, 9], [0, 1, 6]), D2([5, 10, 11], [2, 7, 8])] },
    ];
    const CX = [-4.7, 0, 4.7], GY = [2.55, 0.05, -2.45];
    const genObjs = [[], [], []];
    const mini = (parent, x, y, cols) => {
      const g = api.group(parent); g.position.set(x, y, 0);
      const d = api.dna({ seq: 'ATGCGTACGTTA', rise: 0.17, radius: 0.27, turn: 10, axis: 'y', parent: g });
      paint(d, cols[0], cols[1]); return g;
    };
    MODELS.forEach((m, c) => {
      const cx = CX[c];
      genObjs[0].push(mini(treeG, cx, GY[0], HH));
      m.g1.forEach((cols, k) => genObjs[1].push(mini(treeG, cx + (k ? 0.85 : -0.85), GY[1], cols)));
      m.g2.forEach((cols, k) => genObjs[2].push(mini(treeG, cx + [-1.65, -0.55, 0.55, 1.65][k], GY[2], cols)));
      const a1 = api.group(treeG); arrow(api, [cx - 0.15, GY[0] - 1.15, 0], [cx - 0.75, GY[1] + 1.2, 0], 0xcfd6e6, a1, 0.03); arrow(api, [cx + 0.15, GY[0] - 1.15, 0], [cx + 0.75, GY[1] + 1.2, 0], 0xcfd6e6, a1, 0.03);
      const a2 = api.group(treeG);
      [[-0.85, -1.65], [-0.85, -0.55], [0.85, 0.55], [0.85, 1.65]].forEach(([f, t]) => arrow(api, [cx + f, GY[1] - 1.15, 0], [cx + t, GY[2] + 1.2, 0], 0xcfd6e6, a2, 0.03));
      genObjs[1].push(a1); genObjs[2].push(a2);
      lb.add('h_' + c, m.name, [cx, 4.05, 0], null, c === 1 ? 'good' : 'big');
    });
    lb.add('h_g0', 'thế hệ 0', [-7.6, GY[0], 0], null, 'dim');
    lb.add('h_g1', 'thế hệ 1', [-7.6, GY[1], 0], null, 'dim');
    lb.add('h_g2', 'thế hệ 2', [-7.6, GY[2], 0], null, 'dim');

    // ================= 1) 15N labelling: flask + bacteria =================
    const labG = api.group();
    api.cylinder(2.6, 2.6, 3.6, 0xffffff, labG, { opacity: 0.12, depthWrite: false });
    const liquid = api.cylinder(2.5, 2.5, 2.7, 0x5ab4e6, labG, { opacity: 0.18, depthWrite: false }); liquid.position.y = -0.4;
    const bugs = [];
    const capG = new THREE.CapsuleGeometry(0.32, 0.9, 6, 12);
    [[-1.3, -0.3, 0.6, 0.3], [0.2, 0.2, -0.6, -0.5], [1.3, -0.9, 0.5, 1.2], [-0.4, -1.2, 1.0, 1.9], [1.0, 0.5, 1.0, 0.8], [-1.5, 0.4, -0.8, 2.4]].forEach(([x, y, z, r]) => {
      const g = api.group(labG); g.position.set(x, y, z); g.rotation.z = r;
      const cell = new THREE.Mesh(capG, api.mat(0x7fd18b, { opacity: 0.35, depthWrite: false })); g.add(cell);
      const ring = api.torus(0.17, 0.035, L, g); ring.rotation.y = Math.PI / 2;
      bugs.push({ g, ring });
    });
    const n15 = [];
    for (let i = 0; i < 40; i++) { const s = api.sphere(0.06, H, labG, { emissive: H, emissiveIntensity: 0.6 }); n15.push({ s, a: i * 2.4, r: 0.6 + (i * 0.37) % 1.8, y: -1.6 + (i * 0.61) % 2.4 }); }
    lb.add('l_med', 'môi trường chỉ có ¹⁵NH₄Cl (nitơ nặng)', [0, 2.3, 0], labG, 'big');
    lb.add('l_n', 'chấm xanh = ¹⁵N, vi khuẩn lấy N làm base', [2.4, -2.4, 0], labG, 'dim');
    lb.add('l_dna', 'DNA vòng của E. coli', [-2.6, 1.0, 0], labG, 'dim');
    lb.add('l_gen', '', [0, -2.95, 0], labG, '');

    // ================= 2–7) CsCl tubes =================
    const tubeG = api.group();
    const mkTube = (parent, x, s = 1) => {
      const g = api.group(parent); g.position.set(x, 0, 0); g.scale.setScalar(s);
      const gg = new THREE.CylinderGeometry(0.43, 0.43, 4.0, 24, 16, true), cols = [], pa = gg.attributes.position;
      for (let k = 0; k < pa.count; k++) { const f = clamp((2.0 - pa.getY(k)) / 4.0); const c = new THREE.Color(0x8fa4c9).lerp(new THREE.Color(0x3a4f86), f); cols.push(c.r, c.g, c.b); }
      gg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      const gm = new THREE.Mesh(gg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide })); g.add(gm);
      api.cylinder(0.47, 0.47, 4.2, 0xffffff, g, { opacity: 0.1, depthWrite: false }).position.y = 0.05;
      const bot = api.sphere(0.47, 0xffffff, g, { opacity: 0.1, depthWrite: false }); bot.position.y = -2.05; bot.scale.y = 0.45;
      api.torus(0.47, 0.03, 0xcfd6e6, g).rotation.x = Math.PI / 2; g.children[g.children.length - 1].position.y = 2.15;
      const bands = [0, 1, 2].map(() => { const b = api.cylinder(0.42, 0.42, 0.11, HYB, g, { opacity: 0, emissive: HYB, emissiveIntensity: 0.5 }); b.visible = false; return b; });
      return { g, bands };
    };
    const setBands = (tube, list) => tube.bands.forEach((b, i) => {
      const it = list[i]; b.visible = !!it; if (!it) return;
      b.position.y = it.y; b.material.color.setHex(it.c); b.material.emissive.setHex(it.c); b.material.opacity = 0.45 + 0.5 * it.f; b.scale.y = 0.7 + it.f * 1.5;
    });
    const main = mkTube(tubeG, -3.2, 1.25);
    const PX = [1.0, 3.1, 5.2];
    const preds = PX.map(x => { const t = mkTube(tubeG, x, 0.8); t.g.position.y = -0.2; return t; });
    ['Bảo toàn', 'Bán bảo toàn', 'Phân tán'].forEach((n, i) => { lb.add('pd_' + i, n, [PX[i], 1.95, 0], tubeG, 'dim'); lb.add('pv_' + i, '', [PX[i], -2.35, 0], tubeG, ''); });
    lb.add('pd_t', 'DỰ ĐOÁN', [3.1, 2.6, 0], tubeG, 'big');
    lb.add('mt_t', 'KẾT QUẢ THỰC NGHIỆM', [-3.2, 3.3, 0], tubeG, 'good');
    const MY = (y) => y * 1.25;
    lb.add('mb_LL', '¹⁴N/¹⁴N (nhẹ) ~1,710', [-1.15, MY(Y.LL), 0], tubeG, 'plain');
    lb.add('mb_HL', 'lai ¹⁵N/¹⁴N ~1,717', [-1.15, MY(Y.HL), 0], tubeG, 'plain');
    lb.add('mb_HH', '¹⁵N/¹⁵N (nặng) ~1,724', [-1.15, MY(Y.HH), 0], tubeG, 'plain');
    lb.add('mb_sL', 'mạch đơn ¹⁴N', [-1.4, MY(Y.sL), 0], tubeG, 'plain');
    lb.add('mb_sH', 'mạch đơn ¹⁵N', [-1.4, MY(Y.sH), 0], tubeG, 'plain');
    lb.add('mb_top', 'miệng ống: loãng', [-5.0, 2.45, 0], tubeG, 'dim');
    lb.add('mb_bot', 'đáy: CsCl đặc', [-5.0, -2.55, 0], tubeG, 'dim');
    lb.add('g0_n', 'Mốc xuất phát: 100% ¹⁵N/¹⁵N', [2.6, 1.0, 0], tubeG, 'big');
    lb.add('g0_n2', 'tiếp theo: chuyển vi khuẩn sang ¹⁴N → lấy mẫu sau mỗi thế hệ (1, 2, 3…)', [2.6, 0.1, 0], tubeG, 'dim');

    // rotor (step 2)
    const rotG = api.group(tubeG); rotG.position.set(3.0, 0.2, 0); rotG.rotation.x = 0.9;
    api.cylinder(2.0, 2.0, 0.35, 0x8e99ad, rotG, { roughness: 0.3, metalness: 0.6 });
    api.cylinder(0.25, 0.25, 0.8, 0x5a6478, rotG);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const h = api.cylinder(0.22, 0.22, 0.4, 0x2b2f3a, rotG); h.position.set(Math.cos(a) * 1.45, 0.05, Math.sin(a) * 1.45); }
    lb.add('rt', 'ly tâm siêu tốc ~45 000 vòng/phút, ~20 giờ', [3.0, 2.3, 0], tubeG, 'big');
    lb.add('rt2', 'Cs⁺ bị kéo xuống → đáy đặc hơn', [3.0, -2.0, 0], tubeG, 'dim');

    // DNA particles in the main tube: 32 duplexes = 64 strands
    const NP = 32, strands = [];
    for (let i = 0; i < NP * 2; i++) { const m = api.cylinder(0.035, 0.035, 0.34, H, main.g); strands.push({ m, from: V(), to: V() }); }
    const rnd = (k) => { const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };

    // generation grid (step 7): up to 16 duplexes
    const gridG = api.group(tubeG); gridG.position.set(3.4, 0.1, 0); gridG.scale.setScalar(1.2);
    const grid = [];
    for (let k = 0; k < 16; k++) {
      const g = api.group(gridG); g.position.set(-2.1 + (k % 8) * 0.6, k < 8 ? 0.8 : -0.8, 0);
      const a = api.cylinder(0.07, 0.07, 1.1, H, g); a.position.x = -0.1;
      const b = api.cylinder(0.07, 0.07, 1.1, L, g); b.position.x = 0.1;
      grid.push({ g, a, b });
    }
    lb.add('gr_t', '', [3.4, 2.4, 0], tubeG, 'big');
    lb.add('gr_n', 'xanh = 2 mạch ¹⁵N gốc: không mất, luôn nằm trong 2 phân tử lai', [3.4, -1.9, 0], tubeG, 'dim');

    // ================= state & controls =================
    let cur = 0, heat = false, gen = 2;
    const pr = progress(1 / 3.5);
    const tHeat = api.toggle('🔥 Đun nóng 100 °C (tách mạch)', false, (v) => { heat = v; ctl.setStep(cur); });
    const sGen = api.slider('Thế hệ trong ¹⁴N', 0, 4, 1, 2, (v) => { gen = v; ctl.setStep(cur); }, (x) => 'n = ' + x);
    const CTL = [[tHeat.el, [6]], [sGen.el, [7]]];

    // compositions of the main tube: list of duplex types; 'H'/'L' strands for single strands
    const comp = (s) => {
      if (s === 2) return { ds: [...Array(16).fill('HH'), ...Array(16).fill('LL')] };
      if (s === 3) return { ds: Array(NP).fill('HH') };
      if (s === 4) return { ds: Array(NP).fill('HL') };
      if (s === 5) return { ds: [...Array(16).fill('HL'), ...Array(16).fill('LL')] };
      if (s === 6) return heat ? { ss: true, ds: Array(NP).fill('HL') } : { ds: Array(NP).fill('HL') };
      if (s === 7) { if (gen === 0) return { ds: Array(NP).fill('HH') }; const nh = Math.round(NP * 2 / 2 ** gen); return { ds: [...Array(nh).fill('HL'), ...Array(NP - nh).fill('LL')] }; }
      return { ds: Array(NP).fill('HH') };
    };
    const bandsFor = (c) => {
      if (c.ss) return [{ y: Y.sH, c: H, f: 0.5 }, { y: Y.sL, c: L, f: 0.5 }];
      const cnt = { HH: 0, HL: 0, LL: 0 }; c.ds.forEach(t => cnt[t]++);
      const out = [];
      if (cnt.HH) out.push({ y: Y.HH, c: H, f: cnt.HH / NP });
      if (cnt.HL) out.push({ y: Y.HL, c: HYB, f: cnt.HL / NP });
      if (cnt.LL) out.push({ y: Y.LL, c: L, f: cnt.LL / NP });
      return out;
    };
    const PRED = {
      4: [[{ y: Y.HH, c: H, f: 0.5 }, { y: Y.LL, c: L, f: 0.5 }], [{ y: Y.HL, c: HYB, f: 1 }], [{ y: Y.HL, c: HYB, f: 1 }]],
      5: [[{ y: Y.HH, c: H, f: 0.25 }, { y: Y.LL, c: L, f: 0.75 }], [{ y: Y.HL, c: HYB, f: 0.5 }, { y: Y.LL, c: L, f: 0.5 }], [{ y: Y.disp2, c: 0xd9a0a0, f: 1 }]],
      6: [[{ y: Y.sH, c: H, f: 0.5 }, { y: Y.sL, c: L, f: 0.5 }], [{ y: Y.sH, c: H, f: 0.5 }, { y: Y.sL, c: L, f: 0.5 }], [{ y: Y.sMid, c: HYB, f: 1 }]],
    };
    const VERD = { 4: ['✗ loại', '✓ khớp', '✓ chưa loại được'], 5: ['✗ (đã loại)', '✓ khớp', '✗ loại'], 6: ['(đã loại ở thế hệ 1)', '✓ khớp', '✗ loại'] };
    const VCLS = { '✗': 'warn', '✓': 'good', '(': 'dim' };

    const placeStrands = (c) => {
      strands.forEach((st, i) => {
        const d = Math.floor(i / 2), side = i % 2, type = c.ds[d];
        const sCol = type === 'HH' ? H : type === 'LL' ? L : (side ? L : H);
        st.m.material.color.setHex(sCol);
        const jx = (rnd(d * 3 + 1) - 0.5) * 0.55, jz = (rnd(d * 5 + 2) - 0.5) * 0.55, jy = (rnd(d * 7 + 3) - 0.5) * 0.14;
        st.from.set(jx + (side ? 0.05 : -0.05), (rnd(d * 11 + side) - 0.5) * 3.6, jz);
        if (c.ss) {
          const jx2 = (rnd(i * 13 + 4) - 0.5) * 0.6, jz2 = (rnd(i * 17 + 5) - 0.5) * 0.6;
          st.to.set(jx2, (sCol === H ? Y.sH : Y.sL) + (rnd(i * 19) - 0.5) * 0.12, jz2);
          st.from.set(jx + (side ? 0.05 : -0.05), Y.HL + jy, jz);
        } else st.to.set(jx + (side ? 0.05 : -0.05), Y[type] + jy, jz);
        st.m.rotation.z = (rnd(d * 23) - 0.5) * 0.6; st.m.rotation.x = (rnd(d * 29) - 0.5) * 0.6;
        st.m.position.copy(st.from);
      });
    };

    const groups = { treeG, labG, tubeG };
    const VIS = [['treeG'], ['labG'], ['tubeG'], ['tubeG'], ['tubeG'], ['tubeG'], ['tubeG'], ['tubeG']];
    const CAM = [[[0, 0.6, 14.5], [0, 0.6, 0]], [[0, 1.6, 9], [0, -0.2, 0]], [[0, 0.4, 12], [0, 0.1, 0]], [[0, 0.4, 12], [0, 0.1, 0]],
      [[0, 0.4, 12.5], [0, 0.1, 0]], [[0, 0.4, 12.5], [0, 0.1, 0]], [[0, 0.4, 12.5], [0, 0.1, 0]], [[0, 0.4, 12.5], [0, 0.1, 0]]];
    const MAINX = { 2: -3.2, 3: -2.2, 4: -3.2, 5: -3.2, 6: -3.2, 7: -3.2 };

    const readout = () => {
      const s = cur; let h;
      if (s === 0) h = 'Xanh đậm = mạch <b>cũ</b> (¹⁵N), cam = mạch <b>mới</b> (¹⁴N). So sánh thế hệ 2 của 3 cột: chỉ <b>bán bảo toàn</b> giữ mỗi mạch cũ <b>nguyên vẹn</b> trong một phân tử lai.';
      else if (s === 1) h = 'Nuôi nhiều thế hệ (≈14 thế hệ trong thí nghiệm gốc) để gần như mọi N trong DNA đều là ¹⁵N.';
      else if (s === 2) h = 'Mẫu thử: trộn DNA ¹⁵N với DNA ¹⁴N. Sau ly tâm: <b>2 vạch</b>. Nặng ở dưới, nhẹ ở trên.';
      else if (s === 3) h = '<b>Thế hệ 0</b>: 100% ¹⁵N/¹⁵N, 1 vạch nặng.';
      else if (s === 4) h = '<b>Thế hệ 1</b>: 100% lai. Không còn vạch nặng, nên <b>bảo toàn bị loại</b>.';
      else if (s === 5) h = '<b>Thế hệ 2</b>: 50% lai + 50% nhẹ. Không phải 1 vạch lưng chừng, nên <b>phân tán bị loại</b>.';
      else if (s === 6) h = heat ? '🔥 Đã tách mạch: <b>2 vạch mạch đơn</b> (¹⁵N và ¹⁴N). Mỗi mạch nguyên khối cũ hoặc nguyên khối mới.' : 'DNA thế hệ 1 (lai). Bật <b>🔥 Đun nóng</b> để tách 2 mạch.';
      else { const n = gen, tot = 2 ** n; h = n === 0 ? '<b>n = 0</b>: 1 phân tử ¹⁵N/¹⁵N.' : `<b>n = ${n}</b>: ${tot} phân tử, gồm <b>2 lai</b> và <b>${tot - 2} nhẹ</b>. Lai = 2/${tot} = <b>${Math.round(200 / tot)}%</b>.`; }
      api.readout(h);
    };

    const ctl = {
      setStep(s) {
        cur = s; pr.snap(0, 1);
        for (const [k, g] of Object.entries(groups)) { const on = VIS[s].includes(k); g.visible = true; api.scaleTo(g, on ? 1 : 0.001, 6); }
        api.camera(...CAM[s]);
        const L0 = [];
        if (s === 0) { L0.push('h_0', 'h_1', 'h_2', 'h_g0', 'h_g1', 'h_g2'); genObjs[1].concat(genObjs[2]).forEach(o => o.scale.setScalar(0.001)); }
        if (s === 1) { L0.push('l_med', 'l_n', 'l_dna', 'l_gen'); bugs.forEach(b => b.ring.material.color.setHex(L)); }
        if (s >= 2) {
          const c = comp(s); placeStrands(c);
          main.g.position.x = MAINX[s]; main.bands.forEach(b => b.visible = false);
          const P = PRED[s] && (s !== 6 || heat);
          preds.forEach((t, i) => { t.g.visible = !!P; if (P) setBands(t, PRED[s][i]); });
          rotG.visible = s === 2; gridG.visible = s === 7;
          L0.push('mt_t', 'mb_top', 'mb_bot');
          lb.get('mt_t').position.x = MAINX[s];
          ['mb_LL', 'mb_HL', 'mb_HH', 'mb_sL', 'mb_sH'].forEach(k => lb.get(k).position.x = MAINX[s] + 2.05 + (k.startsWith('mb_s') ? -0.15 : 0));
          lb.get('mb_top').position.x = MAINX[s] - 1.8; lb.get('mb_bot').position.x = MAINX[s] - 1.8;
          const bl = bandsFor(c).map(b => b.y);
          if (bl.includes(Y.LL)) L0.push('mb_LL'); if (bl.includes(Y.HL)) L0.push('mb_HL'); if (bl.includes(Y.HH)) L0.push('mb_HH');
          if (c.ss) L0.push('mb_sL', 'mb_sH');
          if (s === 2) L0.push('rt', 'rt2');
          if (s === 3) L0.push('g0_n', 'g0_n2');
          if (P) {
            L0.push('pd_t', 'pd_0', 'pd_1', 'pd_2', 'pv_0', 'pv_1', 'pv_2');
            VERD[s].forEach((v, i) => { lb.set('pv_' + i, v); lb.get('pv_' + i).element.className = 'lbl ' + VCLS[v[0]]; });
          }
          if (s === 7) {
            L0.push('gr_t', 'gr_n');
            const tot = 2 ** gen;
            lb.set('gr_t', gen === 0 ? 'thế hệ 0: 1 phân tử' : `thế hệ ${gen}: ${tot} phân tử (2 lai)`);
            grid.forEach((q, k) => {
              const on = k < tot; q.g.scale.setScalar(on ? 1 : 0.001);
              const hyb = gen > 0 && (k === 0 || k === tot - 1);
              q.a.material.color.setHex(gen === 0 ? H : hyb ? H : L); q.b.material.color.setHex(gen === 0 ? H : L);
              const cols = Math.min(8, tot); q.g.position.set((k % 8 - (cols - 1) / 2) * 0.6, tot > 8 ? (k < 8 ? 0.8 : -0.8) : 0, 0);
            });
          }
        }
        lb.only(L0);
        CTL.forEach(([el, steps]) => { el.style.display = steps.includes(s) ? '' : 'none'; });
        readout();
      },
      update(dt, t) {
        const s = cur, e = ease(pr.tick(dt));
        if (s === 0) {
          const a = clamp((e - 0.15) / 0.3), b = clamp((e - 0.55) / 0.3);
          genObjs[1].forEach(o => o.scale.setScalar(Math.max(0.001, a))); genObjs[2].forEach(o => o.scale.setScalar(Math.max(0.001, b)));
          treeG.rotation.y = Math.sin(t * 0.25) * 0.12;
        }
        if (s === 1) {
          bugs.forEach((b, k) => { b.g.rotation.y += dt * (0.3 + k * 0.05); b.ring.material.color.copy(new THREE.Color(L).lerp(new THREE.Color(H), e)); });
          n15.forEach((n, k) => { const a = n.a + t * 0.4; n.s.position.set(Math.cos(a) * n.r, n.y + Math.sin(t + k) * 0.15, Math.sin(a) * n.r); });
          lb.set('l_gen', e < 1 ? 'đang nuôi qua nhiều thế hệ…' : 'DNA đã nặng (¹⁵N/¹⁵N) → chuyển sang ¹⁴N');
          labG.rotation.y = Math.sin(t * 0.2) * 0.15;
        }
        if (s >= 2) {
          strands.forEach(st => st.m.position.lerpVectors(st.from, st.to, e));
          if (s === 2) rotG.rotation.y += dt * (e < 0.95 ? 9 : 2);
          const c = comp(s), bl = bandsFor(c);
          if (e > 0.8) setBands(main, bl.map(b => ({ ...b, f: b.f * clamp((e - 0.8) / 0.2) }))); else main.bands.forEach(b => b.visible = false);
          tubeG.rotation.y = Math.sin(t * 0.25) * 0.08;
        }
      },
    };
    return ctl;
  },
};
