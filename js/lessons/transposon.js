// Bài 9: Gene nhảy. DNA transposon "cắt-dán" (Tn5) vs retrotransposon "chép-dán" (L1), và 3 hệ phòng vệ: KRAB/KAP1, APOBEC, PIWI/piRNA.
import { labels, progress, clamp, ease, lerp, strand } from './_kit.js';

export default {
  title: 'Gene nhảy (transposon)',
  sub: 'Có những đoạn DNA tự "nhảy" sang chỗ khác trong hệ gene. Loại cắt-dán mang chính nó đi. Loại chép-dán để bản gốc ở lại và gửi bản sao đi, nên số bản sao cứ tăng lên. Khoảng 45% hệ gene người là xác của các gene nhảy này.',
  legend: '<span><i style="background:#ffb347"></i>DNA transposon</span><span><i style="background:#b57bff"></i>retrotransposon</span><span><i style="background:#5b8def"></i><i style="background:#ef6c8b"></i>DNA vật chủ</span><span><i style="background:#f2994a"></i>RNA</span><span><i style="background:#34c759"></i>TSD (lặp đoạn đích)</span><span><i style="background:#2bb3a3"></i>enzyme</span><span><i style="background:#ff3b30"></i>nhóm methyl</span><span>· mô hình rút gọn</span>',

  why: `<p><b>Yếu tố di động</b> (mobile element, transposon, "gene nhảy") là đoạn DNA <b>có thể di chuyển</b> sang vị trí khác trong hệ gene. Barbara McClintock phát hiện ra chúng ở cây ngô (giải Nobel 1983).</p>
  <ul><li>Với bản thân transposon: nó là "DNA ích kỷ", chỉ cần tự nhân lên trong hệ gene.</li>
  <li>Với hệ gene: chúng là nguồn <b>tính linh động</b> của DNA. Chúng tạo đột biến và sắp xếp lại gene. Khi cài gần promoter, chúng có thể trở thành <b>đơn vị điều hòa mới</b>, tạo đa dạng cho tiến hóa.</li>
  <li>Hai lớp theo slide:
    <ul><li><b>Lớp 1 · Retrotransposon:</b> đi qua <b>RNA trung gian</b> rồi <b>phiên mã ngược</b> thành DNA. Kiểu <b>chép-dán</b> (copy-paste).</li>
    <li><b>Lớp 2 · DNA transposon:</b> được <b>cắt ra</b> dưới dạng DNA rồi <b>dán</b> vào chỗ mới nhờ <b>transposase</b>. Kiểu <b>cắt-dán</b> (cut-paste).</li></ul></li></ul>`,

  without: `<p>Câu hỏi ở đây ngược lại: <b>nếu tế bào không có hệ phòng vệ</b> chống transposon thì sao?</p>
  <ul><li>Retrotransposon được phiên mã và chép-dán tự do. Mỗi lần cài vào một chỗ mới là một lần có thể <b>phá hỏng gene</b>.
    <ul><li>Bệnh <b>hemophilia A</b> có trường hợp do L1 cài vào gene yếu tố đông máu VIII.</li>
    <li>Ung thư đại tràng có trường hợp do L1 cài vào gene ức chế khối u <b>APC</b>.</li></ul></li>
  <li><b>Cài vào chỗ gây chết</b> (lethal insertion), hoặc tích lũy đột biến dần dần (<b>mutational meltdown</b>) qua nhiều thế hệ.</li>
  <li>Ở <b>dòng tế bào mầm</b>, chuột đực thiếu protein PIWI bị <b>vô sinh</b> vì transposon thức dậy và phá hủy quá trình tạo tinh trùng.</li>
  <li>Vì vậy hệ gene và transposon ở trong một <b>"cuộc chạy đua vũ trang"</b>: chọn lọc tự nhiên giữ lại và đa dạng hóa APOBEC và các KRAB-ZFP.</li></ul>
  <div class="box info">👉 Bật <b>💥 Tắt hệ phòng vệ</b> ở bước 8–10 để xem transposon tự do nhân bản. Bật <b>Đích = gene ức chế khối u</b> ở bước 5 và 7 để xem hậu quả của một lần cài.</div>`,

  foundation: [
    { q: 'Hệ gene người chủ yếu chứa gì?', a: 'Chỉ khoảng <b>1,5%</b> hệ gene người mã hóa protein. Khoảng <b>45%</b> là trình tự có nguồn gốc từ transposon: L1 khoảng 17%, Alu khoảng 10%, retrovirus nội sinh khoảng 8%. Phần lớn đã "chết" do đột biến. Chỉ khoảng vài chục tới trăm bản L1 còn nhảy được.' },
    { q: 'Phiên mã và phiên mã NGƯỢC khác nhau ra sao?', a: '<b>Phiên mã</b>: DNA thành RNA, do RNA polymerase. <b>Phiên mã ngược</b> (reverse transcription): <b>RNA thành DNA</b>, do enzyme <b>reverse transcriptase (RT)</b>. Retrovirus như HIV và retrotransposon dùng RT. DNA tạo từ RNA gọi là <b>cDNA</b> (DNA bổ sung).' },
    { q: 'Transposase là gì?', a: 'Là enzyme do chính DNA transposon mã hóa. Nó <b>nhận diện 2 đầu</b> của transposon (trình tự lặp đảo ở 2 đầu), <b>cắt</b> transposon ra khỏi DNA cho rồi <b>cài</b> vào DNA đích. Không có transposase thì transposon không nhảy được.' },
    { q: '"Cắt so le" và "lặp đoạn đích" (TSD) là gì?', a: 'Transposase hoặc endonuclease cắt 2 mạch của DNA đích <b>lệch nhau vài nucleotide</b> (Tn5 lệch 9 bp). Transposon được nối vào 2 đầu lệch đó, để lại 2 khoảng mạch đơn ngắn. Tế bào lấp đầy 2 khoảng này nên đoạn ngắn đó xuất hiện <b>2 lần</b> ở 2 bên transposon, gọi là <b>TSD</b> (target-site duplication). TSD là DNA của vật chủ, không phải của transposon.' },
    { q: 'Methyl hóa DNA và H3K9me3 làm gene "im lặng" như thế nào?', a: 'Methyl hóa C ở vị trí CpG và gắn 3 nhóm methyl vào lysine 9 của histone H3 (<b>H3K9me3</b>) làm chromatin <b>co đặc lại</b> thành dị nhiễm sắc (heterochromatin). RNA polymerase không vào được nên <b>không phiên mã</b>. Đây là cơ chế epigenetic (bài 14): DNA không đổi trình tự nhưng bị "khóa".' },
    { q: 'Khử amin cytosine dẫn đến đột biến gì?', a: 'C bị khử amin thành <b>U</b>. U bắt cặp với A. Nếu U nằm trên mạch cDNA đang tạo, khi chép lại thì mạch kia nhận <b>A thay vì G</b>, tức đột biến <b>G→A</b>. APOBEC làm việc này <b>hàng loạt</b> (hypermutation) để phá hỏng transposon và retrovirus.' },
    { q: 'RNA ngắn dẫn đường (như miRNA, piRNA) hoạt động ra sao?', a: 'Một RNA ngắn nằm trong một protein (họ Argonaute). RNA đó <b>bắt cặp bổ sung</b> với RNA đích, chỉ cho protein biết phải tác động vào đâu. <b>piRNA</b> (24–31 nt) đi với protein <b>PIWI</b>, chủ yếu ở <b>tế bào mầm</b>, để cắt RNA của transposon hoặc dẫn methyl hóa DNA mới.' },
    { q: 'Vì sao transposon cài vào gene lại nguy hiểm?', a: 'Một đoạn DNA vài nghìn bp cài vào giữa vùng mã hóa sẽ <b>cắt đôi gene</b>, lệch khung đọc hoặc chèn codon STOP, nên gene mất chức năng. Cài vào promoter hay intron có thể làm thay đổi lượng biểu hiện hoặc cách cắt nối.' },
  ],

  steps: [
    { title: 'Toàn cảnh: transposon nằm trong DNA vật chủ', text: 'Phía trên là DNA vật chủ có một đoạn <b>DNA transposon</b> (khung cam), ví dụ <b>Tn5</b> của vi khuẩn. Hai đầu của nó là 2 trình tự 19 bp gọi là <b>đầu cuối (mosaic end, ME)</b>, "tay nắm" để enzyme nhận ra. Phía dưới là một <b>DNA đích</b> ở chỗ khác trong hệ gene.' },
    { title: 'Tn5 ①: transposase bám vào 2 đầu', text: 'Mỗi đầu ME được một phân tử <b>transposase</b> (xanh ngọc) nhận ra và bám vào. Transposase do chính gene trong transposon mã hóa.' },
    { title: 'Tn5 ②: hình thành phức hợp synapse', text: 'Hai transposase <b>kéo 2 đầu lại gần nhau</b> thành một phức hợp gọi là <b>synapse</b> (synaptic complex formation). Chỉ khi 2 đầu đã được ghép cặp như vậy thì enzyme mới được phép cắt. Đây là chốt an toàn để không cắt bừa.' },
    { title: 'Tn5 ③: cắt khỏi DNA cho (cleavage)', text: 'Transposase <b>cắt cả 2 mạch</b> ở 2 đầu (tia lửa), và toàn bộ transposon được <b>nhấc ra</b> cùng phức hợp. DNA cho (vật chủ cũ) giờ <b>đứt mạch đôi</b>. Tế bào phải sửa vết đứt này bằng các con đường ở bài 8.' },
    { title: 'Tn5 ④: bắt giữ DNA đích và chuyển mạch', text: 'Phức hợp <b>bắt giữ DNA đích</b> (target capture), cắt so le DNA đích rồi <b>nối 2 đầu transposon</b> vào đó (strand transfer). Tế bào lấp 2 khoảng mạch đơn, nên đoạn ngắn ở chỗ cài xuất hiện <b>2 lần</b> (ống xanh lá): <b>TSD</b>, 9 bp ở Tn5. Kết quả: transposon <b>đổi chỗ</b>, số bản sao <b>không đổi</b>. Đó là <b>cắt-dán</b>.' },
    { title: 'Retrotransposon ①: phiên mã thành RNA', text: 'Giờ đoạn tím là một <b>retrotransposon</b>, ví dụ <b>L1</b> (LINE-1) của người. Nó <b>được phiên mã</b> như một gene bình thường, tạo một <b>RNA trung gian</b> (thanh cam bay lên). Nhìn kỹ: <b>bản gốc vẫn nằm nguyên</b> trong DNA, không bị cắt ra.' },
    { title: 'Retrotransposon ②: phiên mã ngược và cài bản sao', text: 'RNA của L1 (cùng 2 protein ORF1p, ORF2p nó mã hóa) quay lại nhân. <b>ORF2p</b> cắt DNA đích rồi dùng đầu 3′-OH vừa cắt làm mồi để <b>phiên mã ngược</b> RNA thành DNA ngay tại chỗ (TPRT). Kết quả: một <b>bản sao MỚI</b> nằm ở đích, <b>bản gốc vẫn còn</b>, tức có <b>2 bản</b>. Đó là <b>chép-dán</b>, nên retrotransposon nhân lên rất nhiều.' },
    { title: 'Phòng vệ ①: KRAB-ZFP + KAP1 khóa transposon', text: 'Protein <b>KRAB-ZFP</b> (tím) nhận ra trình tự của retrotransposon bằng "ngón tay kẽm". Nó gọi <b>KAP1</b> (xanh ngọc) tới. KAP1 kéo theo enzyme gắn <b>H3K9me3</b> lên histone và enzyme <b>methyl hóa DNA</b> (chấm đỏ). Chromatin đóng lại (ống xám), <b>không phiên mã được</b>, nên không có RNA và không nhảy được.' },
    { title: 'Phòng vệ ②: APOBEC đột biến hóa cDNA', text: 'Nếu một RNA transposon vẫn đang được phiên mã ngược, <b>APOBEC</b> (một cytidine deaminase) bám vào <b>mạch cDNA</b> mới tạo và <b>khử amin C thành U</b> hàng loạt (base xanh dương đổi sang cam). Bản sao chứa đầy đột biến, nên <b>bị phá hủy hoặc mất khả năng nhảy</b>. APOBEC3G cũng dùng đúng cách này để chống <b>HIV</b>.' },
    { title: 'Phòng vệ ③: PIWI + piRNA cắt RNA transposon', text: 'Ở <b>tế bào mầm</b>, <b>piRNA</b> (RNA ngắn, cam) bắt cặp bổ sung với RNA của transposon và dẫn <b>protein PIWI</b> tới. PIWI <b>cắt RNA</b> làm đôi, nên không còn khuôn để phiên mã ngược. Một số PIWI còn vào nhân để dẫn <b>methyl hóa DNA mới</b> (de novo) lên chính transposon.' },
  ],

  application: `<ul>
  <li><b>Giải trình tự thế hệ mới và ATAC-seq:</b> transposase Tn5 đã chỉnh sửa được nạp sẵn các đoạn adapter. Nó <b>cắt và gắn adapter vào DNA cùng lúc</b> (tagmentation), giúp chuẩn bị thư viện giải trình tự rất nhanh. ATAC-seq dùng Tn5 để tìm vùng chromatin "mở": Tn5 chỉ chèn được vào chỗ DNA không bị nucleosome che.</li>
  <li><b>Liệu pháp gene và tế bào CAR-T:</b> hệ transposon <b>Sleeping Beauty</b> (dựng lại từ cá) và <b>piggyBac</b> (từ bướm đêm) được dùng để cài gene điều trị vào hệ gene tế bào người mà không cần virus.</li>
  <li><b>Kháng kháng sinh ở vi khuẩn:</b> nhiều transposon vi khuẩn (Tn5 mang gene kháng kanamycin, Tn10 mang kháng tetracycline) nhảy giữa nhiễm sắc thể và plasmid, làm <b>gene kháng thuốc lan nhanh</b>.</li>
  <li><b>Gây đột biến có chủ đích để nghiên cứu:</b> cho transposon nhảy ngẫu nhiên khắp hệ gene, rồi tìm cá thể có kiểu hình lạ để xác định gene bị phá.</li>
  <li><b>"Thuần hóa" transposon:</b> enzyme RAG1/2, cắt DNA để ghép gene kháng thể (V(D)J), có nguồn gốc từ một transposase cổ. Protein <b>syncytin</b> cần cho nhau thai có nguồn gốc từ gene vỏ của một retrovirus nội sinh.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Retrotransposon (Lớp 1)</th><th>DNA transposon (Lớp 2)</th></tr>
  <tr><td>Chất trung gian</td><td><b>RNA</b></td><td><b>DNA</b></td></tr>
  <tr><td>Enzyme chính</td><td><b>Reverse transcriptase</b> (+ endonuclease, ví dụ ORF2p của L1)</td><td><b>Transposase</b></td></tr>
  <tr><td>Kiểu nhảy</td><td><b>Chép-dán</b>: bản gốc ở lại</td><td><b>Cắt-dán</b>: bản gốc rời đi</td></tr>
  <tr><td>Số bản sao</td><td><b>Tăng</b> sau mỗi lần nhảy</td><td>Về nguyên tắc <b>không đổi</b></td></tr>
  <tr><td>DNA cho</td><td>Nguyên vẹn</td><td>Bị đứt mạch đôi, vật chủ phải sửa</td></tr>
  <tr><td>Ví dụ</td><td>L1 (LINE), Alu (SINE), retrovirus nội sinh (LTR)</td><td>Tn5, Tn10, IS ở vi khuẩn; Ac/Ds ở ngô; Sleeping Beauty</td></tr>
  <tr><td>Ở người</td><td>Chiếm đa số; L1 vẫn còn hoạt động</td><td>Chỉ còn "hóa thạch", không nhảy được</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>3 hệ phòng vệ</th><th>Nhận diện bằng</th><th>Làm gì</th><th>Tác động lên</th></tr>
  <tr><td><b>KRAB-ZFP / KAP1</b></td><td>Protein ngón tay kẽm đọc trình tự DNA</td><td>H3K9me3 + methyl hóa DNA, khóa chromatin</td><td><b>DNA</b> (chặn phiên mã)</td></tr>
  <tr><td><b>APOBEC</b></td><td>Mạch đơn DNA (cDNA)</td><td>Khử amin C→U hàng loạt</td><td><b>cDNA</b> đang tạo</td></tr>
  <tr><td><b>PIWI + piRNA</b></td><td>piRNA bắt cặp bổ sung</td><td>Cắt RNA; dẫn methyl hóa DNA mới</td><td><b>RNA</b> (và DNA), ở tế bào mầm</td></tr>
  </table></div>`,

  traps: [
    { trap: '"Retrotransposon và DNA transposon đều cắt-dán, chỉ khác enzyme."', truth: '<b>Retrotransposon đi qua RNA và chép-dán</b>: bản gốc ở lại, số bản sao tăng. <b>DNA transposon cắt-dán</b> nhờ transposase.' },
    { trap: '"DNA transposon cần phiên mã ngược."', truth: 'Không. DNA transposon được cắt ra <b>dưới dạng DNA</b> bởi transposase. Chỉ retrotransposon (và retrovirus) mới cần reverse transcriptase.' },
    { trap: '"Transposon luôn có hại."', truth: 'Slide nêu cả <b>mặt có lợi</b>: tạo <b>mạng điều hòa mới</b> (transposon gần promoter thành đơn vị điều hòa) và <b>tăng đa dạng</b> để thích nghi. Mặt có hại: cài gây chết, mutational meltdown, ung thư.' },
    { trap: '"Kiểu cắt-dán để lại DNA cho nguyên vẹn."', truth: 'Cắt-dán để lại <b>vết đứt mạch đôi</b> ở DNA cho. Tế bào phải sửa (bài 8), và vết sửa thường để lại "dấu chân" (footprint) vài nucleotide.' },
    { trap: '"TSD là một phần của transposon."', truth: 'TSD là đoạn ngắn của <b>DNA đích (vật chủ)</b> bị nhân đôi do cắt so le rồi lấp đầy. Nó nằm ở 2 bên bên ngoài transposon.' },
    { trap: '"APOBEC là enzyme methyl hóa DNA."', truth: 'APOBEC là <b>cytidine deaminase</b>: biến C thành U trên mạch đơn (cDNA), gây đột biến hàng loạt. Methyl hóa DNA là việc của KRAB/KAP1 (qua DNMT) và PIWI.' },
    { trap: '"KRAB/KAP1 cắt bỏ transposon ra khỏi hệ gene."', truth: 'KRAB/KAP1 <b>không cắt</b> gì. Nó làm transposon <b>im lặng</b> bằng epigenetic (H3K9me3, methyl hóa DNA). Transposon vẫn còn đó nhưng không được phiên mã.' },
    { trap: '"piRNA giống hệt miRNA: hoạt động ở mọi tế bào, đi với Argonaute AGO."', truth: 'piRNA dài hơn (24–31 nt), đi với protein <b>PIWI</b>, hoạt động chủ yếu ở <b>tế bào mầm</b>. Ngoài cắt RNA, nó còn dẫn <b>methyl hóa DNA mới</b> lên transposon.' },
    { trap: '"Phần lớn DNA người là gene mã hóa protein."', truth: 'Chỉ khoảng 1,5%. Khoảng <b>45%</b> có nguồn gốc từ transposon, phần lớn là retrotransposon.' },
  ],

  quiz: [
    { q: 'Retrotransposon di chuyển nhờ:', ops: ['Transposase cắt và dán', 'RNA trung gian và phiên mã ngược', 'Tái tổ hợp tương đồng', 'Primase'], a: 1, e: 'Retrotransposon được phiên mã thành RNA, rồi RNA được phiên mã ngược thành DNA và cài vào chỗ mới. "Transposase cắt và dán" là kiểu của DNA transposon, nên là đáp án gây nhiễu.' },
    { q: 'Thứ tự đúng các bước nhảy của Tn5 theo slide:', ops: ['Cắt → synapse → bám đầu → chuyển mạch', 'Bám 2 đầu → synapse → cắt → bắt giữ đích → chuyển mạch', 'Phiên mã → phiên mã ngược → cài', 'Bắt giữ đích → bám 2 đầu → cắt → synapse'], a: 1, e: 'Transposase bám 2 đầu, ghép 2 đầu thành synapse, rồi mới cắt (chốt an toàn), bắt giữ DNA đích, rồi chuyển mạch. Phiên mã/phiên mã ngược là của retrotransposon.' },
    { q: 'Sau một lần nhảy thành công, số bản sao của retrotransposon trong hệ gene:', ops: ['Giảm 1', 'Không đổi', 'Tăng 1', 'Bằng 0 vì bản gốc bị cắt'], a: 2, e: 'Chép-dán: bản gốc vẫn ở lại, bản sao mới được cài ở đích, nên tăng 1. "Không đổi" đúng với DNA transposon cắt-dán.' },
    { q: 'Một retrotransposon L1 cài vào giữa exon của gene ức chế khối u APC trong một tế bào ruột. Hậu quả có thể là:', ops: ['Gene APC được biểu hiện mạnh hơn', 'Gene APC mất chức năng, góp phần gây ung thư', 'Không ảnh hưởng vì L1 chỉ nằm trong intron', 'Tế bào chuyển sang dùng NHEJ'], a: 1, e: 'Một đoạn DNA dài chèn vào exon sẽ cắt đôi vùng mã hóa, nên APC hỏng. Mất gene ức chế khối u góp phần gây ung thư (bệnh tế bào soma, như slide nêu).' },
    { q: 'APOBEC chống transposon bằng cách:', ops: ['Methyl hóa promoter của transposon', 'Khử amin C→U trên cDNA, gây đột biến hàng loạt', 'Cắt RNA transposon nhờ RNA dẫn đường', 'Gắn H3K9me3 lên histone'], a: 1, e: 'APOBEC là cytidine deaminase. Cắt RNA nhờ RNA dẫn đường là PIWI/piRNA. Methyl hóa và H3K9me3 là KRAB/KAP1.' },
    { q: 'Chuột đực bị bất hoạt gene PIWI (ví dụ MIWI2). Điều gì dễ xảy ra nhất?', ops: ['Transposon thức dậy ở tế bào mầm, chuột đực vô sinh', 'Chuột kháng được HIV', 'Không có tác động vì PIWI chỉ ở gan', 'Transposon bị xóa khỏi hệ gene'], a: 0, e: 'PIWI/piRNA chủ yếu bảo vệ tế bào mầm. Mất nó thì transposon được phiên mã và nhảy, phá quá trình tạo tinh trùng. PIWI không xóa transposon, chỉ cắt RNA và dẫn methyl hóa.' },
    { q: 'Lặp đoạn đích (TSD) ở 2 bên một transposon hình thành do:', ops: ['Transposon tự mang 2 bản lặp', 'Cắt so le DNA đích rồi lấp khoảng mạch đơn', 'Phiên mã ngược đọc 2 lần', 'Sai sót của DNA ligase'], a: 1, e: 'Enzyme cắt 2 mạch DNA đích lệch nhau. Sau khi transposon được nối vào, 2 khoảng mạch đơn ngắn được lấp đầy nên đoạn đó xuất hiện 2 lần. TSD là DNA của vật chủ, không phải của transposon.' },
  ],

  recall: [
    'Vẽ tay lại 5 bước nhảy của Tn5: bám 2 đầu → synapse → cắt → bắt giữ đích → chuyển mạch. Đánh dấu chỗ DNA cho bị đứt và 2 TSD ở đích.',
    'Vẽ 2 cột "cắt-dán" vs "chép-dán": chất trung gian, enzyme, số bản sao, DNA cho có bị đứt không, ví dụ.',
    'Kể 3 hệ phòng vệ của động vật có vú. Mỗi hệ: nhận diện bằng gì, tác động lên DNA, cDNA hay RNA?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const v = new THREE.Vector3();
    const SEQ_EL = 'CTGTCTCTTATA';
    const COL = { tn1: 0xffb347, tn2: 0xd9822b, re1: 0xb57bff, re2: 0x8a52d6 };

    // ---- DNA pieces ----
    const grp = (x, y) => { const g = api.group(); g.position.set(x, y, 0); return g; };
    const gDL = grp(-8, 3), gEl = grp(-3, 3), gDR = grp(2, 3), gTL = grp(-1.5, -3.5), gTR = grp(3.5, -3.5), gCp = grp(1, -3.5);
    const opt = { rise: 0.5, radius: 0.9, turn: 10 };
    const dDL = api.dna({ ...opt, seq: 'GATCGTAC', parent: gDL });
    const el = api.dna({ ...opt, seq: SEQ_EL, parent: gEl, c1: COL.tn1, c2: COL.tn2 });
    const dDR = api.dna({ ...opt, seq: 'AGCTTGAC', parent: gDR });
    const dTL = api.dna({ ...opt, seq: 'TTACGGAGCT', parent: gTL });
    const dTR = api.dna({ ...opt, seq: 'AGCTCATGCA', parent: gTR });
    const cp = api.dna({ ...opt, seq: SEQ_EL, parent: gCp, c1: COL.re1, c2: COL.re2 });
    const recolor = (d, c1, c2) => { for (const p of d.pairs) { p.s1.material.color.setHex(c1); p.s2.material.color.setHex(c2); p.bb1?.material.color.setHex(c1); p.bb2?.material.color.setHex(c2); } };
    function showCount(d, k) { // first k pairs visible
      d.pairs.forEach((p, i) => { const on = i < k; p.half1.visible = p.half2.visible = on; p.hb.visible = on; if (p.bb1) p.bb1.visible = p.bb2.visible = i + 1 < k; });
    }
    // TSD shells (green) at the inner ends of the target halves
    const tsdShell = (d, a, b, parent) => { const m = api.cylinder(1.25, 1.25, (b - a + 1) * 0.5, C.good, parent, { opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }); m.rotation.z = Math.PI / 2; m.position.x = (d.xOf(a) + d.xOf(b)) / 2; return m; };
    const tsdL = tsdShell(dTL, 7, 9, gTL), tsdR = tsdShell(dTR, 0, 2, gTR);
    // orange/purple frame around the element
    const frameM = api.cylinder(1.2, 1.2, 6.2, COL.tn1, gEl, { opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }); frameM.rotation.z = Math.PI / 2;
    const cpFrame = api.cylinder(1.2, 1.2, 6.2, COL.re1, gCp, { opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }); cpFrame.rotation.z = Math.PI / 2;
    // silencing shell + methyl marks on element
    const silent = api.cylinder(1.45, 1.45, 6.4, 0x8e8e93, gEl, { opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }); silent.rotation.z = Math.PI / 2;
    const meG = new THREE.SphereGeometry(0.17, 12, 8), meM = api.mat(C.methyl);
    const methyls = [0, 2, 4, 6, 8, 10].map(i => { const p = el.pairs[i], m = new THREE.Mesh(meG, meM); m.position.set(p.half1.position.x, p.half1.position.y * 1.3, p.half1.position.z * 1.3); el.group.add(m); return m; });

    // ---- enzymes ----
    const OFF = new THREE.Vector3(-14, 9, -4);
    const blob = (r, col, seed, sc = [1.1, 0.85, 1]) => { const b = api.blob(r, col, null, { mat: { opacity: 0, depthWrite: false }, scale: sc, seed }); b.position.copy(OFF); b.userData.on = false; return b; };
    const tnA = blob(0.8, C.enzyme, 1), tnB = blob(0.8, C.enzyme, 2);
    const rt = blob(0.9, 0x1f8f84, 3);
    const krab = blob(0.75, C.protein, 4, [1.4, 0.7, 0.9]), kap1 = blob(0.85, C.enzyme, 5);
    const apo = blob(0.8, 0x37c6b5, 6), piwi = blob(0.95, 0x9b6dd6, 7, [1.3, 0.9, 1]);
    const tethA = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.13, C.enzyme), tethB = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.13, C.enzyme);
    tethA.visible = tethB.visible = false;
    const e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
    const spark = api.sphere(0.3, 0xffe066, null, { emissive: 0xffaa00 }); spark.visible = false;
    const spark2 = api.sphere(0.3, 0xffe066, null, { emissive: 0xffaa00 }); spark2.visible = false;

    // ---- RNA / cDNA / piRNA ----
    const gR = grp(-3, 5.1);
    const RSEQ = 'AGGAGCGGAUGG';
    const rna = strand(api, { seq: RSEQ, x0: -2.75, dx: 0.5, y: 0, up: -1, parent: gR, rna: true });
    const gM = grp(-3, 0); // middle lane for APOBEC / PIWI
    const rna2 = strand(api, { seq: RSEQ, x0: -2.75, dx: 0.5, y: 0.9, up: -1, parent: gM, rna: true });
    const CD = 'TCCTCGCCTACC';
    const cdna = strand(api, { seq: CD, x0: -2.75, dx: 0.5, y: -0.6, up: 1, parent: gM });
    const PI = 'CCUCGCCU'; // pairs RNA positions 1..8
    const gP = grp(-3, -0.6);
    const pir = strand(api, { seq: PI, x0: -2.25, dx: 0.5, y: 0, up: 1, parent: gP, rna: true });
    const rnaX0 = rna2.items.map(it => it.n.position.x);

    // ---- labels ----
    L.add('el', 'DNA transposon (Tn5)', [0, -1.9, 0], gEl, 'big');
    L.add('me', '↓ đầu ME', [-2.6, 1.5, 0], gEl, 'dim');
    L.add('me2', 'đầu ME ↓', [2.6, 1.5, 0], gEl, 'dim');
    L.add('host', 'DNA vật chủ (cho)', [-8, 5.5, 0], null, 'dim');
    L.add('tgt', 'DNA đích', [-1.6, -1.9, 0], gTL, 'dim');
    L.add('tnp', 'Transposase', [0, 0, 0], null);
    L.add('syn', 'Phức hợp synapse', [-3, 7.7, 0], null, 'good');
    L.add('cut', 'Cắt 2 đầu → nhấc ra', [-9, 5.6, 0], null);
    L.add('gap', 'DNA cho bị ĐỨT → vật chủ phải sửa', [-3, 1.3, 0], null, 'warn');
    L.add('cap', 'Bắt giữ đích → chuyển mạch', [1, -0.2, 0], null);
    L.add('tsd', 'TSD', [1.75, 1.6, 0], gTL, 'good');
    L.add('tsd2', 'TSD', [-1.75, 1.6, 0], gTR, 'good');
    L.add('rna', 'RNA trung gian', [3.6, 0.2, 0], gR);
    L.add('stay', 'bản gốc vẫn ở lại', [0, -2.9, 0], gEl, 'good');
    L.add('rt', 'Phiên mã ngược (ORF2p)', [0, 0, 0], null);
    L.add('copy', 'bản sao MỚI', [0, -1.9, 0], gCp, 'good');
    L.add('krab', 'KRAB-ZFP nhận diện', [0, 0, 0], null);
    L.add('kap1', 'KAP1 → H3K9me3 + methyl DNA', [0, 0, 0], null);
    L.add('silent', 'dị nhiễm sắc: IM LẶNG', [0.6, -3.3, 0], gEl, 'good');
    L.add('rna2', 'RNA transposon (khuôn)', [-3.9, 1.3, 0], gM, 'dim');
    L.add('cdna', 'cDNA đang tạo', [-4.0, -0.9, 0], gM, 'dim');
    L.add('apo', 'APOBEC: C → U', [0, 0, 0], null);
    L.add('piwi', 'PIWI + piRNA', [0, 0, 0], null);
    L.add('cutR', 'RNA bị cắt ✂', [-3, 2.4, 0], null, 'good');
    L.add('msg', '', [-1, -7, 0], null, 'warn');
    const txt = {}, cls = {};
    const setT = (k, t) => { if (txt[k] !== t) { txt[k] = t; L.set(k, t); } };
    const setC = (k, c) => { if (cls[k] !== c) { cls[k] = c; L.get(k).element.className = 'lbl ' + c; } };
    const follow = (key, obj, dy) => L.get(key).position.set(obj.position.x, obj.position.y + dy, obj.position.z);

    // ---- state ----
    let cur = 0, tnpBad = false, rtBad = false, defOff = false, tsg = false, sig = '';
    const ph = progress(0.17);
    const vis = (o, on, op = 0.7) => { if (o.userData.on !== on) { o.userData.on = on; api.fadeTo(o, on ? op : 0, 6); } };
    const CAMS = [[[-1, 1, 19], [-1.5, 0, 0]], [[-3, 4.5, 13], [-3, 3.6, 0]], [[-3, 4.5, 13], [-3, 4, 0]], [[-2, 4.5, 17], [-2.5, 4.5, 0]], [[0, 1.5, 24], [-0.5, 0.5, 0]],
      [[-3, 4.5, 14], [-3, 4.2, 0]], [[0, 1.5, 24], [-0.5, 0.5, 0]], [[-2, 2.5, 21], [-1.5, 1.5, 0]], [[-3.5, 0.6, 12], [-3.7, 0.2, 0]], [[-3.5, 0.8, 12], [-3.6, 0.6, 0]]];
    const tg = {};
    const refresh = () => { ctl.setStep(cur); readout(); };
    tg.tnp = api.toggle('💥 Hỏng transposase', false, (x) => { tnpBad = x; refresh(); });
    tg.rt = api.toggle('💥 Không có phiên mã ngược (RT)', false, (x) => { rtBad = x; refresh(); });
    tg.tsg = api.toggle('Đích = giữa gene ức chế khối u (APC)', false, (x) => { tsg = x; refresh(); });
    tg.def = api.toggle('💥 Tắt hệ phòng vệ (KRAB/KAP1, APOBEC, piRNA)', false, (x) => { defOff = x; refresh(); });
    function readout() {
      const t = [];
      if (tnpBad && cur >= 1 && cur <= 4) t.push('❌ <b>Transposase hỏng</b>: không ai nhận ra 2 đầu ME, nên transposon <b>nằm yên</b>. Đây là cách các nhà khoa học "khóa" transposon: tách gene transposase ra khỏi transposon và chỉ cấp nó khi cần.');
      if (rtBad && cur === 6) t.push('❌ <b>Không có RT</b>: RNA vẫn được tạo nhưng không chuyển được thành DNA, nên <b>không có bản sao mới</b>. Một số thuốc ức chế RT chống HIV cũng ức chế được RT của L1.');
      if (tsg && (cur === 4 || cur === 6)) t.push('⚠️ <b>Cài vào giữa gene APC</b>: gene bị cắt đôi, mất chức năng. Mất gene ức chế khối u là một bước dẫn tới ung thư (bệnh tế bào soma, như slide nêu).');
      if (defOff && cur >= 7) t.push('❌ <b>Không có phòng vệ</b>: transposon được phiên mã tự do, cDNA không bị đột biến, RNA không bị cắt, nên <b>bản sao mới cài vào DNA đích</b> ở mỗi bước. Nhiều thế hệ như vậy dẫn đến cài gây chết, mutational meltdown; ở tế bào mầm gây vô sinh.');
      api.readout(t.join('<br>') || 'Thử nghiệm: mỗi công tắc chỉ hiện ở bước liên quan. Bật lên rồi xem 3D thay đổi.');
    }
    function show(keys) { const s = keys.join(','); if (s !== sig) { sig = s; L.only(keys); } }

    const T = { el: new THREE.Vector3(), tl: new THREE.Vector3(), tr: new THREE.Vector3(), r: new THREE.Vector3() };
    function frame(dt, t, snap) {
      const f = ph.v, keys = [];
      let elx = -3, ely = 3, tlx = -1.5, trx = 3.5, cpOn = false, cpK = 12, tsdOn = false, rnaK = 0, rnaOn = false, rx = -3, ry = 5.1;
      let A = OFF, B = OFF, aOn = false, rtOn = false, kOn = false, k1On = false, apOn = false, pwOn = false, meK = 0, silOp = 0, spk = null, spk2 = null, msg = '';
      let midOn = false, apoK = 0, cutK = 0, piOn = false, piY = -3;
      const retro = cur >= 5;
      const insert = (g) => { tlx = lerp(-1.5, -4.5, g); trx = lerp(3.5, 6.5, g); };
      if (cur === 0) keys.push('el', 'me', 'me2', 'host', 'tgt');
      else if (cur <= 4 && tnpBad) { keys.push('el'); if (cur === 4) keys.push('tgt'); msg = '❌ Transposase hỏng → transposon không nhảy được'; }
      else if (cur === 1) { const g = ease(clamp(f / 0.5)); aOn = true; A = v.set(lerp(-9, -5.9, g), lerp(7, 4.5, g), 0.3).clone(); B = new THREE.Vector3(lerp(3, -0.1, g), lerp(7, 4.5, g), 0.3); keys.push('el', 'me', 'me2', 'tnp'); }
      else if (cur === 2) { const g = ease(clamp(f / 0.6)); aOn = true; ely = 3 + 0.5 * g; A = new THREE.Vector3(lerp(-5.9, -3.75, g), lerp(4.5, 5.6, g), 0.3); B = new THREE.Vector3(lerp(-0.1, -2.25, g), lerp(4.5, 5.6, g), 0.3); keys.push('el', 'tnp'); if (f > 0.5) keys.push('syn'); }
      else if (cur === 3) {
        const g = ease(clamp((f - 0.3) / 0.6)); aOn = true; ely = lerp(3.5, 5.6, g);
        A = new THREE.Vector3(-3.75, ely + 2.1, 0.3); B = new THREE.Vector3(-2.25, ely + 2.1, 0.3);
        if (f > 0.05 && f < 0.32) { spk = [-6, 3]; spk2 = [0, 3]; }
        keys.push('el', 'cut'); if (f > 0.5) keys.push('gap');
      } else if (cur === 4) {
        const g1 = ease(clamp(f / 0.35)), g2 = ease(clamp((f - 0.35) / 0.2)), g3 = ease(clamp((f - 0.55) / 0.3));
        elx = lerp(-3, 1, g1); ely = lerp(5.6, -0.5, g1); insert(g2); ely = lerp(ely, -3.5, g3);
        aOn = f < 0.9; A = new THREE.Vector3(elx - 0.75, ely + 2.1, 0.3); B = new THREE.Vector3(elx + 0.75, ely + 2.1, 0.3);
        if (f > 0.38 && f < 0.52) { spk = [0.75, -3.5]; spk2 = [1.25, -3.5]; }
        tsdOn = f > 0.85; keys.push('el', 'gap', 'tgt'); if (f > 0.33 && f < 0.8) keys.push('cap'); if (tsdOn) keys.push('tsd', 'tsd2');
      } else if (cur === 5) {
        rnaOn = true; rnaK = 12 * clamp((f - 0.1) / 0.5); ry = 3 + 2.1 * ease(clamp((f - 0.1) / 0.3)) + 0.8 * ease(clamp((f - 0.65) / 0.3));
        keys.push('el'); if (f > 0.25) keys.push('rna');
      } else if (cur === 6) {
        rnaOn = true; rnaK = 12; const g1 = ease(clamp(f / 0.35)); rx = lerp(-3, 1, g1); ry = lerp(5.9, -1.2, g1);
        rtOn = f > 0.3; keys.push('el', 'tgt');
        if (rtBad) { if (f > 0.4) msg = '❌ Không có RT → RNA không thành DNA → không có bản sao'; if (f > 0.7) rnaOn = false; }
        else {
          const g2 = ease(clamp((f - 0.35) / 0.15)); insert(g2); cpOn = f > 0.45; cpK = Math.round(12 * clamp((f - 0.45) / 0.4)); rnaK = 12 - cpK;
          tsdOn = f > 0.88; if (f > 0.3) keys.push('rt'); if (f > 0.55) keys.push('copy'); if (tsdOn) keys.push('tsd', 'tsd2');
          if (f < 0.6 && f > 0.1) keys.push('rna');
        }
      } else if (cur === 7) {
        keys.push('tgt');
        if (defOff) {
          keys.push('el');
          rnaOn = true; rnaK = 12 * clamp(f / 0.3); const g = ease(clamp((f - 0.35) / 0.3)); rx = lerp(-3, 1, g); ry = lerp(5.9, -1.2, g);
          insert(ease(clamp((f - 0.55) / 0.15))); cpOn = f > 0.65; cpK = Math.round(12 * clamp((f - 0.65) / 0.3)); if (cpOn) rnaOn = cpK < 12; tsdOn = f > 0.95;
          if (f > 0.3) msg = '❌ Không bị khóa → phiên mã → bản sao mới cài vào đích';
        } else {
          kOn = true; k1On = f > 0.3; meK = Math.round(6 * clamp((f - 0.45) / 0.35)); silOp = 0.3 * clamp((f - 0.6) / 0.3);
          keys.push('krab'); if (k1On) keys.push('kap1'); if (f > 0.75) keys.push('silent');
        }
      } else if (cur === 8) {
        midOn = true; keys.push('rna2', 'cdna');
        if (defOff) msg = '❌ Không có APOBEC → cDNA nguyên vẹn → bản sao nhảy được';
        else { apOn = true; apoK = Math.round(7 * clamp((f - 0.2) / 0.6)); keys.push('apo'); }
      } else if (cur === 9) {
        midOn = true; keys.push('rna2');
        if (defOff) msg = '❌ Không có piRNA/PIWI → RNA transposon nguyên vẹn';
        else { piOn = true; pwOn = true; piY = lerp(-3.5, -0.6, ease(clamp(f / 0.4))); cutK = ease(clamp((f - 0.55) / 0.35)); keys.push('piwi'); if (f > 0.6) keys.push('cutR'); }
      }
      if (retro && cur <= 7) keys.push('tgt');
      if (tsg && keys.includes('tgt')) { const hit = (cur === 4 && f > 0.4 && !tnpBad) || (cur === 6 && f > 0.4 && !rtBad) || (cur === 7 && defOff && f > 0.6); setT('tgt', hit ? 'Gene APC bị cắt đôi ✗' : 'Gene APC (ức chế khối u)'); setC('tgt', hit ? 'warn' : 'dim'); }
      else { setT('tgt', 'DNA đích'); setC('tgt', 'dim'); }
      L.get('el').position.y = retro ? 1.7 : -1.9;
      L.get('rna').position.y = cur === 6 ? -0.9 : 0.2;
      L.get('tgt').position.x = tsg ? -2.6 : -1.6;
      setT('el', !retro ? 'DNA transposon (Tn5)' : cur <= 6 ? 'L1: bản gốc vẫn ở lại' : 'Retrotransposon (L1)');
      if (msg) { L.get('msg').position.set(cur >= 8 ? -3 : -1, cur >= 8 ? -2.3 : 6.3, 0); setT('msg', msg); keys.push('msg'); }
      // ---- apply ----
      const k = snap ? 1 : 1 - Math.exp(-dt * 7);
      T.el.set(elx, ely, 0); gEl.position.lerp(T.el, k);
      gTL.position.x += (tlx - gTL.position.x) * k; gTR.position.x += (trx - gTR.position.x) * k;
      gCp.visible = cpOn; showCount(cp, cpK);
      tsdL.visible = tsdR.visible = tsdOn;
      for (let i = 0; i < 6; i++) methyls[i].visible = i < meK;
      silent.visible = silOp > 0.01; silent.material.opacity = silOp;
      gR.visible = rnaOn; T.r.set(rx, ry, 0); gR.position.lerp(T.r, snap ? 1 : 1 - Math.exp(-dt * 5)); rna.setCount(rnaK, snap ? 1 : dt);
      vis(tnA, aOn); vis(tnB, aOn); tnA.position.lerp(aOn ? A : OFF, k); tnB.position.lerp(aOn ? B : OFF, k);
      if (aOn) { follow('tnp', tnA, 1.2); }
      tethA.visible = tethB.visible = aOn && tnA.position.distanceTo(A) < 3;
      if (tethA.visible) { e1.set(gEl.position.x - 2.6, gEl.position.y + 0.4, 0); e2.set(gEl.position.x + 2.6, gEl.position.y + 0.4, 0); api.setStick(tethA, e1, tnA.position); api.setStick(tethB, e2, tnB.position); }
      vis(rt, rtOn && !rtBad); rt.position.lerp(rtOn && !rtBad ? v.set(1, -1.6, 1.2) : OFF, k); follow('rt', rt, 1.3);
      vis(krab, kOn); krab.position.lerp(kOn ? v.set(-6.0, 2.3, 1.2) : OFF, k); L.get('krab').position.set(-6.0, 1.1, 1.2);
      vis(kap1, k1On); kap1.position.lerp(k1On ? v.set(-1.0, 4.7, 0.8) : OFF, k); L.get('kap1').position.set(-1.0, 5.9, 0.8);
      gM.visible = midOn; gDL.visible = gEl.visible = gDR.visible = gTL.visible = gTR.visible = !midOn;
      cdna.items.forEach((it, i) => { const isC = CD[i] === 'C'; const ci = CD.slice(0, i + 1).split('C').length - 1; it.base.material.color.setHex(isC && ci <= apoK ? C.U : C[CD[i]]); });
      vis(apo, apOn); const ai = Math.min(11, Math.max(0, [...CD].reduce((a, c, i) => (c === 'C' && CD.slice(0, i + 1).split('C').length - 1 <= apoK ? i : a), 0)));
      apo.position.lerp(apOn ? v.set(-3 + cdna.xOf(ai), -1.5, 1.0) : OFF, k); follow('apo', apo, -1.2);
      cdna.group.visible = cur === 8;
      gP.visible = piOn; gP.position.y += (piY - gP.position.y) * k;
      vis(piwi, pwOn); piwi.position.lerp(pwOn ? v.set(-3.5, gP.position.y - 0.1, -0.9) : OFF, k); follow('piwi', piwi, -1.4);
      rna2.items.forEach((it, i) => { const side = i <= 4 ? -1 : 1; it.n.position.x = rnaX0[i] + side * 1.2 * cutK; it.n.position.y = 0.9 + 0.6 * cutK * (side < 0 ? 1 : -0.3); it.sug.material.opacity = it.base.material.opacity = it.ph.material.opacity = 1 - 0.6 * cutK; });
      rna2.bb.visible = cutK < 0.05;
      for (const [s, p] of [[spark, spk], [spark2, spk2]]) { s.visible = !!p; if (p) { s.position.set(p[0], p[1], 0.6); s.scale.setScalar(0.8 + 0.5 * Math.sin(t * 25)); } }
      show(keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; ph.snap(0, 1); sig = '';
        recolor(el, s >= 5 ? COL.re1 : COL.tn1, s >= 5 ? COL.re2 : COL.tn2); frameM.material.color.setHex(s >= 5 ? COL.re1 : COL.tn1);
        tg.tnp.el.style.display = s >= 1 && s <= 4 ? '' : 'none';
        tg.rt.el.style.display = s === 6 ? '' : 'none';
        tg.tsg.el.style.display = s === 4 || s === 6 || s === 7 ? '' : 'none';
        tg.def.el.style.display = s >= 7 ? '' : 'none';
        // snap starting positions for the step
        const startEl = { 3: [-3, 3.5], 4: [-3, 5.6] }[s] || [-3, 3];
        gEl.position.set(startEl[0], startEl[1], 0);
        if (s === 6) { gR.position.set(-3, 5.9, 0); rna.setCount(12, 1); }
        if (s === 5 || (s === 7 && defOff)) { gR.position.set(-3, 3, 0); rna.setCount(0, 1); }
        api.camera(...CAMS[s]);
        readout();
        frame(0, 0, true);
      },
      update(dt, t) { ph.tick(dt); frame(dt, t, false); },
    };
    readout();
    return ctl;
  },
};
