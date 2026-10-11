// Bài 15: Epigenetic nhân sơ. Hệ R-M chống phage, EcoRI & đầu dính, Dam trong sửa bắt cặp sai, SeqA ở oriC, biến đổi pha.
import { labels } from './_kit.js';

export default {
  title: 'Epigenetic nhân sơ: hệ R-M, Dam & biến đổi pha',
  sub: 'Vi khuẩn không có histone, nhưng vẫn dùng nhóm methyl gắn lên DNA như một "con dấu" để nhận ra DNA của mình, phân biệt mạch cũ với mạch mới, và bật/tắt gene theo kiểu di truyền được.',
  legend: '<span><i style="background:#5b8def"></i>DNA vi khuẩn</span><span><i style="background:#c792ea"></i>DNA phage</span><span><i style="background:#ff3b30"></i>nhóm methyl (m⁶A)</span><span><i style="background:#ffd60a"></i>vị trí nhận biết</span><span><i style="background:#2bb3a3"></i>MTase / enzyme sửa</span><span><i style="background:#ff9f0a"></i>REase (kéo cắt)</span><span>· sơ đồ rút gọn</span>',

  why: `<p>Ở nhân sơ, <b>methyl hóa DNA</b> là "con dấu" gắn lên base (chủ yếu adenine thành <b>N6-methyladenine, m⁶A</b>; đôi khi cytosine). Con dấu này không đổi trình tự nhưng thay đổi cách protein "đọc" DNA. Nó làm 3 việc:</p>
  <ul><li><b>Phân biệt "ta" và "địch"</b>: hệ <b>R-M</b> (restriction–modification) methyl hóa DNA của chính vi khuẩn. DNA phage lạ chưa có dấu thì bị enzyme cắt giới hạn chặt vụn.</li>
  <li><b>Phân biệt mạch cũ và mạch mới</b>: <b>Dam</b> methyl hóa A ở <b>GATC</b>. Ngay sau sao chép, mạch mới chưa có dấu, nên hệ sửa bắt cặp sai biết phải sửa mạch nào, và SeqA biết oriC vừa mới sao chép xong.</li>
  <li><b>Bật/tắt gene di truyền được</b>: Dam cạnh tranh với repressor ở vùng điều hòa, tạo <b>biến đổi pha</b> (phase variation).</li></ul>`,

  without: `<ul>
  <li><b>Mất MTase nhưng còn REase</b>: REase cắt luôn DNA của chính vi khuẩn ở mọi vị trí nhận biết, nên tế bào chết. Vì vậy gene MTase và REase luôn đi thành cặp.</li>
  <li><b>Phage đã được methyl hóa sẵn</b> (vì nó vừa nhân lên trong một vi khuẩn cùng hệ R-M): REase coi nó là "ta", không cắt. Phage thoát và nhân lên.</li>
  <li><b>Mất Dam (dam⁻)</b>: hệ sửa bắt cặp sai không phân biệt được mạch, có thể sửa nhầm mạch cũ, nên đột biến tăng (kiểu hình mutator). Khởi đầu sao chép ở oriC mất đồng bộ. Gene pap bị khóa ở pha TẮT.</li></ul>
  <div class="box info">👉 Bật <b>💥 Không có MTase</b> ở bước 4 để thấy vi khuẩn tự cắt DNA mình. Bật <b>Phage đã methyl hóa sẵn</b> để thấy phage thoát. Bật <b>💥 dam⁻</b> ở các bước 7, 8, 9.</div>`,

  foundation: [
    { q: 'Methyl hóa DNA là gì?', a: 'Là gắn một nhóm <b>methyl (–CH₃)</b> vào một base, bằng enzyme <b>methyltransferase (MTase)</b>, với chất cho methyl là SAM. Trình tự <b>không đổi</b> (A vẫn bắt cặp với T), nhưng nhóm methyl thò ra rãnh lớn của DNA, nên protein bám DNA "nhìn thấy" và phản ứng khác đi.' },
    { q: 'Ở nhân sơ thì base nào bị methyl hóa?', a: 'Chủ yếu <b>adenine</b> thành N6-methyladenine (Dam, CcrM, ModA13, SpnD39III). Một số MTase methyl hóa <b>cytosine</b> (Dcm, JHP1050, M2.HpyAII). Khác với động vật có vú, nơi methyl hóa chủ yếu ở C trong CpG.' },
    { q: 'Vị trí nhận biết (recognition site) là gì?', a: 'Một đoạn ngắn 4–8 bp mà enzyme nhận ra. Thường là <b>palindrome</b>: đọc 5′→3′ trên hai mạch giống nhau. Ví dụ <b>EcoRI: GAATTC</b>, mạch kia đọc 5′→3′ cũng là GAATTC. <b>Dam: GATC</b>, cũng là palindrome.' },
    { q: 'Enzyme cắt giới hạn (REase) là gì?', a: 'Là enzyme <b>cắt cả hai mạch DNA</b> ngay tại (hoặc gần) vị trí nhận biết. Gọi là "giới hạn" (restriction) vì nó <b>giới hạn</b> khả năng phage lây nhiễm vi khuẩn. REase <b>không cắt</b> được vị trí đã bị methyl hóa.' },
    { q: 'Phage là gì?', a: '<b>Bacteriophage</b> là virus lây nhiễm vi khuẩn. Nó bám lên vỏ tế bào và <b>tiêm DNA</b> của nó vào bên trong, bắt vi khuẩn sao chép DNA phage và tạo phage mới, rồi làm tan tế bào.' },
    { q: 'Bán methyl hóa (hemimethylated) là gì?', a: 'Sao chép DNA là <b>bán bảo tồn</b>: mỗi DNA con có 1 mạch cũ (đã có dấu methyl) và 1 mạch mới (chưa có). Trong vài phút sau sao chép, GATC chỉ có methyl ở mạch cũ. Đây chính là "cửa sổ thời gian" để tế bào biết mạch nào là mới.' },
    { q: 'Sửa bắt cặp sai (mismatch repair) cần gì?', a: 'Khi Pol III gắn nhầm (ví dụ G đối diện T), protein <b>MutS</b> nhận ra chỗ sai, <b>MutL</b> kết nối, <b>MutH</b> rạch (nick) mạch <b>chưa methyl hóa</b> ở GATC gần nhất. Đoạn mạch mới đó bị cắt bỏ và tổng hợp lại. Nếu không biết mạch nào mới, hệ có thể sửa nhầm vào mạch cũ (đúng) và giữ lại lỗi.' },
    { q: 'Biến đổi pha (phase variation) là gì?', a: 'Là hiện tượng trong <b>cùng một quần thể</b> vi khuẩn giống hệt nhau về gene, một số tế bào <b>bật</b> một gene (ví dụ gene lông bám pili), số khác <b>tắt</b>. Mỗi trạng thái được giữ qua nhiều thế hệ, thỉnh thoảng mới đảo. Lợi ích: quần thể luôn có một phần "ngụy trang" khác, nên khó bị hệ miễn dịch tiêu diệt hết.' },
  ],

  steps: [
    { title: 'Một cặp enzyme cùng nhận một vị trí', text: 'Trong vi khuẩn có hệ <b>R-M</b>: <b>MTase</b> (xanh ngọc) và <b>REase</b> (cây kéo cam) cùng nhận <b>một trình tự</b>, ví dụ <b>GAATTC</b> (dải vàng trên DNA xanh). Một bên gắn dấu bảo vệ, một bên cắt chỗ không có dấu.' },
    { title: 'MTase gắn methyl lên DNA của chính mình', text: 'MTase chạy dọc nhiễm sắc thể và gắn methyl (chấm đỏ) lên A ở <b>cả hai mạch</b> của mỗi GAATTC. Từ giờ REase không cắt được các vị trí này nữa: DNA vi khuẩn đã được "đóng dấu ta". Bật <b>💥 Không có MTase</b>: các vị trí vẫn trắng.' },
    { title: 'Phage tiêm DNA lạ vào', text: 'Phage (đầu đa diện, đuôi) bám lên vỏ và <b>tiêm DNA</b> (màu tím) vào tế bào. DNA phage cũng chứa GAATTC, nhưng <b>không có dấu methyl</b> của vi khuẩn này (trừ khi bật <b>Phage đã methyl hóa sẵn</b>).' },
    { title: 'REase cắt DNA phage: vi khuẩn thắng', text: 'REase tìm đến các GAATTC <b>chưa methyl hóa</b> trên DNA phage và <b>cắt cả hai mạch</b>. DNA phage vỡ thành mảnh, bị nuclease phân hủy, phage không nhân lên được. DNA vi khuẩn có dấu nên an toàn. Thử 2 công tắc: <b>💥 Không có MTase</b> thì REase cắt luôn DNA vi khuẩn. <b>Phage đã methyl hóa sẵn</b> thì phage thoát và nhân lên.' },
    { title: 'EcoRI cắt so le: G↓AATTC tạo đầu dính', text: 'Phóng to một vị trí <b>GAATTC</b>. EcoRI cắt mạch trên giữa <b>G và A</b>, mạch dưới cũng giữa G và A (đọc 5′→3′), nên hai vết cắt <b>lệch nhau 4 nucleotide</b>. Khi tách ra, mỗi đầu có <b>đoạn đơn 5′-AATT</b> thò ra: <b>đầu dính</b> (sticky end), vì AATT bổ sung với AATT.' },
    { title: 'Ứng dụng: ghép gene (cloning) bằng đầu dính', text: 'Cắt <b>vector</b> (plasmid, xanh) và <b>gene ngoại lai</b> (cam) bằng <b>cùng EcoRI</b>, nên chúng có đầu dính khớp nhau. Đoạn gene trượt vào, các base AATT bắt cặp. Sau đó <b>DNA ligase</b> (xanh ngọc) hàn 2 khe hở (nick) trên khung đường–phosphate. Kết quả là plasmid tái tổ hợp.' },
    { title: 'Dam đánh dấu mạch cũ: sửa bắt cặp sai đúng mạch', text: 'Ngay sau sao chép, GATC chỉ có methyl ở <b>mạch cũ</b> (trên). Có một chỗ <b>bắt cặp sai</b> (chấm đỏ, mạch mới). <b>MutS</b> nhận ra chỗ sai, <b>MutL</b> kết nối, <b>MutH</b> rạch mạch <b>chưa methyl hóa</b> ở GATC gần nhất. Đoạn mạch mới bị cắt bỏ rồi tổng hợp lại đúng. Bật <b>💥 dam⁻</b>: không mạch nào có dấu, hệ có thể sửa nhầm mạch cũ.' },
    { title: 'Dam và SeqA ở oriC: mỗi chu kỳ chỉ khởi đầu 1 lần', text: '<b>oriC</b> của <i>E. coli</i> có <b>11 vị trí GATC</b> trong khoảng 245 bp. Vừa sao chép xong, chúng ở trạng thái <b>bán methyl hóa</b>. Protein <b>SeqA</b> (xanh nhạt) bám vào và "giam" oriC khoảng 1/3 chu kỳ, nên <b>DnaA</b> (cam) không khởi đầu lại được. Bật <b>💥 dam⁻</b>: không có SeqA giữ, DnaA khởi đầu lại sớm và mất đồng bộ.' },
    { title: 'Biến đổi pha: Dam đấu với repressor ở GATC', text: 'Hai vi khuẩn cùng gene. <b>Trái</b>: Dam methyl hóa GATC ở vùng điều hòa trước, repressor (Lrp, tím) <b>không bám được</b>, gene lông bám <b>BẬT</b>, tế bào mọc pili. <b>Phải</b>: repressor bám trước và <b>che GATC</b>, Dam không methyl hóa được, gene <b>TẮT</b>. Trạng thái được giữ qua nhiều thế hệ. Bật <b>💥 dam⁻</b>: cả hai đều khóa TẮT.' },
  ],

  application: `<ul>
  <li><b>Enzyme cắt giới hạn là "kéo" của công nghệ gene:</b> EcoRI, BamHI (G↓GATCC), HindIII (A↓AGCTT) cắt vector và gene tạo đầu dính khớp nhau, rồi DNA ligase nối lại để tạo DNA tái tổ hợp (ví dụ sản xuất insulin người trong <i>E. coli</i>).</li>
  <li><b>DpnI trong gây đột biến định hướng:</b> DpnI chỉ cắt GATC <b>đã methyl hóa</b>. Sau khi PCR khuếch đại plasmid đột biến (sản phẩm PCR không có methyl), xử lý DpnI để phá plasmid khuôn gốc (có dấu Dam vì lấy từ <i>E. coli</i>), chỉ giữ lại bản đột biến.</li>
  <li><b>Chủng dam⁻/dcm⁻:</b> một số enzyme (ví dụ XbaI, ClaI) bị chặn nếu vị trí của chúng chồng lên GATC đã methyl hóa. Muốn cắt, phải nhân plasmid trong chủng <i>E. coli</i> dam⁻.</li>
  <li><b>Rào cản biến nạp:</b> hệ R-M của vi khuẩn đích cắt DNA lạ đưa vào, nên nhiều chủng vi khuẩn rất khó biến nạp. Nhà nghiên cứu methyl hóa trước DNA để "qua mặt" hệ R-M.</li>
  <li><b>Liệu pháp phage:</b> hệ R-M là một lý do phage chỉ diệt được một số chủng; phải chọn phage phù hợp từng chủng vi khuẩn gây bệnh.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>REase (enzyme cắt giới hạn)</th><th>MTase của hệ R-M</th><th>MTase "mồ côi" (Dam, CcrM)</th></tr>
  <tr><td>Làm gì</td><td><b>Cắt</b> 2 mạch tại vị trí nhận biết <b>chưa methyl hóa</b></td><td><b>Gắn methyl</b> lên cùng vị trí trên DNA của mình</td><td>Gắn methyl, <b>không có REase đi kèm</b></td></tr>
  <tr><td>Mục đích</td><td>Phá DNA lạ (phage)</td><td>Bảo vệ DNA của mình</td><td>Điều hòa: sửa sai, oriC, biến đổi pha, chu kỳ tế bào</td></tr>
  <tr><td>Ví dụ</td><td>EcoRI (G↓AATTC)</td><td>EcoRI methylase (GAm⁶ATTC)</td><td>Dam (GATC, A), CcrM (GANTC, ở <i>Caulobacter</i>)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Nhân sơ</th><th>Nhân thực (động vật có vú)</th></tr>
  <tr><td>Base bị methyl hóa</td><td>Chủ yếu <b>adenine</b> (m⁶A), một số cytosine</td><td>Chủ yếu <b>cytosine ở CpG</b> (5mC)</td></tr>
  <tr><td>Enzyme</td><td>Dam, CcrM, Dcm, MTase của hệ R-M</td><td>DNMT1, DNMT3a/3b</td></tr>
  <tr><td>Methyl hóa ở vùng điều hòa thì</td><td>Có thể <b>BẬT</b> (Dam thắng repressor) hoặc tắt, tùy gene</td><td>Thường <b>TẮT</b> promoter</td></tr>
  <tr><td>Tầng khác</td><td>Không histone, không nucleosome</td><td>Biến đổi histone, chromatin, lncRNA</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cạnh tranh ở GATC</th><th>Dam thắng</th><th>Repressor thắng</th></tr>
  <tr><td>Chuyện gì xảy ra</td><td>GATC được methyl hóa trước</td><td>Repressor bám trước, che GATC</td></tr>
  <tr><td>Hệ quả</td><td>Repressor <b>không bám được</b>, gene <b>BẬT</b></td><td>Dam không với tới, gene <b>TẮT</b></td></tr>
  </table></div>
  <div class="box info">ℹ️ Mô hình "Dam vs repressor" là bản rút gọn của bài giảng. Ở operon <b>pap</b> thật có <b>2 vị trí GATC</b>, và protein Lrp cùng PapI quyết định vị trí nào được che, vị trí nào được methyl hóa. Ý chính để đi thi vẫn đúng: <b>ai đến trước</b> quyết định BẬT hay TẮT, và trạng thái được giữ qua thế hệ. Chủng dam⁻ bị khóa ở pha TẮT.</div>
  <div class="box warn">⚠️ Đừng nhầm các enzyme cùng nhận <b>GATC</b>: <b>DpnI</b> chỉ cắt GATC <b>đã</b> methyl hóa (ngược với REase của hệ R-M). <b>MboI</b> bị methyl hóa Dam <b>chặn</b>. <b>Sau3AI</b> cắt được cả hai. Và Dam methyl hóa <b>A</b> (m⁶A), còn Dcm methyl hóa <b>C</b> ở CCWGG.</div>`,

  traps: [
    { trap: '"Methyl hóa DNA lúc nào cũng làm TẮT gene."', truth: 'Đúng phần lớn ở promoter nhân thực, nhưng ở nhân sơ, khi <b>Dam thắng</b> repressor ở GATC thì repressor không bám được, gene <b>BẬT</b>. Phải xem nhóm methyl cản protein nào.' },
    { trap: '"REase cắt DNA của chính vi khuẩn đã methyl hóa."', truth: 'REase chỉ cắt vị trí nhận biết <b>chưa methyl hóa</b>, tức DNA lạ. DNA của vi khuẩn được MTase cùng hệ bảo vệ.' },
    { trap: '"Dam là một phần của hệ R-M, đi kèm một enzyme cắt."', truth: 'Dam là <b>MTase mồ côi</b> (orphan): không có REase đi kèm. Nó dùng cho điều hòa (sửa sai, oriC, biến đổi pha), không phải chống phage.' },
    { trap: '"Hệ sửa bắt cặp sai cắt mạch đã methyl hóa."', truth: 'MutH rạch mạch <b>chưa methyl hóa</b>, tức <b>mạch mới</b>, vì lỗi sao chép nằm ở mạch mới. Mạch cũ (có dấu Dam) được coi là khuôn đúng.' },
    { trap: '"Nhân sơ methyl hóa C ở CpG giống người."', truth: 'Nhân sơ chủ yếu methyl hóa <b>adenine</b> (Dam ở GATC). Có Dcm methyl hóa C, nhưng ở CCWGG, không phải "CpG islands".' },
    { trap: '"EcoRI cắt thẳng giữa vị trí, tạo đầu bằng."', truth: 'EcoRI cắt <b>so le</b> G↓AATTC, tạo đầu dính <b>5′-AATT</b> dài 4 nt. Enzyme tạo đầu bằng là loại khác (ví dụ SmaI: CCC↓GGG).' },
    { trap: '"Biến đổi pha là do đột biến trình tự."', truth: 'Trong cơ chế Dam/repressor, trình tự <b>không đổi</b>. Chỉ trạng thái methyl hóa đổi, và được giữ qua thế hệ. Đó là epigenetic.' },
    { trap: '"Phage nào cũng bị hệ R-M tiêu diệt."', truth: 'Phage đã được <b>methyl hóa sẵn</b> (vừa nhân lên trong vi khuẩn có cùng hệ R-M), hoặc DNA không có vị trí nhận biết, sẽ thoát.' },
  ],

  quiz: [
    { q: 'Trong hệ R-M, REase cắt:', ops: ['DNA vi khuẩn đã methyl hóa', 'DNA lạ chưa methyl hóa tại vị trí nhận biết', 'Mọi DNA', 'Chỉ RNA'], a: 1, e: 'REase cắt vị trí nhận biết chưa có dấu methyl, tức DNA phage. DNA vi khuẩn đã được MTase cùng hệ methyl hóa nên an toàn. "Mọi DNA" thì vi khuẩn tự sát.' },
    { q: 'Khi Dam methyl hóa vị trí GATC ở vùng điều hòa trước repressor, gene sẽ:', ops: ['Bật', 'Tắt', 'Bị đột biến', 'Bị cắt bỏ'], a: 0, e: 'Nhóm methyl cản repressor bám, nên gene BẬT. Đây là bẫy kinh điển vì sinh viên quen "methyl hóa = tắt" từ nhân thực.' },
    { q: 'Một vi khuẩn bị mất gene MTase nhưng vẫn còn gene REase của cùng hệ R-M. Hậu quả:', ops: ['Kháng phage tốt hơn', 'Không có gì thay đổi', 'REase cắt luôn DNA của chính nó, tế bào chết', 'DNA được methyl hóa gấp đôi'], a: 2, e: 'Không có MTase thì DNA của vi khuẩn không có dấu, REase coi nó là DNA lạ và cắt. Không phải "kháng phage tốt hơn": REase cắt cả DNA mình.' },
    { q: 'Hệ sửa bắt cặp sai ở E. coli biết mạch nào là mạch mới nhờ:', ops: ['Mạch mới dài hơn', 'Mạch mới có uracil', 'Mạch mới có histone', 'Mạch mới chưa được Dam methyl hóa ở GATC'], a: 3, e: 'Ngay sau sao chép, chỉ mạch cũ có methyl ở GATC. MutH rạch mạch chưa methyl hóa. Vi khuẩn không có histone; uracil là dấu hiệu khác (sửa cắt base).' },
    { q: 'EcoRI nhận GAATTC và cắt G↓AATTC. Đầu tạo ra là:', ops: ['Đầu bằng', 'Đầu dính 3′-TTAA', 'Đầu dính 5′-AATT', 'Không cắt'], a: 2, e: 'Cắt so le giữa G và A trên cả 2 mạch, mỗi đầu thò ra đoạn 5′-AATT. Đầu bằng là của enzyme cắt thẳng như SmaI.' },
    { q: 'Vai trò của SeqA tại oriC là:', ops: ['Bám oriC bán methyl hóa, ngăn khởi đầu sao chép lại ngay', 'Mở xoắn DNA', 'Tổng hợp primer', 'Cắt DNA phage'], a: 0, e: 'SeqA nhận ra GATC bán methyl hóa vừa sao chép, "giam" oriC để mỗi chu kỳ chỉ khởi đầu 1 lần. Mở xoắn là việc của DnaB helicase.' },
    { q: 'Một phage vừa nhân lên trong vi khuẩn chủng A (có hệ R-M X) rồi lây sang vi khuẩn chủng B cũng có hệ R-M X. Khả năng cao nhất:', ops: ['Phage bị cắt vụn', 'Phage biến thành plasmid', 'Vi khuẩn B tự cắt DNA mình', 'Phage thoát vì DNA đã mang dấu methyl của hệ X'], a: 3, e: 'Trong chủng A, MTase X đã methyl hóa luôn DNA phage. Sang chủng B cùng hệ X, REase thấy dấu "ta" nên không cắt. Nếu B có hệ R-M khác, phage mới bị cắt.' },
  ],

  recall: [
    'Vẽ tay lại hệ R-M: vi khuẩn có DNA đã methyl hóa ở GAATTC, phage tiêm DNA chưa methyl hóa, REase cắt DNA phage. Vẽ thêm 2 trường hợp: mất MTase, và phage đã methyl hóa sẵn.',
    'Vẽ tay lại vị trí GAATTC trên 2 mạch, đánh dấu vết cắt so le và đầu dính 5′-AATT. Giải thích vì sao 2 đầu dính ghép lại được.',
    'Giải thích bằng lời: (1) Dam giúp sửa bắt cặp sai thế nào; (2) SeqA ở oriC; (3) Dam vs repressor khi nào gene bật, khi nào tắt.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const SITE = 0xffd60a, PHAGE = 0xc792ea, NEW = 0xffc2d0, RE = 0xff9f0a, WHITE = 0xffffff;
    const dotG = new THREE.SphereGeometry(0.17, 12, 8);

    // ---------- helpers ----------
    // duplex segment centred on its group origin
    const seg = (parent, len, c1, c2, gap = 0.7) => {
      const g = api.group(parent);
      const t = api.box(len, 0.14, 0.14, c1, g); t.position.y = gap / 2;
      const b = api.box(len, 0.14, 0.14, c2, g); b.position.y = -gap / 2;
      const rm = api.mat(0xcfd8dc), rg = new THREE.BoxGeometry(0.07, gap - 0.12, 0.07);
      const n = Math.max(1, Math.round(len / 0.45));
      for (let k = 0; k < n; k++) { const r = new THREE.Mesh(rg, rm); r.position.x = -len / 2 + (k + 0.5) * len / n; g.add(r); }
      g.userData = { top: t, bot: b };
      return g;
    };
    // recognition-site marker: yellow band + methyl dot on each strand
    const site = (parent, gap = 0.7) => {
      const g = api.group(parent);
      api.box(0.42, gap + 0.25, 0.3, SITE, g, { opacity: 0.85 });
      const top = new THREE.Mesh(dotG, api.mat(WHITE)); top.position.set(0, gap / 2 + 0.3, 0.12); g.add(top);
      const bot = new THREE.Mesh(dotG, api.mat(WHITE)); bot.position.set(0, -gap / 2 - 0.3, 0.12); g.add(bot);
      g.userData = { top, bot };
      return g;
    };
    const setMe = (st, top, bot) => { st.userData.top.material.color.set(top ? C.methyl : WHITE); st.userData.bot.material.color.set(bot ? C.methyl : WHITE); };
    const scissors = (parent) => {
      const g = api.group(parent);
      const a = api.box(1.3, 0.22, 0.22, RE, g), b = api.box(1.3, 0.22, 0.22, RE, g);
      const ra = api.torus(0.22, 0.06, RE, g), rb = api.torus(0.22, 0.06, RE, g);
      g.userData = { a, b, ra, rb };
      return g;
    };
    const snip = (sc, t) => { const o = 0.35 + 0.3 * Math.sin(t * 9); const { a, b, ra, rb } = sc.userData; a.rotation.z = o; b.rotation.z = -o; ra.position.set(-0.75 * Math.cos(o), -0.75 * Math.sin(o), 0); rb.position.set(-0.75 * Math.cos(o), 0.75 * Math.sin(o), 0); };
    const capsule = (parent, r, len, op = 0.13) => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 28), api.mat(C.good, { opacity: op, depthWrite: false, side: THREE.DoubleSide }));
      m.rotation.z = Math.PI / 2; parent.add(m); return m;
    };

    // ================= gRM: restriction–modification =================
    const gRM = api.group();
    capsule(gRM, 4.4, 18).position.y = -0.4;
    const HOST_Y = 1.3, PH_Y = -2.2;
    const hostX = [-9, -4.5, 0, 4.5, 9];               // segment boundaries
    const hostSegs = [], hostSites = [];
    for (let i = 0; i < 4; i++) { const len = hostX[i + 1] - hostX[i] - 0.45; const s = seg(gRM, len, C.dna1, C.dna2); s.userData.home = new THREE.Vector3((hostX[i] + hostX[i + 1]) / 2, HOST_Y, 0); s.position.copy(s.userData.home); hostSegs.push(s); }
    for (let i = 1; i < 4; i++) { const st = site(gRM); st.position.set(hostX[i], HOST_Y, 0); hostSites.push(st); }
    const phX = [-1.5, 2, 5.5, 9];
    const phSegs = [], phSites = [];
    for (let i = 0; i < 3; i++) { const len = phX[i + 1] - phX[i] - 0.45; const s = seg(gRM, len, PHAGE, 0xa678d6); s.userData.home = new THREE.Vector3((phX[i] + phX[i + 1]) / 2, PH_Y, 0); phSegs.push(s); }
    for (let i = 1; i < 3; i++) { const st = site(gRM); st.userData.home = new THREE.Vector3(phX[i], PH_Y, 0); phSites.push(st); }
    // phage particle: tail tip sits on the envelope
    const phage = api.group(gRM); phage.position.set(6.5, 4.0, 0);
    const icoG = new THREE.IcosahedronGeometry(1.1, 0);
    const head = new THREE.Mesh(icoG, api.mat(0xb8c2cc, { flatShading: true })); head.position.y = 3.4; phage.add(head);
    api.cylinder(0.22, 0.22, 2.3, 0x8e99a4, phage).position.y = 1.15;
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.6; api.stick(new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(Math.cos(a) * 1.1, -0.45, Math.sin(a) * 0.7), 0.04, 0x8e99a4, phage); }
    const ENTRY = new THREE.Vector3(6.5, 3.6, 0);
    const progeny = []; for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(icoG, api.mat(0xb8c2cc, { flatShading: true })); m.scale.setScalar(0.001); m.position.set(-6 + k * 2.1, -0.4 + (k % 2 ? 1.6 : -1.6) * 0.0 + (k % 3 - 1) * 1.2, 1.5); gRM.add(m); progeny.push(m); }
    const mtase = api.blob(0.65, C.enzyme, gRM, { mat: { opacity: 0.95 }, seed: 3 });
    const rease = scissors(gRM);
    L.add('mt', 'MTase: gắn methyl', [0, 1.0, 0], mtase, 'good');
    L.add('re', 'REase: cắt chỗ chưa methyl', [0, 1.0, 0], rease, 'warn');
    L.add('siteL', 'GAATTC', [hostX[2], HOST_Y - 1.0, 0], gRM, 'big');
    L.add('hostL', 'DNA vi khuẩn', [-6.7, HOST_Y - 1.0, 0], gRM, 'dim');
    L.add('phL', 'DNA phage (chưa methyl)', [3.5, PH_Y - 1.2, 0], gRM, 'dim');
    L.add('phMe', 'DNA phage (đã methyl sẵn)', [3.5, PH_Y - 1.2, 0], gRM, 'warn');
    L.add('phage', 'phage tiêm DNA', [8.6, 7.6, 0], gRM, 'tag');
    L.add('cutPh', '✂️ DNA phage bị cắt vụn → vi khuẩn sống', [0, -6.0, 0], gRM, 'good');
    L.add('escape', '⚠️ phage thoát, nhân lên → tan tế bào', [0, -6.0, 0], gRM, 'warn');
    L.add('self', '💀 không MTase: REase cắt DNA mình → chết', [0, 5.3, 0], gRM, 'warn');

    // ================= gEco: EcoRI sticky ends =================
    const gEco = api.group();
    const TOP = 'ATGAATTCAT', BOT = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const NB = TOP.length, dx = 0.9, xb = (i) => (i - (NB - 1) / 2) * dx;
    const baseG = new THREE.BoxGeometry(0.62, 0.46, 0.4), bbG = new THREE.BoxGeometry(dx, 0.16, 0.16), hbG = new THREE.BoxGeometry(0.07, 0.2, 0.07);
    // a half-molecule: list of top indices + bottom indices, own backbone colour
    const half = (topIdx, botIdx, bbTop, bbBot) => {
      const g = api.group(gEco); const bm1 = api.mat(bbTop), bm2 = api.mat(bbBot); const ecoLabels = g.userData.labels = [];
      topIdx.forEach(i => { const b = new THREE.Mesh(baseG, api.mat(C[TOP[i]])); b.position.set(xb(i), 0.35, 0); g.add(b); const bb = new THREE.Mesh(bbG, bm1); bb.position.set(xb(i), 0.8, 0); g.add(bb); if (i >= 2 && i <= 7) ecoLabels.push(api.label(TOP[i], [0, 0.55, 0.25], b, 'plain')); });
      botIdx.forEach(i => { const c = BOT[TOP[i]]; const b = new THREE.Mesh(baseG, api.mat(C[c])); b.position.set(xb(i), -0.35, 0); g.add(b); const bb = new THREE.Mesh(bbG, bm2); bb.position.set(xb(i), -0.8, 0); g.add(bb); if (i >= 2 && i <= 7) ecoLabels.push(api.label(c, [0, -0.55, 0.25], b, 'plain')); });
      return g;
    };
    const showEco = (h, on) => h.userData.labels.forEach(l => api.showLabel(l, on));
    const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
    const leftH = half(range(0, 2), range(0, 6), C.dna1, C.dna2);
    const rightH = half(range(3, 9), range(7, 9), C.dna1, C.dna2);
    const insH = half(range(3, 9), range(7, 9), C.rna, 0xffb870);
    const hbs = []; const hbM = api.mat(WHITE, { opacity: 0.85 });
    for (let i = 0; i < NB; i++) { const h = new THREE.Mesh(hbG, hbM); h.position.set(xb(i), 0, 0); gEco.add(h); hbs.push(h); }
    const cutLine = api.group(gEco);
    { const xa = (xb(2) + xb(3)) / 2, xc = (xb(6) + xb(7)) / 2, P = (x, y) => new THREE.Vector3(x, y, 0.3);
      [[P(xa, 1.3), P(xa, 0)], [P(xa, 0), P(xc, 0)], [P(xc, 0), P(xc, -1.3)]].forEach(([a, b]) => api.stick(a, b, 0.05, C.bad, cutLine)); }
    const ecoEnz = api.group(gEco); api.blob(0.75, RE, ecoEnz, { mat: { opacity: 0.55 }, seed: 5 }).position.x = -0.6; api.blob(0.75, RE, ecoEnz, { mat: { opacity: 0.55 }, seed: 6 }).position.x = 0.6;
    const ligase = api.blob(0.45, C.enzyme, gEco, { mat: { opacity: 0.95 }, seed: 8 });
    const spark = api.sphere(0.28, 0xffffff, gEco, { emissive: 0xffffaa, emissiveIntensity: 1 });
    L.add('eco', 'EcoRI: G↓AATTC', [0, 2.6, 0], gEco, 'big');
    L.add('stL', 'đầu dính 5′-AATT', [-2.2, -1.8, 0], gEco, 'good');
    L.add('stR', 'đầu dính 5′-AATT', [2.2, 1.8, 0], gEco, 'good');
    L.add('vec', 'vector (plasmid)', [-3.5, 1.7, 0], gEco, 'dim');
    L.add('ins', 'gene ngoại lai (cũng cắt EcoRI)', [3.5, -1.7, 0], gEco, 'tag');
    L.add('lig', 'DNA ligase hàn 2 nick', [0, 2.6, 0], gEco, 'good');
    L.add('p5', '5′', [xb(0) - 0.8, 0.8, 0], gEco, 'dim'); L.add('p3', '3′', [xb(0) - 0.8, -0.8, 0], gEco, 'dim');

    // ================= gMMR: Dam-directed mismatch repair =================
    const gMMR = api.group();
    const mX = [-10, -3, 2.6, 10];
    const mTop = [], mBot = [];
    for (let i = 0; i < 3; i++) {
      const len = mX[i + 1] - mX[i], cx = (mX[i] + mX[i + 1]) / 2;
      const t = api.box(len - 0.05, 0.16, 0.16, C.dna1, gMMR); t.position.set(cx, 0.4, 0); mTop.push(t);
      const b = api.box(len - 0.05, 0.16, 0.16, NEW, gMMR); b.position.set(cx, -0.4, 0); mBot.push(b);
    }
    { const rm = api.mat(0xcfd8dc), rg = new THREE.BoxGeometry(0.07, 0.62, 0.07); for (let x = -9.8; x < 10; x += 0.45) { const r = new THREE.Mesh(rg, rm); r.position.x = x; gMMR.add(r); } }
    const gatcX = [-7, -3, 6];
    const mSites = gatcX.map(x => { const st = site(gMMR, 0.8); st.position.set(x, 0, 0); return st; });
    const mis = api.sphere(0.3, C.bad, gMMR, { emissive: 0x550000 }); mis.position.set(1, -0.75, 0.15);
    const misTop = api.sphere(0.3, C.bad, gMMR, { emissive: 0x550000 }); misTop.position.set(1, 0.75, 0.15);
    const mutS = api.blob(0.6, 0x5ac8fa, gMMR, { mat: { opacity: 0.92 }, seed: 21 });
    const mutL = api.blob(0.55, 0x64d2a0, gMMR, { mat: { opacity: 0.92 }, seed: 22 });
    const mutH = api.blob(0.42, 0xe08cff, gMMR, { mat: { opacity: 0.95 }, seed: 23 });
    const nick = api.sphere(0.22, 0xffffff, gMMR, { emissive: 0xffffff, emissiveIntensity: 1 });
    L.add('old', 'mạch cũ (có methyl ở GATC)', [-6.3, 1.5, 0], gMMR, 'dim');
    L.add('new', 'mạch mới (chưa methyl)', [-6.3, -1.5, 0], gMMR, 'dim');
    L.add('misL', 'bắt cặp sai', [2.2, -1.6, 0], gMMR, 'warn');
    L.add('mS', 'MutS', [0.9, 0.6, 0], mutS, 'tag'); L.add('mL', 'MutL', [-0.7, 0.8, 0], mutL, 'tag'); L.add('mH', 'MutH: rạch ở GATC', [0.6, -1.4, 0], mutH, 'tag');
    L.add('fixed', '✅ sửa đúng mạch mới', [0, 3.2, 0], gMMR, 'good');
    L.add('wrong', '❌ dam⁻: không biết mạch nào mới → có thể sửa nhầm mạch cũ', [0, 3.2, 0], gMMR, 'warn');

    // ================= gOri: SeqA sequestration =================
    const gOri = api.group();
    const oSeg = seg(gOri, 16, C.dna1, NEW, 0.8);
    const oriBox = api.box(10.5, 1.9, 1.1, 0xffd60a, gOri, { opacity: 0.08 });
    const oSites = [], seqA = [];
    for (let k = 0; k < 11; k++) { const x = -5 + k; const st = site(gOri, 0.8); st.position.set(x, 0, 0); oSites.push(st); const s = api.blob(0.38, 0x8fdcff, gOri, { mat: { opacity: 0.92 }, seed: 30 + k }); s.userData.home = new THREE.Vector3(x, 1.25, 0.2); seqA.push(s); }
    const dnaA = []; for (let k = 0; k < 3; k++) { const d = api.blob(0.55, RE, gOri, { mat: { opacity: 0.95 }, seed: 40 + k }); d.userData.x = -2 + k * 2; dnaA.push(d); }
    L.add('oriL', 'oriC: 11 GATC / ~245 bp', [0, 2.6, 0], gOri, 'big');
    L.add('seqL', 'SeqA giam oriC bán methyl hóa (~1/3 chu kỳ)', [0, 3.5, 0], gOri, 'good');
    L.add('dnaAL', 'DnaA ⛔ chưa khởi đầu lại được', [0, -3.6, 0], gOri, 'warn');
    L.add('dnaAgo', '❌ dam⁻: DnaA khởi đầu lại sớm, mất đồng bộ', [0, -3.6, 0], gOri, 'warn');
    void oSeg; void oriBox;

    // ================= gPhase: phase variation =================
    const gPh = api.group();
    const mkCell = (cx) => {
      const g = api.group(gPh); g.position.x = cx;
      capsule(g, 2.6, 6, 0.12);
      const d = seg(g, 7, C.dna1, C.dna2, 0.5); d.position.y = -0.3;
      const gene = api.box(2.6, 0.75, 0.4, C.good, g, { opacity: 0.5 }); gene.position.set(1.8, -0.3, 0);
      const prom = api.box(0.7, 0.75, 0.4, 0x4a90e2, g, { opacity: 0.5 }); prom.position.set(0, -0.3, 0);
      const st = site(g, 0.5); st.position.set(-1.3, -0.3, 0);
      const rep = api.blob(0.5, C.protein, g, { mat: { opacity: 0.95 }, seed: cx > 0 ? 51 : 52 });
      const pol = api.blob(0.5, C.enzyme, g, { mat: { opacity: 0.9 }, seed: 53 });
      const rna = []; for (let k = 0; k < 6; k++) { const b = api.box(0.22, 0.22, 0.22, C.rna, g); rna.push(b); }
      const pili = api.group(g);
      for (let k = 0; k < 18; k++) { const x = -3 + (k % 6) * 1.2, th = Math.floor(k / 6) * 2.1 + k * 0.5; const a = new THREE.Vector3(x, 2.6 * Math.cos(th), 2.6 * Math.sin(th)); const b = a.clone().add(new THREE.Vector3(0, Math.cos(th), Math.sin(th)).multiplyScalar(1.3)); api.stick(a, b, 0.04, 0xe0c27a, pili); }
      for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) { const th = k * 1.6; const a = new THREE.Vector3(sx * 5.3, 1.4 * Math.cos(th), 1.4 * Math.sin(th)); const b = a.clone().add(new THREE.Vector3(sx * 1.2, Math.cos(th) * 0.6, Math.sin(th) * 0.6)); api.stick(a, b, 0.04, 0xe0c27a, pili); }
      return { g, gene, st, rep, pol, rna, pili };
    };
    const cellL = mkCell(-7), cellR = mkCell(7);
    L.add('phOn', 'Dam thắng → methyl GATC → BẬT (có pili)', [-6, 4.6, 0], gPh, 'good');
    L.add('phOff', 'repressor thắng → che GATC → TẮT', [7, 4.6, 0], gPh, 'warn');
    L.add('phLock', '❌ dam⁻: cả hai bị khóa TẮT', [-7, 4.6, 0], gPh, 'warn');
    L.add('gatcL', 'GATC', [-8.3, 0.7, 0], gPh, 'dim');
    L.add('repL', 'repressor (Lrp)', [7 - 1.3, 1.5, 0], gPh, 'tag');
    L.add('gen', 'trạng thái giữ qua nhiều thế hệ', [0, -4.2, 0], gPh, 'dim');

    // ---------- state ----------
    let cur = 0, tt = 0, noMT = false, preMe = false, damM = false;
    const groups = [gRM, gEco, gMMR, gOri, gPh];
    const groupOf = (s) => s <= 3 ? gRM : s <= 5 ? gEco : s === 6 ? gMMR : s === 7 ? gOri : gPh;
    const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

    const readout = () => {
      const s = cur; let t;
      if (s <= 1) t = noMT ? '<b>Không có MTase</b>: DNA vi khuẩn không có dấu bảo vệ. REase sẽ coi nó là DNA lạ.' : '<b>MTase</b> methyl hóa A ở GAATTC trên cả 2 mạch: DNA vi khuẩn được bảo vệ khỏi REase.';
      else if (s === 2) t = preMe ? 'DNA phage <b>đã có dấu methyl</b> (vừa nhân lên trong vi khuẩn cùng hệ R-M).' : 'DNA phage <b>chưa có dấu methyl</b> của vi khuẩn này.';
      else if (s === 3) {
        const parts = [];
        parts.push(preMe ? '⚠️ Phage đã methyl hóa sẵn: REase không cắt, <b>phage thoát</b> và nhân lên.' : '✂️ REase cắt DNA phage chưa methyl hóa: <b>vi khuẩn thắng</b>.');
        if (noMT) parts.push('💀 Không có MTase: REase cắt luôn <b>DNA của chính vi khuẩn</b>, tế bào chết.');
        t = parts.join('<br>');
      }
      else if (s === 4) t = 'EcoRI cắt <b>so le</b> G↓AATTC trên cả 2 mạch, nên mỗi đầu có đoạn đơn <b>5′-AATT</b> (đầu dính).';
      else if (s === 5) t = 'Cùng enzyme thì cùng đầu dính. AATT bắt cặp với AATT, <b>ligase</b> hàn khung, tạo DNA tái tổ hợp.';
      else if (s === 6) t = damM ? '<b>dam⁻</b>: không mạch nào có methyl. MutH không phân biệt được mạch, có thể rạch <b>mạch cũ</b> và chép theo base sai, nên đột biến bị cố định (kiểu hình mutator).' : '<b>Dam bình thường</b>: chỉ mạch cũ có methyl, MutH rạch <b>mạch mới</b>, lỗi được sửa đúng.';
      else if (s === 7) t = damM ? '<b>dam⁻</b>: không có GATC bán methyl hóa, SeqA không giam oriC. DnaA khởi đầu lại sớm, nhiều lần, mất đồng bộ.' : 'oriC vừa sao chép: GATC <b>bán methyl hóa</b>. SeqA giam oriC, DnaA phải chờ. Mỗi chu kỳ chỉ khởi đầu 1 lần.';
      else t = damM ? '<b>dam⁻</b>: GATC không bao giờ được methyl hóa, repressor luôn thắng, gene <b>khóa ở pha TẮT</b>.' : 'Cùng gene, 2 trạng thái: <b>Dam thắng → BẬT</b>; <b>repressor thắng → TẮT</b>. Trạng thái di truyền qua thế hệ (epigenetic).';
      api.readout(t);
    };

    api.toggle('💥 Không có MTase (R-M)', false, (x) => { noMT = x; ctl.setStep(cur, true); });
    api.toggle('Phage đã methyl hóa sẵn', false, (x) => { preMe = x; ctl.setStep(cur, true); });
    api.toggle('💥 dam⁻ (không có Dam)', false, (x) => { damM = x; ctl.setStep(cur, true); });

    const CAMS = [
      [[0, 1.5, 25], [0, 0.6, 0]], [[0, 2.5, 19], [0, 1.2, 0]], [[3, 2, 23], [2, 0.8, 0]], [[1, 0.5, 24], [1, 0, 0]],
      [[0, 0.6, 11], [0, 0.2, 0]], [[0, 0.6, 12.5], [0.5, 0.2, 0]], [[0, 0.8, 18], [0, 0.4, 0]], [[0, -0.3, 15], [0, 0, 0]], [[0, 0.5, 21], [0, 0.2, 0]],
    ];

    const ctl = {
      setStep(s, fromToggle) {
        cur = s; tt = 0;
        const G = groupOf(s);
        groups.forEach(g => { g.visible = g === G; });
        // ---- R-M snap ----
        hostSegs.forEach(sg => { sg.position.copy(sg.userData.home); api.setOpacity(sg, 1); });
        hostSites.forEach(st => { st.visible = true; setMe(st, s >= 2 && !noMT, s >= 2 && !noMT); });
        phSegs.forEach((sg, i) => { sg.visible = s >= 2; sg.position.copy(s >= 3 ? sg.userData.home : ENTRY); sg.scale.setScalar(s >= 3 ? 1 : 0.05); api.setOpacity(sg, 1); });
        phSites.forEach(st => { st.visible = s >= 2; st.position.copy(s >= 3 ? st.userData.home : ENTRY); st.scale.setScalar(s >= 3 ? 1 : 0.05); setMe(st, preMe, preMe); });
        phage.visible = s >= 2;
        progeny.forEach(m => m.scale.setScalar(0.001));
        mtase.visible = s <= 1 && !noMT || (s === 0);
        mtase.position.set(s === 1 ? -7 : -4.5, HOST_Y + 1.4, 0.8);
        rease.position.set(s === 0 ? 4.5 : 0, s === 0 ? HOST_Y + 1.6 : -0.2, 1.0);
        // ---- EcoRI snap ----
        leftH.position.set(0, 0, 0); rightH.position.set(0, 0, 0); rightH.visible = s === 4;
        insH.visible = s === 5; insH.position.set(5, -2.5, 0);
        if (s === 5) leftH.position.set(-1.2, 0, 0);
        hbs.forEach((h, i) => { h.visible = s === 4 || (i < 3); });
        cutLine.visible = s === 4;
        ecoEnz.position.set(0, 4, 1); ecoEnz.visible = s === 4;
        ligase.visible = false; spark.visible = false;
        showEco(leftH, s === 4 || s === 5); showEco(rightH, s === 4); showEco(insH, s === 5);
        // ---- MMR snap ----
        mTop.forEach(b => { b.material.color.set(C.dna1); api.setOpacity(b, 1); });
        mBot.forEach(b => { b.material.color.set(NEW); api.setOpacity(b, 1); });
        mSites.forEach(st => setMe(st, !damM, false));
        mis.visible = true; api.setOpacity(mis, 1); misTop.visible = false;
        mutS.position.set(1, 4, 1); mutL.position.set(4, 4, 1); mutH.position.set(-3, -4, 1); nick.visible = false;
        // ---- ori snap ----
        oSites.forEach(st => setMe(st, !damM, false));
        seqA.forEach(sq => { sq.position.set(sq.userData.home.x, 5, 0.2); sq.visible = !damM; });
        dnaA.forEach(d => d.position.set(d.userData.x, -4.5, 0.3));
        // ---- phase snap ----
        const leftOn = !damM;
        [cellL, cellR].forEach((c, i) => {
          const on = i === 0 ? leftOn : false;
          setMe(c.st, on, on);
          c.rep.position.set(-1.3, on ? 1.4 : 0.35, on ? 1.2 : 0.3);
          c.pol.visible = on; c.rna.forEach(b => { b.visible = on; });
          c.pili.visible = on;
          c.gene.material.color.set(on ? C.good : C.grey);
        });
        // ---- labels ----
        const k = [];
        if (s === 0) k.push('mt', 're', 'siteL', 'hostL');
        if (s === 1) { if (!noMT) k.push('mt'); k.push('siteL', 'hostL'); }
        if (s === 2) k.push('phage', preMe ? 'phMe' : 'phL', 're');
        if (s === 3) { k.push('re', preMe ? 'phMe' : 'phL'); }
        if (s === 4) k.push('eco', 'p5', 'p3');
        if (s === 5) k.push('vec', 'ins');
        if (s === 6) k.push('old', 'new', 'misL');
        if (s === 7) k.push('oriL', damM ? 'dnaAgo' : 'seqL', damM ? 'dnaAgo' : 'dnaAL');
        if (s === 8) k.push(damM ? 'phLock' : 'phOn', 'phOff', 'gatcL', 'repL', 'gen');
        ctl._base = k;
        L.only(k);
        if (!fromToggle) api.camera(...CAMS[s]);
        readout();
      },
      _base: [],
      update(dt, t) {
        tt += dt;
        const s = cur, k = 1 - Math.exp(-dt * 4);
        const extra = [];
        if (s <= 3) {
          snip(rease, t);
          head.rotation.y += dt * 0.3;
          if (s === 0) { mtase.position.y = HOST_Y + 1.4 + Math.sin(t * 2) * 0.15; }
          if (s === 1 && !noMT) {
            const x = -7 + Math.min(1, tt / 4) * 14;
            mtase.position.set(x, HOST_Y + 1.3 + Math.sin(t * 6) * 0.1, 0.8);
            hostSites.forEach(st => { if (st.position.x < x) setMe(st, true, true); });
          }
          if (s === 2) {
            const p = Math.min(1, tt / 2.5);
            phSegs.forEach((sg, i) => { const pi = Math.min(1, Math.max(0, p * 1.6 - i * 0.3)); sg.position.lerpVectors(ENTRY, sg.userData.home, pi); sg.scale.setScalar(0.05 + 0.95 * pi); });
            phSites.forEach((st, i) => { const pi = Math.min(1, Math.max(0, p * 1.6 - i * 0.3 - 0.15)); st.position.lerpVectors(ENTRY, st.userData.home, pi); st.scale.setScalar(0.05 + 0.95 * pi); });
          }
          if (s === 3) {
            // targets: phage sites, then (if no MTase) host sites
            const targets = phSites.map((st, i) => ({ pos: st.userData.home, cut: !preMe, ph: i }));
            if (noMT) hostSites.forEach((st, i) => targets.push({ pos: st.position.clone(), cut: true, host: i }));
            const per = 1.3, idx = Math.min(targets.length - 1, Math.floor(tt / per)), loc = (tt % per) / per;
            const tg = targets[idx];
            if (tt < targets.length * per) { tmp.copy(tg.pos).add(tmp2.set(0, 1.1, 1)); rease.position.lerp(tmp, loc < 0.6 ? k * 2 : k); }
            targets.forEach((g, j) => {
              const done = tt > j * per + per * 0.7;
              if (!done || !g.cut) return;
              if (g.ph !== undefined) phSites[g.ph].visible = false;
              if (g.host !== undefined) hostSites[g.host].visible = false;
            });
            // separate & fade cut fragments
            const phCut = !preMe && tt > per * 0.7;
            if (phCut) phSegs.forEach((sg, i) => { tmp.copy(sg.userData.home).add(tmp2.set((i - 1) * 1.2, (i % 2 ? -0.6 : 0.5), 0)); sg.position.lerp(tmp, k * 0.5); sg.rotation.z += dt * (i - 1) * 0.3; if (tt > per * 2.2) api.setOpacity(sg, Math.max(0.15, 1 - (tt - per * 2.2) * 0.4)); });
            const hostStart = phSites.length * per;
            if (noMT && tt > hostStart + per * 0.7) hostSegs.forEach((sg, i) => { tmp.copy(sg.userData.home).add(tmp2.set((i - 1.5) * 0.9, (i % 2 ? -0.7 : 0.7), 0)); sg.position.lerp(tmp, k * 0.4); });
            if (preMe && tt > per * 2) progeny.forEach((m, j) => { const sc = Math.min(0.55, Math.max(0.001, (tt - per * 2 - j * 0.25) * 0.4)); m.scale.setScalar(sc); m.rotation.y += dt; });
            if (tt > per * 2.2) extra.push(preMe ? 'escape' : 'cutPh');
            if (noMT && tt > hostStart + per) extra.push('self');
          }
        } else if (s <= 5) {
          if (s === 4) {
            if (tt < 1.6) ecoEnz.position.lerp(tmp.set(0, 1.9, 0.8), k);
            if (tt > 1.6 && tt < 2.4) cutLine.children.forEach(c => c.material.emissive.setHex(Math.sin(t * 20) > 0 ? 0xff0000 : 0x000000));
            if (tt > 2.4) {
              cutLine.visible = false; hbs.forEach((h, i) => { if (i >= 3 && i <= 6) h.visible = false; });
              leftH.position.lerp(tmp.set(-1.4, 0, 0), k * 0.6); rightH.position.lerp(tmp.set(1.4, 0, 0), k * 0.6);
              hbs.forEach((h, i) => { if (i < 3) h.position.x = xb(i) + leftH.position.x; else if (i > 6) h.position.x = xb(i) + rightH.position.x; });
              ecoEnz.position.lerp(tmp.set(0, 4.5, 1), k * 0.5);
              if (tt > 3.2) extra.push('stL', 'stR');
            }
          } else {
            // insert docks, AATT pairs, ligase seals both nicks
            const p = Math.min(1, Math.max(0, (tt - 0.8) / 2));
            insH.position.set(5 * (1 - p) + 0, -2.5 * (1 - p), 0);
            leftH.position.x = -1.2 * (1 - p);
            hbs.forEach((h, i) => { h.position.x = xb(i) + (i < 3 ? leftH.position.x : insH.position.x); h.visible = i < 3 || i > 6 || p >= 1; });
            if (p >= 1) {
              const nicks = [new THREE.Vector3((xb(2) + xb(3)) / 2, 0.8, 0.3), new THREE.Vector3((xb(6) + xb(7)) / 2, -0.8, 0.3)];
              const lt = tt - 2.8, ni = lt < 1.5 ? 0 : 1;
              ligase.visible = lt < 3.2; spark.visible = lt > 0.6 && lt < 3.2;
              ligase.position.lerp(tmp.copy(nicks[ni]).add(new THREE.Vector3(0, ni ? -0.7 : 0.7, 0.5)), k);
              spark.position.copy(nicks[ni]); spark.scale.setScalar(0.6 + 0.5 * Math.abs(Math.sin(t * 8)));
              extra.push('lig');
            }
          }
        } else if (s === 6) {
          // MutS → MutL → MutH nick → excise → resynth → Dam methylates new strand
          const wrongStrand = damM; // illustrative: no strand signal, the old strand gets nicked
          mutS.position.lerp(tmp.set(1, 1.0, 0.6), k);
          if (tt > 1) mutL.position.lerp(tmp.set(-0.4, 1.3, 0.6), k);
          const hy = wrongStrand ? 1.0 : -1.0;
          if (tt > 2) mutH.position.lerp(tmp.set(-3, hy, 0.6), k);
          if (tt > 2.8) { nick.visible = tt < 4; nick.position.set(-3, wrongStrand ? 0.4 : -0.4, 0.2); }
          const target = wrongStrand ? mTop[1] : mBot[1];
          if (tt > 3.2 && tt < 4.6) api.setOpacity(target, Math.max(0.05, 1 - (tt - 3.2)));
          if (tt > 4.6) {
            api.setOpacity(target, Math.min(1, (tt - 4.6)));
            if (wrongStrand) { target.material.color.set(0xff8a80); misTop.visible = true; }
            else { mis.visible = false; target.material.color.set(NEW); }
          }
          if (!damM && tt > 6.2) mSites.forEach(st => setMe(st, true, true));
          if (tt > 5) extra.push(damM ? 'wrong' : 'fixed');
          if (tt > 0.6) extra.push('mS'); if (tt > 1.4) extra.push('mL'); if (tt > 2.4) extra.push('mH');
        } else if (s === 7) {
          if (!damM) seqA.forEach((sq, i) => { if (tt > i * 0.15) sq.position.lerp(sq.userData.home, k); });
          dnaA.forEach((d, i) => {
            if (damM) d.position.lerp(tmp.set(d.userData.x, -1.15, 0.3), k * 0.7);
            else d.position.set(d.userData.x, -2.6 - Math.abs(Math.sin(t * 2.2 + i)) * 0.9, 0.3);
          });
        } else {
          const c = cellL;
          if (!damM) {
            const ph = (t * 0.35) % 1;
            c.pol.position.set(0.5 + ph * 2.6, 0.3, 0.4);
            c.rna.forEach((b, j) => { const q = Math.max(0, ph - j * 0.06); b.position.set(0.5 + q * 2.6 - 0.2, 0.75 + j * 0.25, 0.4 + j * 0.1); b.visible = ph > j * 0.06; });
            c.rep.position.y = 1.4 + Math.sin(t * 1.5) * 0.25;
            c.pili.rotation.x += dt * 0.15;
          }
          cellR.rep.position.y = 0.35 + Math.sin(t * 3) * 0.03;
        }
        L.only(ctl._base.concat(extra));
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
