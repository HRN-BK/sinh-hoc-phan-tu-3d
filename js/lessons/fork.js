// Bài 6: Chạc ba sao chép & đọc sửa (proofreading)
import { labels, arrow, ease, lerp, clamp } from './_kit.js';

const NEW = 0x34c759, NEWA = 0xa8e063, NEWB = 0x5fd3bc, RNA = 0xf2994a;
const HEL = 0xc77dff, TOPO = 0x8d99ae, SSBC = 0xe9ecef, PRIM = 0xff7f50, POL3 = 0x2bb3a3, CLAMP = 0x00c2ff, POL1 = 0x4c6fff, LIG = 0xffd60a;

export default {
  title: 'Chạc ba sao chép & đọc sửa',
  sub: 'Helicase mở xoắn, SSB giữ mạch đơn, primase đặt mồi RNA, Pol III tổng hợp mạch dẫn liên tục và mạch chậm theo từng đoạn Okazaki, Pol I thay mồi, ligase nối. Polymerase còn tự "đọc sửa" lỗi nhờ exonuclease 3′→5′.',
  legend: '<span><i style="background:#5b8def"></i>mạch khuôn (cũ)</span><span><i style="background:#ef6c8b"></i>mạch khuôn (cũ)</span><span><i style="background:#34c759"></i>DNA mới</span><span><i style="background:#f2994a"></i>mồi RNA</span><span><i style="background:#a8e063"></i><i style="background:#5fd3bc"></i>đoạn Okazaki chưa nối</span>',

  why: `<p>Mỗi lần tế bào phân chia, toàn bộ DNA phải được chép <b>đủ, đúng và đúng 1 lần</b>. <i>E. coli</i> chép 4,6 triệu bp trong ~40 phút; người chép 3 tỷ bp trong ~8 giờ (pha S).</p>
  <p>DNA polymerase rất nhanh và chính xác, nhưng có 2 "tật" không thể sửa:</p>
  <ul><li><b>Chỉ nối được vào đầu 3′-OH</b>, nên mạch mới luôn kéo dài theo chiều <b>5′→3′</b>.</li>
  <li><b>Không tự bắt đầu được</b>: cần sẵn một <b>mồi</b> có đầu 3′-OH.</li></ul>
  <p>Hai mạch khuôn lại <b>ngược chiều nhau</b>. Vì vậy chạc sao chép cần cả một "dây chuyền" enzyme phối hợp (replisome). Mạch thứ hai buộc phải làm <b>từng đoạn ngắn</b> (Okazaki) rồi nối lại.</p>`,

  without: `<ul>
  <li><b>Không có helicase</b>: 2 mạch không tách được, polymerase không có khuôn đọc.</li>
  <li><b>Không có topoisomerase</b>: phía trước chạc bị xoắn chặt dần (siêu xoắn dương), chạc <b>dừng lại</b>. Thuốc kháng sinh <b>quinolone</b> (ciprofloxacin) diệt khuẩn đúng theo cách này: khóa gyrase.</li>
  <li><b>Không có SSB</b>: mạch đơn tự bắt cặp tạo <b>kẹp tóc</b>, bị nuclease cắt, polymerase bị kẹt.</li>
  <li><b>Không có primase</b>: polymerase không có đầu 3′-OH để bắt đầu, không tổng hợp được gì.</li>
  <li><b>Không có Pol I (hoặc RNase H/FEN1 ở nhân thực)</b>: mồi RNA còn nằm lại trong DNA.</li>
  <li><b>Không có ligase</b>: mạch chậm là hàng nghìn mảnh rời, nhiễm sắc thể đứt gãy khi tế bào phân chia.</li>
  <li><b>Không có đọc sửa 3′→5′</b>: tỷ lệ sai tăng ~100 lần (đột biến tăng vọt, như chủng <i>mutD</i> hỏng tiểu phần ε của Pol III).</li></ul>`,

  foundation: [
    { q: 'Đầu 5′ và đầu 3′ là gì? Vì sao chỉ nối được vào 3′?', a: 'Mỗi nucleotide có đường deoxyribose. Carbon số <b>5′</b> mang nhóm phosphate, carbon số <b>3′</b> mang nhóm <b>–OH</b>. Trong một mạch, đầu có phosphate tự do là đầu 5′, đầu có OH tự do là đầu 3′.<br>Polymerase dùng <b>3′-OH</b> của mạch đang kéo dài để "tấn công" phosphate α của nucleotide mới đến (dNTP). Vì vậy nucleotide mới luôn được gắn vào đầu 3′, và mạch dài ra theo chiều <b>5′→3′</b>.' },
    { q: 'dNTP là gì? Năng lượng để nối lấy từ đâu?', a: 'dNTP = deoxynucleoside <b>triphosphate</b> (dATP, dTTP, dGTP, dCTP). Mỗi dNTP mang 3 phosphate α, β, γ.<br>Khi gắn vào chuỗi, nó giữ lại phosphate α (làm cầu nối phosphodiester) và nhả ra <b>pyrophosphate (PPi = β + γ)</b>. Liên kết phosphate bị cắt cung cấp năng lượng. PPi sau đó bị thủy phân tiếp, làm phản ứng gần như không thể đảo ngược.' },
    { q: '"Ngược chiều" (antiparallel) nghĩa là gì ở chạc?', a: 'Hai mạch DNA chạy ngược nhau: một mạch 5′→3′ thì mạch kia 3′→5′. Polymerase đọc khuôn theo chiều <b>3′→5′</b> để tổng hợp mạch mới 5′→3′.<br>Ở chạc, một khuôn cho phép polymerase đi <b>cùng chiều</b> mở chạc (mạch dẫn). Khuôn kia buộc polymerase đi <b>ngược chiều</b> mở chạc (mạch chậm).' },
    { q: 'Mồi (primer) là gì, vì sao là RNA?', a: 'Mồi là một đoạn ngắn (~10–12 nt ở <i>E. coli</i>) bắt cặp với khuôn, cung cấp đầu <b>3′-OH</b> đầu tiên.<br><b>Primase</b> là một loại RNA polymerase, và RNA polymerase <b>không cần mồi</b>, nên tự bắt đầu được. Mồi RNA cũng là "dấu hiệu" để sau đó nhận ra và thay bằng DNA. Bước đầu tiên dễ sai nhất, vì vậy làm bằng RNA rồi bỏ đi lại an toàn hơn.' },
    { q: 'Liên kết nào bị phá, liên kết nào được tạo?', a: '• <b>Helicase</b> phá liên kết <b>hydrogen</b> giữa 2 mạch (dùng ATP), không cắt mạch.<br>• <b>Topoisomerase</b> cắt rồi nối lại liên kết <b>phosphodiester</b> để nhả xoắn.<br>• <b>Polymerase</b> tạo liên kết <b>phosphodiester</b> mới.<br>• <b>Ligase</b> tạo liên kết phosphodiester cuối cùng ở <b>vết nick</b> (giữa 3′-OH và 5′-phosphate kề nhau).' },
    { q: 'Siêu xoắn (supercoil) là gì?', a: 'DNA mạch kép xoắn ~10,5 bp/vòng. Khi helicase tách mạch ở một đầu, số vòng xoắn đó phải "dồn" sang phần phía trước (vì 2 đầu không xoay tự do được). Phần phía trước bị <b>xoắn quá mức</b>, gọi là <b>siêu xoắn dương</b>. Giống như tách 2 sợi của một dây thừng: đoạn phía trước bị vặn chặt lại.' },
    { q: 'Processivity (độ bền bám) là gì?', a: 'Là số nucleotide polymerase gắn liên tục trước khi rời khuôn. Pol III lõi một mình chỉ được ~10–20 nt. Khi có <b>kẹp trượt β</b> (vòng ôm quanh DNA) thì được <b>hàng chục nghìn nt</b> với tốc độ ~1000 nt/giây. Ở nhân thực, kẹp tương ứng là <b>PCNA</b>.' },
    { q: 'Nick và gap khác nhau thế nào?', a: '<b>Nick</b>: mạch bị đứt 1 liên kết phosphodiester nhưng <b>không thiếu nucleotide nào</b>. Ligase nối trực tiếp được.<br><b>Gap</b>: thiếu hẳn một hoặc nhiều nucleotide. Phải có polymerase lấp trước rồi ligase mới nối được.' },
  ],

  steps: [
    { title: 'Toàn cảnh chạc ba sao chép', text: 'DNA mẹ (bên phải) đi vào chạc. Hai mạch tách ra thành 2 phân tử con (bên trái).<br>• <b>Mạch dẫn</b> (trên): tổng hợp <b>liên tục</b>, cùng chiều tiến của chạc.<br>• <b>Mạch chậm</b> (dưới): tổng hợp <b>từng đoạn Okazaki</b>, ngược chiều tiến của chạc.<br>Cả 2 mạch mới đều kéo dài theo chiều <b>5′→3′</b>. Trong thực tế replisome đứng yên tương đối, DNA "chạy qua" nó. Hình vẽ cũng như vậy.' },
    { title: 'Helicase tháo xoắn, topoisomerase nhả xoắn', text: '<b>Helicase DnaB</b> (vòng 6 tiểu phần) ôm lấy mạch khuôn của mạch chậm, trượt theo chiều <b>5′→3′</b> và dùng <b>ATP</b> để phá liên kết hydrogen.<br>Mỗi 10,5 bp được tách, phía trước chạc bị vặn thêm 1 vòng (siêu xoắn dương). <b>Topoisomerase</b> (ở <i>E. coli</i> là gyrase, topo II) cắt cả 2 mạch, cho xoay, rồi nối lại.<br>Bật <b>⛔ Tắt topoisomerase</b>: phía trước xoắn chặt dần, chạc chậm lại rồi dừng.' },
    { title: 'SSB giữ mạch đơn', text: 'Mạch khuôn của mạch chậm phải chờ primase và polymerase, nên phơi ra ở dạng <b>mạch đơn</b> khá lâu.<br><b>SSB</b> (single-strand binding protein, tứ phân) phủ lên mạch đơn:<br>• giữ mạch <b>duỗi thẳng</b>, không tự bắt cặp tạo kẹp tóc;<br>• bảo vệ khỏi nuclease.<br>SSB <b>không</b> bám theo trình tự, và bị polymerase đẩy ra khi tổng hợp đi qua. Bật <b>🚫 Bỏ SSB</b> để xem chuyện gì xảy ra.' },
    { title: 'Primase đặt mồi RNA', text: 'DNA polymerase <b>không tự bắt đầu</b>, nó cần một đầu 3′-OH có sẵn. <b>Primase (DnaG)</b> đi cùng helicase. Cứ mỗi khi khuôn mạch chậm lộ ra đủ dài, primase tổng hợp một <b>mồi RNA</b> ngắn (màu cam, ~10–12 nt; hình rút gọn còn 3 nt).<br>• Mạch dẫn chỉ cần <b>1 mồi</b> ở điểm khởi đầu (ori).<br>• Mạch chậm cần <b>1 mồi cho mỗi đoạn Okazaki</b>.<br>Trong mồi RNA, base đối diện A của khuôn là <b>U</b> chứ không phải T.' },
    { title: 'Mạch dẫn: liên tục', text: 'Khuôn của mạch dẫn chạy <b>3′→5′ theo hướng chạc tiến</b>. Pol III gắn nucleotide vào đầu 3′ và đi cùng chiều với chạc, nên tổng hợp <b>liên tục</b> không ngừng.<br><b>Kẹp trượt β</b> (vòng xanh) ôm quanh DNA, giữ Pol III không rơi ra. Nhờ vậy Pol III chép ~1000 nt/giây hàng trăm nghìn nt liền.' },
    { title: 'Mạch chậm: từng đoạn Okazaki', text: 'Khuôn mạch chậm chạy <b>5′→3′ theo hướng chạc tiến</b>. Polymerase phải đi <b>ngược</b> chạc, nên:<br>1. Chạc mở thêm một đoạn khuôn → primase đặt mồi gần chạc.<br>2. Pol III kéo dài mồi <b>ra xa chạc</b> cho đến khi đụng đoạn trước.<br>3. Pol III nhả ra, "nhảy" về gần chạc làm đoạn tiếp theo.<br>Đoạn Okazaki dài ~<b>1000–2000 nt</b> ở nhân sơ, ~<b>100–200 nt</b> ở nhân thực. Thực tế khuôn mạch chậm vòng lại (mô hình "kèn trombone") để 2 lõi Pol III đi chung một khối.' },
    { title: 'Pol I thay mồi, ligase nối nick', text: 'Khi đoạn Okazaki mới đụng mồi của đoạn trước:<br>• <b>Pol I</b> bám vào đầu 3′-OH. Dùng hoạt tính <b>exonuclease 5′→3′</b> gỡ từng ribonucleotide của mồi phía trước, đồng thời lắp DNA vào chỗ đó (gọi là "dịch chuyển nick").<br>• Còn lại một <b>nick</b>: 3′-OH và 5′-phosphate kề nhau nhưng chưa nối. <b>DNA ligase</b> tạo liên kết phosphodiester cuối cùng (ở <i>E. coli</i> dùng NAD⁺, ở người dùng ATP).<br>Đoạn đã nối chuyển sang màu xanh đậm đồng nhất. Ở nhân thực, mồi được gỡ bởi <b>RNase H + FEN1</b>, ligase I nối.' },
    { title: 'Bàn tay polymerase & đọc sửa (proofreading)', text: 'DNA polymerase có hình <b>bàn tay phải</b>:<br>• <b>Lòng bàn tay</b> (palm): trung tâm xúc tác, 2 ion Mg²⁺.<br>• <b>Ngón tay</b> (fingers): đón dNTP, khép lại khi base bắt cặp đúng.<br>• <b>Ngón cái</b> (thumb): giữ DNA.<br>Nếu gắn nhầm, đầu 3′ <b>không khớp</b> và không kéo dài tiếp được. Đầu sai được chuyển từ vị trí <b>P</b> (polymerizing) sang vị trí <b>E</b> (editing). Ở đó <b>exonuclease 3′→5′</b> cắt bỏ nucleotide sai, rồi đầu 3′ quay về P làm lại.<br>Bấm nút để thử.' },
    { title: 'Vì sao chỉ tổng hợp 5′→3′?', text: 'So sánh 2 cách:<br>• <b>Thực tế (5′→3′)</b>: năng lượng (triphosphate) nằm ở <b>nucleotide mới đến</b>. Nếu cắt bỏ nucleotide sai, đầu chuỗi vẫn là 3′-OH. Nucleotide tiếp theo tự mang năng lượng tới, nên chuỗi kéo dài tiếp được ✓.<br>• <b>Giả định (3′→5′)</b>: năng lượng nằm ở <b>đầu chuỗi</b>. Nếu cắt bỏ nucleotide sai, đầu chuỗi chỉ còn 1 phosphate, <b>hết năng lượng</b>, chuỗi dừng hẳn ✗.<br>Vậy chiều 5′→3′ là điều kiện để <b>đọc sửa được</b>. Đó là cách DNA đạt độ chính xác ~10⁻⁷ (10⁻⁹–10⁻¹⁰ khi có thêm sửa bắt cặp sai).' },
  ],

  application: `<ul>
  <li><b>PCR</b> bắt chước chạc sao chép: nhiệt thay helicase, mồi DNA tổng hợp sẵn thay primase. <b>Taq</b> không có exo 3′→5′, sai ~1/10⁴–10⁵. <b>Pfu/Q5</b> có đọc sửa, chính xác hơn khoảng 10–100 lần, dùng khi cần nhân dòng gene.</li>
  <li><b>Giải trình tự Sanger</b>: thêm ddNTP (không có 3′-OH) làm chuỗi dừng ở từng vị trí.</li>
  <li><b>Thuốc kháng virus</b>: AZT (HIV), acyclovir (herpes) là nucleotide "giả" thiếu 3′-OH, gắn vào thì chuỗi dừng.</li>
  <li><b>Kháng sinh quinolone</b> (ciprofloxacin, levofloxacin) khóa <b>gyrase</b> và topo IV của vi khuẩn. <b>Thuốc ung thư</b>: camptothecin/irinotecan (khóa topo I), etoposide/doxorubicin (khóa topo II).</li>
  <li><b>Gene đột biến "mutator"</b>: hỏng exo 3′→5′ của Pol ε/δ (POLE, POLD1) gây ung thư đại tràng với hàng nghìn đột biến điểm. Nhóm bệnh nhân này đáp ứng rất tốt với liệu pháp miễn dịch.</li>
  <li><b>Vấn đề đầu mút</b>: ở đầu NST thẳng, mồi cuối cùng của mạch chậm bị gỡ đi mà không lấp lại được, nên NST ngắn dần sau mỗi lần chép. <b>Telomerase</b> bù lại (bài 7).</li></ul>`,

  distinguish: `<h3>Mạch dẫn và mạch chậm</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Mạch dẫn (leading)</th><th>Mạch chậm (lagging)</th></tr>
  <tr><td>Tổng hợp</td><td><b>Liên tục</b></td><td><b>Gián đoạn</b> (đoạn Okazaki)</td></tr>
  <tr><td>Hướng so với chạc</td><td>Cùng chiều chạc tiến</td><td>Ngược chiều chạc tiến</td></tr>
  <tr><td>Chiều tổng hợp</td><td>5′→3′</td><td>5′→3′ (mỗi đoạn)</td></tr>
  <tr><td>Số mồi</td><td>1 (ở ori)</td><td>Nhiều (mỗi đoạn 1 mồi)</td></tr>
  <tr><td>Cần ligase?</td><td>Ít (chỉ chỗ gặp nhau)</td><td>Rất nhiều lần</td></tr>
  <tr><td>Khuôn chạy theo hướng chạc</td><td>3′→5′</td><td>5′→3′</td></tr></table></div>
  <h3>Các enzyme ở chạc (E. coli → nhân thực)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Việc</th><th>E. coli</th><th>Nhân thực</th><th>Phá/tạo liên kết gì</th></tr>
  <tr><td>Tháo xoắn</td><td>Helicase <b>DnaB</b> (5′→3′, mạch khuôn chậm)</td><td><b>CMG</b> (Cdc45–MCM2-7–GINS, 3′→5′, mạch khuôn dẫn)</td><td>Phá liên kết H (ATP)</td></tr>
  <tr><td>Nhả siêu xoắn</td><td>Gyrase (topo II), topo IV</td><td>Topo I, topo II</td><td>Cắt rồi nối phosphodiester</td></tr>
  <tr><td>Giữ mạch đơn</td><td>SSB</td><td>RPA</td><td>Không tạo liên kết cộng hóa trị</td></tr>
  <tr><td>Đặt mồi</td><td>Primase <b>DnaG</b> (tự do)</td><td>Primase gắn với <b>Pol α</b></td><td>Tạo phosphodiester (RNA)</td></tr>
  <tr><td>Kéo dài chính</td><td><b>Pol III</b> (cả 2 mạch)</td><td><b>Pol ε</b> (dẫn), <b>Pol δ</b> (chậm)</td><td>Tạo phosphodiester</td></tr>
  <tr><td>Kẹp trượt</td><td>Kẹp β (+ γ complex nạp kẹp)</td><td>PCNA (+ RFC)</td><td>—</td></tr>
  <tr><td>Gỡ mồi</td><td><b>Pol I</b> (exo 5′→3′)</td><td>RNase H + FEN1</td><td>Cắt RNA, lấp DNA</td></tr>
  <tr><td>Nối nick</td><td>Ligase (NAD⁺)</td><td>Ligase I (ATP)</td><td>Tạo phosphodiester cuối</td></tr></table></div>
  <h3>2 hoạt tính exonuclease (rất dễ nhầm)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Exo 3′→5′</th><th>Exo 5′→3′</th></tr>
  <tr><td>Làm gì</td><td><b>Đọc sửa</b>: cắt nucleotide sai vừa gắn ở đầu 3′</td><td><b>Gỡ mồi RNA</b> phía trước (dịch chuyển nick)</td></tr>
  <tr><td>Có ở</td><td>Pol III (tiểu phần ε), Pol I, Pol δ, Pol ε</td><td>Pol I (không có ở Pol III)</td></tr>
  <tr><td>Hướng cắt</td><td>Lùi lại, ngược chiều tổng hợp</td><td>Đi tới, cùng chiều tổng hợp</td></tr></table></div>
  <h3>Pol I và Pol III (E. coli)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Pol III</th><th>Pol I</th></tr>
  <tr><td>Vai trò</td><td>Sao chép chính, cả 2 mạch</td><td>Gỡ mồi, lấp chỗ trống, sửa chữa</td></tr>
  <tr><td>Tốc độ / độ bền bám</td><td>~1000 nt/s, rất cao (kẹp β)</td><td>~20 nt/s, thấp</td></tr>
  <tr><td>Exo 3′→5′</td><td>Có (ε)</td><td>Có</td></tr>
  <tr><td>Exo 5′→3′</td><td>Không</td><td><b>Có</b></td></tr></table></div>
  <div class="box info">⚠️ Slide ghi "nhân sơ có 1 loại DNA polymerase" là cách nói đơn giản hóa. <i>E. coli</i> có Pol I–V: Pol III chép chính, Pol I gỡ mồi, Pol II/IV/V sửa chữa và chép qua tổn thương.</div>`,

  traps: [
    { trap: 'Mạch chậm được tổng hợp theo chiều 3′→5′.', truth: 'Cả 2 mạch mới đều tổng hợp <b>5′→3′</b>. Mạch chậm chỉ "gián đoạn" vì hướng 5′→3′ của nó ngược với hướng chạc tiến.' },
    { trap: 'Mạch dẫn không cần mồi.', truth: 'Mạch dẫn vẫn cần <b>1 mồi</b> ở điểm khởi đầu (ori). Chỉ là nó cần ít mồi, còn mạch chậm cần <b>mỗi đoạn Okazaki 1 mồi</b>.' },
    { trap: 'Helicase cắt mạch DNA.', truth: 'Helicase <b>phá liên kết hydrogen</b> giữa 2 mạch, dùng ATP. Enzyme cắt rồi nối lại liên kết phosphodiester là <b>topoisomerase</b>.' },
    { trap: 'Primase là một DNA polymerase.', truth: 'Primase là <b>RNA polymerase</b>, tổng hợp mồi bằng <b>RNA</b>. Nó tự bắt đầu được mà không cần mồi.' },
    { trap: 'Ligase lấp chỗ trống giữa các đoạn Okazaki.', truth: 'Ligase <b>chỉ nối nick</b> (3′-OH và 5′-P đã kề nhau). Lấp chỗ trống (gap) là việc của <b>polymerase</b> (Pol I).' },
    { trap: 'Pol III gỡ mồi RNA.', truth: 'Pol III <b>không có exo 5′→3′</b>. <b>Pol I</b> gỡ mồi bằng exo 5′→3′ và lấp DNA vào.' },
    { trap: 'Đọc sửa dùng exonuclease 5′→3′.', truth: 'Đọc sửa dùng <b>exo 3′→5′</b> (cắt lùi từ đầu 3′ vừa gắn sai). Exo 5′→3′ là để gỡ mồi phía trước.' },
    { trap: 'Polymerase đọc khuôn theo chiều 5′→3′.', truth: 'Polymerase <b>đọc khuôn 3′→5′</b> và <b>tổng hợp mạch mới 5′→3′</b> (ngược chiều nhau).' },
    { trap: 'Topoisomerase hoạt động phía sau chạc.', truth: 'Topoisomerase hoạt động <b>phía trước chạc</b>, nơi siêu xoắn dương tích tụ.' },
  ],

  quiz: [
    { q: 'Vì sao mạch chậm phải tổng hợp gián đoạn?', ops: ['Vì khuôn của nó bị hỏng', 'Vì polymerase chỉ tổng hợp 5′→3′ mà khuôn của nó ngược hướng chạc tiến', 'Vì helicase chỉ mở được từng đoạn', 'Vì nó được tổng hợp bằng RNA'], a: 1, e: 'Polymerase chỉ gắn vào 3′-OH (5′→3′) và cần mồi. Trên khuôn mạch chậm, hướng 5′→3′ đi ra xa chạc, nên phải làm từng đoạn ngắn, mỗi đoạn 1 mồi.' },
    { q: 'Enzyme nào phá liên kết hydrogen giữa 2 mạch DNA?', ops: ['Topoisomerase', 'Ligase', 'Helicase', 'Primase'], a: 2, e: 'Helicase dùng ATP để tách 2 mạch. Topoisomerase cắt/nối phosphodiester để nhả xoắn phía trước.' },
    { q: 'Ở E. coli, enzyme nào gỡ mồi RNA và thay bằng DNA?', ops: ['Pol III', 'Pol I', 'Primase', 'Ligase'], a: 1, e: 'Pol I có exo 5′→3′ để gỡ ribonucleotide phía trước và hoạt tính polymerase để lấp DNA. Pol III không có exo 5′→3′.' },
    { q: 'Hoạt tính "đọc sửa" của DNA polymerase là:', ops: ['Endonuclease cắt giữa mạch', 'Exonuclease 5′→3′', 'Exonuclease 3′→5′', 'Hoạt tính ligase'], a: 2, e: 'Nucleotide sai ở đầu 3′ được chuyển sang vị trí E và bị exo 3′→5′ cắt bỏ, sau đó polymerase quay về vị trí P.' },
    { q: 'DNA ligase cần điều kiện gì để nối?', ops: ['Một khoảng trống vài nucleotide', 'Đầu 3′-OH và đầu 5′-phosphate nằm kề nhau (nick)', 'Một mồi RNA', 'Hai mạch đã tách rời'], a: 1, e: 'Ligase chỉ tạo liên kết phosphodiester tại nick. Chỗ trống phải được polymerase lấp trước.' },
    { q: 'Nếu khóa gyrase bằng ciprofloxacin, điều gì xảy ra ở chạc?', ops: ['Mạch đơn tự bắt cặp', 'Siêu xoắn dương tích tụ phía trước, chạc dừng lại', 'Mồi RNA không được gỡ', 'Đoạn Okazaki không được nối'], a: 1, e: 'Gyrase (topo II) giải tỏa siêu xoắn phía trước chạc. Khóa nó thì DNA phía trước xoắn chặt, helicase không mở tiếp được.' },
    { q: 'Vì sao DNA polymerase chỉ tổng hợp 5′→3′ lại có lợi?', ops: ['Vì nhanh hơn', 'Vì năng lượng nằm ở dNTP mới đến, nên cắt bỏ nucleotide sai vẫn kéo dài tiếp được', 'Vì không cần mồi', 'Vì khuôn chỉ đọc được 5′→3′'], a: 1, e: 'Nếu tổng hợp 3′→5′, triphosphate nằm ở đầu chuỗi. Sau khi đọc sửa cắt bỏ nucleotide sai, đầu chuỗi hết năng lượng và không kéo dài được nữa.' },
    { q: 'Protein nào giữ Pol III bám chặt vào DNA để chép liên tục hàng trăm nghìn nt?', ops: ['SSB', 'Kẹp trượt β', 'DnaG', 'Gyrase'], a: 1, e: 'Kẹp β là vòng ôm quanh DNA, nối với Pol III, giúp tăng processivity. Tương đương ở nhân thực là PCNA.' },
  ],

  recall: [
    'Vẽ tay chạc ba: ghi đủ 5′/3′ cho 2 mạch khuôn và 2 mạch mới, vị trí helicase, topoisomerase, SSB, primase, Pol III (×2), kẹp β, Pol I, ligase.',
    'Liệt kê theo thứ tự thời gian những gì xảy ra với 1 đoạn Okazaki: từ lúc khuôn lộ ra đến lúc nối xong. Mỗi bước do enzyme nào làm, phá/tạo liên kết gì?',
    'Giải thích bằng lời (không nhìn): vì sao chiều 5′→3′ cho phép đọc sửa, còn chiều 3′→5′ thì không?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const X1 = V(1, 0, 0), _d = V(), _a = V(), _b = V();
    const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const hash = (u) => { const x = Math.sin(u * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
    const baseOf = (u) => 'ATGC'[Math.floor(hash(u) * 4) % 4];
    const placeBase = (m, from, to, f = 0.46) => {
      _d.subVectors(to, from); const L = Math.max(0.01, _d.length() * f); _d.normalize();
      m.scale.set(L, 1, 1); m.position.copy(from).addScaledVector(_d, L / 2); m.quaternion.setFromUnitVectors(X1, _d);
    };

    // ===================== FORK (conveyor through a stationary replisome) =====================
    const forkG = api.group();
    const N = 70, RISE = 0.34, R = 0.55, YT = 1.75, GAP = 1.1, FORKX = 2.4, XOFF = -12.4, BPT = 10.5, FRAG = 13;
    const sphG = new THREE.SphereGeometry(0.13, 12, 8), baseG = new THREE.BoxGeometry(1, 0.11, 0.2);
    const mS = (col) => { const m = new THREE.Mesh(sphG, api.mat(col)); forkG.add(m); return m; };
    const mB = () => { const m = new THREE.Mesh(baseG, api.mat(0xffffff)); forkG.add(m); return m; };
    const mK = (col, r = 0.05) => api.stick(V(), V(0, 1, 0), r, col, forkG);
    const slots = [];
    for (let k = 0; k < N; k++) slots.push({
      tS: mS(C.dna1), tB: mB(), bS: mS(C.dna2), bB: mB(), hb: mK(0xffffff, 0.022),
      lS: mS(NEW), lB: mB(), gS: mS(NEW), gB: mB(),
      tK: mK(C.dna1), bK: mK(C.dna2), lK: mK(NEW), gK: mK(NEW),
      pt: V(), pb: V(), pl: V(), pg: V(), u: -1, o: 0, hasL: false, gInfo: null,
    });
    slots.forEach(s => s.hb.material.opacity = 0.7);

    // supercoil warning sleeve
    const sleeve = api.cylinder(0.95, 0.95, 5.2, 0xff453a, forkG, { opacity: 0, depthWrite: false }); sleeve.rotation.z = Math.PI / 2; sleeve.position.set(FORKX + 2.9, 0, 0);

    // enzymes
    const ghost = (col, r, sc, seed, op = 0.5) => api.blob(r, col, forkG, { seed, scale: sc, mat: { opacity: op, depthWrite: false } });
    const helG = api.group(forkG);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const s = api.sphere(0.2, HEL, helG, { opacity: 0.85 }); s.position.set(0, Math.cos(a) * 0.36, Math.sin(a) * 0.36); }
    const topo = ghost(TOPO, 0.85, [0.9, 1.25, 1.25], 2, 0.42); topo.position.set(FORKX + 3.6, 0, 0);
    const topoCut = api.torus(0.95, 0.05, 0xffffff, forkG, { opacity: 0, emissive: 0xffffff }); topoCut.rotation.y = Math.PI / 2; topoCut.position.copy(topo.position);
    const prim = ghost(PRIM, 0.4, [1, 0.8, 0.9], 3, 0.7);
    const p3L = ghost(POL3, 0.62, [1.25, 1.0, 1.0], 4, 0.45), p3G = ghost(POL3, 0.62, [1.25, 1.0, 1.0], 5, 0.45);
    const clL = api.torus(0.78, 0.08, CLAMP, forkG, { opacity: 0.85 }), clG = api.torus(0.78, 0.08, CLAMP, forkG, { opacity: 0.85 });
    clL.rotation.y = clG.rotation.y = Math.PI / 2;
    const pol1 = ghost(POL1, 0.45, [1, 0.9, 0.9], 6, 0.35), lig = ghost(LIG, 0.38, [1, 1, 1], 7, 0.75);
    const ssbs = Array.from({ length: 14 }, (_, k) => api.blob(0.19, SSBC, forkG, { seed: k, mat: { opacity: 0.9 } }));
    const dirA = api.group(forkG); arrow(api, [FORKX + 1.2, 2.75, 0], [FORKX + 3.6, 2.75, 0], 0xffffff, dirA, 0.04);

    // labels
    lb.add('k_dir', 'chạc tiến về phía này', [FORKX + 2.4, 3.15, 0], forkG, 'dim');
    lb.add('k_hel', 'Helicase DnaB (ATP)', [0, 0, 0], forkG, '');
    lb.add('k_topo', 'Topoisomerase (gyrase)', [FORKX + 3.6, 1.45, 0], forkG, '');
    lb.add('k_ssb', 'SSB', [0, 0, 0], forkG, '');
    lb.add('k_prim', 'Primase (DnaG)', [0, 0, 0], forkG, '');
    lb.add('k_p3L', 'Pol III + kẹp β', [0, 0, 0], forkG, '');
    lb.add('k_p3G', 'Pol III + kẹp β', [0, 0, 0], forkG, '');
    lb.add('k_p1', 'Pol I gỡ mồi', [0, 0, 0], forkG, '');
    lb.add('k_lig', 'Ligase nối nick', [0, 0, 0], forkG, 'good');
    lb.add('k_lead', 'MẠCH DẪN: liên tục (5′ → 3′)', [-5.6, YT + 0.6, 0], forkG, 'good');
    lb.add('k_lag', 'MẠCH CHẬM: từng đoạn Okazaki (3′ ← 5′)', [-6.2, -YT - 1.35, 0], forkG, 'good');
    lb.add('k_primer', 'mồi RNA', [0, 0, 0], forkG, 'plain');
    lb.add('k_nick', 'nick', [0, 0, 0], forkG, 'warn');
    lb.add('k_t3', '3′', [-8.6, YT + 0.45, 0], forkG, 'plain'); lb.add('k_b5', '5′', [-8.6, -YT - 0.45, 0], forkG, 'plain');
    lb.add('k_t5', '5′', [8.6, 0.95, 0], forkG, 'plain'); lb.add('k_b3', '3′', [8.6, -0.95, 0], forkG, 'plain');
    lb.add('k_l5', '5′ (…mồi ở ori)', [-8.2, YT - GAP - 0.4, 0], forkG, 'dim');
    lb.add('k_l3', '3′', [0, YT - GAP - 0.35, 0], forkG, 'plain');
    lb.add('k_sc', '⚠️ siêu xoắn dương tích tụ, chạc chậm dần rồi dừng', [FORKX + 3.4, -2.3, 0], forkG, 'warn');
    lb.add('k_hp', '⚠️ mạch đơn tự bắt cặp, rối như kẹp tóc, polymerase kẹt', [0.2, -3.0, 0], forkG, 'warn');
    lb.add('k_new', 'DNA mẹ', [7.6, -1.75, 0], forkG, 'dim');

    // ---- simulation state ----
    let shift = 0, frags = [], fid = 0, over = 0, ns = 0, speed = 1, topoOff = false, ssbOff = false, cutT = 0;
    const forkU = () => (shift + FORKX - XOFF) / RISE;
    const xOf = (u) => u * RISE - shift + XOFF;
    const leadEnd = () => forkU() - 4.3;
    function sim(dt) {
      const ds = dt * speed;
      shift += 0.6 * (1 - 0.94 * over) * ds;
      const fu = forkU(), last = frags[frags.length - 1];
      if (!last || fu - 3.6 - last.p >= FRAG) frags.push({ id: fid++, p: Math.floor(fu - 3.6), len: 0, end: Math.floor(fu - 3.6) + 1, st: 'prim', rep: 0, lig: false, ligT: 0 });
      const lagRate = 7.5 * (1 - 0.85 * ns);
      frags.forEach((f, i) => {
        const prev = frags[i - 1];
        if (f.st === 'prim') { f.len = Math.min(3, f.len + ds * 4); f.end = f.p - f.len + 1; if (f.len >= 3 && !frags.some(g => g.st === 'pol3')) f.st = 'pol3'; }
        else if (f.st === 'pol3') { const stop = prev ? prev.p + 1 : f.p - FRAG + 1; f.end = Math.max(stop, f.end - ds * lagRate); if (f.end <= stop + 1e-6) f.st = 'done'; }
        else if (prev && (f.wait = (f.wait || 0) + ds) < 1.2) { /* Pol I arrives */ }
        else if (prev && prev.rep < 3) prev.rep = Math.min(3, prev.rep + ds * 0.5);
        else if (prev && !prev.lig) { prev.ligT += ds; if (prev.ligT > 1.8) prev.lig = true; }
      });
      const uLo = Math.ceil((shift - 0.5) / RISE);
      while (frags.length > 4 && frags[1].p < uLo - 4) frags.shift();
    }
    for (let i = 0; i < 900; i++) sim(0.05);

    const lagAt = (u) => {
      for (let i = frags.length - 1; i >= 0; i--) {
        const f = frags[i];
        if (u <= f.p && u >= Math.ceil(f.end - 1e-3)) {
          const inPrimer = u > f.p - 3, replaced = inPrimer && (f.p - u) < Math.floor(f.rep + 1e-6);
          return { f, i, inPrimer, replaced, piece: replaced ? f.id + 1 : f.id };
        }
      }
      return null;
    };
    const sealed = (id) => { const i = frags.findIndex(f => f.id === id); return i <= 0 || frags[i - 1].lig; };

    const geom = (u, s) => {
      const x = xOf(u), o = ease(clamp((FORKX - x) / 1.7));
      const ahead = Math.max(0, x - FORKX);
      const tw = 1 + (x > FORKX ? over * 1.6 * Math.exp(-ahead / 2.4) : 0);
      const a = 2 * Math.PI * (u - forkU()) / BPT * tw * (1 - o);
      const r = R + o * (YT - R);
      s.pt.set(x, r * Math.cos(a), r * Math.sin(a)); s.pb.set(x, -r * Math.cos(a), -r * Math.sin(a)); s.o = o;
    };

    function renderFork(t) {
      const fu = forkU(), uLo = Math.ceil((shift - 0.2) / RISE), le = leadEnd();
      for (let k = 0; k < N; k++) {
        const u = uLo + (((k - uLo) % N) + N) % N, s = slots[(u % N + N) % N];
        s.u = u; geom(u, s);
        s.hasL = u <= le; s.gInfo = s.o > 0.5 ? lagAt(u) : null;
        // no-SSB: bare single-stranded lagging template wiggles into hairpins
        if (!s.gInfo && s.o > 0.5 && ns > 0.01 && s.pb.x < FORKX - 0.3) { const w = ns * s.o; s.pb.y += w * 0.55 * Math.cos(u * 1.25 + t * 2); s.pb.z += w * 0.9 * Math.sin(u * 1.25 + t * 2); }
        s.pl.set(s.pt.x, s.pt.y - GAP, s.pt.z * 0.4);
        s.pg.set(s.pb.x, s.pb.y + GAP, s.pb.z * 0.4);
      }
      for (const s of slots) {
        const u = s.u, bt = baseOf(u), bb = COMP[bt];
        s.tS.position.copy(s.pt); s.bS.position.copy(s.pb);
        s.tB.material.color.setHex(C[bt]); s.bB.material.color.setHex(C[bb]);
        _a.lerpVectors(s.pb, s.pl, s.o); _b.lerpVectors(s.pt, s.pg, s.o);
        placeBase(s.tB, s.pt, _a); placeBase(s.bB, s.pb, _b);
        s.hb.visible = s.o < 0.1;
        if (s.hb.visible) { _a.copy(s.pt).lerp(s.pb, 0.46); _b.copy(s.pb).lerp(s.pt, 0.46); api.setStick(s.hb, _a, _b); }
        // leading
        s.lS.visible = s.lB.visible = s.hasL;
        if (s.hasL) { s.lS.position.copy(s.pl); s.lB.material.color.setHex(C[bb]); placeBase(s.lB, s.pl, s.pt); }
        // lagging
        const g = s.gInfo;
        s.gS.visible = s.gB.visible = !!g;
        if (g) {
          const rna = g.inPrimer && !g.replaced;
          s.gS.position.copy(s.pg);
          s.gS.material.color.setHex(rna ? RNA : sealed(g.piece) ? NEW : (g.piece % 2 ? NEWA : NEWB));
          s.gB.material.color.setHex(rna && bt === 'T' ? C.U : C[bt]);
          placeBase(s.gB, s.pg, s.pb);
        }
      }
      // backbones
      for (const s of slots) {
        const n = slots[((s.u + 1) % N + N) % N], ok = n.u === s.u + 1;
        s.tK.visible = s.bK.visible = ok;
        if (ok) { api.setStick(s.tK, s.pt, n.pt); api.setStick(s.bK, s.pb, n.pb); }
        s.lK.visible = ok && s.hasL && n.hasL; if (s.lK.visible) api.setStick(s.lK, s.pl, n.pl);
        const g = s.gInfo, h = n.gInfo;
        let con = ok && g && h && (g.piece === h.piece || (g.f === h.f && g.f.lig && false));
        if (ok && g && h && !con && g.piece !== h.piece) { const f = g.f; if (f.lig && s.u === f.p - 3) con = true; }
        s.gK.visible = !!con;
        if (con) { api.setStick(s.gK, s.pg, n.pg); const rna = (g.inPrimer && !g.replaced) && (h.inPrimer && !h.replaced); s.gK.material.color.setHex(rna ? RNA : sealed(g.piece) ? NEW : (g.piece % 2 ? NEWA : NEWB)); }
      }
      // enzymes
      const yb = (x) => { const tmp = { pt: V(), pb: V() }; geom(Math.round((x - XOFF + shift) / RISE), tmp); return tmp.pb; };
      const hp = yb(FORKX - 0.35); helG.position.copy(hp); helG.rotation.x = t * 3; helG.rotation.z = 0.5;
      lb.get('k_hel').position.set(FORKX + 0.9, -1.25, 0);
      topo.scale.setScalar(Math.max(0.001, 1 - over)); topo.rotation.x = t * 0.7;
      cutT = (cutT + 0.016 * speed) % 1.6; topoCut.material.opacity = (1 - over) * (cutT < 0.3 ? 0.6 * Math.sin(cutT / 0.3 * Math.PI) : 0);
      sleeve.material.opacity = 0.28 * over;
      const xl = xOf(le);
      p3L.position.set(xl + 0.32, YT - GAP / 2, 0.05); clL.position.set(xl - 0.32, YT - GAP / 2, 0);
      lb.get('k_p3L').position.set(xl + 0.3, YT + 0.95, 0);
      lb.get('k_l3').position.set(xl - 0.1, YT - GAP - 0.4, 0);
      // lagging polymerase: active fragment end, else waiting at the newest primer
      const act = frags.find(f => f.st === 'pol3'), newest = frags[frags.length - 1];
      const tgt = act ? xOf(act.end) - 0.25 : xOf(newest.p - 2) - 0.25;
      p3G.position.x = lerp(p3G.position.x || tgt, tgt, act ? 1 : 0.06); p3G.position.y = -YT + GAP / 2; p3G.position.z = 0.05;
      clG.position.set(p3G.position.x + 0.6, -YT + GAP / 2, 0);
      lb.get('k_p3G').position.set(p3G.position.x, -YT - 0.95, 0);
      const pr = frags.find(f => f.st === 'prim' && f.len < 3);
      const ptgt = pr ? V(xOf(pr.p - 1), -YT + GAP / 2 + 0.15, 0.55) : V(FORKX - 1.0, -0.75, 0.75);
      prim.position.lerp(ptgt, 0.08); lb.get('k_prim').position.set(prim.position.x + 0.2, prim.position.y + 0.85, 0);
      // Pol I / ligase work at the junction of a finished fragment and the previous one
      let p1 = null, lg = null;
      frags.forEach((f, i) => { const prev = frags[i - 1]; if (f.st === 'done' && prev && (f.wait || 0) >= 1.2) { if (prev.rep < 3) p1 = prev; else if (!prev.lig) lg = prev; } });
      pol1.visible = !!p1; if (p1) { pol1.position.set(xOf(p1.p - Math.floor(p1.rep)) + 0.15, -YT + GAP / 2, 0.25); lb.get('k_p1').position.set(pol1.position.x, -YT - 0.9, 0); }
      lig.visible = !!lg; if (lg) { lig.position.set(xOf(lg.p - 2.5), -YT + GAP / 2 - 0.05, 0.3); lig.scale.setScalar(1 + 0.15 * Math.sin(t * 12)); lb.get('k_lig').position.set(lig.position.x, -YT - 0.9, 0); }
      lb.show('k_p1', !!p1 && SHOW.has('k_p1')); lb.show('k_lig', !!lg && SHOW.has('k_lig'));
      // a visible primer and an unsealed nick to point at
      const pf = frags.slice().reverse().find(f => f.st !== 'prim' && f.rep < 1);
      if (pf) lb.get('k_primer').position.set(xOf(pf.p - 1), -0.1, 0);
      const nk = frags.find(f => f.rep >= 3 && !f.lig && xOf(f.p) > -9);
      lb.show('k_nick', !!nk && SHOW.has('k_nick')); if (nk) lb.get('k_nick').position.set(xOf(nk.p - 2.5), -0.05, 0);
      // SSB on bare lagging template
      let j = 0;
      for (const s of slots) {
        if (j >= ssbs.length) break;
        if (!s.gInfo && s.o > 0.6 && s.pb.x < FORKX - 0.6 && s.u % 2 === 0) { ssbs[j].position.set(s.pb.x, s.pb.y - 0.12, s.pb.z + 0.18); ssbs[j].scale.setScalar(1 - ns); ssbs[j].visible = true; j++; }
      }
      for (; j < ssbs.length; j++) ssbs[j].visible = false;
      const firstSSB = ssbs.find(b => b.visible); if (firstSSB) lb.get('k_ssb').position.set(firstSSB.position.x + 0.3, -YT - 1.55, 0);
      lb.show('k_ssb', !!firstSSB && SHOW.has('k_ssb') && ns < 0.5);
    }

    // ===================== POLYMERASE HAND (step 7) =====================
    const polG = api.group();
    const DX = 0.62, TY = -0.55, PY = 0.55, TPL = 'TACGGTACATGCTAGCATCGATCG';
    const ntMesh = (parent, col, b, up) => {
      const g = api.group(parent);
      api.sphere(0.2, col, g); const ph = api.sphere(0.11, C.phosphate, g); ph.position.set(-DX / 2, 0.12 * up, 0);
      const bs = api.box(0.42, 0.13, 0.2, C[b] ?? 0xcccccc, g); bs.rotation.z = Math.PI / 2; bs.position.set(0, 0.32 * up, 0);
      g.userData.base = bs; return g;
    };
    const dnaG = api.group(polG);
    const tpl = [...TPL].map((b, i) => { const n = ntMesh(dnaG, C.dna1, b, 1); n.position.set(i * DX, TY, 0); return n; });
    api.box(TPL.length * DX, 0.06, 0.06, C.dna1, dnaG).position.set((TPL.length - 1) * DX / 2, TY, 0);
    const primer = [];
    const K0 = 7;
    const addPrimerNt = (i, b, col = NEW) => { const n = ntMesh(dnaG, col, b, -1); n.position.set(i * DX, PY, 0); primer[i] = n; return n; };
    for (let i = 0; i < K0; i++) addPrimerNt(i, COMP[TPL[i]]);
    const primBB = api.box(1, 0.06, 0.06, NEW, dnaG); primBB.position.y = PY;
    // hand: palm, fingers (on a hinge), thumb, exo domain
    const SITE = V(0.35, PY, 0);
    const palm = ghost(0x9b6dd6, 1, [2.6, 0.75, 1.7], 11, 0.45); palm.position.set(0.1, -1.6, 0); polG.add(palm);
    const fHinge = api.group(polG); fHinge.position.set(1.6, -0.6, 0);
    const fing = ghost(0xb388ff, 0.8, [0.75, 1.6, 0.9], 12, 0.45); fing.position.set(-0.35, 1.6, 0.2); fHinge.add(fing);
    const thumb = ghost(0x7e57c2, 0.8, [1.0, 1.5, 0.8], 13, 0.4); thumb.position.set(-2.4, 0.4, -0.7); polG.add(thumb);
    const exo = ghost(0xff8a65, 0.7, [1, 0.9, 0.9], 14, 0.5); exo.position.set(-1.4, 2.1, 1.0); polG.add(exo);
    const mg = [0, 1].map(k => { const m = api.sphere(0.1, 0x7cfc00, polG, { emissive: 0x7cfc00, emissiveIntensity: 0.6 }); m.position.set(0.15 + k * 0.3, 0.02, 0.35); return m; });
    const flash = api.sphere(0.3, 0xffffff, polG, { opacity: 0, emissive: 0xffffff }); flash.position.copy(SITE).add(V(-0.3, 0, 0));
    // incoming dNTP
    const inc = api.group(polG);
    const incCore = api.group(inc); const incSug = api.sphere(0.2, NEW, incCore);
    const incBase = api.box(0.42, 0.13, 0.2, C.A, incCore); incBase.rotation.z = Math.PI / 2; incBase.position.set(0, -0.32, 0);
    const pA = api.sphere(0.11, C.phosphate, incCore); pA.position.set(-DX / 2, -0.12, 0);
    const ppi = api.group(inc); [0, 1].forEach(k => { const s = api.sphere(0.11, C.phosphate, ppi); s.position.set(-DX / 2 - 0.1 - k * 0.2, 0.12 + k * 0.16, 0); });
    lb.add('h_palm', 'Lòng bàn tay (palm): xúc tác, 2 Mg²⁺', [0.1, -2.75, 0], polG, '');
    lb.add('h_fing', 'Ngón tay (fingers): đón dNTP', [2.6, 2.3, 0], polG, '');
    lb.add('h_thumb', 'Ngón cái (thumb): giữ DNA', [-3.4, 1.85, 0], polG, '');
    lb.add('h_exo', 'Exo 3′→5′ = vị trí E (sửa)', [-1.4, 3.1, 1.0], polG, 'warn');
    lb.add('h_P', 'P', [0.35, 1.45, 0], polG, 'good');
    lb.add('h_t', 'khuôn: 3′ … đọc 3′→5′ → 5′', [-2.6, -0.95, 0.5], polG, 'dim');
    lb.add('h_p', '5′ mạch mới …', [-3.2, 1.05, 0.5], polG, 'dim');
    lb.add('h_ppi', 'PPi', [0, 0, 0], inc, 'plain');
    lb.add('h_msg', '', [0.3, -3.5, 0], polG, 'big');
    let k = K0, anim = null, queue = [], stats = { ok: 0, fix: 0 }, auto = true, autoI = 0;
    const AUTO = ['ok', 'ok', 'bad'];
    const syncDNA = (instant) => { const tx = SITE.x - k * DX; if (instant) dnaG.position.x = tx; return tx; };
    const primerBB = () => { primBB.scale.x = Math.max(0.01, (k - 1) * DX + 0.2); primBB.position.x = (k - 1) * DX / 2; };
    syncDNA(true); primerBB();
    const start = (type) => {
      const tb = TPL[k]; const right = COMP[tb];
      const wrong = { A: 'G', T: 'C', G: 'T', C: 'A' }[right];
      const b = type === 'bad' ? wrong : right;
      incBase.material.color.setHex(C[b]); incSug.material.color.setHex(type === 'bad' ? 0xff6b6b : NEW);
      inc.visible = true; ppi.visible = true; ppi.position.set(0, 0, 0); inc.position.set(2.8, 3.0, 0.4); incCore.position.set(0, 0, 0); incCore.rotation.set(0, 0, 0);
      anim = { type, t: 0, b };
    };
    const msg = (h) => lb.set('h_msg', h);
    function updPol(dt) {
      if (!anim) { if (queue.length) start(queue.shift()); else if (auto) start(AUTO[autoI++ % AUTO.length]); else return; }
      const A = anim; A.t += dt;
      const t = A.t, bad = A.type === 'bad';
      const at = V(SITE.x, SITE.y, 0);
      const dTarget = syncDNA(false);
      if (t < 0.9) { inc.position.lerpVectors(V(2.8, 3.0, 0.4), at, ease(t / 0.9)); fHinge.rotation.z = -0.45; msg(bad ? 'dNTP sai (G đối diện T…) đi vào' : 'dNTP đúng đi vào qua "ngón tay"'); }
      else if (t < 1.3) { inc.position.copy(at); fHinge.rotation.z = lerp(-0.45, bad ? -0.25 : 0, ease((t - 0.9) / 0.4)); if (bad) incCore.rotation.z = 0.35; }
      else if (t < 1.7) { flash.material.opacity = 0.8 * Math.sin((t - 1.3) / 0.4 * Math.PI); msg(bad ? 'vẫn bị nối (hiếm) nhưng cặp base lệch' : 'Mg²⁺ xúc tác: 3′-OH tấn công P-α → liên kết phosphodiester'); }
      else if (t < 2.4) { flash.material.opacity = 0; ppi.position.lerpVectors(V(0, 0, 0), V(-0.4, 2.3, 0.6), ease((t - 1.7) / 0.7)); fHinge.rotation.z = lerp(bad ? -0.25 : 0, -0.45, (t - 1.7) / 0.7); msg('PPi (β+γ) được nhả ra'); }
      if (!bad) {
        if (t >= 2.4 && !A.placed) { A.placed = true; inc.visible = false; addPrimerNt(k, A.b); k++; primerBB(); stats.ok++; }
        if (t >= 2.4 && t < 3.1) { dnaG.position.x = lerp(dnaG.position.x, dTarget, 0.15); msg('DNA trượt 1 bước → base tiếp theo vào vị trí P'); }
        if (t >= 3.1) { dnaG.position.x = dTarget; anim = null; }
      } else {
        if (t >= 2.4 && t < 3.4) { const e = ease((t - 2.4) / 1.0); inc.position.lerpVectors(at, V(-1.25, 1.6, 0.8), e); incCore.rotation.z = 0.35 + e; ppi.visible = false; msg('đầu 3′ không khớp → chuyển từ P sang vị trí E'); }
        else if (t >= 3.4 && t < 3.8) { flash.position.set(-1.25, 1.6, 0.8); flash.material.opacity = 0.8 * Math.sin((t - 3.4) / 0.4 * Math.PI); msg('✂️ exonuclease 3′→5′ cắt bỏ nucleotide sai'); }
        else if (t >= 3.8 && t < 4.8) { flash.material.opacity = 0; flash.position.copy(SITE).add(V(-0.3, 0, 0)); inc.position.lerpVectors(V(-1.25, 1.6, 0.8), V(-3.5, 3.6, 1.5), ease((t - 3.8) / 1.0)); msg('dNMP sai bị bỏ đi; đầu 3′-OH đúng quay lại P'); }
        else if (t >= 4.8) { inc.visible = false; stats.fix++; anim = null; queue.unshift('ok'); }
      }
      lb.get('h_ppi').position.copy(ppi.position).add(V(-0.7, 0.45, 0));
      lb.show('h_ppi', cur === 7 && ppi.visible && t > 1.7 && t < 2.4);
      if (cur === 7) api.readout(`Đã gắn đúng: <b>${stats.ok}</b> · Lỗi đã đọc sửa: <b>${stats.fix}</b>. Base selection sai ~1/10⁴–10⁵; đọc sửa giảm thêm ~100 lần → ~10⁻⁷.`);
      if (k >= TPL.length - 3) { primer.forEach(n => n && dnaG.remove(n)); primer.length = 0; k = K0; for (let i = 0; i < K0; i++) addPrimerNt(i, COMP[TPL[i]]); primerBB(); syncDNA(true); }
    }

    // ===================== 5'→3' vs 3'→5' (step 8) =====================
    const dirG = api.group();
    const ntS = (parent, col, b) => { const g = api.group(parent); api.sphere(0.22, col, g); const bs = api.box(0.15, 0.5, 0.2, C[b], g); bs.position.y = -0.42; g.userData.bs = bs; return g; };
    const P = (parent, x, y = 0.05) => { const s = api.sphere(0.12, C.phosphate, parent); s.position.set(x, y, 0); return s; };
    const ROWS = [];
    [[1.75, 'real'], [-1.95, 'hyp']].forEach(([y, kind]) => {
      const g = api.group(dirG); g.position.y = y;
      const chain = [0, 1, 2, 3, 4].map(i => { const n = ntS(g, kind === 'real' ? NEW : 0x9be15d, 'ATGCA'[i]); n.position.x = -4.6 + i * 0.8; return n; });
      [0, 1, 2, 3].forEach(i => P(g, -4.2 + i * 0.8));
      const oh = api.sphere(0.1, 0xff3b30, g, { emissive: 0xff3b30, emissiveIntensity: 0.4 });
      const mkInc = (b, col) => {
        const ig = api.group(g), n = ntS(ig, col, b);
        const pp = kind === 'real' ? [-0.4, -0.6, -0.8] : [0.4, 0.6, 0.8];
        const ps = pp.map(x => P(ig, x, 0.05 + Math.abs(x + (kind === 'real' ? 0.4 : -0.4)) * 0.25));
        ig.visible = false; return { g: ig, n, ps };
      };
      const n1 = mkInc('T', kind === 'real' ? NEW : 0x9be15d), n2 = mkInc('G', 0xff6b6b), n3 = mkInc('C', kind === 'real' ? NEW : 0x9be15d);
      const endP = kind === 'hyp' ? [0.4, 0.6, 0.8].map((x, i) => P(g, -1.4 + x, 0.05 + i * 0.05)) : null;
      ROWS.push({ g, kind, chain, oh, n1, n2, n3, endP });
    });
    lb.add('d_top', 'THỰC TẾ 5′→3′: năng lượng (PPP) nằm ở nucleotide MỚI ĐẾN', [-0.6, 3.05, 0], dirG, 'good');
    lb.add('d_bot', 'GIẢ ĐỊNH 3′→5′: năng lượng (PPP) nằm ở ĐẦU CHUỖI', [-0.6, -0.65, 0], dirG, 'warn');
    lb.add('d_tm', '', [-0.6, 0.6, 0], dirG, 'plain');
    lb.add('d_bm', '', [-0.6, -3.35, 0], dirG, 'plain');
    lb.add('d_oh', '3′-OH', [0, 0, 0], dirG, 'dim');
    const T8 = 10;
    const IN0 = V(3.6, 0.9, 0);
    const go = (inc, x, a, b, tt) => { const e = ease(clamp((tt - a) / (b - a))); inc.g.position.lerpVectors(IN0, V(x, 0, 0), e); inc.g.visible = tt >= a; };
    const flyOff = (objs, tt, a, b, dir) => { const e = clamp((tt - a) / (b - a)); objs.forEach((o, i) => { if (!o.userData.home) o.userData.home = o.position.clone(); o.position.copy(o.userData.home).add(V(dir[0] * e, dir[1] * e + i * 0.15 * e, 0)); o.visible = e < 1; }); };
    const resetP = (objs) => objs.forEach(o => { if (o.userData.home) o.position.copy(o.userData.home); o.visible = true; });
    function updDir(t) {
      const tt = t % T8;
      const [top, bot] = ROWS;
      // ---- real (5'->3') ----
      [top.n1, top.n2, top.n3].forEach(n => resetP(n.ps));
      go(top.n1, -0.6, 0.2, 1.4, tt); flyOff(top.n1.ps.slice(1), tt, 1.6, 2.3, [0.3, 1.2]);
      go(top.n2, 0.2, 2.6, 3.8, tt); flyOff(top.n2.ps.slice(1), tt, 4.0, 4.7, [0.3, 1.2]);
      if (tt > 5.2) { const e = ease(clamp((tt - 5.4) / 1.0)); top.n2.g.position.set(0.2 + e * 1.5, -e * 1.4, 0); top.n2.g.visible = e < 1; }
      go(top.n3, 0.2, 6.8, 8.0, tt); flyOff(top.n3.ps.slice(1), tt, 8.2, 8.9, [0.3, 1.2]);
      const lastTop = tt > 8.0 ? 0.2 : tt > 5.4 ? -0.6 : tt > 3.8 ? 0.2 : tt > 1.4 ? -0.6 : -1.4;
      top.oh.position.set(lastTop + 0.3, 0.12, 0.15);
      lb.get('d_oh').position.set(lastTop + 0.42, 2.25, 0);
      // ---- hypothetical (3'->5') ----
      [bot.n1, bot.n2, bot.n3].forEach(n => resetP(n.ps)); resetP(bot.endP);
      bot.oh.visible = false;
      go(bot.n1, -0.6, 0.2, 1.4, tt); flyOff(bot.endP.slice(1), tt, 1.2, 1.9, [-0.3, 1.2]);
      go(bot.n2, 0.2, 2.6, 3.8, tt); flyOff(bot.n1.ps.slice(1), tt, 3.6, 4.3, [-0.3, 1.2]);
      if (tt > 5.2) { const e = ease(clamp((tt - 5.4) / 1.0)); bot.n2.g.position.set(0.2 + e * 1.5, -e * 1.4, 0); bot.n2.g.visible = e < 1; }
      if (tt > 6.8) { const e = clamp((tt - 6.8) / 1.0), back = clamp((tt - 8.0) / 1.0); bot.n3.g.visible = back < 1; bot.n3.g.position.set(lerp(3.6, 1.15, ease(e)) + back * 2.5 + (tt > 7.8 && tt < 8.1 ? Math.sin(tt * 80) * 0.08 : 0), lerp(0.9, 0, ease(e)) + back * 0.6, 0); }
      else bot.n3.g.visible = false;
      // messages
      const ph = tt < 2.4 ? 0 : tt < 5.0 ? 1 : tt < 6.6 ? 2 : 3;
      lb.set('d_tm', ['Gắn đúng: 3′-OH của chuỗi tấn công P-α của dNTP mới; PPi rời đi', 'Gắn nhầm (đỏ)…', '✂️ Đọc sửa cắt nucleotide sai → đầu chuỗi vẫn là 3′-OH', '✓ dNTP tiếp theo tự mang PPP đến → kéo dài tiếp']);
      lb.set('d_tm', ['Gắn đúng: 3′-OH của chuỗi tấn công P-α của dNTP mới; PPi rời đi', 'Gắn nhầm (đỏ)…', '✂️ Đọc sửa cắt nucleotide sai → đầu chuỗi vẫn là 3′-OH', '✓ dNTP tiếp theo tự mang PPP đến → kéo dài tiếp'][ph]);
      lb.set('d_bm', ['Gắn đúng: nucleotide mới tấn công PPP ở đầu chuỗi; PPi rời đi', 'Gắn nhầm (đỏ)…', '✂️ Cắt nucleotide sai → đầu chuỗi chỉ còn 1 phosphate', '✗ Hết năng lượng ở đầu chuỗi → KHÔNG nối được nữa'][ph]);
      lb.get('d_bm').element.className = 'lbl ' + (ph === 3 ? 'warn' : 'plain');
      lb.get('d_tm').element.className = 'lbl ' + (ph === 3 ? 'good' : 'plain');
    }

    // ===================== controls & steps =====================
    let cur = 0;
    const sSpeed = api.slider('⏱️ Tốc độ', 0, 2, 0.1, 1, (v) => { speed = v; }, (x) => (+x).toFixed(1) + '×');
    const tTopo = api.toggle('⛔ Tắt topoisomerase', false, (v) => { topoOff = v; });
    const tSSB = api.toggle('🚫 Bỏ SSB', false, (v) => { ssbOff = v; });
    const bPol = api.buttons([['✅ Gắn dNTP đúng', () => { auto = false; queue.push('ok'); }], ['❌ Gắn nhầm → xem đọc sửa', () => { auto = false; queue.push('bad'); }], ['▶️ Tự chạy', () => { auto = true; }]]);
    const CTL = [[sSpeed.el, [0, 1, 2, 3, 4, 5, 6]], [tTopo.el, [1]], [tSSB.el, [2]], [bPol, [7]]];
    const groups = { forkG, polG, dirG };
    const VIS = [0, 0, 0, 0, 0, 0, 0, 1, 2].map(i => ['forkG', 'polG', 'dirG'][i]);
    const CAM = [
      [[-1.2, 0.5, 17.5], [-1.2, 0, 0]],
      [[3.4, 0.4, 12], [3.4, 0, 0]],
      [[-0.3, -0.9, 10], [-0.3, -1.0, 0]],
      [[0.2, -0.8, 9], [0.2, -1.0, 0]],
      [[-2.5, 1.4, 11.5], [-2.5, 0.9, 0]],
      [[-2.6, -1.0, 13.5], [-2.6, -0.9, 0]],
      [[-3.6, -0.9, 10.5], [-3.6, -1.0, 0]],
      [[-0.2, 0.3, 10.5], [-0.2, 0.1, 0]],
      [[-0.6, 0.1, 11.5], [-0.6, -0.1, 0]],
    ];
    const LBL = [
      ['k_dir', 'k_hel', 'k_topo', 'k_ssb', 'k_prim', 'k_p3L', 'k_p3G', 'k_p1', 'k_lig', 'k_lead', 'k_lag', 'k_t3', 'k_b5', 'k_t5', 'k_b3', 'k_new'],
      ['k_dir', 'k_hel', 'k_topo', 'k_sc', 'k_t5', 'k_b3', 'k_new'],
      ['k_ssb', 'k_hel', 'k_prim', 'k_hp', 'k_p3G'],
      ['k_prim', 'k_primer', 'k_hel', 'k_p3G'],
      ['k_p3L', 'k_lead', 'k_t3', 'k_l5', 'k_l3'],
      ['k_lag', 'k_p3G', 'k_primer', 'k_prim', 'k_b5', 'k_p1', 'k_lig', 'k_nick'],
      ['k_p1', 'k_lig', 'k_nick', 'k_primer'],
      ['h_palm', 'h_fing', 'h_thumb', 'h_exo', 'h_P', 'h_t', 'h_p', 'h_msg'],
      ['d_top', 'd_bot', 'd_tm', 'd_bm', 'd_oh'],
    ];
    let SHOW = new Set();
    const readFork = () => {
      const nPrim = frags.filter(f => f.st !== 'prim' && f.rep < 3 && xOf(f.p) > -9).length;
      const nNick = frags.filter(f => f.rep >= 3 && !f.lig && xOf(f.p) > -9).length;
      const s = cur;
      let h = `Đoạn Okazaki đã tạo: <b>${fid}</b> · mồi RNA đang chờ gỡ: <b>${nPrim}</b> · nick chưa nối: <b>${nNick}</b>`;
      if (s === 1) h = topoOff ? `⛔ Không có topoisomerase: độ xoắn phía trước <b>+${Math.round(over * 100)}%</b>, tốc độ chạc còn <b>${Math.round((1 - 0.94 * over) * 100)}%</b>.` : 'Topoisomerase cắt–xoay–nối liên tục phía trước chạc (vòng sáng = một lần cắt/nối).';
      if (s === 2) h = ssbOff ? '🚫 Không có SSB: mạch đơn tự gấp lại, polymerase mạch chậm gần như kẹt (tốc độ chỉ còn ~15%).' : 'SSB (trắng) phủ đoạn mạch đơn giữa chạc và đoạn Okazaki đang làm. Polymerase đi tới thì SSB bị đẩy ra.';
      if (s === 4) h = 'Mạch dẫn: 1 mồi ở ori (ngoài khung hình bên trái), sau đó kéo dài liên tục, bám sát sau helicase.';
      api.readout(h);
    };
    let rT = 0;
    const ctl = {
      setStep(s) {
        cur = s;
        for (const [k2, g] of Object.entries(groups)) { const on = VIS[s] === k2; g.visible = true; api.scaleTo(g, on ? 1 : 0.001, 6); }
        api.camera(...CAM[s]);
        if (s !== 1) { topoOff = false; tTopo.set(false); }
        if (s !== 2) { ssbOff = false; tSSB.set(false); }
        if (s === 7) { auto = true; }
        SHOW = new Set(LBL[s]); lb.only(LBL[s]);
        CTL.forEach(([el, st]) => { el.style.display = st.includes(s) ? '' : 'none'; });
        if (s <= 6) readFork();
        if (s === 8) api.readout('Hàng trên: cơ chế thật. Hàng dưới: thế giới giả định nếu polymerase tổng hợp 3′→5′. Quan sát đầu chuỗi sau khi đọc sửa.');
      },
      update(dt, t) {
        if (cur <= 6) {
          over += ((topoOff ? 1 : 0) - over) * Math.min(1, dt * 0.6);
          ns += ((ssbOff ? 1 : 0) - ns) * Math.min(1, dt * 1.5);
          sim(Math.min(dt, 0.05)); renderFork(t);
          rT += dt; if (rT > 0.3) { rT = 0; readFork(); }
        }
        if (cur === 7) updPol(Math.min(dt, 0.05));
        if (cur === 8) updDir(t);
      },
    };
    return ctl;
  },
};
