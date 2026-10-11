// Bài 7: Khởi đầu sao chép (mô hình λ), θ ở vi khuẩn, nhiều ori ở nhân thực, cấp phép, telomere, RecBCD–Chi
import { labels, arrow, ease, lerp, clamp, progress } from './_kit.js';

const NEW = 0x34c759, RNA = 0xf2994a, HEL = 0xc77dff, OPROT = 0x2bb3a3, PPROT = 0xff453a;
const DNAK = 0x4cc9f0, DNAJ = 0xffd60a, GRPE = 0xb5179e, ORC = 0x8e7dbe, MCM = 0x9aa5b1, CDK = 0xff9f1c, GEM = 0xff453a;
const RECB = 0x2bb3a3, RECC = 0x4c6fff, RECD = 0xf72585, RECA = 0x7cf5c4, CHI = 0xffd60a, TELO = 0xff8fa3;

export default {
  title: 'Khởi đầu sao chép · RecBCD · nhân sơ vs nhân thực',
  sub: 'Sao chép bắt đầu ở đâu, ai mở khóa helicase, vì sao chỉ chép 1 lần mỗi chu kỳ, vì sao nhân thực cần hàng chục nghìn ori, vấn đề đầu mút (telomere), và RecBCD dừng ở Chi để chuyển sang sửa chữa.',
  legend: '<span><i style="background:#2bb3a3"></i>protein O</span><span><i style="background:#ff453a"></i>protein P (khóa)</span><span><i style="background:#c77dff"></i>helicase</span><span><i style="background:#34c759"></i>DNA mới</span><span><i style="background:#ffd60a"></i>Chi / DnaJ</span>',

  why: `<p>Polymerase biết <b>chép</b> nhưng không biết <b>bắt đầu ở đâu</b>. Mọi bộ gene đều có những trình tự khởi đầu gọi là <b>ori</b> (origin of replication). Tại đó, protein nhận diện ori mở xoắn cục bộ rồi "đặt" helicase lên DNA.</p>
  <p>Khởi đầu là bước <b>kiểm soát</b> chính của sao chép:</p>
  <ul><li>Phải bắt đầu <b>đúng chỗ</b>, tức tại ori.</li>
  <li>Phải bắt đầu <b>đúng lúc</b> và <b>chỉ 1 lần mỗi chu kỳ</b>. Chép thừa sẽ làm khuếch đại gene, chép thiếu sẽ làm mất đoạn.</li>
  <li>Phải có <b>đủ ori</b> để chép xong kịp thời gian.</li></ul>
  <p>Slide dùng <b>phage λ</b> làm mô hình vì cơ chế của nó đơn giản và đã được hiểu rõ: O → P–DnaB → DnaJ/DnaK/GrpE → helicase được mở khóa.</p>`,

  without: `<ul>
  <li><b>Không có protein nhận diện ori</b> (O ở λ, DnaA ở <i>E. coli</i>, ORC ở nhân thực): helicase không biết bám vào đâu, nên không có sao chép.</li>
  <li><b>Không có P "khóa" helicase</b>: DnaB tự do mở xoắn bất cứ đâu, sao chép hỗn loạn.</li>
  <li><b>Không có DnaJ/DnaK/GrpE</b>: P không được gỡ ra, helicase bị khóa mãi, ori λ không bao giờ khởi đầu. Chính vì vậy λ không sinh sôi được trong <i>E. coli</i> đột biến <i>dnaK</i>.</li>
  <li><b>Không có SeqA / cơ chế cấp phép</b>: ori bắn lại nhiều lần trong 1 chu kỳ (tái sao chép), dẫn đến khuếch đại gene và đứt gãy DNA. Đây là một nguyên nhân gây bất ổn bộ gene trong ung thư.</li>
  <li><b>Nhân thực chỉ có 1 ori</b>: 1 NST người ~150 Mb chép với tốc độ ~50 nt/s/chạc sẽ mất <b>hơn 2 tuần</b>, thay vì ~8 giờ.</li>
  <li><b>Không có telomerase</b>: NST ngắn đi sau mỗi lần phân bào, đến giới hạn (~50 lần, Hayflick) thì tế bào ngừng phân chia.</li>
  <li><b>Không có RecBCD</b>: chạc sao chép bị gãy (đứt mạch đôi) không được sửa. Vi khuẩn mất khả năng tái tổ hợp và chết nhiều sau tia UV.</li></ul>`,

  foundation: [
    { q: 'Ori có gì đặc biệt về trình tự?', a: 'Một ori điển hình có:<br>• Các đoạn lặp ngắn để protein khởi đầu bám vào (<b>iteron</b> ở λ, hộp <b>DnaA</b> ở oriC).<br>• Một vùng <b>giàu A·T</b> (DUE) để dễ mở xoắn, vì A=T chỉ có 2 liên kết H (bài 4).<br>• Ở oriC của <i>E. coli</i> còn có nhiều vị trí <b>GATC</b> để methyl hóa kiểm soát.' },
    { q: 'Protein O, P của λ tương ứng gì ở E. coli?', a: '• <b>O</b> (λ) ~ <b>DnaA</b> (<i>E. coli</i>): bám ori, mở vùng giàu AT.<br>• <b>P</b> (λ) ~ <b>DnaC</b> (<i>E. coli</i>): đưa helicase DnaB lên DNA nhưng giữ nó ở trạng thái <b>khóa</b>.<br>λ tận dụng helicase DnaB của chính vật chủ, chỉ tự mang theo protein "nạp" (O, P).' },
    { q: 'DnaK, DnaJ, GrpE là gì?', a: 'Là bộ <b>chaperone</b> của vi khuẩn:<br>• DnaK thuộc họ <b>Hsp70</b>.<br>• DnaJ thuộc họ <b>Hsp40</b>.<br>• GrpE là yếu tố trao đổi nucleotide.<br>Chúng dùng <b>ATP</b> để tháo gỡ phức hợp protein. Ở đây chúng kéo P ra khỏi DnaB để "mở khóa" helicase. Đây cũng là chaperone dùng để gấp protein (bài 17, 18).' },
    { q: 'Sao chép "2 chiều" (bidirectional) nghĩa là gì?', a: 'Từ 1 ori, <b>2 chạc ba</b> đi ra 2 hướng ngược nhau. Vùng đã chép ở giữa có hình con mắt, gọi là <b>bóng sao chép</b> (replication bubble). Ở DNA vòng, nhìn tổng thể giống chữ <b>θ</b> (theta).' },
    { q: 'Cấp phép (licensing) là gì?', a: 'Ở nhân thực, mỗi ori phải được "cấp phép" ở <b>pha G1</b>: <b>ORC</b> + Cdc6 + Cdt1 nạp <b>MCM</b> thành vòng đôi bao quanh DNA (chưa hoạt động).<br>Sang <b>pha S</b>, kinase <b>CDK</b> và <b>DDK</b> kích hoạt MCM, đồng thời gắn thêm Cdc45 + GINS thành helicase <b>CMG</b>.<br>CDK cao trong S/G2/M ngăn cấp phép lại, nên mỗi ori chỉ bắn <b>1 lần</b>.' },
    { q: 'Telomere là gì?', a: 'Là đoạn lặp ở đầu mút NST thẳng. Ở người là <b>TTAGGG</b> lặp lại, dài ~5–15 kb, kết thúc bằng một <b>đuôi 3′ sợi đơn</b> giàu G.<br>Telomere được phức hợp <b>shelterin</b> bảo vệ (tạo vòng T-loop), để tế bào không nhầm đầu mút NST là đứt gãy mạch đôi.' },
    { q: 'Telomerase khác DNA polymerase thường ở đâu?', a: 'Telomerase là một <b>enzyme phiên mã ngược</b> (TERT), mang sẵn <b>khuôn RNA của chính nó</b> (TERC, chứa 3′-CAAUCCCAAUC-5′). Nó kéo dài <b>đầu 3′</b> của mạch giàu G mà <b>không cần khuôn DNA</b>. Sau đó primase/Pol α tổng hợp mạch bổ sung.' },
    { q: 'Chi là gì?', a: '<b>Chi</b> (χ, crossover hotspot instigator) là trình tự 8 nt <b>5′-GCTGGTGG-3′</b>. Nó xuất hiện nhiều bất thường trong bộ gene <i>E. coli</i> (~1 lần/5 kb). RecBCD nhận ra Chi khi đi tới từ phía 3′ của nó. Tại đó RecBCD đổi từ chế độ "phá hủy" sang chế độ "sửa chữa".' },
  ],

  steps: [
    { title: 'oriλ: protein O bám vào ori', text: 'Ori của phage λ có <b>4 đoạn lặp (iteron)</b> (vùng vàng) và cạnh đó là một vùng <b>giàu A·T</b>.<br>Các dimer <b>protein O</b> bám vào iteron và tụ lại thành khối <b>"O-some"</b>. Khối này làm DNA cong và gây <b>mở xoắn nhẹ</b> ở vùng giàu AT bên cạnh.<br>Lúc này <b>chưa có helicase</b>, và chưa có sao chép.' },
    { title: 'P đưa helicase DnaB tới, nhưng KHÓA nó', text: '<b>Protein P</b> bám vào helicase <b>DnaB</b> (của vật chủ <i>E. coli</i>) và đưa nó tới ori nhờ tương tác <b>P–O</b>.<br>Nhưng khi còn P bám, DnaB <b>bị khóa</b> 🔒: không tháo xoắn được. Đây là chốt an toàn để helicase không mở DNA bừa bãi trước khi mọi thứ sẵn sàng.' },
    { title: 'DnaJ, DnaK, GrpE gỡ P → helicase hoạt động', text: 'Bộ chaperone <b>DnaJ (Hsp40), DnaK (Hsp70), GrpE</b> đến và dùng <b>ATP</b> kéo P ra khỏi DnaB.<br>DnaB được <b>mở khóa</b>: 2 vòng helicase đi ra 2 phía, tháo xoắn và tạo <b>bóng sao chép</b>. Primase đặt mồi, Pol III bắt đầu chép. Từ đây có <b>2 chạc ba</b> → <b>sao chép 2 chiều</b>.<br>Trình tự: <b>oriλ → O bám → P + DnaB tới → DnaJ/K/GrpE gỡ P → sao chép</b>.' },
    { title: 'Vi khuẩn: 1 ori, 2 chạc, hình θ', text: 'NST <i>E. coli</i> là <b>DNA vòng</b> 4,6 Mb, chỉ có <b>1 ori</b> (oriC). Hai chạc đi ngược chiều quanh vòng, tạo hình <b>θ</b>, và gặp nhau ở vùng <b>ter</b> đối diện (protein <b>Tus</b> chặn chạc).<br>Mỗi chạc ~1000 nt/s, nên chép xong trong <b>~40 phút</b> (thời gian không đổi).<br><b>Kiểm soát bằng methyl hóa</b>: ngay sau khi chép, các GATC ở oriC chỉ được methyl hóa trên mạch cũ (<b>bán methyl hóa</b>). <b>SeqA</b> bám vào và che oriC, ngăn khởi đầu lại. Bật <b>🧬 Đột biến seqA⁻</b> để xem điều gì xảy ra.' },
    { title: 'Nhân thực: nhiều ori, bóng sao chép hợp nhất', text: 'NST nhân thực <b>thẳng</b> và rất dài, polymerase lại chậm hơn (~50 nt/s). Vì vậy cần <b>rất nhiều ori</b> (người có ~30 000–50 000 ori).<br>Mỗi ori mở ra một <b>bóng sao chép</b> với 2 chạc. Các bóng lớn dần rồi <b>hợp nhất</b>.<br>Có ori <b>sớm</b> (vùng gene đang hoạt động, euchromatin) và ori <b>muộn</b> ("late origin", thường ở dị nhiễm sắc). Thời gian chép <b>phụ thuộc trạng thái tế bào</b>.<br>Bật <b>Chỉ 1 ori</b> để thấy vì sao không thể làm như vi khuẩn.' },
    { title: 'Cấp phép: mỗi ori chỉ bắn 1 lần', text: '<b>G1, cấp phép</b>: <b>ORC</b> bám ori; Cdc6 và Cdt1 nạp 2 vòng <b>MCM</b> thành vòng đôi ôm DNA. MCM <b>chưa hoạt động</b>.<br><b>Pha S, bắn</b>: <b>CDK</b> và <b>DDK</b> phosphoryl hóa, gắn thêm Cdc45 + GINS tạo helicase <b>CMG</b>. Hai CMG đi ngược chiều, mở bóng sao chép.<br><b>Sau đó</b>: CDK cao và <b>geminin</b> (bám Cdt1) ngăn nạp MCM mới. Ori đã bắn không thể bắn lại cho đến G1 của chu kỳ sau.<br>(Nhân sơ kiểm soát bằng <b>methyl hóa ori</b>, nhân thực bằng <b>phức hợp protein</b>.)' },
    { title: 'Vấn đề đầu mút & telomerase', text: '<i>(Mở rộng, không có trong slide)</i> Ở đầu NST thẳng, mạch mới cuối cùng là <b>mạch chậm</b>. Đoạn Okazaki cuối bắt đầu bằng một <b>mồi RNA</b> ở tận đầu mút. Khi mồi bị gỡ, <b>không có 3′-OH phía trước</b> để polymerase lấp lại, nên mỗi lần sao chép NST <b>ngắn đi</b>.<br>Bật <b>🧪 Telomerase</b>: enzyme mang <b>khuôn RNA riêng</b> nối thêm TTAGGG vào đầu 3′. Sau đó mạch bổ sung được lấp, chiều dài được giữ.<br>Kéo thanh <b>Số lần phân bào</b> để xem telomere ngắn dần.' },
    { title: 'RecBCD và Chi: từ "phá" sang "sửa"', text: 'Khi chạc sao chép bị gãy (đứt mạch đôi), <b>RecBCD</b> bám vào đầu đứt:<br>• <b>RecB</b>: động cơ <b>3′→5′</b> + <b>nuclease</b>. <b>RecD</b>: động cơ <b>5′→3′</b>. <b>RecC</b>: nối 2 động cơ, <b>nhận diện Chi</b>.<br>• Trước Chi: vừa tháo xoắn vừa <b>cắt vụn</b> mạch đầu 3′ (đây cũng là cách diệt DNA virus lạ).<br>• Gặp Chi (<b>5′-GCTGGTGG-3′</b>): RecC giữ Chi lại, nuclease <b>ngừng cắt mạch 3′</b>, chuyển sang cắt mạch 5′. Kết quả là một <b>đuôi 3′ sợi đơn</b>.<br>• RecBCD <b>nạp RecA</b> lên đuôi 3′. Sợi RecA đi tìm đoạn tương đồng để <b>tái tổ hợp sửa đứt gãy</b> (bài 8) và khởi động lại chạc.' },
  ],

  application: `<ul>
  <li><b>Phage λ</b> là công cụ kinh điển của sinh học phân tử (vector nhân dòng, hệ tái tổ hợp λ Red). λ còn mang protein <b>Gam</b> để <b>ức chế RecBCD</b>, bảo vệ DNA của chính nó khỏi bị cắt vụn.</li>
  <li><b>Kháng sinh mới</b>: DnaA, DnaB, DnaG của vi khuẩn khác hẳn ORC/MCM của người, nên là đích thuốc tiềm năng.</li>
  <li><b>Ung thư</b>: tái sao chép do mất kiểm soát cấp phép (Cdt1, Cdc6 tăng cao) gây <b>khuếch đại gene</b> và bất ổn bộ gene. ~85–90% khối u <b>bật lại telomerase</b> để phân chia vô hạn, nên telomerase là đích thuốc (imetelstat).</li>
  <li><b>Lão hóa</b>: giới hạn Hayflick (~50 lần phân bào) gắn với telomere ngắn dần. Đột biến telomerase gây bệnh <b>dyskeratosis congenita</b> và xơ phổi.</li>
  <li><b>Hóa trị</b>: nhiều thuốc gây gãy chạc sao chép (camptothecin, cisplatin). Tế bào sống sót nhờ con đường sửa giống RecBCD–RecA (ở người là MRN, CtIP, BRCA2–RAD51). Vì vậy khối u thiếu <b>BRCA</b> rất nhạy với thuốc ức chế <b>PARP</b>.</li>
  <li><b>Kỹ thuật</b>: Chi và RecBCD được dùng trong các hệ "recombineering" để chỉnh sửa gene vi khuẩn.</li></ul>`,

  distinguish: `<h3>Sao chép ở nhân sơ và nhân chuẩn (bảng slide, rất dễ ra thi)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Nhân sơ</th><th>Nhân chuẩn</th></tr>
  <tr><td>DNA vòng</td><td>NST DNA thẳng</td></tr>
  <tr><td><b>1 ori</b></td><td><b>Nhiều ori</b> (có ori muộn)</td></tr>
  <tr><td>Nhanh (phút)</td><td>Chậm (giờ)</td></tr>
  <tr><td>Thời gian sao chép không đổi</td><td>Phụ thuộc trạng thái tế bào</td></tr>
  <tr><td colspan="2" style="text-align:center"><i>Giống nhau: có phức hợp protein sao chép</i></td></tr>
  <tr><td>1 loại DNA polymerase (Pol III chính)</td><td>3 loại: α (mồi), δ (mạch chậm), ε (mạch dẫn)</td></tr>
  <tr><td>Primase tự do (DnaG)</td><td>Primase gắn với Pol α</td></tr>
  <tr><td colspan="2" style="text-align:center"><i>Giống nhau: DNA polymerase bám khuôn; có cơ chế sửa chữa</i></td></tr>
  <tr><td>Kiểm soát khởi đầu bằng <b>methyl hóa ori</b> (Dam/SeqA)</td><td>Kiểm soát bằng <b>phức hợp protein</b> (ORC, MCM, CDK, geminin)</td></tr>
  <tr><td>Kết thúc tại trình tự xác định (ter/Tus)</td><td>Kết thúc tại trình tự xác định, hoặc khi 2 chạc gặp nhau giữa các ori</td></tr></table></div>
  <h3>Các protein khởi đầu: λ, E. coli, nhân thực</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Vai trò</th><th>Phage λ</th><th>E. coli</th><th>Nhân thực</th></tr>
  <tr><td>Nhận diện ori</td><td>O</td><td>DnaA</td><td>ORC</td></tr>
  <tr><td>Nạp helicase (giữ khóa)</td><td>P</td><td>DnaC</td><td>Cdc6, Cdt1</td></tr>
  <tr><td>Helicase</td><td>DnaB (của vật chủ)</td><td>DnaB</td><td>MCM → CMG</td></tr>
  <tr><td>Mở khóa / kích hoạt</td><td>DnaJ, DnaK, GrpE (ATP)</td><td>DnaC rời đi khi có mồi</td><td>CDK + DDK</td></tr></table></div>
  <h3>Telomerase và DNA polymerase</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>DNA polymerase</th><th>Telomerase</th></tr>
  <tr><td>Khuôn</td><td>DNA (mạch khuôn ngoài)</td><td><b>RNA của chính nó</b> (TERC)</td></tr>
  <tr><td>Loại enzyme</td><td>DNA-dependent DNA pol</td><td><b>Phiên mã ngược</b> (RNA-dependent DNA pol)</td></tr>
  <tr><td>Cần mồi?</td><td>Có</td><td>Dùng chính đầu 3′ của NST làm "mồi"</td></tr>
  <tr><td>Sản phẩm</td><td>Bản sao của khuôn</td><td>Đoạn lặp TTAGGG thêm vào đầu 3′</td></tr></table></div>
  <h3>RecBCD trước và sau Chi</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Trước Chi</th><th>Sau Chi</th></tr>
  <tr><td>Mạch đầu 3′</td><td>Bị cắt vụn liên tục</td><td><b>Được giữ lại</b> (đuôi 3′ có Chi)</td></tr>
  <tr><td>Mạch đầu 5′</td><td>Ít bị cắt</td><td>Bị cắt</td></tr>
  <tr><td>RecA</td><td>Chưa nạp</td><td><b>Nạp lên đuôi 3′</b> → tìm đoạn tương đồng</td></tr>
  <tr><td>Ý nghĩa</td><td>Phá DNA lạ (virus)</td><td>Sửa đứt gãy mạch đôi bằng tái tổ hợp</td></tr></table></div>`,

  traps: [
    { trap: 'Protein P hoạt hóa helicase DnaB.', truth: 'P <b>khóa</b> DnaB (đưa tới ori nhưng giữ nó không hoạt động). DnaJ, DnaK, GrpE <b>gỡ P ra</b> thì DnaB mới hoạt động.' },
    { trap: 'Protein O là helicase của λ.', truth: 'O chỉ <b>nhận diện và bám ori</b> (iteron). Helicase là <b>DnaB</b>, mượn của vật chủ <i>E. coli</i>.' },
    { trap: 'Sao chép θ là sao chép 1 chiều.', truth: 'θ là <b>2 chiều</b>: từ 1 ori có 2 chạc đi ngược nhau quanh vòng DNA, gặp nhau ở vùng ter.' },
    { trap: 'NST nhân chuẩn có 1 ori như vi khuẩn nhưng to hơn.', truth: 'Nhân chuẩn có <b>nhiều ori</b> trên mỗi NST (người ~30 000–50 000 ori). Nếu chỉ 1 ori thì mất hàng tuần mới chép xong.' },
    { trap: 'Nhân sơ kiểm soát khởi đầu bằng phức hợp protein, nhân chuẩn bằng methyl hóa.', truth: 'Ngược lại: <b>nhân sơ = methyl hóa ori</b> (GATC bán methyl hóa, SeqA). <b>Nhân chuẩn = phức hợp protein</b> (ORC/MCM, CDK, geminin).' },
    { trap: 'Ori muộn (late origin) là ori bị hỏng, không hoạt động.', truth: 'Ori muộn vẫn hoạt động, chỉ <b>bắn muộn hơn trong pha S</b> (thường ở dị nhiễm sắc).' },
    { trap: 'Telomerase dùng mạch DNA làm khuôn để kéo dài telomere.', truth: 'Telomerase dùng <b>khuôn RNA của chính nó</b> (phiên mã ngược) để nối TTAGGG vào <b>đầu 3′</b>.' },
    { trap: 'NST ngắn dần vì mạch dẫn không chép hết đầu mút.', truth: 'Vấn đề nằm ở <b>mạch chậm</b>: mồi RNA cuối cùng ở tận đầu mút bị gỡ mà không có 3′-OH phía trước để lấp lại.' },
    { trap: 'Sau khi gặp Chi, RecBCD cắt mạch 3′ mạnh hơn.', truth: 'Sau Chi, RecBCD <b>ngừng cắt mạch 3′</b>, giữ lại đuôi 3′ có Chi, và nạp <b>RecA</b> lên đó. Nuclease chuyển sang cắt mạch 5′.' },
    { trap: 'RecD là động cơ 3′→5′ và mang nuclease.', truth: '<b>RecB</b>: động cơ 3′→5′ + nuclease. <b>RecD</b>: động cơ 5′→3′. <b>RecC</b>: nhận diện Chi.' },
  ],

  quiz: [
    { q: 'Thứ tự đúng của khởi đầu sao chép ở phage λ là:', ops: ['P bám ori → O + DnaB → DnaK gỡ O', 'O bám oriλ → P + DnaB được đưa tới → DnaJ/DnaK/GrpE gỡ P → sao chép', 'DnaB bám ori → O khóa DnaB → P mở khóa', 'DnaJ bám ori → DnaB → O → P'], a: 1, e: 'O nhận diện ori, P đưa DnaB tới nhưng khóa nó, chaperone DnaJ/K/GrpE dùng ATP gỡ P để mở khóa helicase.' },
    { q: 'Vai trò của protein P trong khởi đầu sao chép λ là:', ops: ['Tháo xoắn DNA', 'Đưa helicase DnaB tới ori và giữ nó ở trạng thái bị khóa', 'Tổng hợp mồi RNA', 'Nối các đoạn Okazaki'], a: 1, e: 'P giống DnaC của E. coli: nạp DnaB nhưng ức chế nó cho đến khi được chaperone gỡ ra.' },
    { q: 'Điểm nào sau đây ĐÚNG với sao chép ở nhân chuẩn?', ops: ['DNA vòng, 1 ori', 'Thời gian sao chép không đổi', 'Nhiều ori, thời gian sao chép phụ thuộc trạng thái tế bào', 'Kiểm soát khởi đầu bằng methyl hóa ori'], a: 2, e: 'Nhân chuẩn: NST thẳng, nhiều ori (có ori muộn), chậm, phụ thuộc trạng thái tế bào, kiểm soát bằng phức hợp protein.' },
    { q: 'Ở E. coli, cơ chế nào ngăn oriC khởi đầu lại ngay sau khi vừa sao chép?', ops: ['Telomerase', 'SeqA bám vào oriC đang bán methyl hóa', 'Geminin bám Cdt1', 'RecBCD cắt oriC'], a: 1, e: 'Sau khi chép, GATC ở oriC chỉ methyl hóa trên mạch cũ. SeqA bám vào DNA bán methyl hóa và che oriC.' },
    { q: 'Ở nhân thực, "cấp phép" (licensing) ori xảy ra ở pha nào và gồm gì?', ops: ['Pha S, nạp DnaB', 'Pha G1, ORC + Cdc6 + Cdt1 nạp vòng đôi MCM', 'Pha M, telomerase kéo dài đầu mút', 'Pha G2, CDK nạp MCM'], a: 1, e: 'G1: nạp MCM (chưa hoạt động). Pha S: CDK + DDK kích hoạt thành CMG. CDK cao ngăn cấp phép lại.' },
    { q: 'Vì sao NST thẳng ngắn đi sau mỗi lần sao chép (khi không có telomerase)?', ops: ['Mạch dẫn dừng sớm', 'Mồi RNA cuối của mạch chậm ở đầu mút bị gỡ mà không lấp lại được', 'Helicase không mở được đầu mút', 'Ligase không hoạt động ở đầu mút'], a: 1, e: 'Polymerase cần 3′-OH phía trước để lấp. Ở tận đầu mút không có, nên khoảng trống của mồi cuối cùng không lấp được.' },
    { q: 'Tiểu phần nào của RecBCD nhận diện trình tự Chi?', ops: ['RecA', 'RecB', 'RecC', 'RecD'], a: 2, e: 'RecC liên kết RecB với RecD và nhận diện Chi (5′-GCTGGTGG-3′). RecB là động cơ 3′→5′ + nuclease, RecD là động cơ 5′→3′.' },
    { q: 'Sau khi RecBCD gặp Chi, sản phẩm dùng cho tái tổ hợp là:', ops: ['Đuôi 5′ sợi đơn phủ SSB', 'Đuôi 3′ sợi đơn có Chi, được phủ RecA', 'DNA mạch kép nguyên vẹn', 'Mồi RNA'], a: 1, e: 'Chi làm RecBCD ngừng cắt mạch 3′ và nạp RecA lên đuôi 3′. Sợi RecA–ssDNA đi tìm đoạn tương đồng.' },
  ],

  recall: [
    'Không nhìn: viết chuỗi khởi đầu λ (4 mũi tên) và nói vai trò của từng protein. P khóa hay mở DnaB?',
    'Tự kẻ lại bảng nhân sơ – nhân chuẩn (8 dòng + 2 dòng "giống nhau") từ trí nhớ, rồi so với bảng ở phần Phân biệt.',
    'Vẽ RecBCD đi trên DNA: ghi RecB (3′→5′, nuclease), RecD (5′→3′), RecC (Chi). Vẽ chuyện gì xảy ra trước và sau Chi.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const ghost = (col, r, sc, seed, parent, op = 0.75) => api.blob(r, col, parent, { seed, scale: sc, mat: { opacity: op } });
    const ring = (parent, col, r = 0.42, s = 0.17) => { const g = api.group(parent); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; api.sphere(s, col, g, { opacity: 0.9 }).position.set(0, Math.cos(a) * r, Math.sin(a) * r); } return g; };
    const tint = (g, col) => g.traverse(o => { if (o.material) o.material.color.setHex(col); });

    // ===================== A) oriλ (steps 0–2) =====================
    const lamG = api.group();
    const LSEQ = 'GCGTCCCTCAAAATCCCTCAAAATCCCTCAAAATCCCTCAATATAAATTTAATATAAGCGC';
    const ld = api.dna({ seq: LSEQ, rise: 0.27, radius: 0.55, turn: 10.5, parent: lamG, splitY: 0.9, openR: 0.15 });
    const ITER = [[4, 9], [13, 18], [22, 27], [31, 36]], ATR = [40, 56];
    ITER.forEach(([a, b]) => { const bx = api.box((b - a) * 0.27, 1.5, 1.5, 0xffd60a, lamG, { opacity: 0.14, depthWrite: false }); bx.position.x = (ld.xOf(a) + ld.xOf(b - 1)) / 2; });
    const atBox = api.box((ATR[1] - ATR[0]) * 0.27, 1.5, 1.5, 0xff6b6b, lamG, { opacity: 0.08, depthWrite: false }); atBox.position.x = (ld.xOf(ATR[0]) + ld.xOf(ATR[1] - 1)) / 2;
    const Os = ITER.map(([a, b], k) => {
      const g = api.group(lamG); ghost(OPROT, 0.38, [1, 0.9, 0.9], k * 2, g); ghost(OPROT, 0.38, [1, 0.9, 0.9], k * 2 + 1, g).position.x = 0.55;
      const home = V((ld.xOf(a) + ld.xOf(b - 1)) / 2 - 0.25, k % 2 ? -0.95 : 0.95, k % 2 ? 0.35 : -0.35);
      const from = V(home.x + (k - 1.5) * 1.2, home.y * 4.5, 1.5);
      return { g, home, from, some: V(-1.2 + k * 0.55 - 0.25, (k % 2 ? -0.8 : 0.8), 0.3 * (k - 1.5)) };
    });
    const atX = (ld.xOf(ATR[0]) + ld.xOf(ATR[1] - 1)) / 2;
    const Bs = [0, 1].map(k => {
      const g = api.group(lamG); const r = ring(g, HEL, 0.82, 0.2);
      const p = ghost(PPROT, 0.36, [1, 1, 1], 20 + k, g); p.position.set(0, k ? -1.2 : 1.2, 0.2);
      return { g, r, p, home: V(atX - 1.0 + k * 2.0, 0, 0), from: V(atX + (k ? 3 : -2), k ? -4.5 : 4.5, 1) };
    });
    const chap = [[DNAJ, 0.25, 'DnaJ'], [DNAK, 0.42, 'DnaK'], [GRPE, 0.3, 'GrpE']].map(([c, r, n], k) => { const m = ghost(c, r, [1, 1, 1], 30 + k, lamG); return { m, n }; });
    const atp = api.sphere(0.2, 0xffffff, lamG, { emissive: 0xffd60a, emissiveIntensity: 1, opacity: 0 });
    lb.add('a_iter', 'iteron × 4', [ld.xOf(20), 1.55, 0], lamG, 'dim');
    lb.add('a_at', 'vùng giàu A·T', [atX, 1.55, 0], lamG, 'dim');
    lb.add('a_O', 'protein O → "O-some"', [ld.xOf(20), -2.25, 0], lamG, '');
    lb.add('a_P', '🔒 P khóa DnaB', [atX, 2.6, 0], lamG, 'warn');
    lb.add('a_B', 'helicase DnaB', [atX + 1.6, -2.1, 0], lamG, '');
    lb.add('a_chap', 'DnaJ + DnaK + GrpE (ATP)', [atX, 3.0, 0], lamG, 'good');
    lb.add('a_go', '2 chạc ← → sao chép 2 chiều', [atX, -2.6, 0], lamG, 'good');
    lb.add('a_melt', 'mở xoắn nhẹ', [atX, -1.55, 0], lamG, 'plain');

    // ===================== B) θ in E. coli (step 3) =====================
    const thG = api.group();
    const RC = 3.0;
    const arcs = {};
    const mkArc = (key, col) => { const m = new THREE.Mesh(new THREE.TorusGeometry(RC, 0.06, 6, 8, 0.1), api.mat(col)); thG.add(m); arcs[key] = m; return m; };
    ['p1', 'p2'].forEach((k, i) => mkArc(k, i ? C.dna2 : C.dna1));
    ['d1o', 'd1n', 'd2o', 'd2n'].forEach(k => mkArc(k, k.endsWith('n') ? NEW : (k.startsWith('d1') ? C.dna1 : C.dna2)));
    const setArc = (m, r, z, a0, len) => {
      m.geometry.dispose(); m.geometry = new THREE.TorusGeometry(r, 0.06, 6, Math.max(4, Math.round(len * 14)), Math.max(0.001, len));
      m.rotation.z = a0; m.position.z = z; m.visible = len > 0.01;
    };
    const forks = [0, 1].map(() => api.sphere(0.22, HEL, thG, { emissive: HEL, emissiveIntensity: 0.4 }));
    const forks2 = [0, 1].map(() => api.sphere(0.16, 0xff453a, thG, { emissive: 0xff453a, emissiveIntensity: 0.6 }));
    const seqA = [0, 1].map(k => ghost(0xffd60a, 0.26, [1, 1, 1], 40 + k, thG, 0.9));
    const oriM = api.box(0.16, 0.5, 0.3, 0xffffff, thG); oriM.position.set(0, RC, 0);
    const terM = api.box(0.16, 0.5, 0.3, 0xff9f1c, thG); terM.position.set(0, -RC, 0);
    lb.add('b_ori', 'oriC (1 ori)', [0, RC + 0.75, 0], thG, 'big');
    lb.add('b_ter', 'ter (Tus chặn chạc)', [0, -RC - 0.7, 0], thG, '');
    lb.add('b_f1', 'chạc', [0, 0, 0], thG, 'plain'); lb.add('b_f2', 'chạc', [0, 0, 0], thG, 'plain');
    lb.add('b_seqA', 'SeqA che oriC bán methyl hóa', [3.1, RC + 0.6, 0], thG, 'good');
    lb.add('b_bad', '⚠️ không có SeqA: oriC bắn lại, chép chồng chép', [0, 0.4, 0], thG, 'warn');
    lb.add('b_info', 'DNA vòng 4,6 Mb', [0, -0.3, 0], thG, 'dim');

    // ===================== C) eukaryotic multi-ori (step 4) =====================
    const euG = api.group();
    const XL = -7.2, XR = 7.2, VF = 0.36;
    const ORIS = [[-6.2, 0.2, 0], [-4.4, 2.6, 1], [-2.6, 0.6, 0], [-0.7, 3.4, 1], [0.9, 0.0, 0], [2.7, 1.9, 1], [4.5, 0.4, 0], [6.3, 2.9, 1]];
    ORIS.forEach(([x, , late]) => { const m = api.cylinder(0, 0.16, 0.3, late ? 0xff9f1c : NEW, euG); m.position.set(x, -0.75, 0); });
    const POOL = 10;
    const segs = Array.from({ length: POOL }, () => api.cylinder(0.08, 0.08, 1, 0x8fa4c9, euG));
    segs.forEach(s => s.rotation.z = Math.PI / 2);
    const bubs = Array.from({ length: POOL }, () => {
      const g = api.group(euG);
      const top = api.cylinder(0.08, 0.08, 1, C.dna1, g), bot = api.cylinder(0.08, 0.08, 1, C.dna2, g);
      const topN = api.cylinder(0.05, 0.05, 1, NEW, g), botN = api.cylinder(0.05, 0.05, 1, NEW, g);
      [top, bot, topN, botN].forEach(m => m.rotation.z = Math.PI / 2);
      const fl = api.sphere(0.13, HEL, g), fr = api.sphere(0.13, HEL, g);
      const sl = [0, 1, 2, 3].map(() => api.stick(V(), V(1, 0, 0), 0.07, 0x8fa4c9, g));
      return { g, top, bot, topN, botN, fl, fr, sl };
    });
    lb.add('c_early', 'ori sớm', [-2.6, -1.3, 0], euG, 'good');
    lb.add('c_late', 'ori muộn (late origin)', [2.7, -1.3, 0], euG, '');
    lb.add('c_bub', 'bóng sao chép', [0, 1.0, 0], euG, '');
    lb.add('c_t', '', [0, 2.1, 0], euG, 'big');
    lb.add('c_l', 'NST thẳng = 1 phân tử DNA rất dài', [-1.0, -2.0, 0], euG, 'dim');

    // ===================== D) licensing (step 5) =====================
    const liG = api.group();
    const lid = api.dna({ seq: 'ATGCATTTAAATATTTAAAGCATGCGCAT', rise: 0.42, radius: 0.55, turn: 10.5, parent: liG, splitY: 0.9, openR: 0.1 });
    const orc = ghost(ORC, 0.7, [1.3, 0.8, 0.9], 50, liG, 0.8); orc.position.set(-0.2, 1.25, 0);
    const cdc6 = ghost(0x06d6a0, 0.33, [1, 1, 1], 51, liG), cdt1 = ghost(0xef476f, 0.33, [1, 1, 1], 52, liG);
    const mcms = [0, 1].map(k => { const r = ring(liG, MCM, 0.78, 0.26); r.rotation.y = 0; return r; });
    const gins = [0, 1].map(k => ghost(0xffd166, 0.3, [1, 1, 1], 53 + k, liG));
    const kin = [CDK, 0xf78c6b].map((c, k) => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), api.mat(c, { emissive: c, emissiveIntensity: 0.5 })); liG.add(m); return m; });
    const gem = ghost(GEM, 0.36, [1, 1, 1], 56, liG);
    const mcmX = ring(liG, MCM, 0.78, 0.26);
    lb.add('d_phase', '', [0, 3.1, 0], liG, 'big');
    lb.add('d_orc', 'ORC', [-0.2, 2.2, 0], liG, '');
    lb.add('d_mcm', 'vòng đôi MCM (chưa hoạt động)', [0, -1.7, 0], liG, '');
    lb.add('d_cmg', 'CMG = Cdc45 + MCM + GINS', [0, -1.7, 0], liG, 'good');
    lb.add('d_kin', 'CDK + DDK', [0, 2.3, 0], liG, '');
    lb.add('d_gem', 'geminin + CDK chặn ✗', [3.4, 2.2, 0], liG, 'warn');

    // ===================== E) telomere (step 6) =====================
    const teG = api.group();
    const tcl = api.group(teG); tcl.position.y = 1.2;
    const BW = 0.26, X0 = -7.0;
    const NT = 34, NEXT = 12;
    const topB = [], botB = [], extB = [], extN = [];
    for (let i = 0; i < NT + NEXT; i++) {
      const b = api.box(BW * 0.88, 0.28, 0.32, i < NT ? C.dna1 : 0x9fc0ff, tcl); b.position.set(X0 + i * BW, 0.32, 0);
      (i < NT ? topB : extB).push(b);
    }
    for (let i = 0; i < NT + NEXT; i++) {
      const b = api.box(BW * 0.88, 0.28, 0.32, NEW, tcl); b.position.set(X0 + i * BW, -0.32, 0);
      (i < NT ? botB : extN).push(b);
    }
    const PRIM_END = [NT - 4, NT], PRIM2 = [NT + NEXT - 4, NT + NEXT];
    const tase = ghost(0x7b2cbf, 0.75, [1.6, 1.0, 1.0], 60, tcl, 0.45);
    const tRNA = api.box(1.6, 0.12, 0.12, RNA, tcl);
    const tChr = api.group(teG); tChr.position.y = -2.4;
    const arm = api.cylinder(0.42, 0.42, 7, 0x8e7dbe, tChr); arm.rotation.z = Math.PI / 2;
    const capL = api.cylinder(0.43, 0.43, 1, TELO, tChr), capR = api.cylinder(0.43, 0.43, 1, TELO, tChr);
    capL.rotation.z = capR.rotation.z = Math.PI / 2;
    lb.add('e_3', '3′ (đuôi giàu G)', [X0 + NT * BW + 0.4, 1.15 + 1.2, 0], teG, 'plain');
    lb.add('e_5', '5′', [X0 + NT * BW - 1.0, -0.95 + 1.2, 0], teG, 'plain');
    lb.add('e_msg', '', [-1.5, 4.1, 0], teG, 'big');
    lb.add('e_gap', 'khoảng trống không lấp được', [X0 + (NT - 2) * BW, -0.4, 0], teG, 'warn');
    lb.add('e_tase', 'telomerase (khuôn RNA riêng)', [X0 + NT * BW + 1.2, 2.6 + 1.2, 0], teG, 'good');
    lb.add('e_tel', 'telomere', [4.9, -1.5, 0], teG, '');
    lb.add('e_cnt', '', [0, -3.5, 0], teG, '');

    // ===================== F) RecBCD–Chi (step 7) =====================
    const reG = api.group();
    const CHI_I = 16;
    let rseq = 'ATTCGATCAGTACGAT' + 'GGTGGTCG' + 'ATCGTAGCTAGC';
    const rd = api.dna({ seq: rseq, rise: 0.36, radius: 0.55, turn: 10.5, parent: reG, splitY: 1.25, openR: 0.2 });
    const NR = rseq.length;
    const chiBox = api.box(8 * 0.36, 1.5, 1.5, CHI, reG, { opacity: 0.16, depthWrite: false }); chiBox.position.x = (rd.xOf(CHI_I) + rd.xOf(CHI_I + 7)) / 2;
    const rbcd = api.group(reG);
    const rB = ghost(RECB, 0.55, [1, 1.1, 1], 70, rbcd, 0.7); rB.position.set(0.1, 0.75, 0);
    const rC = ghost(RECC, 0.6, [1.1, 1, 1], 71, rbcd, 0.7); rC.position.set(0.35, 0, 0.35);
    const rD = ghost(RECD, 0.5, [1, 1, 1], 72, rbcd, 0.7); rD.position.set(0.1, -0.8, 0);
    const nuc = api.sphere(0.2, 0xff453a, rbcd, { emissive: 0xff453a, emissiveIntensity: 0.6 }); nuc.position.set(-0.45, 1.1, 0.3);
    const recA = Array.from({ length: 14 }, (_, k) => api.sphere(0.26, RECA, reG, { opacity: 0.95, emissive: RECA, emissiveIntensity: 0.35 }));
    const debris = Array.from({ length: 18 }, () => ({ m: api.sphere(0.08, C.dna1, reG), v: V(), life: 0 }));
    lb.add('f_B', 'RecB: 3′→5′ + nuclease', [0, 2.4, 0], reG, '');
    lb.add('f_D', 'RecD: 5′→3′', [0, -2.3, 0], reG, '');
    lb.add('f_C', 'RecC: nhận Chi', [0, 0, 0], reG, 'dim');
    lb.add('f_chi', 'Chi 5′-GCTGGTGG-3′ (đọc ←)', [chiBox.position.x, -1.5, 0], reG, 'warn');
    lb.add('f_t3', '3′', [rd.xOf(0) - 0.5, 0.75, 0], reG, 'plain'); lb.add('f_b5', '5′', [rd.xOf(0) - 0.5, -0.75, 0], reG, 'plain');
    lb.add('f_end', 'đầu đứt mạch đôi', [rd.xOf(0) - 0.4, 1.6, 0], reG, 'dim');
    lb.add('f_msg', '', [0, 3.9, 0], reG, 'big');
    lb.add('f_recA', 'RecA phủ đuôi 3′ → tìm đoạn tương đồng (bài 8)', [-0.5, -3.1, 0], reG, 'good');

    // ===================== controls =====================
    let cur = 0, seqAoff = false, oneOri = false, telo = false, nDiv = 0;
    const pr = progress(1 / 4);
    const tSeqA = api.toggle('🧬 Đột biến seqA⁻', false, (v) => { seqAoff = v; tA = 0; });
    const tOne = api.toggle('Chỉ 1 ori (như vi khuẩn)', false, (v) => { oneOri = v; tE = 0; });
    const tTel = api.toggle('🧪 Telomerase', false, (v) => { telo = v; tT = 0; });
    const sDiv = api.slider('Số lần phân bào', 0, 60, 1, 0, (v) => { nDiv = v; }, (x) => x + ' lần');
    const CTL = [[tSeqA.el, [3]], [tOne.el, [4]], [tTel.el, [6]], [sDiv.el, [6]]];
    const groups = { lamG, thG, euG, liG, teG, reG };
    const VIS = ['lamG', 'lamG', 'lamG', 'thG', 'euG', 'liG', 'teG', 'reG'];
    const CAM = [[[3, 2.2, 13], [0, 0.1, 0]], [[4.5, 2.4, 12], [1.5, 0.2, 0]], [[4.5, 2.2, 13], [1.5, 0.1, 0]], [[0, 0, 11], [0, 0, 0]],
      [[0, 0.8, 12.5], [0, 0.4, 0]], [[4.2, 1.8, 10.5], [0, 0.3, 0]], [[0, 0.3, 12.5], [0, 0.1, 0]], [[4.5, 2.2, 17.5], [1.2, 0.2, 0]]];
    const LBL = [
      ['a_iter', 'a_at', 'a_O', 'a_melt'],
      ['a_iter', 'a_O', 'a_P', 'a_B'],
      ['a_chap', 'a_go', 'a_O'],
      ['b_ori', 'b_ter', 'b_f1', 'b_f2', 'b_seqA', 'b_info'],
      ['c_early', 'c_late', 'c_bub', 'c_t', 'c_l'],
      ['d_phase', 'd_orc'],
      ['e_3', 'e_5', 'e_msg', 'e_tel', 'e_cnt'],
      ['f_B', 'f_D', 'f_C', 'f_chi', 'f_t3', 'f_b5', 'f_end', 'f_msg'],
    ];
    let tA = 0, tE = 0, tT = 0, tL = 0, tR = 0;

    const ctl = {
      setStep(s) {
        cur = s; pr.snap(0, 1); tA = tE = tT = tL = tR = 0;
        for (const [k, g] of Object.entries(groups)) { const on = VIS[s] === k; g.visible = true; api.scaleTo(g, on ? 1 : 0.001, 6); }
        api.camera(...CAM[s]);
        if (s !== 3) { seqAoff = false; tSeqA.set(false); }
        if (s !== 4) { oneOri = false; tOne.set(false); }
        if (s !== 6) { telo = false; tTel.set(false); }
        lb.only(LBL[s]);
        CTL.forEach(([el, st]) => { el.style.display = st.includes(s) ? '' : 'none'; });
        // λ initial states
        if (s <= 2) {
          Os.forEach(o => o.g.position.copy(s === 0 ? o.from : o.some));
          Bs.forEach(b => { b.g.position.copy(s === 1 ? b.from : b.home); b.p.visible = true; b.p.position.set(0, b === Bs[1] ? -1.2 : 1.2, 0.2); b.g.visible = s >= 1; });
          chap.forEach(c => { c.m.visible = s === 2; c.m.position.set(atX + 4, 4, 1); });
          ld.openRange(ATR[0], ATR[1], s === 0 ? 0 : 0.3);
        }
        if (s === 7) { rd.openRange(0, 0); rd.pairs.forEach(p => { p.half1.visible = p.half2.visible = true; if (p.bb1) p.bb1.visible = true; if (p.bb2) p.bb2.visible = true; }); debris.forEach(d => d.m.visible = false); }
        if (s === 5) lid.openRange(0, 0);
        const RD = {
          0: 'Protein O nhận diện 4 iteron. Chưa có helicase.',
          1: 'P–DnaB bám vào O. Helicase đã ở ori nhưng <b>bị khóa</b>.',
          2: 'DnaJ/DnaK/GrpE + ATP gỡ P → DnaB tự do → 2 chạc sao chép đi ra 2 phía.',
          5: 'Chu kỳ tự chạy: G1 (cấp phép) → S (bắn) → thử cấp phép lại (bị chặn).',
          7: 'RecBCD đi từ đầu đứt vào trong, vừa tháo xoắn vừa cắt. Quan sát mạch trên (đầu 3′) trước và sau Chi.',
        };
        if (RD[s]) api.readout(RD[s]);
      },
      update(dt, t) {
        const s = cur, e = ease(pr.tick(dt));
        // ---------- λ ----------
        if (s <= 2) {
          if (s === 0) {
            Os.forEach((o, k) => { const ek = ease(clamp(e * 1.6 - k * 0.12)); o.g.position.lerpVectors(o.from, o.home, ek); });
            if (e > 0.75) { const e2 = ease(clamp((e - 0.75) / 0.25)); Os.forEach(o => o.g.position.lerpVectors(o.home, o.some, e2 * 0.6)); ld.openRange(ATR[0], ATR[1], 0.3 * e2); }
            lb.show('a_melt', e > 0.85);
          }
          if (s === 1) Bs.forEach(b => b.g.position.lerpVectors(b.from, b.home, e));
          if (s === 2) {
            tA += dt;
            chap.forEach((c, k) => { const a = clamp((tA - k * 0.3) / 1.2); c.m.position.lerpVectors(V(atX + 4 + k, 4.2, 1), V(atX - 0.6 + k * 0.6, 1.9, 0.7), ease(a)); if (tA > 2.6) c.m.position.y += (tA - 2.6) * 2; });
            atp.material.opacity = tA > 1.4 && tA < 2.2 ? 0.9 * Math.sin((tA - 1.4) / 0.8 * Math.PI) : 0; atp.position.set(atX, 1.4, 0.8);
            const rel = clamp((tA - 1.8) / 1.0);
            Bs.forEach((b, k) => { b.p.position.set(0, (k ? -1.2 : 1.2) + (k ? -1 : 1) * rel * 5, 0.2 + rel * 2); b.p.visible = rel < 1; });
            const spread = clamp((tA - 2.6) / 4.0);
            const half = Math.round(spread * 22), mid = 48;
            if (tA > 2.6) ld.openRange(Math.max(2, mid - 8 - half), Math.min(LSEQ.length, mid + 8 + half), 1);
            Bs.forEach((b, k) => { b.g.position.set(ld.xOf(k ? Math.min(LSEQ.length - 1, mid + 8 + half) : Math.max(2, mid - 8 - half)) + (k ? -0.15 : 0.15), 0, 0); b.r.rotation.x += dt * (spread > 0 ? 6 : 0); });
            Os.forEach(o => { o.g.position.lerpVectors(o.some, V(o.some.x, o.some.y * 3.5, -2), clamp((tA - 3) / 2)); });
            lb.show('a_go', tA > 3);
            if (tA > 9) tA = 0, ld.openRange(ATR[0], ATR[1], 0.3);
          }
          lamG.rotation.x = Math.sin(t * 0.3) * 0.12;
        }
        // ---------- θ ----------
        if (s === 3) {
          tA += dt; const T = 9; const tt = tA % (T + 2);
          const ph = clamp(tt / T) * Math.PI;
          const top = Math.PI / 2;
          setArc(arcs.p1, RC, 0.05, top + ph, 2 * Math.PI - 2 * ph); setArc(arcs.p2, RC, -0.05, top + ph, 2 * Math.PI - 2 * ph);
          setArc(arcs.d1o, RC + 0.32, 0.05, top - ph, 2 * ph); setArc(arcs.d1n, RC + 0.32, -0.05, top - ph, 2 * ph);
          setArc(arcs.d2o, RC - 0.32, -0.05, top - ph, 2 * ph); setArc(arcs.d2n, RC - 0.32, 0.05, top - ph, 2 * ph);
          forks.forEach((f, k) => { const a = top + (k ? ph : -ph); f.position.set(Math.cos(a) * RC, Math.sin(a) * RC, 0); f.visible = ph < Math.PI * 0.995; });
          lb.get('b_f1').position.set(Math.cos(top - ph) * (RC + 0.9), Math.sin(top - ph) * (RC + 0.9), 0);
          lb.get('b_f2').position.set(Math.cos(top + ph) * (RC + 0.9), Math.sin(top + ph) * (RC + 0.9), 0);
          lb.show('b_f1', ph < Math.PI * 0.82); lb.show('b_f2', ph < Math.PI * 0.82);
          const seqOn = !seqAoff && ph > 0.25;
          seqA.forEach((m, k) => { m.visible = seqOn; m.position.set(0.25, RC + (k ? -0.32 : 0.32), 0.25); });
          lb.show('b_seqA', seqOn);
          const re = seqAoff ? clamp((ph - 0.6) / 2.2) * 1.2 : 0;
          forks2.forEach((f, k) => { f.visible = seqAoff && ph > 0.6; const a = top + (k ? re : -re); f.position.set(Math.cos(a) * (RC + 0.32), Math.sin(a) * (RC + 0.32), 0.15); });
          lb.show('b_bad', seqAoff && ph > 0.6);
          api.readout(`Thời gian: <b>${Math.round(clamp(tt / T) * 40)} phút</b> / ~40 phút · đã chép <b>${Math.round(clamp(tt / T) * 100)}%</b>. Mỗi chạc ~1000 nt/s × 2 chạc.${seqAoff ? ' ⚠️ <b>seqA⁻</b>: oriC vừa chép đã bắn lại (chạc đỏ), khởi đầu không đồng bộ.' : ''}`);
          thG.rotation.y = Math.sin(t * 0.3) * 0.25;
        }
        // ---------- eukaryote ----------
        if (s === 4) {
          tE += dt; const TEND = oneOri ? 21 : 10, tt = tE % (TEND + 2.5);
          const fired = ORIS.filter(([x, t0]) => (oneOri ? x === 0.9 : true) && tt >= t0).map(([x, t0]) => [Math.max(XL, x - VF * (tt - t0)), Math.min(XR, x + VF * (tt - t0))]).sort((a, b) => a[0] - b[0]);
          const iv = []; fired.forEach(([a, b]) => { if (iv.length && a <= iv[iv.length - 1][1]) iv[iv.length - 1][1] = Math.max(iv[iv.length - 1][1], b); else iv.push([a, b]); });
          const gaps = []; let px = XL; iv.forEach(([a, b]) => { if (a > px) gaps.push([px, a]); px = b; }); if (px < XR) gaps.push([px, XR]);
          segs.forEach((m, i) => { const g = gaps[i]; m.visible = !!g; if (g) { m.scale.y = Math.max(0.01, g[1] - g[0]); m.position.set((g[0] + g[1]) / 2, 0, 0); } });
          const H = 0.5;
          bubs.forEach((b, i) => {
            const it = iv[i]; b.g.visible = !!it; if (!it) return;
            const [a, c] = it, L = Math.max(0.01, c - a - 0.5), cx = (a + c) / 2;
            [[b.top, H + 0.05], [b.topN, H - 0.09], [b.bot, -H - 0.05], [b.botN, -H + 0.09]].forEach(([m, y]) => { m.scale.y = L; m.position.set(cx, y, 0); });
            const aEnd = a <= XL + 0.01, cEnd = c >= XR - 0.01;
            b.fl.visible = !aEnd; b.fr.visible = !cEnd; b.fl.position.set(a, 0, 0); b.fr.position.set(c, 0, 0);
            api.setStick(b.sl[0], V(a, 0, 0), V(a + 0.25, H, 0)); api.setStick(b.sl[1], V(a, 0, 0), V(a + 0.25, -H, 0));
            api.setStick(b.sl[2], V(c, 0, 0), V(c - 0.25, H, 0)); api.setStick(b.sl[3], V(c, 0, 0), V(c - 0.25, -H, 0));
          });
          const done = iv.reduce((s2, [a, b]) => s2 + (b - a), 0) / (XR - XL);
          lb.set('c_t', oneOri ? 'chỉ 1 ori: 2 chạc phải đi hết cả NST' : 'nhiều ori: các bóng lớn dần rồi hợp nhất');
          const big = iv.filter(([a, b]) => b - a > 1.2).sort((p, q) => Math.abs(p[0] + p[1]) - Math.abs(q[0] + q[1]))[0]; if (big) lb.get('c_bub').position.set((big[0] + big[1]) / 2, 0.95, 0);
          api.readout(oneOri ? `Đã chép <b>${Math.round(done * 100)}%</b>. Với NST người ~150 Mb, 1 ori × 2 chạc × ~50 nt/s cần <b>~17 ngày</b>. Pha S thực tế chỉ ~8 giờ.` : `Đã chép <b>${Math.round(done * 100)}%</b>. Người có ~30 000–50 000 ori: ori sớm (xanh) bắn đầu pha S, ori muộn (cam) bắn sau. Pha S ~8 giờ.`);
        }
        // ---------- licensing ----------
        if (s === 5) {
          tL += dt; const tt = tL % 13;
          const P0 = clamp(tt / 3.5), P1 = clamp((tt - 4.2) / 3.6), P2 = clamp((tt - 8.4) / 3.4);
          const ph = tt < 4.2 ? 0 : tt < 8.4 ? 1 : 2;
          lb.set('d_phase', ['G1: CẤP PHÉP (licensing)', 'PHA S: BẮN (firing)', 'SAU KHI BẮN: không cấp phép lại'][ph]);
          lb.get('d_phase').element.className = 'lbl ' + ['big', 'good', 'warn'][ph];
          cdc6.position.lerpVectors(V(-3.5, 2.6, 0.5), V(-0.9, 0.9, 0.7), ease(clamp(P0 * 2)));
          cdt1.position.lerpVectors(V(3.5, 2.6, 0.5), V(0.6, 0.9, 0.7), ease(clamp(P0 * 2)));
          cdc6.visible = cdt1.visible = ph === 0;
          const load = ease(clamp(P0 * 1.6 - 0.3));
          const sep = ph >= 1 ? ease(clamp((P1 - 0.35) / 0.65)) * 4.2 : 0;
          mcms.forEach((r, k) => { const x0 = k ? 0.42 : -0.42; r.position.lerpVectors(V(k ? 3 : -3, -3, 0), V(x0 + (k ? sep : -sep), 0, 0), load); r.rotation.x += dt * (ph >= 1 && P1 > 0.35 ? 4 : 0); tint(r, ph >= 1 && P1 > 0.25 ? HEL : MCM); });
          gins.forEach((g, k) => { g.visible = ph >= 1 && P1 > 0.15; g.position.copy(mcms[k].position).add(V(0, -1.05, 0.2)); });
          kin.forEach((m, k) => { m.visible = ph === 1 && P1 < 0.5; m.position.set(-0.6 + k * 1.2, 1.9 + Math.sin(t * 6 + k) * 0.1, 0.6); m.rotation.y += dt * 3; });
          if (ph >= 1) { const n = Math.round(sep / 0.42); lid.openRange(14 - 1 - n, 14 + 1 + n, P1 > 0.35 ? 1 : 0); } else lid.openRange(0, 0);
          gem.visible = ph === 2; gem.position.set(2.2, 1.3, 0.6);
          mcmX.visible = ph === 2; const bounce = P2 < 0.5 ? ease(P2 * 2) : 1 - ease((P2 - 0.5) * 2);
          mcmX.position.set(lerp(4.5, 2.7, bounce), lerp(-2.8, -0.6, bounce), 0.2);
          lb.show('d_mcm', ph === 0 && P0 > 0.5); lb.show('d_cmg', ph === 1 && P1 > 0.4); lb.show('d_kin', ph === 1 && P1 < 0.5); lb.show('d_gem', ph === 2);
          if (tt < dt * 1.5) lid.openRange(0, 0);
        }
        // ---------- telomere ----------
        if (s === 6) {
          tT += dt; const T = telo ? 11 : 7, tt = tT % T;
          const rm = clamp((tt - 2.2) / 1.2); // primer removal
          for (let i = 0; i < NT; i++) {
            const inPr = i >= PRIM_END[0];
            const b = botB[i]; b.material.color.setHex(inPr ? RNA : NEW); b.material.opacity = inPr ? 1 - rm : 1; b.visible = !(inPr && rm >= 1);
          }
          const ext = telo ? clamp((tt - 4.0) / 2.5) : 0, fill = telo ? clamp((tt - 7.0) / 2.5) : 0;
          extB.forEach((b, i) => { b.visible = i < Math.round(ext * NEXT); });
          extN.forEach((b, i) => {
            const show = fill > 0 && i < NEXT - 4 + 4 && (i < Math.round(fill * NEXT));
            b.visible = show; b.material.color.setHex(i >= NEXT - 4 ? RNA : NEW);
          });
          // once the extension is filled, the old primer gap gets filled too
          if (fill > 0.2) for (let i = PRIM_END[0]; i < NT; i++) { botB[i].visible = true; botB[i].material.opacity = 1; botB[i].material.color.setHex(NEW); }
          tase.visible = tRNA.visible = telo && tt > 3.6 && tt < 7.0;
          const tx = X0 + (NT + ext * NEXT) * BW + 0.2; tase.position.set(tx, 0.55, 0); tRNA.position.set(tx - 0.2, 0.62, 0.1);
          lb.get('e_tase').position.set(tx, 2.2 + 1.2, 0); lb.show('e_tase', tase.visible);
          lb.get('e_3').position.set(X0 + (NT + (telo ? ext : 0) * NEXT) * BW + 0.5, 0.95 + 1.2, 0);
          lb.show('e_gap', rm >= 1 && fill < 0.2);
          const msg = tt < 2.2 ? 'Đoạn Okazaki cuối cùng bắt đầu bằng mồi RNA (cam) ở tận đầu mút'
            : tt < 4.0 ? 'Gỡ mồi → khoảng trống: không có 3′-OH phía trước để polymerase lấp'
            : !telo ? '→ mạch mới ngắn hơn mạch khuôn. Mỗi lần chép, NST mất ~50–200 bp'
            : tt < 7.0 ? 'Telomerase dùng khuôn RNA của nó, nối TTAGGG vào đầu 3′' : 'Primase + Pol α lấp mạch bổ sung → chiều dài được giữ';
          lb.set('e_msg', msg);
          const L0 = 1.6, loss = telo ? 0 : nDiv * 0.026, tl = Math.max(0.02, L0 - loss);
          capL.scale.y = capR.scale.y = tl; capL.position.x = -3.5 - tl / 2; capR.position.x = 3.5 + tl / 2;
          lb.get('e_tel').position.set(3.5 + tl / 2, -1.5, 0);
          const crit = tl < 0.35;
          capL.material.color.setHex(crit ? 0xff453a : TELO); capR.material.color.setHex(crit ? 0xff453a : TELO);
          lb.set('e_cnt', telo ? `${nDiv} lần phân bào: telomere được giữ (tế bào gốc, tế bào mầm, ~90% tế bào ung thư)` : crit ? `${nDiv} lần: telomere quá ngắn → ngừng phân chia (giới hạn Hayflick) ⚠️` : `${nDiv} lần phân bào: telomere ngắn dần`);
          lb.get('e_cnt').element.className = 'lbl ' + (crit && !telo ? 'warn' : telo ? 'good' : '');
          api.readout(`Tế bào sinh dưỡng người: telomere ~10 kb, mất ~50–200 bp mỗi lần phân bào → sau ~50 lần (Hayflick) thì dừng. ${telo ? 'Có telomerase: đầu 3′ được kéo dài trở lại.' : ''}`);
        }
        // ---------- RecBCD ----------
        if (s === 7) {
          tR += dt; const T = 12, tt = tR % (T + 2);
          if (tt < dt * 1.5) { rd.openRange(0, 0); rd.pairs.forEach(p => { p.half1.visible = p.half2.visible = true; if (p.bb1) p.bb1.visible = true; if (p.bb2) p.bb2.visible = true; }); }
          const pos = Math.min(NR, Math.floor(clamp(tt / T) * (NR + 1)));
          rd.openRange(0, pos, 1);
          const passed = pos >= CHI_I + 8;
          rd.pairs.forEach(p => {
            if (p.i >= pos - 2) return;
            if (p.i < CHI_I) { p.half1.visible = false; if (p.bb1) p.bb1.visible = false; }
            else if (p.i >= CHI_I && passed) { p.half2.visible = false; if (p.bb2) p.bb2.visible = false; }
          });
          rbcd.position.set(rd.xOf(Math.max(0, pos - 1)) + 0.35, 0, 0);
          lb.get('f_B').position.set(rbcd.position.x, 2.4, 0); lb.get('f_D').position.set(rbcd.position.x, -2.3, 0); lb.get('f_C').position.set(rbcd.position.x + 1.4, 0.6, 0);
          nuc.position.set(-0.45, passed ? -1.1 : 1.1, 0.3);
          // debris from nuclease
          if (pos > 1 && pos < NR && Math.random() < dt * 8) {
            const d = debris.find(q => q.life <= 0); if (d) { d.life = 1; d.m.visible = true; d.m.material.color.setHex(passed ? C.dna2 : C.dna1); d.m.position.set(rbcd.position.x - 0.6, passed ? -1.4 : 1.4, 0.2); d.v.set(-0.6 - Math.random(), (passed ? -1 : 1) * (0.8 + Math.random()), Math.random() - 0.5); }
          }
          debris.forEach(d => { if (d.life > 0) { d.life -= dt * 0.8; d.m.position.addScaledVector(d.v, dt); d.m.scale.setScalar(Math.max(0.01, d.life)); if (d.life <= 0) d.m.visible = false; } });
          const nA = passed ? Math.min(recA.length, Math.max(0, Math.floor((pos - 2 - CHI_I) / 1.2))) : 0;
          recA.forEach((m, k) => { m.visible = k < nA; if (m.visible) { const p = rd.pairs[CHI_I + Math.round(k * 1.2)]; m.position.copy(p.half1.position).add(V(0, 0.32, 0.18)); } });
          lb.show('f_recA', passed && nA > 2);
          lb.set('f_msg', pos < CHI_I + 8 ? 'Trước Chi: tháo xoắn + cắt vụn mạch 3′ (xanh)' : 'Đã gặp Chi: giữ đuôi 3′ có Chi, cắt mạch 5′ (hồng), nạp RecA');
          lb.get('f_msg').element.className = 'lbl ' + (passed ? 'good' : 'big');
        }
      },
    };
    return ctl;
  },
};
