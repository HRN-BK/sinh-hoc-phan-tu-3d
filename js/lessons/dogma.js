// Bài 1: Bản đồ gene, Promoter (DNA) ≠ AUG (mRNA). Bài mẫu cho định dạng mọi bài khác.
export default {
  title: 'Bản đồ gene: Promoter ≠ AUG',
  sub: 'Một gene đi từ DNA → mRNA → protein. Mỗi "tín hiệu" nằm trên một phân tử riêng và do một cỗ máy riêng đọc. Nắm bài này thì không còn lẫn promoter với codon mở đầu.',
  legend: '<span><i style="background:#5b8def"></i>mạch mã hóa (coding)</span><span><i style="background:#ef6c8b"></i>mạch khuôn (template)</span><span><i style="background:#e8505b"></i>A</span><span><i style="background:#f2c94c"></i>T</span><span><i style="background:#f2994a"></i>U</span><span><i style="background:#3fb27f"></i>G</span><span><i style="background:#4a90e2"></i>C</span><span>· trình tự rút gọn, không đúng tỉ lệ</span>',

  why: `<p>Tế bào cần biết <b>3 điều</b> để làm ra một protein từ một gene:</p>
  <ol><li><b>Bắt đầu chép gene ở đâu?</b> Đó là việc của <b>promoter</b>, đoạn DNA "biển báo" cho RNA polymerase bám vào.</li>
  <li><b>Bắt đầu đọc thành amino acid ở đâu?</b> Đó là việc của <b>codon mở đầu AUG</b> trên mRNA, báo cho ribosome.</li>
  <li><b>Dừng ở đâu?</b> <b>Terminator</b> (trên DNA) dừng phiên mã. <b>Codon kết thúc</b> UAA/UAG/UGA (trên mRNA) dừng dịch mã.</li></ol>
  <p>Gene có 2 lớp tín hiệu cho 2 quá trình. <b>Lớp DNA</b> (promoter, +1, terminator) dành cho <b>phiên mã</b>. <b>Lớp mRNA</b> (5′UTR, AUG, các codon, STOP, 3′UTR) dành cho <b>dịch mã</b>.</p>`,

  without: `<ul>
  <li><b>Mất promoter</b>: RNA polymerase không biết bám vào đâu, nên <b>không có mRNA</b> và <b>không có protein</b>. Gene bị "câm" dù vùng mã hóa ATG…TAA hoàn toàn bình thường.</li>
  <li><b>Mất AUG</b> (ví dụ AUG → AUA): phiên mã vẫn bình thường vì promoter không bị ảnh hưởng, nên <b>vẫn có mRNA</b>. Nhưng ribosome không tìm được điểm mở đầu. Hậu quả là <b>không có protein</b>, hoặc ribosome bắt đầu ở một AUG khác phía sau và cho protein ngắn hoặc sai khung.</li>
  <li><b>Mất codon STOP</b>: ribosome đọc lố vào 3′UTR, cho protein dài bất thường. Tế bào phân hủy mRNA đó (non-stop decay).</li>
  <li><b>Mất terminator</b>: RNA polymerase chạy lố sang gene bên cạnh, cho mRNA dài bất thường.</li></ul>
  <div class="box info">👉 Bật 2 công tắc <b>💥 Hỏng promoter</b> và <b>💥 Đột biến AUG → AUA</b> dưới mô hình 3D, rồi bấm lại các bước 1→8 để <b>nhìn tận mắt</b> sự khác nhau.</div>`,

  foundation: [
    { q: 'Gene là gì?', a: 'Một đoạn DNA mang thông tin để tạo ra một sản phẩm: protein, hoặc RNA chức năng như rRNA, tRNA, miRNA. Một gene mã hóa protein gồm cả <b>vùng điều hòa</b> (promoter…) lẫn <b>vùng được phiên mã</b> (5′UTR, vùng mã hóa, 3′UTR).' },
    { q: 'DNA có 2 mạch. Mạch khuôn và mạch mã hóa khác nhau thế nào?', a: '<b>Mạch khuôn</b> (template, antisense) là mạch RNA polymerase <i>đọc</i>, theo chiều 3′→5′. <b>Mạch mã hóa</b> (coding, sense) là mạch còn lại. <b>mRNA giống hệt mạch mã hóa</b>, chỉ thay T bằng U, và <b>bổ sung với mạch khuôn</b>. Vì vậy người ta viết trình tự gene theo mạch mã hóa: thấy "ATG" ở DNA thì mRNA là "AUG".' },
    { q: 'Chiều 5′→3′ nghĩa là gì, và vì sao quan trọng ở đây?', a: 'Mỗi mạch có đầu 5′ (nhóm phosphate) và đầu 3′ (nhóm OH). Polymerase chỉ <b>gắn thêm nucleotide vào đầu 3′</b>, nên RNA luôn được tổng hợp theo chiều <b>5′→3′</b>. Ribosome cũng đọc mRNA theo chiều <b>5′→3′</b>. Vì thế các tín hiệu "mở đầu" luôn nằm phía 5′ (thượng nguồn, upstream), còn tín hiệu "kết thúc" nằm phía 3′.' },
    { q: 'Phiên mã và dịch mã khác nhau thế nào?', a: '<b>Phiên mã</b> (transcription) chép DNA thành RNA. Cỗ máy là <b>RNA polymerase</b>, tín hiệu là promoter, +1 và terminator. <b>Dịch mã</b> (translation) đọc mRNA thành chuỗi amino acid. Cỗ máy là <b>ribosome</b> cùng tRNA, tín hiệu là AUG, các codon và STOP. Ở nhân thực, phiên mã diễn ra trong nhân, dịch mã ở tế bào chất. Ở nhân sơ, hai quá trình diễn ra cùng lúc.' },
    { q: 'Vị trí +1 là gì? Vì sao promoter có số âm (−35, −10)?', a: '<b>+1</b> là nucleotide <b>đầu tiên được phiên mã</b>, cũng là nucleotide đầu tiên của RNA. Phía trước +1 (upstream) đánh số âm: −1, −10, −35. Phía sau (downstream) đánh số dương. <b>Promoter mang số âm</b> nghĩa là nó nằm <b>trước điểm bắt đầu phiên mã</b>, nên <b>không bao giờ có mặt trong mRNA</b>. Lưu ý: không có vị trí 0.' },
    { q: 'Codon là gì? Vì sao gọi AUG là codon mở đầu?', a: '<b>Codon</b> là bộ ba nucleotide <b>trên mRNA</b>, mã hóa 1 amino acid hoặc tín hiệu dừng. AUG mã hóa Methionine (fMet ở vi khuẩn). Ribosome dùng AUG để <b>xác định khung đọc</b>: từ AUG trở đi, cứ 3 nucleotide là 1 codon. Có 3 codon STOP là UAA, UAG, UGA. Chúng không có tRNA tương ứng mà được nhận diện bởi <b>yếu tố giải phóng</b> (release factor, RF).' },
    { q: 'UTR là gì?', a: 'UnTranslated Region là phần mRNA <b>được phiên mã nhưng không được dịch</b>. <b>5′UTR</b> nằm giữa +1 và AUG, chứa trình tự Shine–Dalgarno (SD) ở nhân sơ, giúp ribosome bám. <b>3′UTR</b> nằm sau STOP, chứa vị trí bám miRNA và tín hiệu poly-A ở nhân thực. Như vậy <b>mRNA không bắt đầu bằng AUG</b>!' },
    { q: 'Ribosome tìm AUG bằng cách nào?', a: '<b>Nhân sơ:</b> rRNA 16S của tiểu phần nhỏ bắt cặp với trình tự <b>SD</b> (AGGAGG) nằm khoảng 7 nt trước AUG, đặt AUG đúng vào vị trí P. Initiator tRNA mang <b>fMet</b>. <b>Nhân thực:</b> tiểu phần 40S bám <b>mũ 5′ (m⁷G)</b> rồi <b>quét</b> (scanning) dọc 5′UTR tới AUG đầu tiên trong ngữ cảnh Kozak. Initiator tRNA mang <b>Met</b>, được eIF2-GTP đưa vào.' },
  ],

  steps: [
    { title: 'Toàn cảnh một gene trên DNA', text: 'Đọc từ trái sang phải theo mạch mã hóa (5′→3′) có 4 vùng. <b>Promoter</b> (đỏ, gồm −35 và −10) là nơi RNA polymerase bám. <b>+1</b> là điểm bắt đầu phiên mã. Kế đến là <b>vùng mã hóa ATG…TAA</b>. Cuối cùng là <b>terminator</b>. Xoay mô hình để thấy chuỗi xoắn kép thật.' },
    { title: 'RNA polymerase nhận ra PROMOTER (trên DNA)', text: 'Ở vi khuẩn, <b>yếu tố σ</b> của RNA polymerase nhận ra hộp <b>−35 (TTGACA)</b> và <b>−10 (TATAAT)</b> ở dạng DNA mạch kép. <b>Ribosome không liên quan gì ở đây</b>: chưa hề có mRNA nào cả.' },
    { title: 'Mở xoắn và bắt đầu phiên mã tại +1', text: 'RNA polymerase tách 2 mạch (bóng phiên mã) rồi lắp nucleotide đầu tiên tại <b>+1</b>, <b>bổ sung với mạch khuôn</b>. Nhìn kỹ: mRNA (thanh cam) bắt đầu ngay dưới vạch +1, phía dưới promoter <b>trống trơn</b>.' },
    { title: 'Kéo dài và kết thúc phiên mã', text: 'Polymerase chạy theo chiều 5′→3′ của RNA và kéo theo bóng phiên mã. Nó chép cả <b>5′UTR</b>, <b>ATG</b> (thành AUG), các codon, <b>TAA</b> (thành UAA) và 3′UTR. Tới <b>terminator</b> thì nó nhả mRNA và rời DNA.' },
    { title: 'Soi mRNA: nó chứa những gì?', text: 'Đây là lớp tín hiệu thứ hai. Theo thứ tự trên mRNA: 5′UTR (có SD ở nhân sơ, mũ m⁷G ở nhân thực), <b>AUG = START</b>, các codon, <b>UAA = STOP</b>, 3′UTR (và đuôi poly-A ở nhân thực). <b>Trong mRNA không có promoter, không có −35/−10</b> vì chúng nằm trước +1.' },
    { title: 'Ribosome bám mRNA và tìm AUG', text: 'Ribosome bám vào <b>mRNA</b>, không phải DNA. Nó bám qua SD ở nhân sơ, hoặc bám mũ 5′ rồi quét ở nhân thực, cho tới khi <b>AUG</b> nằm ở vị trí P. tRNA khởi đầu (anticodon 3′-UAC-5′) mang fMet hoặc Met tới bắt cặp với AUG. <b>AUG đặt khung đọc</b>.' },
    { title: 'Dịch từng codon tới STOP', text: 'Mỗi codon được một aa-tRNA mang amino acid tới. Chuỗi lớn dần: fMet/Met, Ala (GCU), Lys (AAA), Gly (GGC), Phe (UUC). Tới <b>UAA</b> thì không có tRNA nào khớp. <b>Yếu tố giải phóng RF</b> cắt chuỗi ra, protein rời đi và cuộn gập.' },
    { title: 'Tổng kết: ai đọc cái gì, ở đâu?', text: 'Hai nhãn lớn tóm tắt. <b>PROMOTER</b> nằm trên DNA, RNA polymerase đọc, mở đầu <b>phiên mã</b>. <b>AUG</b> nằm trên mRNA, ribosome đọc, mở đầu <b>dịch mã</b>. Giờ bật các công tắc 💥 rồi bấm lại từ bước 2 để kiểm chứng.' },
  ],

  application: `<ul>
  <li><b>Vaccine mRNA (COVID-19):</b> phân tử mRNA trong vaccine có mũ 5′, 5′UTR, <b>AUG</b>, vùng mã hóa protein gai, STOP, 3′UTR và poly-A, nhưng <b>KHÔNG có promoter</b>. Lý do: nó được đưa thẳng vào tế bào để ribosome dịch, không cần phiên mã. Chỉ khuôn DNA dùng để <i>sản xuất</i> mRNA trong ống nghiệm mới cần promoter (promoter T7).</li>
  <li><b>Sản xuất insulin bằng E. coli:</b> phải đặt gene insulin (dạng cDNA, không intron) <b>sau một promoter của vi khuẩn</b> (lac, T7…), và thêm <b>SD + AUG</b> để ribosome vi khuẩn khởi đầu. Đặt nhầm thứ tự hoặc thiếu một tín hiệu là không có protein.</li>
  <li><b>Bệnh β-thalassemia:</b> có thể do <b>đột biến promoter</b> (ví dụ ở hộp TATA của gene β-globin), làm <b>giảm lượng mRNA</b>. Cũng có thể do <b>đột biến codon mở đầu ATG</b>: vẫn có mRNA nhưng không dịch được. Hai kiểu đột biến khác cơ chế mà cùng kết quả là thiếu β-globin.</li>
  <li><b>Gene báo cáo (reporter):</b> gắn promoter của gene cần nghiên cứu vào trước gene GFP. Tế bào phát sáng xanh lúc nào thì promoter đó "bật" lúc đó.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>PROMOTER</th><th>Codon mở đầu AUG</th></tr>
  <tr><td>Nằm trên</td><td><b>DNA</b> (mạch kép)</td><td><b>mRNA</b> (trên DNA mạch mã hóa là ATG, mạch khuôn là TAC)</td></tr>
  <tr><td>Ai nhận ra</td><td>RNA polymerase (σ ở nhân sơ; TBP/TFIID… ở nhân thực)</td><td>Ribosome cùng tRNA khởi đầu (anticodon UAC)</td></tr>
  <tr><td>Mở đầu quá trình</td><td><b>Phiên mã</b></td><td><b>Dịch mã</b></td></tr>
  <tr><td>Vị trí</td><td>Trước +1 (số âm)</td><td>Sau +1, sau 5′UTR</td></tr>
  <tr><td>Có trong mRNA?</td><td><b>Không</b></td><td><b>Có</b></td></tr>
  <tr><td>Đột biến làm gì</td><td>Đổi <b>lượng / thời điểm</b> mRNA (không đổi trình tự protein)</td><td>Không khởi đầu, hoặc khởi đầu sai chỗ, nên <b>mất hoặc hỏng protein</b></td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>+1 vs AUG</td><td>+1: nucleotide đầu tiên của RNA (bắt đầu <b>phiên mã</b>)</td><td>AUG: codon đầu tiên được dịch (bắt đầu <b>dịch mã</b>). Hai vị trí cách nhau một đoạn 5′UTR.</td></tr>
  <tr><td>Terminator vs STOP codon</td><td>Terminator: trên <b>DNA</b>, dừng <b>phiên mã</b> (RNA pol rời ra)</td><td>STOP (UAA/UAG/UGA): trên <b>mRNA</b>, dừng <b>dịch mã</b> (RF nhận diện)</td></tr>
  <tr><td>Mạch khuôn vs mạch mã hóa</td><td>Khuôn: được đọc, <b>bổ sung</b> với mRNA</td><td>Mã hóa: <b>giống</b> mRNA (T↔U)</td></tr>
  <tr><td>SD vs mũ 5′</td><td>SD: trình tự trong 5′UTR ở <b>nhân sơ</b>, bắt cặp rRNA 16S</td><td>Mũ m⁷G: gắn vào đầu 5′ mRNA <b>nhân thực</b>, ribosome bám rồi quét</td></tr>
  </table></div>`,

  traps: [
    { trap: '"AUG nằm trong promoter" hoặc "promoter chứa codon mở đầu".', truth: 'Promoter nằm trên <b>DNA</b>, phía trước +1, và <b>không được phiên mã</b>. AUG nằm trên <b>mRNA</b>, phía sau 5′UTR. Hai thứ nằm ở hai phân tử khác nhau.' },
    { trap: '"Phiên mã bắt đầu tại AUG".', truth: 'Phiên mã bắt đầu tại <b>+1</b>, ngay sau promoter. AUG chỉ là chỗ bắt đầu <b>dịch mã</b>. Giữa +1 và AUG là 5′UTR.' },
    { trap: '"mRNA luôn bắt đầu bằng AUG".', truth: 'mRNA bắt đầu bằng <b>5′UTR</b>, và ở nhân thực có thêm mũ m⁷G ở đầu 5′. AUG nằm sau 5′UTR.' },
    { trap: '"Ribosome bám vào promoter".', truth: 'Ribosome bám <b>mRNA</b> (qua SD hoặc mũ 5′). Chỉ <b>RNA polymerase</b> và yếu tố phiên mã mới bám promoter.' },
    { trap: '"Terminator và codon kết thúc là một".', truth: 'Terminator nằm trên <b>DNA</b> và kết thúc <b>phiên mã</b>. STOP codon nằm trên <b>mRNA</b> và kết thúc <b>dịch mã</b>. Trên mRNA, STOP nằm trước 3′UTR, còn terminator nằm ở cuối gene.' },
    { trap: '"mRNA giống mạch khuôn".', truth: 'mRNA <b>bổ sung</b> với mạch khuôn và <b>giống mạch mã hóa</b> (chỉ đổi T thành U).' },
    { trap: '"Đột biến ở promoter làm thay đổi trình tự amino acid".', truth: 'Promoter không được dịch, nên đột biến ở đó chỉ làm thay đổi <b>lượng</b> hoặc <b>thời điểm</b> tạo mRNA. Trình tự protein (nếu vẫn có) không đổi.' },
    { trap: '"Codon STOP được tRNA mang amino acid tới".', truth: 'Không có tRNA nào cho UAA/UAG/UGA. <b>Yếu tố giải phóng (RF)</b> nhận diện chúng và cắt chuỗi polypeptide ra.' },
  ],

  quiz: [
    { q: 'Promoter nằm trên phân tử nào?', ops: ['mRNA', 'DNA', 'tRNA', 'rRNA 16S'], a: 1, e: 'Promoter là trình tự DNA (mạch kép) phía trước +1, nơi RNA polymerase bám. Nó không được phiên mã nên không có trong mRNA.' },
    { q: 'Một đột biến xóa hộp −10 của gene vi khuẩn. Điều gì xảy ra?', ops: ['mRNA được tạo nhưng không dịch được', 'Protein bị thay một amino acid', 'Gene hầu như không được phiên mã nên không có mRNA', 'Ribosome không bám được SD'], a: 2, e: 'Hộp −10 thuộc promoter. Mất nó thì σ/RNA polymerase không nhận ra gene, nên gần như không có mRNA. SD và AUG không bị ảnh hưởng nhưng chẳng có mRNA nào để dịch.' },
    { q: 'Một đột biến đổi AUG mở đầu thành AUA. Câu nào ĐÚNG?', ops: ['Không còn mRNA', 'Vẫn có mRNA bình thường, nhưng dịch mã không khởi đầu đúng chỗ', 'RNA polymerase không bám được', 'Protein dài hơn bình thường'], a: 1, e: 'Phiên mã chỉ phụ thuộc promoter, nên mRNA vẫn có (trên đó là AUA). Ribosome không tìm thấy codon mở đầu đúng, nên không có protein hoặc khởi đầu ở AUG khác phía sau.' },
    { q: 'Thứ tự đúng trên một phân tử mRNA của vi khuẩn (5′→3′):', ops: ['Promoter, AUG, codon, STOP', 'SD, AUG, codon, STOP, 3′UTR', 'AUG, SD, codon, STOP', '−35, −10, AUG, STOP'], a: 1, e: 'mRNA không chứa promoter (−35/−10). 5′UTR chứa SD, rồi AUG, các codon, STOP, 3′UTR.' },
    { q: 'Mạch mã hóa có đoạn 5′-ATG GCT-3′. Đoạn mRNA tương ứng là:', ops: ['5′-UAC CGA-3′', '5′-AUG GCU-3′', '3′-AUG GCU-5′', '5′-TAC CGA-3′'], a: 1, e: 'mRNA giống mạch mã hóa, đổi T thành U, cùng chiều 5′→3′. Mạch khuôn mới là 3′-TAC CGA-5′.' },
    { q: 'Cấu trúc nào KẾT THÚC phiên mã?', ops: ['Codon UAA', 'Yếu tố giải phóng RF', 'Terminator trên DNA', 'Đuôi poly-A'], a: 2, e: 'Terminator (trên DNA) kết thúc phiên mã. UAA và RF thuộc kết thúc dịch mã. Poly-A được gắn sau khi cắt RNA ở nhân thực, không phải tín hiệu dừng của polymerase.' },
  ],

  recall: [
    'Vẽ 2 tầng: tầng DNA (promoter −35/−10, +1, ATG…TAA, terminator) và tầng mRNA bên dưới (5′UTR/SD, AUG, codon, UAA, 3′UTR). Đánh dấu chỗ trên mRNA KHÔNG có gì.',
    'Viết bảng 3 cột: "Tín hiệu, Nằm trên, Ai đọc", cho promoter, +1, AUG, STOP, terminator, SD, mũ 5′.',
    'Nếu hỏng promoter thì sao? Nếu hỏng AUG thì sao? Trả lời mỗi câu trong 1 dòng.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const SEQ = ['TTGACA', 'GC', 'TATAAT', 'CG', 'AGGA', 'ATG', 'GCTAAAGGCTTC', 'TAA', 'CGCC', 'GCCCGGGC'].join('');
    const rise = 0.55, T1 = 16, TEND = 45, N = TEND - T1 + 1, CS = -5 / 3;
    const v = new THREE.Vector3();

    // ---- DNA layer ----
    const dnaG = api.group(); dnaG.position.y = 3;
    const dna = api.dna({ seq: SEQ, rise, radius: 0.85, turn: 10.5, openR: 1.1, parent: dnaG });
    const X = (i) => dna.xOf(i);
    const regG = api.group(); regG.position.y = 3;
    const shells = {};
    const shell = (key, a, b, color, text, cls = '') => {
      const m = api.cylinder(1.3, 1.3, (b - a + 1) * rise, color, regG, { opacity: 0.14, depthWrite: false, side: THREE.DoubleSide });
      m.rotation.z = Math.PI / 2; m.position.x = (X(a) + X(b)) / 2;
      shells[key] = { m, l: api.label(text, [m.position.x, 2.0, 0], regG, cls) };
    };
    shell('prom', 0, 13, 0xff5a5f, 'PROMOTER (trên DNA)', 'warn');
    shell('utr5', 16, 19, 0xaaaaaa, "5′UTR", 'dim');
    shell('cds', 20, 37, 0x4a90e2, 'Vùng mã hóa ATG … TAA');
    shell('term', 40, 49, 0x9b9b9b, 'Terminator', 'dim');
    const l35 = api.label('−35 TTGACA', [X(2.5), -1.7, 0], regG, 'dim');
    const l10 = api.label('−10 TATAAT', [X(10.5), -1.7, 0], regG, 'dim');
    const plus1 = api.box(0.05, 3.6, 0.05, 0xffffff, regG); plus1.position.x = X(T1);
    const smallLbls = [l35, l10, api.label('+1', [X(T1), -2.4, 0], regG, 'good'), api.label('ATG (mạch mã hóa)<br>TAC (mạch khuôn)', [X(21), -1.9, 0], regG, 'dim')];
    const p0 = dna.pairs[0], pz = dna.pairs[dna.pairs.length - 1];
    api.label("5′", [X(0) - 0.8, p0.half1.position.y + 0.2, p0.half1.position.z], dnaG, 'plain');
    api.label("3′", [X(0) - 0.8, p0.half2.position.y - 0.2, p0.half2.position.z], dnaG, 'plain');
    api.label("3′", [X(49) + 0.8, pz.half1.position.y + 0.2, pz.half1.position.z], dnaG, 'plain');
    api.label("5′", [X(49) + 0.8, pz.half2.position.y - 0.2, pz.half2.position.z], dnaG, 'plain');

    // ---- RNA polymerase ----
    const pol = api.blob(1.55, C.enzyme, null, { mat: { opacity: 0.5, depthWrite: false }, scale: [1.25, 1, 1], seed: 2 });
    pol.position.set(-24, 10, 0);
    const polLbl = api.label('RNA polymerase (lõi + σ)', [0, 1.9, 0], pol, 'big');
    api.setOpacity(pol, 0);

    // ---- mRNA layer ----
    const mG = api.group(); mG.position.y = 0.9;
    const nts = [];
    for (let j = 0; j < N; j++) {
      const i = T1 + j, b = SEQ[i] === 'T' ? 'U' : SEQ[i];
      const m = api.box(0.24, 0.6, 0.24, C[b], mG); m.position.set(X(i), 0.35, 0); m.scale.setScalar(0.001);
      nts.push({ m, b, i });
    }
    const bb = api.box(1, 0.16, 0.16, C.rna, mG); bb.visible = false;
    const codonLbls = [];
    const cl = (t, a, b, cls, y = -0.5) => { const l = api.label(t, [(X(a) + X(b)) / 2, y, 0], mG, cls); codonLbls.push(l); return l; };
    const utrL = cl("5′UTR · SD", 16, 19, 'dim'), augL = cl('AUG = START', 20, 22, 'good', -1.15);
    cl('GCU', 23, 25, 'dim'); cl('AAA', 26, 28, 'dim'); cl('GGC', 29, 31, 'dim'); cl('UUC', 32, 34, 'dim');
    const stopL = cl('UAA = STOP', 35, 37, 'warn', -1.15); cl("3′UTR", 38, 45, 'dim');
    codonLbls.push(api.label("5′", [X(T1) - 0.7, 0.3, 0], mG, 'plain'), api.label("3′", [X(TEND) + 0.7, 0.3, 0], mG, 'plain'));
    const noProm = api.label('← mRNA bắt đầu từ +1:<br>ở đây KHÔNG có promoter', [X(8), 0.4, 0], mG, 'warn');
    const mrnaName = api.label('mRNA', [X(30), 1.3, 0], mG, 'big');
    // eukaryote extras
    const eukG = api.group(mG);
    const cap = api.sphere(0.3, C.methyl, eukG); cap.position.set(X(T1) - 0.6, 0.15, 0);
    api.label('mũ m⁷G', [X(T1) - 0.9, -0.5, 0], eukG, 'dim');
    const tail = []; for (let k = 0; k <= 10; k++) tail.push(new THREE.Vector3(X(TEND) + 0.4 + k * 0.32, -0.1 * k + 0.15 * Math.sin(k), 0));
    api.tube(tail, 0.1, C.A, eukG); api.label('đuôi poly-A', [X(TEND) + 2.2, -1.2, 0], eukG, 'dim');

    // ---- ribosome & protein ----
    const rib = api.group(mG);
    const small = api.blob(1, C.ribosome, rib, { scale: [1.35, 0.55, 1], mat: { opacity: 0.7, depthWrite: false }, seed: 4 }); small.position.y = 1.0;
    const large = api.blob(1, 0x5d8fb8, rib, { scale: [1.6, 0.95, 1.25], mat: { opacity: 0.7, depthWrite: false }, seed: 7 }); large.position.y = -1.0;
    const ribL = api.label('Ribosome', [0, 2.0, 0], rib, 'big');
    api.setOpacity(rib, 0);
    const AA = [['fMet', 0xe8505b], ['Ala', 0x3fb27f], ['Lys', 0x4a90e2], ['Gly', 0xf2c94c], ['Phe', 0x9b6dd6]];
    const beads = AA.map(([n, col]) => { const s = api.sphere(0.3, col, mG); s.scale.setScalar(0.001); s.position.set(X(T1), -2.4, 0); const l = api.label(n, [0.55, 0, 0], s, 'dim'); api.showLabel(l, false); return { s, l }; });
    const bonds = [0, 1, 2, 3].map(() => { const st = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.07, 0xdddddd, mG); st.visible = false; return st; });

    // ---- messages ----
    const msg = api.label('', [0, -4.6, 0], null, 'warn');
    const cmpP = api.label('<b>PROMOTER</b>: trên DNA<br>RNA polymerase bám<br>→ mở đầu PHIÊN MÃ<br>không có trong mRNA', [X(6.5), 7.6, 0], null, 'big');
    const cmpA = api.label('<b>AUG</b>: trên mRNA<br>ribosome + tRNA đọc<br>→ mở đầu DỊCH MÃ', [X(21), -4.2, 0], mG, 'good');

    // ---- state ----
    let cur = 0, p = 0, pT = 0, c = CS, cT = CS, polMode = 'off', polVis = false, ribVis = false, mY = 0.9;
    let euk = false, promBad = false, augBad = false, ribTxt = '';
    const P = [[0, 0], [0, 0], [0, .08], [.08, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
    const CC = [[CS, CS], [CS, CS], [CS, CS], [CS, CS], [CS, CS], [CS, 0], [0, 5], [5, 5]];
    const CAMS = [[[0, 2, 31], [0, 1, 0]], [[-7, 4, 13], [-9.5, 2.6, 0]], [[-2.5, 3, 13], [-5, 2, 0]], [[2, 3, 25], [1, 1.8, 0]],
      [[1, 0.5, 21], [1, -0.4, 0]], [[-2, 0, 14], [-3, -1, 0]], [[3, -0.5, 19], [3, -1.6, 0]], [[0, 1.5, 33], [0, 0.6, 0]]];
    const readout = () => {
      let t = 'Thử nghiệm: bật một đột biến 💥, rồi bấm lại các bước 2→8 để xem hậu quả.';
      if (promBad && augBad) t = '❌ Cả hai: promoter hỏng nên không có mRNA (đột biến AUG lúc này còn chẳng có dịp gây hại).';
      else if (promBad) t = '❌ <b>Promoter hỏng</b>: RNA polymerase không nhận ra gene, nên KHÔNG có mRNA và KHÔNG có protein, dù ATG…TAA vẫn nguyên vẹn.';
      else if (augBad) t = '❌ <b>AUG → AUA</b>: promoter vẫn tốt nên VẪN CÓ mRNA. Nhưng ribosome không tìm được codon mở đầu, nên không có protein (hoặc bắt đầu sai ở AUG phía sau).';
      api.readout(t);
    };
    const paintMutations = () => {
      // promoter −10 box TATAAT → GCGCGC when broken
      for (let i = 8; i <= 13; i++) { const pr = dna.pairs[i]; const b1 = promBad ? (i % 2 ? 'C' : 'G') : SEQ[i]; pr.base1.material.color.set(C[b1]); pr.base2.material.color.set(C[{ A: 'T', T: 'A', G: 'C', C: 'G' }[b1]]); }
      const pr = dna.pairs[22]; pr.base1.material.color.set(augBad ? C.A : C.G); pr.base2.material.color.set(augBad ? C.T : C.C);
      nts[22 - T1].m.material.color.set(augBad ? C.A : C.G);
      api.setLabel(augL, augBad ? 'AUA ✗ (không phải START)' : 'AUG = START'); augL.element.className = 'lbl ' + (augBad ? 'warn' : 'good');
      api.setLabel(shells.prom.l, promBad ? 'PROMOTER HỎNG ✗ (−10 bị đổi)' : (euk ? 'PROMOTER (trên DNA): TATA box' : 'PROMOTER (trên DNA)'));
      api.setLabel(cmpA, augBad ? '<b>AUA</b>: ribosome không nhận ra<br>→ KHÔNG mở đầu dịch mã' : '<b>AUG</b>: trên mRNA<br>ribosome + tRNA đọc<br>→ mở đầu DỊCH MÃ');
    };
    const applyEuk = () => {
      api.setLabel(polLbl, euk ? 'RNA polymerase II + TFIID (TBP)…' : 'RNA polymerase (lõi + σ)');
      api.setLabel(l10, euk ? 'TATA box (≈ −25 đến −30)' : '−10 TATAAT');
      api.showLabel(l35, !euk);
      api.setLabel(utrL, euk ? "5′UTR (quét từ mũ)" : "5′UTR · SD");
      api.setLabel(beads[0].l, euk ? 'Met' : 'fMet');
      paintMutations(); setVis();
    };
    function setVis() {
      const hasRNA = !promBad && cur >= 4;
      codonLbls.forEach(l => api.showLabel(l, hasRNA && (cur < 7 || l === augL || l === stopL)));
      api.showLabel(noProm, hasRNA && cur === 4);
      api.showLabel(mrnaName, !promBad && cur >= 3);
      eukG.visible = euk && hasRNA; eukG.traverse(o => { if (o.isCSS2DObject) api.showLabel(o, euk && hasRNA); });
      api.showLabel(cmpP, cur === 7); api.showLabel(cmpA, cur === 7 && !promBad);
      let m = '';
      if (promBad && cur >= 2) m = '❌ Không có mRNA: promoter hỏng nên không phiên mã được';
      else if (augBad && cur >= 6) m = '❌ Có mRNA nhưng KHÔNG có protein: không có AUG để mở đầu';
      api.setLabel(msg, m); api.showLabel(msg, !!m);
      for (const [k, s] of Object.entries(shells)) {
        const dim = cur >= 4 && cur <= 6;
        s.m.material.opacity = dim ? 0.04 : (k === 'prom' && cur === 1 ? 0.38 : 0.14);
        api.showLabel(s.l, !dim && !(cur === 7 && (k === 'prom' || k === 'utr5')));
      }
      const dim = cur >= 4 && cur <= 6;
      smallLbls.forEach((l, k) => api.showLabel(l, cur <= 3 ? !(l === l35 && euk) : (cur === 7 && k === 2)));
    }
    api.toggle('Kiểu nhân thực (TATA, mũ 5′, poly-A)', false, (x) => { euk = x; applyEuk(); });
    api.toggle('💥 Hỏng promoter', false, (x) => { promBad = x; paintMutations(); ctl.setStep(cur); readout(); });
    api.toggle('💥 Đột biến AUG → AUA', false, (x) => { augBad = x; paintMutations(); ctl.setStep(cur); readout(); });
    readout();

    const ctl = {
      setStep(s) {
        cur = s;
        [p, pT] = promBad ? [0, 0] : P[s];
        [c, cT] = CC[s];
        if (augBad && s >= 5) { c = s === 5 ? CS : 8; cT = 8; }
        polMode = s === 0 ? 'off' : s >= 4 ? 'gone' : promBad ? 'reject' : s === 1 ? 'prom' : 'track';
        mY = s === 7 ? -1.8 : s >= 4 ? -0.6 : 0.9;
        api.fadeTo(dnaG, s >= 4 && s <= 6 ? 0.15 : 1);
        api.camera(...CAMS[s]);
        setVis();
      },
      update(dt, t) {
        p += Math.sign(pT - p) * Math.min(Math.abs(pT - p), 0.11 * dt);
        c += Math.sign(cT - c) * Math.min(Math.abs(cT - c), (augBad ? 2.2 : 0.9) * dt);
        // polymerase
        if (polMode === 'prom') v.set(X(6.5), 3, 0);
        else if (polMode === 'track') v.set(p >= 0.999 ? X(TEND) + 5 : X(T1 + p * (N - 1)) + 0.5, p >= 0.999 ? 9 : 3, 0);
        else if (polMode === 'reject') v.set(X(6.5) + Math.sin(t * 1.6) * 0.8, 6.8, 0);
        else v.set(-24, 10, 0);
        pol.position.lerp(v, 1 - Math.exp(-dt * 3)); pol.rotation.x += dt * 0.3;
        const show = polMode === 'prom' || polMode === 'reject' || (polMode === 'track' && p < 0.999);
        if (show !== polVis) { polVis = show; api.fadeTo(pol, show ? 0.5 : 0); api.showLabel(polLbl, show); }
        if (polMode === 'reject') api.setLabel(polLbl, '❓ Không nhận ra promoter… không bám được');
        else if (polVis) api.setLabel(polLbl, euk ? 'RNA polymerase II + TFIID (TBP)…' : 'RNA polymerase (lõi + σ)');
        // transcription bubble
        if (polMode === 'track' && p < 0.999 && cur >= 2) { const ti = Math.floor(T1 + p * (N - 1)); dna.openRange(ti - 3, ti + 4, 0.9); }
        else dna.openRange(0, 0, 0);
        // mRNA
        const shown = promBad ? 0 : Math.floor(p * N + 1e-6);
        const k8 = 1 - Math.exp(-dt * 8);
        nts.forEach((n, j) => { const tg = j < shown ? 1 : 0.001; n.m.scale.setScalar(n.m.scale.x + (tg - n.m.scale.x) * k8); });
        if (shown > 0) { const x0 = X(T1) - 0.15, x1 = X(T1 + shown - 1) + 0.15; bb.scale.x = x1 - x0; bb.position.x = (x0 + x1) / 2; bb.visible = true; } else bb.visible = false;
        mG.position.y += (mY - mG.position.y) * (1 - Math.exp(-dt * 3));
        // ribosome
        const rShow = cur >= 5 && !promBad && c < 7.6;
        if (rShow !== ribVis) { ribVis = rShow; api.fadeTo(rib, rShow ? 0.7 : 0); api.showLabel(ribL, rShow); }
        rib.position.x = X(21 + 3 * c);
        let txt = '';
        if (cur === 5) txt = augBad ? '🔍 Quét mRNA… không thấy AUG!' : c > -0.02 ? (euk ? 'Met' : 'fMet') + '-tRNA (anticodon UAC) khớp AUG' : (euk ? 'Bám mũ 5′, quét tìm AUG…' : 'SD bắt cặp rRNA 16S, đặt AUG vào vị trí P…');
        if (cur >= 6 && !augBad) { const k = Math.min(5, Math.floor(c + 1e-6)); txt = k >= 5 ? 'UAA: không tRNA nào khớp → RF giải phóng protein' : `Codon ${k + 1}: ${['AUG', 'GCU', 'AAA', 'GGC', 'UUC'][k]} → ${k === 0 ? (euk ? 'Met' : 'fMet') : AA[k][0]}`; }
        if (txt !== ribTxt) { ribTxt = txt; api.setLabel(ribL, txt || 'Ribosome'); }
        // protein beads
        const nB = (cur >= 5 && !augBad && !promBad && c >= -0.02) ? Math.min(5, Math.floor(c + 0.02) + 1) : 0;
        const released = cur >= 6 && !augBad && !promBad && c >= 4.99;
        beads.forEach((b, k) => {
          const on = k < nB, tg = on ? 1 : 0.001;
          b.s.scale.setScalar(b.s.scale.x + (tg - b.s.scale.x) * k8); api.showLabel(b.l, on);
          if (released) { const a = k / 5 * Math.PI * 2 + t * 0.4; v.set(X(36) + 4 + Math.cos(a) * 0.65, -3.0 + Math.sin(a) * 0.65, Math.sin(a * 2) * 0.3); }
          else v.set(rib.position.x + 0.15 * Math.sin(k * 1.7), -2.35 - (nB - 1 - k) * 0.62, 0);
          b.s.position.lerp(v, 1 - Math.exp(-dt * 5));
        });
        bonds.forEach((st, k) => { st.visible = k + 1 < nB; if (st.visible) api.setStick(st, beads[k].s.position, beads[k + 1].s.position); });
        if (cur === 7 && ribVis) { ribVis = false; api.fadeTo(rib, 0); api.showLabel(ribL, false); }
      },
    };
    return ctl;
  },
};
