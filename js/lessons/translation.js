// Bài 16: Dịch mã. tRNA & aminoacyl-tRNA synthetase, ribosome 70S/80S, khởi đầu (SD vs cap/scanning), kéo dài (EF-Tu, peptidyl transferase, EF-G), kết thúc, polysome, kháng sinh.
import { labels } from './_kit.js';

export default {
  title: 'Dịch mã: ribosome & tRNA',
  sub: 'Ribosome đọc mRNA từng bộ ba (codon), tRNA mang đúng amino acid đến, và chuỗi polypeptide dài dần. Xem từng bước trong 3D: tRNA vào vị trí A, liên kết peptide hình thành, ribosome trượt đi 3 nucleotide.',
  legend: '<span><i style="background:#f2994a"></i>mRNA</span><span><i style="background:#e38fbf"></i>tRNA</span><span><i style="background:#7fb3d5"></i>ribosome</span><span><i style="background:#30d158"></i>EF-Tu / eEF1A</span><span><i style="background:#64d2ff"></i>EF-G / eEF2</span><span><i style="background:#ff6b6b"></i>yếu tố kết thúc</span><span>· base: A đỏ, U cam, G xanh lá, C xanh dương</span>',

  why: `<p><b>Dịch mã</b> (translation) là bước cuối của luồng thông tin di truyền: chuyển ngôn ngữ 4 chữ của mRNA (A, U, G, C) thành ngôn ngữ 20 chữ của protein (amino acid). Mỗi <b>codon</b> 3 nucleotide quy định 1 amino acid.</p>
  <p>Cỗ máy làm việc này là <b>ribosome</b> (rRNA + protein). Nó có 3 "chỗ ngồi" cho tRNA: <b>A</b> (aminoacyl, tRNA mới đến), <b>P</b> (peptidyl, giữ chuỗi đang dài), <b>E</b> (exit, tRNA rỗng ra). <b>tRNA</b> là "người phiên dịch": một đầu có <b>anticodon</b> bắt cặp với codon, đầu kia (<b>3′ CCA</b>) mang amino acid tương ứng.</p>`,

  without: `<ul>
  <li><b>Không dịch mã được</b> thì không có protein mới, tế bào chết. Đây là lý do nhiều <b>kháng sinh</b> nhắm vào ribosome vi khuẩn (70S): tetracycline, streptomycin, chloramphenicol, erythromycin.</li>
  <li><b>Đột biến vô nghĩa</b> (nonsense, ví dụ AAA → UAA): codon kết thúc xuất hiện sớm, nên protein bị <b>cắt cụt</b>. Ví dụ: một số thể bệnh xơ nang (CFTR G542X) và loạn dưỡng cơ Duchenne. Ở nhân thực, mRNA đó còn bị cơ chế <b>NMD</b> phân hủy.</li>
  <li><b>Độc tố bạch hầu</b> (diphtheria toxin) bất hoạt <b>eEF2</b>, nên ribosome người không chuyển vị được, tế bào chết.</li>
  <li><b>Synthetase nạp nhầm amino acid</b>: tRNA mang sai amino acid, nên protein sai trình tự dù mRNA đúng.</li></ul>
  <div class="box info">👉 Thử <b>💥 Tetracycline</b> ở bước 5–9 (vị trí A bị chặn), <b>💥 Đột biến vô nghĩa</b> ở bước 8–9 (protein cụt), và <b>Nhân thực</b> để đổi toàn bộ tên yếu tố và cách khởi đầu.</div>`,

  foundation: [
    { q: 'Codon là gì? Có bao nhiêu codon?', a: 'Codon là <b>bộ ba nucleotide</b> liên tiếp trên mRNA, đọc theo chiều <b>5′→3′</b>. 4³ = <b>64 codon</b>: 61 codon mã hóa amino acid và <b>3 codon kết thúc</b> (UAA, UAG, UGA). <b>AUG</b> vừa là codon mở đầu vừa mã hóa Met. Mã di truyền <b>thoái hóa</b>: nhiều codon cùng mã hóa một amino acid (ví dụ GGU, GGC, GGA, GGG đều là Gly).' },
    { q: 'Khung đọc (reading frame) là gì?', a: 'Là cách chia mRNA thành các bộ ba, bắt đầu từ AUG. Dịch đi 1 nucleotide là toàn bộ các codon sau đó đổi nghĩa. Vì vậy ribosome phải bắt đầu <b>đúng ở AUG</b> và mỗi lần trượt <b>đúng 3 nucleotide</b>.' },
    { q: 'tRNA trông như thế nào?', a: 'Là RNA ngắn (khoảng <b>76 nt</b>). Cấu trúc bậc 2 hình <b>lá chẻ ba</b> (cloverleaf), cuộn lại trong không gian thành <b>hình chữ L</b>. Một đầu chữ L là <b>vòng anticodon</b> (3 base bắt cặp với codon). Đầu kia là đầu <b>3′ có trình tự CCA</b>, nơi amino acid được gắn vào bằng liên kết ester.' },
    { q: 'Ai gắn amino acid vào đúng tRNA?', a: '<b>Aminoacyl-tRNA synthetase</b>, có khoảng 20 loại (mỗi amino acid một loại). Nó dùng <b>ATP</b> để hoạt hóa amino acid (thành aminoacyl-AMP, giải phóng PPi), rồi chuyển amino acid lên đầu 3′ của tRNA. Đây là bước "dịch" thật sự: nếu synthetase nạp nhầm, ribosome không phát hiện được.' },
    { q: 'Ribosome gồm những gì? "S" nghĩa là gì?', a: 'Gồm 2 tiểu đơn vị, mỗi cái là <b>rRNA + protein</b>. Nhân sơ <b>70S = 30S (rRNA 16S) + 50S (rRNA 23S, 5S)</b>. Nhân thực <b>80S = 40S (18S) + 60S (28S, 5.8S, 5S)</b>. <b>S (Svedberg)</b> là đơn vị tốc độ lắng khi ly tâm, phụ thuộc cả khối lượng lẫn hình dạng. Vì vậy 30 + 50 ≠ 70: <b>S không cộng được</b>.' },
    { q: 'GTP dùng để làm gì trong dịch mã?', a: 'Nhiều yếu tố là <b>GTPase</b>: dạng gắn GTP thì "bật", thủy phân thành GDP thì đổi hình dạng và rời ribosome. Mỗi vòng kéo dài tốn <b>2 GTP</b> (1 cho EF-Tu, 1 cho EF-G). GTP giống như "chốt kiểm tra": chỉ khi codon–anticodon khớp thì GTP mới bị thủy phân.' },
    { q: 'Nhân sơ và nhân thực khác nhau thế nào về vị trí dịch mã?', a: '<b>Nhân sơ</b>: không có màng nhân, nên ribosome bám mRNA <b>ngay khi nó đang được phiên mã</b> (phiên mã và dịch mã đồng thời). <b>Nhân thực</b>: phiên mã trong nhân, pre-mRNA được gắn cap, nối exon, gắn poly-A, rồi mới ra tế bào chất để dịch mã.' },
    { q: 'Chiều của dịch mã?', a: 'Ribosome đọc mRNA theo chiều <b>5′→3′</b>. Chuỗi polypeptide được tổng hợp từ <b>đầu N đến đầu C</b>: amino acid đầu tiên (Met/fMet) là đầu N.' },
  ],

  steps: [
    { title: 'tRNA và aminoacyl-tRNA synthetase: nạp amino acid', text: 'tRNA <b>hình chữ L</b>: đáy là <b>anticodon</b> (3 khối màu), đỉnh là <b>đầu 3′ CCA</b>. <b>Aminoacyl-tRNA synthetase</b> (khối xanh ngọc lớn) bắt amino acid và <b>ATP</b>, tạo aminoacyl-AMP (PPi văng ra), rồi gắn amino acid lên đầu CCA. Giờ ta có <b>aminoacyl-tRNA</b> ("tRNA đã nạp").' },
    { title: 'Ribosome: 2 tiểu đơn vị và 3 vị trí E–P–A', text: 'Tiểu đơn vị <b>nhỏ</b> (dưới) giữ mRNA và kiểm tra codon–anticodon. Tiểu đơn vị <b>lớn</b> (trên, trong suốt) chứa trung tâm tạo liên kết peptide. Ba ô <b>E – P – A</b> xếp từ 5′ sang 3′. Các viên thuốc cho biết <b>kháng sinh</b> bám ở đâu. Bật <b>Nhân thực</b> để đổi sang 80S.' },
    { title: 'Khởi đầu: tiểu đơn vị nhỏ tìm đúng AUG', text: '<b>Nhân sơ</b>: 30S mang <b>IF3</b> (ngăn 50S gắn sớm) và <b>IF1</b> (chặn vị trí A). Trình tự <b>Shine-Dalgarno</b> (AGGAGG) bắt cặp với <b>đầu 3′ của rRNA 16S</b>, đặt AUG ngay vị trí P. <b>IF2-GTP</b> đưa <b>fMet-tRNA</b> vào P. <b>Nhân thực</b> (bật công tắc): eIF4E nhận <b>cap 5′</b>, phức hợp <b>43S</b> mang <b>eIF2-GTP–Met-tRNAi</b> <b>quét</b> từ cap đến AUG đầu tiên trong ngữ cảnh <b>Kozak</b>.' },
    { title: 'Tiểu đơn vị lớn gắn vào: ribosome hoàn chỉnh', text: '50S (hoặc 60S) hạ xuống, các yếu tố khởi đầu rời đi (GTP của IF2 hoặc eIF5B bị thủy phân). Bây giờ <b>tRNA khởi đầu nằm ở P</b>, vị trí <b>A trống</b>, phơi ra codon thứ 2 (GGC). Ribosome sẵn sàng kéo dài.' },
    { title: 'Kéo dài ①: EF-Tu–GTP đưa aminoacyl-tRNA vào A', text: '<b>EF-Tu–GTP</b> (xanh lá, ở nhân thực là <b>eEF1A</b>) ôm aminoacyl-tRNA (Gly) đưa vào A. Nếu anticodon khớp codon, GTP bị thủy phân (chấm vàng thành xám), EF-Tu rời đi, tRNA nằm lại. ⚠️ Slide ghi bước này là "eIF2". Thực ra eIF2 thuộc giai đoạn <b>khởi đầu</b>. Bật <b>💥 Tetracycline</b>: thuốc chặn A, tRNA bị bật ra.' },
    { title: 'Kéo dài ②: liên kết peptide do rRNA xúc tác', text: 'Trung tâm <b>peptidyl transferase</b> (đốm sáng vàng) chuyển chuỗi (fMet) từ tRNA ở <b>P</b> sang amino acid của tRNA ở <b>A</b>, tạo <b>liên kết peptide</b>. Chất xúc tác là <b>rRNA 23S</b> (28S ở nhân thực), không phải protein. Ribosome là một <b>ribozyme</b>.' },
    { title: 'Kéo dài ③: EF-G–GTP chuyển vị, ribosome trượt 3 nt', text: '<b>EF-G–GTP</b> (xanh nhạt, ở nhân thực là <b>eEF2</b>) chen vào A và đẩy ribosome tiến <b>đúng 1 codon</b> về phía 3′. Để ý: tRNA <b>đứng yên</b> trên mRNA, chính ribosome trượt đi. tRNA mang chuỗi giờ ở P, tRNA rỗng sang E rồi rời ribosome. Vị trí A trống chờ codon tiếp theo.' },
    { title: 'Vòng lặp: chuỗi dài dần qua đường hầm', text: 'Ba bước ①②③ lặp lại với mỗi codon. Chuỗi polypeptide (các hạt màu) chui ra qua <b>đường hầm thoát</b> của tiểu đơn vị lớn, đầu N ra trước. Mỗi vòng tốn 2 GTP. Base thứ 3 của codon bắt cặp "lỏng" (<b>wobble</b>), nên một tRNA đọc được vài codon. Bật <b>💥 Đột biến vô nghĩa</b>: chuỗi dừng ở 3 amino acid.' },
    { title: 'Kết thúc: yếu tố giải phóng đọc codon stop', text: 'Khi codon stop (UAA/UAG/UGA) vào A, <b>không có tRNA nào</b> đọc được. <b>Yếu tố giải phóng</b> (protein, hình giống tRNA) vào A: <b>RF1</b> (UAA, UAG), <b>RF2</b> (UAA, UGA); ở nhân thực <b>eRF1</b> đọc cả 3, cùng <b>eRF3</b>-GTP. Peptidyl transferase <b>thủy phân</b> liên kết với tRNA, chuỗi được thả ra, hai tiểu đơn vị tách nhau.' },
    { title: 'Polysome: nhiều ribosome trên một mRNA', text: 'Một mRNA được nhiều ribosome dịch <b>cùng lúc</b>, nối đuôi nhau (<b>polysome</b>). Ribosome càng gần đầu 3′ thì chuỗi càng dài. <b>Nhân sơ</b>: ribosome bám mRNA khi RNA polymerase còn đang phiên mã. <b>Nhân thực</b>: mRNA khép vòng nhờ eIF4G nối cap với PABP ở đuôi poly-A.' },
  ],

  application: `<ul>
  <li><b>Kháng sinh nhắm ribosome vi khuẩn:</b> <b>tetracycline</b> (30S, chặn aminoacyl-tRNA vào vị trí A), <b>streptomycin</b> (30S, làm đọc sai và cản khởi đầu), <b>chloramphenicol</b> (50S, ức chế peptidyl transferase), <b>erythromycin</b>/macrolide (50S, bịt đường hầm thoát). Chọn lọc vì ribosome 70S khác 80S. Tuy vậy, ribosome <b>ti thể</b> giống 70S, nên một số thuốc có độc tính phụ (ví dụ chloramphenicol gây ức chế tủy xương).</li>
  <li><b>Độc tố:</b> độc tố bạch hầu và exotoxin A của <i>Pseudomonas</i> ADP-ribosyl hóa <b>eEF2</b>. Ricin cắt rRNA 28S. <b>Cycloheximide</b> ức chế chuyển vị ở nhân thực (dùng trong phòng thí nghiệm).</li>
  <li><b>Vaccine mRNA:</b> mRNA được thiết kế có cap 5′, vùng 5′UTR và Kozak tối ưu, và đuôi poly-A để ribosome người dịch mã hiệu quả ra protein gai của virus.</li>
  <li><b>Sản xuất protein tái tổ hợp:</b> khi biểu hiện gene người trong <i>E. coli</i>, phải đặt trình tự Shine-Dalgarno trước AUG. Trong tế bào nhân thực thì cần Kozak.</li>
  <li><b>Thuốc "đọc xuyên" codon stop</b> (ví dụ ataluren) đang được nghiên cứu cho bệnh do đột biến vô nghĩa.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Nhân sơ</th><th>Nhân thực</th></tr>
  <tr><td>Ribosome</td><td><b>70S</b> = 30S (<b>16S</b>) + 50S (23S, 5S)</td><td><b>80S</b> = 40S (<b>18S</b>) + 60S (28S, 5.8S, 5S)</td></tr>
  <tr><td>Nhận diện điểm bắt đầu</td><td><b>Shine-Dalgarno</b> bắt cặp đầu 3′ rRNA 16S</td><td><b>Cap 5′</b> (eIF4E) + quét đến AUG (Kozak); hoặc IRES</td></tr>
  <tr><td>tRNA khởi đầu</td><td><b>fMet</b>-tRNA (formyl-Met)</td><td><b>Met</b>-tRNAi</td></tr>
  <tr><td>Yếu tố khởi đầu</td><td>IF1, IF2-GTP, IF3</td><td>eIF4E/4G/4A, eIF3, eIF1, <b>eIF2-GTP</b>, eIF5B</td></tr>
  <tr><td>Đưa aa-tRNA vào A</td><td><b>EF-Tu</b>-GTP</td><td><b>eEF1A</b>-GTP</td></tr>
  <tr><td>Chuyển vị</td><td><b>EF-G</b>-GTP</td><td><b>eEF2</b>-GTP</td></tr>
  <tr><td>Kết thúc</td><td>RF1 (UAA, UAG), RF2 (UAA, UGA), RF3</td><td><b>eRF1</b> (cả 3 codon) + eRF3-GTP</td></tr>
  <tr><td>Phiên mã & dịch mã</td><td><b>Đồng thời</b>, cùng nơi</td><td>Tách biệt: nhân rồi tế bào chất</td></tr>
  <tr><td>mRNA</td><td>Thường đa cistron (nhiều SD)</td><td>Đơn cistron</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Vị trí</th><th>Chứa gì</th><th>Ghi nhớ</th></tr>
  <tr><td><b>A</b> (aminoacyl)</td><td>aminoacyl-tRNA mới đến; yếu tố giải phóng khi gặp stop</td><td><b>A</b> = Arrive</td></tr>
  <tr><td><b>P</b> (peptidyl)</td><td>tRNA mang chuỗi peptide; tRNA khởi đầu vào thẳng P</td><td><b>P</b> = Peptide</td></tr>
  <tr><td><b>E</b> (exit)</td><td>tRNA rỗng sắp rời đi</td><td><b>E</b> = Exit</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Kháng sinh</th><th>Bám vào</th><th>Chặn bước</th></tr>
  <tr><td>Tetracycline</td><td>30S</td><td>aa-tRNA vào vị trí A</td></tr>
  <tr><td>Streptomycin</td><td>30S (16S)</td><td>Khởi đầu, gây đọc sai</td></tr>
  <tr><td>Chloramphenicol</td><td>50S</td><td>Peptidyl transferase</td></tr>
  <tr><td>Erythromycin</td><td>50S (đường hầm)</td><td>Chuỗi không ra được, ngừng kéo dài</td></tr>
  </table></div>
  <div class="box warn">⚠️ <b>Lỗi trên slide:</b> slide xếp "aminoacyl-tRNA → <b>eIF2</b>" vào giai đoạn <b>kéo dài</b>. Đúng là <b>eIF2</b>-GTP mang <b>Met-tRNA khởi đầu</b> vào 40S ở giai đoạn <b>khởi đầu</b>. Trong kéo dài, <b>eEF1A</b>-GTP (tương đương EF-Tu) mới đưa aminoacyl-tRNA vào vị trí A. Chữ "i" = initiation, "e" trong eEF = elongation.</div>`,

  traps: [
    { trap: '"eIF2 đưa aminoacyl-tRNA vào vị trí A trong giai đoạn kéo dài."', truth: 'Sai (đây là lỗi slide). eIF2 thuộc <b>khởi đầu</b>: mang Met-tRNAi vào vị trí P của 40S. Kéo dài dùng <b>eEF1A</b> (EF-Tu ở vi khuẩn).' },
    { trap: '"Ribosome nhân sơ có 18S rRNA, nhân thực có 16S."', truth: 'Ngược: <b>16S ở 30S (nhân sơ)</b>, <b>18S ở 40S (nhân thực)</b>. Mẹo: số nhỏ hơn đi với ribosome nhỏ hơn (70S).' },
    { trap: '"70S = 30S + 50S nên 80S = 40S + 40S."', truth: 'S (Svedberg) đo tốc độ lắng, phụ thuộc hình dạng, <b>không cộng được</b>. 80S = 40S + 60S.' },
    { trap: '"Nhân thực khởi đầu bằng fMet như vi khuẩn."', truth: 'Nhân sơ dùng <b>fMet</b> (formyl-methionine). Nhân thực dùng <b>Met</b> thường (trên tRNA khởi đầu riêng, Met-tRNAi).' },
    { trap: '"Peptidyl transferase là một protein enzyme."', truth: 'Là <b>rRNA</b> (23S ở nhân sơ, 28S ở nhân thực), nên ribosome là <b>ribozyme</b>.' },
    { trap: '"Có tRNA đọc codon stop."', truth: '<b>Không</b> có tRNA cho UAA, UAG, UGA. <b>Yếu tố giải phóng</b> (protein RF1/RF2/eRF1) đọc chúng.' },
    { trap: '"Khi chuyển vị, tRNA di chuyển còn ribosome đứng yên."', truth: 'tRNA vẫn bắt cặp với codon của nó trên mRNA. <b>Ribosome trượt 3 nt</b> về phía 3′, nên về tương đối thì tRNA chuyển từ A sang P, từ P sang E.' },
    { trap: '"tRNA khởi đầu vào vị trí A như mọi tRNA khác."', truth: 'tRNA khởi đầu là tRNA duy nhất vào <b>thẳng vị trí P</b> (nhờ IF2 hoặc eIF2). Các aminoacyl-tRNA sau đó đều vào A.' },
    { trap: '"Shine-Dalgarno bắt cặp với tRNA" / "Nhân thực cũng có SD."', truth: 'SD bắt cặp với <b>đầu 3′ của rRNA 16S</b>. Nhân thực <b>không có SD</b>: dùng cap 5′ và quét đến AUG (Kozak), hoặc IRES.' },
  ],

  quiz: [
    { q: 'Ở giai đoạn KÉO DÀI của dịch mã nhân thực, yếu tố nào đưa aminoacyl-tRNA vào vị trí A?', ops: ['eIF2-GTP', 'eEF1A-GTP', 'eEF2-GTP', 'eRF1'], a: 1, e: 'eEF1A (tương đương EF-Tu) đưa aa-tRNA vào A. eIF2 là yếu tố khởi đầu mang Met-tRNAi; slide xếp nó vào kéo dài là sai. eEF2 làm chuyển vị.' },
    { q: 'Enzyme tạo liên kết peptide có bản chất là:', ops: ['Protein EF-Tu', 'rRNA của tiểu đơn vị lớn (23S/28S)', 'tRNA', 'Aminoacyl-tRNA synthetase'], a: 1, e: 'Peptidyl transferase là rRNA 23S (28S ở nhân thực), tức ribozyme. Synthetase gắn amino acid lên tRNA, không tạo liên kết peptide.' },
    { q: 'Trình tự Shine-Dalgarno bắt cặp với:', ops: ['Anticodon của fMet-tRNA', 'Đầu 3′ của rRNA 16S', 'rRNA 18S', 'Cap 5′'], a: 1, e: 'SD (AGGAGG) bắt cặp với đầu 3′ của rRNA 16S trong 30S. rRNA 18S và cap là của nhân thực, nơi không có SD.' },
    { q: 'Tetracycline ức chế dịch mã vi khuẩn bằng cách:', ops: ['Bịt đường hầm thoát của 50S', 'Ngăn aminoacyl-tRNA vào vị trí A trên 30S', 'Ức chế peptidyl transferase', 'Phân hủy mRNA'], a: 1, e: 'Tetracycline bám 30S và chặn vị trí A. Bịt đường hầm là erythromycin; ức chế peptidyl transferase là chloramphenicol.' },
    { q: 'Đột biến điểm đổi codon AAA (Lys) thành UAA trong vùng mã hóa. Hậu quả:', ops: ['Thay Lys bằng amino acid khác', 'Protein bị cắt cụt vì gặp codon kết thúc sớm', 'Protein dài hơn', 'Không ảnh hưởng do mã thoái hóa'], a: 1, e: 'UAA là codon stop, nên đây là đột biến vô nghĩa: yếu tố giải phóng vào A sớm, chuỗi bị thả ra khi còn ngắn. "Thay amino acid" là đột biến sai nghĩa (missense).' },
    { q: 'Thứ tự đúng trong 1 vòng kéo dài:', ops: ['Chuyển vị → tRNA vào A → liên kết peptide', 'tRNA vào A (EF-Tu) → liên kết peptide → chuyển vị (EF-G)', 'Liên kết peptide → tRNA vào P → chuyển vị', 'EF-G đưa tRNA vào A → EF-Tu chuyển vị'], a: 1, e: 'EF-Tu-GTP đưa aa-tRNA vào A, peptidyl transferase tạo liên kết, rồi EF-G-GTP chuyển vị. Phương án cuối đảo vai EF-Tu và EF-G.' },
    { q: 'Vì sao vi khuẩn có thể dịch mã một mRNA khi nó còn đang được phiên mã?', ops: ['Vì ribosome vi khuẩn ở trong nhân', 'Vì không có màng nhân: mRNA và ribosome cùng ở tế bào chất', 'Vì mRNA vi khuẩn có cap', 'Vì vi khuẩn không có tRNA'], a: 1, e: 'Không có màng nhân, nên đầu 5′ mRNA vừa ló ra đã có ribosome bám (nhờ SD). mRNA vi khuẩn không có cap; vi khuẩn không có nhân.' },
  ],

  recall: [
    'Vẽ tay lại ribosome với 3 vị trí E–P–A trên mRNA 5′→3′, có tRNA ở P mang chuỗi và tRNA mới vào A. Đánh dấu EF-Tu, peptidyl transferase (rRNA) và EF-G ở đúng bước.',
    'Lập bảng nhân sơ vs nhân thực: ribosome (S, rRNA), tín hiệu khởi đầu (SD vs cap/Kozak), tRNA khởi đầu, tên các yếu tố IF/EF/RF. Ghi chú lỗi eIF2 trên slide.',
    'Kể 4 kháng sinh tác động ribosome, mỗi cái: bám 30S hay 50S, chặn bước nào.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const cl = (x) => Math.max(0, Math.min(1, x)), ez = (x) => { x = cl(x); return x * x * (3 - 2 * x); }, sg = (t, a, b) => cl((t - a) / (b - a)), bump = (x) => Math.sin(Math.PI * cl(x));
    const W = 0.5, NT_Y = -1.35, BB_Y = -1.75, AC_Y = -1.1;
    const LEAD = { p: 'UCAUAGGAGGUAACC', e: 'GCAUCAGCCGCCACC' };
    const ORF = ['AUG', 'GGC', 'UUC', 'AAA', 'UGG', 'CAU', 'UAA'], AAN = ['Met', 'Gly', 'Phe', 'Lys', 'Trp', 'His', 'STOP'];
    const AAC = [0xffd60a, 0x9be15d, 0x5ac8fa, 0xff6b6b, 0xbf5af2, 0xff9f0a];
    const TRAIL = 'GCAUCC', NNT = 15 + 21 + 6;
    const ntX = (i) => -10.5 + (i + 0.5) * W, cX = (c) => ntX(15 + 3 * c + 1);
    const COMP = { A: 'U', U: 'A', G: 'C', C: 'G' };
    const TRNA = 0xe38fbf, EFTU = 0x30d158, EFG = 0x64d2ff, RFC = 0xff6b6b, GTP = 0xffd60a, GDP = 0x8e8e93;
    let euk = false, tetra = false, nons = false, cur = 0, tt = 0;
    const N = (p, e) => (euk ? e : p);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const tmpA = V(0, 0), tmpB = V(0, 0), tmpC = V(0, 0);

    // ---------------- mRNA ----------------
    const mG = api.group();
    api.box(NNT * W, 0.14, 0.14, C.rna, mG).position.set(0, BB_Y, 0);
    const ntGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
    const nts = [];
    for (let i = 0; i < NNT; i++) { const m = new THREE.Mesh(ntGeo, api.mat(0xffffff)); m.position.set(ntX(i), NT_Y, 0); mG.add(m); nts.push(m); }
    const seqNow = () => { const o = ORF.slice(); if (nons) o[3] = 'UAA'; return LEAD[euk ? 'e' : 'p'] + o.join('') + TRAIL; };
    const cap = api.sphere(0.4, 0x8e8e93, mG); cap.position.set(-10.95, NT_Y, 0);
    const polyA = []; for (let j = 0; j < 8; j++) { const m = api.sphere(0.19, C.A, mG); m.position.set(10.75 + j * 0.45, NT_Y, 0); polyA.push(m); }
    for (let c = 0; c < 7; c++) L.add('cod' + c, '', [cX(c), c % 2 ? -4.9 : -4.2, 1], mG, 'dim');
    L.add('lead', '', [ntX(6.5), -4.3, 1], mG, 'dim');
    L.add('p5', '5′', [-11.6, -0.6, 0], mG, 'dim'); L.add('p3', '3′', [10.9, -0.6, 0], mG, 'dim');
    L.add('capL', 'cap 5′', [-11.2, 0.4, 0], mG, 'tag'); L.add('polyL', 'đuôi poly-A', [12.3, -2.6, 0], mG, 'dim');
    L.add('nonsL', '💥 UAA sớm → protein cụt', [cX(3), -5.7, 1], mG, 'warn');
    // anti-SD: 3′ end of 16S rRNA pairing with the SD
    const antiSD = api.group();
    [...'AGGAGG'].forEach((b, j) => { const m = new THREE.Mesh(ntGeo, api.mat(C[COMP[b]])); m.scale.y = 0.8; m.position.set(ntX(4 + j), -0.85, 0); antiSD.add(m); });
    api.box(4.2, 0.12, 0.12, C.ribosome, antiSD).position.set(ntX(6.5) + 0.6, -0.5, 0);
    L.add('asdL', 'đầu 3′ rRNA 16S (UCCUCC)', [ntX(6.5), 0.1, 0], antiSD, 'tag');
    // eukaryotic cap-binding complex, PABP, closed-loop bridge
    const eG = api.group();
    const e4E = api.blob(0.38, 0xff9fdb, eG, { mat: { opacity: 0.95 }, seed: 61 }); e4E.position.set(-10.7, -0.65, 0.4);
    const e4G = api.blob(1, 0xc7a0ff, eG, { mat: { opacity: 0.9 }, scale: [1.1, 0.38, 0.4], seed: 62 }); e4G.position.set(-9.7, -0.1, 0.4);
    const e4A = api.blob(0.36, 0x7ee0c3, eG, { mat: { opacity: 0.95 }, seed: 63 }); e4A.position.set(-8.9, -0.75, 0.5);
    const pabp = api.blob(0.5, 0x9ad0ff, eG, { mat: { opacity: 0.95 }, seed: 64 }); pabp.position.set(12.3, -0.8, 0.4);
    api.tube([V(-9.7, 0.2, 0.4), V(-6, 4.6, 0.6), V(1.5, 6.0, 0.6), V(9, 4.6, 0.6), V(12.3, -0.3, 0.4)], 0.05, 0xc7a0ff, eG, { opacity: 0.45 });
    L.add('e4L', 'eIF4E·4G·4A nhận cap', [-9.6, 0.75, 0], eG, 'tag');
    L.add('pabL', 'PABP', [12.3, 0.0, 0], eG, 'tag');
    L.add('loopL', 'eIF4G–PABP: mRNA khép vòng', [1.5, 6.5, 0], eG, 'dim');

    // ---------------- ribosome ----------------
    const rG = api.group();
    const small = api.blob(1, C.ribosome, rG, { mat: { opacity: 0.55 }, scale: [4.0, 0.95, 1.8], seed: 2 });
    const large = api.blob(1, 0x8cc4ec, rG, { mat: { opacity: 0.36, depthWrite: false }, scale: [3.6, 1.9, 2.0], seed: 7 });
    const slots = [-1.5, 0, 1.5].map((x, i) => { const b = api.box(1.3, 2.4, 1.0, [0x8e8e93, 0x5ac8fa, 0x34c759][i], rG, { opacity: 0.1, depthWrite: false }); b.position.set(x, 0.2, 0); return b; });
    const ptc = api.sphere(0.42, 0xfff3b0, rG, { emissive: 0xffd60a, emissiveIntensity: 1.2 }); ptc.position.set(0, 1.45, 0.25);
    const riboBase = (sep = 0, f = 1) => {
      small.position.set(-0.5, -2.45 - 2.6 * sep, 0); large.position.set(0, 0.95 + 2.8 * sep, 0);
      api.setOpacity(small, 0.55 * f); api.setOpacity(large, 0.36 * f);
      slots.forEach(s => api.setOpacity(s, 0.1 * f * (1 - sep)));
    };
    L.add('ss', '', [-0.5, -3.0, 2.0], rG, 'dim');
    L.add('ls', '', [3.4, 2.6, 0], rG, 'dim');
    L.add('sE', 'E', [-1.5, 3.15, 0], rG, 'tag'); L.add('sP', 'P', [0, 3.15, 0], rG, 'tag'); L.add('sA', 'A', [1.5, 3.15, 0], rG, 'tag');
    L.add('ptcL', 'peptidyl transferase = rRNA (ribozyme)', [3.6, 1.4, 0], rG, 'good');
    L.add('scanL', 'quét 5′→3′ tìm AUG →', [0, 1.3, 0], rG, 'big');
    // initiation factors riding on the small subunit
    const if1 = api.blob(0.38, 0xffb3c7, rG, { mat: { opacity: 0.95 }, seed: 71 }); if1.position.set(1.5, -0.95, 0.6);
    const if3 = api.blob(0.45, 0xa1e3a1, rG, { mat: { opacity: 0.95 }, seed: 72 }); if3.position.set(-2.4, -2.0, 1.2);
    const eif3 = api.blob(0.85, 0xd4a5ff, rG, { mat: { opacity: 0.9 }, seed: 73 }); eif3.position.set(-2.8, -2.7, -0.8);
    const eif1 = api.blob(0.34, 0xffe08a, rG, { mat: { opacity: 0.95 }, seed: 74 }); eif1.position.set(-1.6, -1.15, 0.7);
    L.add('if1L', 'IF1 (chặn A)', [0, 0.55, 0], if1, 'tag'); L.add('if3L', 'IF3', [0, -0.6, 0], if3, 'tag');
    L.add('eif3L', 'eIF3', [0, -1.0, 0], eif3, 'tag'); L.add('eif1L', 'eIF1', [-0.3, 0.5, 0], eif1, 'tag');
    // antibiotic binding sites (step 2)
    const pillG = new THREE.CapsuleGeometry(0.16, 0.45, 4, 10);
    const pill = (pos, color, parent) => { const m = new THREE.Mesh(pillG, api.mat(color, { emissive: color, emissiveIntensity: 0.35 })); m.position.set(...pos); m.rotation.z = 0.6; parent.add(m); return m; };
    const abS = pill([-2.2, -2.7, 1.6], 0xff453a, rG), abT = pill([1.5, -1.05, 0.8], 0xffcc00, rG), abC = pill([0.2, 1.5, 0.9], 0xff9f0a, rG), abE = pill([-0.6, 2.6, 0.9], 0xbf5af2, rG);
    L.add('abS', 'streptomycin (30S)', [-1.4, -0.5, 0], abS, 'dim'); L.add('abT', 'tetracycline (A, 30S)', [2.0, -0.2, 0], abT, 'dim');
    L.add('abC', 'chloramphenicol (PTC, 50S)', [2.2, 0.2, 0], abC, 'dim'); L.add('abE', 'erythromycin (đường hầm 50S)', [-1.8, 0.5, 0], abE, 'dim');
    L.add('eukAb', 'ribosome 80S: ít bị các thuốc này ức chế → chọn lọc', [0, 4.2, 0], rG, 'good');

    // ---------------- tRNAs & amino acids ----------------
    const acGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const mkTRNA = (codon) => {
      const g = api.group();
      api.stick(V(0, 0.4, 0), V(0, 1.75, 0), 0.17, TRNA, g);
      api.stick(V(0.1, 1.75, 0), V(-0.85, 1.75, 0), 0.17, TRNA, g);
      api.stick(V(-0.75, 1.75, 0), V(-0.75, 2.2, 0), 0.07, 0xffffff, g);
      api.box(1.5, 0.14, 0.3, TRNA, g).position.set(0, 0.42, 0);
      [...codon].forEach((b, j) => { const m = new THREE.Mesh(acGeo, api.mat(C[COMP[b]])); m.position.set((j - 1) * W, 0.2, 0); g.add(m); });
      return g;
    };
    const tr = ORF.slice(0, 6).map(mkTRNA);
    const aaGeo = new THREE.SphereGeometry(0.3, 18, 12);
    const aaM = AAC.map(c => { const m = new THREE.Mesh(aaGeo, api.mat(c)); api.group().add(m); return m; });
    const formyl = api.sphere(0.11, 0xffffff, aaM[0]); formyl.position.set(0.26, 0.2, 0.15);
    const tipOf = (g, out) => out.set(g.position.x - 0.75 * g.scale.x, g.position.y + 2.5 * g.scale.y, g.position.z);
    // factors
    const ini = api.blob(0.5, 0xffa94d, undefined, { mat: { opacity: 0.95 }, seed: 81 });
    const iniG = api.sphere(0.17, GTP, ini); iniG.position.set(0.4, 0.35, 0.3);
    L.add('iniL', '', [0.3, 0.75, 0], ini, 'tag');
    const efTu = api.blob(0.55, EFTU, undefined, { mat: { opacity: 0.95 }, seed: 82 });
    const tuG = api.sphere(0.18, GTP, efTu); tuG.position.set(0.45, 0.35, 0.3);
    L.add('tuL', '', [0.5, 0.8, 0], efTu, 'tag');
    const efG = api.blob(1, EFG, undefined, { mat: { opacity: 0.95 }, scale: [0.6, 1.3, 0.6], seed: 83 });
    L.add('gL', '', [0.9, 1.0, 0], efG, 'tag');
    const rf = api.group();
    api.stick(V(0, 0.2, 0), V(0, 1.8, 0), 0.22, RFC, rf); api.blob(0.45, RFC, rf, { mat: { opacity: 0.95 }, seed: 84 }).position.set(-0.45, 2.1, 0);
    const eRF3 = api.blob(0.38, 0xffb0b0, rf, { mat: { opacity: 0.95 }, seed: 85 }); eRF3.position.set(0.65, 1.0, 0.5);
    L.add('rfL', '', [0.9, 2.4, 0], rf, 'warn');
    const tet = new THREE.Mesh(pillG, api.mat(0xffcc00, { emissive: 0xffcc00, emissiveIntensity: 0.5 })); tet.scale.setScalar(1.4); api.group().add(tet);
    L.add('tetL', '💥 tetracycline chặn A', [0.4, -0.7, 0.4], tet, 'warn');
    L.add('relL', 'chuỗi polypeptide được thả ra', [0, 0.7, 0], aaM[0], 'good');

    // ---------------- step 1 props: synthetase ----------------
    const synth = api.blob(1.5, C.enzyme, undefined, { mat: { opacity: 0.8 }, seed: 91 });
    const atp = api.sphere(0.26, 0xffd60a, undefined, { emissive: 0x332200 });
    const ppi = [api.sphere(0.15, 0xffd60a), api.sphere(0.15, 0xffd60a)];
    L.add('synL', 'aminoacyl-tRNA synthetase', [0, 1.9, 0], synth, 'tag');
    L.add('atpL', 'ATP → AMP + PPi', [0.9, -0.4, 0], atp, 'dim');
    L.add('acL', 'anticodon (bắt cặp codon)', [0, -0.45, 0.3], tr[1], 'tag');
    L.add('ccaL', '3′ CCA: nơi gắn aa', [-1.3, 2.75, 0], tr[1], 'tag');
    L.add('lL', 'tRNA chữ L (~76 nt)', [1.4, 1.2, 0], tr[1], 'dim');
    L.add('aaL', 'amino acid (Gly)', [0, 0.6, 0], aaM[1], 'good');

    // ---------------- polysome (step 10) ----------------
    const pG = api.group();
    const yAt = (x) => -1.6 + Math.sin(((x + 12.5) / 0.6) * 0.33) * 0.45;
    { const pts = []; for (let i = 0; i <= 42; i++) { const x = -12.5 + i * 0.6; pts.push(V(x, yAt(x), 0)); } api.tube(pts, 0.13, C.rna, pG); }
    const beadGeo = new THREE.SphereGeometry(0.17, 10, 8);
    const clones = [0, 1, 2, 3, 4].map((i) => {
      const g = api.group(pG);
      api.blob(1, C.ribosome, g, { mat: { opacity: 0.7 }, scale: [1.7, 0.5, 0.9], seed: 2 + i }).position.y = -0.5;
      api.blob(1, 0x5d9bd0, g, { mat: { opacity: 0.55 }, scale: [1.5, 0.85, 0.9], seed: 7 + i }).position.y = 0.6;
      const beads = []; for (let j = 0; j < 9; j++) { const b = new THREE.Mesh(beadGeo, api.mat(AAC[j % 6])); g.add(b); beads.push(b); }
      return { g, beads };
    });
    const rnap = api.blob(0.95, C.enzyme, pG, { mat: { opacity: 0.9 }, seed: 95 }); rnap.position.set(-13, yAt(-12.5), 0);
    const pDNA = api.box(4, 0.22, 0.22, C.dna1, pG); pDNA.position.set(-15.5, yAt(-12.5), 0);
    const pCap = api.sphere(0.35, 0x8e8e93, pG); pCap.position.set(-12.7, yAt(-12.5), 0);
    const pPab = api.blob(0.45, 0x9ad0ff, pG, { mat: { opacity: 0.95 }, seed: 96 }); pPab.position.set(12.9, yAt(12.5) + 0.6, 0.3);
    const pArc = api.tube([V(-12.4, 0, 0.3), V(-6, 5.6, 0.3), V(6, 5.6, 0.3), V(12.9, 1.1, 0.3)], 0.05, 0xc7a0ff, pG, { opacity: 0.45 });
    L.add('polyT', 'polysome: nhiều ribosome / 1 mRNA', [0, 5.2, 0], pG, 'big');
    L.add('rnapL', 'RNAP: vừa phiên mã vừa dịch mã', [3.2, 1.5, 0], rnap, 'tag');
    L.add('pLoop', 'cap–eIF4G–PABP khép vòng', [0, 6.2, 0], pG, 'dim');
    L.add('p5b', '5′', [-12.2, -0.4, 0], pG, 'dim'); L.add('p3b', '3′ (chuỗi dài nhất)', [11, -0.4, 0], pG, 'dim');

    // ---------------- chain layout ----------------
    const P = Array.from({ length: 8 }, () => V(0, 0));
    const placeAlong = (d, out) => { for (let i = 0; i < P.length - 1; i++) { const s = P[i].distanceTo(P[i + 1]); if (d <= s || i === P.length - 2) { out.lerpVectors(P[i], P[i + 1], Math.min(1, d / s)); return; } d -= s; } };
    const layChain = (anchor, from, to, rx, d0 = 0) => {
      P[0].copy(anchor); P[1].set(rx - 0.25, 2.2, 0.1); P[2].set(rx - 0.5, 3.0, 0.2); P[3].set(rx - 1.1, 3.7, 0.4);
      P[4].set(rx - 2.0, 4.2, 0.6); P[5].set(rx - 3.0, 4.0, 0.8); P[6].set(rx - 3.9, 4.6, 0.9); P[7].set(rx - 4.9, 4.3, 1.0);
      for (let c = to, d = d0; c >= from; c--, d += 0.62) { aaM[c].visible = true; placeAlong(d, aaM[c].position); }
    };
    const stopIdx = () => (nons ? 3 : 6);
    const blocked = () => tetra && !euk;

    // ---------------- dynamic poses ----------------
    const hideDyn = () => {
      tr.forEach(g => { g.visible = false; g.scale.setScalar(1); });
      aaM.forEach(m => { m.visible = false; });
      [ini, efTu, efG, rf, tet, synth, atp, ...ppi].forEach(o => { o.visible = false; });
      ptc.material.opacity = 0;
      formyl.visible = !euk;
    };
    const showTR = (g, op = 1) => { g.visible = true; api.setOpacity(g, op); };
    const extra = [];
    // elongation cycle k (A site over codon k), phase tau 0..1
    const pose = (k, tau, blk) => {
      riboBase();
      const rx = cX(k - 1) + (blk ? 0 : 1.5 * ez(sg(tau, 0.6, 0.85)));
      rG.position.x = rx;
      const tin = tr[k], tp = tr[k - 1];
      showTR(tin);
      tmpB.set(cX(k) + 4.5, 4.5, 2);
      if (blk) tin.position.lerpVectors(tmpB, tmpA.set(cX(k), AC_Y + 1.4, 0.5), bump(tau));
      else tin.position.lerpVectors(tmpB, tmpA.set(cX(k), AC_Y, 0), ez(sg(tau, 0, 0.3)));
      const ex = blk ? 0 : ez(sg(tau, 0.86, 1));
      showTR(tp, 1 - ex); tp.position.set(cX(k - 1) - 2.5 * ex, AC_Y + 5 * ex, 1.5 * ex);
      // chain: residues 0..k-1 on the P tRNA, then handed to the A tRNA
      tipOf(tin, tmpB); aaM[k].visible = true; aaM[k].position.copy(tmpB);
      const tf = blk ? 0 : ez(sg(tau, 0.44, 0.56));
      tipOf(tp, tmpA); if (tf > 0) tmpA.lerp(tmpB, tf);
      if (ex > 0) tmpA.copy(tmpB);
      layChain(tmpA, 0, k - 1, rx, 0.62 * tf);
      // EF-Tu
      if (blk || tau < 0.45) {
        const off = blk ? 0 : ez(sg(tau, 0.33, 0.45));
        efTu.visible = true; efTu.position.copy(tin.position).add(tmpC.set(0.95 + 3 * off, 0.8 + 3 * off, 0.6)); api.setOpacity(efTu, 1 - off);
        tuG.material.color.set(!blk && tau > 0.26 ? GDP : GTP);
        if (off < 0.5) extra.push('tuL');
      }
      // EF-G
      if (!blk && tau > 0.5) {
        const inn = ez(sg(tau, 0.5, 0.6)), out = ez(sg(tau, 0.86, 1));
        efG.visible = true; efG.position.set(rx + 1.5 + 4 * (1 - inn) + 3 * out, 0.2 + 3 * (1 - inn) + 3 * out, 0.9); api.setOpacity(efG, inn * (1 - out));
        if (inn > 0.5 && out < 0.5) extra.push('gL');
      }
      ptc.material.opacity = blk ? 0 : 0.9 * bump(sg(tau, 0.4, 0.6));
      if (ptc.material.opacity > 0.3) extra.push('ptcL');
      if (tetra) { tet.visible = true; if (blk) tet.position.set(rx + 1.5, -0.95, 0.8); else tet.position.set(rx + 3.5, 3 + Math.sin(tt * 2) * 0.3, 1.6); extra.push('tetL'); }
    };
    // termination with stop codon K in A
    const poseTerm = (K, tau) => {
      const rx = cX(K - 1); rG.position.x = rx;
      const dis = ez(sg(tau, 0.7, 0.95));
      riboBase(dis, 1 - dis);
      const tp = tr[K - 1]; showTR(tp, 1 - dis); tp.position.set(cX(K - 1), AC_Y + 3 * dis, 0);
      rf.visible = true; eRF3.visible = euk; api.setOpacity(rf, 1 - dis);
      rf.position.lerpVectors(tmpB.set(cX(K) + 4.5, 4.5, 2), tmpA.set(cX(K), AC_Y, 0), ez(sg(tau, 0, 0.28))); rf.position.y += 3 * dis;
      if (tau > 0.15 && dis < 0.5) extra.push('rfL');
      ptc.material.opacity = 0.9 * bump(sg(tau, 0.3, 0.5));
      if (ptc.material.opacity > 0.3) extra.push('ptcL');
      const rel = ez(sg(tau, 0.42, 0.75));
      tipOf(tp, tmpA); layChain(tmpA, 0, K - 1, rx);
      for (let c = 0; c < K; c++) aaM[c].position.add(tmpC.set(1.5 * rel, 2.5 * rel, 1.5 * rel));
      if (rel > 0.3) extra.push('relL');
    };
    // initiation: step 3 (small subunit) and step 4 (large joins)
    const poseInit = (stage, t) => {
      const rx0 = cX(0);
      if (stage === 0) {
        const up = ez(sg(t, 0, 1.2));
        let rx = rx0;
        if (euk) rx = -8 + (rx0 + 8) * ez(sg(t, 1.6, 4.4));
        rG.position.x = rx;
        riboBase(0, up); small.position.y = -2.45 - 3 * (1 - up);
        slots.forEach(s => api.setOpacity(s, 0)); api.setOpacity(large, 0);
        const t0 = tr[0]; showTR(t0);
        if (euk) { t0.position.set(rx, AC_Y + 3 * (1 - up), 0); }
        else t0.position.lerpVectors(tmpB.set(rx0 - 4, 4.5, 1.5), tmpA.set(rx0, AC_Y, 0), ez(sg(t, 1.4, 2.8)));
        tipOf(t0, aaM[0].position); aaM[0].visible = true;
        ini.visible = true; ini.position.copy(t0.position).add(tmpC.set(0.85, 0.5, 0.6)); iniG.material.color.set(GTP); extra.push('iniL');
        if (euk && t > 1.6 && t < 4.4) extra.push('scanL');
        if (!euk) { antiSD.visible = t > 0.9; antiSD.scale.y = ez(sg(t, 0.9, 1.4)); if (t > 1.2) extra.push('asdL'); }
        glow(euk ? [12, 18] : [4, 9], euk ? t > 4.2 : t > 1.2);
      } else {
        rG.position.x = rx0;
        const join = ez(sg(t, 0, 1.3));
        riboBase(1 - join, 1); api.setOpacity(large, 0.36 * join); slots.forEach(s => api.setOpacity(s, 0.1 * join));
        const t0 = tr[0]; showTR(t0); t0.position.set(rx0, AC_Y, 0); tipOf(t0, aaM[0].position); aaM[0].visible = true;
        const lv = ez(sg(t, 1.1, 2.2));
        ini.visible = lv < 1; ini.position.copy(t0.position).add(tmpC.set(0.85 + 4 * lv, 0.5 + 4 * lv, 0.6)); api.setOpacity(ini, 1 - lv); iniG.material.color.set(t > 1.0 ? GDP : GTP);
        if (lv < 0.5) extra.push('iniL');
        [if1, if3, eif1, eif3].forEach(f => { api.setOpacity(f, 1 - lv); });
        if (!euk) antiSD.visible = true;
      }
    };
    const glow = (rng, on) => { nts.forEach((m, i) => { m.material.emissive.setHex(on && i >= rng[0] && i <= rng[1] ? 0x553300 : 0x000000); }); };

    // ---------------- toggles & readout ----------------
    const readout = () => {
      const s = cur, K = stopIdx(); let t;
      const tetMsg = euk ? '💊 Tetracycline: ribosome <b>80S</b> của người ít nhạy (và tế bào người không tích lũy thuốc như vi khuẩn), nên dịch mã vẫn chạy. Đó là cơ sở tính chọn lọc.' : '💥 <b>Tetracycline</b> bám 30S, chặn vị trí A: aminoacyl-tRNA bị bật ra, không có liên kết peptide mới. Ribosome kẹt ở codon 2.';
      if (s === 0) t = 'Synthetase nạp <b>đúng</b> amino acid vào tRNA (tốn ATP). Ribosome chỉ kiểm tra codon–anticodon, không kiểm tra amino acid.';
      else if (s === 1) t = euk ? '<b>80S</b> = 40S (rRNA 18S) + 60S (rRNA 28S, 5.8S, 5S). Các kháng sinh trong bảng chủ yếu tác động 70S vi khuẩn.' : '<b>70S</b> = 30S (rRNA 16S) + 50S (rRNA 23S, 5S). 30 + 50 ≠ 70 vì S đo tốc độ lắng.';
      else if (s === 2) t = euk ? '<b>Nhân thực</b>: eIF4E nhận cap; 43S (40S + eIF3, eIF1, <b>eIF2-GTP–Met-tRNAi</b>) quét đến AUG đầu tiên (Kozak …ACC<b>AUG</b>G). eIF2 là yếu tố <b>khởi đầu</b>.' : '<b>Nhân sơ</b>: SD (AGGAGG) bắt cặp đầu 3′ rRNA 16S. IF2-GTP đặt <b>fMet-tRNA</b> vào vị trí P tại AUG; IF1 chặn A, IF3 giữ 50S tránh xa.';
      else if (s === 3) t = `${N('50S', '60S')} gắn vào, thành <b>${N('70S', '80S')}</b>. Các yếu tố khởi đầu rời đi. tRNA khởi đầu ở <b>P</b>, vị trí <b>A trống</b> chờ codon GGC.`;
      else if (s >= 4 && s <= 8 && blocked()) t = tetMsg;
      else if (s === 4) t = `<b>${N('EF-Tu', 'eEF1A')}–GTP</b> đưa Gly-tRNA vào A. Codon khớp, GTP → GDP, yếu tố rời đi.`;
      else if (s === 5) t = 'Peptidyl transferase (<b>rRNA</b>) nối fMet với Gly: chuỗi chuyển từ tRNA ở P sang tRNA ở A.';
      else if (s === 6) t = `<b>${N('EF-G', 'eEF2')}–GTP</b> đẩy ribosome tiến 3 nt. tRNA–chuỗi sang P, tRNA rỗng sang E rồi ra ngoài.`;
      else if (s === 7) t = nons ? `💥 <b>Đột biến vô nghĩa</b> (AAA → UAA): đến codon thứ 4 là gặp stop. Chuỗi chỉ có <b>3 amino acid</b> (${euk ? 'Met' : 'fMet'}-Gly-Phe), protein cụt.${euk ? ' Ở nhân thực mRNA này còn bị NMD phân hủy.' : ''}` : `Các vòng lặp lại cho đến codon stop: chuỗi ${euk ? 'Met' : 'fMet'}-Gly-Phe-Lys-Trp-His (6 aa).`;
      else if (s === 8) t = `<b>${N('RF1/RF2', 'eRF1 + eRF3')}</b> đọc codon stop ở A. Chuỗi <b>${K} amino acid</b> được thủy phân khỏi tRNA và thả ra, ribosome tách đôi.` + (nons ? ' (Stop sớm do đột biến.)' : '');
      else t = euk ? 'Polysome nhân thực: mRNA <b>khép vòng</b> (cap–eIF4G–PABP), ribosome xong có thể quay lại đầu 5′ nhanh.' : 'Polysome nhân sơ: ribosome bám mRNA <b>khi RNAP còn đang phiên mã</b>. Phiên mã và dịch mã đồng thời.';
      if (s >= 4 && s <= 8 && tetra && euk) t = tetMsg + '<br>' + t;
      api.readout(t);
    };
    api.toggle('Nhân thực (thay vì nhân sơ)', false, (x) => { euk = x; ctl.setStep(cur); });
    api.toggle('💥 Tetracycline', false, (x) => { tetra = x; ctl.setStep(cur); });
    api.toggle('💥 Đột biến vô nghĩa (AAA→UAA)', false, (x) => { nons = x; ctl.setStep(cur); });

    const CAMS = [
      [[0.5, 0.8, 10], [0.3, 0.6, 0]], [[0, 1.2, 14], [-2.25, 0.2, 0]], [[-3.5, 0.6, 15], [-4, -0.6, 0]], [[-1, 1, 14], [-2, 0.2, 0]],
      [[1, 1.2, 13], [-0.8, 0.4, 0]], [[0, 1.6, 11], [-1.2, 0.9, 0]], [[1.2, 1.2, 14], [-0.4, 0.5, 0]], [[0.5, 1.0, 19], [0.5, 0.4, 0]],
      [[0, 0, 0], [0, 0, 0]], [[0, 1, 24], [0, 1, 0]],
    ];
    const CYC = 3.4, TERM = 4.5, PAUSE = 1.5;
    let base = [];

    const frame = (t) => {
      const s = cur; extra.length = 0;
      hideDyn();
      if (s === 0) {
        const g = tr[1]; showTR(g); g.scale.setScalar(1.7); g.position.set(-2.2, -2.2, 0);
        synth.visible = true; synth.position.set(2.6, 1.2, -0.4);
        const x = tt % 6;
        const pocket = tmpC.set(2.0, 1.4, 1.1);
        aaM[1].visible = true; atp.visible = x < 3.2;
        if (x < 1.2) { aaM[1].position.lerpVectors(tmpA.set(6, 4, 0.5), pocket, ez(x / 1.2)); atp.position.lerpVectors(tmpB.set(6.5, -1.5, 0.5), tmpA.set(2.7, 0.8, 1.2), ez(x / 1.2)); atp.scale.setScalar(1); }
        else if (x < 2.2) { aaM[1].position.copy(pocket); atp.position.set(2.7, 0.8, 1.2); atp.scale.setScalar(1 - 0.4 * sg(x, 1.2, 2.2)); ppi.forEach((p, i) => { p.visible = true; p.position.set(2.7 + (i ? 1 : -0.4) * 3 * sg(x, 1.2, 2.2), 0.8 - 2.5 * sg(x, 1.2, 2.2), 1.2); }); }
        else { tipOf(g, tmpB); const m = ez(sg(x, 2.2, 3.4)); aaM[1].position.lerpVectors(pocket, tmpB, m); atp.position.copy(aaM[1].position).add(tmpA.set(0.35, -0.3, 0.2)); atp.scale.setScalar(0.6); }
        if (x < 3.2) extra.push('atpL');
      } else if (s === 1) {
        const sep = 1 - ez(sg(tt, 0, 1.5));
        rG.position.x = cX(0); riboBase(sep, 1);
      } else if (s === 2) poseInit(0, tt);
      else if (s === 3) poseInit(1, tt);
      else if (s >= 4 && s <= 8 && blocked()) pose(1, (tt / CYC) % 1, true);
      else if (s === 4) pose(1, 0.45 * cl((tt % 4.8) / 3.3), false);
      else if (s === 5) pose(1, 0.4 + 0.2 * cl((tt % 4.0) / 2.5), false);
      else if (s === 6) pose(1, 0.58 + 0.42 * cl((tt % 4.6) / 3.1), false);
      else if (s === 7) {
        const K = stopIdx(), T = (K - 1) * CYC, x = tt % (T + TERM + PAUSE);
        if (x < T) pose(1 + Math.floor(x / CYC), (x % CYC) / CYC, false);
        else poseTerm(K, cl((x - T) / TERM));
      } else if (s === 8) poseTerm(stopIdx(), cl((tt % (TERM + 2)) / TERM));
      else {
        clones.forEach((c, i) => {
          const ph = (tt * 0.045 + i / 5) % 1, x = -10 + ph * 21.5;
          c.g.position.set(x, yAt(x) + 0.05, 0);
          const n = Math.min(9, Math.floor(ph * 10));
          c.beads.forEach((b, j) => { b.visible = j < n; b.position.set(-0.3 + 0.35 * Math.sin(j * 1.3 + i), 1.6 + j * 0.38, 0.2); });
        });
        if (!euk) { const ph = (tt * 0.9) % 1; rnap.rotation.z = Math.sin(ph * Math.PI * 2) * 0.05; }
      }
      L.only(base.concat(extra));
    };

    const ctl = {
      setStep(s) {
        cur = s; tt = 0;
        // static visibility per step
        const ribo = s >= 1 && s <= 8;
        mG.visible = s >= 1 && s <= 8; rG.visible = ribo; pG.visible = s === 9;
        eG.visible = euk && (s === 2 || s === 3);
        cap.visible = euk; polyA.forEach(m => { m.visible = euk; });
        antiSD.visible = false;
        const seq = seqNow();
        nts.forEach((m, i) => { m.material.color.set(C[seq[i]]); m.material.emissive.setHex(0); });
        if (nons) nts[15 + 9].material.emissive.setHex(0x550000);
        [if1, if3].forEach(f => { f.visible = !euk && (s === 2 || s === 3); api.setOpacity(f, 1); });
        [eif1, eif3].forEach(f => { f.visible = euk && (s === 2 || s === 3); api.setOpacity(f, 1); });
        [abS, abT, abC, abE].forEach(p => { p.visible = s === 1 && !euk; });
        rnap.visible = !euk; pDNA.visible = !euk; pCap.visible = euk; pPab.visible = euk; pArc.visible = euk;
        // label texts
        for (let c = 0; c < 7; c++) { const cod = c === 3 && nons ? 'UAA' : ORF[c]; const aa = c === 3 && nons ? 'STOP' : (c === 0 && !euk ? 'fMet' : AAN[c]); L.set('cod' + c, `${cod}·${aa}`); }
        L.set('lead', euk ? 'Kozak …GCCACC<b>AUG</b>G' : 'SD: AGGAGG');
        L.set('ss', N('30S · rRNA 16S', '40S · rRNA 18S'));
        L.set('ls', N('50S · rRNA 23S + 5S', '60S · rRNA 28S + 5.8S + 5S'));
        L.set('iniL', N('IF2-GTP + fMet-tRNA', 'eIF2-GTP + Met-tRNAi'));
        L.set('tuL', N('EF-Tu·GTP', 'eEF1A·GTP'));
        L.set('gL', N('EF-G·GTP', 'eEF2·GTP'));
        L.set('rfL', N('RF1/RF2 (protein)', 'eRF1 + eRF3'));
        // base labels
        const k = [];
        if (s >= 1 && s <= 8) { k.push('p5', 'p3', 'lead'); for (let c = 0; c < 7; c++) k.push('cod' + c); if (euk) k.push('capL', 'polyL'); if (nons) k.push('nonsL'); }
        if (s === 0) k.push('synL', 'acL', 'ccaL', 'lL', 'aaL');
        if (s === 1) { k.push('ss', 'ls', 'sE', 'sP', 'sA'); if (euk) k.push('eukAb'); else k.push('abS', 'abT', 'abC', 'abE'); }
        if (s === 2) { k.push('ss'); if (euk) k.push('e4L', 'pabL', 'loopL', 'eif3L', 'eif1L'); else k.push('if1L', 'if3L'); }
        if (s === 3) k.push('ss', 'ls', 'sE', 'sP', 'sA');
        if (s >= 4 && s <= 8) k.push('sE', 'sP', 'sA');
        if (s === 9) { k.push('polyT', 'p5b', 'p3b'); k.push(euk ? 'pLoop' : 'rnapL'); }
        base = k;
        // camera
        let cam = CAMS[s];
        if (s === 2 && euk) cam = [[-3, 0.8, 19], [-3.5, 0.3, 0]];
        if (s === 8) { const rx = cX(stopIdx() - 1); cam = [[rx + 1.5, 1.2, 14], [rx + 0.3, 0.8, 0]]; }
        if (s >= 4 && s <= 8 && blocked()) cam = [[0.5, 1.2, 13], [-1.2, 0.4, 0]];
        api.camera(...cam);
        readout();
        frame(0);
      },
      update(dt, t) { tt += dt; frame(t); },
    };
    ctl.setStep(0);
    return ctl;
  },
};
