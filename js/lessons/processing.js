// Bài 13: Xử lý RNA nhân thực: mũ 5′, cắt & poly-A, cắt nối (spliceosome), miRNA.
import { labels } from './_kit.js';

export default {
  title: 'Xử lý RNA: mũ, đuôi poly-A, cắt nối & miRNA',
  sub: 'Phiên mã nhân thực tạo ra pre-mRNA "thô". Trước khi ra tế bào chất, nó được gắn mũ 5′, cắt một đuôi poly-A, và cắt bỏ intron. Một nhánh khác (miRNA) dùng cùng máy móc cắt RNA để tắt gene. Bài này đi qua từng bước và cho thấy đột biến ở đâu thì hỏng ở đó.',
  legend: '<span><i style="background:#f2994a"></i>exon (giữ lại)</span><span><i style="background:#9b9b9b"></i>intron (bị cắt)</span><span><i style="background:#ff3b30"></i>mũ m⁷G · AAUAAA</span><span><i style="background:#fff1a8"></i>đuôi poly-A</span><span><i style="background:#9b6dd6"></i>snRNP (U1, U2, U4/U6, U5)</span><span><i style="background:#2bb3a3"></i>Drosha · Exportin-5 · Dicer</span><span><i style="background:#7a8cff"></i>Argonaute (AGO)</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p>Một gene nhân thực có <b>exon</b> (đoạn được giữ lại) xen kẽ với <b>intron</b> (đoạn bị cắt bỏ). Pre-mRNA vừa phiên mã xong chưa dùng được. Tế bào phải <b>gắn mũ 5′</b> để bảo vệ và ribosome nhận diện, <b>cắt đuôi và thêm poly-A</b> để RNA bền và xuất ra, và <b>cắt intron, nối exon</b> để có một khuôn đọc liên tục.</p>
  <p>Ngoài ra, một lớp điều hòa khác: <b>miRNA</b> dài khoảng 22 nt bám vào mRNA đích và <b>tắt</b> nó. Cùng là RNA, cùng là cắt, nhưng khác mục đích: mRNA bình thường được "làm hoàn thiện", còn miRNA được "tiêu hủy".</p>`,

  without: `<ul>
  <li><b>Thiếu mũ 5′</b>: exonuclease phân hủy mRNA nhanh, và ribosome khó bám. Protein ít hoặc không có.</li>
  <li><b>Thiếu cắt poly-A (AAUAAA đột biến)</b>: RNA không có đuôi, không xuất được ra tế bào chất đúng cách, và bị phân hủy sớm. Đây là một nguyên nhân của nhiều bệnh do đột biến tín hiệu poly-A.</li>
  <li><b>Đột biến vị trí nối 5′ (GU→AU)</b>: U1 không bám được, spliceosome không lắp đúng, exon bị bỏ hoặc intron được giữ lại. Protein sai hoặc hỏng. Đây là cơ chế của nhiều thể β-thalassemia.</li>
  <li><b>Không có Dicer</b>: pre-miRNA không được cắt thành dạng trưởng thành 22 nt, không có RISC, nên mRNA đích không bị tắt. Gene đích biểu hiện cao hơn bình thường.</li></ul>
  <div class="box info">👉 Bước 4–6: bật <b>💥 vị trí nối 5′ GU→AU</b>. Bước 10: bật <b>💥 không có Dicer</b>. Bước 7: bật <b>Biến thể B</b> để thấy cùng một gene tạo hai mRNA khác nhau.</div>`,

  foundation: [
    { q: 'Exon và intron là gì?', a: '<b>Exon</b> là đoạn gene <b>được giữ lại</b> trong mRNA trưởng thành, và được dịch thành protein. <b>Intron</b> là đoạn <b>bị cắt bỏ</b> khỏi pre-mRNA trước khi ra tế bào chất. Gene người có nhiều intron nên pre-mRNA dài gấp nhiều lần mRNA trưởng thành.' },
    { q: 'Mũ 5′ (cap) là gì và gắn vào đâu?', a: 'Mũ 5′ là một <b>7-methylguanosine (m⁷G)</b> gắn vào đầu 5′ của mRNA bằng liên kết <b>5′–5′ đặc biệt</b> (qua 3 phosphate). Nó được thêm <b>ngay khi phiên mã mới bắt đầu</b>. Mũ bảo vệ đầu 5′ khỏi exonuclease và giúp ribosome nhận ra mRNA. Đầu 3′ thì được bảo vệ bởi đuôi poly-A cùng protein PABP bám trên nó.' },
    { q: 'Đuôi poly-A là gì và được tạo như thế nào?', a: 'Đuôi poly-A là khoảng <b>200 A</b> nối ở đầu 3′. Trước đó, một phức hợp nhận diện trình tự <b>AAUAAA</b> trên pre-mRNA và <b>cắt RNA</b> cách đó vài chục nt. Poly-A polymerase sau đó thêm đuôi A. Đuôi giúp mRNA bền và xuất ra tế bào chất.' },
    { q: 'snRNP là gì?', a: '<b>snRNP</b> (small nuclear ribonucleoprotein) là một <b>RNA nhỏ trong nhân</b> (snRNA) gắn với protein. Các snRNP chính là <b>U1, U2, U4, U5, U6</b>. Chúng nhận diện trình tự trên intron bằng cặp bắt RNA–RNA, và tập hợp thành spliceosome.' },
    { q: 'Spliceosome là gì?', a: '<b>Spliceosome</b> là một cỗ máy lớn gồm nhiều snRNP và protein, cắt intron và nối exon. Nó lắp ráp theo thứ tự: U1 bám vị trí nối 5′, U2 bám <b>điểm nhánh A</b>, rồi tri-snRNP (U4/U6/U5) đến. Cuối cùng cắt tạo <b>lariat</b> và nối hai exon.' },
    { q: 'miRNA là gì?', a: '<b>miRNA</b> (microRNA) là RNA ngắn khoảng <b>22 nt</b>, được Pol II phiên mã thành một hairpin dài (pri-miRNA). Gene miRNA <b>thường</b> là gene riêng, nhưng nhiều miRNA nằm trong <b>intron của một gene khác</b> (gene chủ). Nó không mã hóa protein. Vai trò: bám vào mRNA đích và <b>tắt</b> nó bằng cách ức chế dịch mã hoặc cắt mRNA.' },
    { q: 'Vì sao miRNA lại được gọi là "tắt" gene?', a: 'Vì nó bám một phần bổ sung với <b>3′UTR</b> của mRNA đích. Khi bắt cặp không hoàn toàn (thường là vùng seed, nt 2–8), mRNA ít được dịch hoặc bị phân hủy. Đây là điều hòa <b>sau phiên mã</b>, không thay đổi trình tự DNA.' },
    { q: 'Cắt nối thay thế (alternative splicing) là gì?', a: 'Cùng một pre-mRNA có thể được cắt theo <b>nhiều cách</b>: giữ hoặc bỏ một số exon. Ví dụ: A = exon 1-2-3, B = exon 1-3. Nhờ vậy <b>một gene tạo nhiều protein</b>. Người có khoảng 20.000 gene nhưng số protein lớn hơn nhiều nhờ cơ chế này.' },
  ],

  steps: [
    { title: 'Toàn cảnh: pre-mRNA "thô" và ba việc phải làm', text: 'Trên đường nằm ngang là một <b>pre-mRNA</b> với exon (cam) và intron (xám). Đầu 5′ chưa có mũ, gần cuối là vùng <b>AAUAAA</b> (đỏ), phía sau còn một đoạn RNA thừa và chưa có đuôi. Ở phía dưới là đường miRNA, sẽ xem ở bước 8–10. Tóm tắt: (1) gắn mũ, (2) cắt đuôi và thêm poly-A, (3) cắt intron. Mỗi việc có máy riêng.' },
    { title: 'Gắn mũ 5′ ngay khi phiên mã bắt đầu', text: 'Khi RNA mới dài khoảng 20–30 nt (Pol II vẫn đang phiên mã phía sau, mô hình không vẽ), <b>enzyme gắn mũ</b> (khối cam) gắn <b>m⁷G</b> (chấm đỏ lớn) vào đầu 5′. Liên kết là <b>5′–5′</b> qua cầu triphosphate, không phải liên kết 3′–5′ như bình thường. Mũ bảo vệ đầu 5′ khỏi exonuclease và giúp ribosome nhận ra mRNA.' },
    { title: 'Cắt tại AAUAAA và thêm đuôi poly-A', text: 'Phức hợp <b>CPSF/CstF</b> (khối xanh lục) nhận diện <b>AAUAAA</b> và cắt RNA cách đó 10–30 nt về phía 3′; đoạn phía sau chỗ cắt bị bỏ. Ở đầu 3′ mới, <b>poly-A polymerase</b> (khối vàng) thêm từng A mà không cần khuôn (chuỗi hạt vàng nhạt, thật khoảng 200 A). Đuôi cùng protein PABP giúp RNA bền và xuất ra tế bào chất.' },
    { title: 'Lắp spliceosome: U1 và U2 đánh dấu intron', text: '<b>U1 snRNP</b> bám vị trí nối 5′ (GU) ở đầu intron, <b>U2 snRNP</b> bám <b>điểm nhánh A</b> nằm gần đầu 3′ của intron. Các snRNP tím hạ xuống đúng chỗ. Nếu vị trí GU đột biến (bật 💥), U1 lơ lửng không bám được và cả quá trình hỏng từ đây.' },
    { title: 'Tri-snRNP U4/U6/U5 đến, lariat hình thành', text: 'Tri-snRNP <b>U4/U6/U5</b> đến; U1 và U4 rời đi, U6 thay chỗ. <b>Phản ứng 1</b>: nhóm 2′-OH của <b>A ở điểm nhánh</b> tấn công vị trí nối 5′, nên đầu 5′ của intron nối vào A và intron gập thành <b>lariat</b> (vòng có đuôi). Đây là bước chế biến RNA đặc trưng của nhân thực.' },
    { title: 'Nối exon, bỏ intron', text: '<b>Phản ứng 2</b>: đầu 3′-OH của exon 1 tấn công vị trí nối 3′ (AG), hai exon được <b>nối lại</b>, lariat bị loại ra rồi phân hủy (bay lên, mờ dần). Intron 2 được cắt theo cùng cách. Kết quả: mRNA trưởng thành chỉ còn exon, có mũ và đuôi, sẵn sàng ra tế bào chất.' },
    { title: 'Cắt nối thay thế: cùng gene, hai protein', text: 'Bật <b>Biến thể A / B</b>. Biến thể A giữ exon 2 (đường có 3 khối). Biến thể B bỏ exon 2 (chỉ còn 2 khối). Cùng pre-mRNA, cùng máy, khác lựa chọn cắt nối, cho ra hai mRNA và hai protein khác nhau. Đây là lý do một gene tạo nhiều sản phẩm.' },
    { title: 'miRNA: pri-miRNA → Drosha → pre-miRNA → Exportin-5', text: 'Đường dưới: <b>pri-miRNA</b> (Pol II phiên mã, thường từ gene riêng hoặc từ intron của một gene chủ) có một hairpin dài. Trong nhân, <b>Drosha</b> cùng DGCR8 (xanh ngọc) cắt hai bên gốc hairpin, còn lại <b>pre-miRNA</b> (~70 nt). <b>Exportin-5</b> đưa pre-miRNA qua lỗ nhân ra tế bào chất (vạch đứt là màng nhân).' },
    { title: 'Dicer cắt, Argonaute nạp, tìm mRNA đích qua vùng seed', text: '<b>Dicer</b> cắt bỏ vòng của pre-miRNA, còn duplex ~22 nt. Một protein <b>Argonaute</b> (AGO1–4, khối tím xanh) giữ một mạch (mạch dẫn, guide) và bỏ mạch kia, tạo <b>RISC</b>. RISC bám <b>3′UTR</b> của mRNA đích qua vùng <b>seed</b> (nt 2–8). Bắt cặp không hoàn toàn thì <b>ức chế dịch mã</b> (ribosome thưa dần); bắt cặp hoàn toàn thì <b>AGO2</b>, Argonaute duy nhất có hoạt tính cắt, sẽ <b>cắt</b> mRNA.' },
    { title: 'Kiểm chứng: 💥 không có Dicer', text: 'Bật <b>💥 không có Dicer</b>: pre-miRNA không được cắt thành duplex 22 nt, nên không có RISC. mRNA đích không bị tắt, ribosome vẫn dịch liên tục nên protein được tạo nhiều. Đây là một cách để biết miRNA có đang hoạt động không.' },
  ],

  application: `<ul>
  <li><b>Nusinersen (Spinraza) cho bệnh teo cơ tủy (SMA):</b> thuốc là một oligonucleotide đối nghĩa (antisense) gắn vào pre-mRNA của gene SMN2, làm exon 7 được giữ lại. Nhờ đó tạo nhiều protein SMN hoạt động hơn. Thuốc được FDA duyệt năm 2016. Đây là ví dụ điều chỉnh cắt nối bằng thuốc.</li>
  <li><b>β-thalassemia do lỗi cắt nối:</b> nhiều đột biến nằm đúng ở vị trí nối 5′ (GU) hoặc 3′ (AG) của intron gene β-globin. Hệ quả là exon bị bỏ hoặc intron được giữ, không tạo được β-globin bình thường.</li>
  <li><b>siRNA làm thuốc (patisiran):</b> siRNA dài 21–23 nt được đưa vào tế bào gan để tắt gene TTR (gây bệnh amyloid). Thuốc được FDA duyệt năm 2018. Cơ chế dùng chính máy RISC như miRNA, nhưng bắt cặp hoàn toàn nên AGO2 cắt mRNA.</li>
  <li><b>Vaccine và mRNA:</b> mRNA trong vaccine được tổng hợp với mũ 5′ và đuôi poly-A nhân tạo để bền và được dịch tốt. Đây chính là các bước trong bài này, làm ở ống nghiệm.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Mũ 5′ (cap)</th><th>Đuôi poly-A</th><th>Cắt nối (splicing)</th></tr>
  <tr><td>Gắn ở đâu</td><td>Đầu 5′</td><td>Đầu 3′ (sau khi cắt)</td><td>Giữa intron và exon</td></tr>
  <tr><td>Máy làm</td><td>Enzyme gắn mũ</td><td>Phức hợp cắt + poly-A polymerase</td><td>Spliceosome (U1, U2, U4/U6, U5)</td></tr>
  <tr><td>Tín hiệu</td><td>m⁷G (đầu 5′–5′)</td><td><b>AAUAAA</b></td><td>GU (5′), điểm nhánh A, AG (3′)</td></tr>
  <tr><td>Chức năng</td><td>Bảo vệ, ribosome nhận diện</td><td>Bền, xuất ra tế bào chất</td><td>Nối exon, bỏ intron</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>siRNA vs miRNA</td><td>siRNA: sợi đôi, bắt cặp hoàn toàn, thường <b>cắt</b> mRNA</td><td>miRNA: bắt cặp không hoàn toàn (seed), thường <b>ức chế</b> dịch mã</td></tr>
  <tr><td>Drosha vs Dicer</td><td>Drosha: cắt <b>trong nhân</b>, pri → pre-miRNA</td><td>Dicer: cắt <b>tế bào chất</b>, pre → duplex 22 nt</td></tr>
  <tr><td>Exon vs intron</td><td>Exon: <b>giữ lại</b>, được dịch</td><td>Intron: <b>bị cắt</b>, không có trong mRNA</td></tr>
  <tr><td>Lariat vs đuôi poly-A</td><td>Lariat: hình của <b>intron</b> trong lúc cắt nối</td><td>Poly-A: đuôi của <b>mRNA trưởng thành</b></td></tr>
  </table></div>
  <div class="box warn">⚠️ Đuôi poly-A <b>không có trong DNA</b>: trên gene không có đoạn T…T tương ứng. Nó được poly-A polymerase thêm vào sau khi cắt, không cần khuôn. Tương tự, mũ m⁷G cũng không được mã hóa bởi gene.</div>`,

  traps: [
    { trap: '"Mũ 5′ và đuôi poly-A được gắn trong tế bào chất."', truth: 'Cả mũ 5′ lẫn cắt-và-poly-A diễn ra <b>trong nhân</b>, trong lúc phiên mã. Chỉ dịch mã mới ở tế bào chất.' },
    { trap: '"Poly-A do AAUAAA được phiên mã thành đuôi."', truth: 'AAUAAA là <b>tín hiệu để cắt</b>. Đuôi A được thêm <b>sau khi cắt</b>, bởi poly-A polymerase, không phải bởi phiên mã.' },
    { trap: '"Intron là đoạn không quan trọng nên không cần cắt chính xác."', truth: 'Cắt sai một nt ở vị trí nối làm lệch khung đọc hoặc mất exon. Intron không mã hóa, nhưng vị trí cắt cực kỳ chính xác.' },
    { trap: '"Mọi gene đều cho ra một protein."', truth: 'Cắt nối thay thế cho phép một gene tạo nhiều protein. Gene người có khoảng 20.000 gene nhưng số protein lớn hơn nhiều.' },
    { trap: '"miRNA được tổng hợp trực tiếp từ DNA thành dạng 22 nt."', truth: 'miRNA được tạo từ <b>pri-miRNA</b> dài (Pol II), rồi Drosha cắt thành pre-miRNA (~70 nt), Exportin-5 đưa ra, và Dicer cắt thành 22 nt.' },
    { trap: '"Dicer cắt pri-miRNA trong nhân."', truth: 'Trong nhân cắt bởi <b>Drosha/DGCR8</b>. <b>Dicer</b> cắt pre-miRNA trong tế bào chất.' },
    { trap: '"miRNA luôn làm cắt mRNA đích."', truth: 'Bắt cặp không hoàn toàn (thường gặp với miRNA) thì chỉ <b>ức chế dịch mã</b>. Cắt mRNA là kiểu bắt cặp hoàn hảo, đặc trưng của siRNA.' },
    { trap: '"Đột biến ở vị trí nối 5′ chỉ làm giảm lượng mRNA."', truth: 'Nó làm <b>sai cắt nối</b>: exon bị bỏ hoặc intron được giữ, nên protein sai hoặc hỏng, không chỉ ít đi.' },
  ],

  quiz: [
    { q: 'Mũ 5′ (m⁷G) được gắn vào mRNA bằng liên kết nào và khi nào?', ops: ['3′–5′, sau khi cắt intron', '5′–5′, ngay khi phiên mã vừa bắt đầu', 'Peptide, ở ribosome', 'Hydro, sau khi ra tế bào chất'], a: 1, e: 'Mũ gắn liên kết 5′–5′ ngay khi đầu 5′ vừa ra khỏi polymerase. "3′–5′" là kiểu nối bình thường của mạch RNA, không phải của mũ.' },
    { q: 'Một đột biến làm AAUAAA không còn nhận diện được. Hậu quả chính là:', ops: ['Mất mũ 5′', 'Intron không được cắt', 'miRNA không được tạo', 'Mất khả năng cắt và thêm poly-A, RNA kém bền và ít xuất ra'], a: 3, e: 'AAUAAA là tín hiệu cắt để thêm poly-A. Không nhận diện được thì không có đuôi, RNA kém bền. Mũ không liên quan AAUAAA.' },
    { q: 'U1 snRNP bám vị trí nào trên intron?', ops: ['Vị trí nối 5′ (GU)', 'Điểm nhánh A', 'Vị trí nối 3′ (AG)', 'Đuôi poly-A'], a: 0, e: 'U1 bám vị trí nối 5′ (GU). U2 bám điểm nhánh A. Đây là trình tự khởi đầu lắp spliceosome.' },
    { q: 'Đột biến GU→AU ở vị trí nối 5′ của intron. Chuyện gì có khả năng xảy ra nhất?', ops: ['Không ảnh hưởng gì', 'Ribosome không dịch được', 'U1 không bám, cắt nối sai, exon bị bỏ hoặc intron được giữ', 'Mũ 5′ bị mất'], a: 2, e: 'Vị trí GU là chỗ U1 nhận diện. Đổi thành AU, U1 không bám, nên cắt nối lệch. "Không ảnh hưởng gì" là bẫy vì vị trí này rất quan trọng.' },
    { q: 'Vì sao miRNA có thể tắt nhiều mRNA khác nhau?', ops: ['Vì nó bắt cặp một phần với 3′UTR (vùng seed) của nhiều mRNA', 'Vì nó được gắn mũ', 'Vì nó mã hóa protein', 'Vì nó là một siRNA dài'], a: 0, e: 'Vùng seed bắt cặp không hoàn toàn với nhiều 3′UTR, nên một miRNA có nhiều mRNA đích. siRNA khác: bắt cặp hoàn toàn với một đích.' },
    { q: 'Enzyme nào cắt pre-miRNA thành duplex 22 nt trong tế bào chất?', ops: ['Drosha', 'Exportin-5', 'Argonaute (AGO)', 'Dicer'], a: 3, e: 'Dicer cắt vòng pre-miRNA thành duplex 22 nt. Drosha cắt trong nhân, Exportin-5 chỉ vận chuyển, AGO giữ một mạch làm lõi của RISC.' },
  ],

  recall: [
    'Vẽ một gene 3 exon, 2 intron, rồi ghi mũ 5′, AAUAAA, điểm nhánh A, vị trí GU và AG. Đánh dấu chỗ U1 và U2 bám.',
    'Vẽ đường miRNA: pri-miRNA → Drosha → pre-miRNA → Exportin-5 → Dicer → AGO/RISC → 3′UTR. Ghi enzyme nào làm ở nhân và enzyme nào ở tế bào chất.',
    'Viết 2 câu: vì sao đột biến GU→AU gây bệnh, còn đột biến ở exon thì có thể không gây bệnh. Và so sánh siRNA với miRNA về mức độ bắt cặp.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const tmp = new THREE.Vector3();
    const cl = (x) => Math.max(0, Math.min(1, x));
    const lerp = (a, b, u) => a + (b - a) * cl(u);
    const GREY = 0x9b9b9b, PA = 0xfff1a8, AGO = 0x7a8cff;

    // vật thể có độ mờ điều khiển theo khung hình: userData.base = độ mờ đầy đủ, userData.on = 0..1
    const FADE = [];
    const reg = (o, base = 1, on = 0) => {
      o.userData.base = base; o.userData.on = on;
      o.traverse(m => { if (m.material) { m.material.transparent = true; m.material.opacity = base * on; } });
      o.visible = on > 0.01; FADE.push(o); return o;
    };
    const fade = (o, on, dt, k = 5) => {
      const u = o.userData; u.on += ((on ? 1 : 0) - u.on) * (1 - Math.exp(-dt * k));
      o.traverse(m => { if (m.material) m.material.opacity = u.base * u.on; });
      o.visible = u.on > 0.01;
    };
    const fol = (o, to, dt, k = 6) => o.position.lerp(to, 1 - Math.exp(-dt * k));
    const DROP = V(0, 2.4, 0);
    const put = (o, on, to, dt, k = 6) => {
      if (on && o.userData.on < 0.02) o.position.copy(to).add(DROP);
      fade(o, on, dt); if (to) fol(o, to, dt, k);
    };

    // ---- lớp pre-mRNA (trong nhân, y = 0) ----
    const mG = api.group();
    const EX = { e1: [-12, -8], e2: [-3, 0], e3: [5, 9] };
    const W = (k) => EX[k][1] - EX[k][0], CX = (k) => (EX[k][0] + EX[k][1]) / 2;
    const exonG = new THREE.BoxGeometry(1, 0.9, 0.7);
    const exons = {};
    for (const k in EX) { const m = new THREE.Mesh(exonG, api.mat(C.rna)); m.scale.set(W(k), 1, 1); m.position.set(CX(k), 0, 0); mG.add(m); exons[k] = reg(m, 1, 1); }
    const arc = (a, b, h) => { const p = []; for (let k = 0; k <= 12; k++) { const t = k / 12; p.push(V(a + (b - a) * t, Math.sin(t * Math.PI) * h, 0)); } return p; };
    const i1 = reg(api.tube(arc(-8, -3, 1.2), 0.1, GREY, mG), 1, 1);
    const i2 = reg(api.tube(arc(0, 5, 1.2), 0.1, GREY, mG), 1, 1);
    const paBand = api.box(0.5, 1.0, 0.8, C.methyl, mG, { opacity: 0.85 }); paBand.position.set(8.3, 0, 0);
    const stub = reg(api.tube([V(9, 0, 0), V(9.8, 0.15, 0), V(10.6, -0.1, 0), V(11.4, 0.1, 0)], 0.1, GREY, mG), 1, 1);
    const cap = reg(api.sphere(0.38, C.methyl, mG, { emissive: C.methyl, emissiveIntensity: 0.3 }));
    cap.position.set(-12.4, 0, 0);
    const capEnz = reg(api.blob(0.5, 0xe0a050, mG, { seed: 3 }), 0.95);
    const cpsf = reg(api.blob(0.6, 0x5fbf9c, mG, { seed: 9 }), 0.9);
    const pap = reg(api.blob(0.42, 0xe7c86e, mG, { seed: 12 }), 0.95);
    const NPA = 12;
    const polyA = []; for (let k = 0; k < NPA; k++) { const b = api.sphere(0.15, PA, mG, { emissive: PA, emissiveIntensity: 0.25 }); b.visible = false; polyA.push(b); }
    // điểm nhánh A + lariat của intron 1
    const bpA = V(-4.2, 0.82, 0), lc = V(-5.6, 1.8, 0);
    const lar = api.group(mG);
    const loopPts = []; for (let k = 0; k <= 24; k++) { const a = Math.atan2(bpA.y - lc.y, bpA.x - lc.x) + k / 24 * Math.PI * 2; loopPts.push(V(lc.x + Math.cos(a) * 1.65, lc.y + Math.sin(a) * 1.05, Math.sin(k / 24 * Math.PI * 2) * 0.3)); }
    api.tube(loopPts, 0.1, GREY, lar);
    api.tube([bpA, V(-3.6, 0.5, 0), V(-3, 0, 0)], 0.1, GREY, lar);
    reg(lar, 1, 0);
    const aDot = reg(api.sphere(0.22, C.A, mG, { emissive: C.A, emissiveIntensity: 0.3 }), 1, 1); aDot.position.copy(bpA);
    const snU1 = reg(api.blob(0.55, C.protein, mG, { seed: 1 }), 0.95);
    const snU2 = reg(api.blob(0.5, C.protein, mG, { seed: 2 }), 0.95);
    const snTri = reg(api.blob(0.75, 0xb58ad6, mG, { seed: 4 }), 0.9);

    // ---- lớp miRNA (y = -7.2): màng nhân ở x = -1.5 ----
    const rG = api.group(); rG.position.y = -7.2;
    const XE = -1.5;
    const envG = api.group(rG);
    for (let k = 0; k < 9; k++) { if (k === 4) continue; const d = api.box(0.12, 0.55, 0.12, 0xd8b26e, envG, { opacity: 0.7 }); d.position.set(XE, -3.6 + k * 0.9, 0); }
    const flankL = reg(api.tube([V(-13, -0.7, 0), V(-11.8, -0.45, 0), V(-10.5, -0.25, 0)], 0.11, C.rna, rG), 1, 1);
    const flankR = reg(api.tube([V(-10.5, 0.25, 0), V(-11.8, 0.45, 0), V(-13, 0.7, 0)], 0.11, C.rna, rG), 1, 1);
    const preG = api.group(rG); preG.position.set(-10.5, 0, 0);
    const preLow = reg(api.tube([V(0, -0.25, 0), V(1.5, -0.25, 0), V(3, -0.25, 0)], 0.11, C.rna, preG), 1, 1);
    const preUp = reg(api.tube([V(3, 0.25, 0), V(1.5, 0.25, 0), V(0, 0.25, 0)], 0.11, 0xf7b97a, preG), 1, 1);
    const lp = []; for (let k = 0; k <= 16; k++) { const a = -Math.PI / 2 + k / 16 * Math.PI; lp.push(V(3 + Math.cos(a) * 0.4, Math.sin(a) * 0.25 * 1.6, 0)); }
    const preLoop = reg(api.tube(lp, 0.11, C.rna, preG), 1, 1);
    const rungs = []; for (let k = 0; k < 7; k++) { const r = api.stick(V(0.2 + k * 0.42, -0.25, 0), V(0.2 + k * 0.42, 0.25, 0), 0.04, 0xffffff, preG, { opacity: 0.6 }); rungs.push(r); }
    const drosha = reg(api.blob(0.75, C.enzyme, rG, { seed: 5 }), 0.85);
    const exp5 = reg(api.blob(0.6, 0x3fc7b8, rG, { seed: 6 }), 0.9);
    const dicer = reg(api.blob(0.85, 0x1f8f84, rG, { seed: 7 }), 0.85);
    const ago = reg(api.blob(0.7, AGO, rG, { seed: 8 }), 0.85);
    // mRNA đích: vùng mã hóa x 1.5..7, 3′UTR x 7.5..11.5
    const TY = -3.0;
    const target = api.tube([V(1.5, TY, 0), V(5, TY - 0.1, 0), V(8.5, TY + 0.05, 0), V(11.8, TY - 0.15, 0)], 0.12, C.rna, rG, { emissive: C.rna, emissiveIntensity: 0.4 });
    reg(target, 1, 0);
    const utr = reg(api.box(4.2, 0.36, 0.36, 0x9b6dd6, rG, { opacity: 0.35 }), 0.35); utr.position.set(9.6, TY, 0);
    const ribos = []; for (let k = 0; k < 3; k++) { const g = api.group(rG); const a = api.sphere(0.36, C.ribosome, g); a.position.y = 0.32; const b = api.sphere(0.26, C.ribosome, g); b.position.y = -0.18; reg(g, 0.9); ribos.push(g); }

    // ---- nhãn ----
    L.add('e1', 'exon 1', [0, 0, 0], mG, 'dim');
    L.add('e2', 'exon 2', [0, 0, 0], mG, 'dim');
    L.add('e3', 'exon 3', [0, 0, 0], mG, 'dim');
    L.add('intron', 'intron (bị cắt)', [-5.5, 2.0, 0], mG, 'dim');
    L.add('aaua', 'AAUAAA', [8.6, -1.15, 0], mG, 'warn');
    L.add('miLayer', 'đường miRNA (bước 8–10)', [-7, -4.6, 0], mG, 'dim');
    L.add('capEnz', 'enzyme gắn mũ', [-12.4, 2.0, 0], mG, 'dim');
    L.add('cap', 'mũ m⁷G (nối 5′–5′)', [-12.4, 1.3, 0], mG, 'warn');
    L.add('cpsf', 'CPSF/CstF nhận AAUAAA', [8.6, 2.1, 0], mG, 'dim');
    L.add('cut', '✂ cắt 10–30 nt sau AAUAAA', [10.2, -1.9, 0], mG, 'warn');
    L.add('polyA', 'poly-A polymerase thêm A (thật ~200)', [11.4, 2.2, 0], mG, 'good');
    L.add('u1', 'U1 → GU (vị trí nối 5′)', [-8.8, 2.1, 0], mG, 'big');
    L.add('u2', 'U2 → điểm nhánh A', [-3.4, 2.5, 0], mG, 'big');
    L.add('gu', '❌ GU→AU: U1 không bám', [-8.8, 3.2, 0], mG, 'warn');
    L.add('tri', 'U4/U6/U5 → lariat', [-5.8, 3.6, 0], mG, 'big');
    L.add('aLbl', 'A (điểm nhánh)', [-3.6, 0.2, 0.4], mG, 'dim');
    L.add('ligate', 'nối exon · lariat bị loại', [-6, -2.3, 0], mG, 'good');
    L.add('retain', '❌ intron 1 bị giữ lại', [-5.5, -2.3, 0], mG, 'warn');
    L.add('altA', 'biến thể A: exon 1-2-3', [-6, -2.3, 0], mG, 'good');
    L.add('altB', 'biến thể B: exon 1-3 (bỏ exon 2)', [-6, -2.3, 0], mG, 'warn');
    L.add('nuc', 'NHÂN', [-7, 3.7, 0], rG, 'dim');
    L.add('cyto', 'TẾ BÀO CHẤT', [1.6, 3.7, 0], rG, 'dim');
    L.add('pri', 'pri-miRNA (hairpin dài)', [-10.8, -1.5, 0], rG, 'dim');
    L.add('drosha', 'Drosha + DGCR8', [-10.4, 2.0, 0], rG, 'big');
    L.add('preM', 'pre-miRNA (~70 nt)', [0, 0, 0], rG, 'dim');
    L.add('exp5', 'Exportin-5 → tế bào chất', [0, 0, 0], rG, 'dim');
    L.add('dicer', 'Dicer cắt vòng → duplex ~22 nt', [0, 0, 0], rG, 'big');
    L.add('ago', 'AGO giữ mạch dẫn → RISC', [0, 0, 0], rG, 'good');
    L.add('tgt', 'mRNA đích · 3′UTR', [9.8, TY - 1.1, 0], rG, 'dim');
    L.add('ribo', 'ribosome đang dịch mã', [3.6, TY - 1.1, 0], rG, 'dim');
    L.add('repress', 'seed bắt cặp một phần → ức chế dịch mã', [4.4, TY + 1.7, 0], rG, 'good');
    L.add('noDicer', '❌ không có Dicer: không có RISC', [2.2, 2.4, 0], rG, 'warn');

    // ---- trạng thái ----
    let cur = 0, tt = 0, noGU = false, noDicer = false, variantB = false;
    const RD = [
      'pre-mRNA vừa phiên mã: 3 exon (cam), 2 intron (xám), chưa có mũ, chưa có đuôi. AAUAAA (đỏ) gần cuối. Đường miRNA ở dưới.',
      'Mũ m⁷G nối 5′–5′ qua cầu triphosphate, gắn khi RNA mới dài khoảng 20–30 nt. Mũ chặn exonuclease 5′→3′ và giúp ribosome nhận ra mRNA.',
      'CPSF/CstF nhận AAUAAA, cắt RNA 10–30 nt phía sau; poly-A polymerase thêm A không cần khuôn (mô hình vẽ 12 hạt, thật khoảng 200).',
      null, null, null, null,
      'Trong nhân: Drosha (cùng DGCR8) cắt gốc hairpin của pri-miRNA, còn pre-miRNA ~70 nt; Exportin-5 đưa nó qua lỗ nhân ra tế bào chất.',
      'Tế bào chất: Dicer cắt vòng → duplex ~22 nt; AGO giữ mạch dẫn, bỏ mạch kia; RISC bắt cặp seed (nt 2–8) với 3′UTR nên ribosome ít dịch mã đích.',
      null,
    ];
    const rd = () => {
      const s = cur;
      if (RD[s]) return RD[s];
      if (s >= 3 && s <= 5 && noGU) return [
        '<b>GU→AU</b>: U1 không bắt cặp được với đầu intron 1, nên spliceosome không lắp ở intron này.',
        '<b>GU→AU</b>: không có U1 trên intron 1 nên không có lariat. Chỉ intron 2 vẫn được xử lý.',
        '<b>Cắt nối sai</b>: intron 1 bị giữ lại trong mRNA, khung đọc lệch, protein sai hoặc hỏng (cơ chế của nhiều thể β-thalassemia).'][s - 3];
      if (s === 3) return 'U1 bắt cặp với GU ở đầu 5′ của intron, U2 bắt cặp quanh điểm nhánh A gần đầu 3′ của intron.';
      if (s === 4) return 'Tri-snRNP U4/U6/U5 đến, U1 và U4 rời đi. Phản ứng 1: 2′-OH của A tấn công vị trí nối 5′, intron gập thành lariat.';
      if (s === 5) return 'Phản ứng 2: exon 1 nối với exon 2, lariat bị loại rồi phân hủy. Intron 2 được cắt theo cùng cách.';
      if (s === 6) return variantB ? '<b>Biến thể B</b>: exon 2 bị bỏ cùng hai intron. Cùng gene, nhưng mRNA và protein khác.' : '<b>Biến thể A</b>: giữ đủ 3 exon. Bật biến thể B để thấy exon 2 bị bỏ.';
      return noDicer ? '<b>Không có Dicer</b>: pre-miRNA không được cắt, không có RISC, mRNA đích vẫn được dịch nhiều (ribosome chạy liên tục).'
        : '<b>Có Dicer</b>: RISC bám 3′UTR, dịch mã của mRNA đích giảm (ribosome thưa dần). Bật 💥 để so sánh.';
    };
    const T = {
      gu: api.toggle('💥 Vị trí nối 5′ GU→AU', false, (x) => { noGU = x; tt = 0; render(); }),
      dicer: api.toggle('💥 Không có Dicer', false, (x) => { noDicer = x; tt = 0; render(); }),
      alt: api.toggle('Biến thể B (bỏ exon 2)', false, (x) => { variantB = x; render(); }),
    };
    const SHOW = { gu: [3, 4, 5], dicer: [9], alt: [6] };
    const CAMS = [
      [[-0.5, -1.5, 34], [-0.5, -3.4, 0]],
      [[-10, 2.5, 11], [-10.5, 0.6, 0]],
      [[8.6, 2.3, 12], [9.2, 0.4, 0]],
      [[-5.5, 3, 13], [-5.8, 1.0, 0]],
      [[-5.5, 3, 13], [-5.8, 1.2, 0]],
      [[-4.5, 2.5, 15], [-5, 0.6, 0]],
      [[-4.5, 2.5, 15], [-5, 0.3, 0]],
      [[-4.6, -4.5, 17], [-4.6, -6.6, 0]],
      [[5.2, -5.5, 17], [5.2, -8.4, 0]],
      [[5.2, -5.5, 17], [5.2, -8.4, 0]],
    ];
    function render() {
      for (const k in T) T[k].el.style.display = SHOW[k].includes(cur) ? '' : 'none';
      api.readout(rd());
    }

    const S = {};
    function compute() {
      const s = cur;
      Object.assign(S, { cap: 0, capEnz: 0, stub: 1, cut: false, cpsf: 0, pap: 0, nA: 0, u1: 0, u2: 0, tri: 0, u1Up: false,
        i1: 1, i2: 1, lar: 0, larUp: 0, join: 0, skip: false, retain: false, aDot: 1,
        flank: 1, preX: -10.5, preY: 0, loop: 1, up: 1, low: 1, drosha: 0, exp5: 0, dicer: 0, ago: 0, tgt: 0, nRibo: 0, bound: false, keys: [] });
      const K = S.keys;
      if (s >= 1) S.cap = 1;
      if (s >= 3) { S.stub = 0; S.nA = NPA; }
      if (s === 0) K.push('e1', 'e2', 'e3', 'intron', 'miLayer');
      else if (s === 1) {
        const lt = tt % 6;
        S.capEnz = lt > 0.2 && lt < 3.2 ? 1 : 0; S.cap = lt > 1.6 ? 1 : 0;
        K.push('e1'); K.push(S.cap ? 'cap' : 'capEnz');
      } else if (s === 2) {
        const lt = tt % 9;
        S.cpsf = lt > 0.3 && lt < 3.4 ? 1 : 0; S.cut = lt > 2; S.stub = S.cut ? 0 : 1;
        S.pap = lt > 3 && lt < 7.5 ? 1 : 0; S.nA = Math.round(lerp(0, NPA, (lt - 3.2) / 3.8));
        K.push('e3', 'aaua'); if (!S.cut) K.push('cpsf'); if (S.cut && lt < 3.6) K.push('cut'); if (S.nA > 2) K.push('polyA');
      } else if (s === 3) {
        S.u1 = tt > 0.3 ? 1 : 0; S.u1Up = noGU; S.u2 = tt > 1.0 ? 1 : 0;
        K.push('e1', 'e2'); if (S.u1) K.push(noGU ? 'gu' : 'u1'); if (S.u2) K.push('u2');
      } else if (s === 4) {
        S.u2 = 1; S.u1 = noGU ? 1 : (tt < 2.2 ? 1 : 0); S.u1Up = noGU;
        S.tri = !noGU && tt > 0.4 ? 1 : 0;
        if (!noGU && tt > 1.6) { S.i1 = 0; S.lar = 1; }
        K.push('e1', 'e2'); if (noGU) K.push('gu'); else { if (S.tri) K.push('tri'); if (S.lar) K.push('aLbl'); }
      } else if (s === 5 || s === 6) {
        const u = s === 5 ? (tt - 0.6) / 2 : 1;
        S.i2 = s === 5 ? (u < 0.3 ? 1 : 0) : 0;
        if (noGU && s === 5) { S.retain = true; S.join = cl(u); K.push('e1', 'e2', 'e3', 'retain'); }
        else {
          S.i1 = 0; S.lar = s === 5 && tt < 3.2 ? 1 : 0; S.larUp = s === 5 ? cl((tt - 1) / 2) : 1; S.join = cl(u); S.aDot = 0;
          S.skip = s === 6 && variantB;
          K.push('e1', 'e3'); if (!S.skip) K.push('e2');
          K.push(s === 5 ? 'ligate' : (variantB ? 'altB' : 'altA'));
        }
        if (s === 5) { S.tri = tt < 1.2 ? 1 : 0; S.u2 = S.tri; }
      } else if (s === 7) {
        const lt = tt % 9.5;
        S.drosha = lt > 0.3 && lt < 2.6 ? 1 : 0;
        S.flank = lt < 1.8 ? 1 : 0;
        S.exp5 = lt > 2.4 && lt < 7.4 ? 1 : 0;
        S.preX = lerp(-10.5, -0.2, (lt - 3.2) / 3.4);
        K.push('nuc', 'cyto');
        if (lt < 1.8) K.push('pri'); else K.push('preM');
        if (S.drosha) K.push('drosha'); else if (S.exp5) K.push('exp5');
      } else if (s === 8 || s === 9) {
        const lt = tt % 11.5;
        S.preX = 0.4; S.flank = 0; S.tgt = 1;
        const dic = !(s === 9 && noDicer);
        K.push('cyto', 'tgt');
        if (!dic) {
          S.nRibo = 3; K.push('preM', 'noDicer', 'ribo');
        } else {
          S.dicer = lt > 0.3 && lt < 2.8 ? 1 : 0; S.loop = lt < 1.9 ? 1 : 0;
          S.ago = lt > 2.6 ? 1 : 0; S.up = lt < 3.8 ? 1 : 0;
          const mv = (lt - 4.4) / 2.6;
          S.preX = lerp(0.4, 6.6, mv); S.preY = lerp(0, TY + 0.4, mv);
          S.bound = lt > 7.0;
          S.nRibo = S.bound ? 0 : 3;
          if (S.dicer) K.push('dicer'); else if (lt < 2.6) K.push('preM');
          if (S.ago && !S.bound) K.push('ago');
          K.push(S.bound ? 'repress' : 'ribo');
        }
      }
    }

    function apply(dt) {
      // exon: nối lại sau khi cắt nối
      const e1r = EX.e1[1];
      let x2 = CX('e2'), x3 = CX('e3');
      if (S.retain) x3 = lerp(CX('e3'), EX.e2[1] + W('e3') / 2, S.join);
      else if (S.join > 0) { x2 = lerp(CX('e2'), e1r + W('e2') / 2, S.join); x3 = lerp(CX('e3'), S.skip ? e1r + W('e3') / 2 : e1r + W('e2') + W('e3') / 2, S.join); }
      fol(exons.e2, V(x2, 0, 0), dt, 5); fol(exons.e3, V(x3, 0, 0), dt, 5);
      fade(exons.e2, !S.skip, dt);
      const e3r = exons.e3.position.x + W('e3') / 2;
      paBand.position.x = e3r - 0.7;
      fade(i1, S.i1, dt); fade(i2, S.i2, dt); fade(stub, S.stub, dt, 8);
      fade(lar, S.lar, dt, 4); lar.position.y = S.larUp * 3.2; lar.position.x = (exons.e2.position.x - CX('e2')) * 0.5;
      fade(aDot, S.aDot, dt);
      fade(cap, S.cap, dt);
      put(capEnz, S.capEnz, V(-12.2, 1.05, 0.2), dt);
      put(cpsf, S.cpsf, V(8.6, 1.0, 0.1), dt);
      polyA.forEach((b, k) => {
        b.visible = k < S.nA;
        if (b.visible) b.position.set(e3r + 0.22 + k * 0.3, 0.12 * Math.sin(k * 1.1), 0);
      });
      put(pap, S.pap, V(e3r + 0.3 + S.nA * 0.3, 0.75, 0.2), dt, 8);
      put(snU1, S.u1, V(-7.9, S.u1Up ? 2.2 : 0.95, 0.1), dt);
      put(snU2, S.u2, V(-4.2, 1.5, 0.1), dt);
      put(snTri, S.tri, V(-5.8, 2.4, 0.2), dt);
      // miRNA
      fade(flankL, S.flank, dt); fade(flankR, S.flank, dt);
      if (S.preX < preG.position.x - 3) preG.position.set(S.preX, S.preY, 0);
      fol(preG, V(S.preX, S.preY, 0), dt, 6);
      fade(preLoop, S.loop, dt); fade(preUp, S.up, dt);
      preUp.position.y += ((S.up ? 0 : 0.8) - preUp.position.y) * (1 - Math.exp(-dt * 2));
      rungs.forEach(r => { r.visible = S.up && preUp.userData.on > 0.5; });
      const pg = preG.position;
      put(drosha, S.drosha, V(-10.5, 0.85, 0.2), dt);
      put(exp5, S.exp5, tmp.set(pg.x + 1.5, pg.y + 0.75, 0.25), dt, 8);
      put(dicer, S.dicer, tmp.set(pg.x + 3.3, pg.y + 0.75, 0.2), dt, 8);
      put(ago, S.ago, tmp.set(pg.x + 1.5, pg.y + 0.55, 0.3), dt, 8);
      fade(target, S.tgt, dt); fade(utr, S.tgt, dt);
      target.material.emissiveIntensity = S.bound ? 0.05 : 0.45;
      ribos.forEach((g, k) => {
        const on = k < S.nRibo;
        fade(g, on, dt, 3);
        const ph = ((tt * 0.45 + k / 3) % 1);
        g.position.set(1.8 + ph * 5.0, TY + 0.35, 0.2);
      });
      // nhãn động
      const lpos = (k, x, y) => L.get(k).position.set(x, y, 0);
      lpos('e1', CX('e1'), -1.15); lpos('e2', exons.e2.position.x, -1.15); lpos('e3', exons.e3.position.x - 1.4, -1.15);
      lpos('preM', pg.x + 1.5, pg.y - 1.1);
      lpos('exp5', exp5.position.x, exp5.position.y + 1.05);
      lpos('dicer', dicer.position.x, dicer.position.y + 1.2);
      lpos('ago', ago.position.x, ago.position.y + 1.1);
      L.only(S.keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; tt = 0; envG.visible = s === 0 || s >= 7;
        // mỗi cận cảnh chỉ hiện lớp của nó (tránh mép exon lọt vào khung miRNA và ngược lại)
        mG.visible = s <= 6; rG.visible = s === 0 || s >= 7;
        noGU = false; noDicer = false; variantB = false;
        for (const k in T) T[k].set(false);
        render();
        api.camera(...CAMS[s]);
      },
      update(dt) {
        tt += dt; compute(); apply(dt);
        drosha.rotation.y += dt * 0.2; ago.rotation.y += dt * 0.25;
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
