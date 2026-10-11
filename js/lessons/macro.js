// Bài 3: Protein, lipid (raft), carbohydrate
import { progress, labels, membrane, arrow, ease, lerp, clamp } from './_kit.js';

const HYD = 0xd4a24c, POL = 0x3fb27f, POS = 0x4a90e2, NEG = 0xe8505b, CYS = 0xf2c94c;

export default {
  title: 'Protein, lipid (raft), carbohydrate',
  sub: 'Amino acid nối thành chuỗi rồi gấp qua 4 bậc. Phospholipid xếp thành màng, có "bè" lipid raft. Đường làm năng lượng và "thẻ căn cước" của tế bào.',
  legend: '<span><i style="background:#d4a24c"></i>aa kỵ nước</span><span><i style="background:#3fb27f"></i>aa phân cực</span><span><i style="background:#4a90e2"></i>aa (+)</span><span><i style="background:#e8505b"></i>aa (−)</span><span><i style="background:#f2c94c"></i>Cys / cầu S–S</span><span><i style="background:#ffffff"></i>liên kết H</span>',

  why: `<p>Tế bào chỉ dùng <b>4 nhóm đại phân tử</b>, mỗi nhóm một nghề:</p>
  <ul><li><b>Nucleic acid</b> (DNA, RNA): lưu và truyền <b>thông tin</b>.</li>
  <li><b>Protein</b>: "người làm việc". Làm enzyme xúc tác, khung đỡ, vận chuyển, truyền tín hiệu, vận động, bật/tắt gene.</li>
  <li><b>Lipid</b>: làm <b>màng</b>, tức ranh giới của tế bào và bào quan, đồng thời dự trữ năng lượng và làm tín hiệu.</li>
  <li><b>Carbohydrate</b> (đường): cho <b>năng lượng</b>, có trong khung DNA/RNA (ribose, deoxyribose), và gắn lên protein/lipid làm <b>"thẻ căn cước"</b> để tế bào nhận ra nhau.</li></ul>
  <p>Ý chính của bài: <b>cấu trúc quyết định chức năng</b>. Một protein chỉ làm việc được khi gấp đúng hình 3D. Một màng chỉ linh động khi đuôi lipid đủ "lộn xộn".</p>`,

  without: `<ul>
  <li><b>Protein gấp sai</b>: mất chức năng, có khi còn kết thành mảng độc. Ví dụ: <b>prion</b> (bò điên), mảng amyloid trong <b>Alzheimer</b>, cả hai đều giàu phiến β bất thường.</li>
  <li><b>Sai 1 amino acid (bậc 1)</b>: ở <b>bệnh hồng cầu hình liềm</b>, Glu ở vị trí 6 của chuỗi β-globin bị thay bằng Val (kỵ nước). Các phân tử hemoglobin dính nhau thành sợi, làm hồng cầu cong như lưỡi liềm và dễ vỡ.</li>
  <li><b>Mất cầu S–S</b>: insulin gồm 2 chuỗi A và B nối bằng cầu S–S. Khử các cầu này thì 2 chuỗi rời nhau và insulin hết tác dụng.</li>
  <li><b>Không có màng</b>: không giữ được chất bên trong, không tạo được chênh lệch ion, tế bào chết.</li>
  <li><b>Màng quá cứng</b> (toàn đuôi bão hòa, trời lạnh): protein màng không di chuyển, vận chuyển kém. Vi khuẩn và cá vùng lạnh phải tăng acid béo <b>không bão hòa</b> để màng vẫn lỏng.</li>
  <li><b>Không có lipid raft</b> (rút cholesterol): các thụ thể tín hiệu tản ra, nên tín hiệu yếu và chậm.</li>
  <li><b>Không có "thẻ căn cước" đường</b>: hệ miễn dịch không phân biệt được ta và lạ. Truyền nhầm nhóm máu ABO thì hồng cầu bị ngưng kết và vỡ.</li></ul>`,

  foundation: [
    { q: 'Đại phân tử là gì? Đơn phân của từng loại?', a: 'Đại phân tử là phân tử rất lớn, đa số là <b>polymer</b> (nhiều đơn phân nối nhau):<br>• <b>Protein</b> ← <b>amino acid</b> (20 loại)<br>• <b>Nucleic acid</b> ← <b>nucleotide</b><br>• <b>Polysaccharide</b> ← <b>monosaccharide</b> (vd glucose)<br>• <b>Lipid</b> <u>không phải polymer</u>: không gồm đơn phân lặp lại. Lipid được xếp chung nhóm vì cùng đặc tính <b>kỵ nước</b>.' },
    { q: 'Một amino acid gồm những gì?', a: 'Một carbon trung tâm (<b>Cα</b>) gắn 4 thứ:<br>• nhóm <b>amin –NH₂</b><br>• nhóm <b>carboxyl –COOH</b><br>• một <b>H</b><br>• một <b>gốc R</b><br>20 loại amino acid chỉ khác nhau ở gốc R: R có thể kỵ nước (Val, Leu), phân cực (Ser), tích điện (+) (Lys, Arg), tích điện (−) (Glu, Asp), hoặc có –SH (<b>Cys</b>, tạo được cầu S–S).' },
    { q: 'Ưa nước và kỵ nước nghĩa là gì?', a: 'Nước là phân tử <b>phân cực</b>. Chất phân cực hoặc tích điện "thích" nước nên tan được (<b>ưa nước</b>). Chất không phân cực (chuỗi C–H dài như đuôi lipid, gốc R của Val, Leu, Phe) bị nước "đẩy" nên tụ lại với nhau (<b>kỵ nước</b>).<br>Đây là lực chính làm protein gấp có lõi kỵ nước bên trong, và làm phospholipid tự xếp thành lớp kép.' },
    { q: 'Liên kết cộng hóa trị khác liên kết yếu thế nào?', a: '<b>Cộng hóa trị</b> (peptide, S–S, glycoside, phosphodiester) là 2 nguyên tử dùng chung electron, rất bền. Nhiệt độ cơ thể hay đun sôi thông thường đều không phá được.<br><b>Liên kết yếu</b> (hydrogen, ion, Van der Waals, tương tác kỵ nước) yếu hơn nhiều. Nhiệt, pH, urê phá được. Nhưng có hàng trăm cái cộng lại nên vẫn giữ được hình dạng.' },
    { q: 'Phản ứng ngưng tụ và thủy phân là gì?', a: '<b>Ngưng tụ</b>: nối 2 đơn phân và <b>tách ra 1 phân tử H₂O</b>. Peptide, glycoside, phosphodiester đều tạo theo cách này.<br><b>Thủy phân</b>: ngược lại, <b>thêm H₂O</b> để cắt liên kết. Đó là cách tiêu hóa protein và tinh bột.' },
    { q: 'Đầu N và đầu C của chuỗi polypeptide?', a: 'Sau khi nối, chuỗi còn 1 đầu có –NH₂ tự do (<b>đầu N</b>) và 1 đầu có –COOH tự do (<b>đầu C</b>). Ribosome luôn tổng hợp từ <b>đầu N → đầu C</b>, tương tự DNA/RNA có chiều 5′→3′.' },
    { q: 'Liên kết hydrogen hình thành giữa những gì?', a: 'Giữa một <b>H gắn với N hoặc O</b> (H mang điện dương một phần) và một <b>O hoặc N khác</b> (mang điện âm một phần). Ở protein bậc 2, đó là <b>C=O</b> của một amino acid với <b>N–H</b> của amino acid khác, cả hai đều thuộc <b>khung chính</b> (backbone).' },
    { q: 'Acid béo bão hòa và không bão hòa khác nhau ở đâu?', a: '<b>Bão hòa</b>: chỉ có liên kết đơn C–C, đuôi <b>thẳng</b>, xếp sít nhau nên rắn ở nhiệt độ phòng (mỡ, bơ).<br><b>Không bão hòa</b>: có liên kết đôi C=C. Dạng <b>cis</b> tạo một <b>chỗ gập</b>, đuôi không xếp sít được nên lỏng (dầu thực vật) và làm màng linh động.' },
    { q: 'Glycoprotein, glycolipid, aldose, ketose là gì?', a: '<b>Glycoprotein</b> là protein gắn chuỗi đường. <b>Glycolipid</b> là lipid gắn chuỗi đường. Cả hai nằm ở mặt ngoài màng, làm "thẻ căn cước" (vd kháng nguyên nhóm máu ABO).<br><b>Aldose</b> là đường có nhóm <b>–CHO</b> (vd glucose). <b>Ketose</b> là đường có nhóm <b>C=O</b> ở giữa mạch (vd fructose).' },
  ],

  steps: [
    { title: 'Bản đồ: 4 nhóm đại phân tử liên hệ với nhau', text: '<b>Nucleic acid</b> (trên) lưu thông tin và <b>mã hóa</b> protein. <b>Protein</b> (giữa) là trung tâm:<br>• làm enzyme <b>tổng hợp lipid và đường</b>;<br>• quay lại <b>điều hòa</b> DNA (yếu tố phiên mã, polymerase).<br><b>Lipid</b> làm màng. <b>Đường</b> cho năng lượng, có trong khung DNA/RNA, và gắn lên protein/lipid để nhận diện.' },
    { title: 'Liên kết peptide: nối 2 amino acid', text: 'Hai amino acid tiến lại gần. <b>–OH</b> của nhóm carboxyl (aa 1) và <b>–H</b> của nhóm amin (aa 2) tách ra thành <b>H₂O</b> (phản ứng ngưng tụ). C của aa 1 nối thẳng với N của aa 2, tạo <b>liên kết peptide –CO–NH–</b> (cộng hóa trị, rất bền).<br>Lặp lại nhiều lần, ta được chuỗi polypeptide (phía dưới), có <b>đầu N</b> và <b>đầu C</b>. Trình tự amino acid này là <b>cấu trúc bậc 1</b>.' },
    { title: 'Bậc 2: xoắn α và phiến β', text: 'Khung chuỗi tự cuộn lại nhờ <b>liên kết H giữa C=O và N–H của khung</b> (que trắng):<br>• <b>Xoắn α</b> (trái): C=O của aa thứ <i>i</i> bắt cặp với N–H của aa thứ <i>i+4</i>. Khoảng 3,6 aa mỗi vòng, xoắn phải, gốc R chĩa ra ngoài.<br>• <b>Phiến β</b> (phải): hai đoạn chuỗi nằm cạnh nhau (ở đây ngược chiều), liên kết H nối <b>giữa 2 mạch</b>.<br>Gốc R <b>không</b> tham gia liên kết H ở bậc 2. 💥 Bật biến tính để thấy chuỗi duỗi ra.' },
    { title: 'Bậc 3: cả chuỗi gấp thành khối 3D', text: 'Xoắn α và phiến β xếp chồng lên nhau thành một khối gọn. Lần này <b>gốc R</b> mới tương tác với nhau:<br>• <b>Lõi kỵ nước</b>: các gốc R nâu trốn nước, tụ vào giữa.<br>• <b>Liên kết ion</b>: Lys (+) hút Glu (−).<br>• <b>Cầu disulfide S–S</b> (que vàng): nối 2 Cys, là liên kết <b>cộng hóa trị</b>.<br>• Thêm liên kết H và Van der Waals.<br>💥 Biến tính bằng urê + β-mercaptoethanol để xem chuỗi duỗi ra, rồi tắt để xem nó tự gấp lại.' },
    { title: 'Bậc 4: nhiều chuỗi ghép lại', text: 'Một số protein gồm <b>nhiều chuỗi polypeptide</b> (tiểu đơn vị) ghép lại. Ví dụ <b>hemoglobin = 2 chuỗi α + 2 chuỗi β</b> (mỗi chuỗi mang 1 nhóm heme). Các chuỗi giữ nhau bằng đúng những liên kết của bậc 3 (kỵ nước, ion, H, Van der Waals, đôi khi S–S).<br>Protein chỉ có 1 chuỗi (vd myoglobin) thì <b>không có bậc 4</b>. 💥 Biến tính: các tiểu đơn vị rời nhau và duỗi ra.' },
    { title: 'Màng: lớp kép phospholipid', text: 'Mỗi phospholipid có <b>đầu ưa nước</b> (nhóm phosphate, xanh) và <b>2 đuôi acid béo kỵ nước</b>. Trong nước, chúng tự xếp thành <b>lớp kép</b>: đầu quay ra nước ở 2 phía, đuôi giấu vào giữa.<br>Đuôi cam có <b>liên kết đôi cis</b> nên bị <b>gập</b>, đẩy các phân tử xa nhau và làm màng <b>lỏng, linh động</b>. Tắt công tắc để xem màng toàn đuôi bão hòa: thẳng, xếp sít, cứng.' },
    { title: 'Lipid raft: "bục làm việc" trên màng', text: 'Nhìn từ trên xuống. Vùng hồng là <b>lipid raft</b>: một vùng nhỏ của màng giàu <b>cholesterol</b> (thanh vàng) và <b>sphingolipid / glycosphingolipid</b> (có chuỗi đường). Raft <b>dày hơn và kém lỏng hơn</b> phần màng xung quanh.<br>Xem các <b>thụ thể tín hiệu</b> (tím) trôi về tụ lại trong raft. Gom lại một chỗ thì tín hiệu truyền nhanh và mạnh. 💥 Rút cholesterol thì raft tan ra.' },
    { title: 'Carbohydrate: từ đơn phân đến polysaccharide', text: 'Hàng trên: <b>monosaccharide</b>.<br>• <b>Glucose</b>: vòng 6 cạnh, là <b>aldose</b> (–CHO).<br>• <b>Fructose</b>: vòng 5 cạnh, là <b>ketose</b> (C=O).<br>• Chấm đỏ là oxy trong vòng.<br>Hai đơn phân nối bằng <b>liên kết glycoside</b> (–O–, tách 1 H₂O) thành <b>disaccharide</b>: sucrose = glucose + fructose.<br>Hàng dưới: nhiều glucose nối thành <b>polysaccharide</b>. Glycogen (dự trữ ở động vật) <b>phân nhánh</b> nhờ liên kết α1→6. Tinh bột (thực vật) và cellulose cũng là polymer của glucose.<br>Quy ước số đơn vị: mono (1), di (2), oligo (3–10), poly (nhiều).' },
    { title: 'Đường trên bề mặt tế bào: "thẻ căn cước" ABO', text: 'Trên màng hồng cầu:<br>• <b>Glycoprotein</b> (trái): chuỗi N-glycan gắn vào Asn, được lắp ở ER và Golgi (bài 17).<br>• <b>Glycolipid</b> (phải): chuỗi đường mang <b>kháng nguyên nhóm máu</b>.<br>Mọi người đều có <b>kháng nguyên H</b> (có Fuc, tam giác đỏ). Đầu chuỗi khác nhau theo nhóm:<br>• nhóm A thêm <b>GalNAc</b> (ô vuông vàng);<br>• nhóm B thêm <b>Gal</b> (tròn vàng);<br>• nhóm O không thêm gì.<br>Bấm A/B/O để xem kháng thể <b>anti-B</b> (có trong máu người nhóm A) có bám vào không.<br><i>Ký hiệu đường theo chuẩn SNFG: ô vuông xanh = GlcNAc, tròn xanh lá = Man, tròn xanh = Glc.</i>' },
    { title: 'Phân tích: điện di protein (SDS) và đường (borate)', text: 'Gel đặt giữa cực âm (−, trên) và cực dương (+, dưới). Phân tử mang điện âm chạy xuống cực +.<br>• <b>Làn protein + SDS</b>: SDS phủ đều điện tích âm lên mọi protein, nên chúng chỉ còn khác nhau về <b>kích thước</b>. Protein nhỏ lách qua lưới gel nhanh hơn, chạy xa hơn.<br>• <b>Làn đường</b>: đường <b>trung tính</b>, nên đứng yên ở giếng. <b>Thêm borate</b>: borate gắn vào nhóm <b>cis-diol</b> của đường, tạo phức mang điện âm, nên đường chạy được.' },
  ],

  application: `<ul>
  <li><b>Bệnh hồng cầu hình liềm</b> (sickle cell): chỉ 1 amino acid đổi (Glu6 → Val, bậc 1) mà hỏng cả bậc 4 (hemoglobin kết sợi). Đây là ví dụ kinh điển cho "trình tự quyết định cấu trúc".</li>
  <li><b>Uốn và duỗi tóc</b>: keratin trong tóc có nhiều cầu S–S.<br>① Thuốc uốn (thioglycolate) <b>khử</b> cầu S–S.<br>② Tạo dáng tóc theo ý muốn.<br>③ Thuốc <b>oxy hóa</b> nối lại cầu S–S ở vị trí mới.</li>
  <li><b>Luộc trứng</b>: nhiệt làm albumin biến tính. Chuỗi duỗi ra, dính vào nhau nên trứng đông đặc và không trở lại như cũ. Bậc 1 vẫn còn, nên ăn vào vẫn tiêu hóa thành amino acid bình thường.</li>
  <li><b>Thí nghiệm Anfinsen</b> (Nobel 1972): ribonuclease bị urê + β-mercaptoethanol làm biến tính. Loại bỏ 2 chất này từ từ, enzyme tự gấp lại và hoạt động trở lại. Kết luận: <b>trình tự bậc 1 chứa đủ thông tin cho cấu trúc 3D</b>.</li>
  <li><b>Insulin tái tổ hợp</b>: vi khuẩn tổng hợp chuỗi insulin, nhưng phải tạo đúng các cầu S–S thì insulin mới có hoạt tính.</li>
  <li><b>Chất béo trans</b>: hydro hóa dầu thực vật cho ra đuôi trans thẳng, xếp sít như mỡ bão hòa, làm tăng LDL và nguy cơ tim mạch. Nhiều nước đã cấm hoặc hạn chế.</li>
  <li><b>Lipid raft & virus</b>: nhiều virus có vỏ (vd HIV, cúm) dùng vùng raft để xâm nhập hoặc nảy chồi. Trong nghiên cứu, <b>methyl-β-cyclodextrin</b> được dùng để rút cholesterol và phá raft.</li>
  <li><b>Truyền máu ABO</b>: dựa trên chuỗi đường ở đầu glycolipid/glycoprotein hồng cầu.</li>
  <li><b>Phòng xét nghiệm</b>:<br>• <b>SDS-PAGE + Western blot</b>: phát hiện một protein cụ thể bằng kháng thể.<br>• <b>MALDI-TOF</b>: định danh vi khuẩn trong vài phút dựa trên "dấu vân tay" khối lượng protein.<br>• <b>Sắc ký</b> (chromatography): tách và tinh sạch protein, lipid, đường.</li></ul>`,

  distinguish: `<h3>Bậc cấu trúc protein và cách phá</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Bậc</th><th>Là gì</th><th>Liên kết giữ</th><th>Bị phá bởi</th></tr>
  <tr><td><b>1</b></td><td>Trình tự amino acid</td><td><b>Peptide</b> (cộng hóa trị)</td><td>Chỉ thủy phân: protease, acid mạnh đun lâu. <b>Nhiệt và urê KHÔNG phá</b></td></tr>
  <tr><td><b>2</b></td><td>Xoắn α, phiến β</td><td><b>Hydrogen</b> giữa C=O và N–H <b>của khung</b></td><td>Nhiệt, urê, pH cực đoan</td></tr>
  <tr><td><b>3</b></td><td>Gấp 3D của 1 chuỗi</td><td>Kỵ nước, ion, H, Van der Waals giữa các <b>gốc R</b>; <b>S–S</b> giữa 2 Cys</td><td>Liên kết yếu: nhiệt, urê. S–S: cần <b>chất khử</b> (β-mercaptoethanol, DTT)</td></tr>
  <tr><td><b>4</b></td><td>Nhiều chuỗi ghép lại</td><td>Giống bậc 3, nhưng giữa các chuỗi</td><td>Giống bậc 3</td></tr></table></div>
  <h3>Xoắn α và phiến β</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Xoắn α</th><th>Phiến β</th></tr>
  <tr><td>Liên kết H</td><td>Trong <b>cùng một đoạn</b>: C=O (i) với N–H (i+4)</td><td><b>Giữa 2 đoạn</b> nằm cạnh nhau (song song hoặc ngược chiều)</td></tr>
  <tr><td>Hình dạng</td><td>Lò xo xoắn phải, 3,6 aa mỗi vòng</td><td>Tấm gấp nếp, mỗi mạch là một đường zigzag</td></tr>
  <tr><td>Gốc R</td><td>Chĩa ra ngoài lò xo</td><td>Xen kẽ trên và dưới mặt phiến</td></tr>
  <tr><td>Ví dụ</td><td>Keratin (tóc)</td><td>Tơ tằm (fibroin), mảng amyloid</td></tr></table></div>
  <h3>Liên kết nối đơn phân (đều là ngưng tụ, tách H₂O)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Đại phân tử</th><th>Đơn phân</th><th>Liên kết</th><th>Nối giữa</th></tr>
  <tr><td>Protein</td><td>Amino acid</td><td><b>Peptide</b></td><td>–COOH của aa này với –NH₂ của aa kế</td></tr>
  <tr><td>Nucleic acid</td><td>Nucleotide</td><td><b>Phosphodiester</b></td><td>3′-OH với 5′-phosphate</td></tr>
  <tr><td>Polysaccharide</td><td>Monosaccharide</td><td><b>Glycoside</b></td><td>–OH của đường này với –OH của đường kế (qua cầu –O–)</td></tr>
  <tr><td>Lipid (triglyceride, phospholipid)</td><td><i>không phải polymer</i></td><td>Ester</td><td>Glycerol với acid béo</td></tr></table></div>
  <h3>Màng thường và lipid raft</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Màng thường</th><th>Lipid raft</th></tr>
  <tr><td>Thành phần</td><td>Phospholipid nhiều đuôi không bão hòa</td><td>Giàu <b>cholesterol + sphingolipid</b> (đuôi dài, bão hòa)</td></tr>
  <tr><td>Độ dày, độ lỏng</td><td>Mỏng hơn, lỏng</td><td><b>Dày hơn, kém lỏng</b> (trật tự hơn)</td></tr>
  <tr><td>Vai trò</td><td>Ranh giới chung</td><td>Gom <b>thụ thể tín hiệu</b>, chỗ virus nảy chồi</td></tr></table></div>
  <h3>Phương pháp phân tích</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Phương pháp</th><th>Tách / đo theo</th><th>Dùng cho</th></tr>
  <tr><td>Sắc ký (chromatography)</td><td>Kích thước, điện tích, ái lực, độ hấp phụ</td><td>Protein, lipid, đường</td></tr>
  <tr><td>Sắc ký giấy</td><td>Hệ số <b>Rf = quãng đường chất đi / quãng đường dung môi đi</b></td><td>Lipid, đường, sắc tố</td></tr>
  <tr><td>SDS-PAGE</td><td><b>Kích thước</b> (SDS làm điện tích đều)</td><td>Protein</td></tr>
  <tr><td>Western blot</td><td>SDS-PAGE, chuyển lên màng, dò bằng <b>kháng thể</b></td><td>1 protein cụ thể</td></tr>
  <tr><td>MALDI-TOF</td><td><b>Khối lượng</b> (khối phổ)</td><td>Định danh protein, vi khuẩn</td></tr>
  <tr><td>Điện di + borate</td><td>Phức borate–cis-diol mang điện âm</td><td>Đường</td></tr></table></div>
  <div class="box info"><b>Lipid (LIPID MAPS) chia 8 nhóm:</b><br>1. Fatty acyls<br>2. Glycerolipids<br>3. Glycerophospholipids<br>4. Sphingolipids<br>5. Sterol lipids<br>6. Prenol lipids<br>7. Saccharolipids<br>8. Polyketides</div>`,

  traps: [
    { trap: 'Liên kết peptide giữ cấu trúc bậc 2.', truth: 'Peptide giữ <b>bậc 1</b>. Bậc 2 do <b>liên kết H giữa C=O và N–H của khung</b>.' },
    { trap: 'Liên kết H ở bậc 2 nằm giữa các gốc R.', truth: 'Ở bậc 2, liên kết H nằm giữa <b>khung chính</b>. Tương tác giữa các gốc R là chuyện của <b>bậc 3</b>.' },
    { trap: 'Đun sôi làm đứt liên kết peptide, nên mất bậc 1.', truth: 'Biến tính chỉ phá <b>liên kết yếu</b> (bậc 2, 3, 4). <b>Bậc 1 vẫn nguyên</b>. Cắt peptide phải dùng thủy phân (protease, acid mạnh).' },
    { trap: 'Cầu S–S là liên kết yếu, đun lên là đứt.', truth: 'S–S là liên kết <b>cộng hóa trị</b>. Cần <b>chất khử</b> (β-mercaptoethanol, DTT) mới phá được. Urê và nhiệt một mình không đủ.' },
    { trap: 'Protein nào cũng có cấu trúc bậc 4.', truth: 'Chỉ protein có <b>từ 2 chuỗi polypeptide trở lên</b> (vd hemoglobin 2α + 2β). Myoglobin chỉ 1 chuỗi nên <b>không có bậc 4</b>.' },
    { trap: 'Lipid là polymer giống protein và DNA.', truth: 'Lipid <b>không phải polymer</b>, không gồm đơn phân lặp lại. Lipid được xếp thành một nhóm vì cùng tính <b>kỵ nước</b>.' },
    { trap: 'Liên kết đôi làm đuôi acid béo cứng hơn, nên màng cứng hơn.', truth: 'Liên kết đôi <b>cis tạo chỗ gập</b>, làm các đuôi không xếp sít được. Kết quả là màng <b>lỏng, linh động hơn</b>.' },
    { trap: 'Lipid raft là một bào quan, hoặc một lớp màng riêng.', truth: 'Raft là một <b>vùng nhỏ ngay trong màng</b> (vi vùng), giàu cholesterol + sphingolipid, dày và kém lỏng hơn. Raft có thể tụ lại hoặc tan ra.' },
    { trap: 'Đường chạy được trong điện di giống DNA.', truth: 'Đa số đường <b>trung tính</b>, không chạy được. Phải thêm <b>borate</b>: borate tạo phức với cis-diol, cho phức mang điện âm.' },
    { trap: 'SDS-PAGE tách protein theo điện tích.', truth: 'SDS phủ điện tích âm <b>đều theo chiều dài</b> cho mọi protein, nên SDS-PAGE tách theo <b>kích thước</b>. Protein nhỏ chạy xa hơn.' },
  ],

  quiz: [
    { q: 'Cấu trúc bậc 2 của protein (xoắn α, phiến β) được giữ chủ yếu bởi:', ops: ['Liên kết peptide', 'Liên kết H giữa C=O và N–H của khung chính', 'Cầu S–S giữa 2 Cys', 'Liên kết ion giữa các gốc R'], a: 1, e: 'Bậc 2 là liên kết H trong khung chính. Peptide giữ bậc 1. S–S và liên kết ion giữa gốc R thuộc bậc 3, 4.' },
    { q: 'Xử lý protein bằng urê 8 M (không có chất khử). Liên kết nào CÒN nguyên?', ops: ['Chỉ liên kết H', 'Peptide và cầu S–S', 'Chỉ tương tác kỵ nước', 'Không còn liên kết nào'], a: 1, e: 'Urê phá liên kết yếu (H, kỵ nước…). Peptide và S–S đều là cộng hóa trị nên còn. Muốn phá S–S phải thêm β-mercaptoethanol hoặc DTT.' },
    { q: 'Bệnh hồng cầu hình liềm thay Glu bằng Val ở chuỗi β-globin. Thay đổi TRỰC TIẾP xảy ra ở bậc nào?', ops: ['Bậc 1, kéo theo hỏng bậc 3–4', 'Chỉ bậc 2', 'Chỉ bậc 4', 'Không ảnh hưởng cấu trúc'], a: 0, e: 'Đột biến đổi trình tự amino acid, tức bậc 1. Val kỵ nước nằm ở bề mặt làm các hemoglobin dính nhau thành sợi, nên hậu quả lan ra bậc 3–4. Chọn "chỉ bậc 4" là nhầm giữa hậu quả và nguyên nhân.' },
    { q: 'Màng có nhiều acid béo KHÔNG bão hòa dạng cis sẽ:', ops: ['Cứng hơn vì liên kết đôi bền hơn', 'Lỏng và linh động hơn vì đuôi bị gập, không xếp sít', 'Dày hơn như lipid raft', 'Không tạo được lớp kép'], a: 1, e: 'Liên kết đôi cis tạo chỗ gập, các đuôi không xếp sít nên màng lỏng hơn. Dày và kém lỏng là đặc điểm của raft (giàu cholesterol, sphingolipid).' },
    { q: 'Lipid raft có đặc điểm nào?', ops: ['Giàu cholesterol và sphingolipid, dày hơn, tập trung thụ thể tín hiệu', 'Là một bào quan có màng kép', 'Chỉ chứa phospholipid không bão hòa nên rất lỏng', 'Nằm trong nhân tế bào'], a: 0, e: 'Raft là vi vùng trong màng, giàu cholesterol + sphingolipid, dày và kém lỏng, gom thụ thể tín hiệu. Raft không phải bào quan.' },
    { q: 'Vì sao điện di carbohydrate phải xử lý borate?', ops: ['Borate cắt đường thành mảnh nhỏ', 'Đường trung tính; borate tạo phức với cis-diol, làm phức mang điện âm', 'Borate nhuộm màu đường', 'Borate làm gel cứng hơn'], a: 1, e: 'Đường không mang điện nên không chạy trong điện trường. Phức borate–cis-diol mang điện âm nên chạy về cực (+).' },
    { q: 'Trên gel SDS-PAGE, protein 15 kDa và protein 90 kDa: protein nào chạy xa hơn (gần cực + hơn)?', ops: ['90 kDa, vì mang nhiều điện tích hơn', '15 kDa, vì nhỏ nên lách qua lưới gel nhanh hơn', 'Như nhau, vì SDS làm điện tích bằng nhau', 'Tùy điểm đẳng điện của protein'], a: 1, e: 'SDS làm tỉ lệ điện tích/khối lượng gần như đều, nên chỉ còn kích thước quyết định. Protein nhỏ chạy xa hơn. Điểm đẳng điện chỉ quan trọng khi KHÔNG dùng SDS.' },
  ],

  recall: [
    'Vẽ tay 4 bậc cấu trúc protein. Bên cạnh mỗi bậc ghi liên kết giữ nó. Gạch đỏ những cái bị nhiệt hoặc urê phá; khoanh xanh cái cần chất khử (S–S).',
    'Vẽ tay mặt cắt lớp kép phospholipid gồm: đầu ưa nước, 1 đuôi thẳng (bão hòa), 1 đuôi gập (cis), và một lipid raft có cholesterol + thụ thể. Ghi vì sao raft dày hơn.',
    'Gấp màn hình lại, nói to: (1) SDS-PAGE tách protein theo tiêu chí gì, vì sao? (2) Vì sao điện di đường cần borate? (3) Nhóm máu A, B, O khác nhau ở đường nào?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const ring = (sides, r, color, parent) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.14, sides), api.mat(color)); m.rotation.x = Math.PI / 2; parent.add(m); return m; };
    // sugar ring (pyranose 6 / furanose 5) with ring-oxygen marker at the bottom vertex
    const sugarRing = (sides, color, parent) => { const g = api.group(parent); ring(sides, 0.42, color, g); api.sphere(0.1, 0xff3b30, g).position.set(0, -0.4, 0.09); return g; };

    // ================= 0) Map of the 4 macromolecules =================
    const mapG = api.group();
    const nG = api.group(mapG); nG.position.set(0, 2.7, 0);
    api.dna({ seq: 'ATGCGTACGA', rise: 0.32, radius: 0.5, parent: nG });
    const pB = api.blob(0.85, C.protein, mapG, { seed: 2 });
    const lG = api.group(mapG); lG.position.set(2.9, -2.2, 0); lG.rotation.x = 0.5; lG.scale.setScalar(0.75);
    membrane(api, { w: 2.8, d: 1.6, spacing: 0.4, parent: lG });
    const cG = api.group(mapG); cG.position.set(-2.9, -2.2, 0);
    for (let i = 0; i < 4; i++) { const s = sugarRing(6, 0x5ab4e6, cG); s.position.set((i - 1.5) * 0.85, (i % 2) * 0.25, 0); }
    arrow(api, [-0.35, 1.95, 0], [-0.35, 0.95, 0], C.good, mapG);
    arrow(api, [0.35, 0.95, 0], [0.35, 1.95, 0], C.enzyme, mapG);
    arrow(api, [0.75, -0.55, 0], [2.05, -1.5, 0], C.protein, mapG);
    arrow(api, [-0.75, -0.55, 0], [-2.05, -1.5, 0], C.protein, mapG);
    lb.add('m_n', 'Nucleic acid: lưu thông tin', [0, 3.75, 0], null, 'big');
    lb.add('m_p', 'Protein: "người làm việc"', [0, -1.25, 0], null, 'big');
    lb.add('m_l', 'Lipid: màng', [2.9, -3.25, 0], null, 'big');
    lb.add('m_c', 'Đường: năng lượng<br>+ "thẻ căn cước"', [-2.8, -3.4, 0], null, 'big');
    lb.add('m_a1', 'mã hóa', [-1.2, 1.45, 0], null, 'good');
    lb.add('m_a2', 'điều hòa', [1.25, 1.45, 0]);
    lb.add('m_a3', 'enzyme tạo', [1.95, -0.7, 0], null, 'dim');
    lb.add('m_a4', 'enzyme tạo', [-1.95, -0.7, 0], null, 'dim');

    // ================= 1) Peptide bond close-up =================
    const pepG = api.group();
    const NC = 0x4a7bd0, CC = 0x9aa5b1, OC = 0xff3b30, HC = 0xf0f0f0;
    const AT = { N: [-1, 0, 0.24, NC], Ca: [0, 0.35, 0.26, CC], C: [1, 0, 0.24, CC], Od: [1, 1, 0.22, OC], O: [1.75, -0.55, 0.22, OC], HO: [2.3, -0.35, 0.13, HC], H1: [-1.55, 0.5, 0.13, HC], H2: [-1.5, -0.55, 0.13, HC] };
    const mkAA = (rCol, seed) => {
      const a = {};
      for (const [k, [x, y, r, col]] of Object.entries(AT)) { a[k] = api.sphere(r, col, pepG); a[k].userData.base = V(x, y, 0); }
      a.R = api.blob(0.42, rCol, pepG, { seed }); a.R.userData.base = V(0, 1.45, 0.1);
      return a;
    };
    const aa1 = mkAA(POL, 1), aa2 = mkAA(HYD, 4);
    const BONDS = [['N', 'Ca'], ['Ca', 'C'], ['C', 'Od'], ['C', 'O'], ['O', 'HO'], ['N', 'H1'], ['N', 'H2'], ['Ca', 'R']];
    const pSticks = [];
    for (const a of [aa1, aa2]) for (const [u, v] of BONDS) pSticks.push({ m: api.stick(V(0, 0, 0), V(0, 1, 0), u === 'C' && v === 'Od' ? 0.09 : 0.06, 0xdddddd, pepG), a: a[u], b: a[v], key: (a === aa1 ? '1' : '2') + u + v });
    const waterBond = api.stick(V(0, 0, 0), V(0, 1, 0), 0.06, 0xdddddd, pepG);
    const pepBond = api.stick(V(0, 0, 0), V(0, 1, 0), 0.1, C.good, pepG);
    lb.add('p_r', 'gốc R: 20 loại aa khác nhau ở đây', [-2.9, 2.5, 0], null, 'dim');
    lb.add('p_nh2', '–NH₂ (amin)', [-2.9, -1.2, 0]);
    lb.add('p_cooh', '–COOH (carboxyl)', [0.25, 1.95, 0]);
    lb.add('p_h2o', 'H₂O tách ra (ngưng tụ)', [2.1, -2.2, 0], null, 'warn');
    lb.add('p_bond', 'liên kết peptide –CO–NH–', [0.05, -0.75, 0.3], null, 'good');

    // ================= 2–4) Polypeptide chain =================
    const N = 26;
    const TYPE = Array(N).fill(POL);
    [1, 5, 6, 15, 17, 21, 23].forEach(i => TYPE[i] = HYD);
    TYPE[2] = POS; TYPE[18] = NEG; TYPE[9] = CYS; TYPE[14] = CYS;
    const CYS1 = 9, CYS2 = 14, LYS = 2, GLU = 18;
    const deg = Math.PI / 180;
    const LINE = [], SEC = [], TERT = [], COIL = [];
    for (let i = 0; i < N; i++) {
      LINE.push(V((i - (N - 1) / 2) * 0.42, i % 2 ? 0.12 : -0.12, 0));
      COIL.push(V((i - (N - 1) / 2) * 0.34, 0.8 * Math.sin(i * 0.9) + 0.35 * Math.sin(i * 2.3 + 1), 0.7 * Math.cos(i * 1.3)));
      const alt = (k) => (k % 2 ? -0.15 : 0.15);
      let s, t;
      if (i <= 11) { const a = i * 100 * deg; s = V(-2.6 + (i - 5.5) * 0.33, 0.2 + 0.5 * Math.cos(a), 0.5 * Math.sin(a)); t = V(0.2 + (i - 5.5) * 0.33, 0.95 + 0.5 * Math.cos(a), 0.35 + 0.5 * Math.sin(a)); }
      else if (i === 12) { s = V(0, -0.3, 0); t = V(2.75, 0.3, 0.2); }
      else if (i <= 17) { const k = i - 13; s = V(0.6 + 0.7 * k, 0.45, alt(k)); t = V(2.4 - 0.7 * k, -0.35, -0.2 + alt(k)); }
      else if (i === 18) { s = V(3.9, 0.2, 0); t = V(-0.85, -0.6, -0.2); }
      else if (i === 19) { s = V(3.9, -0.5, 0); t = V(-0.85, -1.15, -0.2); }
      else if (i <= 24) { const k = i - 20; s = V(3.4 - 0.7 * k, -0.55, alt(k)); t = V(-0.4 + 0.7 * k, -1.35, -0.2 + alt(k)); }
      else { s = V(0, -1.0, 0); t = V(3.0, -1.6, -0.2); }
      SEC.push(s); TERT.push(t);
    }
    const tc = new THREE.Vector3(); TERT.forEach(p => tc.add(p)); tc.multiplyScalar(1 / N); TERT.forEach(p => p.sub(tc));
    const protG = api.group();
    const beadG = new THREE.SphereGeometry(0.2, 16, 12);
    const beads = TYPE.map((col) => { const m = new THREE.Mesh(beadG, api.mat(col)); protG.add(m); return m; });
    beads.forEach((b, i) => b.position.copy(LINE[i]));
    const bbSt = []; for (let i = 0; i < N - 1; i++) bbSt.push(api.stick(LINE[i], LINE[i + 1], 0.06, 0xb0b8c4, protG));
    const HBP = []; for (let i = 0; i <= 7; i++) HBP.push([i, i + 4]); for (let k = 0; k <= 4; k++) HBP.push([13 + k, 24 - k]);
    const hbSt = HBP.map(() => api.stick(V(0, 0, 0), V(0, 1, 0), 0.025, 0xffffff, protG, { opacity: 0.85 }));
    const ssSt = api.stick(V(0, 0, 0), V(0, 1, 0), 0.08, CYS, protG);
    const mid = (a, b) => a.clone().add(b).multiplyScalar(0.5);
    // cartoon overlay: helix ribbon tube + two flat β arrows (textbook style)
    const hpts = []; for (let u = -0.3; u <= 11.3; u += 0.2) { const a = u * 100 * deg; hpts.push(V((u - 5.5) * 0.33, 0.5 * Math.cos(a), 0.5 * Math.sin(a))); }
    const helixCart = api.group(protG); const hTube = api.tube(hpts, 0.13, C.protein, helixCart, { opacity: 0 });
    const sheetCart = api.group(protG);
    const mkArrow = (y, dir) => { const g = api.group(sheetCart); const m = api.mat(0x2bb3a3, { opacity: 0 }); const sh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.42, 0.06), m); sh.position.x = -0.25 * dir; g.add(sh); const hd = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.4, 0.55, 3), m); hd.rotation.z = -Math.PI / 2 * dir; hd.scale.z = 0.15; hd.position.x = 1.2 * dir; g.add(hd); g.position.y = y; return m; };
    const cartMats = [hTube.material, mkArrow(0.5, 1), mkArrow(-0.5, -1)];
    const HC_SEC = V(-2.6, 0.2, 0), HC_TER = V(0.2, 0.95, 0.35).sub(tc), SC_SEC = V(2.0, -0.05, 0), SC_TER = V(1.0, -0.85, -0.2).sub(tc);
    lb.add('c_N', 'đầu N', LINE[0].clone().add(V(-0.75, 0, 0)), protG, 'big');
    lb.add('c_C', 'đầu C', LINE[N - 1].clone().add(V(0.75, 0, 0)), protG, 'big');
    lb.add('c_1', 'Bậc 1: chuỗi amino acid nối bằng peptide', [0, -0.8, 0], protG);
    lb.add('s_a', 'xoắn α (3,6 aa/vòng)', [-2.6, 1.25, 0], protG, 'big');
    lb.add('s_b', 'phiến β (2 mạch ngược chiều)', [2.25, 1.25, 0], protG, 'big');
    lb.add('s_hb', 'liên kết H: C=O ··· H–N của KHUNG', [0, -1.55, 0], protG);
    lb.add('t_t', 'Bậc 3: cả chuỗi gấp thành khối 3D', [0, 2.15, 0], protG, 'big');
    lb.add('t_ss', 'cầu S–S (2 Cys)', mid(TERT[CYS1], TERT[CYS2]).add(V(1.3, 0.1, 0.6)), protG, 'good');
    lb.add('t_ion', 'ion: Lys⁺ ··· Glu⁻', mid(TERT[LYS], TERT[GLU]).add(V(-1.3, 0, 0.6)), protG);
    const hc = new THREE.Vector3(); let nh = 0; TYPE.forEach((t, i) => { if (t === HYD) { hc.add(TERT[i]); nh++; } }); hc.multiplyScalar(1 / nh);
    lb.add('t_hyd', 'lõi kỵ nước', hc.clone().add(V(0, -0.1, 0.9)), protG, 'dim');
    lb.add('t_den', 'chỉ còn liên kết peptide (bậc 1)', [0, -1.7, 0], protG, 'warn');

    // quaternary: 3 static copies of the folded chain
    const quatG = api.group();
    const QP = [V(-1.4, 1.0, 0), V(1.4, 1.0, 0), V(-1.4, -1.0, 0), V(1.4, -1.0, 0)];
    const QR = [[0, 0, 0], [0, Math.PI, 0], [Math.PI, 0, 0], [0, 0, Math.PI]];
    const subs = [null];
    for (let s = 1; s < 4; s++) {
      const g = api.group(quatG); g.rotation.set(...QR[s]); g.scale.setScalar(0.55);
      const m = api.mat(s === 3 ? C.protein : C.enzyme);
      TERT.forEach((p, i) => { const b = new THREE.Mesh(beadG, m); b.position.copy(p); g.add(b); if (i) api.stick(TERT[i - 1], p, 0.06, 0xb0b8c4, g); });
      subs.push(g);
    }
    lb.add('q_t', 'Bậc 4: nhiều chuỗi ghép lại', [0, 2.75, 0], null, 'big');
    lb.add('q_hb', 'vd hemoglobin = 2α + 2β', [0, -2.75, 0]);
    lb.add('q_0', 'α', [-1.4, 1.0, 1.3], null, 'plain'); lb.add('q_1', 'β', [1.4, 1.0, 1.3], null, 'plain');
    lb.add('q_2', 'β', [-1.4, -1.0, 1.3], null, 'plain'); lb.add('q_3', 'α', [1.4, -1.0, 1.3], null, 'plain');
    lb.add('q_den', 'tách rời + duỗi → mất chức năng', [0, 0, 1.5], null, 'warn');

    // ================= 5) Bilayer cross-section =================
    const memG = api.group();
    const headGeo = new THREE.SphereGeometry(0.2, 14, 10), segGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 6);
    const headM = api.mat(0x7fb2e5), tailM = api.mat(0xe8dcc0), kinkM = api.mat(0xffa94d);
    const NX = 14, ROWS = [-0.7, 0, 0.7], lipids = [];
    for (const leaf of [1, -1]) for (const z of ROWS) for (let i = 0; i < NX; i++) {
      const g = new THREE.Group(); memG.add(g);
      g.add(new THREE.Mesh(headGeo, headM));
      const segs = [0, 1, 2, 3].map(k => { const m = new THREE.Mesh(segGeo, k === 3 ? kinkM : tailM); g.add(m); return m; });
      if (leaf < 0) g.rotation.z = Math.PI;
      lipids.push({ g, segs, i, z, leaf });
    }
    const pA = V(0, 0, 0), pB2 = V(0, 0, 0), pC = V(0, 0, 0);
    let memKink = -1;
    const layoutMem = (k) => {
      const sp = lerp(0.46, 0.62, k), ang = 0.55 * k;
      lipids.forEach(L => {
        L.g.position.set((L.i - (NX - 1) / 2) * sp + (L.leaf < 0 ? 0.1 : 0), L.leaf * 1.25, L.z);
        pA.set(-0.08, -0.18, 0); pB2.set(-0.08, -0.7, 0); pC.set(-0.08, -1.2, 0);
        api.setStick(L.segs[0], pA, pB2); api.setStick(L.segs[1], pB2, pC);
        pA.set(0.08, -0.18, 0); pB2.set(0.08, -0.7, 0); pC.set(0.08 + 0.5 * Math.sin(ang), -0.7 - 0.5 * Math.cos(ang), 0);
        api.setStick(L.segs[2], pA, pB2); api.setStick(L.segs[3], pB2, pC);
      });
      kinkM.color.set(k > 0.5 ? 0xffa94d : 0xe8dcc0);
    };
    const water = [];
    for (let i = 0; i < 26; i++) { const w = api.sphere(0.09, 0x6fc3ff, memG, { opacity: 0.75 }); const up = i % 2 ? 1 : -1; w.userData.b = V(((i * 37) % 80) / 10 - 4, up * (2.0 + ((i * 13) % 10) / 10), ((i * 7) % 14) / 10 - 0.7); water.push(w); }
    lb.add('w_head', 'đầu ưa nước (phosphate)', [-2.3, 1.95, 1.0]);
    lb.add('w_tail', 'đuôi kỵ nước (2 acid béo)', [-2.3, -0.05, 1.2], null, 'dim');
    lb.add('w_kink', 'C=C cis → gập', [2.0, 0.3, 1.2], null, 'warn');
    lb.add('w_sat', 'đuôi thẳng → xếp sít', [2.0, 0.3, 1.2], null, 'warn');
    lb.add('w_water', 'nước', [3.0, 2.45, 0.8], null, 'dim');

    // ================= 6) Lipid raft (top view) =================
    const raftG = api.group();
    const RAFT = [-1.75, 1.75, -1.5, 1.5];
    const mem = membrane(api, { w: 11, d: 6.5, spacing: 0.5, raft: RAFT, parent: raftG });
    const inR = (x, z) => x > RAFT[0] && x < RAFT[1] && z > RAFT[2] && z < RAFT[3];
    const cholG = api.group(raftG), gslG = api.group(raftG);
    const cholGeo = new THREE.BoxGeometry(0.1, 0.55, 0.22), cholM = api.mat(0xffd166);
    mem.cells.forEach((c, k) => {
      if (!c.inRaft || !inR(c.x + 0.25, c.z + 0.25)) return;
      const m = new THREE.Mesh(cholGeo, cholM); m.position.set(c.x + 0.25, c.leaf ? -0.85 : 0.85, c.z + 0.25); m.rotation.y = k * 0.7; cholG.add(m);
      if (!c.leaf && k % 4 === 0) { const s1 = api.sphere(0.12, 0x4a90e2, gslG); s1.position.set(c.x, 1.6, c.z); const s2 = api.sphere(0.12, CYS, gslG); s2.position.set(c.x + 0.05, 1.88, c.z); api.stick(s1.position, s2.position, 0.035, 0xdddddd, gslG); }
    });
    const recs = [];
    const RS = [V(-4.0, 0, -1.8), V(-3.6, 0, 2.2), V(3.8, 0, -2.0), V(4.2, 0, 1.6), V(0.4, 0, -2.9)];
    const RT = [V(-0.8, 0, -0.6), V(-0.7, 0, 0.8), V(0.8, 0, -0.7), V(0.9, 0, 0.7), V(0.05, 0, 0.05)];
    RS.forEach((p, i) => {
      const g = api.group(raftG); api.cylinder(0.24, 0.24, 2.6, C.protein, g); api.blob(0.32, C.protein, g, { seed: i }).position.y = 1.65; api.blob(0.3, C.protein, g, { seed: i + 3 }).position.y = -1.6;
      g.position.copy(p); recs.push(g);
    });
    [V(-2.6, 0, 2.7), V(4.4, 0, -0.2), V(-4.3, 0, -2.7)].forEach((p, i) => { const g = api.group(raftG); api.cylinder(0.22, 0.22, 2.4, 0x8b949e, g); api.blob(0.32, 0x8b949e, g, { seed: 9 + i }).position.y = 1.5; g.position.copy(p); });
    const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), ss = new THREE.Vector3(1, 1, 1), tv = new THREE.Vector3(), col = new THREE.Color(), cNorm = new THREE.Color(0x7fb2e5), cRaft = new THREE.Color(0xd98cd9);
    let raftAmt = 1, raftApplied = -1;
    const applyRaft = (ra) => {
      mem.cells.forEach((c, k) => {
        if (!c.inRaft) return;
        const sgn = c.leaf ? -1 : 1, hy = sgn * (1.05 + 0.2 * ra);
        ss.set(1, 1, 1); tv.set(c.x, hy, c.z); m4.compose(tv, qq, ss); mem.head.setMatrixAt(k, m4);
        mem.head.setColorAt(k, col.copy(cNorm).lerp(cRaft, ra));
        ss.set(1, 1 + 0.35 * ra, 1);
        [-0.08, 0.08].forEach((off, o) => { tv.set(c.x + off, hy - sgn * (0.55 + 0.1 * ra), c.z); m4.compose(tv, qq, ss); mem.tail.setMatrixAt(2 * k + o, m4); });
      });
      mem.head.instanceMatrix.needsUpdate = true; mem.head.instanceColor.needsUpdate = true; mem.tail.instanceMatrix.needsUpdate = true;
      cholG.scale.setScalar(Math.max(0.001, ra)); gslG.scale.setScalar(Math.max(0.001, ra));
    };
    lb.add('r_raft', 'lipid raft', [0, 2.9, 0], null, 'big');
    lb.add('r_desc', 'cholesterol + sphingolipid → dày, kém lỏng', [0, 1.4, 2.6]);
    lb.add('r_rec', 'thụ thể tín hiệu tụ lại', [2.2, 2.6, 0.6], null, 'good');
    lb.add('r_norm', 'màng thường: lỏng hơn', [-3.9, 2.3, -0.5], null, 'dim');
    lb.add('r_gone', '💥 raft tan, thụ thể tản ra', [0, 2.9, 0], null, 'warn');

    // ================= 7) Carbohydrates =================
    const carbG = api.group();
    const GLC = 0x4a90e2, FRU = 0x3fb27f;
    const glc = sugarRing(6, GLC, carbG); glc.position.set(-3.4, 2.1, 0);
    const fru = sugarRing(5, FRU, carbG); fru.position.set(-1.6, 2.1, 0);
    const sG = sugarRing(6, GLC, carbG), sF = sugarRing(5, FRU, carbG);
    const oBr = api.sphere(0.13, 0xff3b30, carbG);
    const sb1 = api.stick(V(0, 0, 0), V(0, 1, 0), 0.05, 0xdddddd, carbG), sb2 = api.stick(V(0, 0, 0), V(0, 1, 0), 0.05, 0xdddddd, carbG);
    const POLYP = [];
    for (let i = 0; i < 9; i++) POLYP.push(V(-3.6 + 0.9 * i, -0.9 + (i % 2 ? 0.15 : -0.15), 0));
    POLYP.push(V(0.3, -1.75, 0), V(1.05, -2.4, 0), V(1.9, -2.7, 0));
    const POLYS = POLYP.map((p, i) => V(Math.sin(i * 2.7) * 4.2, -1.6 + Math.cos(i * 1.9) * 1.6, Math.sin(i * 1.3) * 2));
    const poly = POLYP.map(() => sugarRing(6, GLC, carbG));
    poly.forEach(p => p.scale.setScalar(0.85));
    const PLINK = []; for (let i = 0; i < 8; i++) PLINK.push([i, i + 1]); PLINK.push([4, 9], [9, 10], [10, 11]);
    const plSt = PLINK.map(() => api.stick(V(0, 0, 0), V(0, 1, 0), 0.05, 0xdddddd, carbG));
    lb.add('k_glc', 'Glucose<br>aldose (–CHO)', [-3.6, 1.25, 0]);
    lb.add('k_fru', 'Fructose<br>ketose (C=O)', [-1.6, 1.25, 0]);
    lb.add('k_suc', 'Sucrose = Glc + Fru', [2.05, 1.4, 0]);
    lb.add('k_gly', 'liên kết glycoside –O–', [2.05, 2.95, 0], null, 'good');
    lb.add('k_mers', 'mono → di → oligo (3–10) → poly', [0, 0.35, 0], null, 'big');
    lb.add('k_poly', 'Polysaccharide (glycogen)', [-1.9, -1.85, 0]);
    lb.add('k_br', 'nhánh α1→6', [2.75, -1.95, 0], null, 'dim');

    // ================= 8) Glycoprotein / glycolipid, ABO =================
    const glyG = api.group();
    const gMem = api.group(glyG); gMem.position.y = -1.7;
    membrane(api, { w: 9, d: 2.6, spacing: 0.45, parent: gMem });
    const gp = api.group(glyG); gp.position.x = -2.0;
    api.cylinder(0.28, 0.28, 2.6, C.protein, gp).position.y = -1.7; api.blob(0.6, C.protein, gp, { seed: 5 }).position.y = 0;
    const sq = (col, x, y, par) => { const m = api.box(0.3, 0.3, 0.3, col, par); m.position.set(x, y, 0); return m; };
    const ci = (col, x, y, par) => { const m = api.sphere(0.17, col, par); m.position.set(x, y, 0); return m; };
    const GLCNAC = 0x4a90e2, MAN = 0x3fb27f, GAL = 0xf2c94c;
    const tree = [sq(GLCNAC, 0, 0.95, gp), sq(GLCNAC, 0, 1.4, gp), ci(MAN, 0, 1.85, gp), ci(MAN, -0.45, 2.3, gp), ci(MAN, 0.45, 2.3, gp), ci(MAN, -0.45, 2.75, gp), ci(MAN, 0.45, 2.75, gp)];
    [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 6]].forEach(([a, b]) => api.stick(tree[a].position, tree[b].position, 0.04, 0xdddddd, gp));
    api.stick(V(0, 0.55, 0), tree[0].position, 0.04, 0xdddddd, gp);
    const gl = api.group(glyG); gl.position.x = 1.6;
    const cer = api.sphere(0.22, 0xd98cd9, gl); cer.position.y = -0.6;
    const ch = [ci(0x4a90e2, 0, -0.1, gl), ci(GAL, 0, 0.35, gl), sq(GLCNAC, 0, 0.8, gl), ci(GAL, 0, 1.25, gl)];
    const fuc = api.cylinder(0, 0.2, 0.32, 0xe8505b, gl); fuc.position.set(0.48, 1.55, 0); fuc.rotation.z = -0.5;
    const termA = sq(GAL, -0.3, 1.72, gl), termB = ci(GAL, -0.3, 1.72, gl);
    [[cer, ch[0]], [ch[0], ch[1]], [ch[1], ch[2]], [ch[2], ch[3]], [ch[3], fuc]].forEach(([a, b]) => api.stick(a.position, b.position, 0.04, 0xdddddd, gl));
    const termSt = api.stick(ch[3].position, termA.position, 0.04, 0xdddddd, gl);
    const abG = api.group(glyG);
    const abM = 0xdfe6ee;
    api.stick(V(0, 0, 0), V(0, -0.7, 0), 0.07, abM, abG); api.stick(V(0, 0, 0), V(-0.4, 0.45, 0), 0.07, abM, abG); api.stick(V(0, 0, 0), V(0.4, 0.45, 0), 0.07, abM, abG);
    api.sphere(0.1, abM, abG).position.set(-0.4, 0.45, 0); api.sphere(0.1, abM, abG).position.set(0.4, 0.45, 0);
    lb.add('g_ab', 'kháng thể anti-B', [1.0, 0.35, 0], abG, 'dim');
    let bloodType = 'A';
    lb.add('g_n', 'N-glycan gắn Asn', [-2.0, 3.3, 0], null, 'dim');
    lb.add('g_prot', 'glycoprotein', [-3.4, 0.05, 0.4]);
    lb.add('g_lip', 'glycolipid', [0.55, -0.35, 0.4]);
    lb.add('g_H', 'Fuc: kháng nguyên H', [3.2, 1.0, 0], null, 'dim');
    lb.add('g_term', '', [-0.2, 2.35, 0], null, 'big');
    lb.add('g_bind', 'anti-B bám → ngưng kết ✗', [3.3, 3.45, 0], null, 'warn');
    lb.add('g_free', 'không có đích → không bám ✓', [2.6, 4.05, 0], null, 'good');

    // ================= 9) Electrophoresis =================
    const gelG = api.group();
    api.box(5.4, 5.2, 0.25, 0x9fd3e8, gelG, { opacity: 0.28 });
    api.box(5.8, 0.22, 0.35, 0x2b2b2b, gelG).position.y = 2.75;
    api.box(5.8, 0.22, 0.35, 0xd63031, gelG).position.y = -2.75;
    const LX = [-1.3, 1.3];
    LX.forEach(x => { api.box(1.1, 0.18, 0.3, 0x203040, gelG).position.set(x, 2.25, 0.05); });
    const KDA = [100, 50, 25, 10], DIST = [0.9, 1.8, 2.7, 3.9];
    const pBands = KDA.map(() => api.box(1.0, 0.13, 0.3, C.protein, gelG));
    const sBand = api.box(1.0, 0.13, 0.3, 0xf2c94c, gelG);
    const borDots = []; for (let i = 0; i < 6; i++) borDots.push(api.sphere(0.07, 0xe8505b, gelG));
    arrow(api, [2.95, 1.9, 0], [2.95, -1.9, 0], 0xffffff, gelG, 0.04);
    KDA.forEach((k, i) => lb.add('e_k' + i, k + ' kDa', [-2.45, 2.15 - DIST[i], 0.2], gelG, 'plain'));
    lb.add('e_neg', '(−)', [-3.15, 2.75, 0], gelG, 'big'); lb.add('e_pos', '(+)', [-3.15, -2.75, 0], gelG, 'warn');
    lb.add('e_l1', 'Protein + SDS', [-1.3, 3.25, 0], gelG); lb.add('e_l2', 'Đường', [1.3, 3.25, 0], gelG);
    lb.add('e_sds', 'SDS: nhỏ chạy nhanh, tách theo KÍCH THƯỚC', [0, -3.3, 0], gelG, 'good');
    lb.add('e_sug', '', [1.3, 1.7, 0.3], gelG);

    // ================= state =================
    let cur = 0, den = false, cis = true, cholDep = false, bor = false;
    const pr = progress(0.3);
    const groups = { mapG, pepG, protG, quatG, memG, raftG, carbG, glyG, gelG };
    const VIS = [['mapG'], ['pepG', 'protG'], ['protG'], ['protG'], ['protG', 'quatG'], ['memG'], ['raftG'], ['carbG'], ['glyG'], ['gelG']];
    const CAM = [[[0, 0.5, 13.5], [0, 0.35, 0]], [[0, -0.6, 12.5], [0, -0.9, 0]], [[1.8, 2.6, 9.5], [0, 0, 0]], [[1.5, 1.5, 8], [0, 0, 0]], [[0, 0.5, 10], [0, 0, 0]],
      [[0, 1.0, 10], [0, 0.3, 0]], [[0, 8.5, 11.5], [0, -0.3, 0.6]], [[0, 0.2, 11], [0, 0, 0]], [[0, 1.6, 11.5], [0, 1.1, 0]], [[0, 0.15, 12], [0, 0.15, 0]]];
    const LBL = [
      ['m_n', 'm_p', 'm_l', 'm_c', 'm_a1', 'm_a2', 'm_a3', 'm_a4'],
      ['p_r', 'p_nh2', 'p_cooh', 'c_N', 'c_C', 'c_1'],
      ['s_a', 's_b', 's_hb'],
      ['t_t', 't_ss', 't_ion', 't_hyd'],
      ['q_t', 'q_hb', 'q_0', 'q_1', 'q_2', 'q_3'],
      ['w_head', 'w_tail', 'w_water'],
      ['r_raft', 'r_desc', 'r_rec', 'r_norm'],
      ['k_glc', 'k_fru', 'k_suc', 'k_gly', 'k_mers', 'k_poly', 'k_br'],
      ['g_ab', 'g_n', 'g_prot', 'g_lip', 'g_H', 'g_term'],
      ['e_k0', 'e_k1', 'e_k2', 'e_k3', 'e_neg', 'e_pos', 'e_l1', 'e_l2', 'e_sds', 'e_sug'],
    ];
    const DEN_MSG = '💥 <b>Urê + β-mercaptoethanol</b>: urê phá các liên kết yếu (H, kỵ nước, ion), β-ME khử cầu S–S. Chỉ còn <b>liên kết peptide</b>, nên bậc 1 còn nguyên, nhưng mất bậc 2, 3, 4 và <b>mất chức năng</b>.<br>Tắt công tắc (rút urê + β-ME từ từ): chuỗi tự gấp lại đúng như cũ. Đây là <b>thí nghiệm Anfinsen</b>: trình tự quyết định cấu trúc.';
    const readout = () => {
      const s = cur; let h;
      if (s === 0) h = 'Protein nằm giữa vì nó "làm việc" cho cả 3 nhóm còn lại. Kéo để xoay.';
      else if (s === 1) h = 'Chú ý: nước sinh ra từ <b>–OH của nhóm COOH</b> (aa 1) và <b>–H của nhóm NH₂</b> (aa 2). Liên kết peptide nối <b>C của aa 1 với N của aa 2</b>.';
      else if (s >= 2 && s <= 4) h = den ? DEN_MSG : (s === 2 ? 'Que trắng = liên kết H giữa C=O và N–H <b>của khung</b>, không phải giữa các gốc R.' : s === 3 ? 'Vàng = cầu S–S (cộng hóa trị). Xanh–đỏ = cặp ion Lys⁺/Glu⁻. Nâu = gốc kỵ nước, tụ vào lõi.' : 'Các tiểu đơn vị giữ nhau bằng liên kết yếu (kỵ nước, ion, H), giống bậc 3.') + '<br>Bật <b>💥 Urê + β-ME</b> để biến tính.';
      else if (s === 5) h = cis ? 'Đuôi <b>cis</b> gập, nên các phân tử không xếp sít được và màng <b>lỏng, linh động</b> (như dầu).' : 'Toàn đuôi <b>bão hòa</b>: thẳng, xếp sít nhau, nên màng <b>đặc, kém linh động</b> (như mỡ, bơ). Tế bào ở vùng lạnh phải tránh tình trạng này.';
      else if (s === 6) h = cholDep ? '💥 Rút cholesterol (methyl-β-cyclodextrin): raft tan ra, thụ thể tản đi khắp màng, nên <b>tín hiệu yếu và chậm</b>.' : 'Raft (hồng) giàu cholesterol (vàng) và sphingolipid (có chuỗi đường) nên dày hơn. Thụ thể tụ lại thành một "bục làm việc", tín hiệu nhanh và mạnh.';
      else if (s === 7) h = 'Đơn phân đường nối nhau bằng <b>liên kết glycoside</b> (ngưng tụ, tách H₂O), giống cách amino acid nối bằng peptide.';
      else if (s === 8) h = bloodType === 'A' ? 'Hồng cầu <b>nhóm A</b>: đầu chuỗi là <b>GalNAc</b>. Anti-B không có đích nên <b>không bám</b> ✓.' : bloodType === 'B' ? 'Hồng cầu <b>nhóm B</b>: đầu chuỗi là <b>Gal</b>. Anti-B (có sẵn trong máu người nhóm A) <b>bám vào → ngưng kết</b> ✗. Vì vậy người nhóm A không nhận được máu B.' : 'Hồng cầu <b>nhóm O</b>: chỉ có kháng nguyên H, không thêm đường nào. Anti-A và anti-B đều không bám, nên hồng cầu O cho được mọi nhóm.';
      else h = bor ? 'Borate gắn vào <b>cis-diol</b> của đường, tạo phức mang điện <b>âm</b>, nên đường chạy về cực (+).' : 'Đường <b>trung tính</b>, nên đứng yên ở giếng. Bật <b>Thêm borate</b>.';
      api.readout(h);
    };
    const tDen = api.toggle('💥 Urê + β-ME (biến tính)', false, (v) => { den = v; ctl.setStep(cur); });
    const tCis = api.toggle('Đuôi không bão hòa (cis)', true, (v) => { cis = v; ctl.setStep(cur); });
    const tChol = api.toggle('💥 Rút cholesterol', false, (v) => { cholDep = v; ctl.setStep(cur); });
    const bAbo = api.buttons([['Hồng cầu A', () => { bloodType = 'A'; ctl.setStep(cur); }], ['Hồng cầu B', () => { bloodType = 'B'; ctl.setStep(cur); }], ['Hồng cầu O', () => { bloodType = 'O'; ctl.setStep(cur); }]]);
    const tBor = api.toggle('Thêm borate', false, (v) => { bor = v; ctl.setStep(cur); });
    const CTL = [[tDen.el, [2, 3, 4]], [tCis.el, [5]], [tChol.el, [6]], [bAbo, [8]], [tBor.el, [9]]];

    const protTarget = { pos: V(0, 0, 0), s: 1 };
    let borV = 0;
    const ctl = {
      setStep(s) {
        cur = s;
        for (const [k, g] of Object.entries(groups)) { if (k === 'protG') continue; const on = VIS[s].includes(k); g.visible = true; api.scaleTo(g, on ? 1 : 0.001, 6); }
        protTarget.pos.set(...(s === 1 ? [0, -4.1, 0] : s === 4 ? [-1.4, 1.0, 0] : [0, 0, 0]));
        protTarget.s = s === 1 ? 0.7 : (s === 2 || s === 3) ? 1 : s === 4 ? 0.55 : 0.001;
        pr.snap(0, 1);
        if (s === 4) beads.forEach(b => api.colorTo(b, C.protein, 4)); else beads.forEach((b, i) => api.colorTo(b, TYPE[i], 4));
        api.camera(...CAM[s]);
        let L = LBL[s].slice();
        if (s >= 2 && s <= 4 && den) L = L.filter(k => !['s_a', 's_b', 't_t', 's_hb', 't_ss', 't_ion', 't_hyd', 'q_0', 'q_1', 'q_2', 'q_3'].includes(k)).concat(s === 4 ? ['q_den'] : ['t_den']);
        if (s === 5) L.push(cis ? 'w_kink' : 'w_sat');
        if (s === 6 && cholDep) L = L.filter(k => !['r_raft', 'r_rec', 'r_desc'].includes(k)).concat(['r_gone']);
        if (s === 8) { if (bloodType === 'B') L = L.filter(k => k !== 'g_ab'); L.push(bloodType === 'B' ? 'g_bind' : 'g_free'); lb.set('g_term', bloodType === 'A' ? 'nhóm A: + GalNAc' : bloodType === 'B' ? 'nhóm B: + Gal' : 'nhóm O: không thêm'); }
        lb.only(L);
        CTL.forEach(([el, steps]) => { el.style.display = steps.includes(s) ? '' : 'none'; });
        readout();
      },
      update(dt, t) {
        const p = pr.tick(dt), e = ease(p), s = cur, k6 = Math.min(1, dt * 6);
        // ---- step 0 ----
        if (s === 0) { nG.rotation.x += dt * 0.6; pB.rotation.y += dt * 0.4; cG.rotation.y = Math.sin(t * 0.6) * 0.4; lG.rotation.y = Math.sin(t * 0.5) * 0.3; }
        // ---- step 1: peptide bond ----
        if (s === 1) {
          const a = ease(clamp(e / 0.35)), b = ease(clamp((e - 0.35) / 0.3)), c = ease(clamp((e - 0.65) / 0.35));
          const off1 = -1.6, off2 = lerp(3.4, 1.7, a);
          for (const [aa, off] of [[aa1, off1], [aa2, off2]]) for (const k of Object.keys(AT).concat('R')) { const m = aa[k]; m.position.copy(m.userData.base); m.position.x += off; }
          const drop = c * 0.9;
          aa1.O.position.lerp(tv.set(0.1, -1.5 - drop, 0), b);
          aa1.HO.position.lerp(tv.set(0.65, -1.8 - drop, 0), b);
          aa2.H2.position.lerp(tv.set(-0.45, -1.8 - drop, 0), b);
          for (const w of [aa1.O, aa1.HO, aa2.H2]) w.material.opacity = 1 - 0.55 * c;
          pSticks.forEach(st => { st.m.visible = !((st.key === '1CO' || st.key === '2NH2') && b > 0.15); if (st.m.visible) api.setStick(st.m, st.a.position, st.b.position); });
          waterBond.visible = b > 0.85; if (waterBond.visible) api.setStick(waterBond, aa1.O.position, aa2.H2.position);
          pepBond.visible = c > 0.02; if (pepBond.visible) { tv.copy(aa2.N.position).sub(aa1.C.position).multiplyScalar(c).add(aa1.C.position); api.setStick(pepBond, aa1.C.position, tv); }
          lb.show('p_h2o', b > 0.6); lb.show('p_bond', c > 0.4);
          pepG.rotation.y = Math.sin(t * 0.4) * 0.25;
        }
        // ---- chain (steps 1–4) ----
        protG.position.lerp(protTarget.pos, k6);
        const sc = s === 1 ? protTarget.s * Math.max(0.001, clamp((e - 0.55) / 0.45)) : protTarget.s;
        protG.scale.setScalar(lerp(protG.scale.x, sc, k6));
        if (protG.scale.x > 0.01) {
          const from = s === 3 ? SEC : s === 4 ? TERT : LINE, to = s === 2 ? SEC : (s === 3 || s === 4) ? TERT : LINE;
          const kk = Math.min(1, dt * (den ? 2.5 : 4));
          beads.forEach((b, i) => { tv.copy(den && s >= 2 ? COIL[i] : from[i]).lerp(den && s >= 2 ? COIL[i] : to[i], den ? 1 : e); b.position.lerp(tv, kk); });
          bbSt.forEach((st, i) => api.setStick(st, beads[i].position, beads[i + 1].position));
          const showHB = !den && ((s === 2 && e > 0.85) || s === 3 || s === 4);
          hbSt.forEach((st, j) => { st.visible = showHB && (s !== 2 || true); if (st.visible) api.setStick(st, beads[HBP[j][0]].position, beads[HBP[j][1]].position); });
          const cartOp = (!den && ((s === 2 && e > 0.6) || s === 3 || s === 4)) ? 0.42 : 0;
          cartMats.forEach(m => { m.opacity += (cartOp - m.opacity) * k6; m.depthWrite = false; });
          helixCart.position.lerp(s >= 3 ? HC_TER : HC_SEC, k6); sheetCart.position.lerp(s >= 3 ? SC_TER : SC_SEC, k6);
          sheetCart.rotation.y += ((s >= 3 ? Math.PI : 0) - sheetCart.rotation.y) * k6;
          ssSt.visible = !den && (s === 3 || s === 4) && e > 0.6; if (ssSt.visible) api.setStick(ssSt, beads[CYS1].position, beads[CYS2].position);
          if (s === 3) protG.rotation.y = Math.sin(t * 0.35) * 0.5; else protG.rotation.y *= 1 - k6;
        }
        // ---- quaternary ----
        if (s === 4) {
          const spread = den ? 2.4 : 1 + 2.2 * (1 - e);
          for (let q = 1; q < 4; q++) { subs[q].position.lerp(tv.copy(QP[q]).multiplyScalar(spread), k6); subs[q].rotation.z = QR[q][2] + (den ? Math.sin(t + q) * 0.6 : 0); }
          if (den) protG.position.copy(QP[0]).multiplyScalar(spread);
          quatG.rotation.y = Math.sin(t * 0.3) * 0.3;
        }
        // ---- membrane ----
        if (s === 5) {
          const kt = cis ? 1 : 0; const nk = memKink < 0 ? kt : memKink + (kt - memKink) * Math.min(1, dt * 3);
          if (Math.abs(nk - memKink) > 1e-4) { memKink = nk; layoutMem(nk); }
          water.forEach((w, i) => { w.position.copy(w.userData.b); w.position.x += Math.sin(t * 1.3 + i) * 0.15; w.position.y += Math.cos(t * 1.1 + i * 2) * 0.1; });
          memG.rotation.y = Math.sin(t * 0.3) * 0.35;
        }
        // ---- raft ----
        if (s === 6) {
          raftAmt += ((cholDep ? 0 : 1) - raftAmt) * Math.min(1, dt * 2);
          if (Math.abs(raftAmt - raftApplied) > 1e-3) { raftApplied = raftAmt; applyRaft(raftAmt); }
          recs.forEach((g, i) => { g.position.lerp(tv.copy(RS[i]).lerp(RT[i], e * raftAmt), k6); g.rotation.y += dt * 0.3; });
          raftG.rotation.y = Math.sin(t * 0.2) * 0.25;
        }
        // ---- carbs ----
        if (s === 7) {
          const a = ease(clamp(e / 0.3)), b = ease(clamp((e - 0.25) / 0.35)), c = ease(clamp((e - 0.5) / 0.5));
          glc.scale.setScalar(Math.max(0.001, a)); fru.scale.setScalar(Math.max(0.001, a));
          sG.position.lerpVectors(glc.position, tv.set(1.35, 2.1, 0), b); sF.position.lerpVectors(fru.position, tv.set(2.75, 2.1, 0), b);
          sG.scale.setScalar(Math.max(0.001, a)); sF.scale.setScalar(Math.max(0.001, a));
          oBr.position.set(2.05, 2.1, 0); oBr.scale.setScalar(Math.max(0.001, b > 0.9 ? 1 : 0));
          sb1.visible = sb2.visible = b > 0.9; if (sb1.visible) { api.setStick(sb1, sG.position, oBr.position); api.setStick(sb2, oBr.position, sF.position); }
          poly.forEach((m, i) => { m.position.lerpVectors(POLYS[i], POLYP[i], c); m.rotation.y = (1 - c) * (i + t); m.scale.setScalar(0.85 * Math.max(0.001, clamp(c * 3))); });
          plSt.forEach((st, j) => { st.visible = c > 0.95; if (st.visible) api.setStick(st, poly[PLINK[j][0]].position, poly[PLINK[j][1]].position); });
          lb.show('k_suc', b > 0.9); lb.show('k_gly', b > 0.9); lb.show('k_poly', c > 0.9); lb.show('k_br', c > 0.9);
          carbG.rotation.y = Math.sin(t * 0.3) * 0.25;
        }
        // ---- ABO ----
        if (s === 8) {
          termA.scale.setScalar(bloodType === 'A' ? 1 : 0.001); termB.scale.setScalar(bloodType === 'B' ? 1 : 0.001); termSt.visible = bloodType !== 'O';
          const bind = bloodType === 'B';
          abG.position.lerp(bind ? tv.set(1.3 + 0.0, 2.25 + 0.6 * (1 - e), 0) : tv.set(3.3 + Math.sin(t) * 0.3, 2.6 + Math.cos(t * 0.8) * 0.3, 0), Math.min(1, dt * 3));
          abG.rotation.z += ((bind ? Math.PI : 0.4 + Math.sin(t * 0.7) * 0.3) - abG.rotation.z) * Math.min(1, dt * 3);
          glyG.rotation.y = Math.sin(t * 0.3) * 0.25;
        }
        // ---- gel ----
        if (s === 9) {
          borV += ((bor ? 1 : 0) - borV) * Math.min(1, dt * 3);
          pBands.forEach((b, i) => b.position.set(-1.3, 2.15 - DIST[i] * e, 0.05));
          const sy = 2.15 - 2.6 * e * borV; sBand.position.set(1.3, sy, 0.05);
          borDots.forEach((d, i) => { d.visible = borV > 0.4; d.position.set(1.3 + (i - 2.5) * 0.18, sy + (i % 2 ? 0.12 : -0.12), 0.25); });
          lb.set('e_sug', borV > 0.5 ? 'phức borate (−) → chạy về (+)' : 'trung tính → đứng yên');
          lb.get('e_sug').position.set(1.3, sy - 0.4, 0.3);
        }
      },
    };
    beads.forEach(b => b.position.copy(LINE[0]));
    return ctl;
  },
};
