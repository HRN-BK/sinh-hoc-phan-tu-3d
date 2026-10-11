// Bài 12: Phiên mã ở nhân thực. Ba RNA polymerase, TATA–TBP, PIC, TFIIH, CTD, FACT, poly-A.
import { labels } from './_kit.js';

// Sơ đồ rút gọn (không đúng tỉ lệ). Enhancer ở xa (thật: hàng nghìn bp), TATA ở −30..−25, +1 = START.body.
const SEG = {
  enh: 'GGCCAATCTGCGGTCA',
  gap: 'TTAGCCCGAT',
  tata: 'TATAAA',
  pad: 'GCGCCGTGAGTCAGTTGCAGCTCA', // 24 nt: TATA nằm ở −30..−25, +1 = nucleotide đầu của body
  body: 'ATGGCTAAAGGCTTCGAGCTGCATTACGGTCCAAGATCT',
  pa: 'AATAAA',
  end: 'GGCTCCGTAC',
};
const ORDER = ['enh', 'gap', 'tata', 'pad', 'body', 'pa', 'end'];
const START = {};
let _acc = 0;
for (const k of ORDER) { START[k] = _acc; _acc += SEG[k].length; }
const SEQ = ORDER.map(k => SEG[k]).join('');
const span = (k) => [START[k], START[k] + SEG[k].length - 1];
const mid = (k) => START[k] + (SEG[k].length - 1) / 2;

