// Bài 4: Biến tính & hồi tính DNA (Tm)
import { progress, labels, ease, lerp, clamp } from './_kit.js';

const UV = 0xa06cff, NA = 0xb48cff, HOT = 0xe8505b, PRIMER = 0xff9f43, NEWS = 0x34c759;
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
const TM0 = 82, TM_LOW = 72; // Tm của DNA mẫu (muối cao) và khi ít muối

export default {
  title: 'Biến tính & hồi tính DNA (Tm)',
  sub: 'Đun nóng thì 2 mạch DNA tách ra (biến tính), hạ nhiệt từ từ thì chúng bắt cặp lại (hồi tính). Tm, %GC, muối và hiệu ứng tăng sắc ở 260 nm. Đây là nền tảng của PCR và lai phân tử.',
  legend: '<span><i style="background:#e8505b"></i>A</span><span><i style="background:#f2c94c"></i>T</span><span><i style="background:#3fb27f"></i>G</span><span><i style="background:#4a90e2"></i>C</span><span><i style="background:#ffffff"></i>liên kết H</span><span><i style="background:#a06cff"></i>tia UV 260 nm</span><span><i style="background:#b48cff"></i>ion Na⁺</span><span><i style="background:#ff9f43"></i>mồi PCR</span><span><i style="background:#34c759"></i>mạch mới</span>',

  why: `<p>DNA phải thỏa <b>2 yêu cầu trái ngược</b>:</p>
  <ul><li><b>Đủ bền</b>: ở 37 °C hai mạch không được tự rời nhau, để thông tin di truyền giữ nguyên suốt đời tế bào.</li>
  <li><b>Đủ dễ mở</b>: khi sao chép và phiên mã, tế bào phải tách 2 mạch để đọc base bên trong. Việc này do enzyme làm tại chỗ (helicase, RNA polymerase), <u>không</u> phải bằng nhiệt.</li></ul>
  <p>Hai mạch được giữ bằng <b>liên kết yếu</b> (liên kết H + lực xếp chồng base), không phải liên kết cộng hóa trị. Vì vậy:</p>
  <ul><li>trong phòng thí nghiệm, chỉ cần <b>đun nóng</b> là 2 mạch tách ra (<b>biến tính</b>);</li>
  <li><b>hạ nhiệt từ từ</b> thì 2 mạch bổ sung tự tìm nhau và bắt cặp lại (<b>hồi tính</b>).</li></ul>
  <p>Hiểu <b>Tm</b> (nhiệt độ 50% DNA đã tách mạch) là để: chọn nhiệt độ cho <b>PCR</b>, thiết kế <b>mồi</b> và <b>đầu dò</b>, đọc <b>đường cong nóng chảy</b> trong qPCR, và hiểu vì sao điểm khởi đầu sao chép và promoter lại <b>giàu A–T</b>.</p>`,

  without: `<ul>
  <li><b>Nếu 2 mạch nối bằng liên kết cộng hóa trị</b> (quá bền): helicase và RNA polymerase không mở được, nên không sao chép, không phiên mã được. Trong phòng thí nghiệm sẽ không có PCR.</li>
  <li><b>Nếu Tm quá thấp</b> (ví dụ dưới 37 °C): DNA tự rã thành mạch đơn ngay trong cơ thể, dễ bị nuclease cắt và đột biến. Vi khuẩn ưa nhiệt sống ở 80–100 °C nên phải giữ DNA bằng thêm protein bám DNA, <b>reverse gyrase</b> (tạo siêu xoắn dương) và nồng độ ion cao.</li>
  <li><b>Nếu không hồi tính được</b>: không có bước gắn mồi trong PCR, không có đầu dò (Southern, Northern, FISH, microarray). Trong tế bào, tái tổ hợp tương đồng cũng cần một mạch đơn "tìm và bắt cặp" với mạch bổ sung.</li>
  <li><b>Nếu làm lạnh quá nhanh</b> (cho ống vào đá ngay): các mạch không kịp tìm đúng bạn, nên DNA vẫn ở dạng <b>mạch đơn</b>. Người ta dùng chính mẹo này để giữ đầu dò ở dạng mạch đơn trước khi lai.</li></ul>`,

  foundation: [
    { q: 'Liên kết hydrogen giữa 2 base là gì? Vì sao gọi là "yếu"?', a: 'Đó là lực hút giữa một <b>H gắn vào N</b> (mang điện dương một phần) của base này với một <b>O hoặc N</b> (mang điện âm một phần) của base đối diện.<br>Mỗi liên kết H yếu hơn liên kết cộng hóa trị khoảng <b>20–40 lần</b>, nên nhiệt độ khoảng 80–100 °C đủ để phá. Nhưng hàng nghìn liên kết cộng lại thì đủ giữ DNA dài rất bền ở 37 °C.' },
    { q: 'Vì sao A=T có 2 liên kết H còn G≡C có 3?', a: 'Do vị trí các nhóm cho và nhận H trên vòng base.<br>• <b>A–T</b>: chỉ 2 cặp nhóm cho/nhận đối diện nhau → <b>2 liên kết H</b>.<br>• <b>G–C</b>: có thêm nhóm –NH₂ của G đối diện C=O của C → <b>3 liên kết H</b>.<br>Luôn là <b>purine (A, G: 2 vòng) + pyrimidine (T, C: 1 vòng)</b>, nên bề rộng mọi cặp đều bằng nhau (~2 nm).' },
    { q: 'Lực xếp chồng base (base stacking) là gì?', a: 'Các base là những tấm phẳng, xếp chồng lên nhau như chồng đĩa dọc trục xoắn. Giữa các tầng có <b>lực Van der Waals</b> và <b>tương tác kỵ nước</b> (base không thích nước nên chui vào trong).<br>Lực xếp chồng đóng góp <b>phần lớn năng lượng</b> giữ xoắn kép, còn liên kết H quyết định <b>tính đặc hiệu</b> (ai bắt cặp với ai). Tầng có G·C xếp chồng mạnh hơn tầng A·T.' },
    { q: 'Vì sao khung DNA mang điện âm, và điều đó ảnh hưởng gì?', a: 'Mỗi nhóm <b>phosphate</b> trong khung mang <b>1 điện tích âm</b> ở pH sinh lý. Hai mạch đều âm nên <b>đẩy nhau</b>, làm DNA kém bền.<br>Ion dương (<b>Na⁺, K⁺, Mg²⁺</b>) bám quanh khung và <b>che</b> bớt điện tích âm. Vì vậy càng nhiều muối thì 2 mạch càng ít đẩy nhau và <b>Tm càng cao</b>.' },
    { q: 'A₂₆₀ là gì?', a: 'Là <b>độ hấp thụ ánh sáng tử ngoại ở bước sóng 260 nm</b>, đo bằng máy quang phổ. Phần hấp thụ là vòng thơm của <b>base</b> (khung đường–phosphate gần như không hấp thụ ở 260 nm).<br>Quy ước thường dùng: A₂₆₀ = 1 ứng với khoảng <b>50 µg/mL DNA mạch kép</b>, ~33 µg/mL DNA mạch đơn, ~40 µg/mL RNA.' },
    { q: 'Biến tính có làm đứt khung DNA không?', a: '<b>Không.</b> Biến tính chỉ phá <b>liên kết H và lực xếp chồng</b> giữa 2 mạch. Liên kết <b>phosphodiester</b> (cộng hóa trị) trong mỗi mạch vẫn nguyên, <b>trình tự base không đổi</b>.<br>Chính vì thông tin còn nguyên nên 2 mạch có thể <b>hồi tính</b> lại.' },
    { q: 'Đường cong hình chữ S nói lên điều gì?', a: 'Biến tính có tính <b>hợp tác</b> (cooperative): khi một đoạn đã mở, base ở đoạn bên cạnh mất "hàng xóm" xếp chồng nên mở dễ hơn. Kết quả là phần lớn DNA chuyển từ kép sang đơn trong <b>một khoảng nhiệt hẹp</b> quanh Tm, chứ không tăng đều.<br>Đồ thị vì thế có hình <b>chữ S</b>: phẳng, dốc đứng quanh Tm, rồi phẳng lại.' },
    { q: 'Ngoài nhiệt, còn gì làm DNA biến tính?', a: '• <b>Kiềm</b> (NaOH, pH > ~11): làm G và T mất H nên mất liên kết H. Dùng trong Southern blot.<br>• <b>Formamide, urê, DMSO</b>: cạnh tranh liên kết H, làm <b>Tm giảm</b>. Nhờ vậy lai được ở nhiệt độ thấp hơn, hoặc PCR được khuôn giàu GC.<br>• <b>Muối thấp</b>: điện tích âm không được che.<br>Người ta <u>không</u> dùng acid mạnh vì acid cắt mất base purine (khử purine).' },
    { q: 'Hồi tính cần những điều kiện gì?', a: '① Có <b>2 mạch bổ sung</b>.<br>② Nhiệt độ <b>thấp hơn Tm</b> nhưng đủ ấm (DNA dài: thường khoảng Tm − 20 đến 25 °C) để các cặp sai bị tách ra.<br>③ Đủ <b>muối</b>.<br>④ Đủ <b>thời gian và nồng độ</b>, vì 2 mạch phải va chạm "đúng chỗ" rồi kéo khóa (zipper) dọc theo nhau.' },
  ],

  steps: [
    { title: 'Cái gì giữ 2 mạch lại với nhau?', text: 'Phóng to 4 tầng cặp base:<br>• <b>A=T</b>: 2 liên kết H (que trắng).<br>• <b>G≡C</b>: 3 liên kết H.<br>• Các tầng base <b>xếp chồng</b> lên nhau, hút nhau bằng lực Van der Waals và kỵ nước.<br>• Khung ngoài mang <b>phosphate (−)</b> nên 2 mạch đẩy nhau.<br>Toàn bộ là <b>liên kết yếu</b>. Liên kết cộng hóa trị chỉ nằm <b>dọc</b> mỗi mạch (phosphodiester), không có liên kết cộng hóa trị nào nối 2 mạch.' },
    { title: 'Đun nóng: vùng giàu A=T tách trước', text: 'Kéo thanh <b>Nhiệt độ</b> hoặc xem nhiệt kế tự tăng.<br>• Đến khoảng 70–75 °C, đoạn giữa (<b>giàu A=T</b>, ít liên kết H, xếp chồng yếu) tách trước, tạo thành "<b>bong bóng</b>".<br>• Hai đầu (<b>giàu G≡C</b>) giữ lâu hơn, đến gần 95 °C mới tách hẳn.<br>Đây cũng là lý do <b>điểm khởi đầu sao chép</b> (ori) và <b>hộp −10 TATAAT / hộp TATA</b> của promoter giàu A–T: <b>dễ mở</b>.' },
    { title: 'Hiệu ứng tăng sắc (hyperchromic) ở 260 nm', text: '<b>Tia UV 260 nm</b> (chấm tím) chiếu qua DNA.<br>• Trong mạch kép, base xếp chồng sít nhau nên "che" lẫn nhau: <b>hấp thụ ít</b>, tia đi qua.<br>• Khi tách mạch, base lộ ra (sáng lên): <b>hấp thụ nhiều hơn khoảng 40%</b>.<br>Đồ thị phía dưới: <b>đường cam</b> là DNA mạch kép (thấp, rồi tăng vọt hình chữ S). <b>Đường xám</b> là DNA mạch đơn (luôn cao, chỉ tăng nhẹ).<br>Đo A₂₆₀ là cách <b>theo dõi biến tính</b> mà không cần nhìn thấy DNA.' },
    { title: 'Tm: nhiệt độ mà 50% DNA đã tách mạch', text: '<b>Tm</b> (melting temperature) là <b>điểm giữa</b> đoạn tăng vọt của đường cong: tại đó <b>một nửa</b> số phân tử đã tách mạch. DNA mẫu ở đây có Tm ≈ <b>82 °C</b> (như hình trên slide).<br>⚠️ Tm <u>không phải</u> nhiệt độ mà toàn bộ DNA tách hết. Ở Tm, DNA mới tách được 50%, cần nóng hơn thêm vài độ mới tách gần hết.<br>Kéo thanh nhiệt độ qua lại quanh 82 °C để thấy DNA mở và đóng.' },
    { title: '%GC càng cao, Tm càng cao', text: 'Ba DNA cùng độ dài, khác <b>tỉ lệ G·C</b>, cùng đun nóng.<br>Đồ thị bên phải giống <b>hình (b) trên slide</b>: Tm tăng <b>tuyến tính</b> theo %GC (khoảng 70 °C ở 0% GC đến 110 °C ở 100% GC). Công thức gần đúng (Marmur–Doty, trong dung dịch SSC): <b>Tm ≈ 69,3 + 0,41 × %GC</b>.<br>Đường cam ngang là <b>nhiệt độ hiện tại</b>. DNA nào có Tm nằm <b>dưới</b> đường này (chấm đỏ) thì đã tách mạch.<br>Lý do: G≡C có <b>3 liên kết H</b> (A=T có 2), và tầng G·C <b>xếp chồng mạnh hơn</b>.' },
    { title: 'Muối nâng Tm: ion Na⁺ che điện tích âm', text: 'Nhiệt độ đang giữ ở <b>77 °C</b>. Bật/tắt <b>Muối cao</b>:<br>• <b>Nhiều Na⁺</b> (chấm tím): ion bám quanh khung phosphate (−), che bớt lực đẩy giữa 2 mạch → Tm ≈ <b>82 °C</b> → ở 77 °C DNA <b>vẫn còn kép</b> phần lớn.<br>• <b>Ít muối</b>: 2 mạch đẩy nhau mạnh → Tm tụt xuống ≈ <b>72 °C</b> → ở 77 °C DNA <b>đã tách</b> phần lớn.<br>Trong lai phân tử, người ta rửa bằng <b>muối thấp + nhiệt cao</b> (rửa "nghiêm ngặt") để chỉ đầu dò bắt cặp hoàn hảo mới bám lại.' },
    { title: 'Hồi tính: hạ nhiệt từ từ hay làm lạnh nhanh?', text: 'Bắt đầu từ 95 °C, 2 mạch đã rời nhau. Chọn cách làm nguội:<br>• 🐢 <b>Hạ nhiệt từ từ</b>: hai mạch va chạm, bắt cặp tại một <b>điểm mầm</b> vài base, rồi <b>kéo khóa</b> (zipper) dọc theo nhau. Kết quả là DNA kép <b>đúng như cũ</b>, A₂₆₀ <b>giảm</b> về lại (giảm sắc).<br>• 🧊 <b>Cho vào đá ngay</b>: nhiệt tụt quá nhanh, các mạch không kịp tìm đúng bạn. Chỉ vài chỗ dính tạm, phần lớn vẫn là <b>mạch đơn</b>.' },
    { title: 'Ứng dụng: một chu kỳ PCR', text: 'PCR lặp lại đúng 3 bước nhiệt mà bài này vừa học:<br>① <b>Biến tính 94–98 °C</b>: tách 2 mạch khuôn.<br>② <b>Gắn mồi 50–65 °C</b> (thường thấp hơn Tm của mồi ~5 °C): <b>hồi tính có chọn lọc</b>, mồi (cam) bắt cặp vào đầu 3′ của mỗi mạch khuôn.<br>③ <b>Kéo dài 72 °C</b>: <b>Taq polymerase</b> (bền nhiệt, từ vi khuẩn <i>Thermus aquaticus</i>) gắn nucleotide vào <b>đầu 3′-OH của mồi</b>, đi theo chiều <b>5′→3′</b>.<br>Mỗi chu kỳ nhân đôi số bản sao: sau <b>n</b> chu kỳ có khoảng <b>2ⁿ</b> bản sao, sau 30 chu kỳ khoảng 10⁹.<br>⚠️ Mồi trong PCR là <b>DNA</b> tổng hợp nhân tạo, không phải mồi RNA như trong tế bào.' },
  ],

  application: `<ul>
  <li><b>PCR</b>: biến tính → gắn mồi → kéo dài. Nhiệt độ gắn mồi chọn theo Tm của mồi. Với mồi ngắn (dưới ~20 nt) có thể ước lượng nhanh bằng <b>quy tắc Wallace: Tm ≈ 2 × (A+T) + 4 × (G+C)</b>. Ví dụ mồi 20 nt có 10 G/C: 2×10 + 4×10 = 60 °C.<br>Thiết kế mồi tốt: GC khoảng <b>40–60%</b>, hai mồi có Tm chênh nhau không quá ~5 °C. Khuôn giàu GC thì thêm <b>DMSO hoặc betaine</b> để hạ Tm.</li>
  <li><b>Đường cong nóng chảy trong qPCR</b> (SYBR Green): sau khi khuếch đại, máy đun nóng từ từ. Thuốc nhuộm phát huỳnh quang chỉ khi bám DNA kép, nên huỳnh quang tụt mạnh tại Tm của sản phẩm. <b>Một đỉnh</b> nghĩa là một sản phẩm đặc hiệu. Có thêm đỉnh thấp thì thường là <b>dimer mồi</b>.</li>
  <li><b>HRM</b> (High Resolution Melting): đo Tm rất chính xác để phát hiện <b>đột biến điểm/SNP</b>, vì chỉ đổi 1 cặp base cũng làm Tm lệch một chút.</li>
  <li><b>Lai phân tử</b> (hybridization) dùng <b>đầu dò</b> có đánh dấu:<br>• <b>Southern blot</b>: dò DNA (biến tính DNA trên màng bằng NaOH).<br>• <b>Northern blot</b>: dò RNA.<br>• <b>FISH</b>: đầu dò huỳnh quang lai thẳng lên nhiễm sắc thể.<br>• <b>Microarray</b>: hàng nghìn đầu dò trên một tấm kính.<br>Độ "nghiêm ngặt" (stringency) tăng khi <b>nhiệt cao + muối thấp</b>, giúp loại các cặp bắt sai.</li>
  <li><b>Đo nồng độ DNA</b> (NanoDrop): A₂₆₀ cho nồng độ. Tỉ lệ <b>A₂₆₀/A₂₈₀ ≈ 1,8</b> là DNA sạch (≈ 2,0 là RNA). Nếu thấp hơn thì có thể lẫn protein.</li>
  <li><b>Tự nhiên cũng "dùng" Tm</b>: oriC của <i>E. coli</i> có vùng 13-mer giàu A–T (DUE) để DnaA mở dễ. Hộp <b>−10 (TATAAT)</b> ở nhân sơ và hộp <b>TATA</b> ở nhân thực đều giàu A–T, giúp RNA polymerase mở DNA. Xem bài 7 và bài 10.</li>
  <li><b>Động học hồi tính (đường cong C₀t)</b>: đo tốc độ hồi tính của DNA đã cắt nhỏ. Năm 1968, Britten & Kohne phát hiện hệ gene nhân thực có rất nhiều <b>trình tự lặp lại</b>, vì chúng hồi tính nhanh hơn hẳn trình tự duy nhất.</li></ul>`,

  distinguish: `<h3>Biến tính và hồi tính</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Biến tính (denaturation)</th><th>Hồi tính (renaturation / annealing)</th></tr>
  <tr><td>Là gì</td><td>2 mạch <b>tách</b> thành mạch đơn</td><td>2 mạch bổ sung <b>bắt cặp lại</b> thành mạch kép</td></tr>
  <tr><td>Điều kiện</td><td>Nhiệt cao (> Tm), kiềm, formamide/urê, muối thấp</td><td>Hạ nhiệt <b>từ từ</b> xuống dưới Tm, đủ muối, đủ thời gian</td></tr>
  <tr><td>Liên kết bị ảnh hưởng</td><td><b>Phá</b> liên kết H + xếp chồng. Khung <b>nguyên vẹn</b></td><td><b>Tạo lại</b> liên kết H + xếp chồng</td></tr>
  <tr><td>A₂₆₀</td><td><b>Tăng</b> ~40% (tăng sắc)</td><td><b>Giảm</b> về lại (giảm sắc)</td></tr>
  <tr><td>Ứng dụng</td><td>Bước 1 PCR, chuẩn bị đầu dò, Southern blot</td><td>Bước 2 PCR (gắn mồi), lai đầu dò, FISH, microarray</td></tr></table></div>
  <h3>Yếu tố ảnh hưởng Tm</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th>Yếu tố</th><th>Tm</th><th>Vì sao</th></tr>
  <tr><td>%GC tăng</td><td>↑ <b>tăng</b></td><td>G≡C có 3 liên kết H, xếp chồng mạnh hơn</td></tr>
  <tr><td>Muối (Na⁺, Mg²⁺) tăng</td><td>↑ <b>tăng</b></td><td>Ion dương che điện tích âm của phosphate, 2 mạch bớt đẩy nhau</td></tr>
  <tr><td>DNA dài hơn (với mạch ngắn)</td><td>↑ tăng</td><td>Nhiều cặp base giữ hơn. Với DNA rất dài thì Tm gần như không đổi theo độ dài nữa</td></tr>
  <tr><td>Có cặp bắt sai (mismatch)</td><td>↓ giảm</td><td>Mất liên kết H và làm lệch xếp chồng tại chỗ sai</td></tr>
  <tr><td>Formamide, urê, DMSO</td><td>↓ giảm</td><td>Cạnh tranh liên kết H với base</td></tr>
  <tr><td>pH rất cao (kiềm)</td><td>↓ biến tính luôn</td><td>G và T mất H nên không tạo được liên kết H</td></tr></table></div>
  <h3>Hạ nhiệt từ từ và làm lạnh nhanh</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>🐢 Hạ nhiệt từ từ</th><th>🧊 Làm lạnh nhanh (cho vào đá)</th></tr>
  <tr><td>Kết quả</td><td>DNA kép đúng như ban đầu</td><td>Phần lớn vẫn là <b>mạch đơn</b>, chỉ dính tạm vài chỗ</td></tr>
  <tr><td>Vì sao</td><td>Đủ thời gian và đủ ấm để cặp sai rời ra, cặp đúng kéo khóa</td><td>Mạch "đông cứng" trước khi kịp gặp đúng bạn</td></tr>
  <tr><td>Dùng khi</td><td>Muốn tạo lại mạch kép, gắn mồi</td><td>Muốn <b>giữ</b> DNA ở dạng mạch đơn (đầu dò trước khi lai)</td></tr></table></div>
  <h3>Biến tính DNA và biến tính protein (bài 3)</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>DNA</th><th>Protein</th></tr>
  <tr><td>Mất gì</td><td>Liên kết giữa <b>2 mạch</b> (H + xếp chồng)</td><td>Cấu trúc bậc 2, 3, 4</td></tr>
  <tr><td>Còn gì</td><td>Trình tự base (khung phosphodiester)</td><td>Bậc 1 (liên kết peptide)</td></tr>
  <tr><td>Phục hồi</td><td><b>Dễ</b>: chỉ cần 2 mạch bổ sung gặp nhau</td><td>Thường <b>khó</b>: dễ vón cục (trứng luộc). Một số protein nhỏ gấp lại được (Anfinsen)</td></tr>
  <tr><td>Đo bằng</td><td>A₂₆₀ tăng</td><td>Mất hoạt tính, đo phổ CD, độ đục</td></tr></table></div>
  <h3>Mồi trong tế bào và mồi trong PCR</h3>
  <div class="tbl-wrap"><table class="cmp"><tr><th></th><th>Trong tế bào (sao chép)</th><th>Trong PCR</th></tr>
  <tr><td>Bản chất</td><td><b>RNA</b> ngắn do primase tổng hợp</td><td><b>DNA</b> oligo tổng hợp hóa học (~18–25 nt)</td></tr>
  <tr><td>Số phận</td><td>Bị cắt bỏ, thay bằng DNA</td><td>Nằm luôn trong sản phẩm</td></tr>
  <tr><td>Quyết định vị trí</td><td>Ori, primase</td><td>Trình tự mồi do người thiết kế, gắn ở nhiệt độ gắn mồi</td></tr></table></div>`,

  traps: [
    { trap: 'Tm là nhiệt độ mà toàn bộ DNA tách hết thành mạch đơn.', truth: 'Tm là nhiệt độ mà <b>50%</b> DNA đã tách mạch, tức <b>điểm giữa</b> đoạn tăng vọt trên đường cong A₂₆₀.' },
    { trap: 'Khi biến tính, A₂₆₀ giảm vì DNA bị phá hủy.', truth: 'A₂₆₀ <b>tăng</b> khoảng 40% (<b>tăng sắc</b>), vì base hết xếp chồng nên lộ ra và hấp thụ nhiều hơn. DNA <b>không bị phá hủy</b>. Hồi tính thì A₂₆₀ giảm lại.' },
    { trap: 'Biến tính làm đứt liên kết phosphodiester, nên DNA vỡ thành mảnh.', truth: 'Biến tính chỉ phá <b>liên kết H và lực xếp chồng giữa 2 mạch</b>. Khung phosphodiester (cộng hóa trị) <b>nguyên vẹn</b>, nên mới hồi tính được.' },
    { trap: 'GC nhiều thì Tm cao chỉ vì G≡C có 3 liên kết H.', truth: 'Có 2 lý do: <b>3 liên kết H</b>, và <b>lực xếp chồng</b> của tầng G·C mạnh hơn. Lực xếp chồng thậm chí đóng góp phần lớn năng lượng ổn định.' },
    { trap: 'Muối càng nhiều, DNA càng dễ biến tính.', truth: 'Ngược lại. Ion dương <b>che điện tích âm</b> của phosphate nên 2 mạch bớt đẩy nhau, <b>Tm tăng</b>, DNA <b>bền hơn</b>. Muối <b>thấp</b> mới làm Tm giảm.' },
    { trap: 'Đun lên 95 °C rồi cho vào đá ngay thì DNA bắt cặp lại tốt nhất.', truth: 'Làm lạnh nhanh thì các mạch <b>không kịp tìm đúng bạn</b>, phần lớn vẫn là mạch đơn. Muốn hồi tính đúng phải <b>hạ nhiệt từ từ</b>.' },
    { trap: 'DNA tách mạch đều từ đầu đến cuối như nhau.', truth: 'Vùng <b>giàu A=T</b> tách trước, tạo "bong bóng". Vùng giàu G≡C tách sau. Vì vậy ori và hộp −10/TATA giàu A–T (dễ mở).' },
    { trap: 'Hộp TATA hay hộp −10 (TATAAT) giàu A–T vì đó là codon mở đầu.', truth: 'Hộp TATA/−10 nằm trên <b>DNA</b>, thuộc <b>promoter</b>, giàu A–T để <b>dễ tách mạch</b> cho RNA polymerase bám và mở. <b>Codon mở đầu AUG</b> nằm trên <b>mRNA</b>, do <b>ribosome</b> đọc lúc dịch mã. Đây là 2 thứ hoàn toàn khác nhau.' },
    { trap: 'Mồi trong PCR là RNA giống như trong tế bào.', truth: 'Mồi PCR là <b>DNA oligo tổng hợp nhân tạo</b> và nằm luôn trong sản phẩm. Mồi RNA do primase tạo chỉ có trong sao chép ở tế bào.' },
  ],

  quiz: [
    { q: 'Tm của DNA được định nghĩa là:', ops: ['Nhiệt độ mà DNA bắt đầu tách mạch', 'Nhiệt độ mà 50% DNA đã tách mạch', 'Nhiệt độ mà 100% DNA đã tách thành mạch đơn', 'Nhiệt độ làm đứt liên kết phosphodiester'], a: 1, e: 'Tm là điểm giữa đoạn tăng vọt của đường cong A₂₆₀, nơi 50% phân tử đã tách mạch.' },
    { q: 'Đoạn DNA nào có Tm cao nhất (cùng độ dài, cùng điều kiện)?', ops: ['30% GC', '45% GC', '60% GC', '70% AT'], a: 2, e: '70% AT nghĩa là chỉ 30% GC. 60% GC cao nhất nên Tm cao nhất (G≡C 3 liên kết H, xếp chồng mạnh hơn).' },
    { q: 'Khi đun nóng dung dịch DNA mạch kép qua Tm, A₂₆₀ thay đổi thế nào?', ops: ['Giảm khoảng 40% vì DNA bị phá hủy', 'Không đổi vì base vẫn còn', 'Tăng khoảng 40% vì base hết xếp chồng nên hấp thụ nhiều hơn', 'Tăng gấp 10 lần vì khung bị cắt'], a: 2, e: 'Đây là hiệu ứng tăng sắc (hyperchromic): base xếp chồng trong mạch kép thì hấp thụ ít, tách ra thì hấp thụ nhiều hơn.' },
    { q: 'Tăng nồng độ NaCl trong dung dịch DNA thì:', ops: ['Tm giảm vì Na⁺ phá liên kết H', 'Tm tăng vì Na⁺ che điện tích âm của phosphate, 2 mạch bớt đẩy nhau', 'Tm không đổi vì muối không liên quan', 'DNA bị biến tính ngay'], a: 1, e: 'Ion dương che điện tích âm trên khung phosphate, giảm lực đẩy giữa 2 mạch, nên cần nhiệt cao hơn mới tách được.' },
    { q: 'Biến tính DNA bằng nhiệt phá vỡ những liên kết nào?', ops: ['Liên kết phosphodiester trong mỗi mạch', 'Liên kết N-glycoside giữa base và đường', 'Liên kết H giữa các cặp base và lực xếp chồng base', 'Tất cả các liên kết trên'], a: 2, e: 'Chỉ liên kết yếu giữa 2 mạch bị phá. Liên kết cộng hóa trị trong mỗi mạch còn nguyên, nên trình tự không đổi và hồi tính được.' },
    { q: 'Đun DNA đến 95 °C rồi cho ngay vào đá. Kết quả chủ yếu:', ops: ['DNA kép đúng như ban đầu', 'DNA phần lớn vẫn ở dạng mạch đơn', 'DNA bị cắt thành mảnh nhỏ', 'DNA chuyển thành RNA'], a: 1, e: 'Làm lạnh nhanh thì các mạch không kịp tìm đúng mạch bổ sung. Mẹo này được dùng để giữ đầu dò ở dạng mạch đơn.' },
    { q: 'Vì sao điểm khởi đầu sao chép và hộp −10 của promoter thường giàu A–T?', ops: ['Vì A–T là codon mở đầu', 'Vì A=T chỉ 2 liên kết H và xếp chồng yếu, nên dễ tách mạch', 'Vì A–T bền hơn G–C', 'Vì polymerase chỉ đọc được A và T'], a: 1, e: 'Vùng giàu A–T có Tm cục bộ thấp, nên protein khởi đầu và RNA polymerase dễ mở 2 mạch. Đây là promoter trên DNA, không liên quan codon AUG trên mRNA.' },
    { q: 'Trong PCR, bước nào là ứng dụng trực tiếp của HỒI TÍNH?', ops: ['Biến tính 95 °C', 'Gắn mồi 50–65 °C', 'Kéo dài 72 °C', 'Bảo quản 4 °C'], a: 1, e: 'Ở bước gắn mồi, nhiệt độ hạ xuống dưới Tm của mồi, nên mồi bắt cặp (hồi tính) với trình tự bổ sung trên mạch khuôn.' },
  ],

  recall: [
    'Vẽ tay đường cong A₂₆₀ theo nhiệt độ cho DNA mạch kép và mạch đơn trên cùng một hình. Đánh dấu Tm, ghi "50%" và ghi vì sao đường cong tăng (tăng sắc).',
    'Lập bảng 6 yếu tố ảnh hưởng Tm (%GC, muối, độ dài, mismatch, formamide/DMSO, kiềm). Mỗi yếu tố ghi mũi tên ↑ hoặc ↓ và một chữ "vì sao".',
    'Gấp màn hình lại, nói to 3 bước PCR với nhiệt độ. Bước nào là biến tính, bước nào là hồi tính? Vì sao mồi PCR là DNA còn mồi trong tế bào là RNA?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const lb = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const tv = new THREE.Vector3();
    const sig = (x) => 1 / (1 + Math.exp(-x));
    const fracMelt = (T, Tm) => sig((T - Tm) / 2.4);
    const A260 = (T, Tm) => 1 + 0.37 * fracMelt(T, Tm) + 0.0004 * (T - 20);
    const A260ss = (T) => 1.36 + 0.0009 * (T - 20);

    // ================= 0) Bond close-up: 4 stacked base-pair plates =================
    const bondG = api.group();
    const PL = [['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G']];
    const big = (b) => b === 'A' || b === 'G';
    const plateY = (i) => 1.45 - i * 1.0, plateR = (i) => i * 0.62 - 0.9;
    const rot = (x, i) => V(x * Math.cos(plateR(i)), plateY(i), -x * Math.sin(plateR(i)));
    PL.forEach(([l, r], i) => {
      const g = api.group(bondG); g.position.y = plateY(i); g.rotation.y = plateR(i);
      const wl = big(l) ? 1.25 : 0.95, wr = big(r) ? 1.25 : 0.95, x0 = -1.375, GAP = 0.55;
      api.box(wl, 0.2, 0.62, C[l], g).position.x = x0 + wl / 2;
      api.box(wr, 0.2, 0.62, C[r], g).position.x = x0 + wl + GAP + wr / 2;
      const n = (l === 'G' || l === 'C') ? 3 : 2, xs = x0 + wl;
      const zs = n === 3 ? [-0.2, 0, 0.2] : [-0.12, 0.12];
      zs.forEach(z => api.stick(V(xs - 0.05, 0, z), V(xs + GAP + 0.05, 0, z), 0.045, 0xffffff, g, { emissive: 0xffffff, emissiveIntensity: 0.6 }));
      api.sphere(0.2, C.sugar, g).position.x = -1.6; api.sphere(0.2, C.sugar, g).position.x = 1.6;
      api.sphere(0.17, C.phosphate, g).position.x = -1.95; api.sphere(0.17, C.phosphate, g).position.x = 1.95;
    });
    for (let i = 0; i < PL.length - 1; i++) {
      api.stick(rot(-1.95, i), rot(-1.95, i + 1), 0.07, C.dna1, bondG);
      api.stick(rot(1.95, i), rot(1.95, i + 1), 0.07, C.dna2, bondG);
    }
    lb.add('b_at', 'A=T: 2 liên kết H', [2.55, 1.75, 0], null, 'big');
    lb.add('b_gc', 'G≡C: 3 liên kết H', [2.6, 0.55, 0], null, 'good');
    lb.add('b_st', 'các tầng base xếp chồng<br>(Van der Waals + kỵ nước)', [-3.0, -0.2, 0]);
    lb.add('b_neg', 'khung phosphate (−): 2 mạch đẩy nhau', [0, -2.35, 0], null, 'warn');
    lb.add('b_cov', 'liên kết cộng hóa trị chỉ chạy DỌC mỗi mạch', [0, 2.55, 0], null, 'dim');

    // ================= 1–3, 5, 6) Melting helix + thermometer + A260 plot =================
    const meltG = api.group();
    const dG = api.group(meltG);
    const SEQ = 'GCCATTATAATATTTAAGCCGT'; // 22 bp, 7 G·C (~32% GC), giữa giàu A–T
    const dna = api.dna({ seq: SEQ, rise: 0.36, radius: 0.85, turn: 10, splitY: 1.9, openR: 0.1, parent: dG });
    const isGC = [...SEQ].map(b => (b === 'G' || b === 'C') ? 1 : 0);
    const locGC = isGC.map((_, i) => { let s = 0, n = 0; for (let k = i - 2; k <= i + 2; k++) if (k >= 0 && k < isGC.length) { s += isGC[k]; n++; } return s / n; });
    const pairOpen = (T, Tm, i) => clamp((T - (Tm + 18 * (locGC[i] - 0.32)) + 3.5) / 7);
    dna.pairs.forEach(p => { for (const b of [p.base1, p.base2]) { b.material.emissive = new THREE.Color(UV); b.material.emissiveIntensity = 0; } });

    // thermometer (inside dG so it follows the helix)
    const thG = api.group(dG); thG.position.set(-5.0, 0, 0);
    const TH_B = -1.8, TH_H = 3.6, tY = (T) => TH_B + clamp((T - 20) / 80) * TH_H;
    api.cylinder(0.25, 0.25, TH_H + 0.1, 0xffffff, thG, { opacity: 0.2, depthWrite: false });
    api.sphere(0.42, HOT, thG).position.y = TH_B - 0.25;
    const fill = api.cylinder(0.14, 0.14, 1, HOT, thG);
    [20, 40, 60, 80, 100].forEach(T => { api.box(0.22, 0.03, 0.03, 0xffffff, thG).position.set(0.33, tY(T), 0); });
    const tmTick = api.box(0.4, 0.06, 0.06, 0xffd60a, thG);
    lb.add('th_T', '37 °C', [0, 2.7, 0], thG, 'big');
    lb.add('th_tm', 'Tm', [-0.62, tY(TM0), 0], thG, 'plain');
    lb.add('th_100', '100', [-0.62, tY(100), 0], thG, 'plain');
    lb.add('th_20', '20', [-0.55, tY(20), 0], thG, 'plain');
    lb.add('m_at', 'giữa giàu A=T → tách TRƯỚC (bong bóng)', [0, 3.45, 0], dG, 'warn');
    lb.add('m_gc1', 'đầu giàu G≡C<br>→ tách SAU', [-3.3, -2.45, 0], dG, 'good');
    lb.add('m_gc2', 'đầu giàu G≡C<br>→ tách SAU', [3.3, -2.45, 0], dG, 'good');
    lb.add('m_ss', 'đã tách hẳn thành 2 mạch đơn', [0, 3.45, 0], dG, 'big');
    lb.add('m_5a', "5′", [-4.1, 0.9, 0], dG, 'plain'); lb.add('m_3a', "3′", [4.1, 0.9, 0], dG, 'plain');

    // UV photons (step 2)
    const photons = [];
    for (let j = 0; j < 26; j++) { const ph = api.sphere(0.075, UV, dG, { emissive: UV, emissiveIntensity: 0.9 }); photons.push({ m: ph, k: (j * 7) % SEQ.length, off: j * 0.53 }); }
    lb.add('u_uv', 'tia UV 260 nm ↓', [-3.1, 3.35, 0], dG, 'dim');
    lb.add('u_hyp', 'base lộ ra → hấp thụ nhiều hơn ~40%', [2.5, 3.35, 0], dG, 'warn');

    lb.add('r_nuc', 'điểm mầm → kéo khóa (zipper)', [-2.2, 2.9, 0], dG, 'good');
    lb.add('r_fast', 'không kịp tìm đúng bạn → phần lớn vẫn là mạch đơn', [0, 3.45, 0], dG, 'warn');
    // Na+ ions and phosphate charges (step 5)
    const ions = [];
    dna.pairs.forEach((p, i) => { const m = api.sphere(0.13, NA, dna.group, { emissive: NA, emissiveIntensity: 0.25 }); ions.push({ m, p, top: i % 2 === 0, keep: i % 6 === 2 }); });
    lb.add('n_na', 'Na⁺ che điện tích (−)', [2.6, 2.75, 0], dG, 'big');
    lb.add('n_low', 'ít Na⁺ → 2 mạch đẩy nhau', [2.6, 2.75, 0], dG, 'warn');

    // A260 plot (below the helix)
    const pG = api.group(meltG); pG.position.set(0.3, -3.85, 0);
    const PW = 6.6, PH = 2.3, px = (T) => -PW / 2 + (T - 20) / 80 * PW, py = (A) => (A - 1) / 0.5 * PH;
    api.box(PW + 0.25, 0.04, 0.04, 0xcfd6e6, pG).position.set(0.1, 0, 0);
    api.box(0.04, PH + 0.2, 0.04, 0xcfd6e6, pG).position.set(-PW / 2, PH / 2 + 0.05, 0);
    const curvePts = (f) => { const a = []; for (let T = 20; T <= 100; T += 2) a.push(V(px(T), py(f(T)), 0)); return a; };
    const dsCurve = api.tube(curvePts(T => A260(T, TM0)), 0.05, 0xf2994a, pG);
    const lowCurve = api.tube(curvePts(T => A260(T, TM_LOW)), 0.045, 0x5ab4e6, pG, { opacity: 0.9 });
    api.tube(curvePts(A260ss), 0.04, 0x9aa5b1, pG);
    const marker = api.sphere(0.14, 0xffd60a, pG, { emissive: 0xffd60a, emissiveIntensity: 0.6 });
    const dash = (x, parent, color = 0xffd60a) => { const g = api.group(parent); for (let y = 0.05; y < PH; y += 0.26) api.box(0.035, 0.13, 0.035, color, g).position.set(x, y, 0); return g; };
    const tmLine = dash(px(TM0), pG), tmLowLine = dash(px(TM_LOW), pG, 0x5ab4e6);
    lb.add('p_y', 'A₂₆₀', [-PW / 2 - 0.45, PH + 0.1, 0], pG, 'plain');
    lb.add('p_x', 'nhiệt độ (°C)', [PW / 2 - 0.4, -0.72, 0], pG, 'plain');
    lb.add('p_20', '20', [px(20), -0.3, 0], pG, 'plain'); lb.add('p_60', '60', [px(60), -0.3, 0], pG, 'plain'); lb.add('p_100', '100', [px(100), -0.3, 0], pG, 'plain');
    lb.add('p_ss', 'mạch đơn', [px(40), py(A260ss(40)) + 0.3, 0], pG, 'dim');
    lb.add('p_ds', 'mạch kép', [px(40), py(A260(40, TM0)) + 0.3, 0], pG, 'dim');
    lb.add('p_tm', 'Tm ≈ 82 °C', [px(TM0) + 0.75, PH + 0.3, 0], pG, 'good');
    lb.add('p_half', '50% đã tách', [px(TM0) + 1.05, py(A260(TM0, TM0)) - 0.1, 0], pG, 'plain');
    lb.add('p_tml', 'ít muối: Tm ≈ 72 °C', [px(TM_LOW) - 0.9, PH + 0.3, 0], pG, 'big');

    // ================= 4) %GC comparison =================
    const gcG = api.group();
    const mkSeq = (k) => { let s = ''; for (let i = 0; i < 16; i++) { const gc = Math.floor((i + 1) * k / 16) > Math.floor(i * k / 16); s += gc ? (i % 2 ? 'C' : 'G') : (i % 2 ? 'T' : 'A'); } return s; };
    const GCS = [5, 8, 11].map((k, j) => {
      const pct = k / 16 * 100, Tm = 69.3 + 0.41 * Math.round(pct), seq = mkSeq(k);
      const hg = api.group(gcG); hg.position.set(-3.4, 2.35 - j * 2.45, 0);
      const d = api.dna({ seq, rise: 0.3, radius: 0.5, turn: 10, splitY: 0.55, openR: 0.05, parent: hg });
      lb.add('g_l' + j, `${Math.round(pct)}% GC · Tm ≈ ${Math.round(Tm)} °C`, [0, 1.15, 0], hg, j === 0 ? 'warn' : j === 1 ? '' : 'good');
      return { d, Tm, pct, seq };
    });
    const bG = api.group(gcG); bG.position.set(0.9, -2.3, 0);
    const BW = 4.6, BH = 4.2, bx = (p) => p / 100 * BW, by = (T) => (T - 60) / 55 * BH;
    api.box(BW + 0.2, 0.04, 0.04, 0xcfd6e6, bG).position.set(BW / 2, 0, 0);
    api.box(0.04, BH + 0.2, 0.04, 0xcfd6e6, bG).position.set(0, BH / 2, 0);
    api.stick(V(bx(0), by(69.3), 0), V(bx(100), by(110.3), 0), 0.04, 0xf2994a, bG);
    const dots = GCS.map(g => { const m = api.sphere(0.15, C.good, bG); m.position.set(bx(g.pct), by(g.Tm), 0.05); return m; });
    const tLine = api.box(BW, 0.045, 0.045, 0xff9f43, bG);
    lb.add('bg_y', 'Tm (°C)', [-0.15, BH + 0.4, 0], bG, 'plain'); lb.add('bg_x', '% G·C', [BW + 0.75, 0.05, 0], bG, 'plain');
    lb.add('bg_0', '0', [0, -0.3, 0], bG, 'plain'); lb.add('bg_50', '50', [bx(50), -0.3, 0], bG, 'plain'); lb.add('bg_100', '100', [bx(100), -0.3, 0], bG, 'plain');
    lb.add('bg_70', '70', [-0.35, by(70), 0], bG, 'plain'); lb.add('bg_90', '90', [-0.35, by(90), 0], bG, 'plain'); lb.add('bg_110', '110', [-0.4, by(110), 0], bG, 'plain');
    lb.add('bg_T', 'nhiệt độ hiện tại', [BW - 0.6, 0, 0], bG, 'dim');
    lb.add('bg_f', 'Tm ≈ 69,3 + 0,41 × %GC', [bx(66), by(65), 0], bG, 'dim');

    // ================= 7) PCR cycle (flat ladder) =================
    const pcrG = api.group();
    const PSEQ = 'ATGCGTACCGATTGCAGT', PN = PSEQ.length, PRISE = 0.45, PRL = 4;
    const pd = api.dna({ seq: PSEQ, rise: PRISE, radius: 0.85, twist: 0, phase: 0, splitY: 1.0, openR: 0.6, parent: pcrG });
    const pX = (i) => pd.xOf(i);
    const YN = 0.81;
    const mkNew = (top) => {
      const g = api.group(pcrG), up = top ? 1 : -1, y = top ? YN : -YN;
      const nts = [...PSEQ].map((b, i) => {
        const base = top ? COMP[b] : b; // mạch mới dưới mạch 1 bổ sung với mạch 1; mạch mới trên mạch 2 giống mạch 1
        const isPr = top ? i >= PN - PRL : i < PRL;
        const n = api.group(g); n.position.set(pX(i), y, 0);
        api.sphere(0.16, isPr ? PRIMER : NEWS, n);
        api.box(0.16, 0.8, 0.26, C[base], n).position.y = up * 0.44;
        return { n, isPr, i };
      });
      const sticks = []; for (let i = 0; i < PN - 1; i++) sticks.push(api.stick(V(pX(i), y, 0), V(pX(i + 1), y, 0), 0.06, (top ? i >= PN - PRL : i + 1 < PRL) ? PRIMER : NEWS, g));
      return { g, nts, sticks, y, up };
    };
    const newTop = mkNew(true), newBot = mkNew(false);
    const taqT = api.blob(0.42, C.enzyme, pcrG, { seed: 3 }), taqB = api.blob(0.42, C.enzyme, pcrG, { seed: 5 });
    lb.add('pc_s1', "mạch khuôn 1: 5′ → 3′", [0, 3.15, 0], pcrG, 'dim');
    lb.add('pc_s2', "mạch khuôn 2: 3′ ← 5′", [0, -3.15, 0], pcrG, 'dim');
    lb.add('pc_T', '95 °C', [-4.9, 2.75, 0], pcrG, 'big');
    lb.add('pc_den', '① Biến tính 94–98 °C: tách 2 mạch', [0, 0, 0.5], pcrG, 'warn');
    lb.add('pc_ann', '② Gắn mồi 50–65 °C (mồi = DNA)', [0, 0, 0.5], pcrG, '');
    lb.add('pc_ext', '③ Kéo dài 72 °C: Taq gắn vào đầu 3′-OH', [0, 0, 0.5], pcrG, 'good');
    lb.add('pc_taq', 'Taq', [0, 0, 0.6], taqT, 'plain');
    lb.add('pc_n', 'chu kỳ 1 → 2 bản sao', [4.6, 2.75, 0], pcrG, 'good');

    // ================= controls =================
    let cur = 0, T = 37, salt = true, cool = 'slow', userT = false, cycle = 1, lastShown = '';
    const auto = { from: 25, to: 95 };
    const prT = progress(1 / 6), pr = progress(1 / 9);
    const sT = api.slider('🌡️ Nhiệt độ', 20, 100, 1, 37, (v) => { userT = true; T = v; }, (x) => x + ' °C');
    const tSalt = api.toggle('🧂 Muối cao (nhiều Na⁺)', true, (v) => { salt = v; refreshLabels(); lastShown = ''; });
    const bCool = api.buttons([['🐢 Hạ nhiệt từ từ', () => { cool = 'slow'; ctl.setStep(6); }], ['🧊 Cho vào đá ngay', () => { cool = 'fast'; ctl.setStep(6); }]]);
    const CTL = [[sT.el, [1, 2, 3, 4, 5]], [tSalt.el, [5]], [bCool, [6]]];

    const groups = { bondG, meltG, gcG, pcrG };
    const VIS = [['bondG'], ['meltG'], ['meltG'], ['meltG'], ['gcG'], ['meltG'], ['meltG'], ['pcrG']];
    const CAM = [[[0, 1.9, 8.2], [0, 0.15, 0]], [[-0.6, 0.6, 12.2], [-0.6, 0.1, 0]], [[-0.3, 0.1, 14.6], [-0.3, -0.35, 0]], [[-0.3, 0.1, 14.6], [-0.3, -0.35, 0]],
      [[-0.6, 0.3, 13.2], [-0.6, 0.1, 0]], [[-0.3, 0.1, 14.6], [-0.3, -0.35, 0]], [[-0.6, 0.6, 12.2], [-0.6, 0.1, 0]], [[0, 0.2, 12.5], [0, 0, 0]]];
    const PLOT = ['p_y', 'p_x', 'p_20', 'p_60', 'p_100', 'p_ss', 'p_ds'];
    const TH = ['th_T', 'th_100', 'th_20'];
    const LBL = [
      ['b_at', 'b_gc', 'b_st', 'b_neg', 'b_cov'],
      [...TH, 'th_tm', 'm_5a', 'm_3a'],
      [...TH, 'u_uv', 'u_hyp', ...PLOT],
      [...TH, 'th_tm', ...PLOT, 'p_tm', 'p_half'],
      ['g_l0', 'g_l1', 'g_l2', 'bg_y', 'bg_x', 'bg_0', 'bg_50', 'bg_100', 'bg_70', 'bg_90', 'bg_110', 'bg_T', 'bg_f'],
      [...TH, ...PLOT, 'p_tm'],
      [...TH],
      ['pc_s1', 'pc_s2', 'pc_T', 'pc_n'],
    ];
    const LAYOUT_B = [2, 3, 5];
    const tmNow = () => (cur === 5 && !salt ? TM_LOW : TM0);
    const refreshLabels = () => {
      const L = LBL[cur].slice();
      if (cur === 5) L.push(salt ? 'n_na' : 'n_low', ...(salt ? [] : ['p_tml']));
      lb.only(L);
    };
    const readout = () => {
      const s = cur, f = Math.round(fracMelt(T, tmNow()) * 100), a = A260(T, tmNow()).toFixed(2);
      const key = s + ':' + Math.round(T) + ':' + salt + ':' + cool + ':' + cycle;
      if (key === lastShown) return; lastShown = key;
      let h;
      if (s === 0) h = 'Đếm que trắng: <b>A=T có 2</b>, <b>G≡C có 3</b>. Kéo để xoay và nhìn các tầng base xếp chồng.';
      else if (s >= 1 && s <= 3) h = `<b>T = ${Math.round(T)} °C</b> · khoảng <b>${f}%</b> DNA đã tách mạch · A₂₆₀ tương đối = <b>${a}</b>${s === 3 && Math.abs(T - TM0) < 1.5 ? ' · <b>đang ở Tm</b> ✓' : ''}`;
      else if (s === 4) h = `<b>T = ${Math.round(T)} °C</b>: ` + GCS.map(g => `${Math.round(g.pct)}% GC ${T > g.Tm ? '<b style="color:#ff6b6b">đã tách</b>' : '<b style="color:#34c759">còn kép</b>'}`).join(' · ');
      else if (s === 5) h = `${salt ? '🧂 <b>Muối cao</b>: Tm ≈ 82 °C' : '💧 <b>Ít muối</b>: Tm ≈ 72 °C'} · ở <b>${Math.round(T)} °C</b> có khoảng <b>${f}%</b> DNA đã tách mạch.`;
      else if (s === 6) h = cool === 'slow' ? '🐢 <b>Hạ nhiệt từ từ</b>: bắt cặp tại điểm mầm rồi kéo khóa → DNA kép đúng như cũ, A₂₆₀ giảm lại.' : '🧊 <b>Làm lạnh nhanh</b>: không kịp bắt cặp đúng → phần lớn vẫn là mạch đơn (chỉ vài chỗ dính tạm).';
      else h = `Chu kỳ <b>${cycle}</b>: từ 1 phân tử có <b>${cycle <= 20 ? (2 ** cycle).toLocaleString('vi-VN') : '~' + (2 ** cycle).toExponential(1)}</b> bản sao. Sau 30 chu kỳ ≈ 10⁹.`;
      api.readout(h);
    };

    const showG = (k, on) => { const g = groups[k]; g.visible = true; api.scaleTo(g, on ? 1 : 0.001, 6); };
    const resetPCR = () => {
      pd.pairs.forEach(p => { p.open = 0; p.target = 0; }); pd.relayout();
      for (const ns of [newTop, newBot]) ns.nts.forEach(n => n.n.scale.setScalar(0.001));
    };

    const ctl = {
      setStep(s) {
        cur = s; userT = false; lastShown = '';
        for (const k of Object.keys(groups)) showG(k, VIS[s].includes(k));
        // layout of the melting scene
        const B = LAYOUT_B.includes(s);
        api.moveTo(dG, B ? [-0.2, 1.45, 0] : [0.4, 0, 0], 6); api.scaleTo(dG, B ? 0.82 : 1, 6);
        api.scaleTo(pG, B ? 1 : 0.001, 6);
        dsCurve.material.opacity = 1; lowCurve.visible = s === 5; tmLowLine.visible = s === 5; tmLine.visible = s === 3 || s === 5;
        tmTick.visible = s === 3 || s === 5; tmTick.position.set(0, tY(TM0), 0);
        ions.forEach(o => o.m.scale.setScalar(0.001));
        photons.forEach(p => p.m.visible = s === 2);
        // auto temperature ramp per step
        const R = { 1: [25, 97, 7], 2: [25, 100, 7], 3: [25, TM0, 5], 4: [60, 93, 8], 5: [77, 77, 1], 6: [95, cool === 'slow' ? 40 : 4, cool === 'slow' ? 7 : 1.2] }[s];
        if (R) { auto.from = R[0]; auto.to = R[1]; prT.rate = 1 / R[2]; prT.snap(0, 1); T = R[0]; sT.set(Math.round(T)); }
        if (s === 6) dna.pairs.forEach(p => { p.open = 1; p.target = 1; });
        if (s === 6) dna.relayout();
        if (s === 7) { cycle = 1; pr.snap(0, 1); resetPCR(); }
        api.camera(...CAM[s]);
        refreshLabels();
        CTL.forEach(([el, steps]) => { el.style.display = steps.includes(s) ? '' : 'none'; });
        readout();
      },
      update(dt, t) {
        const s = cur;
        if (s === 0) { bondG.rotation.y = Math.sin(t * 0.45) * 0.35; return readout(); }

        // ----- temperature (auto ramp unless user dragged) -----
        if (s >= 1 && s <= 6 && !userT) {
          const p = prT.tick(dt); T = lerp(auto.from, auto.to, s === 6 && cool === 'fast' ? 1 - (1 - p) ** 3 : ease(p));
          sT.set(Math.round(T));
        }
        if (s >= 1 && s <= 6) {
          const len = Math.max(0.01, tY(T) - TH_B); fill.scale.y = len; fill.position.y = TH_B + len / 2;
          lb.set('th_T', Math.round(T) + ' °C');
        }

        // ----- melting helix -----
        if (s === 1 || s === 2 || s === 3 || s === 5) {
          const Tm = tmNow();
          dna.pairs.forEach((p, i) => { p.target = pairOpen(T, Tm, i); });
          const mean = dna.pairs.reduce((a, p) => a + p.open, 0) / dna.pairs.length;
          if (s === 1) { lb.show('m_at', mean > 0.12 && mean < 0.9); lb.show('m_gc1', mean > 0.12 && mean < 0.9); lb.show('m_gc2', mean > 0.12 && mean < 0.9); lb.show('m_ss', mean >= 0.9); }
          dna.pairs.forEach(p => { const k = s === 2 || s === 3 ? 0.55 * p.open : 0; p.base1.material.emissiveIntensity = k; p.base2.material.emissiveIntensity = k; });
          marker.position.set(px(T), py(A260(T, Tm)), 0.05);
        }
        if (s === 2) {
          photons.forEach(ph => {
            const y = 3.0 - ((t * 1.7 + ph.off) % 6.0), p = dna.pairs[ph.k];
            const absorbed = y < 0 && p.open > 0.5;
            ph.m.position.set(dna.xOf(ph.k), y, 1.25);
            ph.m.scale.setScalar(absorbed ? 0.001 : 1);
          });
        }
        if (s === 5) {
          ions.forEach(o => {
            const on = salt || o.keep, h = o.top ? o.p.half1.position : o.p.half2.position;
            tv.set(h.x, h.y * 1.38, h.z * 1.38 + 0.15);
            o.m.position.copy(tv); o.m.position.y += Math.sin(t * 2 + o.p.i) * 0.06;
            const sc = o.m.scale.x + ((on ? 1 : 0.001) - o.m.scale.x) * Math.min(1, dt * 5); o.m.scale.setScalar(sc);
          });
        }

        // ----- renaturation -----
        if (s === 6) {
          const p = prT.v;
          if (cool === 'slow') {
            const nuc = 2, front = Math.max(0, (p - 0.2) / 0.8) * (SEQ.length + 2);
            dna.pairs.forEach((q, i) => { q.target = p < 0.2 ? 1 : (Math.abs(i - nuc) <= front ? 0 : 1); });
            dna.pairs.forEach(q => { q.base1.material.emissiveIntensity = 0; q.base2.material.emissiveIntensity = 0; });
            lb.show('r_nuc', p > 0.2 && p < 0.85); lb.show('r_fast', false);
          } else {
            lb.show('r_nuc', false); lb.show('r_fast', p > 0.5);
            dna.pairs.forEach((q, i) => { q.target = p < 0.5 ? 1 : ([3, 4, 11, 17].includes(i) ? 0.45 : 0.9); });
          }
          dG.rotation.x = 0;
        }

        // ----- GC comparison -----
        if (s === 4) {
          GCS.forEach((g, j) => { g.d.pairs.forEach((p, i) => { const gc = (g.seq[i] === 'G' || g.seq[i] === 'C') ? 1.5 : -1.5; p.target = clamp((T - g.Tm - gc + 3) / 6); }); dots[j].material.color.setHex(T > g.Tm ? C.bad : C.good); });
          tLine.position.set(BW / 2, by(clamp(T, 60, 115)), 0.02);
          lb.get('bg_T').position.set(BW - 0.6, by(clamp(T, 60, 115)) + 0.25, 0);
        }

        // ----- PCR -----
        if (s === 7) {
          let e = pr.tick(dt);
          if (pr.done) { cycle = Math.min(cycle + 1, 40); pr.snap(0, 1); resetPCR(); e = 0; }
          const den = e < 0.22, ann = e >= 0.22 && e < 0.45, ext = e >= 0.45;
          lb.set('pc_T', den ? '95 °C' : ann ? '55 °C' : '72 °C');
          lb.show('pc_den', den); lb.show('pc_ann', ann); lb.show('pc_ext', ext); lb.show('pc_taq', ext && e < 0.95);
          lb.set('pc_n', `chu kỳ ${cycle} → ${cycle <= 20 ? (2 ** cycle).toLocaleString('vi-VN') : '~' + (2 ** cycle).toExponential(1)} bản sao`);
          pd.pairs.forEach(p => { p.target = 1; });
          const a = ease(clamp((e - 0.22) / 0.2));
          const k = ext ? PRL + (PN - PRL) * ease(clamp((e - 0.47) / 0.45)) : PRL;
          for (const ns of [newTop, newBot]) {
            ns.nts.forEach(n => {
              const idxFromPrimer = ns === newTop ? (PN - 1 - n.i) : n.i; // thứ tự tổng hợp 5'→3'
              const on = n.isPr ? (e >= 0.22) : (idxFromPrimer < k);
              const yOff = n.isPr ? (1 - a) * -ns.up * 1.3 : 0;
              n.n.position.set(pX(n.i), ns.y + yOff, 0);
              n.n.scale.setScalar(on ? 1 : 0.001);
            });
            ns.sticks.forEach((st, i) => {
              const A = ns.nts[i], B = ns.nts[i + 1];
              st.visible = A.n.scale.x > 0.5 && B.n.scale.x > 0.5;
              if (st.visible) api.setStick(st, A.n.position, B.n.position);
            });
          }
          const frontT = PN - 1 - Math.min(PN - 1, Math.floor(k)), frontB = Math.min(PN - 1, Math.floor(k));
          const tOn = ext && e < 0.95;
          taqT.scale.setScalar(tOn ? 1 : 0.001); taqB.scale.setScalar(tOn ? 1 : 0.001);
          taqT.position.set(pX(Math.max(0, frontT)) - 0.3, YN + 0.1, 0.45);
          taqB.position.set(pX(Math.min(PN - 1, frontB)) + 0.3, -YN - 0.1, 0.45);
        }
        readout();
      },
    };
    return ctl;
  },
};
