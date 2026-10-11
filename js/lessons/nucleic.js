// Bài 2: Cấu trúc DNA & RNA
import { progress, labels, strand, ease, lerp } from './_kit.js';

export default {
  title: 'Cấu trúc DNA & RNA',
  sub: 'Từ 1 nucleotide → mạch đơn → chuỗi xoắn kép → nucleosome. Và vì sao RNA "mỏng manh" hơn DNA.',
  legend: '<span><i style="background:#f5a623"></i>phosphate</span><span><i style="background:#c9d1d9"></i>đường</span><span><i style="background:#e8505b"></i>A</span><span><i style="background:#f2c94c"></i>T</span><span><i style="background:#3fb27f"></i>G</span><span><i style="background:#4a90e2"></i>C</span><span><i style="background:#f2994a"></i>U</span><span><i style="background:#ff3b30"></i>nhóm –OH</span>',

  why: `<p><b>DNA</b> là "ổ cứng" lưu thông tin di truyền lâu dài. <b>RNA</b> là "bản sao tạm" dùng để làm việc: mang mã, chở amino acid, xúc tác, điều hòa.</p>
  <p>Cấu trúc quyết định chức năng:</p>
  <ul><li><b>Khung đường–phosphate</b> nối bằng liên kết <b>phosphodiester</b> (cộng hóa trị, rất bền), nên mỗi mạch <b>khó đứt</b>. Đó là tính ổn định.</li>
  <li>Hai mạch giữ nhau bằng <b>liên kết hydrogen</b> (yếu), nên <b>dễ tách</b> khi cần sao chép hoặc phiên mã. Đó là tính linh động.</li>
  <li><b>Bắt cặp bổ sung</b> A=T, G≡C: mạch này là "khuôn" để chép ra mạch kia.</li></ul>`,

  without: `<ul>
  <li><b>Không có bắt cặp bổ sung</b>: không thể sao chép chính xác, thông tin di truyền mất sau mỗi lần phân bào.</li>
  <li><b>Khung không có liên kết cộng hóa trị bền</b>: DNA tự đứt vụn, mất thông tin.</li>
  <li><b>Hai mạch nối bằng liên kết quá mạnh</b> (thay vì H): không tách ra được để sao chép hay phiên mã.</li>
  <li><b>DNA dùng U thay T</b>: khi C bị khử amin thành U, tế bào không phân biệt được "U lỗi" với "U thật", nên không sửa được đột biến (xem BER, bài 8).</li>
  <li><b>Không đóng gói thành chromatin</b>: khoảng 2 m DNA không thể nhét vừa nhân tế bào đường kính ~6 µm.</li></ul>`,

  foundation: [
    { q: 'Nucleotide gồm mấy phần?', a: '3 phần: <b>nhóm phosphate</b> (gắn vào carbon 5′ của đường), <b>đường pentose</b> 5 carbon (deoxyribose trong DNA, ribose trong RNA) và <b>base nitơ</b> (gắn vào carbon 1′). Các carbon của đường đánh số có dấu phẩy (1′, 2′…) để phân biệt với số của base.' },
    { q: 'Deoxyribose khác ribose ở đâu?', a: 'Ở <b>carbon 2′</b>. Ribose có <b>–OH</b>, deoxyribose ("deoxy" là thiếu oxy) chỉ có <b>–H</b>. Chỉ một nguyên tử khác biệt này làm RNA kém bền hơn nhiều.' },
    { q: 'Purine và pyrimidine là gì?', a: '<b>Purine</b> có 2 vòng (lớn): <b>A, G</b>. <b>Pyrimidine</b> có 1 vòng (nhỏ): <b>C, T</b> (DNA) và <b>U</b> (RNA). Mẹo nhớ: "<b>Pu</b>re <b>A</b>s <b>G</b>old" là purine A, G. Mỗi cặp luôn gồm 1 purine + 1 pyrimidine, nên chuỗi xoắn có đường kính đều khoảng 20 Å.' },
    { q: 'Liên kết phosphodiester nối cái gì với cái gì?', a: 'Nối <b>3′-OH</b> của đường nucleotide trước với <b>phosphate 5′</b> của nucleotide sau. Lặp lại nhiều lần thì thành khung đường–phosphate. Vì vậy mạch có 2 đầu khác nhau: <b>đầu 5′</b> (phosphate tự do) và <b>đầu 3′</b> (OH tự do). Trình tự luôn viết theo chiều 5′→3′.' },
    { q: 'Ngược chiều (antiparallel) nghĩa là sao?', a: 'Hai mạch chạy ngược nhau: một mạch 5′→3′ từ trái sang phải, mạch kia 5′→3′ từ phải sang trái. Ví dụ: 5′-ATG-3′ bắt cặp với 3′-TAC-5′, khi viết theo chiều 5′→3′ là 5′-CAT-3′.' },
    { q: 'Vì sao A=T có 2 liên kết H còn G≡C có 3?', a: 'Do vị trí các nhóm cho và nhận hydrogen trên base. Hệ quả: DNA nhiều GC thì <b>bền nhiệt hơn</b> (Tm cao hơn, xem bài 4). Quy luật Chargaff: trong DNA mạch kép, %A = %T và %G = %C.' },
    { q: 'Các thông số của B-DNA cần nhớ?', a: 'Xoắn phải. <b>1 vòng = 34 Å ≈ 10 cặp base</b> (số đo chính xác trong dung dịch là ~10,5 bp/vòng), nên mỗi cặp cách nhau 3,4 Å. <b>Đường kính khoảng 20 Å</b>. Phosphate ở ngoài, base ở trong. Có <b>rãnh lớn</b> (major groove) và <b>rãnh nhỏ</b> (minor groove): protein như yếu tố phiên mã hay repressor "đọc" trình tự qua rãnh lớn mà không cần mở xoắn. Dữ liệu từ nhiễu xạ tia X (X-ray diffraction) của Rosalind Franklin, mô hình của Watson và Crick (1953).' },
    { q: 'A-DNA, B-DNA, Z-DNA khác nhau thế nào?', a: '<b>B-DNA</b>: dạng phổ biến trong tế bào, xoắn <b>phải</b>, ~10,5 bp/vòng, đường kính ~20 Å, rãnh lớn sâu và rộng. <b>A-DNA</b>: cũng xoắn <b>phải</b> nhưng ngắn và béo hơn (~11 bp/vòng, đường kính ~23 Å), base nghiêng; gặp khi DNA bị <b>mất nước</b>, và là dạng của <b>RNA mạch kép</b> và lai <b>DNA–RNA</b>. <b>Z-DNA</b>: xoắn <b>trái</b>, mảnh (~12 bp/vòng, ~18 Å), khung đường-phosphate gấp khúc <b>zigzag</b>; hình thành ở đoạn purine–pyrimidine xen kẽ (như CGCGCG), nồng độ muối cao hoặc siêu xoắn âm.' },
    { q: 'RNA khác DNA những gì?', a: 'RNA là <b>sợi đơn</b>, đường <b>ribose</b> (có 2′-OH), base <b>U thay T</b>, ngắn hơn, có ở cả nhân và tế bào chất, <b>kém bền</b>. Vì là sợi đơn nên RNA <b>tự gập</b> lại thành cấu trúc bậc 2: <b>kẹp tóc</b> (hairpin) hay stem-loop. Gập tiếp thì thành bậc 3: <b>pseudoknot</b>, hình chữ L của tRNA. Có cấu trúc 3D nên RNA có thể làm enzyme (ribozyme).' },
    { q: 'Kể các loại RNA và vai trò?', a: '<b>mRNA</b> mang mã. <b>tRNA</b> chở amino acid. <b>rRNA</b> tạo khung ribosome và xúc tác liên kết peptide. <b>snRNA</b> nằm trong spliceosome, cắt intron. <b>miRNA</b> và <b>siRNA</b> làm im lặng gene. <b>hnRNA</b> là pre-mRNA chưa xử lý xong trong nhân.' },
  ],

  steps: [
    { title: 'Cận cảnh 1 nucleotide', text: 'Có 3 phần. Quả cầu cam là <b>phosphate</b> gắn ở <b>C5′</b>. Vòng 5 cạnh là <b>đường deoxyribose</b>, với các carbon 1′ đến 5′. Khối màu là <b>base</b> gắn ở <b>C1′</b>. Để ý <b>3′-OH</b> (đỏ): đây là "cái móc" để nucleotide tiếp theo nối vào. Bật công tắc <b>Dạng RNA</b> để thấy 2′-H biến thành <b>2′-OH</b>.' },
    { title: 'Purine (2 vòng) và pyrimidine (1 vòng)', text: '<b>A, G</b> là purine (2 vòng). <b>T, C, U</b> là pyrimidine (1 vòng). Mỗi cặp luôn gồm 1 lớn + 1 nhỏ, nên "bậc thang" rộng đều. Đếm que trắng: <b>A=T có 2 liên kết H</b>, <b>G≡C có 3</b>.' },
    { title: 'Nối thành mạch: liên kết phosphodiester', text: 'Từng nucleotide nối vào <b>đầu 3′-OH</b> của mạch đang có. Khung đường–phosphate (xanh) nối bằng liên kết <b>cộng hóa trị</b>. Mạch có hướng: <b>đầu 5′</b> bên trái, <b>đầu 3′</b> bên phải.' },
    { title: 'Mạch thứ hai ghép vào: bổ sung và ngược chiều', text: 'Mạch hồng tiến lại và bắt cặp bổ sung, chạy <b>ngược chiều</b> (5′ ở bên phải). Hai mạch chỉ giữ nhau bằng <b>liên kết H</b> (que trắng), yếu nên dễ tách. Đây là bậc thang DNA.' },
    { title: 'Xoắn lại thành B-DNA', text: 'Bậc thang xoắn phải: <b>10 bp/vòng, 34 Å/vòng, đường kính 20 Å</b>. Base xếp chồng bên trong, phosphate ở ngoài. Xoay mô hình để thấy <b>rãnh lớn</b> và <b>rãnh nhỏ</b> xen kẽ. Protein đọc trình tự qua rãnh lớn.' },
    { title: 'Đóng gói: nucleosome, "hạt trên chuỗi"', text: 'Ở nhân thực, khoảng <b>147 bp</b> DNA quấn <b>~1,65 vòng</b> quanh <b>8 histone</b> (2× H2A, H2B, H3, H4) thành <b>nucleosome</b>. Giữa các hạt là DNA nối (linker), có H1. Tiếp theo là sợi 30 nm → vòng → nhiễm sắc thể.' },
    { title: 'RNA: sợi đơn, U thay T, tự gập thành kẹp tóc', text: 'RNA chỉ có 1 mạch. Mỗi nucleotide có thêm <b>2′-OH</b> (chấm đỏ) và có <b>U</b> (cam) thay T. Đoạn đầu và đoạn cuối bổ sung nhau nên tự bắt cặp thành <b>thân</b> (stem), đoạn giữa không bắt cặp thành <b>vòng</b> (loop). Đó là <b>kẹp tóc</b> (hairpin).' },
    { title: 'Vì sao DNA bền hơn RNA?', text: 'Bật <b>💥 Môi trường kiềm</b>. Ở RNA, nhóm <b>2′-OH</b> tấn công liên kết phosphodiester ngay bên cạnh, nên RNA <b>tự cắt</b> thành mảnh. DNA không có 2′-OH, lại là sợi kép giấu base bên trong, nên vẫn nguyên.' },
  ],

  application: `<ul>
  <li><b>Xét nghiệm PCR, giải trình tự, xét nghiệm ADN huyết thống</b>: đều dựa vào bắt cặp bổ sung A=T, G≡C (mồi bám đúng chỗ, mạch mới chép theo khuôn).</li>
  <li><b>Bảo quản mẫu</b>: DNA tách được từ xương hóa thạch hàng chục nghìn năm, còn RNA phải giữ ở −80 °C và dùng chất ức chế RNase. Lý do chính là nhóm 2′-OH.</li>
  <li><b>Vaccine mRNA</b>: phải dùng hạt nano lipid và bảo quản lạnh vì RNA kém bền. Các nhà khoa học còn thay U bằng <b>pseudouridine</b> để mRNA bền hơn và ít kích thích miễn dịch (giải Nobel 2023).</li>
  <li><b>Thuốc gắn rãnh nhỏ / chen giữa base</b>: một số thuốc chống ung thư như doxorubicin chen vào giữa các base, cản sao chép.</li>
  <li><b>Phân tích DNA bằng nhiễu xạ tia X</b>: chính kỹ thuật này cho ra ảnh "Photo 51" giúp tìm ra chuỗi xoắn kép.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>DNA</th><th>RNA</th></tr>
  <tr><td>Đường</td><td>Deoxyribose (2′-H)</td><td>Ribose (2′-OH)</td></tr>
  <tr><td>Base</td><td>A, T, G, C</td><td>A, U, G, C</td></tr>
  <tr><td>Số mạch</td><td>Kép, xoắn</td><td>Đơn, tự gập (hairpin, pseudoknot)</td></tr>
  <tr><td>Độ dài</td><td>Rất dài</td><td>Ngắn</td></tr>
  <tr><td>Vị trí</td><td>Nhân, ty thể (lục lạp)</td><td>Nhân và tế bào chất</td></tr>
  <tr><td>Độ bền</td><td>Bền</td><td>Kém bền (2′-OH, RNase)</td></tr>
  <tr><td>Vai trò</td><td>Lưu trữ thông tin</td><td>Truyền tin, chở aa, xúc tác, điều hòa</td></tr></table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Cặp dễ lẫn</th><th>Cái 1</th><th>Cái 2</th></tr>
  <tr><td>Phosphodiester vs liên kết H</td><td>Cộng hóa trị, <b>trong 1 mạch</b> (khung), rất bền</td><td>Yếu, <b>giữa 2 mạch</b> (base–base), dễ tách</td></tr>
  <tr><td>Purine vs pyrimidine</td><td>A, G: 2 vòng</td><td>C, T, U: 1 vòng</td></tr>
  <tr><td>Nucleoside vs nucleotide</td><td>Nucleoside = đường + base</td><td>Nucleotide = nucleoside + phosphate</td></tr>
  <tr><td>Hairpin vs pseudoknot</td><td>Bậc 2: 1 đoạn tự bắt cặp thành thân + vòng</td><td>Bậc 3: vòng của hairpin bắt cặp với đoạn khác, tạo nút</td></tr>
  <tr><td>Đầu 5′ vs đầu 3′</td><td>Phosphate tự do</td><td>–OH tự do; nucleotide mới luôn nối vào đây</td></tr></table></div>`,

  traps: [
    { trap: '"A và T, G và C nối với nhau bằng liên kết phosphodiester".', truth: 'Base–base giữa 2 mạch nối bằng <b>liên kết hydrogen</b>. Phosphodiester nối các nucleotide <b>trong cùng một mạch</b> (3′-OH với 5′-phosphate).' },
    { trap: '"G≡C có 2 liên kết H, A=T có 3".', truth: 'Ngược lại: <b>A=T có 2, G≡C có 3</b>. Vì vậy DNA giàu GC có Tm cao hơn.' },
    { trap: '"A, T là purine".', truth: 'Purine là <b>A, G</b> (2 vòng). T, C, U là pyrimidine.' },
    { trap: '"Hai mạch DNA song song cùng chiều".', truth: 'Hai mạch <b>ngược chiều</b> (antiparallel): 5′→3′ ghép với 3′→5′.' },
    { trap: '"RNA kém bền chỉ vì là sợi đơn".', truth: 'Lý do hóa học chính là <b>2′-OH</b> của ribose tấn công liên kết phosphodiester kế bên (nhất là trong môi trường kiềm). Sợi đơn chỉ là yếu tố phụ.' },
    { trap: '"Slide ghi X-ray Diffision".', truth: 'Đúng là <b>X-ray Diffraction</b> (nhiễu xạ tia X). "Diffision" là lỗi chính tả trên slide.' },
    { trap: '"Nucleotide mới có thể gắn vào đầu 5′".', truth: 'Polymerase chỉ gắn vào <b>đầu 3′-OH</b>, nên chuỗi luôn kéo dài theo chiều <b>5′→3′</b>.' },
    { trap: '"Thymine có trong RNA, uracil có trong DNA".', truth: 'Ngược lại: <b>T ở DNA, U ở RNA</b>. DNA có U là dấu hiệu tổn thương (C bị khử amin), sẽ bị BER sửa.' },
  ],

  quiz: [
    { q: 'Liên kết nào giữ 2 mạch của chuỗi xoắn kép DNA với nhau?', ops: ['Phosphodiester', 'Hydrogen giữa các base bổ sung', 'Peptide', 'Disulfide'], a: 1, e: 'Hai mạch nối với nhau bằng liên kết H (yếu, dễ tách). Phosphodiester nằm trong mỗi mạch, không nối 2 mạch.' },
    { q: 'Một mạch DNA có trình tự 5′-AGCT-3′. Mạch bổ sung (viết 5′→3′) là:', ops: ['5′-TCGA-3′', '5′-AGCT-3′', '5′-UCGA-3′', '3′-AGCT-5′'], a: 1, e: 'Mạch bổ sung là 3′-TCGA-5′, viết lại theo chiều 5′→3′ thành 5′-AGCT-3′ (trình tự palindrome). Chọn 5′-TCGA-3′ là quên đảo chiều; đáp án có U là của RNA.' },
    { q: 'DNA có 30% A. Phần trăm G là bao nhiêu?', ops: ['30%', '20%', '40%', '70%'], a: 1, e: 'Chargaff: A = T = 30% nên A+T = 60%, G+C = 40%, G = C = 20%.' },
    { q: 'Điểm khác biệt hóa học khiến RNA dễ bị thủy phân hơn DNA là:', ops: ['RNA có U thay T', 'Ribose có nhóm 2′-OH', 'RNA ngắn hơn', 'RNA nằm ở tế bào chất'], a: 1, e: '2′-OH tấn công liên kết phosphodiester kế bên, làm RNA tự cắt. U/T không ảnh hưởng độ bền khung.' },
    { q: 'Một vòng xoắn B-DNA dài khoảng bao nhiêu và chứa bao nhiêu cặp base?', ops: ['3,4 Å; 1 bp', '34 Å; ~10 bp', '20 Å; ~10 bp', '34 Å; ~20 bp'], a: 1, e: '34 Å/vòng, khoảng 10 bp, nên 3,4 Å giữa 2 bp. 20 Å là đường kính.' },
    { q: 'Cấu trúc nào là bậc 2 của RNA?', ops: ['Pseudoknot', 'Kẹp tóc (hairpin / stem-loop)', 'Chuỗi xoắn kép B', 'Nucleosome'], a: 1, e: 'Hairpin/stem-loop là bậc 2. Pseudoknot là bậc 3 (vòng bắt cặp với đoạn khác).' },
  ],

  recall: [
    'Vẽ 1 nucleotide: đánh số 1′ đến 5′, chỉ chỗ gắn phosphate, base, 3′-OH, và chỗ khác nhau giữa DNA/RNA.',
    'Vẽ đoạn DNA mạch kép 4 bp, ghi 5′/3′ ở 4 đầu mạch, đánh dấu liên kết phosphodiester và liên kết H (2 hay 3).',
    'Liệt kê 6 điểm khác nhau giữa DNA và RNA, và giải thích vì sao DNA bền hơn.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

    // ============ 1) Nucleotide close-up ============
    const nucG = api.group(); nucG.scale.setScalar(1.4);
    const ang = { O4: 90, C1: 18, C2: -54, C3: -126, C4: 162 };
    const P5 = {}; for (const [k, d] of Object.entries(ang)) { const r = d * Math.PI / 180; P5[k] = V(0.75 * Math.cos(r), 0.75 * Math.sin(r)); }
    const ringOrder = ['O4', 'C1', 'C2', 'C3', 'C4'];
    ringOrder.forEach((k, i) => { api.sphere(k === 'O4' ? 0.15 : 0.13, k === 'O4' ? 0xff3b30 : 0x9aa5b1, nucG).position.copy(P5[k]); api.stick(P5[k], P5[ringOrder[(i + 1) % 5]], 0.06, C.sugar, nucG); });
    const pent = api.cylinder(0.72, 0.72, 0.06, C.sugar, nucG, { opacity: 0.45 }); pent.geometry = new THREE.CylinderGeometry(0.72, 0.72, 0.06, 5); pent.rotation.x = Math.PI / 2; pent.rotation.y = Math.PI / 2;
    const C5 = V(-1.25, 0.75), Pp = V(-1.9, 1.5);
    api.stick(P5.C4, C5, 0.06, C.sugar, nucG); api.sphere(0.13, 0x9aa5b1, nucG).position.copy(C5); api.stick(C5, Pp, 0.06, 0xdddddd, nucG);
    const phos = api.sphere(0.38, C.phosphate, nucG); phos.position.copy(Pp);
    for (const o of [[-0.45, 0.25], [0.1, 0.5], [-0.25, -0.35]]) { const s = api.sphere(0.13, 0xff3b30, nucG); s.position.set(Pp.x + o[0], Pp.y + o[1], 0.15); }
    const OH3 = api.sphere(0.16, 0xff3b30, nucG); OH3.position.set(-0.8, -1.3, 0); api.stick(P5.C3, OH3.position, 0.05, 0xdddddd, nucG);
    const X2 = api.sphere(0.12, 0xffffff, nucG); X2.position.set(0.75, -1.3, 0); api.stick(P5.C2, X2.position, 0.05, 0xdddddd, nucG);
    // base (purine A): hexagon + pentagon
    const baseHex = (r, col, parent) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.14, 6), api.mat(col)); m.rotation.x = Math.PI / 2; (parent).add(m); return m; };
    const basePent = (r, col, parent) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.14, 5), api.mat(col)); m.rotation.x = Math.PI / 2; (parent).add(m); return m; };
    const bG = api.group(nucG); bG.position.set(2.0, 0.45, 0);
    const bPent = basePent(0.42, C.A, bG); bPent.position.set(-0.45, 0, 0); const bHex = baseHex(0.5, C.A, bG); bHex.position.set(0.38, 0.05, 0);
    api.stick(P5.C1, V(1.3, 0.4), 0.06, 0xdddddd, nucG);
    lb.add('n_p', 'Phosphate (gắn C5′)', [Pp.x * 1.4, Pp.y * 1.4 + 0.75, 0]);
    lb.add('n_s', 'Đường pentose (deoxyribose)', [0, 0.25, 0]);
    lb.add('n_b', 'Base nitơ (gắn C1′)', [2.8, 1.45, 0]);
    lb.add('n_3', '3′-OH: chỗ nối nucleotide sau', [-1.9, -2.3, 0], null, 'good');
    lb.add('n_2', '2′-H (DNA)', [1.7, -2.95, 0], null, 'dim');
    const cnum = [['1′', P5.C1, [0.25, 0.2]], ['2′', P5.C2, [0.25, -0.1]], ['3′', P5.C3, [-0.3, -0.1]], ['4′', P5.C4, [-0.2, 0.25]], ['5′', C5, [0, 0.3]]];
    cnum.forEach(([t, p, o], i) => lb.add('c' + i, t, [(p.x + o[0]) * 1.4, (p.y + o[1]) * 1.4, 0.2], null, 'plain'));

    // ============ 2) Bases: purine vs pyrimidine, H-bonds ============
    const basesG = api.group(); basesG.position.set(0, 0, 0);
    const pair = (pu, py, y, nH) => {
      const g = api.group(basesG); g.position.y = y;
      const pe = basePent(0.42, C[pu], g); pe.position.x = -2.35; const hx = baseHex(0.5, C[pu], g); hx.position.x = -1.5;
      const hy = baseHex(0.5, C[py], g); hy.position.x = 0.9;
      const ys = nH === 2 ? [-0.18, 0.18] : [-0.3, 0, 0.3];
      ys.forEach(yy => api.stick(V(-1.02, yy), V(0.42, yy), 0.035, 0xffffff, g, { opacity: 0.9 }));
      api.stick(V(-2.75, 0), V(-3.4, 0), 0.07, C.sugar, g); api.stick(V(1.38, 0), V(2.0, 0), 0.07, C.sugar, g);
      return g;
    };
    pair('A', 'T', 1.3, 2); pair('G', 'C', -1.3, 3);
    const uG = api.group(basesG); uG.position.set(4.2, -1.3, 0); baseHex(0.5, C.U, uG);
    lb.add('b_at', '<b>A = T</b>: 2 liên kết H', [-0.3, 2.35, 0]);
    lb.add('b_gc', '<b>G ≡ C</b>: 3 liên kết H', [-0.3, -2.4, 0]);
    lb.add('b_pu', 'Purine (2 vòng): A, G', [-2.0, 3.2, 0], null, 'big');
    lb.add('b_py', 'Pyrimidine (1 vòng): T, C, U', [1.5, 3.2, 0], null, 'big');
    lb.add('b_u', 'U (chỉ có ở RNA)', [4.2, -2.3, 0], null, 'dim');
    lb.add('b_w', 'lớn + nhỏ → rộng đều ~20 Å', [-0.3, 0, 0], null, 'dim');

    // ============ 3) DNA ladder → helix ============
    const dnaG = api.group();
    const dopts = { seq: 'ATGCGATTACGC', rise: 0.75, radius: 1.5, turn: 10, openR: 2.2, offset: Math.PI, parent: dnaG, twist: 0 };
    const dna = api.dna(dopts);
    const N = dna.pairs.length;
    lb.add('d5a', "5′", [0, 0, 0], dnaG, 'big'); lb.add('d3a', "3′", [0, 0, 0], dnaG, 'big');
    lb.add('d3b', "3′", [0, 0, 0], dnaG, 'big'); lb.add('d5b', "5′", [0, 0, 0], dnaG, 'big');
    lb.add('d_pd', 'liên kết phosphodiester (3′-OH → 5′-P)', [dna.xOf(3.5), 2.6, 0], dnaG, 'good');
    lb.add('d_hb', 'liên kết H (yếu, dễ tách)', [dna.xOf(6), 0.15, 0.6], dnaG, 'dim');
    lb.add('d_turn', '1 vòng ≈ 10 bp = 34 Å', [0, 3.0, 0], dnaG);
    lb.add('d_dia', 'đường kính ~20 Å', [dna.xOf(8), -2.9, 0], dnaG, 'dim');
    lb.add('d_maj', 'rãnh lớn', [0, 0, 0], dnaG, 'good'); lb.add('d_min', 'rãnh nhỏ', [0, 0, 0], dnaG, 'warn');
    lb.add('d_stab', 'DNA: vẫn nguyên ✓', [0, 2.8, 0], dnaG, 'good');

    // ============ 4) Nucleosomes ============
    const nucleoG = api.group();
    const centers = [[-5.4, -0.4], [-1.8, 0.5], [1.8, -0.4], [5.4, 0.5]];
    const pts = [V(-8.4, -1.4, 0.5)];
    centers.forEach(([cx, cy]) => {
      const disc = api.cylinder(0.95, 0.95, 1.1, C.histone, nucleoG); disc.rotation.x = Math.PI / 2; disc.position.set(cx, cy, 0);
      const mid = api.torus(0.95, 0.04, 0x7d5aa8, nucleoG); mid.position.set(cx, cy, 0);
      const turns = 1.65, n = 40;
      for (let k = 0; k <= n; k++) { const a = Math.PI * 1.15 - (k / n) * turns * Math.PI * 2; pts.push(V(cx + 1.18 * Math.cos(a), cy + 1.18 * Math.sin(a), -0.45 + 0.9 * k / n)); }
    });
    pts.push(V(8.4, 1.6, 0.5));
    const dnaTube = api.tube(pts, 0.13, C.dna1, nucleoG);
    const tubeCount = dnaTube.geometry.index.count;
    const h1 = api.sphere(0.32, 0xd36ba6, nucleoG); h1.position.set(-1.8, -0.9, 0.7);
    lb.add('h_oct', 'Nucleosome: 8 histone<br>(2× H2A, H2B, H3, H4)', [-1.8, 2.2, 0], null, 'big');
    lb.add('h_bp', '~147 bp quấn ~1,65 vòng', [-4.3, -1.9, 0]);
    lb.add('h_link', 'DNA nối (linker)', [3.6, 1.4, 0], null, 'dim');
    lb.add('h_h1', 'H1', [-0.95, -1.35, 0.7], null, 'dim');
    lb.add('h_next', '"hạt trên chuỗi" → sợi 30 nm → vòng → NST', [0, -2.9, 0], null, 'good');

    // ============ 5) RNA hairpin ============
    const rnaG = api.group();
    const RSEQ = 'GCAUCGUUCGCGAUGC';
    const rs = strand(api, { seq: RSEQ, rna: true, dx: 0.6, parent: rnaG });
    rs.bb.visible = false;
    const M = RSEQ.length;
    const bbSticks = []; for (let i = 0; i < M - 1; i++) bbSticks.push(api.stick(V(0, 0), V(1, 0), 0.07, C.rna, rnaG));
    const hbS = []; for (let k = 0; k < 6; k++) hbS.push(api.stick(V(0, 0), V(0, 1), 0.035, 0xffffff, rnaG, { opacity: 0.9 }));
    const straightPos = (i) => [-4.5 + i * 0.6, 0, 0];
    const hairPos = (i) => {
      if (i < 6) return [-1.8 + i * 0.6, 0.85, Math.PI];
      if (i >= 10) return [-1.8 + (15 - i) * 0.6, -0.85, 0];
      const a = [54, 18, -18, -54][i - 6] * Math.PI / 180; return [1.45 + 0.95 * Math.cos(a), 0.95 * Math.sin(a), a + Math.PI / 2];
    };
    const scat = RSEQ.split('').map((_, i) => [Math.sin(i * 12.9) * 2.2, Math.cos(i * 7.3) * 1.6 - 0.6, Math.sin(i * 3.1) * 1.5, Math.sin(i * 5.7) * 3]);
    lb.add('r_oh', '2′-OH (đỏ)', [-4.5, -1.2, 0], rnaG, 'warn');
    lb.add('r_u', 'U thay T', [-3.0, 1.6, 0], rnaG);
    lb.add('r_stem', 'thân (stem): tự bắt cặp', [-0.3, 2.0, 0], rnaG, 'good');
    lb.add('r_loop', 'vòng (loop)', [3.3, 0, 0], rnaG, 'dim');
    lb.add('r_hp', 'KẸP TÓC (hairpin), cấu trúc bậc 2', [-0.3, -2.2, 0], rnaG, 'big');
    lb.add('r_cut', '2′-OH tấn công khung → RNA tự cắt ✗', [0, -2.4, 0], rnaG, 'warn');
    lb.add('r_one', 'RNA: 1 mạch', [-5.5, 0.6, 0], rnaG, 'big');

    // ============ state ============
    let cur = 0, isRNA = false, alkali = false;
    const pr = progress(0.35);
    const groups = { nucG, basesG, dnaG, nucleoG, rnaG };
    const VIS = [['nucG'], ['basesG'], ['dnaG'], ['dnaG'], ['dnaG'], ['nucleoG'], ['rnaG'], ['dnaG', 'rnaG']];
    const CAM = [[[0.6, 0.4, 10], [0.6, 0, 0]], [[0, 0.3, 11], [0.2, 0, 0]], [[0, 1.2, 13], [0, 0.3, 0]], [[0, 0.5, 14], [0, 0, 0]], [[6, 4, 12], [0, 0, 0]],
      [[0, 0.5, 15], [0, 0, 0]], [[0, 0, 11], [-0.5, 0, 0]], [[0, 0.5, 15], [0, 0.4, 0]]];
    const LBL = [
      ['n_p', 'n_s', 'n_b', 'n_3', 'n_2', 'c0', 'c1', 'c2', 'c3', 'c4'],
      ['b_at', 'b_gc', 'b_pu', 'b_py', 'b_u', 'b_w'],
      ['d5a', 'd3a', 'd_pd'],
      ['d5a', 'd3a', 'd3b', 'd5b', 'd_hb'],
      ['d5a', 'd3a', 'd3b', 'd5b', 'd_turn', 'd_dia', 'd_maj', 'd_min'],
      ['h_oct', 'h_bp', 'h_link', 'h_h1', 'h_next'],
      ['r_oh', 'r_u', 'r_stem', 'r_loop', 'r_hp', 'r_one'],
      ['d_stab', 'r_oh', 'r_one'],
    ];
    const applyRNAform = () => {
      X2.material.color.set(isRNA ? 0xff3b30 : 0xffffff); X2.scale.setScalar(isRNA ? 1.3 : 1);
      lb.set('n_2', isRNA ? '2′-OH (RNA) ← khác biệt!' : '2′-H (DNA)');
      lb.set('n_s', isRNA ? 'Đường ribose (RNA)' : 'Đường pentose (deoxyribose)');
    };
    const readout = () => api.readout(cur === 7
      ? (alkali ? '❌ Kiềm: RNA bị cắt vụn (2′-OH tấn công liên kết phosphodiester kế bên). DNA không có 2′-OH, nên vẫn nguyên.' : 'Bật <b>💥 Môi trường kiềm</b> để so sánh độ bền DNA và RNA.')
      : 'Gợi ý: xoay mô hình bằng chuột hoặc ngón tay; bước 1 bật <b>Dạng RNA</b> để thấy 2′-OH.');
    api.toggle('Dạng RNA (2′-OH)', false, (v) => { isRNA = v; applyRNAform(); });
    api.toggle('💥 Môi trường kiềm (pH cao)', false, (v) => { alkali = v; ctl.setStep(cur); });

    const ctl = {
      setStep(s) {
        cur = s;
        for (const [k, g] of Object.entries(groups)) { const on = VIS[s].includes(k); g.visible = true; api.scaleTo(g, on ? (k === 'nucG' ? 1.4 : (k === 'dnaG' && s === 7 ? 0.7 : 1)) : 0.001, 6); }
        api.moveTo(dnaG, s === 7 ? [0, 2.6, 0] : [0, 0, 0]);
        api.moveTo(rnaG, s === 7 ? [0, -2.2, 0] : [0, 0, 0]);
        // progress per step: 2 = build strand, 3 = close, 4 = twist, 5 = wrap, 6 = fold
        pr.snap(0, (s >= 2 && s <= 6) ? 1 : 0);
        if (s === 7) pr.snap(1, 1);
        dna.strandOpacity(2, s >= 3 ? 1 : 0);
        api.camera(...CAM[s]);
        lb.only(LBL[s].concat(s === 7 && alkali ? ['r_cut'] : []));
        readout();
      },
      update(dt, t) {
        const p = pr.tick(dt), e = ease(p);
        const s = cur;
        // --- DNA ---
        const k = s === 2 ? e * N : N;
        dna.pairs.forEach((q, i) => { const tg = i < k ? 1 : 0.001; q.half1.scale.setScalar(q.half1.scale.x + (tg - q.half1.scale.x) * Math.min(1, dt * 8)); if (q.bb1) q.bb1.visible = i + 1 < k; });
        const tw = s === 4 ? e : s === 7 ? 1 : 0;
        if (Math.abs(dna.twist - tw) > 1e-4) { dopts.offset = lerp(Math.PI, Math.PI * 0.72, tw); dna.setTwist(tw); }
        dna.openRange(0, N, s === 3 ? 1 - e : s < 3 ? 1 : 0);
        if (s >= 2) {
          const a = dna.pairs[0], b = dna.pairs[N - 1];
          lb.get('d5a').position.set(a.half1.position.x - 0.7, a.half1.position.y, a.half1.position.z);
          lb.get('d3a').position.set(b.half1.position.x + 0.7, b.half1.position.y, b.half1.position.z);
          lb.get('d3b').position.set(a.half2.position.x - 0.7, a.half2.position.y, a.half2.position.z);
          lb.get('d5b').position.set(b.half2.position.x + 0.7, b.half2.position.y, b.half2.position.z);
          if (s === 4) {
            const q = dna.pairs[5], aa = Math.atan2(q.half1.position.z, q.half1.position.y), off = dopts.offset;
            const mn = aa + off / 2, mj = aa + off / 2 + Math.PI;
            lb.get('d_min').position.set(q.half1.position.x, Math.cos(mn) * 2.6, Math.sin(mn) * 2.6);
            lb.get('d_maj').position.set(dna.xOf(8), Math.cos(mj + 0.6) * 2.6, Math.sin(mj + 0.6) * 2.6);
          }
        }
        if (s === 4 || s === 7) dnaG.rotation.x += dt * 0.25; else dnaG.rotation.x *= Math.max(0, 1 - dt * 3);
        // --- nucleosome wrapping ---
        dnaTube.geometry.setDrawRange(0, Math.floor((s === 5 ? Math.max(0.02, e) : 1) * tubeCount / 3) * 3);
        if (s === 5) nucleoG.rotation.y = Math.sin(t * 0.3) * 0.35;
        // --- RNA fold / break ---
        const fold = s === 6 ? e : 0;
        rs.items.forEach((it, i) => {
          const a = straightPos(i), b = hairPos(i);
          let x = lerp(a[0], b[0], fold), y = lerp(a[1], b[1], fold), rz = lerp(0, b[2], fold), z = 0;
          if (s === 7 && alkali) { const sc = scat[i]; x += sc[0] * 0.6 + (i % 2 ? 0.3 : -0.3); y += sc[1] * 0.5; z = sc[2]; rz += sc[3] + t * 0.3 * (i % 2 ? 1 : -1); }
          it.n.position.x += (x - it.n.position.x) * Math.min(1, dt * 4);
          it.n.position.y += (y - it.n.position.y) * Math.min(1, dt * 4);
          it.n.position.z += (z - it.n.position.z) * Math.min(1, dt * 4);
          it.n.rotation.z = rz;
        });
        bbSticks.forEach((st, i) => { const broken = s === 7 && alkali; st.visible = !broken || i % 3 === 0; api.setStick(st, rs.items[i].n.position, rs.items[i + 1].n.position); });
        hbS.forEach((st, k2) => { st.visible = s === 6 && fold > 0.9; if (st.visible) { const A = rs.items[k2].n.position, B = rs.items[15 - k2].n.position; api.setStick(st, V(A.x, A.y - 0.5, 0), V(B.x, B.y + 0.5, 0)); } });
        if (s === 0) nucG.rotation.y = Math.sin(t * 0.5) * 0.4;
        if (s === 1) basesG.rotation.y = Math.sin(t * 0.5) * 0.35;
      },
    };
    applyRNAform();
    return ctl;
  },
};
