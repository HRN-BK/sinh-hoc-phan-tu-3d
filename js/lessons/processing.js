// Bài 13: Xử lý RNA nhân thực: mũ 5′, cắt & poly-A, cắt nối (spliceosome), miRNA.
import { labels } from './_kit.js';

export default {
  title: 'Xử lý RNA: mũ, đuôi poly-A, cắt nối & miRNA',
  sub: 'Phiên mã nhân thực tạo ra pre-mRNA "thô". Trước khi ra tế bào chất, nó được gắn mũ 5′, cắt một đuôi poly-A, và cắt bỏ intron. Một nhánh khác (miRNA) dùng cùng máy móc cắt RNA để tắt gene. Bài này đi qua từng bước và cho thấy đột biến ở đâu thì hỏng ở đó.',
  legend: '<span><i style="background:#f2994a"></i>exon (giữ lại)</span><span><i style="background:#9b9b9b"></i>intron (bị cắt)</span><span><i style="background:#ff3b30"></i>mũ m⁷G / đuôi poly-A</span><span><i style="background:#9b6dd6"></i>snRNP (U1, U2, U4/U6, U5)</span><span><i style="background:#2bb3a3"></i>Drosha · Dicer · Exportin-5 · AGO2</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p>Một gene nhân thực có <b>exon</b> (đoạn được giữ lại) xen kẽ với <b>intron</b> (đoạn bị cắt bỏ). Pre-mRNA vừa phiên mã xong chưa dùng được. Tế bào phải <b>gắn mũ 5′</b> để bảo vệ và ribosome nhận diện, <b>cắt đuôi và thêm poly-A</b> để RNA bền và xuất ra, và <b>cắt intron, nối exon</b> để có một khuôn đọc liên tục.</p>
  <p>Ngoài ra, một lớp điều hòa khác: <b>miRNA</b> dài khoảng 22 nt bám vào mRNA đích và <b>tắt</b> nó. Cùng là RNA, cùng là cắt, nhưng khác mục đích: mRNA bình thường được "làm hoàn thiện", còn miRNA được "tiêu hủy".</p>`,

  without: `<ul>
  <li><b>Thiếu mũ 5′</b>: exonuclease phân hủy mRNA nhanh, và ribosome khó bám. Protein ít hoặc không có.</li>
  <li><b>Thiếu cắt poly-A (AAUAAA đột biến)</b>: RNA không có đuôi, không xuất được ra tế bào chất đúng cách, và bị phân hủy sớm. Đây là một nguyên nhân của nhiều bệnh do đột biến tín hiệu poly-A.</li>
  <li><b>Đột biến vị trí nối 5′ (GU→AU)</b>: U1 không bám được, spliceosome không lắp đúng, exon bị bỏ hoặc intron được giữ lại. Protein sai hoặc hỏng. Đây là cơ chế của nhiều thể β-thalassemia.</li>
  <li><b>Không có Dicer</b>: pre-miRNA không được cắt thành dạng trưởng thành 22 nt, không có RISC, nên mRNA đích không bị tắt. Gene đích biểu hiện cao hơn bình thường.</li></ul>
  <div class="box info">👉 Bật <b>💥 vị trí nối 5′ GU→AU</b> và <b>💥 không có Dicer</b> rồi xem đoạn RNA biến đổi như thế nào. Bật <b>Biến thể A/B</b> để thấy cùng một gene tạo hai protein khác nhau.</div>`,

  foundation: [
    { q: 'Exon và intron là gì?', a: '<b>Exon</b> là đoạn gene <b>được giữ lại</b> trong mRNA trưởng thành, và được dịch thành protein. <b>Intron</b> là đoạn <b>bị cắt bỏ</b> khỏi pre-mRNA trước khi ra tế bào chất. Gene người có nhiều intron nên pre-mRNA dài gấp nhiều lần mRNA trưởng thành.' },
    { q: 'Mũ 5′ (cap) là gì và gắn vào đâu?', a: 'Mũ 5′ là một <b>7-methylguanosine (m⁷G)</b> gắn vào đầu 5′ của mRNA bằng liên kết <b>5′–5′ đặc biệt</b> (qua 3 phosphate). Nó được thêm <b>ngay khi phiên mã mới bắt đầu</b>. Mũ bảo vệ RNA khỏi exonuclease và giúp ribosome nhận ra mRNA. Đây là lý do khoảng 5′ của mRNA nhân thực "không bị phân hủy" còn đầu 3′ thì có.' },
    { q: 'Đuôi poly-A là gì và được tạo như thế nào?', a: 'Đuôi poly-A là khoảng <b>200 A</b> nối ở đầu 3′. Trước đó, một phức hợp nhận diện trình tự <b>AAUAAA</b> trên pre-mRNA và <b>cắt RNA</b> cách đó vài chục nt. Poly-A polymerase sau đó thêm đuôi A. Đuôi giúp mRNA bền và xuất ra tế bào chất.' },
    { q: 'snRNP là gì?', a: '<b>snRNP</b> (small nuclear ribonucleoprotein) là một <b>RNA nhỏ trong nhân</b> (snRNA) gắn với protein. Các snRNP chính là <b>U1, U2, U4, U5, U6</b>. Chúng nhận diện trình tự trên intron bằng cặp bắt RNA–RNA, và tập hợp thành spliceosome.' },
    { q: 'Spliceosome là gì?', a: '<b>Spliceosome</b> là một cỗ máy lớn gồm nhiều snRNP và protein, cắt intron và nối exon. Nó lắp ráp theo thứ tự: U1 bám vị trí nối 5′, U2 bám <b>điểm nhánh A</b>, rồi tri-snRNP (U4/U6/U5) đến. Cuối cùng cắt tạo <b>lariat</b> và nối hai exon.' },
    { q: 'miRNA là gì?', a: '<b>miRNA</b> (microRNA) là RNA ngắn khoảng <b>22 nt</b>, được tạo từ một <b>gene riêng</b> phiên mã thành một hairpin (pri-miRNA). Nó không mã hóa protein. Vai trò: bám vào mRNA đích và <b>tắt</b> nó bằng cách ức chế dịch mã hoặc cắt mRNA.' },
    { q: 'Vì sao miRNA lại được gọi là "tắt" gene?', a: 'Vì nó bám một phần bổ sung với <b>3′UTR</b> của mRNA đích. Khi bắt cặp không hoàn toàn (thường là vùng seed, nt 2–8), mRNA ít được dịch hoặc bị phân hủy. Đây là điều hòa <b>sau phiên mã</b>, không thay đổi trình tự DNA.' },
    { q: 'Cắt nối thay thế (alternative splicing) là gì?', a: 'Cùng một pre-mRNA có thể được cắt theo <b>nhiều cách</b>: giữ hoặc bỏ một số exon. Ví dụ: A = exon 1-2-3, B = exon 1-3. Nhờ vậy <b>một gene tạo nhiều protein</b>. Người có khoảng 20.000 gene nhưng số protein lớn hơn nhiều nhờ cơ chế này.' },
  ],

  steps: [
    { title: 'Toàn cảnh: pre-mRNA "thô" và ba việc phải làm', text: 'Trên đường nằm ngang là một <b>pre-mRNA</b> với exon (cam) và intron (xám). Ở đầu 5′ là mũ (đỏ), cuối là vùng <b>AAUAAA</b> (chưa có đuôi). Ở phía dưới (y âm) là đường miRNA, sẽ xem sau. Tóm tắt: (1) gắn mũ, (2) cắt đuôi và thêm poly-A, (3) cắt intron. Mỗi việc có máy riêng.' },
    { title: 'Gắn mũ 5′ ngay khi phiên mã bắt đầu', text: 'Đầu 5′ của RNA mới vừa ló ra khỏi polymerase thì enzyme <b>gắn mũ m⁷G</b> (chấm đỏ lớn). Liên kết là <b>5′–5′</b>, không phải liên kết 3′–5′ như bình thường. Mũ bảo vệ đầu RNA và đánh dấu đây là mRNA hoàn chỉnh.' },
    { title: 'Cắt tại AAUAAA và thêm đuôi poly-A', text: 'Phức hợp nhận diện <b>AAUAAA</b> và cắt RNA cách đó vài chục nt. Đầu 3′ mới được tạo bởi cắt, nên poly-A polymerase có chỗ gắn. Đuôi A (chuỗi đỏ) dài khoảng 200 A được thêm dần. Đuôi giúp RNA bền và xuất ra tế bào chất.' },
    { title: 'Lắp spliceosome: U1 và U2 đánh dấu intron', text: '<b>U1 snRNP</b> bám vị trí nối 5′ (GU) ở đầu intron, <b>U2 snRNP</b> bám <b>điểm nhánh A</b> nằm gần đầu 3′ của intron. Các snRNP tím hiện ra ở đúng chỗ. Nếu vị trí GU đột biến, U1 không bám được và cả quá trình hỏng từ đây.' },
    { title: 'Tri-snRNP U4/U6/U5 đến, lariat hình thành', text: 'Tri-snRNP <b>U4/U6/U5</b> đến và đưa vào. Intron bị gập thành hình <b>lariat</b> (vòng có đuôi), vì đầu 5′ gắn vào điểm nhánh A. Lariat này nằm trên đường intron (xám cong). Đây là bước chế biến RNA nhân thực đặc trưng.' },
    { title: 'Nối exon, bỏ intron', text: 'Hai exon được <b>nối lại</b> với nhau và lariat intron bị cắt bỏ (mờ dần). Đường RNA nối liền, chỉ còn exon. Đây là mRNA trưởng thành đầu tiên sẵn sàng đi ra tế bào chất.' },
    { title: 'Cắt nối thay thế: cùng gene, hai protein', text: 'Bật <b>Biến thể A / B</b>. Biến thể A giữ exon 2 (đường có 3 khối). Biến thể B bỏ exon 2 (chỉ còn 2 khối). Cùng pre-mRNA, cùng máy, khác lựa chọn cắt nối, cho ra hai mRNA và hai protein khác nhau. Đây là lý do một gene tạo nhiều sản phẩm.' },
    { title: 'miRNA: pri-miRNA → Drosha → pre-miRNA → Exportin-5', text: 'Đường dưới là một gene miRNA riêng: <b>pri-miRNA</b> (hairpin dài) được <b>Drosha</b> (xanh ngọc) cắt trong nhân thành <b>pre-miRNA</b> (~70 nt). <b>Exportin-5</b> đưa pre-miRNA ra tế bào chất. Đây là bước xử lý trong nhân, khác với bước sau.' },
    { title: 'Dicer cắt, AGO2 nạp, tìm mRNA đích qua vùng seed', text: '<b>Dicer</b> cắt vòng ở pre-miRNA thành duplex 22 nt. <b>AGO2</b> giữ một mạch để tạo <b>RISC</b>. RISC bám vào <b>3′UTR</b> của mRNA đích qua vùng <b>seed</b> (nt 2–8). Bắt cặp không hoàn toàn thì <b>ức chế dịch mã</b>; bắt cặp hoàn toàn thì <b>cắt</b> mRNA.' },
    { title: 'Kiểm chứng: 💥 không có Dicer', text: 'Bật <b>💥 không có Dicer</b>: pre-miRNA không được cắt thành duplex 22 nt, nên không có RISC. Mạch đích không bị tắt, protein vẫn được tạo cao (đường đích sáng hơn). Đây là một cách để biết miRNA có đang hoạt động không.' },
  ],

  application: `<ul>
  <li><b>Nusinersen (Spinraza) cho bệnh teo cơ tủy (SMA):</b> thuốc là một oligonucleotide đối nghĩa (antisense) gắn vào pre-mRNA của gene SMN2, làm exon 7 được giữ lại. Nhờ đó tạo nhiều protein SMN hoạt động hơn. Thuốc được FDA duyệt năm 2016. Đây là ví dụ điều chỉnh cắt nối bằng thuốc.</li>
  <li><b>β-thalassemia do lỗi cắt nối:</b> nhiều đột biến nằm đúng ở vị trí nối 5′ (GU) hoặc 3′ (AG) của intron gene β-globin. Hệ quả là exon bị bỏ hoặc intron được giữ, không tạo được β-globin bình thường.</li>
  <li><b>siRNA làm thuốc (patisiran):</b> siRNA dài 21–23 nt được đưa vào tế bào gan để tắt gene TTR (gây bệnh amyloid). Thuốc được FDA duyệt năm 2018. Cơ chế dùng chính máy RISC/AGO2 như miRNA, nhưng bắt cặp hoàn toàn để cắt mRNA.</li>
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
  </table></div>`,

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
    { q: 'Một đột biến làm AAUAAA không còn nhận diện được. Hậu quả chính là:', ops: ['Mất mũ 5′', 'Mất khả năng cắt và thêm poly-A, RNA kém bền và ít xuất ra', 'Intron không được cắt', 'miRNA không được tạo'], a: 1, e: 'AAUAAA là tín hiệu cắt để thêm poly-A. Không nhận diện được thì không có đuôi, RNA kém bền. Mũ không liên quan AAUAAA.' },
    { q: 'U1 snRNP bám vị trí nào trên intron?', ops: ['Điểm nhánh A', 'Vị trí nối 5′ (GU)', 'Vị trí nối 3′ (AG)', 'Đuôi poly-A'], a: 1, e: 'U1 bám vị trí nối 5′ (GU). U2 bám điểm nhánh A. Đây là trình tự khởi đầu lắp spliceosome.' },
    { q: 'Đột biến GU→AU ở vị trí nối 5′ của intron. Chuyện gì có khả năng xảy ra nhất?', ops: ['Không ảnh hưởng gì', 'U1 không bám, cắt nối sai, exon bị bỏ hoặc intron được giữ', 'Ribosome không dịch được', 'mũ 5′ bị mất'], a: 1, e: 'Vị trí GU là chỗ U1 nhận diện. Đổi thành AU, U1 không bám, nên cắt nối lệch. "Không ảnh hưởng gì" là bẫy vì vị trí này rất quan trọng.' },
    { q: 'Vì sao miRNA có thể tắt nhiều mRNA khác nhau?', ops: ['Vì nó được gắn mũ', 'Vì nó bắt cặp một phần với 3′UTR (vùng seed) của nhiều mRNA', 'Vì nó mã hóa protein', 'Vì nó là một siRNA dài'], a: 1, e: 'Vùng seed bắt cặp không hoàn toàn với nhiều 3′UTR, nên một miRNA có nhiều mRNA đích. siRNA khác: bắt cặp hoàn toàn với một đích.' },
    { q: 'Enzyme nào cắt pre-miRNA thành duplex 22 nt trong tế bào chất?', ops: ['Drosha', 'Dicer', 'Exportin-5', 'AGO2'], a: 1, e: 'Dicer cắt vòng pre-miRNA thành duplex 22 nt. Drosha cắt trong nhân, Exportin-5 chỉ vận chuyển, AGO2 nạp vào RISC.' },
  ],

  recall: [
    'Vẽ một gene 3 exon, 2 intron, rồi ghi mũ 5′, AAUAAA, điểm nhánh A, vị trí GU và AG. Đánh dấu chỗ U1 và U2 bám.',
    'Vẽ đường miRNA: pri-miRNA → Drosha → pre-miRNA → Exportin-5 → Dicer → AGO2/RISC → 3′UTR. Ghi enzyme nào làm ở nhân và enzyme nào ở tế bào chất.',
    'Viết 2 câu: vì sao đột biến GU→AU gây bệnh, còn đột biến ở exon thì có thể không gây bệnh. Và so sánh siRNA với miRNA về mức độ bắt cặp.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const v = new THREE.Vector3();

    // ---- pre-mRNA layer (y ≈ 0) ----
    const mG = api.group(); mG.position.y = 0;
    const exonG = new THREE.BoxGeometry(1, 0.9, 0.7);
    const EX = {
      e1: { x0: -12, x1: -8 }, e2: { x0: -3, x1: 0 }, e3: { x0: 5, x1: 9 },
    };
    const exons = {};
    const mkExon = (key, color) => {
      const e = EX[key]; const m = new THREE.Mesh(exonG, api.mat(color)); m.scale.set(e.x1 - e.x0, 1, 1);
      m.position.set((e.x0 + e.x1) / 2, 0, 0); mG.add(m); exons[key] = m; return m;
    };
    mkExon('e1', C.rna); mkExon('e2', C.rna); mkExon('e3', C.rna);
    const introns = {};
    const mkIntron = (key, a, b) => {
      const pts = []; for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push(new THREE.Vector3(a + (b - a) * t, Math.sin(t * Math.PI) * 1.2, 0)); }
      const m = api.tube(pts, 0.1, 0x9b9b9b, mG); introns[key] = m; return m;
    };
    mkIntron('i1', -8, -3); mkIntron('i2', 0, 5);
    // lariat: intron 1 5′ end (GU) joined to branch-point A → loop + 3′ tail to AG
    const lar = api.group(mG);
    const bpA = new THREE.Vector3(-4.2, 0.9, 0), lc = new THREE.Vector3(-5.6, 1.8, 0);
    const loopPts = []; for (let k = 0; k <= 24; k++) { const a = Math.atan2(bpA.y - lc.y, bpA.x - lc.x) + k / 24 * Math.PI * 2; loopPts.push(new THREE.Vector3(lc.x + Math.cos(a) * 1.65, lc.y + Math.sin(a) * 1.05, Math.sin(k / 24 * Math.PI * 2) * 0.3)); }
    api.tube(loopPts, 0.1, 0x9b9b9b, lar);
    api.tube([bpA, new THREE.Vector3(-3.6, 0.5, 0), new THREE.Vector3(-3, 0, 0)], 0.1, 0x9b9b9b, lar);
    const aDot = api.sphere(0.24, C.A, lar); aDot.position.copy(bpA);
    const aLbl = api.label('A (điểm nhánh)', [bpA.x + 0.4, bpA.y - 0.6, 0], lar, 'dim');
    api.setOpacity(lar, 0);

    // ---- labels ----
    L.add('cap', 'mũ m⁷G (5′–5′)', [-12.8, 1.4, 0], mG, 'warn');
    L.add('aaua', 'AAUAAA', [7.5, 1.4, 0], mG, 'warn');
    L.add('polyA', 'đuôi poly-A (~200 A)', [11.5, 1.4, 0], mG, 'good');
    L.add('exonL', 'exon 1', [0, -1.1, 0], exons.e1, 'dim');
    L.add('exonL2', 'exon 2 (tùy chọn)', [0, -1.1, 0], exons.e2, 'dim');
    L.add('exonL3', 'exon 3', [0, -1.1, 0], exons.e3, 'dim');
    L.add('intL', 'intron (bị cắt)', [-5.5, 2.2, 0], mG, 'dim');
    L.add('u1', 'U1 → vị trí nối 5′ (GU)', [-7.5, -3.4, 0], mG, 'big');
    L.add('u2', 'U2 → điểm nhánh A', [-4, 2.3, 0], mG, 'big');
    L.add('tri', 'U4/U6/U5 → lariat', [-1, 2.9, 0], mG, 'big');
    L.add('ligate', 'nối exon 1–2–3', [-1.5, -3.2, 0], mG, 'good');
    L.add('altA', 'biến thể A: exon 1-2-3', [-1.5, -4.3, 0], mG, 'good');
    L.add('altB', 'biến thể B: exon 1-3 (bỏ exon 2)', [-1.5, -4.3, 0], mG, 'warn');
    L.add('gu', '❌ GU→AU: U1 không bám', [-7.8, -2.2, 0], mG, 'warn');

    // snRNPs (purple blobs)
    const snU1 = api.blob(0.55, C.protein, mG, { mat: { opacity: 0.95 }, seed: 1 }); snU1.position.set(-8.2, 0.9, 0);
    const snU2 = api.blob(0.5, C.protein, mG, { mat: { opacity: 0.95 }, seed: 2 }); snU2.position.set(-4.5, 1.1, 0);
    const snTri = api.blob(0.7, C.protein, mG, { mat: { opacity: 0.9 }, seed: 3 }); snTri.position.set(-2.5, 1.8, 0);
    const mcap = api.sphere(0.35, C.methyl, mG); mcap.position.set(-12.5, 0, 0);
    const polyA = []; for (let k = 0; k < 6; k++) { const b = api.box(0.25, 0.25, 0.25, C.A, mG); b.position.set(9.4 + k * 0.32, -0.1 * k, 0); polyA.push(b); }

    // ---- miRNA layer (y ≈ -7) ----
    const rG = api.group(); rG.position.y = -7.2;
    const hairpinPts = []; for (let k = 0; k <= 16; k++) { const t = k / 16; hairpinPts.push(new THREE.Vector3(-12 + t * 6, Math.sin(t * Math.PI) * 1.8, 0)); }
    const priMiR = api.tube(hairpinPts, 0.12, C.rna, rG);
    const preMiR = api.tube(hairpinPts.map(p => new THREE.Vector3(p.x - 0.9 + 0.4, p.y * 0.55, 0)), 0.12, C.rna, rG); preMiR.visible = false;
    const drosha = api.blob(0.85, C.enzyme, rG, { mat: { opacity: 0.9 }, seed: 5 }); drosha.position.set(-9, 1.5, 0);
    const exp5 = api.blob(0.65, C.enzyme, rG, { mat: { opacity: 0.9 }, seed: 6 }); exp5.position.set(-2, 0.5, 0);
    const dicer = api.blob(0.9, C.enzyme, rG, { mat: { opacity: 0.9 }, seed: 7 }); dicer.position.set(2, 0.5, 0);
    const ago2 = api.blob(0.8, C.enzyme, rG, { mat: { opacity: 0.9 }, seed: 8 }); ago2.position.set(6, 0.8, 0);
    const target = api.tube([new THREE.Vector3(3, -3.0, 0), new THREE.Vector3(6, -3.2, 0), new THREE.Vector3(9, -3.0, 0), new THREE.Vector3(12, -3.4, 0)], 0.12, 0x9b9b9b, rG);
    const tgtLbl = api.label("mRNA đích · 3′UTR", [9, -4.6, 0], rG, 'dim');
    L.add('pri', 'pri-miRNA (hairpin dài)', [-9, 3.0, 0], rG, 'dim');
    L.add('drosha', 'Drosha + DGCR8 (trong nhân)', [-9, 3.1, 0], rG, 'big');
    L.add('exp5', 'Exportin-5 → tế bào chất', [-2, 2.2, 0], rG, 'dim');
    L.add('dicer', 'Dicer: duplex 22 nt', [2, 2.2, 0], rG, 'big');
    L.add('risc', 'AGO2 → RISC · seed (nt 2–8)', [6, 2.8, 0], rG, 'good');
    L.add('preM', 'pre-miRNA (~70 nt)', [-4.5, 2.4, 0], rG, 'dim');
    L.add('noDicer', '❌ không có Dicer: không có RISC', [2, 3.6, 0], rG, 'warn');
    L.add('repress', 'ức chế dịch mã (bắt cặp một phần)', [9, -2.2, 0], rG, 'good');

    // ---- state ----
    let cur = 0, noGU = false, noDicer = false, variantB = false;
    const readout = () => {
      let t;
      if (noGU) t = '<b>Cắt nối sai</b> ở vị trí 5′: U1 không bám GU, exon bị bỏ hoặc intron được giữ, protein sai hoặc hỏng.';
      else if (noDicer) t = '<b>Không có Dicer</b>: miRNA không được tạo thành duplex, không có RISC, mRNA đích không bị tắt.';
      else if (variantB) t = '<b>Biến thể B</b>: exon 2 bị bỏ. Cùng gene, nhưng mRNA và protein khác.';
      else t = '<b>Biến thể A</b>: giữ đủ 3 exon, mRNA hoàn chỉnh. miRNA hoạt động bình thường, tắt đích qua seed.';
      api.readout(t);
    };
    api.toggle('💥 Vị trí nối 5′ GU→AU', false, (x) => { noGU = x; ctl.setStep(cur); readout(); });
    api.toggle('💥 Không có Dicer', false, (x) => { noDicer = x; ctl.setStep(cur); readout(); });
    api.toggle('Biến thể B (bỏ exon 2)', false, (x) => { variantB = x; ctl.setStep(cur); readout(); });
    readout();

    const CAMS = [
      [[0, 4, 28], [0, -2, 0]],
      [[-9, 3, 12], [-10, 0.5, 0]],
      [[7, 2, 13], [8, 0, 0]],
      [[-4, 4, 13], [-5, 1.5, 0]],
      [[-1, 4, 13], [-2, 1, 0]],
      [[1, 3, 13], [0, 0.2, 0]],
      [[-6, -3, 16], [-7, -6.5, 0]],
      [[0, -3, 16], [1, -6.5, 0]],
      [[5, -4, 16], [6, -6, 0]],
      [[0, 0, 26], [0, -3, 0]],
    ];

    const ctl = {
      setStep(s) {
        cur = s;
        // mRNA layer
        api.fadeTo(mcap, s >= 1 ? 1 : 0, 3);
        api.fadeTo(snU1, (s >= 3) ? 1 : 0, 3); api.fadeTo(snU2, s >= 3 ? 1 : 0, 3); api.fadeTo(snTri, s >= 4 ? 1 : 0, 3);
        polyA.forEach((b, k) => { b.visible = s >= 2; });
        // introns / splicing
        const spliced = s >= 5;
        introns.i1.visible = !spliced && !(s === 4 && !noGU); introns.i2.visible = !spliced;
        const larOn = (s === 4 || s === 5) && !noGU;
        api.fadeTo(lar, larOn ? (s === 5 ? 0 : 1) : 0, s === 5 ? 1.2 : 3);
        api.moveTo(lar, s === 5 ? [0, 4, 0] : [0, 0, 0], 1.5);
        api.showLabel(aLbl, s === 4 && !noGU);
        // exons: after splicing they slide together (A: 1-2-3, B: 1-3). GU→AU: intron 1 retained, nothing joins.
        const w2 = EX.e2.x1 - EX.e2.x0, w3 = EX.e3.x1 - EX.e3.x0, end1 = EX.e1.x1;
        const join = spliced && !noGU;
        if (noGU && spliced) introns.i1.visible = true;
        const skip2 = variantB && join;
        api.moveTo(exons.e2, [join ? end1 + w2 / 2 : (EX.e2.x0 + EX.e2.x1) / 2, 0, 0], 3);
        api.moveTo(exons.e3, [join ? (skip2 ? end1 + w3 / 2 : end1 + w2 + w3 / 2) : (EX.e3.x0 + EX.e3.x1) / 2, 0, 0], 3);
        api.fadeTo(exons.e2, skip2 ? 0 : 1, 3);
        exons.e1.material.color.set(noGU && s >= 3 ? C.bad : C.rna);
        // miRNA layer
        const miOn = s >= 6;
        api.fadeTo(drosha, miOn ? 1 : 0, 3);
        api.fadeTo(exp5, s >= 7 ? 1 : 0, 3); api.fadeTo(dicer, s >= 7 ? 1 : 0, 3);
        api.fadeTo(ago2, s >= 8 ? 1 : 0, 3);
        api.fadeTo(target, s >= 8 ? 1 : 0, 3);
        preMiR.visible = s >= 7 && !noDicer;
        priMiR.visible = s < 7;
        // labels
        const keys = ['exonL', 'exonL3'];
        if (!(variantB && s >= 5 && !noGU)) keys.push('exonL2');
        if (s < 3) keys.push('intL', 'aaua');
        if (s >= 1) keys.push('cap');
        if (s >= 2) keys.push('polyA');
        if (s >= 3) keys.push('u1', 'u2');
        if (s >= 4) keys.push('tri');
        if (s >= 5) keys.push(variantB ? 'altB' : 'ligate', variantB ? '' : 'altA');
        if (s >= 6) keys.push('pri', 'drosha');
        if (s >= 7) keys.push('exp5', 'dicer', 'preM');
        if (s >= 8) keys.push('risc', 'repress');
        if (noDicer && s >= 7) keys.push('noDicer');
        if (noGU && s >= 3) keys.push('gu');
        L.only(keys.filter(Boolean));
        if (tgtLbl) api.showLabel(tgtLbl, s >= 8);
        api.camera(...CAMS[s]);
        readout();
      },
      update(dt, t) {
        // mature miRNA-driven decay: small pulses along the target when RISC is loaded
        if (cur >= 8 && !noDicer) {
          target.material && (target.material.opacity = 0.8 + 0.2 * Math.sin(t * 3));
        }
        ago2.rotation.y += dt * 0.25;
        drosha.rotation.y += dt * 0.2;
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
