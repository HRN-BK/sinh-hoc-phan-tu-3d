// Bài 17: Biến đổi sau dịch mã và kiểm soát chất lượng ở ER: N-glycan, BiP, calnexin, PDI/Ero1, đồng hồ mannose, ERAD (ubiquitin–proteasome).
import { labels, progress, clamp, ease, lerp, membrane } from './_kit.js';

export default {
  title: 'Biến đổi sau dịch mã và kiểm soát chất lượng ở ER',
  sub: 'Chuỗi polypeptide vừa vào lưới nội chất (ER) chưa phải protein hoàn chỉnh. Nó được gắn đường, gấp nếp nhờ chaperone, khóa bằng cầu nối di-S, rồi bị "chấm điểm". Đạt thì đi tiếp sang Golgi. Gấp sai quá lâu thì bị đẩy ra tế bào chất, gắn ubiquitin và bị proteasome băm nhỏ.',
  legend: '<span><i style="background:#9b6dd6"></i>amino acid</span><span><i style="background:#d4e157"></i>Cys (–SH)</span><span><i style="background:#e8a33d"></i>đoạn kỵ nước</span><span><i style="background:#2f6fde"></i>GlcNAc (■)</span><span><i style="background:#3fb27f"></i>mannose</span><span><i style="background:#7cc4ff"></i>glucose</span><span><i style="background:#2bb3a3"></i>enzyme / chaperone</span><span><i style="background:#ffd60a"></i>ubiquitin</span><span><i style="background:#d8b26e"></i>màng ER</span>',

  why: `<p>Ribosome chỉ nối amino acid thành một chuỗi. Muốn thành <b>protein hoạt động</b>, chuỗi phải được <b>biến đổi sau dịch mã</b> (post-translational modification). Slide nêu 4 kiểu:</p>
  <ul><li><b>Glycosyl hóa</b> (gắn đường): ở ER và Golgi.</li>
  <li><b>Tạo cầu nối di-S</b> (disulfide): ở ER.</li>
  <li><b>Gấp nếp và tổ hợp tiểu đơn vị</b>: ở ER. Ví dụ hemagglutinin (HA) của virus cúm tổ hợp thành <b>trimer</b>.</li>
  <li><b>Phân giải protein</b>: ở ER, Golgi, bóng màng.</li></ul>
  <p>ER còn là <b>trạm kiểm soát chất lượng</b>. Chuỗi đường gắn trên protein vừa giúp gấp nếp, vừa đóng vai trò <b>"đồng hồ"</b> quyết định khi nào protein gấp sai phải bị tiêu hủy.</p>`,

  without: `<ul>
  <li><b>Không gắn được N-glycan</b> (thuốc tunicamycin chặn bước đầu): rất nhiều protein không gấp nếp được, ứ đọng trong ER, tế bào bị <b>stress ER</b>. Ở người, các bệnh <b>rối loạn glycosyl hóa bẩm sinh</b> (congenital disorders of glycosylation, CDG) gây chậm phát triển thần kinh và tổn thương nhiều cơ quan.</li>
  <li><b>Không có cầu nối di-S</b>: protein tiết như <b>insulin</b> (3 cầu nối di-S) và <b>kháng thể</b> không giữ được hình dạng, nên mất chức năng.</li>
  <li><b>Kiểm soát chất lượng quá "khắt khe"</b>: ở bệnh <b>xơ nang</b> (cystic fibrosis), đột biến phổ biến nhất <b>CFTR ΔF508</b> làm kênh Cl⁻ gấp hơi sai. ER giữ lại và đưa đi <b>ERAD</b> dù nó vẫn còn chức năng một phần, nên kênh không tới được màng.</li>
  <li><b>Hệ ubiquitin–proteasome hỏng</b>: protein hỏng ứ đọng, kết tụ thành đám, gặp trong các bệnh thoái hóa thần kinh.</li></ul>
  <div class="box info">👉 Bật các công tắc 💥 (tunicamycin, thiếu Ero1, protein gấp sai, thuốc ức chế proteasome) ở từng bước để xem hậu quả trong 3D.</div>`,

  foundation: [
    { q: 'Protein được tạo ra như thế nào, và "sau dịch mã" nghĩa là gì?', a: 'Ribosome đọc mRNA và nối các <b>amino acid</b> thành <b>chuỗi polypeptide</b> (bài dịch mã). "Sau dịch mã" là mọi thay đổi xảy ra <b>trên chuỗi đó</b> sau khi được tạo: gắn thêm nhóm hóa học (đường, phosphate, ubiquitin…), tạo liên kết, gấp nếp, cắt bớt.' },
    { q: 'Vì sao protein phải gấp nếp?', a: 'Chức năng phụ thuộc vào <b>hình dạng 3D</b>. Amino acid <b>kỵ nước</b> phải được giấu vào lõi, amino acid ưa nước ở ngoài. Nếu đoạn kỵ nước lộ ra, các chuỗi sẽ <b>dính vào nhau thành đám</b> (aggregate), vô dụng và có hại.' },
    { q: 'Lưới nội chất (ER) là gì? Lòng ER khác tế bào chất ở điểm nào?', a: 'ER là hệ túi màng nối với màng nhân. Protein <b>tiết ra ngoài</b>, protein <b>màng</b> và protein lysosome được đưa vào ER ngay trong lúc dịch mã, qua kênh <b>Sec61</b> (nhờ SRP, bài trước). Lòng ER là môi trường <b>oxy hóa</b>, giàu Ca²⁺ và chaperone. Tế bào chất là môi trường <b>khử</b> (nhiều glutathione).' },
    { q: 'Cầu nối di-S là gì?', a: 'Hai amino acid <b>cysteine</b> có nhóm <b>–SH</b> (thiol). Khi bị <b>oxy hóa</b>, 2 nhóm này nối với nhau: –SH + HS– → <b>–S–S–</b> (mất 2 H⁺ và 2 e⁻). Cầu nối di-S như một "đinh tán" giữ chặt hình dạng protein. Nó cần môi trường oxy hóa, nên hình thành ở ER chứ không ở tế bào chất.' },
    { q: '"Oxy hóa" và "khử" ở đây nghĩa là gì?', a: 'Oxy hóa là <b>mất electron</b>; khử là <b>nhận electron</b>. Tạo cầu nối S–S là oxy hóa 2 nhóm –SH. Enzyme <b>PDI</b> dạng oxy hóa (có sẵn S–S) "đưa" cầu nối cho protein, rồi bản thân bị khử thành 2 –SH. Enzyme <b>Ero1</b> oxy hóa PDI trở lại.' },
    { q: 'Chaperone là gì?', a: 'Là protein <b>giúp protein khác gấp nếp</b> mà không trở thành một phần của sản phẩm. Họ <b>Hsp70</b> bám vào đoạn kỵ nước đang lộ ra, chu trình ATP giúp bám/nhả. <b>BiP</b> là Hsp70 của ER. Calnexin và calreticulin là chaperone kiểu <b>lectin</b>: chúng bám vào <b>đường</b> trên protein.' },
    { q: 'Glycan là gì? Đọc kí hiệu Glc₃Man₉GlcNAc₂ thế nào?', a: 'Glycan là chuỗi đường nhánh. Kí hiệu này nghĩa là: 3 glucose (Glc) + 9 mannose (Man) + 2 N-acetylglucosamine (GlcNAc), tổng 14 gốc đường. 2 GlcNAc nằm ở gốc (gắn vào protein), 3 Glc nằm ở ngọn một nhánh. Trong 3D: ■ xanh đậm = GlcNAc, ● xanh lá = Man, ● xanh nhạt = Glc.' },
    { q: 'Ubiquitin và proteasome là gì?', a: '<b>Ubiquitin (Ub)</b> là protein nhỏ 76 amino acid. Chuỗi nhiều Ub (poly-Ub, nối qua Lys48) gắn lên protein là <b>"giấy báo tiêu hủy"</b>. 3 enzyme: <b>E1</b> hoạt hóa Ub (cần ATP), <b>E2</b> mang Ub, <b>E3</b> nhận diện protein đích. <b>Proteasome 26S</b> là "máy hủy" hình thùng: nhận protein mang poly-Ub, dùng ATP duỗi nó ra và cắt thành peptide ngắn. Ub được tháo ra để dùng lại.' },
  ],

  steps: [
    { title: 'Chuỗi mới chui vào lòng ER', text: 'Ribosome (xanh nhạt, dưới màng) đang dịch mã và đẩy chuỗi polypeptide qua kênh <b>Sec61</b> vào <b>lòng ER</b> (phía trên). Lưu ý 2 phía màng: lòng ER là môi trường <b>oxy hóa</b>; tế bào chất là môi trường <b>khử</b>. Trên chuỗi có các <b>Cys</b> (vàng chanh) và một <b>đoạn kỵ nước</b> (vàng cam).' },
    { title: 'N-glycosyl hóa: gắn nguyên khối 14 gốc đường', text: 'Trong màng có <b>dolichol</b> (lipid, thanh nâu) mang sẵn khối <b>Glc₃Man₉GlcNAc₂</b>. Khi một <b>Asn</b> nằm trong trình tự <b>Asn-X-Ser/Thr</b> (X ≠ Pro) vừa vào lòng ER, enzyme <b>OST</b> (oligosaccharyl transferase) chuyển <b>nguyên khối</b> đường sang nitơ của Asn. Vì vậy gọi là <b>N</b>-glycosyl hóa, và nó diễn ra ngay trong lúc dịch mã.' },
    { title: 'BiP (Hsp70) che đoạn kỵ nước', text: 'Chuỗi vừa dịch mã xong còn duỗi, và <b>đoạn kỵ nước</b> (vàng cam) đang lộ ra. <b>BiP</b>, Hsp70 của ER, bám vào đó (dùng chu trình <b>ATP</b>) để các chuỗi không dính vào nhau. Khi nhả ra, chuỗi có cơ hội gấp tiếp và giấu đoạn kỵ nước vào trong.' },
    { title: 'Glucosidase I, II cắt 2 Glc, rồi calnexin giữ lại', text: '<b>Glucosidase I</b> cắt Glc ngoài cùng, <b>glucosidase II</b> cắt Glc thứ 2. Còn lại <b>Glc₁Man₉GlcNAc₂</b>, và đây là "vé" để lectin <b>calnexin</b> (CNX, gắn màng) hoặc <b>calreticulin</b> (CRT, tan) <b>bám vào Glc cuối cùng</b>. CNX giữ protein lại trong ER để nó có thời gian gấp nếp.' },
    { title: 'PDI tạo cầu nối di-S, Ero1 nạp lại PDI', text: 'Theo đúng chu trình trên slide: <b>PDI dạng oxy hóa</b> (có S–S riêng) phản ứng với <b>thiol 1</b> của protein, tạo <b>cầu nối trung gian</b> PDI–S–S–protein. <b>Thiol 2</b> của protein tấn công, tạo <b>S–S nội phân tử</b> (thanh vàng giữa 2 Cys). PDI được giải phóng ở dạng <b>khử</b> (2 –SH). Cuối cùng <b>Ero1</b> oxy hóa PDI trở lại để dùng tiếp.' },
    { title: 'PDI sửa cầu nối sai (isomerase)', text: 'Nếu Cys bị nối <b>nhầm cặp</b> (thanh đỏ), protein bị "khóa" ở hình sai. <b>PDI dạng khử</b> tấn công cầu nối sai, mở nó ra, tạo cầu nối trung gian. Protein được tự do gấp lại, và <b>cặp Cys đúng</b> nối với nhau. Vì vậy PDI là "disulfide <b>isomerase</b>": nó sắp xếp lại cầu nối chứ không chỉ tạo mới.' },
    { title: 'Đạt chuẩn: rời CNX, tổ hợp trimer, sang Golgi', text: 'Glucosidase II cắt <b>Glc cuối</b>, nên protein <b>rời calnexin</b>. ER mannosidase cắt 1 Man, còn <b>Man₈GlcNAc₂</b>. Các đơn phân đã gấp đúng mới được <b>tổ hợp</b>: với HA của virus cúm là <b>trimer 3 tiểu đơn vị</b> (HA₀). Lúc đó protein mới được rời ER sang <b>cis-Golgi</b>. Bật 💥 <b>Protein gấp sai</b> để xem chuyện gì xảy ra nếu chưa gấp xong.' },
    { title: 'Đồng hồ mannose: hết giờ', text: 'Protein gấp sai bị giữ lại hết vòng này đến vòng khác. Trong lúc đó <b>ER α-mannosidase</b> chậm rãi cắt bớt mannose: Man₉ → Man₈ → … → <b>Man₅₋₆</b>. Mannose như cát trong đồng hồ. Khi chỉ còn Man₅₋₆, lectin <b>OS-9</b> nhận ra dấu hiệu "hết giờ" và đưa protein đi tiêu hủy.' },
    { title: 'ERAD: đẩy ra, gắn ubiquitin, proteasome băm nhỏ', text: 'Protein bị <b>đẩy ngược</b> qua màng (retrotranslocation) qua kênh <b>Hrd1</b> ra tế bào chất. Ở đó <b>E1 → E2 → E3</b> (Hrd1 là một E3) gắn <b>chuỗi poly-ubiquitin</b> (vàng) vào Lys (cần ATP). <b>Proteasome 26S</b> nhận protein, dùng ATP duỗi nó và cắt thành <b>peptide ngắn</b>. Ub được tháo ra và <b>tái sử dụng</b>. Đây là <b>ERAD</b> (ER-associated degradation).' },
  ],

  application: `<ul>
  <li><b>Thuốc ức chế proteasome bortezomib</b> điều trị <b>đa u tủy</b> (multiple myeloma). Tế bào u tủy tiết <b>rất nhiều kháng thể</b>, nên ER của chúng luôn quá tải protein. Chặn proteasome làm protein hỏng ứ đọng, stress ER nặng, và tế bào ung thư chết trước tế bào thường.</li>
  <li><b>Thuốc "sửa gấp nếp" cho xơ nang:</b> các <b>corrector</b> (elexacaftor, tezacaftor) giúp CFTR ΔF508 gấp đủ đúng để <b>qua được kiểm soát của ER</b> và lên màng. Ivacaftor (potentiator) giúp kênh mở tốt hơn. Bộ ba này cải thiện rõ chức năng phổi.</li>
  <li><b>Sản xuất thuốc protein:</b> kháng thể đơn dòng và EPO phải được sản xuất trong <b>tế bào động vật có vú</b> (như CHO) chứ không phải vi khuẩn, vì vi khuẩn không có ER, không gắn N-glycan kiểu người và kém tạo cầu nối di-S. Glycan sai làm thuốc kém tác dụng hoặc bị đào thải nhanh.</li>
  <li><b>Insulin tái tổ hợp:</b> insulin có 3 cầu nối di-S. Khi sản xuất ở <i>E. coli</i>, protein phải được <b>gấp lại và tạo cầu nối di-S trong ống nghiệm</b> sau khi tinh sạch.</li>
  <li><b>Tunicamycin</b> là công cụ nghiên cứu kinh điển: chặn N-glycosyl hóa để gây stress ER trong phòng thí nghiệm.</li></ul>
  <div class="box warn">⚠️ <b>Slide/guide rút gọn:</b> chu trình calnexin còn một enzyme quan trọng là <b>UGGT</b> (UDP-glucose:glycoprotein glucosyltransferase). Đây là <b>"cảm biến gấp nếp"</b>: nếu protein rời CNX mà vẫn chưa gấp xong, UGGT <b>gắn lại 1 Glc</b> để nó quay lại CNX. Slide không vẽ UGGT; bài này thêm vào ở bước 7 (bật "Protein gấp sai").</div>`,

  distinguish: `<div class="tbl-wrap"><table class="cmp">
  <tr><th>Thành phần</th><th>Bản chất</th><th>Nhận diện gì</th><th>Vai trò</th></tr>
  <tr><td><b>BiP</b></td><td>Chaperone họ Hsp70 (ATP)</td><td>Đoạn <b>kỵ nước</b> lộ ra</td><td>Chống vón cục, hỗ trợ gấp nếp</td></tr>
  <tr><td><b>Calnexin / calreticulin</b></td><td>Lectin (CNX gắn màng, CRT tan)</td><td><b>Glc₁</b>Man₉GlcNAc₂</td><td>Giữ protein lại để gấp nếp</td></tr>
  <tr><td><b>PDI</b></td><td>Enzyme oxy hóa–khử</td><td>Nhóm –SH của Cys</td><td>Tạo S–S (dạng ox), sửa S–S sai (dạng red)</td></tr>
  <tr><td><b>Ero1</b></td><td>Oxidase</td><td>PDI dạng khử</td><td>Oxy hóa lại PDI</td></tr>
  <tr><td><b>OS-9</b></td><td>Lectin</td><td><b>Man₅₋₆</b> (mannose bị cắt)</td><td>Đưa protein "hết giờ" sang ERAD</td></tr>
  <tr><td><b>Proteasome 26S</b></td><td>Phức hợp protease (ATP)</td><td>Chuỗi poly-Ub</td><td>Cắt protein thành peptide ngắn</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>Glc₁Man₉GlcNAc₂</th><th>Man₈GlcNAc₂</th><th>Man₅₋₆GlcNAc₂</th></tr>
  <tr><td>Ý nghĩa</td><td>"Đang gấp": calnexin giữ lại</td><td>Đạt chuẩn: đi cis-Golgi</td><td>"Hết giờ": OS-9 → ERAD</td></tr>
  <tr><td>Do enzyme nào tạo ra</td><td>Glucosidase I + II (cắt 2 Glc)</td><td>Glucosidase II (Glc cuối) + ER mannosidase (1 Man)</td><td>ER α-mannosidase cắt thêm nhiều Man</td></tr>
  </table></div>
  <div class="tbl-wrap"><table class="cmp">
  <tr><th></th><th>N-glycosyl hóa</th><th>O-glycosyl hóa</th></tr>
  <tr><td>Gắn vào</td><td><b>N</b> của Asn (Asn-X-Ser/Thr)</td><td><b>O</b> của Ser/Thr</td></tr>
  <tr><td>Nơi bắt đầu</td><td>ER (rồi chỉnh sửa tiếp ở Golgi)</td><td>Chủ yếu ở Golgi</td></tr>
  <tr><td>Cách gắn</td><td>Chuyển <b>nguyên khối</b> 14 gốc từ dolichol</td><td>Gắn <b>từng gốc đường một</b></td></tr>
  </table></div>`,

  traps: [
    { trap: '"Cầu nối di-S hình thành ở tế bào chất, vì protein được dịch mã ở đó."', truth: 'Cầu nối di-S cần môi trường <b>oxy hóa</b> nên hình thành trong <b>lòng ER</b>. Tế bào chất có tính <b>khử</b> (glutathione) nên –S–S– không bền ở đó.' },
    { trap: '"PDI dạng khử tạo cầu nối di-S mới."', truth: '<b>PDI oxy hóa</b> mới "trao" S–S cho protein (rồi bị khử). <b>PDI khử</b> làm nhiệm vụ <b>sửa</b> cầu nối sai (isomerase). <b>Ero1</b> oxy hóa PDI trở lại.' },
    { trap: '"Đường được gắn lên protein từng gốc một ở ER."', truth: 'N-glycosyl hóa chuyển <b>nguyên khối</b> Glc₃Man₉GlcNAc₂ từ <b>dolichol</b> sang Asn (enzyme OST). Gắn từng gốc là kiểu của O-glycosyl hóa ở Golgi.' },
    { trap: '"Calnexin bám vào đoạn kỵ nước như BiP."', truth: 'Calnexin/calreticulin là <b>lectin</b>: bám vào <b>đường (Glc₁)</b> trên protein. BiP (Hsp70) mới bám đoạn <b>kỵ nước</b>.' },
    { trap: '"Glucosidase cắt glucose để phân hủy protein."', truth: 'Cắt 2 Glc tạo Glc₁, tức "vé" để calnexin <b>giữ lại cho gấp nếp</b>. Tín hiệu phân hủy là khi <b>mannose</b> bị cắt còn Man₅₋₆ (OS-9 nhận diện).' },
    { trap: '"Proteasome phân hủy protein mà không cần năng lượng; ubiquitin bị phân hủy cùng."', truth: 'Gắn Ub (E1) và phân hủy ở proteasome đều <b>cần ATP</b>. Ub được <b>tháo ra và tái sử dụng</b>, không bị phân hủy.' },
    { trap: '"Protein gấp sai trong ER bị proteasome trong ER phân hủy."', truth: 'Proteasome nằm ở <b>tế bào chất</b>/nhân. Protein ER gấp sai phải được <b>đẩy ngược ra tế bào chất</b> (retrotranslocation) rồi mới bị ubiquitin hóa và phân hủy: đó là ERAD.' },
    { trap: '"E3 là enzyme hoạt hóa ubiquitin."', truth: '<b>E1 hoạt hóa</b> (ATP), <b>E2 mang</b>, <b>E3 nhận diện</b> protein đích. Có rất nhiều loại E3, nên E3 quyết định tính đặc hiệu.' },
    { trap: '"Protein vừa gấp đúng 1 đơn phân là được rời ER ngay."', truth: 'Protein nhiều tiểu đơn vị phải <b>tổ hợp xong</b> (ví dụ HA₀ là trimer) mới được rời ER. Đơn phân lẻ bị giữ lại.' },
  ],

  quiz: [
    { q: 'Enzyme nào oxy hóa lại PDI sau khi PDI tạo cầu nối di-S cho protein?', ops: ['BiP', 'Ero1', 'OST', 'Glucosidase II'], a: 1, e: 'PDI trao S–S cho protein rồi bị khử; Ero1 oxy hóa nó trở lại. BiP là chaperone Hsp70, không tham gia phản ứng oxy hóa–khử.' },
    { q: 'Calnexin nhận diện protein mới nhờ:', ops: ['Đoạn kỵ nước lộ ra', 'Glc₁Man₉GlcNAc₂ (còn 1 glucose)', 'Man₅₋₆GlcNAc₂', 'Chuỗi poly-ubiquitin'], a: 1, e: 'Calnexin là lectin bám vào Glc cuối cùng sau khi glucosidase I, II cắt 2 Glc. Đoạn kỵ nước là "tín hiệu" của BiP. Man₅₋₆ là tín hiệu của OS-9.' },
    { q: 'Tế bào được xử lý tunicamycin (chặn bước đầu gắn đường lên dolichol). Điều gì xảy ra?', ops: ['Protein được gắn O-glycan thay thế nên vẫn bình thường', 'Protein không có N-glycan, calnexin không giữ được, nhiều protein gấp sai và ứ đọng: stress ER', 'Protein bị proteasome phân hủy ngay trong lòng ER', 'Cầu nối di-S không thể hình thành'], a: 1, e: 'Không có khối đường trên dolichol thì OST không có gì để chuyển. Mất "vé" cho calnexin, gấp nếp kém, stress ER. Proteasome không nằm trong lòng ER. Cầu nối di-S vẫn có thể hình thành (do PDI).' },
    { q: 'Thứ tự đúng của "đồng hồ cát mannose":', ops: ['Man₅₋₆ → OS-9 → glucosidase → calnexin', 'Glc₃Man₉ → glucosidase I, II → Glc₁Man₉ (CNX giữ) → … → ER α-mannosidase → Man₅₋₆ → OS-9 → ERAD', 'Glc₃Man₉ → OS-9 → calnexin → Golgi', 'Man₉ → thêm mannose → Man₁₂ → ERAD'], a: 1, e: 'Glycan bị cắt dần: trước là Glc (tạo vé CNX), sau là Man (đếm thời gian). Man₅₋₆ là tín hiệu "hết giờ" cho OS-9.' },
    { q: 'Vì sao bortezomib (ức chế proteasome) diệt tế bào đa u tủy mạnh hơn tế bào thường?', ops: ['Vì nó ức chế PDI', 'Vì tế bào u tủy tiết rất nhiều kháng thể, ER quá tải nên rất phụ thuộc ERAD; chặn proteasome làm stress ER gây chết', 'Vì nó phá cầu nối di-S của kháng thể', 'Vì tế bào thường không có proteasome'], a: 1, e: 'Mọi tế bào đều có proteasome, nhưng tế bào tiết kháng thể nhiều nhất là tế bào phụ thuộc nhất vào việc dọn protein hỏng.' },
    { q: 'Đột biến xóa một Cys trong cặp tạo cầu nối di-S của một protein tiết. Hậu quả dễ xảy ra nhất:', ops: ['Protein gấp không bền, bị giữ ở ER lâu và có thể bị đưa đi ERAD', 'Protein không được glycosyl hóa', 'Protein được tiết ra nhiều hơn', 'Ribosome dừng dịch mã'], a: 0, e: 'Thiếu "đinh tán" S–S, protein khó đạt cấu trúc đúng, nên bị kiểm soát chất lượng giữ lại (CNX, UGGT) và cuối cùng đưa đi ERAD. Glycosyl hóa phụ thuộc trình tự Asn-X-Ser/Thr, không phụ thuộc Cys.' },
    { q: 'Câu nào ĐÚNG về hệ ubiquitin–proteasome?', ops: ['E2 nhận diện protein đích', 'Chỉ 1 phân tử ubiquitin là đủ để đưa đi phân hủy', 'E1 hoạt hóa Ub (ATP), E3 nhận diện đích; proteasome dùng ATP; Ub được tái sử dụng', 'Ub bị proteasome phân hủy cùng protein'], a: 2, e: 'Tín hiệu phân hủy kinh điển là chuỗi poly-Ub (≥4 Ub, nối qua K48). E3 (không phải E2) quyết định đích. Ub được tháo ra trước khi protein vào lõi proteasome.' },
  ],

  recall: [
    'Vẽ tay lại cây glycan Glc₃Man₉GlcNAc₂, rồi đánh dấu: enzyme nào cắt chỗ nào, ai bám vào Glc₁, ai bám vào Man₅₋₆.',
    'Vẽ chu trình PDI: PDI ox → cầu nối trung gian với thiol 1 → thiol 2 tấn công → S–S nội phân tử + PDI red → Ero1 → PDI ox.',
    'Kể theo thứ tự số phận của một protein gấp sai mãi: CNX/UGGT lặp lại → mannosidase → OS-9 → retrotranslocation → E1/E2/E3 → proteasome 26S. Mỗi bước có cần ATP không?',
  ],

  scene(api) {
    const { THREE, C } = api;
    const L = labels(api);
    const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
    const MY = -3;                       // membrane centre (lumen above, cytosol below)
    const W = V(0.5, 2.6, 0);            // folding work-place in the lumen
    const COL = { cys: 0xd4e157, hyd: 0xe8a33d, glcnac: 0x2f6fde, man: 0x3fb27f, glc: 0x7cc4ff };

    membrane(api, { w: 30, d: 3, y: MY, color: C.membrane });
    const sec61 = api.cylinder(0.75, 0.75, 2.8, 0x5ac8c8, null, { opacity: 0.55, depthWrite: false }); sec61.position.set(-9, MY, 0);
    const hrd1 = api.cylinder(0.75, 0.75, 2.8, 0xff8a65, null, { opacity: 0.55, depthWrite: false }); hrd1.position.set(5, MY, 0);
    const riboL = api.blob(1.25, C.ribosome, null, { scale: [1.3, 0.85, 1.1], seed: 3 }); riboL.position.set(-9, -5.15, 0);
    const riboS = api.blob(0.9, C.ribosome, null, { scale: [1.3, 0.7, 1], seed: 5 }); riboS.position.set(-9, -6.75, 0);

    // ---- polypeptide: beads + backbone sticks ----
    const N = 24, CYS = [6, 12, 17], HYD = [8, 9, 10], ASN = 3;
    const beadG = new THREE.SphereGeometry(0.27, 16, 12);
    const beads = [], sticks = [];
    for (let i = 0; i < N; i++) {
      const col = CYS.includes(i) ? COL.cys : HYD.includes(i) ? COL.hyd : C.protein;
      const m = new THREE.Mesh(beadG, api.mat(col, { roughness: 0.45 })); api.add(m); beads.push(m);
      if (i) sticks.push(api.stick(V(), V(0, 1, 0), 0.08, 0xb9a6e8));
    }
    // layouts
    const F = [], M = [], LZ = [];
    for (let i = 0; i < N; i++) {
      const y = -(1 - 2 * (i + 0.5) / N), r = Math.sqrt(1 - y * y), th = i * Math.PI / 3;
      const p = V(r * Math.cos(th), y, r * Math.sin(th)).multiplyScalar(1.25);
      F.push(HYD.includes(i) ? p.clone().multiplyScalar(0.45) : p);
      const q = p.clone(); if (i > 13) { q.applyAxisAngle(V(0, 1, 0), 1.3); q.multiplyScalar(1.15); }
      if (HYD.includes(i)) q.multiplyScalar(1.5);
      M.push(q);
      LZ.push(V(0.42 * (i - 11.5), 0.55 * Math.sin(i * 0.9) + 0.4, 0.45 * Math.cos(i * 0.7)));
    }
    M[17] = F[6].clone().add(V(0.15, 0.55, 0.4));
    const EXIT = V(-9, MY + 1.4, 0);
    const pathU = (d, out) => (d < 2.2 ? out.set(0, d, 0) : out.set(d - 2.2, 2.2 + 0.25 * Math.sin((d - 2.2) * 2), 0)).add(EXIT);
    // ERAD path polyline
    const DP = [V(0.5, 1.8, 0), V(5, -0.3, 0), V(5, -5.8, 0), V(12, -5.8, 0)];
    const DL = [0]; for (let i = 1; i < DP.length; i++) DL.push(DL[i - 1] + DP[i].distanceTo(DP[i - 1]));
    const pathD = (d, out) => {
      let s = 0; while (s < DP.length - 2 && d > DL[s + 1]) s++;
      const a = DP[s], b = DP[s + 1], t = (d - DL[s]) / (DL[s + 1] - DL[s]);
      return out.copy(a).lerp(b, t);
    };

    // ---- glycan tree: [x, y, parent, kind] ; kinds: n = GlcNAc, m = Man, g = Glc ----
    const TREE = [[0, 0.35, -1, 'n'], [0, 0.8, 0, 'n'], [0, 1.25, 1, 'm'], [-0.45, 1.65, 2, 'm'], [-0.45, 2.1, 3, 'm'], [-0.45, 2.55, 4, 'm'],
      [-0.45, 3.0, 5, 'g'], [-0.45, 3.45, 6, 'g'], [-0.45, 3.9, 7, 'g'], [0.45, 1.65, 2, 'm'], [0.2, 2.1, 9, 'm'], [0.2, 2.55, 10, 'm'], [0.75, 2.1, 9, 'm'], [0.75, 2.55, 12, 'm']];
    const GLC1 = 6, GLC2 = 7, GLC3 = 8, MAN_TRIM = [11, 13, 5, 4];
    const gt = api.group(); gt.scale.setScalar(0.75);
    const sugG = new THREE.SphereGeometry(0.19, 14, 10), boxG = new THREE.BoxGeometry(0.34, 0.34, 0.34);
    const sugars = TREE.map(([x, y, p, k]) => {
      const m = new THREE.Mesh(k === 'n' ? boxG : sugG, api.mat(k === 'n' ? COL.glcnac : k === 'm' ? COL.man : COL.glc, { emissive: 0x000000 }));
      m.position.set(x, y, 0); gt.add(m);
      const from = p < 0 ? V(0, 0, 0) : V(TREE[p][0], TREE[p][1], 0);
      const st = api.stick(from, V(x, y, 0), 0.05, 0xcfd8dc, gt);
      return { m, st };
    });
    const showSugar = (j, on) => { sugars[j].m.visible = sugars[j].st.visible = on; };
    const sugarWorld = (j, out) => out.set(TREE[j][0] * 0.75, TREE[j][1] * 0.75, 0).applyAxisAngle(V(0, 0, 1), gt.rotation.z).add(gt.position);
    // dolichol carrier in the membrane
    const DOL = V(-6.6, MY + 1.15, 0);
    const dol = api.stick(V(-6.6, MY - 0.9, 0), DOL, 0.07, 0xa1887f);
    const pp = [0, 1].map(j => { const s = api.sphere(0.13, C.phosphate); s.position.set(-6.6, MY + 0.85 + 0.25 * j, 0); return s; });

    // ---- blobs (enzymes / chaperones) ----
    const OFF = V(-14, 9, -4);
    const blob = (r, col, seed, sc = [1.1, 0.85, 1]) => { const b = api.blob(r, col, null, { mat: { opacity: 0, depthWrite: false }, scale: sc, seed }); b.position.copy(OFF); b.userData.on = false; return b; };
    const ost = blob(0.8, C.enzyme, 1), bip = blob(0.8, 0x1f8f84, 2), gluI = blob(0.6, 0x37c6b5, 3), gluII = blob(0.6, 0x26a69a, 4);
    const cnx = blob(0.6, C.protein, 5, [1.3, 0.9, 1]), pdi = blob(0.75, C.enzyme, 6), ero1 = blob(0.75, 0x00897b, 7);
    const uggt = blob(0.65, 0x4db6ac, 8), mns = blob(0.65, 0x26a69a, 9), os9 = blob(0.65, 0xb388ff, 10, [1.3, 0.9, 1]), e2 = blob(0.5, C.enzyme, 11);
    const partA = blob(1.25, C.protein, 12, [1, 1, 1]), partB = blob(1.25, C.protein, 13, [1, 1, 1]);
    const cnxTM = api.stick(V(0, MY - 1, 0), V(0, -1.2, 0), 0.1, C.protein); cnxTM.visible = false;
    const atp = api.sphere(0.16, 0xffe066, null, { emissive: 0xffaa00 }); atp.visible = false;
    // PDI active-site sulfurs + bonds
    const SA = api.sphere(0.15, 0xffe14d, null, { emissive: 0x554400 }), SB = api.sphere(0.15, 0xffe14d, null, { emissive: 0x554400 });
    const pdiSS = api.stick(V(), V(0, 1, 0), 0.07, 0xffe14d), mixSS = api.stick(V(), V(0, 1, 0), 0.07, 0xffe14d);
    const ssGood = api.stick(V(), V(0, 1, 0), 0.09, 0xffe14d, null, { emissive: 0x665500 }), ssBad = api.stick(V(), V(0, 1, 0), 0.09, C.bad, null, { emissive: 0x550000 });
    // proteasome
    const prot = api.group(); prot.position.set(9.2, -5.8, 0);
    const protCore = [];
    for (let j = 0; j < 4; j++) { const t = api.torus(0.75, 0.32, 0x8e7cc3, prot); t.rotation.y = Math.PI / 2; t.position.x = -0.75 + j * 0.5; protCore.push(t); }
    for (const sx of [-1.55, 1.55]) { const c = api.blob(0.7, 0xb39ddb, prot, { scale: [0.6, 1.05, 1.05], seed: sx > 0 ? 14 : 15 }); c.position.x = sx; }
    const ubs = [0, 1, 2, 3].map(() => { const s = api.sphere(0.22, C.ub, null, { emissive: 0x332b00 }); s.visible = false; return s; });
    const peps = [0, 1, 2, 3, 4].map(() => { const s = api.box(0.35, 0.12, 0.12, C.protein); s.visible = false; return s; });

    // ---- labels ----
    L.add('lumen', 'Lòng ER: môi trường OXY HÓA', [-10, 4.8, 0], null, 'good');
    L.add('cyto', 'Tế bào chất: môi trường KHỬ', [-3, -7.3, 0], null, 'dim');
    L.add('ribo', 'Ribosome', [-11.3, -5.6, 0], null);
    L.add('sec', 'Sec61', [-10.4, -2.3, 0], null, 'dim');
    L.add('cys', 'Cys (–SH)', [0, 0, 0], null, 'dim');
    L.add('hyd', 'đoạn kỵ nước', [0, 0, 0], null, 'dim');
    L.add('dol', 'Dolichol-PP-Glc₃Man₉GlcNAc₂', [-3.6, -0.4, 0], null, 'dim');
    L.add('ost', 'OST chuyển nguyên khối', [0, 0, 0], null);
    L.add('asn', 'Asn (N-X-S/T)', [0, 0, 0], null, 'good');
    L.add('bip', 'BiP (Hsp70) + ATP', [0, 0, 0], null);
    L.add('glu1', 'Glucosidase I', [0, 0, 0], null);
    L.add('glu2', 'Glucosidase II', [0, 0, 0], null);
    L.add('cnx', 'Calnexin bám Glc₁', [0, 0, 0], null);
    L.add('pdi', 'PDI ox (S–S)', [0, 0, 0], null);
    L.add('ero1', 'Ero1', [0, 0, 0], null);
    L.add('ss', 'S–S nội phân tử', [0, 0, 0], null, 'good');
    L.add('bad', 'S–S SAI cặp', [0, 0, 0], null, 'warn');
    L.add('tri', 'HA₀ trimer → cis-Golgi', [0, 0, 0], null, 'good');
    L.add('man8', 'Man₈GlcNAc₂', [0, 0, 0], null, 'dim');
    L.add('uggt', 'UGGT gắn lại Glc', [0, 0, 0], null);
    L.add('mns', 'ER α-mannosidase', [0, 0, 0], null);
    L.add('clock', 'Man₉', [-4.2, 4.6, 0], null, 'big');
    L.add('os9', 'OS-9: hết giờ!', [0, 0, 0], null, 'warn');
    L.add('hrd1', 'Hrd1: kênh ra + E3', [7.6, -1.6, 0], null);
    L.add('ub', 'poly-Ub (E1→E2→E3)', [0, 0, 0], null);
    L.add('prot', 'Proteasome 26S (ATP)', [9.2, -4.2, 0], null);
    L.add('pep', 'peptide ngắn', [12.4, -6.9, 0], null, 'dim');
    L.add('ubR', 'Ub tái sử dụng', [0, 0, 0], null, 'good');
    L.add('msg', '', [0.5, 6.4, 0], null, 'warn');
    const txt = {};
    const setT = (k, t) => { if (txt[k] !== t) { txt[k] = t; L.set(k, t); } };
    const at = (key, p, dx = 0, dy = 0) => L.get(key).position.set(p.x + dx, p.y + dy, p.z);

    // ---- state ----
    let cur = 0, tuni = false, noEro = false, misf = false, bort = false, sig = '';
    const ph = progress(0.17);
    const vis = (o, on, op = 0.75) => { if (o.userData.on !== on) { o.userData.on = on; api.fadeTo(o, on ? op : 0, 6); } };
    const CAMS = [[[-5.5, -1, 18], [-6.5, -2, 0]], [[-5, 0, 18], [-6, -0.8, 0]], [[1.5, 2, 12], [0.5, 1.2, 0]], [[1.5, 1.4, 13], [0.5, 1.1, 0]],
      [[2.5, 2.4, 12.5], [2, 1.6, 0]], [[1.5, 2.2, 9.5], [1, 2.2, 0]], [[3, 2.5, 14], [2.5, 2, 0]], [[0, 2.2, 12.5], [-0.5, 1.6, 0]], [[5, -2.6, 17], [5.5, -3.4, 0]]];
    const tg = {};
    const refresh = () => { ctl.setStep(cur); };
    tg.tuni = api.toggle('💥 Tunicamycin (chặn N-glycosyl hóa)', false, (x) => { tuni = x; refresh(); });
    tg.ero = api.toggle('💥 Thiếu Ero1', false, (x) => { noEro = x; refresh(); });
    tg.misf = api.toggle('💥 Protein gấp sai (như CFTR ΔF508)', false, (x) => { misf = x; refresh(); });
    tg.bort = api.toggle('💥 Thuốc ức chế proteasome (bortezomib)', false, (x) => { bort = x; refresh(); });
    function readout() {
      const t = [];
      if (tuni && cur >= 1 && cur <= 3) t.push('❌ <b>Tunicamycin</b> chặn bước gắn GlcNAc đầu tiên lên dolichol, nên <b>không có khối đường</b> để OST chuyển. Không có Glc₁ thì <b>calnexin không giữ</b> được protein. Đoạn kỵ nước lộ ra, protein vón cục, ứ đọng trong ER, gây <b>stress ER</b> (kích hoạt đáp ứng UPR).');
      if (noEro && cur === 4) t.push('❌ <b>Thiếu Ero1</b>: PDI trao xong S–S cho protein này và <b>kẹt ở dạng khử</b>. Không ai oxy hóa lại nó, nên <b>protein tiếp theo không có cầu nối di-S</b>. Protein tiết như kháng thể và insulin sẽ gấp sai.');
      if (misf && cur === 6) t.push('⚠️ <b>Chưa gấp xong</b>: glucosidase II cắt Glc cuối, protein rời CNX. Nhưng <b>UGGT</b> (cảm biến gấp nếp) nhận ra đoạn kỵ nước lộ ra và <b>gắn lại 1 Glc</b>, nên protein quay lại CNX. Vòng lặp này cứ thế tiếp diễn, trong khi mannosidase âm thầm cắt mannose (bước 8). CFTR ΔF508 bị giữ lại đúng theo cách này.');
      if (bort && cur === 8) t.push('❌ <b>Proteasome bị chặn</b> (bortezomib): protein đã gắn poly-Ub nhưng <b>không bị phân hủy</b>, nên ứ đọng ở tế bào chất. ER cũng tắc theo. Tế bào đa u tủy (tiết nhiều kháng thể) chịu không nổi và chết; đó là cơ sở dùng bortezomib trong điều trị.');
      api.readout(t.join('<br>') || 'Thử nghiệm: mỗi công tắc 💥 chỉ hiện ở bước liên quan. Bật lên rồi xem 3D thay đổi.');
    }
    function show(keys) { const s = keys.join(','); if (s !== sig) { sig = s; L.only(keys); } }

    const P = beads.map(() => V()), tA = V(), tB = V(), tmp = V(), tmp2 = V();
    const BLOBS = [ost, bip, gluI, gluII, cnx, pdi, ero1, uggt, mns, os9, e2, partA, partB];
    const want = new Map();
    const place = (b, on, pos) => { if (on) want.set(b, pos.clone()); };
    const glycanOn = () => !tuni;

    function frame(dt, t, snap) {
      const f = ph.v, keys = [];
      let k = N;                              // visible beads
      let glyRoot = null, glyRot = -Math.PI / 4, glyVis = glycanOn() && cur >= 1;
      let sugarOn = TREE.map(() => true);
      let ssG = false, ssB = false, msg = '', dolOn = cur <= 1;
      let pdiOx = true, mix = null;          // mix = bead index bonded to PDI
      let cnxOn = false, atpOn = false, ubN = 0, ubFree = false, pepN = 0;
      let trimer = 0, lift = 0, exitT = 0;
      want.clear();
      const shape = (A, B, s, off) => { for (let i = 0; i < N; i++) P[i].copy(A[i]).lerp(B[i], s).add(off); };

      if (cur <= 1) {
        // translation through Sec61; glycan transfer when Asn emerges
        k = cur === 0 ? 1 + Math.round(5 * ease(clamp(f / 0.8))) : 6 + Math.round(18 * clamp(f / 0.85));
        for (let i = 0; i < N; i++) { if (i < k) pathU((k - 1 - i) * 0.42, P[i]); else P[i].copy(EXIT).add(V(0, -1.2, 0)); }
        keys.push('ribo', 'sec', 'lumen', 'cyto');
        if (cur === 0) { if (f > 0.6) keys.push('cys'); }
        else {
          const tr = ease(clamp((f - 0.12) / 0.3));
          if (!tuni) {
            place(ost, f < 0.6, V(-7.7, MY + 1.7, -0.9));
            glyRoot = tmp.copy(DOL).lerp(P[ASN], tr).clone(); glyRot = lerp(0, -Math.PI / 4, tr);
            if (f < 0.5) keys.push('ost', 'dol'); if (tr > 0.9) keys.push('asn');
          } else { msg = '❌ Tunicamycin: dolichol không mang khối đường → không có gì để gắn'; dolOn = true; }
          if (f > 0.6) keys.push('hyd');
        }
      } else if (cur === 2) {
        // move to work-place, BiP binds hydrophobic stretch, partial fold
        const g0 = ease(clamp(f / 0.25));
        const fold = 0.35 * ease(clamp((f - 0.6) / 0.35));
        for (let i = 0; i < N; i++) { pathU((N - 1 - i) * 0.42, tA); tB.copy(LZ[i]).lerp(F[i], fold).add(W); P[i].copy(tA).lerp(tB, g0); }
        glyRot = lerp(-Math.PI / 4, Math.PI, g0);
        const hydC = tmp2.copy(P[8]).add(P[9]).add(P[10]).multiplyScalar(1 / 3);
        const bOn = f > 0.2 && f < 0.75;
        place(bip, bOn, hydC.clone().add(V(0, 1.0, 0.5)));
        atpOn = bOn && f > 0.3; atp.position.copy(hydC).add(V(0.8, 1.6, 0.6));
        keys.push('lumen'); if (bOn) keys.push('bip', 'hyd');
        if (tuni) { msg = '❌ Không có N-glycan'; }
      } else if (cur === 3) {
        // glucose trimming, calnexin binding
        const fold = lerp(0.35, 0.6, ease(clamp(f / 0.9)));
        shape(LZ, F, fold, W); glyRot = Math.PI;
        if (!tuni) {
          sugarOn[GLC3] = f < 0.25; sugarOn[GLC2] = f < 0.48;
          if (f < 0.3) { place(gluI, f > 0.05, sugarWorld(GLC3, tmp).add(V(-1.0, 0, 0.3))); keys.push('glu1'); }
          else if (f < 0.52) { place(gluII, true, sugarWorld(GLC2, tmp).add(V(-1.0, 0, 0.3))); keys.push('glu2'); }
          cnxOn = f > 0.55; if (cnxOn) keys.push('cnx');
        } else {
          shape(LZ, M, ease(clamp(f / 0.6)), W);
          msg = '❌ Không có Glc₁ → calnexin không giữ được → vón cục, stress ER';
          keys.push('hyd');
        }
      } else if (cur === 4) {
        // PDI oxidative folding + Ero1
        const fold = lerp(0.6, 1, ease(clamp((f - 0.3) / 0.35)));
        shape(LZ, F, fold, W); glyRot = Math.PI; cnxOn = !tuni;
        const park = V(W.x + 2.6, W.y - 0.3, 0.6), ero = V(4.2, 0.6, 0.4);
        let pp0 = park;
        if (f < 0.2) pdiOx = true;
        else if (f < 0.42) { pdiOx = false; mix = 6; }
        else { pdiOx = false; ssG = true; }
        if (f > 0.6 && !noEro) { const g = ease(clamp((f - 0.6) / 0.2)); pp0 = park.clone().lerp(ero, g); place(ero1, true, ero.clone().add(V(1.5, 0.1, -0.4))); keys.push('ero1'); }
        if (f > 0.85 && !noEro) pdiOx = true;
        place(pdi, true, pp0);
        keys.push('pdi'); if (ssG) keys.push('ss'); if (f < 0.4) keys.push('cys');
        setT('pdi', pdiOx ? 'PDI ox (S–S)' : mix != null ? 'cầu nối trung gian' : 'PDI red (2 –SH)');
        if (noEro && f > 0.85) msg = '❌ Thiếu Ero1 → PDI kẹt ở dạng khử';
      } else if (cur === 5) {
        // PDI isomerase fixes a wrong disulfide
        const fix = ease(clamp((f - 0.4) / 0.35));
        shape(M, F, fix, W); glyRot = Math.PI; cnxOn = !tuni;
        pdiOx = false;
        ssB = f < 0.35; if (f >= 0.25 && f < 0.6) mix = 6; ssG = f > 0.6;
        place(pdi, f > 0.1 && f < 0.85, V(W.x + 2.4, W.y - 0.2, 0.6));
        if (ssB) keys.push('bad'); if (ssG) keys.push('ss'); if (f > 0.1 && f < 0.85) keys.push('pdi');
        setT('pdi', mix != null ? 'PDI red phá cầu sai' : 'PDI red (isomerase)');
      } else if (cur === 6) {
        glyRot = Math.PI; ssG = true;
        sugarOn[GLC3] = sugarOn[GLC2] = false;
        if (!misf) {
          shape(F, F, 0, W);
          sugarOn[GLC1] = f < 0.18; cnxOn = f < 0.3;
          if (f < 0.2) { place(gluII, true, sugarWorld(GLC1, tmp).add(V(-0.7, 0, 0.5))); keys.push('glu2'); }
          sugarOn[11] = f < 0.3;
          if (f > 0.2 && f < 0.35) { place(mns, true, sugarWorld(11, tmp).add(V(0.7, 0, 0.5))); }
          lift = 0.8 * ease(clamp((f - 0.25) / 0.15)); trimer = ease(clamp((f - 0.4) / 0.25)); exitT = ease(clamp((f - 0.72) / 0.28));
          if (f > 0.3 && f < 0.75) keys.push('man8');
          if (trimer > 0.5) keys.push('tri');
        } else {
          shape(M, M, 0, W);
          const back = f > 0.6;
          sugarOn[GLC1] = f < 0.2 || f > 0.55; cnxOn = f < 0.3 || f > 0.7; lift = (f > 0.25 && f < 0.75) ? 0.6 : 0;
          if (f < 0.2) { place(gluII, true, sugarWorld(GLC1, tmp).add(V(-0.7, 0, 0.5))); keys.push('glu2'); }
          if (f > 0.35 && f < 0.7) { place(uggt, true, sugarWorld(GLC1, tmp).add(V(-1.3, 0.1, 0.4))); keys.push('uggt'); }
          keys.push('hyd'); if (back) msg = '↺ Quay lại calnexin: chưa đạt, chưa được đi';
        }
        if (tuni) { msg = '❌ Không có glycan → không có kiểm soát CNX; protein ứ đọng'; }
      } else if (cur === 7) {
        // mannose timer -> OS-9
        shape(M, M, 0, W); glyRot = Math.PI; ssG = false;
        sugarOn[GLC1] = sugarOn[GLC2] = sugarOn[GLC3] = false;
        const nCut = Math.min(4, Math.floor(clamp((f - 0.05) / 0.6) * 5));
        MAN_TRIM.forEach((j, n) => { sugarOn[j] = n >= nCut; });
        keys.push('hyd');
        if (tuni) msg = '❌ Không có glycan → không có “đồng hồ” mannose';
        else {
          if (nCut < 4) { place(mns, true, sugarWorld(MAN_TRIM[Math.min(3, nCut)], tmp).add(V(0.7, 0.1, 0.5))); keys.push('mns'); }
          setT('clock', ['Man₉', 'Man₈', 'Man₇', 'Man₆', 'Man₅'][nCut]); keys.push('clock'); at('clock', beads[ASN].position, -2.4, -1.5);
          if (f > 0.72) { place(os9, true, sugarWorld(12, tmp).add(V(0.5, -0.7, 0.5))); keys.push('os9'); }
        }
      } else if (cur === 8) {
        // ERAD
        glyRot = Math.PI; sugarOn = sugarOn.map(() => false); [0, 1, 2, 3, 9, 10, 12].forEach(j => { sugarOn[j] = true; });
        const g0 = ease(clamp(f / 0.15));
        const dBead = DL[2] + 1.3 + 2 * 0.42;                   // bead 2 one unit into the cytosol lane
        const d0 = f < 0.45 ? lerp(0, dBead, ease(clamp((f - 0.12) / 0.33))) : f < 0.65 ? dBead : lerp(dBead, DL[2] + 7 + 23 * 0.42, ease(clamp((f - 0.65) / 0.33)));
        for (let i = 0; i < N; i++) {
          pathD(d0 - i * 0.42, tB); if (d0 - i * 0.42 < 0) tB.copy(DP[0]).add(tmp.copy(DP[0]).sub(DP[1]).normalize().multiplyScalar(i * 0.42 - d0));
          if (bort && tB.x > 7.8) tB.x = 7.8 - 0.25 * ((i * 7) % 3);
          tA.copy(M[i]).add(W); P[i].copy(tA).lerp(tB, g0);
        }
        k = N; for (let i = 0; i < N; i++) if (!bort && P[i].x > 8.2) beads[i].visible = false;
        ubN = f > 0.45 ? Math.min(4, 1 + Math.floor((f - 0.45) / 0.05)) : 0;
        ubFree = !bort && P[2].x > 8;
        if (f > 0.42 && f < 0.66) { place(e2, true, P[2].clone().add(V(-1.0, -1.2, 0.6))); keys.push('ub'); }
        pepN = !bort && f > 0.75 ? Math.min(5, Math.floor((f - 0.75) / 0.04)) : 0;
        keys.push('hrd1', 'prot', 'cyto'); if (pepN > 0) keys.push('pep'); if (ubFree) keys.push('ubR'); else if (ubN && f >= 0.66) keys.push('ub');
        glyVis = glycanOn() && P[ASN].y > MY + 1.5;
        if (bort && f > 0.7) msg = '❌ Proteasome bị chặn: protein gắn Ub ứ đọng';
      }

      // ---- apply beads ----
      for (let i = 0; i < N; i++) { beads[i].position.copy(P[i]); if (cur !== 8) beads[i].visible = i < k; else if (bort || P[i].x <= 8.2) beads[i].visible = true; }
      // trimer partners / lift / exit (step 6)
      if (cur === 6 && !misf) {
        const off = V(0, lift, 0).add(V(3.2, 0.9, 0).multiplyScalar(exitT));
        for (let i = 0; i < N; i++) beads[i].position.add(off);
        const c = V(W.x, W.y, 0).add(off);
        place(partA, trimer > 0.01, c.clone().add(V(lerp(5, 2.05, trimer), lerp(1.5, 0, trimer), -0.4)));
        place(partB, trimer > 0.01, c.clone().add(V(lerp(-2, 1.0, trimer), lerp(4, 0, trimer), lerp(-1, -1.75, trimer))));
        at('tri', c, 1, 2.3);
      } else if (cur === 6 && lift) for (let i = 0; i < N; i++) beads[i].position.y += lift;
      for (let i = 1; i < N; i++) { sticks[i - 1].visible = beads[i].visible && beads[i - 1].visible; if (sticks[i - 1].visible) api.setStick(sticks[i - 1], beads[i - 1].position, beads[i].position); }
      // glycan
      gt.visible = glyVis;
      if (glyVis) {
        gt.position.copy(glyRoot || beads[ASN].position); gt.rotation.z = glyRot;
        if (!glyRoot && cur <= 1 && !tuni) gt.position.copy(DOL);
        sugars.forEach((s, j) => showSugar(j, sugarOn[j]));
        const glow = cur === 6 && misf && f > 0.45 && f < 0.75 ? 0x335577 : 0;
        sugars[GLC1].m.material.emissive.setHex(glow);
      }
      if (cur === 1 && !tuni && !glyRoot) { gt.visible = true; gt.position.copy(DOL); gt.rotation.z = 0; }
      dol.visible = pp[0].visible = pp[1].visible = dolOn;
      // calnexin anchored to membrane, under the Glc1
      if (cnxOn && glyVis) { const g1 = sugarWorld(GLC1, tmp); place(cnx, true, V(g1.x, g1.y - 0.55, 0)); cnxTM.visible = true; api.setStick(cnxTM, V(g1.x, MY - 0.8, 0), V(g1.x, g1.y - 0.6, 0)); }
      else cnxTM.visible = false;
      // PDI sulfurs and bonds
      const pdiP = want.has(pdi) ? pdi.position : null;
      SA.visible = SB.visible = !!pdiP; pdiSS.visible = !!pdiP && pdiOx; mixSS.visible = !!pdiP && mix != null;
      if (pdiP) {
        SA.position.copy(pdiP).add(V(-0.7, 0.25, 0.3)); SB.position.copy(pdiP).add(V(-0.7, pdiOx ? -0.12 : -0.4, 0.3));
        if (pdiOx) api.setStick(pdiSS, SA.position, SB.position);
        if (mix != null) api.setStick(mixSS, SA.position, beads[mix].position);
      }
      ssGood.visible = ssG; if (ssG) api.setStick(ssGood, beads[6].position, beads[12].position);
      ssBad.visible = ssB; if (ssB) api.setStick(ssBad, beads[6].position, beads[17].position);
      if (ssG) at('ss', beads[12].position, 0.3, 1.3); if (ssB) at('bad', beads[17].position, 1.3, 0.5);
      // ATP spark, Ub chain, peptides
      atp.visible = atpOn; if (atpOn) atp.scale.setScalar(0.8 + 0.4 * Math.sin(t * 8));
      ubs.forEach((u, j) => {
        u.visible = j < ubN;
        if (!u.visible) return;
        if (ubFree) u.position.set(6.4 - 0.45 * j, -7.1 + 0.15 * Math.sin(j), 0.5);
        else u.position.copy(beads[2].position).add(V(-0.3 - 0.35 * j, -0.4 - 0.32 * j, 0.3));
      });
      at('ub', ubs[0].visible ? ubs[Math.max(0, ubN - 1)].position : beads[2].position, -1.4, -0.5);
      at('ubR', ubs[0].position, -0.7, -0.6);
      peps.forEach((p, j) => { p.visible = j < pepN; p.position.set(11.4 + 0.5 * j, -5.8 + 0.35 * Math.sin(j * 2.3), 0.3 * Math.cos(j)); p.rotation.z = j; });
      protCore.forEach(c => c.material.color.setHex(bort && cur === 8 ? C.grey : 0x8e7cc3));
      // blobs move
      const kk = snap ? 1 : 1 - Math.exp(-dt * 6);
      for (const b of BLOBS) { const on = want.has(b); vis(b, on); b.position.lerp(on ? want.get(b) : OFF, kk); }
      // label anchors
      const tp = (b) => want.get(b) || b.position;   // anchor to where the blob is going, so labels don't fly in with it
      at('ost', tp(ost), -2.2, -0.2); at('bip', tp(bip), -2.4, 0.3); at('glu1', tp(gluI), -0.3, 0.9); at('glu2', tp(gluII), -0.3, 0.9);
      at('cnx', tp(cnx), -1.9, -0.2); at('pdi', tp(pdi), 0.5, -1.2); at('ero1', tp(ero1), 0.4, 1.1); at('uggt', tp(uggt), -0.6, -1.0);
      at('mns', tp(mns), 0.6, 1); at('os9', tp(os9), 1.3, -0.6); at('asn', beads[ASN].position, -1.6, 0.4); at('man8', beads[ASN].position, -1.8, -1.2);
      at('cys', beads[6].position, 1.2, -0.3); at('hyd', beads[9].position, 0, cur <= 1 ? -1.1 : -0.75);
      L.get('cyto').position.set(cur === 8 ? 1.8 : -3, cur === 8 ? -9.4 : -7.3, 0);
      if (msg) { L.get('msg').position.set(cur === 8 ? 5 : cur <= 1 ? -6 : cur === 6 ? 2.5 : 0.5, cur === 8 ? 1.4 : cur <= 1 ? 3.8 : cur === 6 ? -2.6 : 5.4, 0); setT('msg', msg); keys.push('msg'); }
      show(keys);
    }

    const ctl = {
      setStep(s) {
        cur = s; ph.snap(0, 1); sig = '';
        if (tuni && !(s >= 1 && s <= 3)) { tuni = false; tg.tuni.set(false); }
        if (noEro && s !== 4) { noEro = false; tg.ero.set(false); }
        if (misf && s !== 6) { misf = false; tg.misf.set(false); }
        if (bort && s !== 8) { bort = false; tg.bort.set(false); }
        tg.tuni.el.style.display = s >= 1 && s <= 3 ? '' : 'none';
        tg.ero.el.style.display = s === 4 ? '' : 'none';
        tg.misf.el.style.display = s === 6 ? '' : 'none';
        tg.bort.el.style.display = s === 8 ? '' : 'none';
        beads.forEach(b => { b.visible = true; });
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
