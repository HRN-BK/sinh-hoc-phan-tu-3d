// Bài 19: mTORC1, cảm biến dinh dưỡng. Insulin → PI3K–Akt ⊣ TSC1/2 (Rheb-GAP) → Rheb-GTP; amino acid → Rag → lysosome;
// AMPK (năng lượng thấp) → TSC2; đầu ra S6K, 4E-BP1/eIF4E, tạo ribosome, Pol III, ức chế autophagy (ULK1); rapamycin–FKBP12; xơ cứng củ.
import { labels } from './_kit.js';

export default {
  title: 'mTORC1: cảm biến dinh dưỡng',
  sub: 'mTORC1 là một protein kinase đóng vai "công tắc chính" của tăng trưởng tế bào. Nó chỉ BẬT khi đủ cả hai điều kiện: có amino acid (kéo mTORC1 về màng lysosome) và có Rheb-GTP (do tín hiệu tăng trưởng giữ TSC1/2 ở trạng thái tắt). Bật/tắt từng tín hiệu để xem chuỗi nhân quả.',
  legend: '<span><i style="background:#2bb3a3"></i>mTORC1 (mTOR + Raptor)</span><span><i style="background:#ffd60a"></i>GTP / tín hiệu</span><span><i style="background:#8e8e93"></i>GDP / bất hoạt</span><span><i style="background:#ff8a65"></i>TSC1/2</span><span><i style="background:#d8b26e"></i>lysosome</span><span><i style="background:#30d158"></i>mũi tên hoạt hóa</span><span><i style="background:#ff453a"></i>⊣ ức chế</span>',

  why: `<p>Tế bào phải trả lời câu hỏi: <b>"Có nên lớn lên lúc này không?"</b> Tổng hợp protein và tạo ribosome rất tốn năng lượng và nguyên liệu. Nếu tế bào cứ tổng hợp khi thiếu amino acid hoặc thiếu ATP thì sẽ kiệt sức.</p>
  <p><b>mTORC1</b> (mechanistic Target Of Rapamycin Complex 1) là một <b>serine/threonine kinase</b> tích hợp nhiều tín hiệu: <b>yếu tố tăng trưởng</b> (insulin, IGF-1), <b>amino acid</b>, <b>năng lượng</b> (ATP/AMP), <b>oxy</b> và <b>stress</b>. Đủ điều kiện thì mTORC1 bật: tăng dịch mã, tạo ribosome, tổng hợp lipid, và tắt autophagy. Thiếu thì mTORC1 tắt: tế bào tiết kiệm và bật autophagy để tái chế.</p>
  <p>Hãy đọc sơ đồ như một <b>mạch logic</b>: mTORC1 BẬT = <b>(có amino acid)</b> VÀ <b>(Rheb-GTP)</b> VÀ (không có rapamycin).</p>`,

  without: `<ul>
  <li><b>Mất TSC1 hoặc TSC2</b> (bệnh <b>xơ cứng củ</b>, tuberous sclerosis): không còn GAP cho Rheb, nên Rheb luôn mang GTP, mTORC1 luôn bật kể cả khi không có insulin. Hậu quả: u lành (hamartoma) ở não, da, thận, tim; động kinh; tự kỷ.</li>
  <li><b>mTORC1 hoạt động quá mức</b> gặp trong nhiều loại ung thư (đột biến PI3K, mất PTEN, hoạt hóa Akt): tế bào lớn và tăng sinh không theo tín hiệu.</li>
  <li><b>Ức chế mTORC1</b> (rapamycin) làm tế bào T không tăng sinh được, vì vậy rapamycin là <b>thuốc ức chế miễn dịch</b>.</li>
  <li><b>Thiếu amino acid hoặc thiếu ATP</b> mà mTORC1 vẫn bật thì tế bào tiêu hao nguồn dự trữ và không tái chế được thành phần hỏng (autophagy bị chặn).</li></ul>
  <div class="box info">👉 Thử tắt <b>Amino acid</b> (mTORC1 rời lysosome), tắt <b>Insulin</b> (Rheb chuyển sang GDP), bật <b>Năng lượng thấp</b> (AMPK bật TSC2), rồi bật <b>💥 Đột biến TSC</b> trong lúc tắt Insulin (mTORC1 vẫn bật) và <b>💊 Rapamycin</b>.</div>`,

  foundation: [
    { q: 'Kinase là gì? "mTORC1 bật" nghĩa là gì?', a: '<b>Kinase</b> là enzyme gắn nhóm <b>phosphate</b> (từ ATP) lên protein khác, làm protein đó đổi hoạt tính. "mTORC1 bật" nghĩa là nó đang <b>phosphoryl hóa</b> các đích như <b>S6K</b>, <b>4E-BP1</b>, <b>ULK1</b>. Phosphate có thể <b>bật</b> đích (S6K) hoặc <b>tắt</b> đích (4E-BP1, ULK1).' },
    { q: 'Protein G nhỏ (GTPase) hoạt động thế nào?', a: 'Như một công tắc: gắn <b>GTP = BẬT</b>, gắn <b>GDP = TẮT</b>. <b>GEF</b> giúp đổi GDP thành GTP (bật). <b>GAP</b> kích thích GTPase tự thủy phân GTP thành GDP (tắt). <b>Rheb</b> và <b>Rag</b> đều là GTPase nhỏ.' },
    { q: 'TSC1/TSC2 là gì?', a: 'Phức hợp <b>TSC1–TSC2</b> là <b>GAP của Rheb</b> (TSC2 chứa vùng GAP). TSC hoạt động thì Rheb bị chuyển sang <b>GDP</b>, mTORC1 tắt. Vì vậy TSC là <b>phanh</b> của mTORC1. Ức chế TSC tức là <b>nhả phanh</b>.' },
    { q: 'Lysosome liên quan gì đến mTORC1?', a: 'Lysosome là bào quan tiêu hóa, chứa và giải phóng amino acid. Bề mặt lysosome có <b>Rag GTPase</b> (gắn qua phức hợp Ragulator) và <b>Rheb</b> (gắn màng nhờ đuôi farnesyl). Amino acid làm Rag ở dạng hoạt động, Rag kéo mTORC1 về đây, nơi Rheb-GTP bật nó.' },
    { q: 'Insulin truyền tín hiệu vào trong như thế nào?', a: 'Insulin gắn <b>thụ thể tyrosine kinase</b>, thụ thể tự phosphoryl hóa, gắn <b>IRS</b>, IRS hoạt hóa <b>PI3K</b>. PI3K chuyển PIP2 thành <b>PIP3</b> ở màng, PIP3 kéo <b>Akt</b> về màng để được hoạt hóa. <b>PTEN</b> làm ngược lại (PIP3 thành PIP2).' },
    { q: 'AMPK cảm nhận gì?', a: 'AMPK cảm nhận tỉ lệ <b>AMP/ATP</b> (hoặc ADP/ATP) cao, tức là thiếu năng lượng. Khi bật, AMPK phosphoryl hóa <b>TSC2</b> (làm TSC hoạt động mạnh hơn) và phosphoryl hóa trực tiếp <b>Raptor</b>. Cả hai đều tắt mTORC1.' },
    { q: 'mTORC1 và mTORC2 khác nhau ra sao?', a: 'Cùng kinase <b>mTOR</b> nhưng khác protein đi kèm: mTORC1 có <b>Raptor</b>, mTORC2 có <b>Rictor</b>. mTORC1 điều khiển tăng trưởng (dịch mã, ribosome, autophagy) và <b>nhạy rapamycin</b>. mTORC2 hoạt hóa Akt (Ser473) và tương đối <b>không nhạy rapamycin</b> khi dùng ngắn hạn.' },
    { q: 'Autophagy là gì?', a: '"Tự thực": tế bào bọc một phần tế bào chất (protein, bào quan hỏng) vào <b>túi màng kép</b> (autophagosome), rồi dung hợp với lysosome để tiêu hóa và tái sử dụng nguyên liệu. Được khởi động bởi <b>ULK1</b>. mTORC1 bật thì phosphoryl hóa ULK1 và chặn autophagy.' },
  ],

  steps: [
    { title: 'Toàn cảnh: hai đầu vào, một công tắc', text: '<b>mTORC1</b> (khối xanh ngọc) nằm giữa hai nhánh. Bên trái là nhánh <b>yếu tố tăng trưởng</b> (insulin → PI3K → Akt ⊣ TSC). Bên dưới là nhánh <b>dinh dưỡng</b> (amino acid → Rag trên lysosome). Bên phải là các <b>đầu ra</b> (S6K, 4E-BP1, ULK1). Các hạt sáng chạy dọc mũi tên cho biết đường nào đang truyền tín hiệu. Đọc dòng kết quả bên dưới để thấy chuỗi lý do.' },
    { title: 'Rheb-GTP là "chìa khóa" bật mTORC1; TSC là phanh', text: '<b>Rheb</b> là GTPase nhỏ gắn trên màng lysosome. <b>Rheb-GTP</b> (chấm vàng) gắn trực tiếp vào mTOR và bật kinase. <b>TSC1–TSC2</b> (cam) là <b>GAP</b>: khi TSC hoạt động, Rheb thủy phân GTP thành GDP (chấm xám), mTORC1 tắt. Vậy muốn bật mTORC1 thì phải <b>ức chế TSC</b>. Tắt <b>Insulin</b> để thấy TSC bật và Rheb chuyển sang GDP.' },
    { title: 'Nhánh tăng trưởng: insulin → PI3K → Akt ⊣ TSC2', text: 'Insulin gắn <b>thụ thể tyrosine kinase</b> ở màng sinh chất. Thụ thể phosphoryl hóa <b>IRS-1</b>, IRS-1 hoạt hóa <b>PI3K</b>, PI3K tạo <b>PIP3</b> (chấm sáng trong màng), PIP3 kéo <b>Akt</b> về màng để được hoạt hóa. <b>Akt phosphoryl hóa TSC2</b>, làm TSC rời khỏi lysosome và mất tác dụng GAP. Kết quả: phanh được nhả, Rheb giữ GTP. Đây là chuỗi <b>ức chế kép</b>: Akt ⊣ TSC ⊣ Rheb, nên Akt gián tiếp <b>bật</b> mTORC1.' },
    { title: 'Nhánh dinh dưỡng: amino acid → Rag → mTORC1 về lysosome', text: 'Khi có <b>amino acid</b> (các hạt màu, trong lysosome và tế bào chất), heterodimer <b>Rag</b> chuyển sang dạng hoạt động (<b>RagA/B-GTP</b> và RagC/D-GDP). Rag bám <b>Raptor</b> và kéo mTORC1 về <b>bề mặt lysosome</b>, đến gần Rheb. Tắt <b>Amino acid</b>: mTORC1 trôi ra tế bào chất, <b>không gặp Rheb</b>, nên tắt dù insulin rất nhiều. Đây là cổng <b>VÀ</b>: Rag lo <b>vị trí</b>, Rheb lo <b>kích hoạt</b>.' },
    { title: 'Năng lượng thấp và stress: AMPK bật TSC2', text: 'Khi ATP giảm và AMP tăng, <b>AMPK</b> được bật. AMPK phosphoryl hóa <b>TSC2</b> ở vị trí khác với Akt, nhưng làm TSC <b>hoạt động mạnh hơn</b>, nên Rheb chuyển sang GDP. AMPK còn phosphoryl hóa trực tiếp <b>Raptor</b> (⊣ đỏ), nên vẫn hãm được mTORC1 kể cả khi TSC hỏng. <b>Thiếu oxy</b> (qua REDD1) và <b>tổn thương DNA</b> (qua p53) cũng hội tụ về TSC. Bật <b>Năng lượng thấp</b>: mTORC1 tắt dù có insulin và amino acid.' },
    { title: 'Đầu ra ①: S6K và 4E-BP1, tăng dịch mã', text: 'mTORC1 bật thì phosphoryl hóa hai đích chính: <b>S6K</b> (được hoạt hóa, phosphoryl hóa protein ribosome S6 và các yếu tố dịch mã) và <b>4E-BP1</b> (bị bất hoạt). Bình thường 4E-BP1 <b>giữ chặt eIF4E</b>. Khi bị phosphoryl hóa, 4E-BP1 <b>nhả eIF4E</b>, eIF4E đến gắn <b>cap 5′</b> của mRNA, và dịch mã phụ thuộc cap bắt đầu (nối với bài Dịch mã). Tắt một đầu vào bất kỳ để thấy 4E-BP1 bắt lại eIF4E.' },
    { title: 'Đầu ra ②: tạo ribosome, Pol III, và chặn autophagy', text: 'mTORC1 còn kích thích <b>tạo ribosome</b>: tăng phiên mã rRNA (Pol I) và <b>tRNA, rRNA 5S do Pol III</b> (bằng cách ức chế Maf1, chất kìm Pol III), và tổng hợp lipid (SREBP). Đồng thời mTORC1 <b>phosphoryl hóa ULK1</b> để tắt nó, nên <b>autophagy bị chặn</b>. Khi mTORC1 tắt (thử tắt Amino acid), ULK1 được giải phóng, <b>autophagosome</b> (túi màng kép) hình thành và bọc lấy thành phần tế bào chất để tái chế.' },
    { title: 'Rapamycin: FKBP12 + rapamycin bịt mTOR', text: '<b>Rapamycin</b> (sirolimus) đi vào tế bào, gắn protein <b>FKBP12</b>. Phức hợp FKBP12–rapamycin gắn vào vùng <b>FRB</b> của mTOR, <b>cản đích đi vào vị trí hoạt động</b> của mTORC1 (ức chế dị lập thể, không phải cạnh tranh ATP). Bật <b>💊 Rapamycin</b>: dù đủ insulin và amino acid, mTORC1 vẫn tắt. mTORC2 tương đối không nhạy khi dùng ngắn hạn. Ứng dụng: chống thải ghép, stent phủ thuốc, everolimus trị u trong xơ cứng củ.' },
    { title: 'Đột biến TSC (xơ cứng củ): phanh bị hỏng', text: 'Bật <b>💥 Đột biến TSC</b> và tắt <b>Insulin</b>: TSC không còn là GAP, nên Rheb <b>luôn mang GTP</b>, mTORC1 <b>luôn bật</b> dù không có tín hiệu tăng trưởng. Tế bào lớn và tăng sinh, tạo <b>hamartoma</b>. Để ý: mTORC1 <b>vẫn cần amino acid</b> (tắt Amino acid thì vẫn tắt). Còn năng lượng thấp chỉ hãm được <b>một phần</b> qua AMPK ⊣ Raptor. Điều trị: <b>everolimus</b>/sirolimus (họ rapamycin).' },
  ],

  application: `<ul>
  <li><b>Thuốc ức chế miễn dịch:</b> <b>sirolimus</b> (rapamycin) chống thải ghép thận, vì tế bào T cần mTORC1 để tăng sinh sau khi được IL-2 kích thích.</li>
  <li><b>Stent mạch vành phủ thuốc</b> (sirolimus, everolimus): ngăn tế bào cơ trơn tăng sinh gây tái hẹp.</li>
  <li><b>Ung thư:</b> everolimus, temsirolimus dùng cho ung thư thận, u thần kinh nội tiết, ung thư vú (cùng liệu pháp nội tiết). Nhiều khối u có PI3K đột biến hoặc mất PTEN nên mTORC1 bị bật liên tục.</li>
  <li><b>Xơ cứng củ:</b> everolimus làm nhỏ u SEGA ở não, u mạch cơ mỡ ở thận, và giảm cơn động kinh.</li>
  <li><b>Chuyển hóa:</b> metformin hoạt hóa AMPK, gián tiếp hãm mTORC1. Ăn giàu leucine và tập kháng lực bật mTORC1 ở cơ, tăng tổng hợp protein cơ.</li>
  <li><b>Lão hóa:</b> ức chế mTORC1 (rapamycin, hạn chế calo) kéo dài tuổi thọ ở nấm men, giun, ruồi, chuột. Một phần là nhờ tăng autophagy.</li></ul>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th>Thành phần</th><th>Loại</th><th>Tác động lên mTORC1</th><th>Cơ chế</th></tr>
  <tr><td><b>Insulin / IGF-1</b></td><td>Yếu tố tăng trưởng</td><td>Bật (gián tiếp)</td><td>PI3K → Akt ⊣ TSC2 → Rheb giữ GTP</td></tr>
  <tr><td><b>Akt</b></td><td>Kinase</td><td>Bật (gián tiếp)</td><td>Phosphoryl hóa TSC2, làm TSC mất tác dụng</td></tr>
  <tr><td><b>TSC1/TSC2</b></td><td>GAP của Rheb</td><td><b>Tắt</b></td><td>Rheb-GTP thành Rheb-GDP</td></tr>
  <tr><td><b>Rheb</b></td><td>GTPase nhỏ (lysosome)</td><td><b>Bật trực tiếp</b> (dạng GTP)</td><td>Gắn và hoạt hóa kinase mTOR</td></tr>
  <tr><td><b>Rag</b> (A/B + C/D)</td><td>GTPase nhỏ (lysosome)</td><td>Cần cho bật (định vị)</td><td>Amino acid → Rag hoạt động → kéo Raptor về lysosome</td></tr>
  <tr><td><b>AMPK</b></td><td>Kinase cảm biến năng lượng</td><td><b>Tắt</b></td><td>Hoạt hóa TSC2 + phosphoryl hóa Raptor</td></tr>
  <tr><td><b>REDD1</b> (thiếu oxy), <b>p53</b></td><td>Tín hiệu stress</td><td>Tắt</td><td>Hội tụ về TSC</td></tr>
  <tr><td><b>Rapamycin–FKBP12</b></td><td>Thuốc</td><td><b>Tắt</b></td><td>Gắn vùng FRB của mTOR (dị lập thể)</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th>Đích của mTORC1</th><th>Phosphoryl hóa làm nó…</th><th>Hệ quả</th></tr>
  <tr><td><b>S6K</b></td><td><b>Hoạt hóa</b></td><td>Phosphoryl hóa protein ribosome S6, eIF4B; tăng dịch mã</td></tr>
  <tr><td><b>4E-BP1</b></td><td><b>Bất hoạt</b> (nhả eIF4E)</td><td>eIF4E tự do gắn cap, dịch mã phụ thuộc cap tăng</td></tr>
  <tr><td><b>ULK1</b></td><td><b>Bất hoạt</b></td><td>Autophagy bị chặn</td></tr>
  <tr><td><b>Maf1</b> (kìm Pol III)</td><td><b>Bất hoạt</b></td><td>Pol III phiên mã tRNA, rRNA 5S nhiều hơn</td></tr>
  <tr><td>TFEB</td><td>Giữ ở tế bào chất</td><td>Giảm tạo lysosome mới</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>mTORC1</th><th>mTORC2</th></tr>
  <tr><td>Protein đặc trưng</td><td><b>Raptor</b></td><td><b>Rictor</b></td></tr>
  <tr><td>Rapamycin (ngắn hạn)</td><td><b>Nhạy</b></td><td>Tương đối kháng</td></tr>
  <tr><td>Đầu vào</td><td>Amino acid, insulin (qua TSC/Rheb), năng lượng, oxy</td><td>Yếu tố tăng trưởng (PI3K)</td></tr>
  <tr><td>Đích chính</td><td>S6K, 4E-BP1, ULK1</td><td>Akt (Ser473), SGK, PKC</td></tr>
  </table></div>
  <div class="box info">ℹ️ <b>Đọc mũi tên cho đúng:</b> trên slide, "thụ thể yếu tố tăng trưởng ⊣ TSC1/TSC2" là cách viết gọn. Đúng ra chuỗi là thụ thể → IRS → PI3K → Akt, và chính <b>Akt</b> phosphoryl hóa TSC2. Hai lần ức chế liên tiếp (Akt ⊣ TSC ⊣ Rheb) cho ra hiệu ứng <b>bật</b>.</div>`,

  traps: [
    { trap: '"TSC1/2 hoạt hóa Rheb."', truth: 'Ngược lại. TSC1/2 là <b>GAP</b>: nó làm Rheb thủy phân GTP thành GDP, tức là <b>tắt</b> Rheb. TSC là phanh của mTORC1.' },
    { trap: '"Insulin hoạt hóa TSC nên mTORC1 bật."', truth: 'Insulin (qua Akt) <b>ức chế</b> TSC2. Ức chế cái phanh nên Rheb giữ GTP, mTORC1 bật. Logic <b>ức chế kép</b>.' },
    { trap: '"Có insulin là đủ để bật mTORC1."', truth: 'Không. Cần cả <b>amino acid</b> để Rag kéo mTORC1 về lysosome, nơi có Rheb. Không có amino acid thì mTORC1 không gặp Rheb, nên vẫn tắt. Đây là cổng <b>VÀ</b>.' },
    { trap: '"AMPK là kinase hoạt hóa mTORC1 khi thiếu năng lượng."', truth: 'AMPK <b>tắt</b> mTORC1: nó hoạt hóa TSC2 và phosphoryl hóa Raptor. Thiếu năng lượng thì tế bào phải ngừng tổng hợp.' },
    { trap: '"mTORC1 phosphoryl hóa 4E-BP1 để 4E-BP1 gắn chặt eIF4E."', truth: 'Ngược lại. 4E-BP1 <b>không</b> bị phosphoryl hóa thì giữ eIF4E. Bị mTORC1 phosphoryl hóa thì <b>nhả</b> eIF4E, nên dịch mã phụ thuộc cap tăng.' },
    { trap: '"mTORC1 bật thì autophagy tăng."', truth: 'mTORC1 bật thì <b>phosphoryl hóa và tắt ULK1</b>, autophagy <b>giảm</b>. Autophagy tăng khi mTORC1 tắt (đói, rapamycin).' },
    { trap: '"Rapamycin cạnh tranh với ATP ở vị trí hoạt động của mTOR."', truth: 'Rapamycin trước hết gắn <b>FKBP12</b>, rồi phức hợp này gắn vùng <b>FRB</b> của mTOR, ức chế <b>dị lập thể</b>. Chất ức chế cạnh tranh ATP (như Torin1) là thế hệ khác, ức chế cả mTORC2.' },
    { trap: '"Đột biến TSC làm mTORC1 tắt, gây xơ cứng củ."', truth: 'Mất TSC là <b>mất phanh</b>: Rheb luôn mang GTP, mTORC1 <b>luôn bật</b>, gây u lành (hamartoma). Vì vậy điều trị bằng chất ức chế mTOR (everolimus).' },
  ],

  quiz: [
    { q: 'TSC1/TSC2 tác động lên Rheb như thế nào?', ops: ['Là GEF, chuyển Rheb-GDP thành Rheb-GTP', 'Là GAP, làm Rheb thủy phân GTP thành GDP', 'Phosphoryl hóa Rheb', 'Kéo Rheb về lysosome'], a: 1, e: 'TSC2 có vùng GAP: kích thích Rheb thủy phân GTP, nên Rheb tắt, mTORC1 tắt. Phương án "GEF" là cái bẫy: GEF làm ngược lại (bật).' },
    { q: 'Tế bào có đủ insulin nhưng bị bỏ đói amino acid. mTORC1:', ops: ['Tắt, vì Rag không kéo mTORC1 về lysosome nên nó không gặp Rheb-GTP', 'Bật, vì Akt đã ức chế TSC', 'Bật một nửa', 'Tắt, vì AMPK luôn bật khi thiếu amino acid'], a: 0, e: 'Rheb-GTP có thể sẵn sàng nhưng mTORC1 cần Rag (do amino acid hoạt hóa) để đến lysosome. Thiếu một điều kiện của cổng VÀ thì tắt. Thiếu amino acid tác động qua Rag, không phải chủ yếu qua AMPK.' },
    { q: 'Khi tỉ lệ AMP/ATP tăng cao, chuỗi nào đúng?', ops: ['AMPK ⊣ TSC2 → Rheb-GTP → mTORC1 bật', 'AMPK → Akt → mTORC1 bật', 'AMPK → Rag → mTORC1 tắt', 'AMPK → TSC2 → Rheb-GDP → mTORC1 tắt → autophagy tăng'], a: 3, e: 'AMPK hoạt hóa TSC2 (và phosphoryl hóa Raptor), Rheb chuyển sang GDP, mTORC1 tắt, ULK1 được giải phóng nên autophagy tăng. Phương án đầu nhầm AMPK với Akt (Akt mới là kẻ ức chế TSC2).' },
    { q: 'mTORC1 thúc đẩy dịch mã phụ thuộc cap chủ yếu bằng cách:', ops: ['Phosphoryl hóa eIF4E trực tiếp để nó gắn cap', 'Phosphoryl hóa 4E-BP1, làm 4E-BP1 nhả eIF4E', 'Phân hủy mRNA', 'Hoạt hóa ULK1'], a: 1, e: '4E-BP1 bị phosphoryl hóa thì nhả eIF4E, eIF4E gắn cap 5′ và tuyển eIF4G. ULK1 là đích autophagy và bị mTORC1 tắt, không phải bật.' },
    { q: 'Bệnh nhân xơ cứng củ mất chức năng TSC2. Thuốc hợp lý nhất là:', ops: ['Insulin', 'Chất hoạt hóa Akt', 'Everolimus (ức chế mTORC1)', 'Leucine liều cao'], a: 2, e: 'Mất TSC2 làm Rheb luôn mang GTP và mTORC1 luôn bật, nên cần chặn ở hạ nguồn bằng everolimus/sirolimus. Insulin, chất hoạt hóa Akt và leucine đều bật mTORC1 thêm.' },
    { q: 'Rapamycin ức chế mTORC1 bằng cách:', ops: ['Gắn FKBP12; phức hợp FKBP12–rapamycin gắn vùng FRB của mTOR', 'Gắn trực tiếp vị trí ATP của mTOR', 'Hoạt hóa TSC2', 'Ức chế Rag'], a: 0, e: 'Cơ chế dị lập thể qua FKBP12 và FRB. Chất cạnh tranh ATP (Torin) là nhóm khác; rapamycin không cần TSC.' },
    { q: 'Phát biểu nào về mTORC1 là SAI?', ops: ['Là serine/threonine kinase chứa Raptor', 'Được bật bởi Rheb-GTP trên lysosome', 'Khi bật thì kích thích autophagy qua ULK1', 'Kích thích phiên mã Pol III bằng cách ức chế Maf1'], a: 2, e: 'mTORC1 bật thì phosphoryl hóa và TẮT ULK1, nên autophagy bị chặn. Các ý còn lại đúng: chứa Raptor, cần Rheb-GTP, ức chế Maf1 nên Pol III được nhả.' },
  ],

  recall: [
    'Vẽ tay lại sơ đồ: insulin → thụ thể → IRS → PI3K → Akt ⊣ TSC1/2 ⊣ Rheb → mTORC1; amino acid → Rag → lysosome; AMPK → TSC2 và AMPK ⊣ Raptor; rapamycin–FKBP12 ⊣ mTORC1; đầu ra S6K, 4E-BP1/eIF4E, Pol III, ULK1. Dùng → cho hoạt hóa, ⊣ cho ức chế.',
    'Lập bảng 6 tình huống (đủ cả; thiếu amino acid; thiếu insulin; năng lượng thấp; mất TSC + không insulin; rapamycin) và ghi mTORC1 BẬT/TẮT kèm lý do một dòng.',
    'Giải thích vì sao mất TSC gây u lành, và vì sao everolimus (không phải insulin hay leucine) là thuốc phù hợp.',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const cl = (x) => Math.max(0, Math.min(1, x));
    const ACT = 0x30d158, INH = 0xff453a, GTP = 0xffd60a, GDP = 0x8e8e93, MTOR = 0x2bb3a3, TSCC = 0xff8a65;
    let aa = true, ins = true, lowE = false, tscMut = false, rapa = false, cur = 0, tt = 0;

    // ---- logic ----
    const st = () => {
      const tscOn = !tscMut && (lowE || !ins);
      const rheb = !tscOn;
      const docked = aa;
      const raptorP = lowE;
      let lvl = docked && rheb && !rapa ? (raptorP ? (tscMut ? 0.35 : 0) : 1) : 0;
      return { tscOn, rheb, docked, raptorP, lvl, on: lvl > 0.5 };
    };

    // ---- membranes / compartments ----
    const pmG = api.group();
    const pm = api.box(26, 0.7, 4, 0xd8b26e, pmG, { opacity: 0.55 }); pm.position.set(0, 6.4, -2);
    api.box(26, 0.08, 4.02, 0xf2e2b8, pmG, { opacity: 0.7 }).position.set(0, 6.05, -2);
    L.add('pmL', 'màng sinh chất', [-9.6, 6.4, 0], pmG, 'dim');
    L.add('outL', 'ngoài tế bào', [-8.6, 8.2, 0], pmG, 'dim');
    L.add('cytL', 'tế bào chất', [-8.6, 3.2, 0], pmG, 'dim');
    const LYS = V(3, -3.7, -0.6), LR = 3.0;
    const lys = api.sphere(LR, 0xd8b26e, undefined, { opacity: 0.32, depthWrite: false }); lys.position.copy(LYS);
    const lysRim = api.torus(LR, 0.07, 0xe9cf95, undefined, { opacity: 0.7 }); lysRim.position.copy(LYS);
    L.add('lysL', 'lysosome', [LYS.x - 1.6, LYS.y - 2.2, 1.5], undefined, 'tag');

    // ---- insulin receptor branch ----
    const insG = api.group();
    const rcL = api.blob(0.5, 0x5b8def, insG, { scale: [0.6, 2.2, 0.7], seed: 3 }); rcL.position.set(-6.45, 6.3, 0.3);
    const rcR = api.blob(0.5, 0x5b8def, insG, { scale: [0.6, 2.2, 0.7], seed: 4 }); rcR.position.set(-5.55, 6.3, 0.3);
    const rcP = [api.sphere(0.13, 0xff3b30, insG), api.sphere(0.13, 0xff3b30, insG)]; rcP[0].position.set(-6.85, 5.3, 0.6); rcP[1].position.set(-5.15, 5.3, 0.6);
    const insulin = [0, 1, 2].map(i => { const m = api.blob(0.26, 0xffe08a, insG, { seed: 10 + i }); return m; });
    const irs = api.blob(0.42, 0x64d2ff, insG, { seed: 21 }); irs.position.set(-6.0, 4.2, 0.4);
    const pi3k = api.blob(0.5, 0xbf5af2, insG, { seed: 22, scale: [1.2, 0.85, 0.9] }); pi3k.position.set(-4.1, 5.2, 0.4);
    const pip3 = [0, 1, 2, 3].map(i => { const m = api.sphere(0.12, 0xfff3b0, insG, { emissive: 0xffd60a, emissiveIntensity: 0.9 }); m.position.set(-3.6 + i * 0.45, 6.02, 0.55); return m; });
    const akt = api.blob(0.45, 0x0a84ff, insG, { seed: 23 }); akt.position.set(-2.6, 4.9, 0.4);
    L.add('insL', 'insulin', [-6, 8.6, 0], insG, 'tag');
    L.add('rcL', 'thụ thể insulin (RTK)', [-8.2, 7.7, 0.3], insG, 'tag');
    L.add('irsL', 'IRS-1', [-6.9, 3.9, 0], insG, 'tag');
    L.add('pi3kL', 'PI3K', [-4.1, 4.4, 0.4], insG, 'tag');
    L.add('pipL', 'PIP2 → PIP3', [-2.9, 7.0, 0.5], insG, 'dim');
    L.add('aktL', 'Akt', [-2.6, 4.1, 0.4], insG, 'tag');

    // ---- TSC ----
    const tscG = api.group(); tscG.position.set(-1.4, 1.6, 0.4);
    const tsc1 = api.blob(0.5, TSCC, tscG, { seed: 31 }); tsc1.position.set(-0.45, 0, 0);
    const tsc2 = api.blob(0.6, TSCC, tscG, { seed: 32 }); tsc2.position.set(0.5, -0.1, 0);
    const tscP = api.sphere(0.14, 0xff3b30, tscG); tscP.position.set(0.55, 0.62, 0.3);
    const tscA = api.sphere(0.14, 0xff3b30, tscG); tscA.position.set(0.95, -0.55, 0.35);
    const crack = api.group(tscG);
    api.box(1.6, 0.12, 0.12, INH, crack).rotation.z = 0.8; api.box(1.6, 0.12, 0.12, INH, crack).rotation.z = -0.8; crack.position.set(0.5, -0.1, 0.75);
    L.add('tscL', 'TSC1–TSC2 (GAP của Rheb)', [0, 1.05, 0], tscG, 'tag');
    L.add('tscS', '', [0, -1.0, 0], tscG, 'dim');
    L.add('tscX', '💥 TSC mất chức năng', [0.2, -1.6, 0], tscG, 'warn');
    L.add('reddL', 'thiếu O₂ (REDD1), tổn thương DNA (p53) → TSC', [-1.2, -2.2, 0], tscG, 'dim');

    // ---- AMPK ----
    const ampkG = api.group(); ampkG.position.set(-5.4, -1.8, 0.4);
    const ampk = api.blob(0.6, 0x8e8e93, ampkG, { seed: 41 });
    const amps = [0, 1, 2].map(i => { const m = api.sphere(0.14, 0xff9f0a, ampkG); m.position.set(-0.9 + i * 0.32, -0.9, 0.3); return m; });
    const atps = [0, 1, 2].map(i => { const m = api.sphere(0.14, GTP, ampkG); m.position.set(0.3 + i * 0.32, -0.95, 0.3); return m; });
    L.add('ampkL', 'AMPK', [0, 0.95, 0], ampkG, 'tag');
    L.add('ampS', '', [0, -1.55, 0], ampkG, 'dim');

    // ---- lysosome surface: Ragulator/Rag, Rheb ----
    const ragG = api.group(); ragG.position.set(LYS.x - 1.2, LYS.y + LR - 0.05, 0.4);
    const ragul = api.blob(0.4, 0xa1887f, ragG, { scale: [1.6, 0.5, 0.8], seed: 51 }); ragul.position.set(0, 0, 0);
    const ragA = api.blob(0.36, 0x9ad0ff, ragG, { seed: 52 }); ragA.position.set(-0.35, 0.5, 0);
    const ragC = api.blob(0.36, 0x7ee0c3, ragG, { seed: 53 }); ragC.position.set(0.35, 0.5, 0);
    const ragAn = api.sphere(0.13, GTP, ragG); ragAn.position.set(-0.45, 0.62, 0.38);
    const ragCn = api.sphere(0.13, GDP, ragG); ragCn.position.set(0.45, 0.62, 0.38);
    L.add('ragL', 'Rag (A/B·C/D)', [-1.7, -0.25, 0.3], ragG, 'tag');
    const rhebG = api.group(); rhebG.position.set(LYS.x + 1.55, LYS.y + LR - 0.35, 0.5);
    const rheb = api.blob(0.36, 0xffb3c7, rhebG, { seed: 61 });
    const rhebN = api.sphere(0.15, GTP, rhebG); rhebN.position.set(0.25, 0.25, 0.32);
    api.stick(V(0, -0.3, 0), V(-0.1, -0.75, 0), 0.04, 0xffb3c7, rhebG);
    L.add('rhebL', 'Rheb', [1.0, 0.2, 0.2], rhebG, 'tag');
    L.add('rhebS', '', [1.15, -0.45, 0.2], rhebG, 'dim');
    // amino acids
    const aaCol = [0xff6b6b, 0x9be15d, 0x5ac8fa, 0xffd60a, 0xbf5af2, 0xff9f0a];
    const aas = [];
    for (let i = 0; i < 22; i++) {
      const inside = i < 13;
      const m = api.sphere(0.12, aaCol[i % 6], undefined, { emissive: aaCol[i % 6], emissiveIntensity: 0.35 });
      m.userData = { inside, ph: i * 1.7, r: inside ? 0.8 + (i % 4) * 0.5 : 0, ax: i * 0.9 };
      aas.push(m);
    }
    L.add('aaL', 'amino acid', [LYS.x + 0.2, LYS.y - 0.4, 1.2], undefined, 'tag');

    // ---- mTORC1 ----
    const mG = api.group();
    const mtor = api.blob(0.8, MTOR, mG, { scale: [1.5, 0.95, 1.0], seed: 71, mat: { emissive: MTOR, emissiveIntensity: 0 } });
    const raptor = api.blob(0.5, 0x7ee0c3, mG, { seed: 72, scale: [1.2, 0.8, 0.9] }); raptor.position.set(-0.95, -0.75, 0.15);
    const lst8 = api.blob(0.28, 0x5ac8a8, mG, { seed: 73 }); lst8.position.set(0.95, 0.65, 0.2);
    const frb = api.sphere(0.2, 0x1e8c80, mG); frb.position.set(1.1, -0.1, 0.75);
    const rapP = api.sphere(0.14, 0xff3b30, mG); rapP.position.set(-1.3, -0.4, 0.75);
    const DOCK = V(LYS.x + 0.2, LYS.y + LR + 1.25, 0.5), FREE = V(7.4, 4.2, 0.5);
    mG.position.copy(DOCK);
    L.add('mL', 'mTORC1', [0, 1.25, 0.3], mG, 'big');
    L.add('rapL', 'Raptor', [-1.9, -1.0, 0.4], mG, 'dim');
    L.add('frbL', 'vùng FRB', [1.9, -0.45, 0.6], mG, 'dim');
    L.add('rapPL', 'P (AMPK)', [-2.05, -0.25, 0.6], mG, 'warn');
    // rapamycin + FKBP12
    const fkG = api.group();
    const fk = api.blob(0.36, 0xff9fdb, fkG, { seed: 81 });
    const pill = api.group(fkG); pill.position.set(0.35, 0.25, 0.25);
    api.sphere(0.14, 0xffffff, pill).position.x = -0.1; api.sphere(0.14, 0xff375f, pill).position.x = 0.1; api.cylinder(0.14, 0.14, 0.2, 0xff375f, pill).rotation.z = Math.PI / 2;
    L.add('fkL', '💊 FKBP12–rapamycin', [0.5, 0.75, 0.2], fkG, 'warn');

    // ---- outputs ----
    const oG = api.group();
    const s6k = api.blob(0.45, 0x30d158, oG, { seed: 91 }); s6k.position.set(9.6, 2.3, 0.4);
    const s6kP = api.sphere(0.13, 0xff3b30, oG); s6kP.position.set(9.95, 2.75, 0.75);
    const ribo = api.group(oG); ribo.position.set(11.6, 2.6, 0.3);
    api.blob(0.42, C.ribosome, ribo, { seed: 92, scale: [1.3, 0.7, 1] }).position.y = -0.2; api.blob(0.5, 0x8cc4ec, ribo, { seed: 93, scale: [1.3, 0.85, 1] }).position.y = 0.42;
    const s6P = api.sphere(0.11, 0xff3b30, ribo); s6P.position.set(0.55, -0.35, 0.5);
    const bp1 = api.blob(0.3, 0xff9fdb, oG, { seed: 94 });
    const bpP = [api.sphere(0.1, 0xff3b30, bp1), api.sphere(0.1, 0xff3b30, bp1)]; bpP[0].position.set(0.25, 0.25, 0.2); bpP[1].position.set(-0.2, 0.3, 0.2);
    const e4e = api.blob(0.34, 0xff79c6, oG, { seed: 95 });
    const mrna = api.tube([V(9.4, -1.5, 0.3), V(10.6, -1.35, 0.3), V(11.8, -1.6, 0.3), V(13.0, -1.4, 0.3)], 0.07, C.rna, oG);
    const capM = api.sphere(0.2, 0x8e8e93, oG); capM.position.set(9.35, -1.5, 0.3);
    const tRibo = api.group(oG);
    api.blob(0.36, C.ribosome, tRibo, { seed: 96, scale: [1.2, 0.6, 1] }).position.y = -0.15; api.blob(0.42, 0x8cc4ec, tRibo, { seed: 97, scale: [1.2, 0.8, 1] }).position.y = 0.38;
    const ulk = api.blob(0.45, 0xffb340, oG, { seed: 98, mat: { emissive: 0xffb340, emissiveIntensity: 0 } }); ulk.position.set(9.2, -4.2, 0.4);
    const ulkP = api.sphere(0.13, 0xff3b30, oG); ulkP.position.set(9.55, -3.75, 0.75);
    const phag = api.group(oG); phag.position.set(11.6, -4.9, 0.2);
    const cupGeo = (r) => new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const cupO = new THREE.Mesh(cupGeo(1.0), api.mat(0xb388ff, { opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })); phag.add(cupO);
    const cupI = new THREE.Mesh(cupGeo(0.86), api.mat(0xd1b3ff, { opacity: 0.45, side: THREE.DoubleSide, depthWrite: false })); phag.add(cupI);
    cupO.rotation.z = cupI.rotation.z = 2.4;
    const junk = [0, 1, 2].map(i => { const m = api.blob(0.18, [0x9b6dd6, 0xff6b6b, 0x8e8e93][i], phag, { seed: 100 + i }); m.position.set(-0.25 + i * 0.25, -0.1 + (i % 2) * 0.25, 0); return m; });
    const bio = [0, 1, 2].map(i => { const g = api.group(oG); api.blob(0.18, C.ribosome, g, { seed: 110 + i, scale: [1.2, 0.6, 1] }).position.y = -0.08; api.blob(0.22, 0x8cc4ec, g, { seed: 113 + i, scale: [1.2, 0.8, 1] }).position.y = 0.16; return g; });
    const pol3 = api.blob(0.38, 0x64d2ff, oG, { seed: 120 }); pol3.position.set(12.2, 0.6, 0.3);
    const maf1 = api.blob(0.22, 0x8e8e93, oG, { seed: 121 });
    L.add('s6kL', 'S6K', [9.6, 3.05, 0.4], oG, 'tag');
    L.add('riboL', 'ribosome (protein S6)', [11.6, 3.55, 0.3], oG, 'dim');
    L.add('bpL', '4E-BP1', [0, 0.6, 0], bp1, 'tag');
    L.add('e4eL', 'eIF4E', [0, -0.62, 0], e4e, 'tag');
    L.add('capL', 'cap 5′ mRNA', [9.0, -2.15, 0.3], oG, 'dim');
    L.add('ulkL', 'ULK1', [9.2, -3.4, 0.4], oG, 'tag');
    L.add('phagL', 'autophagosome', [11.6, -3.5, 0.3], oG, 'tag');
    L.add('pol3L', 'Pol III: tRNA, 5S rRNA', [12.6, 1.35, 0.3], oG, 'dim');
    L.add('maf1L', 'Maf1', [0, -0.42, 0], maf1, 'dim');
    L.add('bioL', 'tạo ribosome', [13.3, 2.0, 0.3], oG, 'dim');

    // ---- links (arrow / ⊣) with travelling pulses ----
    const links = [];
    const UP = V(0, 1, 0), dv = V(0, 0, 0), pa = V(0, 0, 0), pb = V(0, 0, 0);
    function link(color, kind) {
      const g = api.group();
      const shaft = api.stick(V(0, 0, 0), V(1, 0, 0), 0.05, color, g, { opacity: 0.9 });
      const head = kind === 'act' ? api.cylinder(0, 0.17, 0.36, color, g, { opacity: 0.9 }) : api.box(0.55, 0.1, 0.12, color, g, { opacity: 0.9 });
      const pulses = [0, 1].map(() => api.sphere(0.11, color, g, { emissive: color, emissiveIntensity: 1.1 }));
      const o = { g, shaft, head, pulses, kind, a: V(0, 0, 0), b: V(0, 0, 0), on: 1, show: 1 };
      o.set = (a, b, ma = 0.55, mb = 0.6) => {
        dv.subVectors(b, a); const Ln = dv.length(); dv.normalize();
        pa.copy(a).addScaledVector(dv, ma); pb.copy(b).addScaledVector(dv, -mb);
        o.a.copy(pa); o.b.copy(pb);
        api.setStick(shaft, pa, pb);
        head.position.copy(pb); head.quaternion.setFromUnitVectors(UP, dv);
        if (kind === 'act') head.position.addScaledVector(dv, -0.1);
        return Ln;
      };
      links.push(o); return o;
    }
    const lk = {
      rIrs: link(ACT, 'act'), irsPi: link(ACT, 'act'), piAkt: link(ACT, 'act'), aktTsc: link(INH, 'inh'),
      tscRheb: link(INH, 'inh'), ampTsc: link(ACT, 'act'), ampRap: link(INH, 'inh'),
      ragM: link(ACT, 'act'), rhebM: link(ACT, 'act'),
      mS6k: link(ACT, 'act'), mBp: link(INH, 'inh'), mUlk: link(INH, 'inh'), mMaf: link(INH, 'inh'), s6kRibo: link(ACT, 'act'), ulkPhag: link(ACT, 'act'),
    };
    lk.rIrs.set(V(-6, 5.2, 0.4), V(-6, 4.2, 0.4), 0.15, 0.5);
    lk.irsPi.set(V(-6, 4.2, 0.4), V(-4.1, 5.2, 0.4));
    lk.piAkt.set(V(-4.1, 5.2, 0.4), V(-2.6, 4.9, 0.4));
    lk.s6kRibo.set(V(9.6, 2.3, 0.4), V(11.6, 2.6, 0.3), 0.5, 0.7);
    lk.ulkPhag.set(V(9.2, -4.2, 0.4), V(11.6, -4.9, 0.2), 0.5, 1.1);

    // ---- toggles ----
    api.toggle('Amino acid', true, (x) => { aa = x; ctl.setStep(cur); });
    api.toggle('Insulin', true, (x) => { ins = x; ctl.setStep(cur); });
    api.toggle('Năng lượng thấp (AMP cao)', false, (x) => { lowE = x; ctl.setStep(cur); });
    api.toggle('💥 Đột biến TSC', false, (x) => { tscMut = x; ctl.setStep(cur); });
    api.toggle('💊 Rapamycin', false, (x) => { rapa = x; ctl.setStep(cur); });

    const yn = (b) => (b ? '<b style="color:#34c759">✓</b>' : '<b style="color:#ff453a">✗</b>');
    function readout() {
      const s = st();
      const growth = tscMut ? '💥 TSC hỏng → không có GAP → <b>Rheb luôn GTP</b>'
        : lowE ? `Năng lượng thấp → AMPK → TSC2 bật → <b>Rheb-GDP</b>${ins ? ' (thắng cả tín hiệu Akt)' : ''}`
        : ins ? 'Insulin → PI3K → Akt ⊣ TSC2 → <b>Rheb-GTP</b>' : 'Không insulin → Akt tắt → TSC hoạt động → <b>Rheb-GDP</b>';
      const nut = aa ? 'Amino acid → Rag-GTP → <b>mTORC1 về lysosome</b>' : 'Không amino acid → Rag bất hoạt → <b>mTORC1 trôi khỏi lysosome</b>, không gặp Rheb';
      let res;
      if (s.lvl >= 1) res = '<b style="color:#34c759">mTORC1 BẬT</b>: S6K-P, 4E-BP1-P (eIF4E tự do), tạo ribosome, Pol III ↑, ULK1-P (autophagy TẮT)';
      else if (s.lvl > 0) res = '<b style="color:#ff9f0a">mTORC1 YẾU</b>: Rheb-GTP (TSC hỏng) nhưng AMPK phosphoryl hóa Raptor nên hãm một phần';
      else {
        const why = rapa && s.docked && s.rheb ? 'FKBP12–rapamycin bịt vùng FRB' : !s.docked ? 'thiếu amino acid' : !s.rheb ? 'Rheb mang GDP' : 'AMPK ⊣ Raptor';
        res = `<b style="color:#ff453a">mTORC1 TẮT</b> (${why}): 4E-BP1 giữ eIF4E, dịch mã cap giảm; ULK1 tự do, <b>autophagy BẬT</b>`;
      }
      api.readout(`${yn(s.rheb)} ${growth}<br>${yn(s.docked)} ${nut}${rapa ? '<br>💊 Rapamycin + FKBP12 → gắn FRB của mTOR' : ''}<br>→ ${res}`);
    }

    const CAMS = [
      [[2, 0.6, 24], [2, 0.3, 0]],
      [[1.2, 0.4, 14], [1.5, 0, 0]],
      [[-4, 3.6, 13], [-3.6, 3.3, 0]],
      [[3, -0.8, 13], [3, -1.4, 0]],
      [[-2.4, 0, 15], [-2.2, -0.2, 0]],
      [[9.5, 0.6, 12], [10.2, 0.4, 0]],
      [[10, -0.9, 13.5], [10.4, -1.0, 0]],
      [[4.4, 0.8, 10], [3.6, 0.4, 0]],
      [[2, 0.6, 24], [2, 0.3, 0]],
    ];

    // per-frame state that eases toward targets
    const live = { dock: 1, rheb: 1, tsc: 0, lvl: 1, ins: 1, low: 0, rapa: 0, aa: 1 };
    const ease = (k, to, r) => { live[k] += (to - live[k]) * r; };
    const tA = V(0, 0, 0), tB = V(0, 0, 0), cR = new THREE.Color(), cG = new THREE.Color(GTP), cD = new THREE.Color(GDP);
    const setNuc = (m, f) => m.material.color.copy(cD).lerp(cG, f);
    let base = [];

    function frame(dt, t) {
      const s = st(), r = Math.min(1, dt * 2.5);
      ease('dock', s.docked ? 1 : 0, r); ease('rheb', s.rheb ? 1 : 0, r); ease('tsc', s.tscOn ? 1 : 0, r);
      ease('lvl', s.lvl, r); ease('ins', ins ? 1 : 0, r); ease('low', lowE ? 1 : 0, r); ease('rapa', rapa ? 1 : 0, r); ease('aa', aa ? 1 : 0, r);
      // insulin + receptor
      insulin.forEach((m, i) => {
        const u = ((t * 0.35 + i / 3) % 1);
        const bound = i === 0;
        if (bound) m.position.set(-6, 7.35, 0.4); else m.position.set(-7.5 + i * 1.6 + Math.sin(t + i) * 0.3, 10 - u * 2.4, 0.4 + Math.cos(t * 0.7 + i) * 0.3);
        m.visible = live.ins > 0.05; m.scale.setScalar(Math.max(0.01, live.ins));
      });
      rcP.forEach(m => { m.visible = ins; });
      pip3.forEach((m, i) => { m.material.emissiveIntensity = 0.9 * live.ins; m.material.color.setHex(live.ins > 0.5 ? 0xfff3b0 : 0x9e9e9e); });
      akt.position.set(-2.6, 4.9 + 0.5 * live.ins + 0.06 * Math.sin(t * 3) * live.ins, 0.4);
      [irs, pi3k, akt].forEach(m => api.setOpacity(m, 0.35 + 0.65 * live.ins));
      // TSC
      const tscVis = tscMut ? 0.35 : 0.4 + 0.6 * live.tsc;
      api.setOpacity(tsc1, tscVis); api.setOpacity(tsc2, tscVis);
      tsc2.material.emissive.setHex(TSCC); tsc2.material.emissiveIntensity = 0.5 * live.tsc;
      tscP.visible = ins && !lowE && !tscMut; tscA.visible = lowE && !tscMut; tscA.material.color.setHex(0xff9f0a);
      crack.visible = tscMut;
      tscG.position.set(-1.4 + 2.2 * live.tsc * (tscMut ? 0 : 1), 1.6 - 1.2 * live.tsc * (tscMut ? 0 : 1), 0.4);
      // AMPK
      ampk.material.color.copy(cD).lerp(cR.setHex(0xff9f0a), live.low);
      ampk.material.emissive.setHex(0xff9f0a); ampk.material.emissiveIntensity = 0.4 * live.low;
      amps.forEach(m => { m.visible = lowE; }); atps.forEach(m => { m.visible = !lowE; });
      // Rag / Rheb
      setNuc(ragAn, live.aa); ragCn.material.color.setHex(live.aa > 0.5 ? GDP : GTP);
      setNuc(rhebN, live.rheb);
      // amino acids
      aas.forEach((m, i) => {
        const u = m.userData; m.visible = live.aa > 0.05; m.scale.setScalar(Math.max(0.01, live.aa));
        if (u.inside) m.position.set(LYS.x + Math.cos(t * 0.5 + u.ph) * u.r, LYS.y + Math.sin(t * 0.37 + u.ph * 1.3) * u.r * 0.8, LYS.z + Math.sin(t * 0.6 + u.ax) * 0.8);
        else m.position.set(LYS.x - 3.6 + ((i * 1.31) % 8) + Math.sin(t * 0.8 + i) * 0.3, LYS.y + LR + 0.4 + ((i * 0.77) % 2.4) + Math.cos(t * 0.6 + i) * 0.25, 1.2 + Math.sin(i) * 0.6);
      });
      // mTORC1 position + activity
      mG.position.lerpVectors(FREE, DOCK, live.dock);
      mG.position.y += Math.sin(t * 1.3) * 0.08 * (1 - live.dock);
      mtor.material.emissiveIntensity = 0.9 * live.lvl * (0.75 + 0.25 * Math.sin(t * 4));
      rapP.visible = lowE;
      L.set('mL', 'mTORC1 · ' + (s.lvl >= 1 ? 'BẬT' : s.lvl > 0 ? 'YẾU' : 'TẮT'));
      L.get('mL').element.className = 'lbl ' + (s.lvl >= 1 ? 'good' : s.lvl > 0 ? 'big' : 'warn');
      // rapamycin
      fkG.visible = live.rapa > 0.03;
      tA.set(mG.position.x + 1.55, mG.position.y - 0.15, mG.position.z + 0.95);
      tB.set(mG.position.x + 3.6, mG.position.y + 1.6, 1.2);
      fkG.position.lerpVectors(tB, tA, live.rapa); fkG.scale.setScalar(Math.max(0.01, live.rapa));
      // links from/to moving objects
      lk.aktTsc.set(akt.position, tB.copy(tscG.position).add(V(0.4, 0.1, 0)), 0.5, 0.75);
      lk.ampTsc.set(V(-5.4, -1.8, 0.4), tB.copy(tscG.position).add(V(0.2, -0.2, 0)), 0.7, 0.75);
      lk.tscRheb.set(tA.copy(tscG.position).add(V(0.5, -0.1, 0)), tB.copy(rhebG.position), 0.7, 0.5);
      lk.ampRap.set(V(-5.4, -1.8, 0.4), tB.copy(mG.position).add(V(-0.95, -0.75, 0.15)), 0.7, 0.7);
      lk.ragM.set(tA.copy(ragG.position).add(V(0, 0.6, 0)), tB.copy(mG.position).add(V(-0.95, -0.75, 0.15)), 0.35, 0.5);
      lk.rhebM.set(tA.copy(rhebG.position), tB.copy(mG.position), 0.35, 1.1);
      const mP = mG.position;
      lk.mS6k.set(mP, V(9.6, 2.3, 0.4), 1.2, 0.55);
      lk.mBp.set(mP, tB.copy(bp1.position), 1.2, 0.45);
      lk.mUlk.set(mP, V(9.2, -4.2, 0.4), 1.2, 0.55);
      lk.mMaf.set(mP, tB.copy(maf1.position), 1.2, 0.35);
      const on = s.lvl >= 1;
      const act = {
        rIrs: ins, irsPi: ins, piAkt: ins, aktTsc: ins && !tscMut, tscRheb: s.tscOn, ampTsc: lowE && !tscMut, ampRap: lowE,
        ragM: aa, rhebM: aa && s.rheb && !rapa, mS6k: on, mBp: on, mUlk: on, mMaf: on, s6kRibo: on, ulkPhag: !on,
      };
      for (const k in lk) {
        const o = lk[k], a = act[k] ? 1 : 0; o.on += (a - o.on) * r;
        const op = (0.12 + 0.83 * o.on) * o.show;
        o.shaft.material.opacity = op; o.head.material.opacity = op;
        o.g.visible = o.show > 0.01;
        o.pulses.forEach((p, j) => { const u = (t * 0.6 + j * 0.5) % 1; p.position.lerpVectors(o.a, o.b, u); p.visible = o.on > 0.5 && o.show > 0.01; });
      }
      // outputs
      s6kP.visible = on; s6P.visible = on;
      api.setOpacity(s6k, 0.45 + 0.55 * live.lvl);
      const f = cl(live.lvl);
      bp1.position.set(9.6 - 0.2 * f, -0.35 + 1.0 * f, 0.4 + 0.3 * f);
      bpP.forEach(p => { p.visible = on; });
      tA.set(9.95, -0.55, 0.4); tB.set(9.6, -1.2, 0.55);
      e4e.position.lerpVectors(tA, tB, f);
      tRibo.visible = f > 0.6; tRibo.position.set(10.0 + ((t * 0.7) % 3.0), -1.0, 0.35); api.setOpacity(tRibo, cl((f - 0.6) * 2.5));
      ulkP.visible = on; ulk.material.emissiveIntensity = 0.8 * (1 - f);
      api.setOpacity(ulk, 0.45 + 0.55 * (1 - f));
      const pg = cl(1 - f);
      phag.scale.setScalar(Math.max(0.01, pg)); phag.visible = pg > 0.02;
      cupO.rotation.y = cupI.rotation.y = t * 0.3;
      junk.forEach((m, i) => { m.position.set(-0.25 + i * 0.25 + 0.05 * Math.sin(t * 2 + i), -0.1 + (i % 2) * 0.25, 0); });
      bio.forEach((g, i) => { g.visible = f > 0.5; const u = ((t * 0.4 + i / 3) % 1); g.position.set(12.4 + u * 1.6, 2.0 + Math.sin(u * 6 + i) * 0.35, 0.4 + i * 0.2); g.scale.setScalar(Math.max(0.01, f * Math.sin(Math.PI * u))); });
      maf1.position.set(12.2 - 0.9 * f, 0.6 + 0.1 * (1 - f) - 0.8 * f, 0.6);
      api.setOpacity(pol3, 0.45 + 0.55 * f); pol3.material.emissive.setHex(0x64d2ff); pol3.material.emissiveIntensity = 0.5 * f;
      // text labels for state
      L.set('tscS', tscMut ? 'không còn GAP' : s.tscOn ? (lowE ? 'BẬT (AMPK phosphoryl hóa)' : 'BẬT (không bị Akt ức chế)') : 'bị Akt phosphoryl hóa → TẮT');
      L.set('rhebS', s.rheb ? 'Rheb-GTP (BẬT)' : 'Rheb-GDP (TẮT)');
      L.set('ampS', lowE ? 'AMP cao → BẬT' : 'ATP đủ → tắt');
      const extra = [];
      if (tscMut && base.includes('tscL')) extra.push('tscX');
      if (lowE && base.includes('mL')) extra.push('rapPL');
      if (rapa && base.includes('mL')) extra.push('fkL');
      L.only(base.concat(extra).filter(k => (aa || k !== 'aaL') && (ins || k !== 'insL')));
    }

    const ctl = {
      setStep(i) {
        cur = i; tt = 0;
        const k = ['mL', 'lysL'];
        if (i === 0 || i === 8) k.push('insL', 'aktL', 'tscL', 'ampkL', 'ragL', 'rhebL', 's6kL', 'bpL', 'ulkL', 'aaL', 'pmL');
        if (i === 1) k.push('tscL', 'tscS', 'rhebL', 'rhebS', 'aktL', 'ragL');
        if (i === 2) k.push('insL', 'rcL', 'irsL', 'pi3kL', 'pipL', 'aktL', 'tscL', 'tscS', 'pmL', 'outL', 'cytL');
        if (i === 3) k.push('ragL', 'rhebL', 'rhebS', 'aaL', 'rapL');
        if (i === 4) k.push('ampkL', 'ampS', 'tscL', 'tscS', 'reddL', 'rhebL', 'rhebS', 'rapL');
        if (i === 5) k.push('s6kL', 'riboL', 'bpL', 'e4eL', 'capL');
        if (i === 6) k.push('ulkL', 'phagL', 'pol3L', 'maf1L', 'bioL', 'bpL');
        if (i === 7) k.push('frbL', 'rapL', 'rhebL', 'rhebS', 'ragL');
        base = k;
        api.camera(...CAMS[i]);
        readout();
        frame(0, 0);
      },
      update(dt, t) { tt += dt; frame(dt, t); },
    };
    ctl.setStep(0);
    return ctl;
  },
};
