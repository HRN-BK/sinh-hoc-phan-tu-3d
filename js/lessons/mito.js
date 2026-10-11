// Bài 18: Nhập protein vào ty thể: trình tự định hướng (xoắn α lưỡng tính) → Hsp70 tế bào chất → Tom20/22 → Tom40 → Tim23/17 (Δψ) → Tim44 + mtHsp70 (ATP) → MPP → gấp nếp.
import { labels, progress, clamp, ease, lerp, membrane } from './_kit.js';

export default {
  title: 'Nhập protein vào ty thể',
  sub: 'Gần như mọi protein của ty thể do gene trong nhân mã hóa và được dịch mã ở tế bào chất. Muốn vào tới chất nền, chuỗi phải mang "địa chỉ" ở đầu N, được giữ ở dạng duỗi, chui qua 2 lớp màng (Tom rồi Tim), được kéo vào bằng điện thế màng và ATP, rồi bị cắt bỏ địa chỉ.',
  legend: '<span><i style="background:#4a90e2"></i>aa mang điện + (Arg/Lys)</span><span><i style="background:#e8a33d"></i>aa kỵ nước</span><span><i style="background:#9b6dd6"></i>phần protein trưởng thành</span><span><i style="background:#2bb3a3"></i>Tom / Tim / chaperone</span><span><i style="background:#5ac8c8"></i>Tom40</span><span><i style="background:#ff8a65"></i>Tim23/17</span><span><i style="background:#ff6b6b"></i>(+) khoảng gian màng</span><span><i style="background:#5b8def"></i>(−) chất nền</span><span><i style="background:#ffe066"></i>ATP</span>',

  why: `<p>Ty thể có DNA riêng, nhưng ở người DNA ty thể chỉ mã hóa <b>13 protein</b>. Hơn 1000 protein còn lại của ty thể do <b>gene trong nhân</b> mã hóa, được dịch mã trên <b>ribosome tự do</b> ở tế bào chất, rồi phải được <b>nhập vào</b> ty thể.</p>
  <p>Khó khăn: ty thể có <b>2 lớp màng</b>, và protein không thể tự chui qua. Tế bào giải quyết bằng một dây chuyền: một <b>"địa chỉ"</b> ở đầu N (trình tự định hướng), một <b>cổng ở màng ngoài</b> (phức hợp <b>Tom</b>), một <b>cổng ở màng trong</b> (phức hợp <b>Tim</b>), và <b>3 nguồn năng lượng</b> (ATP ở tế bào chất, điện thế màng Δψ, ATP ở chất nền).</p>
  <p>Khác với ER, quá trình này xảy ra <b>sau dịch mã</b> (post-translational): chuỗi được dịch mã xong hoàn toàn rồi mới được nhập vào.</p>`,

  without: `<ul>
  <li><b>Không có trình tự định hướng</b>: protein ở lại tế bào chất, ty thể thiếu enzyme của chu trình Krebs, chuỗi hô hấp, nên không tạo đủ ATP.</li>
  <li><b>Mất điện thế màng Δψ</b> (chất khử ghép như CCCP, hoặc chuỗi hô hấp hỏng): protein mới không vào được chất nền. Ty thể hỏng thì càng không nhập được protein để tự sửa, thành vòng luẩn quẩn.</li>
  <li><b>Hỏng "mô-tơ kéo" ở chất nền</b>: ở người, đột biến <b>DNAJC19</b> (một thành phần của mô-tơ nhập cùng mtHsp70) gây bệnh cơ tim giãn kèm mất điều hòa vận động (DCMA).</li>
  <li><b>Protein gấp quá chặt</b> không chui qua được lỗ: kẹt ở màng ngoài.</li></ul>
  <div class="box info">👉 Bật các công tắc 💥 (xóa trình tự định hướng, DHFR + methotrexate, CCCP, hết ATP chất nền) ở từng bước để xem chuỗi dừng ở đâu.</div>`,

  foundation: [
    { q: 'Ty thể có cấu trúc như thế nào?', a: 'Ty thể có <b>2 màng</b> chia thành 4 vùng: <b>màng ngoài</b> (outer membrane, khá "thoáng"), <b>khoảng gian màng</b> (intermembrane space, IMS), <b>màng trong</b> (inner membrane, gấp thành mào, chứa chuỗi hô hấp, rất kín) và <b>chất nền</b> (matrix, chứa DNA ty thể, enzyme chu trình Krebs). Ở <b>vị trí tiếp xúc</b> (contact site), 2 màng nằm sát nhau.' },
    { q: 'Ty thể có DNA riêng, vậy sao phải nhập protein?', a: 'DNA ty thể người (~16,6 kb) chỉ mã hóa <b>13 protein</b> (đều thuộc chuỗi hô hấp), 2 rRNA và 22 tRNA. Khoảng <b>1000–1500</b> protein còn lại do <b>gene trong nhân</b> mã hóa: mRNA ra tế bào chất, được dịch mã ở <b>ribosome tự do</b>, rồi protein phải được nhập vào ty thể.' },
    { q: 'Trình tự định hướng (targeting sequence) là gì?', a: 'Là một đoạn amino acid trên chính protein, đóng vai trò <b>"địa chỉ trên phong bì"</b>. Protein đi vào ER có <b>trình tự tín hiệu ER</b> (kỵ nước, đầu N). Protein đi vào <b>chất nền ty thể</b> có <b>trình tự định hướng vào chất nền</b> (matrix-targeting sequence, còn gọi presequence) ở <b>đầu N</b>, dài khoảng 15–50 amino acid.' },
    { q: 'Xoắn α lưỡng tính (amphipathic α-helix) là gì?', a: 'Xoắn α có khoảng <b>3,6 amino acid mỗi vòng</b>, nên các amino acid cách nhau 3–4 vị trí nằm cùng một phía của xoắn. Trình tự định hướng ty thể giàu <b>Arg, Lys</b> (mang điện <b>+</b>) và amino acid <b>kỵ nước</b>, gần như không có aa tính acid. Khi cuộn thành xoắn, các aa + dồn về <b>một mặt</b>, aa kỵ nước dồn về <b>mặt kia</b>. Trong 3D: xanh dương = +, cam = kỵ nước.' },
    { q: 'Điện thế màng Δψ là gì?', a: 'Chuỗi chuyền electron ở màng trong <b>bơm H⁺</b> từ chất nền ra khoảng gian màng. Kết quả: phía ngoài màng trong <b>dương (+)</b>, chất nền <b>âm (−)</b>, chênh lệch khoảng 150–180 mV. Đầu N mang điện + của chuỗi bị <b>hút</b> về phía âm, giống điện di. Chất <b>CCCP</b> (chất khử ghép, uncoupler) chở H⁺ quay lại chất nền, làm <b>Δψ = 0</b>.' },
    { q: 'Hsp70 hoạt động thế nào?', a: 'Hsp70 là chaperone bám vào <b>đoạn kỵ nước</b> trên chuỗi đang <b>duỗi</b>. Chu trình <b>ATP</b> điều khiển việc bám và nhả: thủy phân ATP thành ADP thì Hsp70 bám chặt, đổi ADP lấy ATP mới thì nó nhả ra. Có <b>2 loại Hsp70</b> trong bài: <b>Hsp70 tế bào chất</b> (giữ chuỗi duỗi) và <b>mtHsp70</b> trong chất nền (kéo chuỗi vào).' },
    { q: 'Vì sao protein phải ở dạng duỗi mới qua được màng?', a: 'Lỗ Tom40 và kênh Tim23 rất hẹp (đường kính chỉ khoảng 2 nm), chỉ vừa cho <b>một chuỗi polypeptide duỗi</b> đi qua. Một protein đã gấp nếp thành khối 3D thì to hơn nhiều, nên <b>kẹt</b>. Sau khi vào tới chất nền, chuỗi mới được gấp nếp.' },
    { q: 'Protease là gì? MPP làm gì?', a: '<b>Protease</b> là enzyme cắt liên kết peptide. <b>MPP</b> (mitochondrial processing peptidase, protease xử lý chất nền) nằm trong chất nền, cắt bỏ trình tự định hướng ngay khi đầu N vào tới chất nền. Đoạn bị cắt sau đó bị phân hủy.' },
  ],

  steps: [
    { title: 'Ribosome tự do dịch mã tiền chất (gene nhân)', text: 'mRNA từ <b>gene trong nhân</b> được dịch mã trên <b>ribosome tự do</b> ở tế bào chất (không gắn vào ER). Đầu N ló ra trước, mang <b>trình tự định hướng vào chất nền</b>: một <b>xoắn α lưỡng tính</b>, một mặt mang điện <b>+</b> (xanh dương, Arg/Lys), một mặt <b>kỵ nước</b> (cam). Chuỗi chưa được nhập lúc này: protein được <b>dịch mã xong hoàn toàn</b> rồi mới nhập (sau dịch mã). Tiền chất (precursor) = trình tự định hướng + phần protein trưởng thành (tím).' },
    { title: 'Hsp70 tế bào chất giữ chuỗi ở dạng duỗi', text: 'Chuỗi rời ribosome. Nếu để tự do, nó sẽ gấp nếp thành khối và không chui qua lỗ được. <b>Hsp70 tế bào chất</b> (xanh ngọc, dùng <b>ATP</b>) bám lên các đoạn của chuỗi, giữ nó ở trạng thái <b>duỗi</b> (unfolded) để sẵn sàng đi qua màng. Đây là nguồn năng lượng thứ nhất.' },
    { title: 'Tom20/22 nhận ra trình tự định hướng', text: 'Ở màng ngoài có các <b>thụ thể nhập</b>: <b>Tom20</b> bám vào <b>mặt kỵ nước</b> của xoắn, <b>Tom22</b> (đầu ngoài tế bào chất mang nhiều aa tính acid, tích điện −) bám vào <b>mặt +</b>. Đây là bước "đọc địa chỉ". Tom20/22 chuyển chuỗi sang lỗ Tom40 ngay cạnh. (Tom = translocase of the <b>outer</b> membrane.)' },
    { title: 'Đi qua lỗ nhập chung Tom40 (màng ngoài)', text: '<b>Tom40</b> là <b>lỗ nhập chung</b> (general import pore) của màng ngoài: hầu hết protein ty thể đều đi qua đây, bất kể đích cuối. Tom40 là <b>lỗ</b>, không phải thụ thể. Đầu N chui qua, ló vào khoảng gian màng. Hsp70 tế bào chất <b>nhả dần</b> khi chuỗi đi vào. Bước này <b>chưa cần</b> điện thế màng.' },
    { title: 'Tim23/17 ở vị trí tiếp xúc: Δψ hút đầu (+)', text: 'Tại <b>vị trí tiếp xúc</b> giữa 2 màng, đầu N đi vào kênh <b>Tim23/17</b> của màng trong. Màng trong mang <b>điện thế Δψ</b>: phía khoảng gian màng <b>+</b> (đỏ), chất nền <b>−</b> (xanh). Đầu N mang điện + bị <b>hút</b> sang chất nền, như điện di. Đây là nguồn năng lượng thứ hai. Lúc này chuỗi <b>vắt ngang cả 2 màng</b>. (Tim = translocase of the <b>inner</b> membrane.)' },
    { title: 'Tim44 + mtHsp70 kéo phần còn lại vào (ATP)', text: '<b>Tim44</b> neo <b>mtHsp70</b> (Hsp70 chất nền) ngay ở cửa kênh. Chuỗi dao động ngẫu nhiên trong kênh; mỗi khi một đoạn mới ló vào chất nền, mtHsp70 dùng <b>ATP</b> bám lấy nó và không cho trượt lui. Lặp lại nhiều lần, mtHsp70 hoạt động như một <b>"tời kéo"</b> kéo toàn bộ chuỗi vào chất nền. Đây là nguồn năng lượng thứ ba.' },
    { title: 'MPP cắt bỏ trình tự định hướng', text: 'Trong chất nền, <b>MPP</b> (mitochondrial processing peptidase, protease xử lý chất nền) <b>cắt bỏ trình tự định hướng</b>. Đoạn bị cắt bị phân hủy. Mất "đầu kéo" mang điện +, và lại bị mtHsp70 giữ, nên protein <b>không đi ngược ra được nữa</b>.' },
    { title: 'Protein gấp nếp thành dạng hoạt động', text: 'Được mtHsp70 nhả ra, chuỗi <b>gấp nếp</b> thành protein hoạt động trong chất nền. Nhìn lại toàn bộ đường đi: <b>Hsp70 tế bào chất</b> (ATP) → <b>Tom20/22</b> (thụ thể) → <b>Tom40</b> (lỗ chung) → <b>Tim23/17</b> (Δψ) → <b>Tim44 + mtHsp70</b> (ATP) → <b>MPP</b> cắt → gấp nếp.' },
  ],

  application: `<p><b>Trình tự định hướng vừa cần vừa đủ.</b> Gắn trình tự định hướng của một protein ty thể (ví dụ của tiểu đơn vị COX8) vào đầu N của <b>GFP</b> (protein phát huỳnh quang xanh, vốn ở tế bào chất), thì GFP được đưa vào chất nền ty thể. Các phòng thí nghiệm dùng "mito-GFP" này để nhuộm và theo dõi ty thể trong tế bào sống.</p>
  <p><b>Thí nghiệm DHFR + methotrexate</b> (Eilers & Schatz, 1986): nối enzyme DHFR vào sau trình tự định hướng. Thêm methotrexate (gắn chặt vào DHFR) làm DHFR gấp cứng lại, và protein <b>kẹt ở lỗ nhập</b>. Đây là bằng chứng protein phải được <b>duỗi</b> mới qua màng.</p>
  <p><b>Chất khử ghép</b> (CCCP, FCCP) phá Δψ, nên được dùng trong phòng thí nghiệm để chứng minh bước qua Tim23 cần điện thế màng.</p>
  <div class="box info">Thêm (ngoài slide): nhiều protein sau khi vào chất nền còn được chaperonin <b>Hsp60/Hsp10</b> (một "buồng" kín hình thùng) giúp gấp nếp, giống GroEL/GroES ở vi khuẩn.</div>
  <div class="box warn">Slide rút gọn đường đi. Thực tế còn <b>Tim50</b> (thụ thể của Tim23 ở khoảng gian màng), <b>Tom70</b> (thụ thể cho protein có tín hiệu nằm bên trong chuỗi), và các đường khác: <b>TIM22</b> cho protein mang của màng trong, <b>SAM</b> cho protein β-barrel màng ngoài. Bài này chỉ theo đường của protein có trình tự định hướng ở đầu N, đi vào chất nền.</div>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Nhập vào ER</th><th>Nhập vào ty thể (chất nền)</th></tr>
  <tr><td>Thời điểm</td><td><b>Đồng dịch mã</b> (ribosome gắn vào màng ER)</td><td><b>Sau dịch mã</b> (ribosome tự do, dịch mã xong mới nhập)</td></tr>
  <tr><td>Tín hiệu ở đầu N</td><td>Đoạn <b>kỵ nước</b></td><td><b>Xoắn α lưỡng tính</b>: một mặt +, một mặt kỵ nước</td></tr>
  <tr><td>Nhận diện</td><td>SRP + thụ thể SRP trên màng ER</td><td>Tom20, Tom22</td></tr>
  <tr><td>Kênh</td><td>Sec61 (1 màng)</td><td>Tom40 (màng ngoài) rồi Tim23/17 (màng trong)</td></tr>
  <tr><td>Năng lượng</td><td>GTP (SRP), ribosome đẩy chuỗi vào</td><td>ATP (Hsp70 tế bào chất), <b>Δψ</b>, ATP (mtHsp70)</td></tr>
  <tr><td>Cắt tín hiệu</td><td>Signal peptidase (lòng ER)</td><td><b>MPP</b> (chất nền)</td></tr>
  <tr><td>Chaperone bên trong</td><td>BiP (Hsp70 của ER)</td><td>mtHsp70 (và Hsp60)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Thành phần</th><th>Ở đâu</th><th>Vai trò</th><th>Năng lượng</th></tr>
  <tr><td>Hsp70 tế bào chất</td><td>Tế bào chất</td><td>Giữ chuỗi <b>duỗi</b></td><td>ATP</td></tr>
  <tr><td>Tom20, Tom22</td><td>Màng <b>ngoài</b></td><td><b>Thụ thể</b>: đọc trình tự định hướng</td><td>Không</td></tr>
  <tr><td>Tom40</td><td>Màng <b>ngoài</b></td><td><b>Lỗ nhập chung</b></td><td>Không</td></tr>
  <tr><td>Tim23/17</td><td>Màng <b>trong</b></td><td>Kênh vào chất nền</td><td><b>Δψ</b></td></tr>
  <tr><td>Tim44 + mtHsp70</td><td>Mặt chất nền của màng trong</td><td>"Tời kéo" chuỗi vào</td><td>ATP</td></tr>
  <tr><td>MPP</td><td>Chất nền</td><td>Cắt trình tự định hướng</td><td>Không</td></tr>
  </table></div>`,

  traps: [
    { trap: 'Tom ở màng trong, Tim ở màng ngoài.', truth: 'Ngược lại. <b>Tom</b> = <b>O</b>uter membrane (màng ngoài), <b>Tim</b> = <b>I</b>nner membrane (màng trong). Chuỗi gặp Tom trước, Tim sau.' },
    { trap: 'Tom40 là thụ thể nhận trình tự định hướng.', truth: '<b>Tom20/22</b> là thụ thể. <b>Tom40</b> là <b>lỗ nhập chung</b> mà chuỗi chui qua.' },
    { trap: 'Protein ty thể do DNA ty thể mã hóa.', truth: 'Chỉ 13 protein (ở người) do DNA ty thể mã hóa. <b>Phần lớn</b> (hơn 1000) do <b>gene nhân</b> mã hóa, dịch mã ở tế bào chất rồi nhập vào.' },
    { trap: 'Nhập vào ty thể diễn ra trong lúc dịch mã, giống ER.', truth: 'Nhập vào ty thể là <b>sau dịch mã</b>: ribosome tự do dịch mã xong, chuỗi mới được nhập. Nhập vào ER mới là đồng dịch mã.' },
    { trap: 'Trình tự định hướng ty thể là một đoạn kỵ nước, giống tín hiệu ER.', truth: 'Nó là <b>xoắn α lưỡng tính</b>: một mặt <b>mang điện +</b> (Arg/Lys), một mặt kỵ nước. Điện tích + là chìa khóa để Δψ hút nó qua màng trong.' },
    { trap: 'Hsp70 tế bào chất giúp protein gấp nếp trước khi nhập.', truth: 'Ngược lại: Hsp70 tế bào chất giữ chuỗi <b>duỗi</b>, không cho gấp, vì protein đã gấp thì không chui qua lỗ được. Gấp nếp chỉ xảy ra <b>sau khi</b> vào chất nền.' },
    { trap: 'Δψ cần cho việc đi qua Tom40.', truth: 'Δψ nằm ở <b>màng trong</b>, nên cần cho bước qua <b>Tim23</b>. Qua Tom40 thì không cần. Thêm CCCP, chuỗi vẫn qua được màng ngoài nhưng dừng ở khoảng gian màng.' },
    { trap: 'Δψ và mtHsp70 làm cùng một việc, có một là đủ.', truth: 'Hai việc khác nhau. <b>Δψ</b> hút <b>đầu N mang điện +</b> qua Tim23. <b>mtHsp70 + ATP</b> kéo <b>phần còn lại</b> của chuỗi. Thiếu ATP chất nền: đầu N vẫn vào, nhưng chuỗi kẹt vắt ngang 2 màng.' },
    { trap: 'Trình tự định hướng được cắt bỏ trước khi vào ty thể.', truth: 'Nó được cắt bởi <b>MPP trong chất nền</b>, tức là <b>sau khi</b> đầu N đã vào tới chất nền. Nếu cắt trước, protein mất địa chỉ và không vào được.' },
  ],

  quiz: [
    { q: 'Lỗ nhập chung ở màng ngoài ty thể là', ops: ['Tom20', 'Tom40', 'Tim23', 'Hsp70'], a: 1, e: 'Tom40 là lỗ nhập chung (general import pore). Tom20/22 là thụ thể; Tim23 ở màng trong; Hsp70 là chaperone.' },
    { q: 'Trình tự định hướng vào chất nền ty thể có đặc điểm nào?', ops: ['Đoạn kỵ nước liên tục ở đầu N', 'Xoắn α lưỡng tính, một mặt mang điện +, một mặt kỵ nước', 'Giàu aa tính acid (Asp, Glu)', 'Nằm ở đầu C, chuỗi Lys-Asp-Glu-Leu (KDEL)'], a: 1, e: 'Presequence ở đầu N là xoắn α lưỡng tính giàu Arg/Lys và aa kỵ nước. Đoạn kỵ nước liên tục là tín hiệu ER; KDEL là tín hiệu giữ lại ER.' },
    { q: 'Thêm CCCP (làm mất điện thế màng trong Δψ). Tiền chất dừng ở đâu?', ops: ['Không bám được Tom20', 'Qua Tom40 nhưng không vào được Tim23, dừng ở khoảng gian màng', 'Vào chất nền nhưng không được MPP cắt', 'Vẫn vào bình thường vì chỉ cần ATP'], a: 1, e: 'Tom40 không cần Δψ. Bước qua Tim23 cần Δψ để hút đầu N mang điện +.' },
    { q: 'Vai trò của Hsp70 tế bào chất trong nhập protein vào ty thể là', ops: ['Cắt trình tự định hướng', 'Giữ chuỗi ở trạng thái duỗi để chui qua lỗ', 'Kéo chuỗi vào chất nền', 'Tạo điện thế màng'], a: 1, e: 'Hsp70 tế bào chất (dùng ATP) giữ chuỗi duỗi. Kéo vào chất nền là việc của mtHsp70; cắt là MPP.' },
    { q: 'Thứ tự đúng của đường đi vào chất nền:', ops: ['Tom40 → Tom20/22 → Tim23/17 → MPP → mtHsp70', 'Hsp70 tbc → Tom20/22 → Tom40 → Tim23/17 → mtHsp70 → MPP', 'Hsp70 tbc → Tim23/17 → Tom40 → MPP → mtHsp70', 'SRP → Tom20 → Tom40 → Tim23 → MPP'], a: 1, e: 'Thụ thể (Tom20/22) trước, lỗ màng ngoài (Tom40), kênh màng trong (Tim23/17), mtHsp70 kéo vào, MPP cắt, rồi gấp nếp. SRP thuộc con đường ER.' },
    { q: 'Protein lai "trình tự định hướng + DHFR" được ủ với methotrexate (làm DHFR gấp rất chặt). Kết quả?', ops: ['Nhập bình thường', 'Kẹt ở lỗ nhập, vì phần DHFR gấp chặt không duỗi ra được', 'Bị đưa sang ER', 'Bị MPP cắt ở tế bào chất'], a: 1, e: 'Đây là thí nghiệm chứng minh protein phải ở dạng duỗi mới qua được lỗ Tom40/Tim23.' },
    { q: 'Điểm khác cơ bản giữa nhập protein vào ty thể và vào ER là', ops: ['Ty thể: sau dịch mã; ER: đồng dịch mã', 'Ty thể: đồng dịch mã; ER: sau dịch mã', 'Cả hai đều đồng dịch mã', 'Ty thể không cần trình tự tín hiệu'], a: 0, e: 'Protein ty thể được dịch mã xong ở ribosome tự do rồi mới nhập. Protein ER được đưa vào ngay trong lúc dịch mã nhờ SRP.' },
  ],

  recall: [
    'Vẽ tay lại sơ đồ nhập protein vào ty thể: 2 màng, Hsp70 tế bào chất, Tom20/22, Tom40, Tim23/17, Tim44, mtHsp70, MPP. Đánh dấu 3 chỗ cần năng lượng (ATP, Δψ, ATP).',
    'Giải thích vì sao trình tự định hướng phải mang điện +, và vì sao CCCP chặn được bước qua Tim23 nhưng không chặn bước qua Tom40.',
    'So sánh nhập protein vào ER và vào ty thể theo 5 tiêu chí: thời điểm, tín hiệu, thụ thể, kênh, năng lượng.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
    const OMX = -2.5, IMX = 2.5, X0 = -4.6;   // outer / inner membrane centres; X0 = where the chain meets Tom20/22
    const COL = { pos: 0x4a90e2, hyd: 0xe8a33d, im: 0xe3a35f, plus: 0xff6b6b, minus: 0x5b8def };

    // ---- membranes (vertical: cytosol left, IMS between, matrix right) ----
    for (const [x, col] of [[OMX, C.membrane], [IMX, COL.im]]) {
      const m = membrane(api, { w: 16, d: 3, y: 0, color: col });   // set back in z so the chain in the pores stays visible
      m.group.rotation.z = Math.PI / 2; m.group.position.set(x, 0, -1.7);
    }
    const pore = (x, col) => { const c = api.cylinder(0.7, 0.7, 2.9, col, null, { opacity: 0.5, depthWrite: false }); c.rotation.z = Math.PI / 2; c.position.set(x, 0, 0); return c; };
    pore(OMX, 0x5ac8c8); pore(IMX, 0xff8a65);
    const tom20 = api.blob(0.6, C.enzyme, null, { scale: [1, 0.8, 1], seed: 21 }); tom20.position.set(-4.45, 1.3, 0.2);
    const tom22 = api.blob(0.55, 0x1f8f84, null, { scale: [1, 0.8, 1], seed: 22 }); tom22.position.set(-4.45, -1.25, 0.2);
    api.stick(V(-4.0, 1.3, 0.2), V(-2.2, 1.3, 0.2), 0.09, C.enzyme); api.stick(V(-4.0, -1.25, 0.2), V(-2.2, -1.25, 0.2), 0.09, 0x1f8f84);
    const tim44 = api.blob(0.5, 0x26a69a, null, { scale: [1, 0.8, 1], seed: 23 }); tim44.position.set(4.35, -1.15, 0.2);
    // Δψ charges
    const plus = [-5.2, -3.4, -1.6, 1.6, 3.4, 5.2].map(y => { const s = api.sphere(0.2, COL.plus, null, { emissive: 0x330000 }); s.position.set(0, y, 0.6); return s; });
    const minus = [-5.2, -3.4, 1.8, 3.4, 5.2].map(y => { const s = api.sphere(0.2, COL.minus, null, { emissive: 0x000833 }); s.position.set(4.4, y, 0.6); return s; });
    // free ribosome on an mRNA
    const riboL = api.blob(1.0, C.ribosome, null, { scale: [1.2, 0.85, 1.1], seed: 3 }); riboL.position.set(-11, 4.25, 0);
    const riboS = api.blob(0.75, C.ribosome, null, { scale: [1.2, 0.7, 1], seed: 5 }); riboS.position.set(-11, 2.95, 0);
    const mrna = api.stick(V(-15, 3.15, 0.3), V(-7.5, 3.15, 0.3), 0.07, C.rna);
    const RE = V(-10.1, 3.4, 0);

    // ---- precursor chain ----
    const N = 22, PRE = 6, SP = 0.42;
    const TH = (i) => i * 100 * Math.PI / 180;          // α-helix: 100° per residue
    const isPos = (i) => i < PRE && Math.cos(TH(i)) > 0;
    const beadG = new THREE.SphereGeometry(0.24, 16, 12);
    const beads = [], sticks = [];
    for (let i = 0; i < N; i++) {
      const col = i < PRE ? (isPos(i) ? COL.pos : COL.hyd) : C.protein;
      const m = new THREE.Mesh(beadG, api.mat(col, { roughness: 0.45 })); api.add(m); beads.push(m);
      if (i) sticks.push(api.stick(V(), V(0, 1, 0), 0.07, 0xb9a6e8));
    }
    const FB = [];                                       // folded ball for the 16 mature residues
    for (let j = 0; j < N - PRE; j++) {
      const y = -(1 - 2 * (j + 0.5) / (N - PRE)), r = Math.sqrt(1 - y * y), th = j * Math.PI / 3;
      FB.push(V(r * Math.cos(th), y, r * Math.sin(th)).multiplyScalar(1.05));
    }
    // import path: cytosol meander → straight through Tom40 / Tim23 → bends down in the matrix
    const pathM = (a, out) => {
      if (a < X0) { const u = a - X0; return out.set(X0 + 0.75 * u, 1.1 * Math.sin(0.7 * u), 0.35 * (1 - Math.cos(0.9 * u))); }
      if (a <= 7) return out.set(a, 0, 0);
      const u = a - 7; return out.set(7 + 0.55 * u, -0.8 * u, 0.2 * Math.sin(u));
    };
    const pathR = (a, out) => out.set(RE.x + 0.2 * a + 0.45 * Math.sin(1.4 * a), RE.y - 0.72 * a, 0.3 * Math.sin(0.9 * a));
    const D_END = 12.9, FOLD_C = V(8.5, 1.8, 0), MPP_P = V(9.5, -2.4, 0.4);

    // ---- blobs that come and go ----
    const OFF = V(-14, 9, -4);
    const blob = (r, col, seed, sc = [1.1, 0.85, 1]) => { const b = api.blob(r, col, null, { mat: { opacity: 0, depthWrite: false }, scale: sc, seed }); b.position.copy(OFF); b.userData.on = false; return b; };
    const hsp = [0, 1, 2].map(j => blob(0.55, 0x2bb3a3, 30 + j));
    const mt = [0, 1].map(j => blob(0.55, 0x26a69a, 40 + j));
    const mpp = blob(0.7, 0x00897b, 50, [1.2, 0.9, 1]);
    const BLOBS = [...hsp, ...mt, mpp];
    const atp = api.sphere(0.16, 0xffe066, null, { emissive: 0xffaa00 }); atp.visible = false;
    const HSPB = [9, 14, 19];

    // ---- labels ----
    L.add('cyto', 'Tế bào chất', [-10.5, -3.4, 0], null, 'dim');
    L.add('ims', 'Khoảng gian màng', [0, -4.3, 0.6], null, 'dim');
    L.add('mat', 'Chất nền (matrix)', [9, 5, 0], null, 'dim');
    L.add('om', 'Màng ngoài', [-2.5, 4.1, 0], null, 'dim');
    L.add('im', 'Màng trong', [2.5, 4.1, 0], null, 'dim');
    L.add('ribo', 'Ribosome tự do', [-12.6, 5.4, 0], null);
    L.add('mrna', 'mRNA (từ gene nhân)', [-13.4, 2.4, 0], null, 'dim');
    L.add('pre', 'trình tự định hướng: xoắn α lưỡng tính', [0, 0, 0], null, 'good');
    L.add('post', 'Dịch mã xong → rời ribosome → mới nhập (sau dịch mã)', [-10, -4.4, 0], null);
    L.add('hsp', 'Hsp70 tế bào chất (ATP): giữ duỗi', [0, 0, 0], null);
    L.add('dh', 'DHFR + methotrexate: gấp chặt', [0, 0, 0], null, 'warn');
    L.add('tom20', 'Tom20: bám mặt kỵ nước', [0, 0, 0], null);
    L.add('tom22', 'Tom22 (−): bám mặt (+)', [0, 0, 0], null);
    L.add('tom40', 'Tom40: lỗ nhập chung', [-2.5, 2.2, 0], null);
    L.add('tim', 'Tim23/17', [2.5, 2.2, 0], null);
    L.add('psi', 'Δψ: (+) ngoài, (−) chất nền', [2.2, 4.3, 0.6], null, 'good');
    L.add('tim44', 'Tim44 (neo mtHsp70)', [0, 0, 0], null);
    L.add('mthsp', 'mtHsp70 kéo (ATP)', [0, 0, 0], null);
    L.add('mpp', 'MPP cắt', [0, 0, 0], null);
    L.add('deg', 'trình tự định hướng → phân hủy', [0, 0, 0], null, 'dim');
    L.add('noback', 'Không quay ngược được', [5.6, 1.4, 0], null, 'good');
    L.add('fold', 'Protein gấp nếp, hoạt động', [0, 0, 0], null, 'good');
    L.add('msg', '', [0, 5, 0], null, 'warn');
    const txt = {};
    const setT = (k, t) => { if (txt[k] !== t) { txt[k] = t; L.set(k, t); } };
    const at = (key, p, dx = 0, dy = 0) => L.get(key).position.set(p.x + dx, p.y + dy, p.z);

    // ---- state ----
    let cur = 0, noSig = false, dhfr = false, cccp = false, noAtp = false, sig = '';
    const ph = progress(0.17);
    const vis = (o, on, op = 0.85) => { if (o.userData.on !== on) { o.userData.on = on; api.fadeTo(o, on ? op : 0, 6); } };
    const CAMS = [[[-8, 1.5, 13], [-9, 0.5, 0]], [[-7.5, 1, 13], [-8.5, 0.5, 0]], [[-4.5, 1, 10], [-5, 0, 0]], [[-2.5, 0.5, 11], [-3.2, 0, 0]],
      [[1.5, 0.5, 13], [1, 0, 0]], [[5, 0, 15], [4.5, -0.5, 0]], [[8, -1, 13], [7.5, -1.5, 0]], [[1, 0.5, 21], [0, 0, 0]]];
    const tg = {};
    const refresh = () => { ctl.setStep(cur); };
    tg.sig = api.toggle('💥 Xóa trình tự định hướng', false, (x) => { noSig = x; refresh(); });
    tg.dh = api.toggle('💥 Gấp chặt (DHFR + methotrexate)', false, (x) => { dhfr = x; refresh(); });
    tg.cc = api.toggle('💥 CCCP: mất điện thế màng Δψ', false, (x) => { cccp = x; refresh(); });
    tg.atp = api.toggle('💥 Hết ATP trong chất nền', false, (x) => { noAtp = x; refresh(); });
    function readout() {
      const t = [];
      if (noSig && cur <= 2) t.push('❌ <b>Không có trình tự định hướng</b>: chuỗi vẫn được dịch mã bình thường nhưng không mang "địa chỉ". Tom20/22 không nhận ra, nên protein <b>ở lại tế bào chất</b>. Ngược lại, gắn trình tự này vào một protein lạ (như GFP) thì protein đó được đưa vào ty thể: trình tự định hướng vừa <b>cần</b> vừa <b>đủ</b>.');
      if (dhfr && cur >= 1 && cur <= 3) t.push('❌ <b>Gấp chặt (DHFR + methotrexate)</b>, thí nghiệm của Eilers & Schatz (1986): nối DHFR vào sau trình tự định hướng, thêm methotrexate làm DHFR gấp rất chặt, Hsp70 không giữ duỗi được. Đầu N vẫn được Tom20/22 nhận và chui vào lỗ, nhưng khối gấp nếp <b>kẹt lại ở Tom40</b>. Kết luận: protein phải <b>duỗi</b> mới qua được màng.');
      if (cccp && (cur === 4 || cur === 5)) t.push('❌ <b>CCCP</b> (chất khử ghép, uncoupler) cho H⁺ chảy ngược vào chất nền, nên <b>Δψ = 0</b>. Đầu N đã qua Tom40 (bước đó không cần Δψ) nhưng <b>không vào được Tim23</b>: chuỗi dừng ở khoảng gian màng, không gì tới được chất nền.');
      if (noAtp && !cccp && cur === 5) t.push('❌ <b>Hết ATP trong chất nền</b>: Δψ vẫn hút được đầu N mang điện + vào chất nền, nhưng mtHsp70 không bám–nhả theo chu trình ATP được, nên không giữ và kéo tiếp. Chuỗi <b>trượt tới lui</b>, vắt ngang 2 màng, không vào hết.');
      api.readout(t.join('<br>') || 'Thử nghiệm: mỗi công tắc 💥 chỉ hiện ở bước liên quan. Bật lên rồi xem chuỗi dừng ở đâu.');
    }
    function show(keys) { const s = keys.join(','); if (s !== sig) { sig = s; L.only(keys); } }

    const tA = V(), tB = V(), tmp = V(), ballC = V(), atpV = V();
    const want = new Map();
    const place = (b, on, pos) => { if (on) want.set(b, pos.clone()); };
    const mod = (x, m) => ((x % m) + m) % m;

    function frame(dt, t, snap) {
      const f = ph.v, e = ease(f), keys = [];
      const noS = noSig && cur <= 2, dh = dhfr && cur >= 1 && cur <= 3, cc = cccp && (cur === 4 || cur === 5), na = noAtp && !cc && cur === 5;
      let ribo = false, emerged = N, d = 0, ball = false, cut = 0, foldK = 0, hspOn = false, msg = '', charge = false, atpAt = null;
      want.clear();
      switch (cur) {
        case 0:
          ribo = true; emerged = N * clamp(f * 1.15);
          keys.push('ribo', 'mrna', 'cyto'); if (f > 0.55 && !noS) keys.push('pre');
          if (noS) msg = '❌ Không có trình tự định hướng (không "địa chỉ")';
          break;
        case 1:
          d = X0 - 1.6; keys.push('ribo', 'post');
          if (dh) { ball = true; pathM(d - 8 * SP, ballC); keys.push('dh'); msg = '⚠️ Khối DHFR gấp chặt, Hsp70 không giữ duỗi được'; }
          else { hspOn = true; keys.push('hsp'); }
          if (!noS) keys.push('pre'); else msg = '❌ Không có trình tự định hướng (không "địa chỉ")';
          break;
        case 2:
          d = noS ? X0 - 1.6 : lerp(X0 - 1.6, X0 + 0.15, e);
          keys.push('tom20', 'tom22');
          if (dh) { ball = true; pathM(d - 8 * SP, ballC); keys.push('dh'); } else hspOn = true;
          if (noS) msg = '❌ Tom20/22 không nhận ra → ở lại tế bào chất';
          break;
        case 3:
          keys.push('tom40', 'om', 'ims');
          if (dh) {
            d = lerp(X0 + 0.15, -1.9, e); ball = true;
            pathM(X0 + 0.15 - 8 * SP, ballC).lerp(tmp.set(-4.95, 0, 0), e);
            if (f > 0.6) msg = '❌ Khối gấp chặt kẹt ở lỗ Tom40';
          } else { d = lerp(X0 + 0.15, 0.4, e); hspOn = true; }
          break;
        case 4:
          charge = true; keys.push('tim', 'psi', 'ims');
          if (cc) { d = 0.4 + 0.12 * Math.sin(t * 2); msg = '❌ Δψ = 0 (CCCP): kẹt ở khoảng gian màng'; }
          else d = lerp(0.4, 5.0, e);
          break;
        case 5:
          charge = true; keys.push('tim44', 'psi', 'mat');
          if (cc) { d = 0.4; msg = '❌ Δψ = 0 (CCCP): không gì vào được chất nền'; }
          else if (na) { d = 4.7 + 0.35 * Math.sin(t * 1.8); msg = '❌ Thiếu ATP: mtHsp70 không kéo, chuỗi trượt tới lui'; }
          else { d = lerp(5.0, D_END, e); atpAt = atpV.copy(tim44.position).add(V(0.75, 0.45, 0.4)); }
          break;
        case 6:
          d = D_END; cut = clamp((f - 0.35) / 0.5);
          keys.push('mpp'); if (cut > 0.3) keys.push('deg'); if (cut > 0.6) keys.push('noback');
          place(mpp, true, MPP_P);
          break;
        case 7:
          d = D_END; cut = 1; foldK = e;
          keys.push('fold', 'cyto', 'ims', 'mat', 'om', 'im', 'tom40', 'tim');
          break;
      }
      // beads
      const kk = snap ? 1 : 1 - Math.exp(-dt * 6);
      for (let i = 0; i < N; i++) {
        const b = beads[i]; let on = !(noS && i < PRE), sc = 1;
        let a;
        if (ribo) { a = (emerged - i) * SP; on = on && i < emerged; pathR(a, tA); }
        else { a = d - i * SP; pathM(a, tA); }
        if (i < PRE && (ribo || a < X0 + 0.2)) { const th = TH(i); tA.y -= 0.38 * Math.cos(th); tA.z += 0.38 * Math.sin(th); }
        if (ball && i >= PRE) tA.copy(FB[i - PRE]).add(ballC);
        if (i >= PRE && foldK > 0) tA.lerp(tB.copy(FB[i - PRE]).multiplyScalar(1.2).add(FOLD_C), foldK);
        if (i < PRE && cut > 0) {
          tA.lerp(tB.set(11.6 + 0.35 * i, -5.7 - 0.3 * Math.sin(i * 1.7), 0.3), ease(cut));
          sc = 1 - 0.55 * cut; on = on && cur === 6;
        }
        b.visible = on; b.scale.setScalar(sc);
        if (snap) b.position.copy(tA); else b.position.lerp(tA, kk);
      }
      for (let i = 1; i < N; i++) {
        const s = sticks[i - 1];
        s.visible = beads[i].visible && beads[i - 1].visible && !(i === PRE && cut > 0.05);
        if (s.visible) api.setStick(s, beads[i - 1].position, beads[i].position);
      }
      // cytosolic Hsp70: bound to the mature part, released once that part reaches Tom
      hsp.forEach((h, j) => {
        const bd = beads[HSPB[j]];
        place(h, hspOn && bd.visible && bd.position.x < -5.0, tmp.copy(bd.position).add(V(0, j % 2 ? -0.6 : 0.6, 0.35)));
      });
      if (cur === 1 && hspOn) atpAt = atpV.copy(beads[HSPB[0]].position).add(V(0.55, 1.1, 0.4));
      // mtHsp70 ratchet: each copy grabs the chain where it exits Tim23 and rides along, then lets go and re-grabs
      if (cur === 5 && !cc) {
        mt.forEach((h, j) => {
          if (na) { place(h, true, j ? V(7.2, -2.6, 0.4) : V(6.6, 2.4, 0.4)); return; }
          const g = 4.3 + mod(d - 5 + j * 1.5, 3.0);
          place(h, g < d - 0.2, pathM(g, tB).add(V(0, j ? -0.6 : 0.6, 0.35)));
        });
        keys.push('mthsp');
      }
      if (cur === 6 && cut < 0.4) place(mt[0], true, pathM(D_END - 9 * SP, tB).add(V(0, 0.6, 0.35)));
      for (const b of BLOBS) { const on = want.has(b); vis(b, on); b.position.lerp(on ? want.get(b) : OFF, kk); }
      // extras
      riboL.visible = riboS.visible = mrna.visible = cur <= 1;
      for (const s of plus) { s.visible = charge; s.material.color.setHex(cc ? C.grey : COL.plus); }
      for (const s of minus) { s.visible = charge; s.material.color.setHex(cc ? C.grey : COL.minus); }
      atp.visible = !!atpAt;
      if (atpAt) { atp.position.copy(atpAt); atp.scale.setScalar(1 + 0.3 * Math.sin(t * 6)); }
      setT('mthsp', na ? 'mtHsp70 thiếu ATP: không kéo' : 'mtHsp70 kéo (ATP)');
      setT('psi', cc ? 'Δψ = 0 (CCCP)' : 'Δψ: (+) ngoài, (−) chất nền');
      // label anchors
      at('pre', beads[2].position, cur === 0 ? 3.2 : 0, cur === 0 ? 0 : -1.05);
      at('hsp', hsp[0].position, 0, 1.0);
      at('dh', ballC, 0, 1.6);
      at('tom20', tom20.position, -0.4, 1.0); at('tom22', tom22.position, -0.4, -1.0);
      at('tim44', tim44.position, 1.2, -0.75);
      at('mthsp', mt[0].userData.on ? mt[0].position : mt[1].position, 0, 1.0);
      at('mpp', mpp.position, 0.4, 1.0);
      at('deg', beads[2].position, -0.6, -0.8);
      at('fold', FOLD_C, 0, -1.9);
      if (msg) { for (const k of ['om', 'im', 'psi']) { const j = keys.indexOf(k); if (j >= 0) keys.splice(j, 1); } const [, lk] = CAMS[cur]; L.get('msg').position.set(lk[0], lk[1] + 0.33 * CAMS[cur][0][2], 0); setT('msg', msg); keys.push('msg'); }
      show(keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; ph.snap(0, 1); sig = '';
        tg.sig.el.style.display = s <= 2 ? '' : 'none';
        tg.dh.el.style.display = s >= 1 && s <= 3 ? '' : 'none';
        tg.cc.el.style.display = s === 4 || s === 5 ? '' : 'none';
        tg.atp.el.style.display = s === 5 ? '' : 'none';
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
