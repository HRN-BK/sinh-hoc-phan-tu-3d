// Bài 14: Epigenetic nhân thực. Nucleosome, acetyl/methyl hóa histone, methyl hóa CpG (DNMT), Xist, ung thư.
import { labels } from './_kit.js';

export default {
  title: 'Epigenetic nhân thực: chromatin, histone & methyl hóa DNA',
  sub: 'Mọi tế bào trong cơ thể có cùng một bộ DNA, vậy mà tế bào gan khác tế bào thần kinh. Khác biệt nằm ở chỗ gene nào được "mở" để đọc, gene nào bị "khóa". Bài này cho thấy các dấu hiệu khóa/mở đó được gắn, đọc và sao chép qua phân bào như thế nào.',
  legend: '<span><i style="background:#b58ad6"></i>bát phân histone</span><span><i style="background:#5b8def"></i>DNA</span><span><i style="background:#34c759"></i>acetyl (Ac): mở</span><span><i style="background:#4a90e2"></i>H3K4me3: hoạt động</span><span><i style="background:#ff3b30"></i>5mC / H3K9me3: khóa</span><span><i style="background:#f2994a"></i>RNA Xist</span><span>· sơ đồ rút gọn, không đúng tỉ lệ</span>',

  why: `<p><b>Epigenetic</b> là những thay đổi biểu hiện gene <b>di truyền được qua phân bào</b> mà <b>không đổi trình tự DNA</b>. Hình dung DNA là cuốn sách; epigenetic là dấu kẹp trang, băng keo dán trang và chỗ gập trang, quyết định trang nào được đọc.</p>
  <p>Ba lớp chính ở nhân thực: (1) <b>biến đổi histone</b> (acetyl, methyl) làm chromatin lỏng hoặc chặt; (2) <b>methyl hóa DNA</b> ở CpG làm tắt promoter; (3) <b>RNA không mã hóa</b> như lncRNA Xist dẫn các enzyme khóa đến đúng chỗ. Nhờ vậy mỗi loại tế bào giữ được "bản sắc" của mình qua hàng nghìn lần phân bào.</p>`,

  without: `<ul>
  <li><b>Không có DNMT1</b>: sau mỗi lần sao chép, mạch mới không được methyl hóa. Dấu methyl bị pha loãng một nửa mỗi thế hệ (100% → 50% → 25%). Gene lẽ ra phải tắt (transposon, gene của mô khác) bị bật lên. Chuột mất DNMT1 chết ở giai đoạn phôi.</li>
  <li><b>Mất cân bằng HAT/HDAC</b>: chromatin mở hoặc đóng sai chỗ, nên gene bật/tắt sai. Nhiều ung thư có đột biến ở enzyme biến đổi histone.</li>
  <li><b>Methyl hóa quá mức ở promoter gene ức chế khối u</b> (ví dụ MLH1, p16): gene còn nguyên trình tự nhưng bị câm, nên tế bào mất "phanh" và phân chia không kiểm soát.</li>
  <li><b>Không có Xist</b>: ở con cái, cả hai nhiễm sắc thể X cùng hoạt động, nên liều gene X gấp đôi. Điều này gây chết phôi ở động vật có vú.</li></ul>
  <div class="box info">👉 Bật <b>💥 không có DNMT1</b> ở bước 7 để thấy dấu methyl mất dần. Bật <b>chất ức chế HDAC</b> ở bước 4, 6 hoặc 9 để thấy chromatin mở lại. Tắt <b>Xist</b> ở bước 8.</div>`,

  foundation: [
    { q: 'Vì sao DNA phải quấn lại thành chromatin?', a: 'DNA của một tế bào người dài khoảng <b>2 m</b> nhưng phải nằm gọn trong một nhân đường kính vài µm. DNA được quấn quanh protein <b>histone</b> thành <b>nucleosome</b>, rồi nucleosome xếp chặt thêm nhiều bậc. Tập hợp DNA + protein đó gọi là <b>chromatin</b>. Hệ quả: DNA bị "giấu" đi, muốn đọc gene phải mở chromatin ra trước.' },
    { q: 'Nucleosome gồm những gì?', a: '<b>147 bp DNA</b> quấn khoảng <b>1,67 vòng</b> quanh một <b>bát phân histone</b>: 2 × (H2A, H2B, H3, H4). Giữa hai nucleosome là <b>DNA nối</b> (linker), và histone <b>H1</b> giữ ở chỗ DNA vào/ra để nén chặt thêm. Hình ảnh quen thuộc là "chuỗi hạt cườm".' },
    { q: 'Vì sao histone bám chặt vào DNA?', a: 'DNA mang <b>điện âm</b> (nhóm phosphate). Histone giàu <b>lysine (K) và arginine (R)</b>, mang <b>điện dương</b>. Âm và dương hút nhau. Đây là chìa khóa để hiểu acetyl hóa: làm mất điện dương thì histone bám lỏng ra.' },
    { q: 'Đuôi histone là gì?', a: 'Mỗi histone có một <b>đuôi đầu N</b> thò ra ngoài nucleosome. Các enzyme gắn hoặc gỡ nhóm hóa học lên các lysine của đuôi này (ví dụ <b>H3K9</b> là lysine số 9 của H3). Mỗi tổ hợp dấu được các protein khác "đọc" để mở hoặc khóa chromatin.' },
    { q: 'Euchromatin và heterochromatin khác nhau thế nào?', a: '<b>Euchromatin</b> (nguyên nhiễm sắc) lỏng, mở, gene <b>được phiên mã</b>. <b>Heterochromatin</b> (dị nhiễm sắc) đặc, nén chặt, gene <b>bị tắt</b>. Cùng một đoạn DNA có thể chuyển qua lại giữa hai dạng tùy dấu epigenetic.' },
    { q: 'CpG là gì? 5mC là gì?', a: '<b>CpG</b> là chỗ một C đứng ngay trước một G trên cùng mạch (chữ "p" là liên kết phosphate). Ở động vật có vú, enzyme DNMT gắn nhóm methyl vào C ở CpG, tạo <b>5-methylcytosine (5mC)</b>. Vì CpG đối xứng (mạch kia cũng là CpG), cả hai mạch đều có thể được methyl hóa.' },
    { q: 'Sao chép DNA làm gì với dấu methyl?', a: 'Sao chép là <b>bán bảo tồn</b>: mỗi DNA con có 1 mạch cũ (vẫn có methyl) và 1 mạch mới (chưa có). Trạng thái đó gọi là <b>bán methyl hóa</b> (hemimethylated). Nếu không ai "chép" dấu sang mạch mới, sau vài lần phân bào dấu sẽ mất. DNMT1 làm việc chép đó.' },
    { q: 'lncRNA là gì?', a: '<b>lncRNA</b> (long non-coding RNA) là RNA <b>dài trên 200 nt</b> và <b>không dịch mã</b>. Nhiều lncRNA hoạt động như "người dẫn đường": chúng bám vào chromatin và kéo phức hợp enzyme khóa (như PRC2) đến đúng vị trí. Ví dụ kinh điển là <b>Xist</b>.' },
  ],

  steps: [
    { title: 'Toàn cảnh: euchromatin (mở) cạnh heterochromatin (đóng)', text: 'Sáu nucleosome nối nhau bằng DNA nối. Ba hạt bên trái <b>giãn ra</b> (euchromatin): DNA nối lộ ra, protein phiên mã tiếp cận được. Ba hạt bên phải <b>nén chặt</b> thành khối zigzag (heterochromatin): DNA bị giấu. Cùng trình tự DNA, khác trạng thái đóng gói.' },
    { title: 'Phóng to một nucleosome: 147 bp, 1,67 vòng', text: 'Lõi tím là <b>bát phân histone</b> 2 × (H2A, H2B, H3, H4). DNA xanh quấn <b>1,67 vòng</b> (147 bp). Các que nhỏ thò ra là <b>đuôi histone</b>, nơi các dấu hóa học được gắn vào. Histone dương bám DNA âm, nên khi chưa có dấu gì thì DNA quấn chặt.' },
    { title: 'HAT gắn acetyl: chromatin mở, gene BẬT', text: '<b>HAT</b> (histone acetyltransferase) gắn nhóm <b>acetyl</b> (đầu que xanh lá) lên lysine của đuôi. Acetyl <b>trung hòa điện dương</b> của lysine, nên histone bám DNA lỏng ra. Nhìn các nucleosome <b>tách xa nhau</b>, DNA nối lộ ra. Yếu tố phiên mã (xanh ngọc) bám được vào promoter.' },
    { title: 'HDAC gỡ acetyl: chromatin đóng, gene TẮT', text: '<b>HDAC</b> (histone deacetylase) gỡ acetyl. Lysine lấy lại điện dương, bám DNA chặt trở lại. Các nucleosome <b>co cụm</b>, yếu tố phiên mã bị đẩy ra. Bật <b>chất ức chế HDAC</b>: acetyl được giữ lại, chromatin vẫn mở. Đây là cơ chế của thuốc ức chế HDAC.' },
    { title: 'Methyl hóa histone: tùy vị trí mà bật hay tắt', text: 'Khác với acetyl, <b>methyl</b> không đổi điện tích. Ý nghĩa của nó tùy <b>vị trí</b>: <b>H3K4me3</b> (đầu que xanh dương, bên trái) đánh dấu promoter <b>đang hoạt động</b>. <b>H3K9me3</b> và <b>H3K27me3</b> (đầu que đỏ, bên phải) đánh dấu gene <b>bị khóa</b>, thu hút protein nén chromatin. Không thể nói "methyl hóa histone là tắt" một cách chung chung.' },
    { title: 'Methyl hóa CpG ở promoter (DNMT3a/3b): tắt gene', text: '<b>DNMT3a/3b</b> methyl hóa <b>de novo</b> các CpG ở promoter (chấm đỏ trên DNA nối). Nhóm methyl <b>cản yếu tố phiên mã</b> bám vào, và thu hút protein <b>bám methyl-CpG (MBD)</b>. MBD kéo HDAC đến, nên histone mất acetyl và chromatin đóng lại. Methyl hóa DNA và biến đổi histone <b>cộng hưởng</b> với nhau để khóa gene.' },
    { title: 'Sao chép: DNMT1 chép dấu sang mạch mới', text: 'Panel dưới: DNA mẹ có CpG methyl hóa cả 2 mạch. Sau sao chép, mỗi DNA con chỉ có methyl trên <b>mạch cũ</b> (bán methyl hóa). <b>DNMT1</b> (xanh ngọc) chạy dọc, nhận ra CpG bán methyl hóa và gắn methyl vào <b>mạch mới</b> cho khớp. Bật <b>💥 không có DNMT1</b>: mạch mới để trắng, dấu bị pha loãng một nửa mỗi thế hệ.' },
    { title: 'lncRNA Xist phủ lên nhiễm sắc thể X', text: 'Ở con cái, một trong hai X bị bất hoạt. Gene <b>Xist</b> trên X đó tạo ra một lncRNA <b>phủ lên chính nhiễm sắc thể đã tạo ra nó</b> (các chấm cam). Xist kéo <b>PRC2</b> đến gắn H3K27me3, làm cả nhiễm sắc thể nén thành heterochromatin (thể Barr). Tắt <b>Xist</b>: chromatin mở lại.' },
    { title: 'Ung thư và thuốc epigenetic', text: 'Trong nhiều ung thư, promoter của <b>gene ức chế khối u</b> bị <b>methyl hóa quá mức</b> nên gene bị câm (chromatin đóng). Thuốc <b>azacitidine/decitabine</b> ức chế DNMT để gỡ dấu methyl dần qua phân bào. <b>Chất ức chế HDAC</b> (vorinostat) giữ acetyl để mở chromatin. Bật công tắc HDAC inhibitor để thấy gene mở lại một phần.' },
  ],

  application: `<ul>
  <li><b>Azacitidine và decitabine:</b> các chất tương tự cytidine gắn vào DNA khi sao chép và bẫy DNMT. Kết quả là dấu methyl mất dần qua các lần phân bào, gene ức chế khối u bật lại. Được dùng điều trị hội chứng rối loạn sinh tủy (MDS) và một số bệnh bạch cầu.</li>
  <li><b>Chất ức chế HDAC (vorinostat, romidepsin):</b> giữ histone ở trạng thái acetyl hóa, mở chromatin. Được duyệt cho u lympho tế bào T ở da (CTCL).</li>
  <li><b>Xét nghiệm methyl hóa:</b> đo mức methyl hóa promoter MGMT trong u não (glioblastoma) giúp dự đoán đáp ứng với thuốc temozolomide. Methyl hóa SEPT9 trong máu được dùng để tầm soát ung thư đại trực tràng.</li>
  <li><b>Bất hoạt X và mèo tam thể:</b> mèo cái tam thể có mảng lông cam/đen vì ở mỗi vùng da, một X khác nhau bị Xist bất hoạt. Đây là ví dụ trực quan của epigenetic.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>DNMT1</th><th>DNMT3a / 3b</th><th>DNMT3L</th></tr>
  <tr><td>Vai trò</td><td><b>Duy trì</b> (maintenance)</td><td><b>De novo</b> (tạo dấu mới)</td><td>Hỗ trợ DNMT3a/3b</td></tr>
  <tr><td>Nhận diện</td><td>CpG <b>bán methyl hóa</b> sau sao chép</td><td>CpG chưa methyl hóa</td><td>Không có hoạt tính xúc tác riêng</td></tr>
  <tr><td>Khi nào</td><td>Mỗi lần phân bào</td><td>Phát triển phôi, biệt hóa</td><td>Phôi, tế bào mầm; ức chế transposon</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Dấu</th><th>Enzyme gắn / gỡ</th><th>Tác dụng</th></tr>
  <tr><td>Acetyl lysine (H3, H4)</td><td>HAT gắn / HDAC gỡ</td><td>Trung hòa điện dương → <b>mở</b>, bật gene</td></tr>
  <tr><td>H3K4me3</td><td>Histone methyltransferase (họ MLL)</td><td>Promoter <b>hoạt động</b></td></tr>
  <tr><td>H3K9me3, H3K27me3</td><td>SUV39H1 / PRC2</td><td>Gene <b>bị khóa</b>, heterochromatin</td></tr>
  <tr><td>5mC ở CpG</td><td>DNMT gắn</td><td>Promoter <b>tắt</b></td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái thứ 1</th><th>Cái thứ 2</th></tr>
  <tr><td>Euchromatin vs heterochromatin</td><td>Eu: <b>mở</b>, gene bật</td><td>Hetero: <b>đặc</b>, gene tắt</td></tr>
  <tr><td>Acetyl vs methyl histone</td><td>Acetyl: đổi điện tích, gần như luôn <b>mở</b></td><td>Methyl: không đổi điện tích, bật hay tắt <b>tùy vị trí</b></td></tr>
  <tr><td>Epigenetic vs đột biến</td><td>Epigenetic: <b>không đổi trình tự</b>, đảo ngược được</td><td>Đột biến: <b>đổi trình tự</b> DNA</td></tr>
  <tr><td>Nhân thực vs nhân sơ</td><td>Nhân thực: CpG 5mC, histone, lncRNA</td><td>Nhân sơ: hệ R-M, Dam (methyl A ở GATC), không histone</td></tr>
  </table></div>
  <div class="box warn">⚠️ Slide ghi "90–98% CpG bị methyl hóa". Số liệu thường gặp trong sách là khoảng <b>60–80% CpG</b> trong bộ gene người bị methyl hóa, còn <b>đảo CpG ở promoter của gene đang hoạt động thì thường không methyl hóa</b>. Có thể slide muốn nói "hầu hết 5mC nằm ở ngữ cảnh CpG". Đi thi nên chép đúng số trên slide, nhưng hiểu ý này.</div>`,

  traps: [
    { trap: '"Epigenetic là đột biến DNA."', truth: 'Epigenetic <b>không đổi trình tự</b> nucleotide. Nó thêm/bớt nhóm hóa học lên DNA hoặc histone, và có thể <b>đảo ngược</b> được. Đột biến mới đổi trình tự.' },
    { trap: '"DNMT1 tạo dấu methyl mới (de novo)."', truth: 'DNMT1 là enzyme <b>duy trì</b>: nó chép dấu từ mạch cũ sang mạch mới trên DNA bán methyl hóa. <b>DNMT3a/3b</b> mới là de novo.' },
    { trap: '"Acetyl hóa histone làm chromatin đóng lại."', truth: 'Ngược lại: acetyl <b>trung hòa điện dương</b> của lysine, histone bám DNA lỏng hơn, chromatin <b>mở</b> và gene bật. HDAC (gỡ acetyl) mới làm đóng.' },
    { trap: '"Methyl hóa histone luôn làm tắt gene."', truth: 'Tùy vị trí: <b>H3K4me3 = bật</b>, H3K9me3 và H3K27me3 = tắt. Methyl hóa <b>DNA ở promoter</b> thì mới gần như luôn là tắt.' },
    { trap: '"Heterochromatin là nơi gene được phiên mã mạnh."', truth: 'Heterochromatin <b>đặc</b>, gene <b>tắt</b>. Euchromatin mới là dạng mở, phiên mã hoạt động.' },
    { trap: '"Nucleosome gồm 200 bp quấn 2 vòng quanh 4 histone."', truth: '<b>147 bp</b> quấn <b>1,67 vòng</b> quanh <b>bát phân</b> (8 phân tử: 2 × H2A, H2B, H3, H4). H1 nằm ngoài, ở DNA nối.' },
    { trap: '"Xist là một protein phủ lên nhiễm sắc thể X."', truth: 'Xist là <b>lncRNA</b>, không dịch mã. Nó phủ lên chính X đã tạo ra nó và kéo PRC2 đến khóa.' },
    { trap: '"Methyl hóa ở nhân thực và nhân sơ giống nhau."', truth: 'Nhân thực (động vật có vú) chủ yếu methyl <b>C ở CpG</b> để điều hòa gene. Nhân sơ có cả methyl A (Dam ở GATC) và dùng methyl hóa trong hệ R-M để phân biệt DNA mình với DNA phage.' },
  ],

  quiz: [
    { q: 'Enzyme nào duy trì kiểu methyl hóa DNA qua các lần phân bào?', ops: ['DNMT3a', 'DNMT3b', 'DNMT1', 'HDAC'], a: 2, e: 'DNMT1 nhận ra CpG bán methyl hóa sau sao chép và methyl hóa mạch mới. DNMT3a/3b là de novo (bẫy hay gặp). HDAC gỡ acetyl histone, không liên quan methyl DNA.' },
    { q: 'Tế bào mất DNMT1 hoàn toàn. Sau 2 lần phân bào, một CpG vốn methyl hóa cả 2 mạch sẽ ra sao (xét trung bình)?', ops: ['Vẫn 100% methyl hóa', 'Khoảng 25% số mạch còn methyl', 'Tăng lên 200%', 'Trở thành đột biến C→T ngay'], a: 1, e: 'Mỗi lần sao chép, chỉ mạch cũ giữ dấu; không có DNMT1 thì mạch mới để trống. 100% → 50% → 25%. Không có đột biến trình tự nào xảy ra.' },
    { q: 'Vì sao acetyl hóa lysine của histone làm chromatin mở?', ops: ['Vì acetyl mang điện dương mạnh', 'Vì acetyl trung hòa điện dương của lysine, histone bám DNA (âm) lỏng hơn', 'Vì acetyl cắt DNA', 'Vì acetyl methyl hóa CpG'], a: 1, e: 'Lysine dương hút DNA âm. Acetyl trung hòa điện tích đó nên lực hút yếu đi. "Acetyl mang điện dương" là ngược.' },
    { q: 'Dấu nào gắn với promoter đang HOẠT ĐỘNG?', ops: ['H3K9me3', 'H3K27me3', 'H3K4me3', '5mC ở đảo CpG promoter'], a: 2, e: 'H3K4me3 đánh dấu promoter hoạt động. H3K9me3, H3K27me3 và 5mC ở promoter đều gắn với gene bị tắt.' },
    { q: 'Nucleosome gồm:', ops: ['147 bp DNA quấn 1,67 vòng quanh bát phân histone', '200 bp quấn 2 vòng quanh tứ phân histone', '147 bp quấn quanh H1', '10 bp mỗi vòng quanh H3'], a: 0, e: '147 bp, 1,67 vòng, 2 × (H2A, H2B, H3, H4). H1 là histone nối, nằm ngoài lõi.' },
    { q: 'Gene ức chế khối u bị câm do promoter methyl hóa quá mức. Thuốc nào hợp lý nhất để bật lại?', ops: ['Kháng sinh tetracycline', 'Azacitidine (ức chế DNMT)', 'α-amanitin', 'Rapamycin'], a: 1, e: 'Azacitidine bẫy DNMT, dấu methyl mất dần qua phân bào nên gene bật lại. α-amanitin khóa Pol II (làm tắt thêm), tetracycline tác động ribosome vi khuẩn.' },
    { q: 'Xist hoạt động bằng cách nào?', ops: ['Dịch mã ra protein bám X', 'lncRNA phủ lên X và kéo PRC2 đến gắn H3K27me3', 'Cắt DNA nhiễm sắc thể X', 'Methyl hóa adenine ở GATC'], a: 1, e: 'Xist là lncRNA không dịch mã. Nó phủ lên chính X tạo ra nó và dẫn PRC2 đến gắn dấu khóa H3K27me3. GATC/Dam là epigenetic nhân sơ.' },
  ],

  recall: [
    'Vẽ tay lại một nucleosome (bát phân, 147 bp, 1,67 vòng, H1, đuôi histone), rồi vẽ cạnh đó dạng euchromatin và heterochromatin.',
    'Vẽ DNA mẹ có CpG methyl hóa 2 mạch → sao chép → 2 DNA con bán methyl hóa → DNMT1 chép dấu. Vẽ thêm trường hợp không có DNMT1 qua 2 thế hệ.',
    'Lập bảng: HAT, HDAC, DNMT1, DNMT3a/3b, PRC2, Xist. Mỗi cái ghi 1 dòng: làm gì, kết quả là mở hay khóa.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const N = 6, AC = 0x34c759, ME_ON = 0x4a90e2, ME_OFF = C.methyl, NEUT = 0xc9d1d9;

    // ---- chromatin fiber ----
    const fG = api.group(); fG.position.y = 1.2;
    const coreG = new THREE.CylinderGeometry(0.8, 0.8, 0.95, 28);
    const tipG = new THREE.SphereGeometry(0.16, 12, 8);
    const wrapPts = []; for (let k = 0; k <= 60; k++) { const t = k / 60, a = t * 1.67 * Math.PI * 2; wrapPts.push(new THREE.Vector3(Math.cos(a) * 1.02, Math.sin(a) * 1.02, -0.55 + 1.1 * t)); }
    const nucs = [];
    for (let i = 0; i < N; i++) {
      const g = api.group(fG);
      const core = new THREE.Mesh(coreG, api.mat(C.histone, { roughness: 0.6 })); core.rotation.x = Math.PI / 2; g.add(core);
      api.tube(wrapPts, 0.12, C.dna1, g);
      const tips = [];
      for (let k = 0; k < 4; k++) {
        const a = k / 4 * Math.PI * 2 + 0.4, dir = new THREE.Vector3(Math.cos(a), Math.sin(a), (k % 2 ? 0.5 : -0.5)).normalize();
        api.stick(dir.clone().multiplyScalar(0.7), dir.clone().multiplyScalar(1.55), 0.045, 0xd9c2ef, g);
        const tip = new THREE.Mesh(tipG, api.mat(NEUT)); tip.position.copy(dir).multiplyScalar(1.6); g.add(tip); tips.push(tip);
      }
      g.position.set((i - 2.5) * 4, 0, 0);
      nucs.push({ g, tips, to: new THREE.Vector3() });
    }
    // H1 linker histone at the DNA entry/exit point of the zoomed nucleosome
    const h1 = api.sphere(0.32, 0x8a6fb0, nucs[2].g); h1.position.set(0, -1.3, 0);
    const h1Lab = api.label('H1 (histone nối)', [0, -0.55, 0], h1, 'dim');
    const linkers = []; for (let i = 0; i < N - 1; i++) linkers.push(api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.11, C.dna1, fG));
    const ends = [api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.11, C.dna1, fG), api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.11, C.dna1, fG)];
    // CpG sites on linker 0 (promoter)
    const cpg = []; for (let k = 0; k < 3; k++) { const m = api.sphere(0.17, 0xffffff, fG); cpg.push(m); }
    const tf = api.blob(0.6, C.enzyme, fG, { mat: { opacity: 0.95 }, seed: 4 });
    const mbd = api.blob(0.45, 0xb0413e, fG, { mat: { opacity: 0.95 }, seed: 9 });
    const xist = []; for (let k = 0; k < 30; k++) { const m = api.sphere(0.13, C.rna, fG); m.userData.k = k; xist.push(m); }

    L.add('eu', 'EUCHROMATIN (mở)', [-6, 3.0, 0], fG, 'good');
    L.add('het', 'HETEROCHROMATIN (đặc)', [6, 3.0, 0], fG, 'warn');
    L.add('nuc', 'bát phân histone · 147 bp · 1,67 vòng', [0, 1.9, 0], fG, 'big');
    L.add('tail', 'đuôi histone (lysine)', [1.8, -2.0, 0], fG, 'dim');
    L.add('hat', 'HAT: + acetyl → mở', [0, 3.0, 0], fG, 'good');
    L.add('hdac', 'HDAC: − acetyl → đóng', [0, 3.0, 0], fG, 'warn');
    L.add('hdi', '💊 ức chế HDAC: acetyl được giữ', [0, 3.9, 0], fG, 'good');
    L.add('k4', 'H3K4me3: hoạt động', [-6, 3.0, 0], fG, 'big');
    L.add('k9', 'H3K9me3 / H3K27me3: khóa', [6, 3.0, 0], fG, 'warn');
    L.add('prom', 'promoter (CpG)', [-8, -1.9, 0], fG, 'dim');
    L.add('dnmt3', 'DNMT3a/3b: 5mC de novo → MBD → HDAC', [-4, 3.2, 0], fG, 'warn');
    L.add('tfL', 'yếu tố phiên mã', [-8, 2.3, 0], fG, 'good');
    L.add('xistL', 'lncRNA Xist phủ X → PRC2 → H3K27me3', [0, 3.3, 0], fG, 'big');
    L.add('cancer', 'gene ức chế khối u: promoter 5mC → câm', [-3, 3.3, 0], fG, 'warn');
    L.add('geneOn', '✅ gene BẬT', [-8, -3.0, 0], fG, 'good');
    L.add('geneOff', '⛔ gene TẮT', [-8, -3.0, 0], fG, 'warn');

    // ---- replication panel (DNMT1) ----
    const pG = api.group(); pG.position.set(0, -5.6, 0);
    const markG = new THREE.SphereGeometry(0.2, 12, 8);
    const duplex = (x, y, oldTop, oldBot) => {
      const g = api.group(pG); g.position.set(x, y, 0);
      const top = api.box(6, 0.12, 0.12, oldTop ? C.dna1 : 0x9fd3ff, g); top.position.y = 0.35;
      const bot = api.box(6, 0.12, 0.12, oldBot ? C.dna2 : 0xffc2d0, g); bot.position.y = -0.35;
      const mk = (yy, isOld) => [-2.25, -0.75, 0.75, 2.25].map(xx => { const m = new THREE.Mesh(markG, api.mat(isOld ? ME_OFF : 0xffffff)); m.position.set(xx, yy, 0); g.add(m); return { m, isOld }; });
      return { g, top: mk(0.62, oldTop), bot: mk(-0.62, oldBot) };
    };
    const parent = duplex(-8, 0, true, true);
    const dA = duplex(1.5, 1.4, true, false), dB = duplex(1.5, -1.4, false, true);
    const gen2 = duplex(9.5, 0, false, false); // grand-daughter from new strand without DNMT1
    const dnmt1 = api.blob(0.45, C.enzyme, pG, { mat: { opacity: 0.95 }, seed: 12 });
    const arrowA = api.stick(new THREE.Vector3(-4.6, 0, 0), new THREE.Vector3(-2, 1.1, 0), 0.05, 0xffffff, pG);
    const arrowB = api.stick(new THREE.Vector3(-4.6, 0, 0), new THREE.Vector3(-2, -1.1, 0), 0.05, 0xffffff, pG);
    L.add('par', 'DNA mẹ: 5mC cả 2 mạch', [-8, 1.6, 0], pG, 'dim');
    L.add('hemi', 'sau sao chép: bán methyl hóa', [1.5, 3.1, 0], pG, 'dim');
    L.add('d1', 'DNMT1 chép dấu sang mạch mới', [1.5, -3.1, 0], pG, 'good');
    L.add('noD1', '❌ không DNMT1: 100% → 50% → 25%', [6, -3.1, 0], pG, 'warn');
    L.add('g2', 'thế hệ sau: mất hết ở mạch này', [9.5, 1.6, 0], pG, 'warn');

    // ---- state ----
    let cur = 0, noD1 = false, hdi = false, xistOn = true, rp = 0;
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), v = new THREE.Vector3();
    // per-step: compact flags per nucleosome, tip colors per nucleosome, CpG methylated?, show TF?
    const plan = (s) => {
      const open = Array(N).fill(true); let tip = Array(N).fill(NEUT), cpgMe = false;
      if (s === 0) { for (let i = 3; i < N; i++) open[i] = false; tip = tip.map((c, i) => i < 3 ? AC : NEUT); }
      if (s === 1) { /* single nucleosome view */ }
      if (s === 2) tip = tip.map(() => AC);
      if (s === 3) { const keep = hdi; open.fill(keep); tip = tip.map(() => keep ? AC : NEUT); }
      if (s === 4) { for (let i = 3; i < N; i++) open[i] = false; tip = tip.map((c, i) => i < 3 ? ME_ON : ME_OFF); }
      if (s === 5) { cpgMe = true; open.fill(hdi); tip = tip.map(() => hdi ? AC : NEUT); }
      if (s === 6) { open.fill(true); cpgMe = true; }
      if (s === 7) { open.fill(!xistOn); tip = tip.map(() => xistOn ? ME_OFF : AC); }
      if (s === 8) { cpgMe = true; open.fill(hdi); for (let i = 3; i < N; i++) open[i] = hdi; tip = tip.map(() => hdi ? AC : ME_OFF); }
      return { open, tip, cpgMe };
    };
    const geneOn = (s) => {
      const p = plan(s);
      if (s === 6 || s === 1) return null;
      if (s === 7) return !xistOn;
      return p.open[0] && !p.cpgMe;
    };
    const readout = () => {
      const s = cur; let t;
      if (s === 6) t = noD1 ? '<b>Không có DNMT1</b>: mạch mới không được methyl hóa. Dấu bị pha loãng: 100% → 50% → 25%. Gene vốn bị khóa sẽ dần bật lên.' : '<b>DNMT1 bình thường</b>: CpG bán methyl hóa được chép đủ, cả 2 DNA con giữ nguyên kiểu methyl hóa của mẹ.';
      else if (s === 7) t = xistOn ? '<b>Xist bật</b>: lncRNA phủ X, PRC2 gắn H3K27me3, X nén thành heterochromatin (thể Barr). Gene trên X này TẮT.' : '<b>Không có Xist</b>: X này vẫn mở, cả 2 X cùng hoạt động, liều gene X gấp đôi.';
      else if (s === 5 || s === 8) t = hdi ? '<b>Promoter vẫn 5mC</b>, nhưng chất ức chế HDAC giữ acetyl nên chromatin mở <b>một phần</b>. Muốn gỡ hẳn dấu methyl cần thêm azacitidine.' : '<b>Promoter 5mC</b> → MBD → HDAC → chromatin đóng. Gene TẮT dù trình tự DNA nguyên vẹn.';
      else if (s === 3) t = hdi ? '<b>Chất ức chế HDAC</b>: acetyl không bị gỡ, chromatin vẫn mở, gene vẫn BẬT.' : '<b>HDAC</b> gỡ acetyl: lysine lại dương, bám DNA chặt, chromatin đóng, gene TẮT.';
      else if (s === 2) t = '<b>HAT</b> gắn acetyl: chromatin mở, yếu tố phiên mã bám promoter, gene BẬT.';
      else t = 'Chromatin quyết định gene có được đọc hay không. Thử các công tắc ở bước 4, 6, 7, 8, 9.';
      api.readout(t);
    };
    api.toggle('💥 Không có DNMT1', false, (x) => { noD1 = x; ctl.setStep(cur); });
    api.toggle('💊 Chất ức chế HDAC', false, (x) => { hdi = x; ctl.setStep(cur); });
    api.toggle('Xist được biểu hiện', true, (x) => { xistOn = x; ctl.setStep(cur); });

    const CAMS = [
      [[0, 2, 24], [0, 1, 0]], [[3.2, 3.8, 4.6], [0, 1.2, 0]], [[0, 3, 22], [0, 1, 0]], [[0, 3, 20], [0, 1, 0]],
      [[0, 3, 22], [0, 1, 0]], [[-5, 3, 15], [-5, 0.5, 0]], [[1, -3, 20], [1, -5.6, 0]], [[0, 3, 18], [0, 1, 0]], [[-2, 2, 20], [-2, 0, 0]],
    ];

    const ctl = {
      setStep(s) {
        cur = s;
        const p = plan(s);
        // layout targets
        const nOpen = p.open.filter(Boolean).length;
        nucs.forEach((n, i) => {
          if (s === 1) { if (i === 2) n.to.set(0, 0, 0); }
          else if (p.open.every(Boolean)) n.to.set((i - 2.5) * 4, 0, 0);
          else if (p.open.every(o => !o)) n.to.set((i - 2.5) * 1.6, i % 2 ? 0.8 : -0.8, i % 2 ? 0.7 : -0.7);
          else if (p.open[i]) n.to.set(-12 + i * 3.6, 0, 0);
          else n.to.set(4 + (i - 3) * 1.6, i % 2 ? 0.8 : -0.8, i % 2 ? 0.7 : -0.7);
          n.tips.forEach((tp) => tp.material.color.set(p.tip[i]));
          api.fadeTo(n.g, 1, 4); n.g.visible = !(s === 1 && i !== 2);
        });
        linkers.forEach(l => { l.visible = s !== 1; }); ends.forEach(l => { l.visible = s !== 1; });
        cpg.forEach(m => { m.material.color.set(p.cpgMe ? ME_OFF : 0xffffff); m.visible = s !== 1; });
        const on = geneOn(s);
        api.fadeTo(tf, on && s !== 6 ? 1 : 0, 3); tf.visible = s !== 1;
        api.fadeTo(mbd, p.cpgMe && s !== 6 && !hdi ? 1 : 0, 3); mbd.visible = s !== 1;
        xist.forEach(m => { m.visible = s === 7 && xistOn; });
        // replication panel
        pG.visible = s === 6; fG.visible = s !== 6;
        rp = 0;
        api.fadeTo(dnmt1, s === 6 && !noD1 ? 1 : 0, 3);
        [dA.top, dA.bot, dB.top, dB.bot, gen2.top, gen2.bot].forEach(arr => arr.forEach(o => o.m.material.color.set(o.isOld ? ME_OFF : 0xffffff)));
        gen2.g.visible = noD1;
        // labels
        const keys = [];
        if (s === 0) keys.push('eu', 'het');
        if (s === 1) keys.push('nuc', 'tail');
        if (s === 2) keys.push('hat', 'tfL', 'prom');
        if (s === 3) keys.push(hdi ? 'hdi' : 'hdac', 'prom');
        if (s === 4) keys.push('k4', 'k9');
        if (s === 5) { keys.push('dnmt3', 'prom'); if (hdi) keys.push('hdi'); }
        if (s === 6) { keys.push('par', 'hemi', noD1 ? 'noD1' : 'd1'); if (noD1) keys.push('g2'); }
        if (s === 7) keys.push('xistL');
        if (s === 8) { keys.push('cancer', 'prom'); if (hdi) keys.push('hdi'); }
        if (on === true) keys.push('geneOn'); else if (on === false) keys.push('geneOff');
        L.only(keys); h1.visible = s === 1; api.showLabel(h1Lab, s === 1);
        api.camera(...CAMS[s]);
        readout();
      },
      update(dt, t) {
        const k = 1 - Math.exp(-dt * 3);
        nucs.forEach((n) => { n.g.position.lerp(n.to, k); });
        // linker DNA follows nucleosomes (exit of i → entry of i+1)
        for (let i = 0; i < N - 1; i++) {
          tmpA.copy(nucs[i].g.position).add(v.set(0.9, 0, 0.55));
          tmpB.copy(nucs[i + 1].g.position).add(v.set(-0.9, 0, -0.55));
          api.setStick(linkers[i], tmpA, tmpB);
          if (i === 0) cpg.forEach((m, j) => m.position.lerpVectors(tmpA, tmpB, 0.25 + j * 0.25).add(v.set(0, 0.22, 0)));
          if (i === 0) {
            tf.position.lerpVectors(tmpA, tmpB, 0.5).add(v.set(0, 0.9, 0));
            mbd.position.lerpVectors(tmpA, tmpB, 0.5).add(v.set(0, -0.8, 0));
          }
        }
        api.setStick(ends[0], tmpA.copy(nucs[0].g.position).add(v.set(-0.9, 0, -0.55)), tmpB.copy(nucs[0].g.position).add(v.set(-3.2, 0, -0.55)));
        api.setStick(ends[1], tmpA.copy(nucs[N - 1].g.position).add(v.set(0.9, 0, 0.55)), tmpB.copy(nucs[N - 1].g.position).add(v.set(3.2, 0, 0.55)));
        // Xist cloud orbits the compacted fiber
        if (cur === 7 && xistOn) xist.forEach((m) => { const kk = m.userData.k, n = nucs[kk % N].g.position, a = kk * 2.4 + t * 0.6; m.position.set(n.x + Math.cos(a) * 1.5, n.y + Math.sin(a) * 1.5, n.z + Math.sin(a * 0.7) * 0.8); });
        // DNMT1 sweeps the new strands and copies the marks
        if (cur === 6 && !noD1) {
          rp = Math.min(1, rp + dt * 0.25);
          const pass = rp < 0.5 ? 0 : 1, row = pass ? dB.top : dA.bot;
          const xx = rp >= 1 ? 3 : -3 + ((rp % 0.5) / 0.5) * 6;
          dnmt1.position.set(1.5 + xx, pass ? -1.4 + 0.62 : 1.4 - 0.62, 0.4);
          row.forEach(o => { if (!o.isOld && o.m.position.x < xx) o.m.material.color.set(ME_OFF); });
          if (rp >= 1) { dA.bot.forEach(o => o.m.material.color.set(ME_OFF)); dB.top.forEach(o => o.m.material.color.set(ME_OFF)); }
        }
        nucs.forEach((n, i) => { n.g.rotation.z += dt * (cur === 1 ? 0.35 : 0.08); });
      },
    };
    ctl.setStep(0);
    return ctl;
  },
};
