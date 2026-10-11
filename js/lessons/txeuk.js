// Bài 12: Phiên mã ở nhân thực. Ba RNA polymerase, TATA–TBP, PIC, TFIIH, CTD, FACT, poly-A.
import { labels } from './_kit.js';

// Sơ đồ rút gọn (không đúng tỉ lệ). Enhancer ở xa, TATA gần +1.
const SEG = {
  enh: 'GGCCAATCTGCGGTCA',
  gap: 'TTAGCCCGAT',
  tata: 'TATAAA',
  pad: 'GCGCCGTGAGTCAGTTGC',
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
  <li><b>α-amanitin</b> (nấm Amanita, "nấm chết"): khóa Pol II, ngăn nó chuyển dịch dọc DNA. Phiên mã dừng ở mức gene mRNA, nên chết tế bào gan rất nhanh. Đó là lý do ngộ độc nấm độc gây suy gan.</li>
  <li><b>Thiếu FACT</b>: histone không được tháo khỏi chỗ Pol II đi qua, nên Pol II bị chặn trên nucleosome và dừng giữa đường.</li>
  <li><b>Mất enhancer hoặc activator</b>: gene vẫn được phiên mã ở mức nền (basal), nhưng không tăng được khi tế bào cần. Nhiều bệnh do đột biến enhancer làm gene quan trọng không bật đủ.</li></ul>
  <div class="box info">👉 Bật <b>💥 không có TBP</b>, <b>α-amanitin</b> rồi <b>enhancer/activator</b>. Xem ô <b>Biểu hiện</b> đổi giữa none, basal và mạnh.</div>`,

  foundation: [
    { q: 'Vì sao phiên mã nhân thực phức tạp hơn nhân sơ?', a: 'Nhân sơ có 1 RNA polymerase và yếu tố σ tự nhận ra promoter. Nhân thực có <b>3 RNA polymerase</b> khác nhau, DNA quấn trên <b>nucleosome</b>, và gene được điều hòa từ xa qua <b>enhancer</b>. Vì thế polymerase không tự bám promoter mà cần nhiều yếu tố phiên mã (TF) đi cùng.' },
    { q: 'Nucleosome là gì?', a: 'Gồm <b>147 bp DNA</b> quấn khoảng 1,67 vòng quanh một <b>bát phân histone</b> (2 × H2A, H2B, H3, H4), cộng thêm H1 ở chỗ nối. Nucleosome làm DNA bị "khóa" lại, nên polymerase phải có cơ chế riêng để đi qua (FACT).' },
    { q: 'Promoter nhân thực gồm những gì?', a: 'Phần chính là <b>TATA box</b> (TATAAA, khoảng −25 đến −30 so với +1). Ngoài ra còn có các trình tự khác (CAAT, GC box) ở vị trí cách xa. Đây là nơi <b>TBP</b> và các TF bám vào, không phải nơi "σ" như vi khuẩn.' },
    { q: 'Enhancer là gì? Vì sao nó có thể nằm xa gene?', a: '<b>Enhancer</b> là trình tự DNA có thể cách gene hàng nghìn bp, nơi <b>activator</b> bám vào. DNA có thể <b>bẻ cong thành vòng</b> để activator chạm được vào <b>Mediator</b> và polymerase ở promoter. Vì vậy khoảng cách trên DNA không quyết định, mà quyết định là hai đầu có chạm được nhau trong không gian 3D.' },
    { q: 'TBP là gì và thuộc phức hợp nào?', a: '<b>TBP</b> (TATA-binding protein) là một tiểu đơn vị của <b>TFIID</b>. Nó bám TATA box và <b>bẻ cong DNA</b> khoảng 80–100°. Chỗ bẻ cong này là tín hiệu để các TF khác đi tới. TBP có mặt trong mọi loại phiên mã nhân thực (I, II, III), nhưng nhận diện khác nhau.' },
    { q: 'PIC (pre-initiation complex) là gì?', a: '<b>PIC</b> là phức hợp khởi đầu: TFIID (TBP) → TFIIA + TFIIB → RNA polymerase II + TFIIF → TFIIE → TFIIH. Khi PIC đã đủ, polymerase sẵn sàng mở DNA và bắt đầu phiên mã tại +1.' },
    { q: 'CTD của Pol II là gì và phosphoryl hóa để làm gì?', a: '<b>CTD</b> (C-terminal domain) là một đuôi dài gồm nhiều lặp lại <b>YSPTSPS</b> ở tiểu đơn vị lớn nhất của Pol II. Khi <b>Ser5</b> được phosphoryl hóa (bởi TFIIH), Pol II rời promoter. Khi <b>Ser2</b> được phosphoryl hóa, Pol II chuyển sang kéo dài và gọi các enzyme xử lý RNA.' },
    { q: 'Vì sao có 3 loại RNA polymerase?', a: 'Mỗi loại tổng hợp một nhóm RNA khác nhau với mức độ dùng khác nhau: <b>Pol I</b> cho rRNA lớn (28S, 18S, 5.8S), <b>Pol II</b> cho mRNA và phần lớn RNA điều hòa, <b>Pol III</b> cho tRNA, 5S rRNA và U6 snRNA. Ba loại này có promoter và yếu tố khác nhau, nên không lẫn được.' },
  ],

  steps: [
    { title: 'Toàn cảnh: gene nhân thực và các vùng chức năng', text: 'Đọc từ trái sang phải: <b>enhancer</b> (xanh lam, rất xa), khoảng đệm, <b>TATA box</b> (tím, đích của TBP), các trình tự quanh +1, thân gene, rồi <b>AAUAAA</b> (tín hiệu poly-A) ở cuối. Các chấm xám trên DNA là <b>nucleosome</b>. Chú ý: không có σ ở đây, toàn bộ việc lắp ráp là từ các protein.' },
    { title: 'TBP bám TATA và bẻ cong DNA', text: '<b>TBP</b> (tím) bám vào <b>TATA box</b> và bẻ cong DNA thành hình chữ V. Chỗ bẻ cong là "bản đồ" để các TF khác đến. Nhìn kỹ: DNA quanh TATA bị cong rõ, còn phần khác vẫn thẳng.' },
    { title: 'Lắp PIC: TFIIA, TFIIB, Pol II, TFIIF, TFIIE, TFIIH', text: 'Lần lượt các TF đến và lắp lên TBP. <b>Pol II</b> (xanh ngọc) được đưa vào cùng TFIIF/TFIIE. Cuối cùng <b>TFIIH</b> (cam) tới. Khi PIC hoàn chỉnh, Pol II đã nằm sẵn tại promoter. Đây là PIC: bốn đến năm lớp protein đứng chồng lên nhau.' },
    { title: 'TFIIH: tháo xoắn và phosphoryl hóa Ser5', text: 'TFIIH có <b>helicase</b> (mở một đoạn DNA quanh +1, để lộ mạch khuôn) và <b>kinase CDK7</b> (phosphoryl hóa Ser5 của đuôi CTD). Đuôi CTD đã được phosphoryl hóa giúp Pol II <b>rời promoter</b> để chuyển sang kéo dài. Các chấm đỏ mô tả nhóm phosphate đã gắn.' },
    { title: 'Phiên mã bắt đầu tại +1: Ser5 rồi chuyển sang Ser2', text: 'Pol II đọc mạch khuôn 3′→5′ và tổng hợp mRNA 5′→3′. Đầu 5′ của mRNA được gắn <b>mũ m⁷G</b> ngay khi vừa ra khỏi polymerase. Khi polymerase tiến về phía trước, đuôi CTD <b>chuyển từ Ser5 sang Ser2</b> phosphoryl hóa (do P-TEFb/CDK9), báo hiệu giai đoạn kéo dài.' },
    { title: 'Kéo dài qua nucleosome: FACT tháo histone', text: 'Trên thân gene, DNA quấn nucleosome (các cầu tím). <b>FACT</b> (mũ vàng lục) tạm tháo một dimer H2A/H2B ngay phía trước Pol II, để Pol II đi qua, rồi <b>lắp lại</b> phía sau. Đây là lý do nhân thực cần FACT còn nhân sơ thì không (không có histone).' },
    { title: 'Activator ở enhancer: bẻ vòng và kích hoạt Mediator', text: 'Activator (xanh lơ) bám vào enhancer xa. DNA bẻ thành vòng để activator chạm vào <b>Mediator</b> (cầu nối), Mediator lại chạm vào Pol II. Kết quả: PIC được kích hoạt mạnh. Biểu hiện chuyển từ <b>basal</b> (nền) sang <b>mạnh</b> (HIGH). Bật công tắc "enhancer/activator" để thấy vòng xuất hiện.' },
    { title: 'Kết thúc: AAUAAA bị cắt và poly-A được thêm', text: 'Khi Pol II đi qua trình tự <b>AAUAAA</b>, một phức hợp cắt RNA tại đó (cách 10–30 nt phía sau). Poly-A polymerase thêm một đuôi khoảng <b>200 A</b>. Pol II tiếp tục vài trăm nt rồi rời DNA, nên phiên mã không kết thúc ngay ở AAUAAA mà phải kết thúc sau khi cắt.' },
    { title: 'Kiểm chứng: không TBP và α-amanitin', text: 'Bật <b>💥 không có TBP</b>: không có TATA–TBP, không lắp được PIC, không có phiên mã (none). Bật <b>α-amanitin</b>: Pol II vẫn có mặt nhưng không chuyển dịch được, nên phiên mã dừng ngắn. Đây là hai đột biến rất khác nhau về cơ chế.' },
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
    { q: 'Gene nhân thực có TATA box bị đột biến làm TBP không bám được. Điều gì xảy ra?', ops: ['Phiên mã vẫn bình thường vì có enhancer', 'Không lắp được PIC nên giảm mạnh hoặc không có phiên mã', 'mRNA được tạo nhưng không cắt intron', 'Ribosome không dịch được'], a: 1, e: 'TBP là đầu mối lắp PIC. Mất TBP bám TATA, PIC không hình thành, phiên mã giảm rõ. Đáp án "enhancer bù" là bẫy: enhancer cần PIC để hoạt động.' },
    { q: 'α-amanitin được dùng để khóa loại RNA polymerase nào?', ops: ['Pol I', 'Pol II', 'Pol III', 'Mọi polymerase ở mức như nhau'], a: 1, e: 'α-amanitin khóa Pol II, làm mất khả năng chuyển dịch. Pol III ít nhạy hơn, Pol I không bị ảnh hưởng ở liều thấp. "Mọi polymerase" là bẫy.' },
    { q: 'Pol tổng hợp 5S rRNA là:', ops: ['Pol I', 'Pol II', 'Pol III', 'Không có polymerase nào'], a: 2, e: 'Đây là bẫy kinh điển: 5S rRNA do Pol III, cùng nhóm với tRNA. Pol I tổng hợp 28S, 18S, 5.8S.' },
    { q: 'Ser5 của CTD được phosphoryl hóa chủ yếu để làm gì?', ops: ['Gắn enhancer', 'Giúp Pol II rời promoter để bắt đầu kéo dài', 'Gắn histone', 'Cắt intron'], a: 1, e: 'TFIIH phosphoryl hóa Ser5 giúp Pol II rời promoter. Ser2 về sau mới đánh dấu giai đoạn kéo dài. "Cắt intron" thuộc xử lý RNA, không phải chức năng của CTD Ser5.' },
    { q: 'Vì sao enhancer có thể cách gene rất xa vẫn điều hòa được?', ops: ['Vì nó tự phiên mã', 'Vì DNA bẻ vòng để activator chạm được Mediator và Pol II', 'Vì nó nằm trong ribosome', 'Vì histone đẩy nó lại gần'], a: 1, e: 'Vòng DNA đưa activator sát Mediator và Pol II, nên khoảng cách trên DNA không quyết định.' },
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
    const v = new THREE.Vector3();
    const rise = 0.3, bpt = 10.5;

    // ---- DNA ----
    const dnaG = api.group(); dnaG.position.y = 0.4;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.85, turn: bpt, openR: 1.1, parent: dnaG });
    const X = (i) => dna.xOf(i);
    const regG = api.group(); regG.position.y = 0.4;
    const shells = {};
    const shell = (key, k0, color) => {
      const [a, b] = span(k0);
      const m = api.cylinder(1.25, 1.25, (b - a + 1) * rise, color, regG, { opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2;
      shells[key] = m;
    };
    shell('enh', 'enh', 0x66d9ef); shell('tata', 'tata', 0x9b6dd6); shell('body', 'body', 0x4a90e2); shell('pa', 'pa', 0xf5a623);

    L.add('enh', 'ENHANCER (xa)', [X(mid('enh')), 2.6, 0], regG, 'good');
    L.add('tata', 'TATA box', [X(mid('tata')), -2.3, 0], regG, 'big');
    L.add('body', 'thân gene', [X(mid('body')), 2.6, 0], regG, 'dim');
    L.add('pa', 'AAUAAA', [X(mid('pa')), 2.6, 0], regG, 'warn');
    L.add('plus1', '+1', [X(START.pad) + 0.5, -2.6, 0], regG, 'good');
    L.add('tbpMsg', 'TBP bẻ cong DNA', [X(mid('tata')) - 2, 4.6, 0], regG, 'big');
    L.add('ticMsg', 'PIC đã lắp', [X(mid('tata')) + 1, 4.6, 0], regG, 'good');
    L.add('ttMsg', '❌ không có TBP: không có PIC', [X(mid('tata')), 4.8, 0], regG, 'warn');
    L.add('actMsg', 'activator + Mediator: kích hoạt mạnh', [X(mid('enh')), 4.5, 0], regG, 'good');
    L.add('amaMsg', '☠ α-amanitin: Pol II bị khóa', [X(mid('body')), 4.5, 0], regG, 'warn');
    L.add('ser5', 'CTD Ser5-P: rời promoter', [X(START.pad) + 2, 4.2, 0], regG, 'dim');
    L.add('ser2', 'CTD Ser2-P: kéo dài', [X(START.body) + 6, 4.2, 0], regG, 'dim');
    L.add('mrnaLbl', 'mRNA: mũ m⁷G · poly-A', [X(mid('body')), -2.9, 0], regG, 'dim');

    // ---- actors ----
    const pol = api.blob(1.05, C.enzyme, null, { mat: { opacity: 0.9 }, seed: 2, scale: [1.3, 1, 1] });
    const tbp = api.blob(0.6, C.protein, null, { mat: { opacity: 0.95 }, seed: 5 });
    const tfiih = api.blob(0.55, 0xf5a623, null, { mat: { opacity: 0.95 }, seed: 8 });
    const tfiid = api.blob(0.65, 0xc08bf0, null, { mat: { opacity: 0.85 }, seed: 11 });
    const act = api.blob(0.5, 0x66d9ef, null, { mat: { opacity: 0.95 }, seed: 13 });
    const med = api.blob(0.7, 0x5fbf9c, null, { mat: { opacity: 0.85 }, seed: 17 });
    const fact = api.blob(0.5, 0xa0e0a8, null, { mat: { opacity: 0.9 }, seed: 19 });
    const nucs = [];
    const nucG = new THREE.SphereGeometry(0.45, 14, 10);
    for (let k = 0; k < 6; k++) {
      const m = new THREE.Mesh(nucG, api.mat(C.histone, { opacity: 0.55 }));
      m.position.set(X(START.body + 2 + k * 6), 0.9, 0.0);
      api.add(m, regG); nucs.push(m);
    }
    const mRNA = []; for (let k = 0; k < 4; k++) { const b = api.box(0.4, 0.22, 0.22, C.rna, null); b.visible = false; mRNA.push(b); }

    // ---- state ----
    let cur = 0, tbpOn = true, enh = false, ama = false;
    const levelOf = () => {
      if (!tbpOn) return 0;
      if (ama) return 1;
      return enh ? 2 : 1;
    };
    const readout = () => {
      let t;
      const lv = levelOf();
      if (!tbpOn) t = '<b>Biểu hiện: none.</b> Không có TBP nên không lắp được PIC, polymerase không khởi đầu.';
      else if (ama) t = '<b>Biểu hiện: dừng sớm.</b> α-amanitin khóa Pol II, mRNA ngắn rồi dừng, dù PIC vẫn có.';
      else if (enh) t = '<b>Biểu hiện: mạnh (HIGH).</b> Activator ở enhancer, Mediator nối với Pol II, PIC được kích hoạt.';
      else t = '<b>Biểu hiện: basal (nền).</b> Có TATA–TBP và PIC, nhưng không có activator nên chỉ phiên mã ở mức nền.';
      api.readout(t);
    };

    api.toggle('💥 Không có TBP', false, (x) => { tbpOn = !x; ctl.setStep(cur); readout(); });
    api.toggle('α-amanitin (khóa Pol II)', false, (x) => { ama = x; ctl.setStep(cur); readout(); });
    api.toggle('Enhancer + activator đang bật', false, (x) => { enh = x; ctl.setStep(cur); readout(); });
    readout();

    const CAMS = [
      [[0, 2, 31], [0, 0.5, 0]],
      [[-5, 3, 14], [-6, 0.6, 0]],
      [[-4, 4, 14], [-4, 1.5, 0]],
      [[-2, 3, 13], [-1, 1, 0]],
      [[-1, 3, 13], [1, 1, 0]],
      [[0, 4, 15], [1, 1, 0]],
      [[4, 3, 14], [5, 0.5, 0]],
      [[4, 3, 14], [5, 0.5, 0]],
      [[0, 1.5, 22], [0, 0.4, 0]],
    ];

    const ctl = {
      setStep(s) {
        cur = s;
        const lv = levelOf();
        // shells
        shells.tata.material.opacity = (s >= 1) ? 0.3 : 0.12;
        shells.enh.material.opacity = (enh && s >= 6) ? 0.3 : 0.12;
        shells.pa.material.opacity = s >= 7 ? 0.3 : 0.12;
        // TBP / TFIID
        const tbpShow = tbpOn && s >= 1;
        api.fadeTo(tbp, tbpShow ? 1 : 0, 3);
        api.moveTo(tbp, new THREE.Vector3(X(mid('tata')), 1.5, 0), 3);
        api.fadeTo(tfiid, tbpShow && s >= 2 ? 1 : 0, 3);
        api.moveTo(tfiid, new THREE.Vector3(X(mid('tata')) - 0.8, 2.2, 0), 3);
        // Pol II (PIC) and TFIIH
        const polShow = tbpOn && s >= 2;
        api.fadeTo(pol, polShow ? 1 : 0, 3);
        api.moveTo(pol, new THREE.Vector3(X(START.pad) + 1.2, polShow && s >= 4 ? 2.2 : 1.8, 0), 3);
        api.fadeTo(tfiih, tbpOn && s >= 3 ? 1 : 0, 3);
        api.moveTo(tfiih, new THREE.Vector3(X(START.pad) - 1.2, 1.6, 0), 3);
        // activator and Mediator
        const actShow = enh && s >= 6;
        api.fadeTo(act, actShow ? 1 : 0, 3);
        api.moveTo(act, new THREE.Vector3(X(mid('enh')), 2.1, 0), 3);
        api.fadeTo(med, actShow ? 1 : 0, 3);
        api.moveTo(med, new THREE.Vector3(X(START.pad) - 2.4, 3.5, 0), 3);
        // FACT on nucleosomes (s >= 5)
        const factShow = tbpOn && s >= 5;
        api.fadeTo(fact, factShow ? 1 : 0, 3);
        api.moveTo(fact, new THREE.Vector3(X(START.body + 3), 2.1, 0), 3);
        nucs.forEach((n, k) => { const on = s >= 5 && tbpOn ? 1 : 0.55; n.material.opacity = on; n.visible = true; });
        // labels
        const keys = ['enh', 'tata', 'body', 'pa', 'plus1', 'mrnaLbl'];
        if (!tbpOn) keys.push('ttMsg');
        if (tbpOn && s >= 1) keys.push('tbpMsg');
        if (tbpOn && s >= 2) keys.push('ticMsg');
        if (enh && s >= 6) keys.push('actMsg');
        if (ama && s >= 4) keys.push('amaMsg');
        if (tbpOn && s >= 3) keys.push('ser5');
        if (tbpOn && s >= 4) keys.push('ser2');
        L.only(keys);
        api.camera(...CAMS[s]);
        readout();
      },
      update(dt, t) {
        const lv = levelOf();
        // mRNA beads leave the promoter once the gene is being transcribed (s>=3)
        const go = tbpOn && cur >= 4 && cur !== 8;
        const speed = lv === 2 ? 2.0 : (ama ? 0.2 : 0.8);
        const x0 = X(START.body), x1 = X(START.body + SEG.body.length - 1);
        mRNA.forEach((b, k) => {
          const on = go && k < (lv === 2 ? 4 : 2) && !(ama && k > 0);
          b.visible = on;
          if (!on) return;
          const span2 = x1 - x0;
          const phase = ((t * speed + k * (span2 / 4)) % span2 + span2) % span2;
          v.set(x0 + phase, -1.6, 0);
          b.position.lerp(v, 1 - Math.exp(-dt * 6));
        });
        nucs.forEach((n, k) => { n.rotation.y += dt * 0.3; });
        pol.rotation.x += dt * 0.25;
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
