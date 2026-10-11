// Bài 8: Sửa chữa DNA. BER (1 base hỏng) và 3 con đường sửa đứt gãy mạch đôi: HR, SSA, NHEJ.
import { labels, progress, clamp, ease, lerp } from './_kit.js';

export default {
  title: 'Sửa chữa DNA: BER · HR · SSA · NHEJ',
  sub: 'DNA bị hỏng mỗi ngày hàng chục nghìn lần trong mỗi tế bào. Hỏng 1 base thì "thay 1 viên gạch" (BER). Đứt cả 2 mạch thì có 3 cách: chép lại từ bản sao (HR), dán 2 đoạn lặp (SSA) hoặc nối đại 2 đầu (NHEJ).',
  legend: '<span><i style="background:#5b8def"></i>mạch 1</span><span><i style="background:#ef6c8b"></i>mạch 2</span><span><i style="background:#34c759"></i>DNA mới tổng hợp / chỗ vừa nối</span><span><i style="background:#2bb3a3"></i>enzyme</span><span><i style="background:#9b6dd6"></i>Ku70/80</span><span><i style="background:#e8505b"></i>A</span><span><i style="background:#f2c94c"></i>T</span><span><i style="background:#3fb27f"></i>G</span><span><i style="background:#4a90e2"></i>C</span><span><i style="background:#ff3b30"></i>nhóm methyl</span>',

  why: `<p>DNA là bản gốc duy nhất của thông tin di truyền. Nếu hỏng mà không sửa, lỗi sẽ bị <b>sao chép sang mọi tế bào con</b> thành <b>đột biến</b> vĩnh viễn.</p>
  <ul><li><b>BER</b> (Base Excision Repair, sửa chữa bằng cắt bỏ base): sửa tổn thương nhỏ ở <b>một base</b>, ví dụ base bị khử amin, oxy hóa (8-oxoG) hay alkyl hóa. Mạch đối diện còn nguyên nên dùng nó làm khuôn.</li>
  <li><b>Sửa đứt gãy mạch đôi</b> (Double-Strand Break, DSB), do bức xạ ion hóa, gốc oxy hóa hoặc chạc sao chép bị gãy. Lúc này <b>cả 2 mạch đều đứt</b> nên không còn mạch khuôn tại chỗ. Tế bào chọn 1 trong 3 đường:
    <ul><li><b>HR</b> (Homologous Recombination, tái tổ hợp tương đồng): chính xác.</li>
    <li><b>SSA</b> (Single-Strand Annealing, bắt cặp mạch đơn): mất đoạn.</li>
    <li><b>NHEJ</b> (Non-Homologous End Joining, nối đầu không tương đồng): nhanh nhưng dễ sai.</li></ul></li></ul>`,

  without: `<ul>
  <li><b>Không có BER:</b> các base hỏng tích lũy. Ví dụ T đối diện G (do 5-methylcytosine bị khử amin) không được sửa. Sau một lần sao chép, một tế bào con mang cặp <b>T–A</b> thay cho C–G, tức đột biến điểm C→T. Đột biến gene glycosylase <b>MUTYH</b> (sửa lỗi do 8-oxoG) gây <b>bệnh đa polyp đại tràng</b> và tăng nguy cơ ung thư đại trực tràng.</li>
  <li><b>Không có HR</b> (ví dụ đột biến <b>BRCA1/BRCA2</b>): tế bào phải dựa vào NHEJ/SSA dễ sai, nên hệ gene mất ổn định. Người mang đột biến BRCA có nguy cơ cao <b>ung thư vú và buồng trứng</b>.</li>
  <li><b>Không có NHEJ</b> (ví dụ hỏng DNA-PKcs, Artemis, Ligase IV): tế bào <b>rất nhạy với tia xạ</b>. Ngoài ra, tế bào lympho không nối được các đoạn gene kháng thể và thụ thể T (tái tổ hợp V(D)J dùng NHEJ), gây <b>suy giảm miễn dịch kết hợp nặng (SCID)</b>.</li>
  <li><b>DSB không được sửa:</b> mất cả đoạn nhiễm sắc thể, chuyển đoạn, hoặc tế bào tự chết theo chương trình (qua p53).</li></ul>
  <div class="box info">👉 Bật các công tắc 💥 dưới mô hình 3D (mỗi công tắc chỉ hiện ở bước liên quan), rồi bấm lại bước đó để <b>nhìn tận mắt</b> hậu quả.</div>`,

  foundation: [
    { q: 'DNA bị hỏng do đâu?', a: '<b>Tự phát:</b> base bị <b>khử amin</b> (mất nhóm −NH₂) hoặc mất base do nhiệt. <b>Oxy hóa:</b> gốc oxy tự do (ROS) biến G thành 8-oxoG. <b>Alkyl hóa:</b> hóa chất gắn nhóm methyl/ethyl vào base. <b>Bức xạ ion hóa</b> (tia X, tia γ) có thể <b>cắt đứt cả 2 mạch</b>. Slide còn kể tín hiệu nội bào và yếu tố di động (transposon, bài 9).' },
    { q: 'Một nucleotide gồm những phần nào? Liên kết nào nối chúng?', a: 'Nucleotide = <b>base</b> + <b>đường deoxyribose</b> + <b>phosphate</b>. Base gắn vào đường bằng <b>liên kết N-glycosidic</b>. Các nucleotide nối với nhau thành mạch bằng <b>liên kết phosphodiester</b> (khung đường-phosphate). Trong BER, mỗi enzyme cắt <b>một loại liên kết khác nhau</b>: glycosylase cắt liên kết N-glycosidic, APE1 cắt khung phosphodiester.' },
    { q: 'Vì sao có 2 mạch bổ sung lại giúp sửa chữa được?', a: 'A luôn bắt cặp T, G luôn bắt cặp C. Vì vậy nếu 1 base trên một mạch hỏng, <b>mạch đối diện vẫn cho biết base đúng là gì</b>: đối diện G thì phải là C. Đó là lý do BER chính xác. Còn khi <b>đứt cả 2 mạch</b> thì tại chỗ đứt không còn khuôn, nên phải tìm khuôn ở nơi khác (chromatid chị em) hoặc nối đại.' },
    { q: 'Khử amin là gì? Vì sao DNA dùng T chứ không dùng U?', a: 'C bị khử amin thành <b>U</b>. Vì DNA "không được phép" có U nên enzyme nhận ra U là lỗi và cắt bỏ. Nếu DNA dùng U thay cho T thì không phân biệt được U "thật" với U do C hỏng. <b>5-methylcytosine (5-mC)</b> (C có gắn methyl, bài 14) khi bị khử amin thì thành <b>T</b> (T chính là 5-methyl-U). Kết quả là cặp C–G thành <b>T–G sai cặp</b>, ví dụ trên slide.' },
    { q: 'Đầu 3′-OH và 5′-phosphate quan trọng gì trong sửa chữa?', a: 'DNA polymerase <b>chỉ gắn thêm nucleotide vào đầu 3′-OH</b> có sẵn. <b>DNA ligase</b> nối đầu 3′-OH với đầu 5′-phosphate kề bên để đóng <b>vết cắt (nick)</b> trên khung, dùng năng lượng ATP ở nhân thực (NAD⁺ ở vi khuẩn). Polymerase lấp chỗ trống nhưng <b>không tự nối được</b> nick cuối cùng. Phải có ligase.' },
    { q: 'Đứt gãy mạch đơn và mạch đôi khác nhau ra sao?', a: '<b>Đứt mạch đơn</b>: mạch kia vẫn giữ 2 đầu ở gần nhau và làm khuôn, nên dễ sửa. <b>Đứt mạch đôi (DSB)</b>: nhiễm sắc thể gãy thành 2 mảnh rời. Không sửa thì mất cả đoạn, còn nối nhầm thì có thể chuyển đoạn. DSB là loại tổn thương <b>nguy hiểm nhất</b>.' },
    { q: 'Chromatid chị em là gì? Vì sao HR chỉ chạy ở pha S/G2?', a: 'Sau khi DNA nhân đôi ở <b>pha S</b>, mỗi nhiễm sắc thể có 2 <b>chromatid chị em</b> giống hệt nhau, dính ở tâm động cho tới khi phân bào. Một chromatid gãy thì chromatid chị em là <b>khuôn hoàn hảo</b> để chép lại. Ở <b>pha G1</b> chưa có chromatid chị em, nên tế bào chủ yếu dùng <b>NHEJ</b>.' },
    { q: '"Cắt gọt đầu" (resection) và "tương đồng" nghĩa là gì?', a: '<b>Resection</b>: enzyme ăn mòn mạch có đầu <b>5′</b> ở chỗ gãy, theo chiều 5′→3′, để lại một <b>đuôi mạch đơn 3′</b> thò ra. Đuôi 3′ này dùng để <b>đi tìm và bắt cặp</b> với trình tự bổ sung. <b>Tương đồng</b> (homologous) nghĩa là có trình tự giống nhau, như chromatid chị em (HR) hay hai đoạn lặp (SSA).' },
    { q: 'Vi khuẩn có giống không?', a: 'Có. Ở <i>E. coli</i>, <b>RecBCD</b> cắt gọt đầu gãy và dừng ở trình tự Chi (bài 7). <b>RecA</b> phủ lên đuôi 3′ và xâm nhập DNA tương đồng. Đó chính là HR của vi khuẩn. Ở nhân thực, việc này do <b>MRN/CtIP, Exo1</b> (cắt gọt) và <b>Rad51</b> (họ hàng của RecA) làm.' },
  ],

  steps: [
    { title: 'Tổn thương: 5-mC bị khử amin → cặp T·G sai', text: 'Nhìn cặp base ở giữa (có quả cầu đỏ là nhóm methyl). Ban đầu là <b>5-methyl-C</b> bắt cặp G. Nó bị <b>khử amin tự phát</b> và đổi màu thành <b>T</b> (vàng). Nhóm methyl vẫn còn vì T chính là 5-methyl-U. Giờ T đứng đối diện G: <b>sai cặp</b>. Mạch G bên dưới vẫn đúng, đó là khuôn để sửa.' },
    { title: 'BER ①: DNA glycosylase cắt bỏ base sai', text: '<b>DNA glycosylase</b> đặc hiệu (với T·G là TDG hoặc MBD4) trượt dọc DNA, <b>lật base sai ra ngoài</b> chuỗi xoắn rồi cắt <b>liên kết N-glycosidic</b>. Base T bay ra. Khung đường-phosphate vẫn nguyên, chỉ còn đường không có base: <b>vị trí AP</b> (apurinic/apyrimidinic).' },
    { title: 'BER ②: APE1 cắt khung tại vị trí AP', text: '<b>APE1</b> (AP endonuclease) nhận ra vị trí AP và cắt <b>liên kết phosphodiester phía 5′</b> của nó, tạo một <b>vết cắt (nick)</b>. Nhìn: đoạn khung xanh nối nucleotide bên trái với đường trống <b>biến mất</b>. Nucleotide bên trái giờ có đầu <b>3′-OH</b> tự do.' },
    { title: 'BER ③: Pol β dọn đường trống và lắp C đúng', text: '<b>DNA Pol β</b> làm 2 việc. (1) Hoạt tính <b>AP lyase</b> (dRP lyase) gỡ phần đường-phosphate còn sót, để lại <b>khoảng trống 1 nucleotide</b>. (2) Hoạt tính polymerase gắn <b>C mới</b> (khung xanh lá) vào đầu 3′-OH, đối diện G làm khuôn. Vẫn còn <b>1 nick</b> bên phải C.' },
    { title: 'BER ④: DNA ligase đóng nick → C–G phục hồi', text: '<b>DNA ligase</b> nối đầu 3′-OH của C mới với đầu 5′-phosphate kề bên. Đoạn khung cuối cùng hiện ra và mạch liền lại. Kết quả là <b>C–G kiểu dại</b>, đúng như trước khi hỏng. Thử 💥 <b>Thiếu DNA ligase</b> để thấy nick không bao giờ đóng.' },
    { title: 'Đứt gãy mạch ĐÔI (DSB) do bức xạ ion hóa', text: 'Một tia bức xạ ion hóa (tia sét vàng) cắt <b>cả 2 mạch</b> cùng chỗ. Phân tử DNA tách thành <b>2 mảnh</b> rời nhau. Không còn mạch khuôn tại chỗ nữa. Tế bào có 3 lựa chọn ở 3 bước tiếp theo: <b>HR</b>, <b>SSA</b>, <b>NHEJ</b>.' },
    { title: 'HR ①: cắt gọt → đuôi 3′ → Rad51 → xâm nhập chromatid chị em', text: 'Ở mỗi đầu gãy, <b>mạch có đầu 5′ bị ăn mòn</b> (MRN/CtIP rồi Exo1, DNA2), để lại <b>đuôi mạch đơn 3′</b>. RPA phủ lên đuôi, rồi <b>BRCA2</b> thay RPA bằng <b>Rad51</b> (chấm xanh ngọc). Sợi Rad51 dò tìm trình tự giống hệt trên <b>chromatid chị em</b> (phía trên), <b>xâm nhập</b> vào đó và mở ra một <b>D-loop</b>.' },
    { title: 'HR ②: chép từ khuôn, nối lại: CHÍNH XÁC', text: 'DNA polymerase kéo dài đuôi 3′ <b>dùng chromatid chị em làm khuôn</b>. Phần DNA mới (xanh lá) giống hệt phần đã bị ăn mòn. Hai đầu quay về, ligase nối lại, chromatid chị em đóng lại nguyên vẹn. Kết quả <b>không mất, không thêm nucleotide nào</b>. Đổi lại, cần có chromatid chị em, nên HR chỉ chạy ở <b>pha S/G2</b>.' },
    { title: 'SSA: hai đoạn lặp bắt cặp → MẤT ĐOẠN', text: 'Nếu 2 bên vết đứt có <b>2 đoạn lặp giống nhau</b> (ống tím), tế bào cắt gọt sâu tới khi lộ cả 2 đoạn lặp ở dạng mạch đơn. <b>Rad52</b> cho 2 đoạn lặp bắt cặp với nhau. Các <b>đuôi thừa</b> không bắt cặp bị cắt bỏ (XPF–ERCC1), rồi lấp và nối. Nhìn: phân tử ngắn hẳn đi, vì <b>mất đoạn nằm giữa 2 lặp cùng 1 bản lặp</b>.' },
    { title: 'NHEJ: Ku giữ 2 đầu, Ligase IV nối thẳng', text: 'Vòng <b>Ku70/80</b> (tím) ôm lấy 2 đầu gãy và gọi <b>DNA-PKcs</b>. Hai đầu được "tỉa" cho vừa (nuclease Artemis), nhiều khi mất vài nucleotide. Sau đó <b>XRCC4–Ligase IV</b> nối thẳng lại, <b>không cần khuôn</b>. Nhanh, chạy ở mọi pha, nhưng chỗ nối thường bị <b>thêm/mất vài nucleotide (indel)</b>. Thử 💥 <b>Mất Ku70/80</b>.' },
  ],

  application: `<ul>
  <li><b>CRISPR-Cas9:</b> Cas9 tạo một DSB đúng chỗ mong muốn. Nếu để tế bào tự sửa bằng <b>NHEJ</b>, chỗ nối thường bị indel, làm lệch khung đọc nên <b>bất hoạt gene (knock-out)</b>. Nếu đưa thêm <b>DNA khuôn</b> mang trình tự mong muốn, tế bào có thể sửa bằng con đường dựa trên tương đồng (HDR, họ hàng với HR) để <b>chèn hoặc sửa chính xác (knock-in)</b>.</li>
  <li><b>Thuốc ức chế PARP (olaparib) cho ung thư có đột biến BRCA1/2:</b> PARP giúp sửa đứt mạch đơn. Ức chế PARP thì đứt mạch đơn biến thành DSB khi sao chép. Tế bào bình thường sửa bằng HR, còn tế bào ung thư thiếu BRCA thì không sửa được nên chết. Đây là kiểu <b>"chết tổng hợp" (synthetic lethality)</b>.</li>
  <li><b>Xạ trị và nhiều thuốc hóa trị</b> (ví dụ cisplatin, etoposide) giết tế bào ung thư bằng cách gây tổn thương DNA, trong đó có DSB. Khối u tăng hoạt sửa chữa DNA thường <b>kháng thuốc</b>.</li>
  <li><b>Hệ miễn dịch:</b> tế bào lympho B và T cố ý cắt DNA rồi nối bằng <b>NHEJ</b> để ghép các đoạn V, D, J, tạo ra hàng triệu kháng thể khác nhau. Hỏng NHEJ gây SCID.</li></ul>
  <div class="box warn">Slide chỉ nêu BER và 3 đường sửa DSB. Còn 2 hệ sửa chữa quan trọng khác: <b>NER</b> (cắt bỏ nucleotide, sửa tổn thương do tia UV; hỏng NER gây bệnh khô da nhiễm sắc tố, xeroderma pigmentosum) và <b>MMR</b> (sửa bắt cặp sai sau sao chép; hỏng MMR gây hội chứng Lynch, ung thư đại tràng). Biết để không nhầm với BER.</div>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>BER</th><th>HR</th><th>SSA</th><th>NHEJ</th></tr>
  <tr><td>Sửa loại hỏng nào</td><td>1 base hỏng (khử amin, 8-oxoG, alkyl hóa)</td><td>Đứt mạch đôi</td><td>Đứt mạch đôi nằm giữa 2 đoạn lặp</td><td>Đứt mạch đôi</td></tr>
  <tr><td>Khuôn</td><td>Mạch đối diện</td><td><b>Chromatid chị em</b></td><td>Đoạn lặp ở 2 bên (bắt cặp với nhau)</td><td><b>Không cần khuôn</b></td></tr>
  <tr><td>Protein chính</td><td>Glycosylase → APE1 → Pol β (lyase + polymerase) → ligase</td><td>MRN/CtIP, RPA, BRCA2, <b>Rad51</b></td><td><b>Rad52</b>, XPF–ERCC1</td><td><b>Ku70/80</b>, DNA-PKcs, XRCC4–<b>Ligase IV</b></td></tr>
  <tr><td>Độ chính xác</td><td>Chính xác</td><td><b>Chính xác</b></td><td><b>Mất đoạn</b> (đoạn giữa + 1 bản lặp)</td><td><b>Dễ sai</b> (indel vài nt)</td></tr>
  <tr><td>Khi nào</td><td>Mọi lúc</td><td>Pha <b>S/G2</b></td><td>Khi có đoạn lặp</td><td><b>Mọi pha</b>, nhanh (chính ở G1)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Sửa DSB bằng HR</th><th>Nhân sơ (<i>E. coli</i>)</th><th>Nhân thực</th></tr>
  <tr><td>Cắt gọt đầu gãy</td><td><b>RecBCD</b>, đổi kiểu cắt khi gặp trình tự <b>Chi</b></td><td>MRN + CtIP, rồi Exo1 / DNA2</td></tr>
  <tr><td>Phủ đuôi 3′, xâm nhập</td><td><b>RecA</b></td><td><b>Rad51</b> (họ hàng RecA), nạp nhờ BRCA2</td></tr>
  <tr><td>NHEJ</td><td>Hầu như không có ở <i>E. coli</i> (chỉ một số vi khuẩn có Ku + LigD)</td><td>Rất quan trọng (Ku70/80, Ligase IV)</td></tr>
  </table></div>`,

  traps: [
    { trap: '"HR và NHEJ chính xác như nhau, chỉ khác tốc độ."', truth: '<b>HR chính xác</b> vì chép lại từ chromatid chị em (pha S/G2). <b>NHEJ nhanh nhưng dễ sai</b>: nối thẳng 2 đầu, thường thêm hoặc mất vài nucleotide (bảng bẫy của cheatsheet).' },
    { trap: '"BER dùng để sửa đứt gãy mạch đôi."', truth: 'BER sửa <b>một base hỏng</b> trên một mạch, mạch đối diện còn nguyên làm khuôn. Đứt mạch đôi do <b>HR, SSA, NHEJ</b> lo.' },
    { trap: '"DNA glycosylase cắt khung phosphodiester."', truth: 'Glycosylase cắt <b>liên kết N-glycosidic</b> giữa base và đường, để lại vị trí AP với khung còn nguyên. <b>APE1</b> mới là enzyme cắt khung phosphodiester.' },
    { trap: '"Thứ tự BER: APE1 → glycosylase → ligase → Pol β."', truth: 'Đúng thứ tự là <b>glycosylase → APE1 → Pol β</b> (AP lyase rồi lắp nucleotide) <b>→ ligase</b>. Phải bỏ base trước thì mới có vị trí AP cho APE1 cắt. Ligase luôn đóng cuối cùng.' },
    { trap: '"SSA nối lại không mất gì vì dùng đoạn lặp tương đồng."', truth: 'SSA <b>mất đoạn</b>: toàn bộ đoạn nằm giữa 2 lặp cùng <b>1 bản lặp</b> bị loại. "Tương đồng" ở đây là 2 đoạn lặp trên <b>cùng một phân tử</b>, không phải chromatid chị em như HR.' },
    { trap: '"Tế bào ở pha G1 sửa DSB chủ yếu bằng HR."', truth: 'G1 chưa có chromatid chị em, nên chủ yếu dùng <b>NHEJ</b>. HR cần pha <b>S/G2</b>.' },
    { trap: '"Cắt gọt đầu gãy ăn mòn mạch 3′ để lộ đuôi 5′."', truth: 'Ngược lại: mạch có đầu <b>5′</b> bị ăn mòn (chiều 5′→3′), để lại <b>đuôi 3′</b> mạch đơn. Đuôi phải là 3′ vì polymerase chỉ kéo dài được từ đầu 3′-OH sau khi xâm nhập.' },
    { trap: '"Cặp T·G xuất hiện chỉ do polymerase gắn sai lúc sao chép."', truth: 'Trong ví dụ slide, T·G sinh ra do <b>5-methylcytosine bị khử amin</b> thành T. Vì thế các vị trí CpG có methyl là <b>điểm nóng đột biến C→T</b>.' },
    { trap: '"Rad51 là protein của vi khuẩn."', truth: '<b>RecA</b> là của vi khuẩn. <b>Rad51</b> là họ hàng của nó ở nhân thực. Cả hai cùng phủ đuôi 3′ mạch đơn và xâm nhập DNA tương đồng.' },
  ],

  quiz: [
    { q: 'Enzyme đầu tiên tác động trong BER là:', ops: ['APE1', 'DNA ligase', 'DNA glycosylase', 'DNA Pol β'], a: 2, e: 'Glycosylase nhận ra và cắt bỏ base hỏng trước, tạo vị trí AP. APE1 chỉ cắt được khung khi đã có vị trí AP, nên nó là bước 2. Ligase luôn ở cuối.' },
    { q: 'Con đường sửa đứt gãy mạch đôi CHÍNH XÁC nhất là:', ops: ['NHEJ', 'SSA', 'HR', 'BER'], a: 2, e: 'HR chép lại từ chromatid chị em nên không mất nucleotide nào. SSA mất đoạn, NHEJ dễ indel. BER không sửa DSB.' },
    { q: 'Một tế bào ở pha G1 bị tia X cắt đứt mạch đôi. Con đường nào được dùng chủ yếu?', ops: ['HR với chromatid chị em', 'NHEJ', 'BER', 'Sao chép lại toàn bộ nhiễm sắc thể'], a: 1, e: 'Pha G1 chưa có chromatid chị em, nên HR gần như không chạy được. NHEJ nối thẳng 2 đầu, chạy được ở mọi pha. Đáp án HR hấp dẫn vì "chính xác", nhưng thiếu khuôn.' },
    { q: 'Một DSB nằm giữa 2 đoạn lặp giống nhau, cách nhau 3 kb, được sửa bằng SSA. Kết quả là:', ops: ['Trình tự được phục hồi nguyên vẹn', 'Mất 3 kb ở giữa cùng 1 bản lặp', 'Thêm một bản lặp thứ ba', 'Chỉ đổi 1 base'], a: 1, e: 'Hai đoạn lặp bắt cặp với nhau, phần nằm giữa trở thành đuôi thừa và bị cắt. Chỉ còn lại 1 bản lặp. SSA luôn gây mất đoạn.' },
    { q: 'Tế bào có đột biến mất chức năng BRCA2. Câu nào ĐÚNG?', ops: ['NHEJ bị hỏng, nên tế bào rất nhạy tia xạ và bị SCID', 'Rad51 không được nạp lên đuôi 3′, nên HR hỏng và tế bào dựa vào NHEJ/SSA dễ sai', 'Glycosylase không cắt được base hỏng', 'Tế bào không còn sao chép DNA'], a: 1, e: 'BRCA2 nạp Rad51 lên đuôi mạch đơn. Mất BRCA2 thì không xâm nhập được, HR hỏng. Đây là cơ sở của thuốc ức chế PARP. SCID liên quan NHEJ (DNA-PKcs, Artemis, Ligase IV), không phải BRCA2.' },
    { q: 'Trong BER, nếu thiếu DNA ligase thì điều gì xảy ra?', ops: ['Base sai không bị cắt', 'Vị trí AP không được tạo', 'Nucleotide đúng đã được lắp nhưng còn một nick trên khung', 'Pol β lắp sai base'], a: 2, e: 'Các bước trước ligase vẫn chạy: bỏ base, cắt khung, lắp C. Chỉ có bước đóng nick cuối cùng bị thiếu. Nick để lâu có thể thành đứt gãy khi chạc sao chép đi qua.' },
    { q: 'Các nhà khoa học dùng CRISPR-Cas9 để "knock-out" (làm mất chức năng) một gene mà không đưa DNA khuôn vào. Con đường sửa chữa nào tạo ra đột biến mong muốn?', ops: ['HR', 'NHEJ', 'BER', 'SSA'], a: 1, e: 'Cas9 tạo DSB. Không có khuôn thì tế bào nối bằng NHEJ, chỗ nối thường bị indel và lệch khung đọc, nên gene mất chức năng. HR/HDR chỉ được dùng khi có khuôn để sửa chính xác.' },
  ],

  recall: [
    'Vẽ tay lại 4 bước BER cho cặp T·G: glycosylase (bỏ base) → APE1 (cắt khung) → Pol β (dọn đường + lắp C) → ligase (đóng nick). Ghi rõ mỗi bước cắt liên kết nào.',
    'Vẽ tay 3 con đường sửa DSB cạnh nhau: HR (đuôi 3′ xâm nhập chromatid chị em), SSA (2 đoạn lặp bắt cặp, mất đoạn giữa), NHEJ (Ku giữ 2 đầu, Ligase IV nối).',
    'Trả lời mỗi câu 1 dòng: chính xác nhất? nhanh nhất? chạy ở G1? mất đoạn chắc chắn? cần BRCA2/Rad51? cần Ku?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const v = new THREE.Vector3(), cA = new THREE.Color(), cB = new THREE.Color();

    // ================= BER stage =================
    const berG = api.group();
    const BSEQ = 'GATCCAGTACCGTAGCTTAG'; // index 10 = C (bắt cặp G)
    const ber = api.dna({ seq: BSEQ, rise: 0.5, radius: 1, turn: 10, phase: Math.PI / 4, parent: berG });
    const M = 10, pm = ber.pairs[M], p9 = ber.pairs[9];
    const xM = ber.xOf(M);
    const methyl = api.sphere(0.15, C.methyl, pm.half1);
    methyl.position.copy(pm.base1.position).add(new THREE.Vector3(0.22, 0, 0));
    const flipT = api.box(0.85, 0.16, 0.26, C.T, berG);
    const flipMe = api.sphere(0.15, C.methyl, flipT); flipMe.position.set(0.1, 0, 0.2);
    flipT.visible = false;
    const enzA = new THREE.Vector3(xM, 2.6, 1.3), enzOff = new THREE.Vector3(xM + 8, 6, -3);
    const mkEnz = (col, seed) => { const b = api.blob(1.05, col, berG, { mat: { opacity: 0, depthWrite: false }, scale: [1.2, 0.8, 1], seed }); b.position.copy(enzOff); b.userData.on = false; return b; };
    const focus = api.torus(1.45, 0.06, 0xffe066, berG, { opacity: 0.55, emissive: 0x886600 }); focus.rotation.y = Math.PI / 2; focus.position.x = xM;
    const gly = mkEnz(0x2bb3a3, 1), ape = mkEnz(0x1f8f84, 3), polb = mkEnz(0x37c6b5, 5), lig = mkEnz(0x5fd3c4, 8);
    const spark = api.sphere(0.25, 0xffe066, berG, { emissive: 0xffaa00 }); spark.visible = false;
    const p0 = ber.pairs[0], pz = ber.pairs[19];
    L.add('e1', "5′", [ber.xOf(0) - 0.7, p0.half1.position.y, p0.half1.position.z], berG, 'plain');
    L.add('e2', "3′", [ber.xOf(0) - 0.7, p0.half2.position.y, p0.half2.position.z], berG, 'plain');
    L.add('e3', "3′", [ber.xOf(19) + 0.7, pz.half1.position.y, pz.half1.position.z], berG, 'plain');
    L.add('e4', "5′", [ber.xOf(19) + 0.7, pz.half2.position.y, pz.half2.position.z], berG, 'plain');
    L.add('base', '5-methyl-C · G', [xM, 1.75, 0.9], berG, 'big');
    L.add('gly', 'DNA glycosylase', [xM, 3.9, 1.3], berG);
    L.add('ape', 'APE1 (AP endonuclease)', [xM, 3.9, 1.3], berG);
    L.add('polb', 'DNA Pol β', [xM, 3.9, 1.3], berG);
    L.add('lig', 'DNA ligase', [xM, 3.9, 1.3], berG);
    L.add('ap', 'vị trí AP (mất base)', [xM + 1.6, -1.7, 1], berG, 'warn');
    L.add('nick', 'nick ← (3′-OH)', [xM - 1.7, -1.7, 1], berG, 'warn');
    L.add('gap', 'trống 1 nucleotide', [xM, -1.7, 1], berG, 'warn');
    L.add('newC', 'C mới ✓', [xM, 1.75, 0.9], berG, 'good');
    L.add('nick2', '→ nick còn lại', [xM + 1.8, -1.7, 1], berG, 'warn');
    L.add('wt', 'C–G phục hồi ✓', [xM, 1.75, 0.9], berG, 'good');
    L.add('tmpl', 'G (mạch khuôn) giữ nguyên', [xM, -2.6, -0.4], berG, 'dim');

    // ================= DSB stage =================
    const dsbG = api.group();
    const DSEQ = 'TACGGATCCA' + 'GACT' + 'TTGCAC' + 'GACT' + 'AGCTTGCA'; // lặp GACT ở k=10..13 và k=20..23
    const NL = 16, TURN = 10;
    const lG = api.group(dsbG), rG = api.group(dsbG), sG = api.group(dsbG);
    const dL = api.dna({ seq: DSEQ.slice(0, NL), rise: 0.5, radius: 1, turn: TURN, phase: 0, parent: lG });
    const dR = api.dna({ seq: DSEQ.slice(NL), rise: 0.5, radius: 1, turn: TURN, phase: (NL / TURN) * Math.PI * 2, parent: rG });
    const dS = api.dna({ seq: DSEQ, rise: 0.5, radius: 1, turn: TURN, phase: 0, openR: 0.9, parent: sG, c1: 0x8aa6d6, c2: 0xd68aa0 });
    lG.position.x = -4; rG.position.x = 4; sG.position.y = 5;
    const ops = (n) => ({ o1: new Float32Array(n).fill(1), o2: new Float32Array(n).fill(1), t1: new Float32Array(n).fill(1), t2: new Float32Array(n).fill(1), g1: new Uint8Array(n), g2: new Uint8Array(n) });
    const OL = ops(NL), OR = ops(NL);
    const setMat = (o, op) => { o.visible = op > 0.02; o.material.opacity = op; };
    function applyOps(d, O, dt) {
      const k = Math.min(1, dt * 7), n = d.pairs.length;
      for (let i = 0; i < n; i++) { O.o1[i] += (O.t1[i] - O.o1[i]) * k; O.o2[i] += (O.t2[i] - O.o2[i]) * k; }
      for (let i = 0; i < n; i++) {
        const p = d.pairs[i];
        setMat(p.s1, O.o1[i]); setMat(p.base1, O.o1[i]); setMat(p.s2, O.o2[i]); setMat(p.base2, O.o2[i]);
        p.s1.material.color.setHex(O.g1[i] ? C.good : C.dna1); p.s2.material.color.setHex(O.g2[i] ? C.good : C.dna2);
        p.hbHide = O.o1[i] < 0.5 || O.o2[i] < 0.5; p.hb.visible = !p.hbHide;
        if (i < n - 1) {
          setMat(p.bb1, Math.min(O.o1[i], O.o1[i + 1])); setMat(p.bb2, Math.min(O.o2[i], O.o2[i + 1]));
          p.bb1.material.color.setHex(O.g1[i] || O.g1[i + 1] ? C.good : C.dna1); p.bb2.material.color.setHex(O.g2[i] || O.g2[i + 1] ? C.good : C.dna2);
        }
      }
    }
    // Rad51 filament beads on the 3′ tails
    const beadG = new THREE.SphereGeometry(0.2, 12, 8), beadM = api.mat(0x2bb3a3);
    const rad51 = [];
    for (let i = 11; i < NL; i++) { const p = dL.pairs[i], b = new THREE.Mesh(beadG, beadM); b.position.set(p.half1.position.x, p.half1.position.y * 1.4, p.half1.position.z * 1.4); dL.group.add(b); rad51.push(b); }
    for (let j = 0; j < 5; j++) { const p = dR.pairs[j], b = new THREE.Mesh(beadG, beadM); b.position.set(p.half2.position.x, p.half2.position.y * 1.4, p.half2.position.z * 1.4); dR.group.add(b); rad51.push(b); }
    // repeat shells (SSA)
    const shell = (d, a, b, parent) => { const m = api.cylinder(1.45, 1.45, (b - a + 1) * 0.5, 0xb57bff, parent, { opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }); m.rotation.z = Math.PI / 2; m.position.x = (d.xOf(a) + d.xOf(b)) / 2; return m; };
    const shL = shell(dL, 10, 13, lG), shR = shell(dR, 4, 7, rG);
    // Ku rings + ligase IV
    const kuL = api.torus(1.2, 0.3, C.protein, lG, { opacity: 0.85 }); kuL.rotation.y = Math.PI / 2; kuL.position.x = dL.xOf(14.5);
    const kuR = api.torus(1.2, 0.3, C.protein, rG, { opacity: 0.85 }); kuR.rotation.y = Math.PI / 2; kuR.position.x = dR.xOf(0.5);
    const lig4 = api.blob(0.95, 0x5fd3c4, dsbG, { mat: { opacity: 0.8, depthWrite: false }, scale: [1, 0.8, 1], seed: 9 }); lig4.position.set(0, 2.1, 0.4);
    // lightning bolt
    const bolt = api.tube([[1.6, 8, 0.5], [0.2, 5, 0.5], [1.1, 4.6, 0.5], [-0.1, 1.2, 0.5]], 0.11, 0xffe066, dsbG, { emissive: 0xffaa00 });
    // junction sticks (the bond across the break)
    const j1 = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.08, C.good, dsbG), j2 = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.08, C.good, dsbG);
    const wa = new THREE.Vector3(), wb = new THREE.Vector3();
    function junction(kind, col) {
      const on = !!kind; j1.visible = j2.visible = on; if (!on) return;
      const [a1, b1, a2, b2] = kind === 'ssa' ? [13, 8, 9, 4] : kind === 'nhej' ? [14, 1, 14, 1] : [15, 0, 15, 0];
      api.setStick(j1, wa.copy(dL.pairs[a1].half1.position).add(lG.position), wb.copy(dR.pairs[b1].half1.position).add(rG.position));
      api.setStick(j2, wa.copy(dL.pairs[a2].half2.position).add(lG.position), wb.copy(dR.pairs[b2].half2.position).add(rG.position));
      j1.material.color.setHex(col ?? C.good); j2.material.color.setHex(col === undefined ? C.good : C.dna2);
    }
    L.add('bolt', 'Bức xạ ion hóa', [2.6, 6.2, 0.5], dsbG, 'warn');
    L.add('brk', 'Đứt gãy mạch ĐÔI (DSB)', [0, -2.4, 0], dsbG, 'warn');
    L.add('tailL', 'đuôi 3′', [dL.xOf(13), -2.1, 0], lG, 'dim');
    L.add('tailR', 'đuôi 3′', [dR.xOf(2), -2.1, 0], rG, 'dim');
    L.add('rad51', 'Rad51 (nạp nhờ BRCA2)', [dL.xOf(12), 2.1, 0], lG);
    L.add('sis', 'Chromatid chị em (khuôn)', [-6.2, 2.3, 0], sG, 'big');
    L.add('dloop', 'D-loop', [1.6, 2.3, 0], sG);
    L.add('newDNA', 'DNA mới chép từ khuôn', [0, -2.1, 0], dsbG, 'good');
    L.add('exact', 'HR: CHÍNH XÁC ✓', [0, 2.7, 0], dsbG, 'good');
    L.add('rep1', 'đoạn lặp', [dL.xOf(11.5), 2.0, 0], lG);
    L.add('rep2', 'đoạn lặp', [dR.xOf(5.5), 2.0, 0], rG);
    L.add('flap', 'đuôi thừa bị cắt', [-1, 2.3, 0], dsbG, 'dim');
    L.add('del', 'SSA: mất đoạn giữa + 1 lặp ✗', [-2, -2.5, 0], dsbG, 'warn');
    const ghost = api.box(15.5, 0.08, 0.08, 0xaaaaaa, dsbG, { opacity: 0.5 }); ghost.position.y = -3.3;
    L.add('ghost', 'độ dài ban đầu', [5.5, -3.75, 0], dsbG, 'dim');
    L.add('ku', 'Ku70/80 + DNA-PKcs', [dL.xOf(13), 2.2, 0], lG);
    L.add('lig4', 'XRCC4–Ligase IV', [0, 3.5, 0.4], dsbG);
    L.add('indel', 'NHEJ: mất 2 bp (indel) ✗', [0, -2.5, 0], dsbG, 'warn');
    L.add('msg', '', [0, -4.4, 0], null, 'warn');

    // ================= state =================
    let cur = 0, glyBad = false, ligBad = false, brcaBad = false, kuBad = false, sig = '';
    const ph = progress(0.18);
    const vis = (o, on, op = 0.85) => { if (o.userData.on !== on) { o.userData.on = on; api.fadeTo(o, on ? op : 0, 6); } };
    const ENZ_OP = 0.6;
    const CAMS = [[[0, 2.5, 12], [0.25, 0, 0]], [[2.5, 3, 9.5], [0.25, 0.8, 0]], [[2.5, 3, 9.5], [0.25, 0.6, 0]], [[2.5, 3, 9.5], [0.25, 0.6, 0]], [[1.5, 2.5, 10.5], [0.25, 0.4, 0]],
      [[0, 2.5, 20], [0, 1, 0]], [[0, 3.2, 19.5], [0, 2.6, 0]], [[0, 2.8, 20], [0, 1.4, 0]], [[-1, 2, 19], [-1.5, 0, 0]], [[5, 3.5, 13], [0, 0.4, 0]]];
    const tg = {};
    const refresh = () => { ctl.setStep(cur); readout(); };
    tg.gly = api.toggle('💥 Thiếu DNA glycosylase', false, (x) => { glyBad = x; refresh(); });
    tg.lig = api.toggle('💥 Thiếu DNA ligase', false, (x) => { ligBad = x; refresh(); });
    tg.brca = api.toggle('💥 Hỏng BRCA2 / Rad51 (mất HR)', false, (x) => { brcaBad = x; refresh(); });
    tg.ku = api.toggle('💥 Mất Ku70/80 (mất NHEJ)', false, (x) => { kuBad = x; refresh(); });
    function readout() {
      const t = [];
      if (glyBad && cur <= 4) t.push('❌ <b>Không có glycosylase</b>: không ai nhận ra T·G. Sau 1 lần sao chép, 1 tế bào con mang <b>T–A</b> thay vì C–G, tức <b>đột biến C→T</b> vĩnh viễn.');
      if (ligBad && [3, 4, 7, 8, 9].includes(cur)) t.push('❌ <b>Không có ligase</b>: mọi bước trước vẫn chạy, nhưng <b>nick không được đóng</b>. Mạch vẫn đứt, và khi chạc sao chép đi qua, một nick có thể biến thành đứt gãy mạch đôi.');
      if (brcaBad && (cur === 6 || cur === 7)) t.push('❌ <b>Mất BRCA2</b>: đuôi 3′ có nhưng <b>không được phủ Rad51</b>, nên không xâm nhập được chromatid chị em. HR thất bại, tế bào phải dùng NHEJ/SSA dễ sai. Đây là gốc của <b>ung thư vú/buồng trứng di truyền</b> và lý do thuốc ức chế PARP hiệu quả.');
      if (kuBad && cur === 9) t.push('❌ <b>Mất Ku70/80</b>: 2 đầu gãy không được giữ và bảo vệ, bị ăn mòn rồi trôi xa. Không nối được, nên tế bào <b>rất nhạy tia xạ</b>. Ở tế bào lympho, hỏng NHEJ chặn tái tổ hợp V(D)J, gây SCID.');
      api.readout(t.join('<br>') || 'Thử nghiệm: mỗi công tắc 💥 chỉ hiện ở bước liên quan. Bật nó lên rồi xem 3D thay đổi.');
    }

    function show(keys) { const s = keys.join(','); if (s !== sig) { sig = s; L.only(keys); } }
    function setMsg(m, keys) { if (m) { L.set('msg', m); keys.push('msg'); } }

    function berFrame(dt, t, f) {
      const keys = ['e1', 'e2', 'e3', 'e4'];
      let col = C.T, baseOn = true, sugOn = true, bb9 = true, bbM = true, flipOn = false, green = false, methylOn = true, hbOn = true, sparkOn = false, msg = '';
      let gOn = false, aOn = false, pOn = false, lOn = false;
      if (cur === 0) {
        const k = clamp((f - 0.3) / 0.35);
        col = cA.setHex(C.C).lerp(cB.setHex(C.T), k).getHex();
        L.set('base', k < 0.5 ? '5-methyl-C · G' : 'T · G sai cặp!'); keys.push('base', 'tmpl');
      } else if (glyBad) {
        L.set('base', 'T · G vẫn còn ✗'); keys.push('base');
        msg = '❌ Không có glycosylase → T·G không được sửa → sao chép thành T–A (đột biến C→T)';
      } else {
        baseOn = false; methylOn = false; hbOn = false;
        if (cur === 1) {
          gOn = true; keys.push('gly');
          const k = clamp((f - 0.3) / 0.4);
          if (k <= 0) { baseOn = true; methylOn = true; hbOn = true; L.set('base', 'T · G sai cặp!'); keys.push('base'); }
          else {
            flipOn = f < 0.9;
            const a = ease(k);
            v.copy(pm.half1.position).add(pm.base1.position);
            flipT.position.set(lerp(v.x, enzA.x, a), lerp(v.y, enzA.y - 0.4, a) + Math.sin(a * Math.PI) * 0.8, lerp(v.z, enzA.z + 0.6, a));
            flipT.rotation.z = a * 2.5; flipT.rotation.x = a * 1.5;
            flipT.scale.setScalar(f > 0.75 ? Math.max(0.01, 1 - (f - 0.75) / 0.15) : 1);
            if (f > 0.7) keys.push('ap');
          }
        }
        if (cur === 2) { aOn = true; keys.push('ape', 'ap'); if (f > 0.45) { bb9 = false; keys.push('nick'); } sparkOn = f > 0.4 && f < 0.6; }
        if (cur === 3) {
          pOn = true; keys.push('polb'); bb9 = false;
          if (f < 0.3) keys.push('ap', 'nick');
          else if (f < 0.55) { sugOn = false; bbM = false; keys.push('gap'); }
          else { baseOn = true; col = C.C; green = true; hbOn = true; bbM = false; bb9 = true; keys.push('newC', 'nick2'); }
        }
        if (cur === 4) {
          lOn = !ligBad; baseOn = true; col = C.C; green = true; hbOn = true;
          bbM = !ligBad && f > 0.45; sparkOn = !ligBad && f > 0.4 && f < 0.6;
          if (ligBad) { keys.push('newC', 'nick2'); msg = '❌ Thiếu ligase → nick không bao giờ đóng, mạch vẫn đứt'; }
          else { keys.push('lig'); keys.push(f > 0.5 ? 'wt' : 'nick2'); if (f <= 0.5) keys.push('newC'); }
        }
      }
      pm.base1.visible = baseOn; pm.base1.material.color.setHex(col);
      methyl.visible = methylOn && baseOn;
      pm.s1.visible = sugOn; pm.s1.material.color.setHex(green ? C.good : C.dna1);
      p9.bb1.visible = bb9; p9.bb1.material.color.setHex(green ? C.good : C.dna1);
      pm.bb1.visible = bbM; pm.bb1.material.color.setHex(green ? C.good : C.dna1);
      pm.hbHide = !hbOn; pm.hb.visible = hbOn;
      focus.material.opacity = 0.35 + 0.25 * Math.sin(t * 4);
      flipT.visible = flipOn;
      spark.visible = sparkOn; if (sparkOn) { spark.position.set(cur === 4 ? xM + 0.25 : xM - 0.25, pm.half1.position.y, pm.half1.position.z); spark.scale.setScalar(0.8 + 0.5 * Math.sin(t * 20)); }
      const k = 1 - Math.exp(-dt * 3);
      for (const [e, on] of [[gly, gOn], [ape, aOn], [polb, pOn], [lig, lOn]]) { vis(e, on, ENZ_OP); e.position.lerp(on ? enzA : enzOff, k); e.rotation.y += dt * 0.4; }
      setMsg(msg, keys); show(keys);
    }

    const tgt = { lx: -4, rx: 4, y: 0 };
    function dsbFrame(dt, t, f) {
      const keys = [];
      let lx = -4.8, rx = 4.8, y = 0, radS = 0, kuS = 0, ligOn = false, amt = 0, jk = null, jcol, boltOp = 0, shells = false, msg = '';
      for (const O of [OL, OR]) { O.t1.fill(1); O.t2.fill(1); O.g1.fill(0); O.g2.fill(0); }
      const resect = (nl, nr) => { for (let i = NL - nl; i < NL; i++) OL.t2[i] = 0; for (let j = 0; j < nr; j++) OR.t1[j] = 0; };
      if (cur === 5) {
        const k = ease(clamp((f - 0.15) / 0.3)); lx = lerp(-4, -4.8, k); rx = lerp(4, 4.8, k);
        boltOp = f > 0.03 && f < 0.32 ? 1 : 0;
        if (f < 0.17) { jk = 'hr'; jcol = C.dna1; }
        if (f < 0.55) keys.push('bolt'); if (f > 0.25) keys.push('brk');
      } else if (cur === 6) {
        resect(Math.round(clamp(f / 0.35) * 5), Math.round(clamp(f / 0.35) * 5));
        if (f > 0.25 && f < 0.6) keys.push('tailL', 'tailR');
        keys.push('sis');
        if (brcaBad) { if (f > 0.4) msg = '❌ Không có Rad51 trên đuôi 3′ → không xâm nhập được chromatid chị em'; }
        else {
          radS = ease(clamp((f - 0.38) / 0.15)); const r = ease(clamp((f - 0.6) / 0.35)); y = 2.2 * r; amt = 0.9 * r;
          if (f > 0.45) keys.push('rad51'); if (f > 0.75) keys.push('dloop');
        }
      } else if (cur === 7) {
        resect(5, 5); keys.push('sis');
        if (brcaBad) msg = '❌ HR thất bại → tế bào phải dùng NHEJ/SSA (dễ sai) → hệ gene mất ổn định';
        else {
          const n = Math.round(clamp(f / 0.4) * 5);
          for (let i = 11; i < 11 + n; i++) { OL.t2[i] = 1; OL.g2[i] = 1; }
          for (let j = 4; j > 4 - n; j--) { OR.t1[j] = 1; OR.g1[j] = 1; }
          radS = 1 - clamp(f / 0.2);
          const d = ease(clamp((f - 0.45) / 0.35)); y = 2.2 * (1 - d); lx = lerp(-4.8, -4, d); rx = lerp(4.8, 4, d); amt = 0.9 * (1 - clamp((f - 0.45) / 0.3));
          if (f > 0.08) keys.push('newDNA');
          if (f > 0.85) { if (ligBad) msg = '❌ Thiếu ligase → 2 đầu đã về chỗ nhưng không được nối'; else { jk = 'hr'; keys.push('exact'); } }
        }
      } else if (cur === 8) {
        const rr = clamp(f / 0.3); resect(Math.round(rr * 6), Math.round(rr * 8));
        shells = f > 0.08;
        const fl = clamp((f - 0.35) / 0.2); OL.t1[14] = OL.t1[15] = 1 - fl; for (let j = 0; j < 4; j++) OR.t2[j] = 1 - fl;
        const m = ease(clamp((f - 0.4) / 0.4)); lx = lerp(-4.8, -4, m); rx = lerp(4.8, -1, m);
        if (f > 0.08 && f < 0.7) keys.push('rep1', 'rep2');
        if (f > 0.35 && f < 0.7) keys.push('flap');
        if (f > 0.85) { keys.push('del', 'ghost'); if (ligBad) msg = '❌ Thiếu ligase → đã bắt cặp nhưng nick không được nối'; else jk = 'ssa'; }
      } else if (cur === 9) {
        if (kuBad) {
          const e = clamp((f - 0.25) / 0.5), n = Math.round(e * 3);
          for (let i = NL - n; i < NL; i++) OL.t1[i] = OL.t2[i] = 0; for (let j = 0; j < n; j++) OR.t1[j] = OR.t2[j] = 0;
          const dr = 1.2 * ease(clamp((f - 0.3) / 0.7)); lx = -4.8 - dr + 0.15 * Math.sin(t * 2); rx = 4.8 + dr + 0.15 * Math.sin(t * 2.3 + 1);
          if (f > 0.3) msg = '❌ Không có Ku → 2 đầu bị ăn mòn, trôi xa, không nối được';
        } else {
          kuS = ease(clamp(f / 0.25)); keys.push('ku');
          if (f > 0.28) { OL.t1[15] = OL.t2[15] = 0; OR.t1[0] = OR.t2[0] = 0; }
          const m = ease(clamp((f - 0.45) / 0.35)); lx = lerp(-4.8, -3.5, m); rx = lerp(4.8, 3.5, m);
          ligOn = !ligBad && f > 0.6; if (ligOn) keys.push('lig4');
          if (f > 0.85) { if (ligBad) msg = '❌ Thiếu ligase → Ku đã giữ 2 đầu kề nhau nhưng không ai nối'; else { jk = 'nhej'; keys.push('indel'); } }
        }
      }
      applyOps(dL, OL, dt); applyOps(dR, OR, dt);
      const k = 1 - Math.exp(-dt * 8);
      lG.position.x += (lx - lG.position.x) * k; rG.position.x += (rx - rG.position.x) * k;
      lG.position.y += (y - lG.position.y) * k; rG.position.y = lG.position.y;
      dS.openRange(9, 23, amt);
      for (const b of rad51) { b.scale.setScalar(Math.max(0.001, radS)); b.visible = radS > 0.01; }
      for (const r of [kuL, kuR]) { r.scale.setScalar(Math.max(0.001, kuS)); r.visible = kuS > 0.01; r.rotation.x += dt; }
      vis(lig4, ligOn, 0.8); lig4.rotation.y += dt * 0.5;
      bolt.visible = boltOp > 0; bolt.material.opacity = boltOp * (0.6 + 0.4 * Math.sin(t * 30));
      shL.visible = shR.visible = shells; ghost.visible = cur === 8 && f > 0.85;
      junction(jk, jcol);
      setMsg(msg, keys); show(keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; ph.snap(0, 1); sig = '';
        berG.visible = s <= 4; dsbG.visible = s >= 5; sG.visible = s === 6 || s === 7;
        if (s === 5) { lG.position.set(-4, 0, 0); rG.position.set(4, 0, 0); }
        else if (s >= 6) { lG.position.set(-4.8, s === 7 && !brcaBad ? 2.2 : 0, 0); rG.position.set(4.8, lG.position.y, 0); }
        const dl = s === 7 && !brcaBad ? 0.9 : 0;
        for (let i = 9; i < 23; i++) dS.pairs[i].open = dS.pairs[i].target = dl;
        dS.relayout();
        tg.gly.el.style.display = s <= 4 ? '' : 'none';
        tg.lig.el.style.display = [3, 4, 7, 8, 9].includes(s) ? '' : 'none';
        tg.brca.el.style.display = s === 6 || s === 7 ? '' : 'none';
        tg.ku.el.style.display = s === 9 ? '' : 'none';
        api.camera(...CAMS[s]);
        readout();
        ctl.update(0, 0);
      },
      update(dt, t) {
        ph.tick(dt);
        if (cur <= 4) berFrame(dt, t, ph.v); else dsbFrame(dt, t, ph.v);
      },
    };
    readout();
    return ctl;
  },
};