export default {
  title: 'Phiên mã nhân thực: Pol II, TATA–TBP và PIC',
  sub: 'Nhân thực không có một RNA polymerase tự bám DNA như vi khuẩn. Nó cần cả một dây chuyền yếu tố phiên mã lắp lên promoter trước, rồi mới phiên mã. Bài này dựng lại từng lớp đó và cho thấy tắt một mắt xích thì mất gì.',
  legend: '<span><i style="background:#2bb3a3"></i>RNA polymerase II</span><span><i style="background:#9b6dd6"></i>TBP / TFIID</span><span><i style="background:#f5a623"></i>TFIIH (helicase + kinase)</span><span><i style="background:#66d9ef"></i>activator / Mediator</span><span><i style="background:#b58ad6"></i>nucleosome (histone)</span><span><i style="background:#f2994a"></i>mRNA</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p>Mọi gene nhân thực đều được phiên mã bởi một hệ thống <b>nhiều protein</b> thay vì một enzyme duy nhất. Lý do: DNA nhân thực <b>quấn trên nucleosome</b> (histone) nên polymerase không tự mở được đường đi, và các gene được điều hòa rất tinh vi bởi enhancer ở xa và chromatin.</p>
  <p>Vì vậy phiên mã nhân thực có 3 việc: <b>lắp đặt</b> (chọn đúng promoter), <b>mở và chạy</b> (kéo dài trên chromatin), và <b>kết thúc</b> (cắt và thêm poly-A). Mỗi việc có protein riêng.</p>`,

  without: `<ul>
  <li><b>Không có TBP (TATA-binding protein)</b>: không ai nhận ra TATA box, nên không có PIC và <b>không có phiên mã</b>. Nếu mất TBP ở mọi tế bào thì sống không được.</li>
  <li><b>α-amanitin</b> (nấm Amanita, "nấm chết"): khóa Pol II, ngăn nó chuyển dịch dọc DNA. Pol II không phiên mã được mRNA nữa, nên tế bào gan (phiên mã rất mạnh) chết nhanh. Đó là lý do ngộ độc nấm độc gây suy gan.</li>
  <li><b>Thiếu FACT</b>: histone không được tháo khỏi chỗ Pol II đi qua, nên Pol II bị chặn trên nucleosome và dừng giữa đường.</li>
  <li><b>Mất enhancer hoặc activator</b>: gene vẫn được phiên mã ở mức nền (basal), nhưng không tăng được khi tế bào cần. Nhiều bệnh do đột biến enhancer làm gene quan trọng không bật đủ.</li></ul>
  <div class="box info">👉 Bước 9: bật <b>💥 không có TBP</b> hoặc <b>α-amanitin</b>. Bước 7: bật/tắt <b>enhancer + activator</b>. Xem ô <b>Biểu hiện</b> đổi giữa none, basal và mạnh.</div>`,

  foundation: [
    { q: 'Vì sao phiên mã nhân thực phức tạp hơn nhân sơ?', a: 'Nhân sơ có 1 RNA polymerase và yếu tố σ tự nhận ra promoter. Nhân thực có <b>3 RNA polymerase</b> khác nhau, DNA quấn trên <b>nucleosome</b>, và gene được điều hòa từ xa qua <b>enhancer</b>. Vì thế polymerase không tự bám promoter mà cần nhiều yếu tố phiên mã (TF) đi cùng.' },
    { q: 'Nucleosome là gì?', a: 'Gồm <b>147 bp DNA</b> quấn khoảng 1,67 vòng quanh một <b>bát phân histone</b> (2 × H2A, H2B, H3, H4), cộng thêm H1 ở chỗ nối. Nucleosome làm DNA bị "khóa" lại, nên polymerase phải có cơ chế riêng để đi qua (FACT).' },
    { q: 'Promoter nhân thực gồm những gì?', a: 'Phần chính là <b>TATA box</b> (TATAAA, khoảng −25 đến −30 so với +1). Gần đó còn có các yếu tố <b>gần promoter</b> (proximal) như hộp CAAT và GC box, khoảng −40 đến −110. Enhancer mới là loại nằm xa. Đây là nơi <b>TBP</b> và các TF bám vào, không phải nơi "σ" như vi khuẩn.' },
    { q: 'Enhancer là gì? Vì sao nó có thể nằm xa gene?', a: '<b>Enhancer</b> là trình tự DNA có thể cách gene hàng nghìn bp, nơi <b>activator</b> bám vào. DNA có thể <b>bẻ cong thành vòng</b> để activator chạm được vào <b>Mediator</b> và polymerase ở promoter. Vì vậy khoảng cách trên DNA không quyết định, mà quyết định là hai đầu có chạm được nhau trong không gian 3D.' },
    { q: 'TBP là gì và thuộc phức hợp nào?', a: '<b>TBP</b> (TATA-binding protein) là một tiểu đơn vị của <b>TFIID</b>. Nó bám TATA box và <b>bẻ cong DNA</b> khoảng 80–100°. Chỗ bẻ cong này là tín hiệu để các TF khác đi tới. TBP có mặt trong mọi loại phiên mã nhân thực (I, II, III), nhưng nhận diện khác nhau.' },
    { q: 'PIC (pre-initiation complex) là gì?', a: '<b>PIC</b> là phức hợp khởi đầu: TFIID (TBP) → TFIIA + TFIIB → RNA polymerase II + TFIIF → TFIIE → TFIIH. Khi PIC đã đủ, polymerase sẵn sàng mở DNA và bắt đầu phiên mã tại +1.' },
    { q: 'CTD của Pol II là gì và phosphoryl hóa để làm gì?', a: '<b>CTD</b> (C-terminal domain) là một đuôi dài gồm nhiều lặp lại <b>YSPTSPS</b> ở tiểu đơn vị lớn nhất của Pol II. Khi <b>Ser5</b> được phosphoryl hóa (bởi TFIIH), Pol II rời promoter. Khi <b>Ser2</b> được phosphoryl hóa, Pol II chuyển sang kéo dài và gọi các enzyme xử lý RNA.' },
    { q: 'Vì sao có 3 loại RNA polymerase?', a: 'Mỗi loại tổng hợp một nhóm RNA khác nhau với mức độ dùng khác nhau: <b>Pol I</b> cho rRNA lớn (28S, 18S, 5.8S), <b>Pol II</b> cho mRNA và phần lớn RNA điều hòa, <b>Pol III</b> cho tRNA, 5S rRNA và U6 snRNA. Ba loại này có promoter và yếu tố khác nhau, nên không lẫn được.' },
  ],

  steps: [
    { title: 'Toàn cảnh: gene nhân thực và các vùng chức năng', text: 'Đọc từ trái sang phải: <b>enhancer</b> (xanh lam, rất xa), khoảng đệm, <b>TATA box</b> (tím, khoảng −30, đích của TBP), vạch xanh lá là <b>+1</b>, rồi thân gene và <b>AATAAA</b> ở cuối (trên RNA là AAUAAA, tín hiệu poly-A). Các cầu tím mờ bọc quanh thân gene là <b>nucleosome</b>. Chú ý: không có σ ở đây, toàn bộ việc lắp ráp là từ các protein.' },
    { title: 'TBP bám TATA và bẻ cong DNA', text: '<b>TBP</b> (tím) bám vào <b>TATA box</b>. Trong tế bào, TBP <b>bẻ cong DNA</b> khoảng 80°, và chỗ cong đó là "bản đồ" để các TF khác đến. Mô hình giữ DNA thẳng cho dễ nhìn; cung cam dưới TATA đánh dấu chỗ DNA thật bị bẻ.' },
    { title: 'Lắp PIC: TFIIA, TFIIB, Pol II, TFIIF, TFIIE, TFIIH', text: 'Lần lượt các TF đến và lắp lên TBP: TFIID (chứa TBP), rồi <b>TFIIA</b> và <b>TFIIB</b>, rồi <b>Pol II</b> (xanh ngọc, bọc quanh DNA ở +1) đi cùng <b>TFIIF</b>, sau đó <b>TFIIE</b>, cuối cùng <b>TFIIH</b> (cam). Khi PIC hoàn chỉnh, Pol II đã nằm sẵn tại promoter nhưng DNA vẫn còn đóng.' },
    { title: 'TFIIH: tháo xoắn và phosphoryl hóa Ser5', text: 'TFIIH có <b>helicase</b> (mở một đoạn DNA quanh +1, để lộ mạch khuôn) và <b>kinase CDK7</b> (phosphoryl hóa Ser5 của đuôi CTD). Đuôi CTD đã được phosphoryl hóa giúp Pol II <b>rời promoter</b> để chuyển sang kéo dài. Các chấm đỏ trên đuôi CTD (chuỗi hạt xám) là nhóm phosphate ở Ser5.' },
    { title: 'Phiên mã bắt đầu tại +1: Ser5 rồi chuyển sang Ser2', text: 'Pol II đọc mạch khuôn 3′→5′ và tổng hợp mRNA 5′→3′ (chuỗi hạt cam). Đầu 5′ được gắn <b>mũ m⁷G</b> (hạt đỏ sẫm) khi RNA còn rất ngắn (khoảng 20–30 nt). Khi Pol II rời promoter, TFIIB và TFIIF tách ra; TFIID, TFIIA, TFIIE, TFIIH ở lại làm "giàn" cho lần khởi đầu sau. Đuôi CTD <b>chuyển dần từ Ser5-P sang Ser2-P</b> (chấm đỏ thành chấm vàng, do P-TEFb/CDK9), báo hiệu giai đoạn kéo dài.' },
    { title: 'Kéo dài qua nucleosome: FACT tháo histone', text: 'Trên thân gene, DNA quấn nucleosome (cầu tím mờ). <b>FACT</b> (khối xanh lục nhạt) đi ngay trước Pol II, tạm lấy một dimer H2A/H2B (cầu tím nhỏ) để Pol II đi qua, rồi <b>lắp lại</b> phía sau. Đây là lý do nhân thực cần FACT còn nhân sơ thì không (không có histone).' },
    { title: 'Activator ở enhancer: bẻ vòng và kích hoạt Mediator', text: 'Activator (xanh lơ) bám vào enhancer xa. DNA bẻ thành vòng để activator chạm vào <b>Mediator</b> (cầu nối), Mediator lại chạm vào Pol II. Kết quả: PIC được kích hoạt mạnh, biểu hiện chuyển từ <b>basal</b> (nền) sang <b>mạnh</b> (HIGH). Công tắc "enhancer + activator" bật sẵn ở bước này; tắt đi để so sánh. Cung xanh lơ là sơ đồ của vòng DNA, vì mô hình giữ DNA thẳng.' },
    { title: 'Kết thúc: AAUAAA bị cắt và poly-A được thêm', text: 'Khi Pol II đi qua <b>AATAAA</b> trên DNA (trên RNA là <b>AAUAAA</b>), phức hợp CPSF/CstF cắt RNA cách tín hiệu 10–30 nt về phía 3′. Poly-A polymerase thêm một đuôi khoảng <b>200 A</b> (mô hình chỉ vẽ vài hạt). Pol II tiếp tục vài trăm nt rồi rời DNA, nên phiên mã không kết thúc ngay ở AAUAAA mà phải kết thúc sau khi cắt.' },
    { title: 'Kiểm chứng: không TBP và α-amanitin', text: 'Bật <b>💥 không có TBP</b>: không có TATA–TBP, không lắp được PIC, không có phiên mã (none). Bật <b>α-amanitin</b>: PIC vẫn lắp, DNA vẫn mở, nhưng Pol II bị khóa nên chỉ thêm vài nucleotide rồi đứng yên. Đây là hai can thiệp rất khác nhau về cơ chế (một mất yếu tố, một là độc tố).' },
  ],

  application: `<ul>
  <li><b>α-amanitin và ngộ độc nấm:</b> nấm Amanita (nấm độc chết người) có α-amanitin khóa Pol II. Gan là cơ quan bị hại nặng nhất vì tế bào gan phiên mã nhiều. Hiểu cơ chế giúp định hướng điều trị (ví dụ thải độc, ghép gan).</li>
  <li><b>Thuốc ung thư nhắm vào phiên mã:</b> một số thuốc (ví dụ flavopiridol, thuốc ức chế CDK9 nghiên cứu) làm chặn chuyển Ser2, khiến Pol II không kéo dài. Đây là một hướng điều trị đang được thử nghiệm.</li>
  <li><b>Đột biến promoter/enhancer gây bệnh:</b> đột biến TATA box hoặc enhancer của gene β-globin làm giảm phiên mã, gây β-thalassemia. Cùng là lỗi phiên mã nhưng khác với lỗi protein.</li>
  <li><b>Giải thích "một gene nhiều kiểu mô":</b> enhancer khác nhau bật gene ở các mô khác nhau, nên một gene có thể hoạt động ở gan nhưng không ở não.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>RNA pol I</th><th>RNA pol II</th><th>RNA pol III</th></tr>
  <tr><td>Tổng hợp</td><td>rRNA 28S, 18S, 5.8S</td><td>mRNA, miRNA, lncRNA, phần lớn snRNA</td><td>tRNA, <b>5S rRNA</b>, U6 snRNA</td></tr>
  <tr><td>Nơi</td><td>Nhân con (nucleolus)</td><td>Nhân</td><td>Nhân</td></tr>
  <tr><td>Kết thúc</td><td>TTF-1</td><td>AAUAAA, cắt rồi thêm poly-A</td><td>Chuỗi poly-T</td></tr>
  <tr><td>Bị α-amanitin?</td><td>Không ở liều thấp</td><td><b>Có</b> (khóa)</td><td>Có ở liều cao hơn</td></tr>
  </table></div>
  <div class="box warn">⚠️ Đừng chép "TATA box ở −10" từ bài nhân sơ. Hộp −10 (Pribnow, <b>TATAAT</b>) là của vi khuẩn. TATA box nhân thực (<b>TATAAA</b>) nằm khoảng <b>−25 đến −30</b> và do TBP nhận ra, không phải σ.</div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Đặc điểm</th><th>Nhân sơ (vi khuẩn)</th><th>Nhân thực</th></tr>
  <tr><td>Nhận diện promoter</td><td>σ + enzyme lõi (1 polymerase)</td><td>TBP / TFIID + PIC (nhiều TF)</td></tr>
  <tr><td>Hộp chính</td><td>−10 TATAAT, −35 TTGACA</td><td>TATA box (TATAAA) khoảng −30</td></tr>
  <tr><td>Enhancer ở xa</td><td>Hiếm, không chuẩn</td><td><b>Có</b>, qua Mediator và vòng DNA</td></tr>
  <tr><td>Histone / FACT</td><td>Không có histone, không cần FACT</td><td>Có nucleosome, cần FACT</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>TBP vs TFIID</td><td>TBP: protein bám TATA box</td><td>TFIID: phức hợp chứa TBP và các protein liên kết TAF</td></tr>
  <tr><td>Ser5 vs Ser2 (CTD)</td><td>Ser5-P: Pol II <b>rời</b> promoter (khởi đầu)</td><td>Ser2-P: Pol II <b>kéo dài</b> và gọi xử lý RNA</td></tr>
  <tr><td>Enhancer vs promoter</td><td>Promoter: sát +1, TBP bám</td><td>Enhancer: xa, activator bám, cần vòng DNA</td></tr>
  <tr><td>Mediator vs TFIIH</td><td>Mediator: cầu nối activator với Pol II</td><td>TFIIH: mở DNA và phosphoryl hóa CTD</td></tr>
  </table></div>`,

  traps: [
    { trap: '"5S rRNA do RNA polymerase I tổng hợp."', truth: '5S rRNA do <b>Pol III</b> tổng hợp, cùng nhóm với tRNA. Pol I chỉ làm 28S, 18S và 5.8S rRNA.' },
    { trap: '"Pol II tổng hợp mọi loại RNA."', truth: 'Pol II tổng hợp mRNA, miRNA và phần lớn snRNA. rRNA lớn do Pol I, tRNA và 5S do Pol III.' },
    { trap: '"TBP là một polymerase."', truth: 'TBP là protein <b>bám TATA box</b> và bẻ cong DNA. Nó không tổng hợp RNA. Polymerase là Pol I, II hoặc III.' },
    { trap: '"Phiên mã nhân thực kết thúc ngay tại AAUAAA."', truth: 'AAUAAA là <b>tín hiệu cắt</b>. RNA được cắt và thêm poly-A ở đó, rồi Pol II tiếp tục chạy vài trăm nt trước khi rời DNA.' },
    { trap: '"Nhân thực cũng có σ như vi khuẩn."', truth: 'Nhân thực không có σ. TFIID (qua TBP) và các TF khác làm việc đó. Sự tương tự là TBP ~ σ về việc bám promoter, nhưng TBP thuộc một PIC lớn.' },
    { trap: '"Enhancer phải nằm sát promoter."', truth: 'Enhancer có thể cách gene hàng nghìn bp. Khoảng cách không quan trọng, mà quan trọng là DNA bẻ vòng để activator chạm được vào Mediator và Pol II.' },
    { trap: '"α-amanitin làm mất TBP."', truth: 'α-amanitin khóa <b>Pol II</b>, không tác động TBP. Nó dừng chuyển dịch của polymerase, nên phiên mã của Pol II bị chặn.' },
    { trap: '"Mất FACT thì không có phiên mã."', truth: 'Mất FACT khiến Pol II bị chặn <b>trên nucleosome</b> giữa đường, không phải không khởi đầu. Mất TBP mới làm không có phiên mã.' },
  ],

  quiz: [
    { q: 'Gene nhân thực có TATA box bị đột biến làm TBP không bám được. Điều gì xảy ra?', ops: ['Phiên mã vẫn bình thường vì có enhancer', 'mRNA được tạo nhưng không cắt intron', 'Không lắp được PIC nên giảm mạnh hoặc không có phiên mã', 'Ribosome không dịch được'], a: 2, e: 'TBP là đầu mối lắp PIC. Mất TBP bám TATA, PIC không hình thành, phiên mã giảm rõ. Đáp án "enhancer bù" là bẫy: enhancer cần PIC để hoạt động.' },
    { q: 'α-amanitin được dùng để khóa loại RNA polymerase nào?', ops: ['Pol I', 'Pol II', 'Pol III', 'Mọi polymerase ở mức như nhau'], a: 1, e: 'α-amanitin khóa Pol II, làm mất khả năng chuyển dịch. Pol III ít nhạy hơn, Pol I không bị ảnh hưởng ở liều thấp. "Mọi polymerase" là bẫy.' },
    { q: 'Pol tổng hợp 5S rRNA là:', ops: ['Pol I', 'Pol II', 'Pol III', 'Không có polymerase nào'], a: 2, e: 'Đây là bẫy kinh điển: 5S rRNA do Pol III, cùng nhóm với tRNA. Pol I tổng hợp 28S, 18S, 5.8S.' },
    { q: 'Ser5 của CTD được phosphoryl hóa chủ yếu để làm gì?', ops: ['Gắn enhancer', 'Gắn histone', 'Cắt intron', 'Giúp Pol II rời promoter để bắt đầu kéo dài'], a: 3, e: 'TFIIH phosphoryl hóa Ser5 giúp Pol II rời promoter. Ser2 về sau mới đánh dấu giai đoạn kéo dài. "Cắt intron" thuộc xử lý RNA, không phải chức năng của CTD Ser5.' },
    { q: 'Vì sao enhancer có thể cách gene rất xa vẫn điều hòa được?', ops: ['Vì DNA bẻ vòng để activator chạm được Mediator và Pol II', 'Vì nó tự phiên mã', 'Vì nó nằm trong ribosome', 'Vì histone đẩy nó lại gần'], a: 0, e: 'Vòng DNA đưa activator sát Mediator và Pol II, nên khoảng cách trên DNA không quyết định.' },
    { q: 'Mất FACT thì điều gì xảy ra?', ops: ['Không khởi đầu được phiên mã', 'Pol II bị chặn trên nucleosome khi kéo dài', 'mRNA không có đuôi poly-A', 'Ribosome không bám'], a: 1, e: 'FACT tháo histone phía trước Pol II. Thiếu FACT, Pol II bị chặn khi kéo dài, không phải khi khởi đầu.' },
  ],

  recall: [
    'Vẽ trục gene từ enhancer → TATA → +1 → thân gene → AAUAAA. Đánh dấu TBP, TFIIH, Pol II, Mediator và vị trí nucleosome.',
    'Viết 3 cột (Pol I, II, III): sản phẩm, nơi kết thúc, và đột biến/độc tố nào tác động.',
    'Giải thích bằng 2 câu vì sao không có TBP thì không có phiên mã, còn α-amanitin làm phiên mã dừng ở giữa đường.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const Y0 = 0.4, rise = 0.3;
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const tmp = new THREE.Vector3();

    // ---- DNA (thẳng; TBP thật bẻ cong ~80°, ở đây chỉ đánh dấu bằng cung cam) ----
    const dnaG = api.group(); dnaG.position.y = Y0;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.85, turn: 10.5, openR: 0.45, parent: dnaG });
    const X = (i) => dna.xOf(i);
    const N = SEQ.length, P1 = START.body, CUT = START.pa + SEG.pa.length + 3, NB = N - P1;
    const XT = X(mid('tata')), XP = X(P1), XA = X(mid('enh'));
    const idxOf = (x) => Math.round((x - X(0)) / rise);
    const regG = api.group(); regG.position.y = Y0;
    const shells = {};
    for (const [k, color] of [['enh', 0x66d9ef], ['tata', 0x9b6dd6], ['body', 0x4a90e2], ['pa', 0xf5a623]]) {
      const [a, b] = span(k);
      const m = api.cylinder(1.3, 1.3, (b - a + 1) * rise, color, regG, { opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2; shells[k] = m;
    }
    const p1Bar = api.cylinder(0.035, 0.035, 3.0, C.good, regG, { opacity: 0.85 }); p1Bar.position.set(XP, -0.5, 0);
    const ARC = Math.PI * 0.5;
    const bend = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.07, 8, 40, ARC), api.mat(0xf5a623, { opacity: 0, emissive: 0xf5a623, emissiveIntensity: 0.4 }));
    bend.rotation.z = Math.PI * 1.5 - ARC / 2; bend.position.set(XT, Y0 + 0.95, 0); api.add(bend);

    // ---- protein ----
    const ACT = [];
    const mk = (r, color, seed, base, scale) => {
      const o = api.blob(r, color, null, { seed, scale, mat: { opacity: 0 } });
      o.userData = { base, on: 0 }; o.visible = false; ACT.push(o); return o;
    };
    const tbp = mk(0.55, C.protein, 5, 0.95);
    const tfiid = mk(0.7, 0xc08bf0, 11, 0.55);
    const tfA = mk(0.36, 0xd7b8f5, 21, 0.9), tfB = mk(0.45, 0x8fb8ff, 23, 0.9), tfF = mk(0.6, 0x7ad1c4, 25, 0.9), tfE = mk(0.5, 0xe7c86e, 27, 0.9);
    const tfiih = mk(0.65, 0xf5a623, 8, 0.95);
    const pol = mk(1.05, C.enzyme, 2, 0.5, [1.5, 1.15, 1.15]);
    const act = mk(0.55, 0x66d9ef, 13, 0.95);
    const med = mk(0.8, 0x5fbf9c, 17, 0.75);
    const fact = mk(0.45, 0xa0e0a8, 19, 0.95);
    const ama = mk(0.26, 0xd94040, 31, 0.95);
    const dimer = api.sphere(0.26, C.histone, null, { opacity: 0 }); dimer.userData = { base: 0.95, on: 0 }; dimer.visible = false; ACT.push(dimer);
    const XM = XP - 3.6;
    const loop = api.tube([[XA, Y0 + 1.7, 0], [XA + 2.2, Y0 + 4.2, -1], [(XA + XM) / 2, Y0 + 5.8, -1.6], [XM - 2.2, Y0 + 4.8, -0.8], [XM, Y0 + 3.6, 0]], 0.09, 0x66d9ef, null, { opacity: 0, emissive: 0x66d9ef, emissiveIntensity: 0.3 });
    loop.userData = { base: 0.8, on: 0 }; loop.visible = false;

    const NUC = [0, 1, 2, 3, 4].map(k => P1 + 12 + k * 6);
    const nucs = NUC.map(i => { const m = api.sphere(1.05, C.histone, null, { opacity: 0.4, depthWrite: false }); m.position.set(X(i), Y0, 0); m.userData = { base: 0.4, on: 1 }; return m; });

    // mRNA: hạt k ứng với nucleotide +1+k, nằm ngay trên mạch DNA đã phiên mã
    const rnaGeo = new THREE.SphereGeometry(0.13, 10, 8);
    const rnaMat = api.mat(C.rna, { emissive: C.rna, emissiveIntensity: 0.5 });
    const rnaDim = api.mat(C.rna, { opacity: 0.3 });
    const rna = []; for (let k = 0; k < NB; k++) { const m = new THREE.Mesh(rnaGeo, rnaMat); m.visible = false; api.add(m); rna.push(m); }
    const cap = api.sphere(0.21, 0xb0302a, null, { emissive: 0xb0302a, emissiveIntensity: 0.4 }); cap.visible = false;
    const polyA = []; for (let j = 0; j < 14; j++) { const m = api.sphere(0.12, 0xfff1a8, null, { emissive: 0xfff1a8, emissiveIntensity: 0.3 }); m.visible = false; polyA.push(m); }
    const rnaPos = (k, lift, out) => out.set(X(P1 + k), Y0 + 1.75 + 0.07 * Math.sin(k * 0.8) + lift, 0.35);
    // CTD: đuôi 6 hạt xám, chấm đỏ = Ser5-P, chấm vàng = Ser2-P
    const ctd = [], pdot = [];
    for (let m = 0; m < 6; m++) { ctd.push(api.sphere(0.11, 0x9aa3b5)); pdot.push(api.sphere(0.09, 0xff3b30, null, { emissive: 0xff3b30, emissiveIntensity: 0.6 })); }

    // ---- nhãn ----
    L.add('enh', 'ENHANCER (xa)', [XA, Y0 - 2.0, 0]);
    L.add('tata', 'TATA box (−30)', [XT, Y0 - 2.0, 0], null, 'big');
    L.add('plus1', '+1', [XP, Y0 - 2.4, 0], null, 'good');
    L.add('body', 'thân gene (quấn nucleosome)', [X(mid('body')), Y0 + 2.4, 0], null, 'dim');
    L.add('pa', 'AATAAA (RNA: AAUAAA)', [X(mid('pa')), Y0 - 2.0, 0], null, 'warn');
    L.add('tbpMsg', 'TBP bám TATA (thật: bẻ cong DNA ~80°)', [XT, Y0 + 3.3, 0], null, 'big');
    L.add('tbp', 'TBP', [XT - 1.3, Y0 + 1.7, 0], null, 'dim');
    L.add('tfiid', 'TFIID (chứa TBP)', [XT - 0.6, Y0 + 3.2, 0], null, 'dim');
    L.add('tfB', 'IIB', [XT + 1.4, Y0 + 2.0, 0], null, 'dim');
    L.add('tfF', 'IIF', [XT + 3.1, Y0 + 2.4, 0], null, 'dim');
    L.add('tfE', 'IIE', [XT + 4.9, Y0 + 2.5, 0], null, 'dim');
    L.add('tfiih', 'TFIIH', [XP - 2.3, Y0 + 3.3, 0], null, 'dim');
    L.add('pol', 'Pol II', [0, 0, 0], null, 'dim');
    L.add('picMsg', 'PIC đã lắp đủ', [XT + 3.6, Y0 - 3.0, 0], null, 'good');
    L.add('bub', 'TFIIH mở DNA quanh +1', [XP + 2.3, Y0 - 1.6, 0], null, 'good');
    L.add('ctd', 'CTD', [0, 0, 0], null, 'dim');
    L.add('cap', '5′ mũ m⁷G', [0, 0, 0], null, 'dim');
    L.add('rna', 'mRNA 5′→3′', [0, 0, 0], null, 'dim');
    L.add('fact', 'FACT: tháo H2A/H2B rồi lắp lại', [0, 0, 0], null, 'good');
    L.add('nuc', 'nucleosome', [X(NUC[0]), Y0 - 1.8, 0], null, 'dim');
    L.add('act', 'activator', [XA, Y0 + 2.6, 0], null, 'dim');
    L.add('med', 'Mediator', [XM - 1.4, Y0 + 3.9, 0], null, 'dim');
    L.add('loop', 'vòng DNA (sơ đồ): activator chạm Mediator', [(XA + XM) / 2, Y0 + 6.5, -1.6], null, 'good');
    L.add('cut', '✂ cắt RNA (10–30 nt sau AAUAAA)', [X(CUT) - 3.5, Y0 + 4.6, 0], null, 'warn');
    L.add('polyA', 'poly-A (thật ~200 A)', [X(CUT) + 2.0, Y0 + 5.9, 0], null, 'good');
    L.add('ttMsg', '❌ không có TBP: không có PIC', [XT + 3.5, Y0 + 3.3, 0], null, 'warn');
    L.add('amaMsg', '☠ α-amanitin khóa Pol II', [0, 0, 0], null, 'warn');

    // ---- trạng thái ----
    let cur = 0, tt = 0, noTBP = false, amaOn = false, enhOn = false;
    const lvlText = () => noTBP ? '<b>Biểu hiện: none.</b> Không có TBP nên không lắp được PIC, Pol II không khởi đầu.'
      : amaOn ? '<b>Biểu hiện: gần như 0.</b> α-amanitin khóa Pol II: PIC vẫn lắp, DNA vẫn mở, nhưng Pol II chỉ thêm vài nucleotide rồi đứng yên.'
      : enhOn ? '<b>Biểu hiện: mạnh (HIGH).</b> Activator ở enhancer chạm Mediator, Mediator kích hoạt PIC và Pol II.'
      : '<b>Biểu hiện: basal (nền).</b> Có TATA–TBP và PIC, nhưng không có activator nên chỉ phiên mã ở mức nền.';
    const RD = [
      'Bản đồ gene: enhancer ở xa, TATA box khoảng −30, +1 (vạch xanh lá), thân gene quấn nucleosome, tín hiệu AATAAA ở cuối. Chưa có protein nào bám.',
      null, null,
      'TFIIH: helicase mở khoảng 11–15 bp quanh +1 (bong bóng phiên mã); kinase CDK7 gắn phosphate vào Ser5 của CTD (chấm đỏ).',
      null,
      'Kéo dài: FACT đi trước Pol II, tạm lấy dimer H2A/H2B (cầu tím nhỏ). Nucleosome mờ đi khi Pol II đi qua rồi hiện lại phía sau.',
      null,
      'Kết thúc: RNA bị cắt cách AAUAAA 10–30 nt, poly-A polymerase thêm đuôi A (mô hình vẽ vài hạt, thật khoảng 200 A). Pol II chạy tiếp rồi rời DNA; đoạn RNA phía sau chỗ cắt bị phân hủy.',
      null,
    ];
    const T = {
      tbp: api.toggle('💥 Không có TBP', false, (x) => { noTBP = x; tt = 0; render(); }),
      ama: api.toggle('α-amanitin (khóa Pol II)', false, (x) => { amaOn = x; tt = 0; render(); }),
      enh: api.toggle('Enhancer + activator', false, (x) => { enhOn = x; render(); }),
    };
    const SHOW = { tbp: [1, 2, 8], ama: [4, 8], enh: [6] };
    const CAMS = [
      [[0, 2.5, 30], [0, 0.8, 0]],
      [[-4.5, 2.6, 12], [-4.5, 1.3, 0]],
      [[-3, 3, 13], [-3, 1.4, 0]],
      [[-1.8, 2.6, 11], [-1.6, 1.0, 0]],
      [[-0.8, 2.6, 12], [-0.6, 1.0, 0]],
      [[6.6, 3, 16], [6.6, 1.2, 0]],
      [[-7.2, 4, 24], [-7.2, 2.2, 0]],
      [[13.5, 3, 13], [13.5, 1.8, 0]],
      [[-2.5, 3, 15], [-2.5, 1.4, 0]],
    ];

    function render() {
      const s = cur;
      for (const k in T) T[k].el.style.display = SHOW[k].includes(s) ? '' : 'none';
      shells.tata.material.opacity = (s === 1 || s === 2 || s === 8) ? 0.3 : 0.12;
      shells.enh.material.opacity = (s === 6 && enhOn) ? 0.32 : 0.12;
      shells.body.material.opacity = s === 5 ? 0.18 : 0.12;
      shells.pa.material.opacity = s === 7 ? 0.32 : 0.12;
      L.set('rna', s === 7 ? 'mRNA đã cắt, nhận đuôi poly-A' : 'mRNA 5′→3′');
      api.readout(RD[s] ?? lvlText());
    }

    // S: mục tiêu cho từng khung hình, tính từ bước + thời gian
    const S = {};
    const lerp = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u));
    function compute() {
      const s = cur, pic = !noTBP;
      Object.assign(S, { tbp: 0, tfiid: 0, A: 0, B: 0, F: 0, E: 0, H: 0, pol: 0, act: 0, med: 0, loop: 0, fact: 0, ama: 0, bend: 0,
        site: XP, open: null, n: 0, rnaOn: false, s5: 0, s2: 0, lift: 0, polyA: 0, cut: false, keys: [] });
      const K = S.keys;
      const fullPIC = () => { S.tbp = S.tfiid = S.A = S.B = S.F = S.E = S.H = S.pol = 1; };
      if (s === 0) K.push('enh', 'tata', 'plus1', 'body', 'pa', 'nuc');
      else if (s === 1) {
        K.push('tata', 'plus1');
        if (pic) { S.tbp = 1; S.bend = 1; K.push('tbpMsg', 'tbp'); } else K.push('ttMsg');
      } else if (s === 2) {
        K.push('tata', 'plus1');
        if (!pic) K.push('ttMsg');
        else {
          S.tbp = 1; S.bend = 1; S.tfiid = 1; S.A = S.B = tt > 0.8 ? 1 : 0; S.pol = S.F = tt > 1.8 ? 1 : 0; S.E = tt > 2.8 ? 1 : 0; S.H = tt > 3.6 ? 1 : 0;
          K.push('tfiid');
          if (S.B) K.push('tfB'); if (S.F) K.push('tfF', 'pol'); if (S.E) K.push('tfE'); if (S.H) K.push('tfiih', 'picMsg');
        }
      } else if (s === 3) {
        const lt = tt % 7; fullPIC();
        if (lt > 0.8) S.open = [P1 - 9, P1 + 3];
        S.s5 = Math.round(lerp(0, 6, (lt - 1.2) / 1.8));
        K.push('plus1', 'tfiih', 'pol', 'ctd'); if (lt > 0.8) K.push('bub');
      } else if (s === 4 || s === 8) {
        if (s === 8 && !pic) { K.push('tata', 'plus1', 'ttMsg'); return; }
        const lt = tt % 8; fullPIC();
        const stop = amaOn ? 2 : 7;
        const u = (lt - 1) / 5.5;
        const idx = P1 + lerp(0, stop, amaOn ? u * 4 : u);
        S.site = X(idx); S.open = [Math.round(idx) - 9, Math.round(idx) + 3];
        S.n = idx - P1 + 1; S.rnaOn = lt > 1 && lt < 7.3;
        const esc = !amaOn && u > 0.15;
        if (esc) { S.B = S.F = 0; }
        S.s5 = amaOn ? 6 : Math.round(lerp(6, 2, u)); S.s2 = amaOn ? 0 : 6 - S.s5;
        if (lt > 7.2) { S.pol = 0; S.rnaOn = false; S.open = null; }
        S.ama = amaOn && S.pol ? 1 : 0;
        K.push('plus1', 'pol', 'ctd');
        if (s === 8) K.push('tata');
        if (S.rnaOn && S.n >= 5) K.push('cap');
        if (amaOn) K.push('amaMsg');
      } else if (s === 5) {
        const lt = tt % 10; S.tbp = S.tfiid = 1;
        const idx = lerp(P1 + 4, P1 + 34, lt / 8.5);
        S.pol = lt < 9.4 ? 1 : 0; S.fact = S.pol; S.site = X(idx); S.open = S.pol ? [Math.round(idx) - 9, Math.round(idx) + 3] : null;
        S.n = idx - P1 + 1; S.rnaOn = !!S.pol; S.s2 = 6;
        K.push('fact'); if (S.n > 9 && S.pol) K.push('ctd'); if (S.rnaOn) K.push('cap'); if (S.n > 16 && S.rnaOn) K.push('rna');
      } else if (s === 6) {
        fullPIC(); S.s5 = 6;
        K.push('enh', 'tata', 'pol');
        if (enhOn) { S.act = S.med = S.loop = 1; K.push('act', 'med', 'loop'); }
      } else if (s === 7) {
        const lt = tt % 10;
        let idx = lt < 4.5 ? lerp(START.pa - 5, CUT + 2, lt / 4.5) : lerp(CUT + 2, N + 8, (lt - 4.5) / 2.5);
        S.pol = lt < 6.8 ? 1 : 0; S.fact = S.pol && idx < NUC[4] + 3 ? 1 : 0; S.s2 = 6;
        S.site = X(idx);
        S.open = S.pol && idx < N + 2 ? [Math.round(idx) - 9, Math.round(idx) + 3] : null;
        S.n = Math.min(idx, N - 1) - P1 + 1; S.rnaOn = true;
        S.cut = lt > 4.3; S.lift = lerp(0, 1.1, (lt - 4.3) / 1.5); S.polyA = Math.round(lerp(0, 14, (lt - 5) / 3));
        K.push('pa', 'rna');
        if (S.cut) K.push('cut'); if (S.polyA > 3) K.push('polyA');
      }
    }

    const fol = (o, to, dt, k = 6) => o.position.lerp(to, 1 - Math.exp(-dt * k));
    const DROP = V(0, 2.6, 0);
    const put = (o, on, to, dt, k = 6) => {
      const u = o.userData;
      if (on && u.on < 0.02) o.position.copy(to).add(DROP);
      u.on += ((on ? 1 : 0) - u.on) * (1 - Math.exp(-dt * 6));
      o.material.opacity = u.base * u.on; o.visible = u.on > 0.01;
      if (to) fol(o, to, dt, k);
    };
    let openKey = '';
    function apply(dt) {
      put(tbp, S.tbp, V(XT, Y0 + 1.25, 0), dt);
      put(tfiid, S.tfiid, V(XT - 0.2, Y0 + 2.15, -0.1), dt);
      put(tfA, S.A, V(XT - 1.0, Y0 + 0.95, 0.75), dt);
      put(tfB, S.B, V(XT + 1.4, Y0 + 1.15, 0.2), dt);
      put(tfF, S.F, V(XT + 3.1, Y0 + 1.45, 0.2), dt);
      put(tfE, S.E, V(XT + 4.9, Y0 + 1.85, 0), dt);
      put(tfiih, S.H, V(XP - 2.3, Y0 + 2.25, 0.1), dt);
      put(pol, S.pol, V(S.site - 0.4, Y0 + 0.15, 0), dt, 12);
      put(act, S.act, V(XA, Y0 + 1.35, 0), dt);
      put(med, S.med, V(XM, Y0 + 3.2, 0), dt);
      put(fact, S.fact, V(S.site + 1.6, Y0 + 1.25, 0.3), dt, 12);
      put(ama, S.ama, tmp.copy(pol.position).add(V(0.3, 1.1, 0.8)), dt, 12);
      loop.userData.on += (S.loop - loop.userData.on) * (1 - Math.exp(-dt * 4));
      loop.material.opacity = 0.8 * loop.userData.on; loop.visible = loop.userData.on > 0.01;
      bend.material.opacity += (S.bend * 0.9 - bend.material.opacity) * (1 - Math.exp(-dt * 4)); bend.visible = bend.material.opacity > 0.01;
      const key = S.open ? S.open.join(',') : '';
      if (key !== openKey) { openKey = key; S.open ? dna.openRange(S.open[0], S.open[1], 1) : dna.openRange(0, 0, 0); }
      // nucleosome: Pol II tới gần thì histone bị lấy tạm (mờ), đi qua rồi thì lắp lại
      let taken = false;
      nucs.forEach((m, k) => {
        const d = X(NUC[k]) - S.site, away = S.pol && d > -2.2 && d < 1.4;
        if (away && S.fact) taken = true;
        m.userData.on += ((away ? 0.15 : 1) - m.userData.on) * (1 - Math.exp(-dt * 6));
        m.material.opacity = m.userData.base * m.userData.on;
      });
      put(dimer, taken ? 1 : 0, tmp.copy(fact.position).add(V(0.35, 0.6, 0.2)), dt, 12);
      // CTD + phosphate
      const pc = pol.position, po = pol.userData.on;
      ctd.forEach((b, m) => {
        b.position.set(pc.x - 1.4 - 0.26 * m, pc.y - 1.15 - 0.18 * m, 0.6); b.visible = po > 0.05; b.material.opacity = po;
        const d = pdot[m], red = m < S.s5, gold = !red && m < S.s5 + S.s2;
        d.visible = b.visible && (red || gold);
        if (d.visible) { const c = red ? 0xff3b30 : 0xffd60a; d.material.color.setHex(c); d.material.emissive.setHex(c); d.material.opacity = po; d.position.set(b.position.x, b.position.y + 0.17, 0.65); }
      });
      // mRNA
      const cutK = CUT - P1, n = S.rnaOn ? Math.max(0, Math.floor(S.n)) : 0;
      rna.forEach((b, k) => {
        b.visible = k < n;
        if (!b.visible) return;
        const rel = S.cut && k < cutK;
        rnaPos(k, rel ? S.lift : 0, b.position);
        b.material = S.cut && k >= cutK ? rnaDim : rnaMat;
        if (S.cut && k >= cutK && !S.pol) b.visible = false;
      });
      cap.visible = n >= 5 && cur >= 4;
      if (cap.visible) cap.position.copy(rna[0].position).add(V(-0.2, 0, 0));
      polyA.forEach((b, j) => {
        b.visible = j < S.polyA;
        if (b.visible) { rnaPos(cutK - 1, S.lift, b.position); const a = 0.45 + j * 0.06; b.position.x += 0.26 * (j + 1) * Math.cos(a); b.position.y += 0.26 * (j + 1) * Math.sin(a); }
      });
      // nhãn động
      const lp = (k, p) => L.get(k).position.copy(p);
      lp('pol', tmp.set(pc.x + 1.7, Y0 - 1.45, 0.3));
      lp('ctd', tmp.set(pc.x - 2.1, pc.y - 3.3, 0.6));
      L.set('ctd', S.s2 > S.s5 ? 'CTD: Ser2-P (chấm vàng)' : 'CTD: Ser5-P (chấm đỏ)');
      lp('amaMsg', tmp.set(pc.x, Y0 + 3.3, 0));
      lp('fact', tmp.copy(fact.position).add(V(0.3, 1.25, 0)));
      if (cap.visible) lp('cap', tmp.copy(cap.position).add(V(-0.5, 0.6, 0)));
      const mk2 = Math.min(n - 1, cur === 7 ? cutK - 14 : Math.floor(n / 2));
      if (mk2 >= 0) lp('rna', tmp.copy(rna[mk2].position).add(V(0, 0.6, 0)));
      L.only(S.keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; tt = 0;
        noTBP = false; amaOn = false; enhOn = s === 6;
        T.tbp.set(false); T.ama.set(false); T.enh.set(enhOn);
        render();
        api.camera(...CAMS[s]);
      },
      update(dt) {
        tt += dt;
        compute(); apply(dt);
        nucs.forEach((n) => { n.rotation.y += dt * 0.3; });
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
