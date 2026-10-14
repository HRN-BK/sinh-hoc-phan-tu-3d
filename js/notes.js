// notes.js: "Câu cô hỏi trên lớp" page. Short answers + foundation per question, grouped by chapter.
// Each q: {en, vi, a:[bullets], base, fix?, link:[[id, label], …]}

const L = (id, n) => `<a href="#/l/${id}">Bài ${n}</a>`;

export const NOTES = [
  {
    ch: 'Chương 1 · Đại phân tử sinh học',
    base: `Không có câu hỏi riêng, nhưng mọi chương sau đều dựa vào đây:
      <ul><li><b>Nucleotide</b> = base + đường + phosphate. DNA có đường deoxyribose (C2′ là <b>–H</b>); RNA có ribose (C2′ là <b>–OH</b>), nên RNA kém bền hơn.</li>
      <li>Hai mạch DNA <b>đối song song</b> (5′→3′ đi với 3′→5′). <b>A=T</b> có 2 liên kết H, <b>G≡C</b> có 3, nên DNA càng giàu GC thì <b>Tm</b> càng cao.</li>
      <li>Protein có 4 bậc cấu trúc. Bậc 1 là trình tự amino acid nối bằng liên kết peptide; bậc 3 được giữ bằng tương tác kỵ nước, liên kết H và cầu <b>S–S</b>.</li>
      <li>Nhiệt làm DNA <b>biến tính</b> (tách 2 mạch); khi nguội từ từ, DNA <b>hồi tính</b> (bắt cặp lại).</li></ul>`,
    link: [['nucleic', 2], ['macro', 3], ['denature', 4]],
    qs: [],
  },
  {
    ch: 'Chương 2 · DNA & sao chép DNA',
    base: `<ul><li>Sao chép theo kiểu <b>bán bảo tồn</b>: mỗi DNA con có 1 mạch cũ và 1 mạch mới.</li>
      <li>DNA polymerase chỉ <b>nối thêm vào đầu 3′-OH</b> (tổng hợp 5′→3′) và <b>cần mồi</b>. Vì vậy có mạch nhanh (liên tục) và mạch chậm (đoạn Okazaki).</li>
      <li>Thứ tự ở chạc ba: topoisomerase (đi trước) → helicase → SSB → primase → Pol III → Pol I (thay mồi) → ligase.</li>
      <li>"Ổn định" là giữ đúng thông tin; "linh động" là tạo ra biến dị. Cả chương xoay quanh 2 ý này.</li></ul>`,
    link: [['fork', 6], ['initiation', 7]],
    qs: [
      {
        en: 'Stability vs flexibility of DNA: which is more important? What if DNA had no flexibility?',
        vi: 'Ổn định hay linh động quan trọng hơn? DNA không linh động thì sao?',
        a: [
          '<b>Ổn định</b> (stability): giữ thông tin đúng qua các thế hệ nhờ mạch đôi, sửa lỗi đọc, sửa chữa DNA và khả năng hồi tính.',
          '<b>Linh động</b> (flexibility): tạo biến dị để thích nghi khi môi trường đổi, nhờ đột biến, tái tổ hợp và gene nhảy.',
          '<b>Cần cả hai, cân bằng.</b> Không linh động thì không có biến dị, môi trường đổi là loài không thích nghi được rồi bị đào thải. Quá linh động thì đột biến tích lũy, gây ung thư hoặc chết.',
        ],
        base: 'Ổn định thể hiện ở Bài 8 (sửa chữa); linh động thể hiện ở Bài 9 (gene nhảy).',
        link: [['repair', 8], ['transposon', 9]],
      },
      {
        en: 'What is the step "before" helicase in DNA replication?',
        vi: 'Bước nào đứng "trước" helicase?',
        a: [
          'Ý cô: <b>topoisomerase</b> (ở vi khuẩn là gyrase). Nó chạy <b>phía trước</b> helicase để tháo xoắn dương (siêu xoắn) mà helicase tạo ra khi mở mạch. Thiếu nó, DNA phía trước bị xoắn chặt và chạc ba dừng lại.',
        ],
        fix: 'Nếu hiểu "trước" là <b>thời gian</b>, ở E. coli: <b>DnaA</b> bám oriC và mở vùng giàu A–T, sau đó <b>DnaC</b> nạp helicase <b>DnaB</b> vào. Đi thi nên viết cả hai ý: vị trí là topoisomerase, thời gian là DnaA/DnaC.',
        base: 'Helicase chỉ tách 2 mạch; nó không xử lý được độ xoắn tích tụ phía trước, nên phải có topoisomerase.',
        link: [['fork', 6], ['initiation', 7]],
      },
      {
        en: 'Why do eukaryotes have many ori sites?',
        vi: 'Vì sao nhân thực có nhiều ori?',
        a: [
          '<b>Ý chính là tốc độ.</b> Hệ gene nhân thực rất lớn, chạc ba lại chậm (~50 nt/s, so với ~1000 nt/s ở vi khuẩn), trong khi pha S có hạn. Chỉ có 1 ori thì phải mất ~17 ngày mới chép xong.',
          'Có nhiều ori thì có nhiều chạc ba chạy song song, mỗi chạc chỉ chép một đoạn ngắn. Nếu một chạc bị kẹt, ori bên cạnh chép bù đoạn đó.',
          'Ý cô thêm: nhiều polymerase chia nhau chép thì sai sót được hạn chế hơn. Viết sau ý tốc độ.',
        ],
        base: 'Vi khuẩn có NST vòng nhỏ (~4,6 Mb) với 1 oriC, chép xong trong ~40 phút.',
        link: [['initiation', 7]],
      },
      {
        en: 'Why not unwind the whole chromosome first, then copy each strand 5′→3′?',
        vi: 'Sao không tháo hết cả NST rồi mới chép?',
        a: [
          '<b>DNA mạch đơn kém bền</b>: nó dễ tự bắt cặp lại (hồi tính) hoặc gập thành kẹp tóc, và dễ bị nuclease hay tác nhân gây hại tấn công.',
          'Tháo toàn bộ một lúc sẽ tạo siêu xoắn khổng lồ mà topoisomerase không xử lý kịp.',
          'Vì vậy tế bào chỉ mở <b>cục bộ ở chạc ba</b>, phủ SSB lên đoạn mạch đơn ngắn, rồi chép ngay.',
        ],
        base: 'Dạng mạch đôi bền hơn về năng lượng, nên hai mạch đơn luôn "muốn" bắt cặp lại.',
        link: [['fork', 6], ['denature', 4]],
      },
      {
        en: 'Early in evolution only RNA existed. Why did DNA need to exist?',
        vi: 'Ban đầu chỉ có RNA, vậy tại sao cần DNA?',
        a: [
          'DNA <b>không có 2′-OH</b>, nên khung đường–phosphate khó bị thủy phân. Nó bền hơn RNA, hợp để <b>lưu trữ lâu dài</b>.',
          '<b>Mạch đôi</b> chứa 2 bản thông tin. Khi 1 mạch hỏng, mạch kia làm khuôn để sửa.',
          'DNA dùng <b>T thay U</b>. Nếu C bị khử amin thành U, tế bào nhận ra ngay U là "lạ" và sửa bằng BER (uracil-DNA glycosylase). Nếu DNA dùng U thì không phân biệt được.',
        ],
        base: 'RNA vẫn giữ các vai trò cần linh hoạt: truyền tin (mRNA), xúc tác (rRNA), điều hòa (miRNA).',
        link: [['nucleic', 2], ['repair', 8]],
      },
      {
        en: 'Why must a big base pair with a small base (purine–pyrimidine)?',
        vi: 'Sao phải "lớn đi với nhỏ"?',
        a: [
          'Purine (<b>A, G</b>, 2 vòng) luôn bắt cặp với pyrimidine (<b>T, C</b>, 1 vòng), nên chiều rộng chuỗi xoắn <b>luôn ~2 nm</b>. Hai purine thì quá rộng, hai pyrimidine thì quá hẹp.',
          'Vị trí cho/nhận liên kết H chỉ khớp ở cặp A–T (2 liên kết) và G–C (3 liên kết).',
          'Ý cô nhấn mạnh: cặp chuẩn có <b>hình học đúng</b>, vừa khít trung tâm hoạt động của DNA polymerase. Cặp sai bị loại ra, đây là một cơ chế giữ độ chính xác khi sao chép.',
        ],
        base: 'Đây là quy tắc Chargaff: A = T và G = C.',
        link: [['nucleic', 2]],
      },
      {
        en: 'Intron and exon? Why do we need introns?',
        vi: 'Intron, exon là gì; vì sao cần intron?',
        a: [
          '<b>Exon</b> là đoạn được giữ lại trong mRNA trưởng thành. <b>Intron</b> là đoạn bị spliceosome cắt bỏ khỏi pre-mRNA.',
          'Intron cho phép <b>cắt nối thay thế</b> (alternative splicing): một gene ghép exon theo nhiều cách, cho <b>nhiều dạng protein</b>, làm protein đa dạng.',
          'Thêm: intron giúp xáo trộn exon trong tiến hóa và chứa trình tự điều hòa; một số miRNA nằm trong intron.',
        ],
        fix: 'Bẫy: exon ≠ vùng mã hóa. 5′UTR và 3′UTR cũng nằm trong exon.',
        base: 'Chỉ nhân thực có cắt intron. Vi khuẩn hầu như không có intron.',
        link: [['processing', 13]],
      },
      {
        en: 'Mobile and immobile genes? Advantages and disadvantages?',
        vi: 'Gene nhảy và gene cố định: lợi, hại?',
        a: [
          '<b>Gene cố định</b> nằm yên một chỗ, biểu hiện ổn định. <b>Gene nhảy</b> (transposon) tự chuyển sang vị trí khác trong hệ gene.',
          '<b>Lợi</b> của gene nhảy: tạo biến dị và nhân đôi gene, nên là nguyên liệu cho tiến hóa. Ở vi khuẩn, chúng giúp lan gene <b>kháng kháng sinh</b>. Chúng còn là công cụ để gây đột biến hoặc chuyển gene.',
          '<b>Hại</b>: chèn vào giữa gene hoặc promoter làm gene hỏng (gây bệnh), và gây đứt gãy, sắp xếp lại NST. Tế bào khóa chúng bằng methyl hóa DNA và piRNA.',
        ],
        base: 'Có 2 lớp: Lớp I là retrotransposon, "chép–dán" qua RNA. Lớp II là DNA transposon, "cắt–dán" nhờ transposase.',
        link: [['transposon', 9]],
      },
      {
        en: 'How does DNA helicase unwind the duplex?',
        vi: 'Helicase mở xoắn bằng cách nào?',
        a: [
          'Helicase là <b>vòng 6 tiểu đơn vị</b> ôm lấy 1 mạch và hoạt động như <b>motor</b>.',
          '<b>Thủy phân ATP</b> làm helicase đổi hình dạng, nhờ đó nó bò dọc mạch (DnaB đi 5′→3′, MCM đi 3′→5′). Nó chen giữa 2 mạch như cái nêm và <b>phá liên kết H</b>.',
          'SSB phủ lên mạch đơn ngay sau đó để 2 mạch không bắt cặp lại.',
        ],
        base: 'Helicase dùng năng lượng ATP, còn polymerase dùng năng lượng từ dNTP (cắt ra PPi).',
        link: [['fork', 6]],
      },
      {
        en: 'Functions of DNA polymerases?',
        vi: 'DNA polymerase làm gì?',
        a: [
          '<b>Tổng hợp</b>: gắn dNTP bổ sung với khuôn vào <b>đầu 3′-OH</b> của mạch đang dài ra (5′→3′). Cần khuôn và mồi.',
          '<b>Sửa lỗi đọc</b> (exonuclease 3′→5′): gắn sai thì polymerase khựng lại, đầu 3′ chuyển sang vùng exo, nucleotide sai bị cắt bỏ, rồi đầu 3′ quay lại tổng hợp tiếp.',
          'Pol I còn có exonuclease <b>5′→3′</b> để gỡ mồi RNA.',
        ],
        base: 'Sửa lỗi đọc giảm lỗi khoảng 100 lần. Hệ sửa bắt cặp sai (câu 13) giảm thêm lần nữa.',
        link: [['fork', 6]],
      },
      {
        en: 'Control of replication: eukaryotes vs prokaryotes?',
        vi: 'Kiểm soát sao chép ở nhân sơ và nhân thực khác gì?',
        a: [
          '<b>Nhân sơ</b>: kiểm soát qua <b>methyl hóa ở oriC</b>. Ngay sau khi chép, GATC ở oriC chỉ có methyl trên mạch cũ (bán methyl hóa). <b>SeqA</b> bám giữ oriC lúc này, nên DnaA không khởi đầu lại ngay được.',
          '<b>Nhân thực</b> cần thêm <b>phức hợp cấp phép</b> (licensing). Ở G1, <b>ORC + Cdc6 + Cdt1</b> nạp vòng <b>MCM</b> lên ori. Sang pha S, CDK kích hoạt MCM, đồng thời CDK và geminin ngăn nạp MCM mới. Nhờ vậy mỗi chu kỳ mỗi ori chỉ chép <b>đúng 1 lần</b>.',
        ],
        base: 'Nhân thực có hàng chục nghìn ori, nên ori nào chép 2 lần sẽ gây thừa đoạn DNA. Vì vậy cần khóa "1 lần/chu kỳ".',
        link: [['epiprok', 15], ['initiation', 7]],
      },
      {
        en: 'Denaturation/renaturation. Why autoclave the tubes but not sterilize the room air?',
        vi: 'Biến tính/hồi tính; sao hấp ống nghiệm mà không cần khử trùng phòng?',
        a: [
          'DNA <b>biến tính</b> khi nhiệt cao (hoặc do helicase) và <b>hồi tính</b> khi điều kiện trở lại bình thường, vì 2 mạch bổ sung tự bắt cặp lại. Phần lớn protein thì khó gấp lại đúng sau khi biến tính mạnh.',
          'Làm thí nghiệm nucleic acid là làm với <b>phân tử</b>, không nuôi tế bào sống. Vi khuẩn trong không khí ít ảnh hưởng: chúng không mọc được trong phản ứng, và PCR có nhiệt cao.',
          'Kẻ thù thật là <b>DNase và RNase</b> dính trong ống hay đầu tip, vì chúng phân hủy sản phẩm. Vì vậy cần hấp (121 °C) dụng cụ.',
        ],
        fix: 'RNase là ngoại lệ: bị biến tính xong nó <b>tự gấp lại</b> và hoạt động lại (Anfinsen, RNase A). Vì vậy chỉ hấp thôi là chưa đủ; làm với RNA phải dùng đồ "RNase-free" hoặc nước xử lý DEPC.',
        base: 'Tm phụ thuộc %GC. Khi DNA biến tính, độ hấp thụ ở 260 nm tăng (hiệu ứng tăng sắc).',
        link: [['denature', 4]],
      },
      {
        en: 'A mismatch is found after replication. How does the cell know which strand is wrong?',
        vi: 'Sau sao chép, làm sao biết mạch nào sai?',
        a: [
          'Lỗi sao chép gần như luôn nằm ở <b>mạch mới</b>, nên tế bào cần biết mạch nào mới.',
          'Ở E. coli, enzyme <b>Dam</b> methyl hóa A ở trình tự <b>GATC</b>. Ngay sau sao chép, mạch cũ đã có methyl còn mạch mới thì chưa (DNA <b>bán methyl hóa</b>), nên mạch <b>chưa methyl</b> là mạch mới.',
          '<b>MutS</b> nhận ra chỗ bắt cặp sai, <b>MutL</b> nối tín hiệu, <b>MutH</b> rạch mạch chưa methyl ở GATC gần nhất. Đoạn mạch đó bị cắt bỏ, rồi polymerase và ligase chép lại cho đúng.',
        ],
        fix: 'Ghi chú gốc viết "đếm số nhóm methyl", nhưng chính xác là <b>mạch nào có/chưa có methyl</b> ở GATC. Nhân thực không có Dam/MutH; họ nhận ra mạch mới nhờ các vết đứt (nick) và đầu đoạn Okazaki.',
        base: 'Đây là hệ <b>sửa bắt cặp sai theo methyl</b> (methyl-directed mismatch repair). Nếu lỗi chưa được sửa trước lần sao chép tiếp theo, nó thành đột biến cố định ở cả 2 mạch.',
        link: [['epiprok', 15]],
      },
      {
        en: 'How can homologous recombination still make mistakes when repairing a DSB?',
        vi: 'Sao HR vẫn có thể sai?',
        a: [
          'HR có bước <b>xâm lấn mạch</b> (strand invasion): đầu 3′ mạch đơn đi "dò" tìm trình tự tương đồng để bắt cặp.',
          'Nếu ở chỗ khác có <b>trình tự lặp gần giống</b> (Alu, LINE, họ gene), đầu này có thể bắt cặp nhầm. Kết quả là mất đoạn, lặp đoạn hoặc chuyển đoạn NST.',
          'Nếu dùng <b>NST tương đồng</b> thay vì chị em làm khuôn, alen có thể bị chép đè, gây mất dị hợp tử (LOH). Đây là một con đường dẫn tới ung thư.',
        ],
        base: 'HR chính xác nhất khi dùng <b>chromatid chị em</b> làm khuôn (sau pha S). NHEJ thì nối thẳng 2 đầu, nhanh nhưng dễ mất nucleotide.',
        link: [['repair', 8]],
      },
      {
        en: 'Retrotransposons vs transposons: which is better or more dangerous?',
        vi: 'Retrotransposon hay transposon tốt/nguy hiểm hơn?',
        a: [
          '<b>Không có "tốt hơn"</b>. Hai lớp có cơ chế khác nhau, nên chỉ phù hợp với mục đích khác nhau.',
          '<b>Lớp I (retrotransposon)</b> "chép–dán": DNA → RNA → DNA (nhờ phiên mã ngược) → chèn vào chỗ mới. <b>Bản gốc vẫn còn nguyên</b>, nên phù hợp khi muốn giữ nguyên "bên cho". Nhược điểm là số bản sao tăng dần, nên càng nhiều chỗ chèn có thể gây hại.',
          '<b>Lớp II (DNA transposon)</b> "cắt–dán" nhờ transposase: chỗ cũ để lại <b>vết đứt mạch đôi</b> phải sửa, nên nguy cho bên cho. Bù lại, nó ít bước (không có phiên mã hay phiên mã ngược dễ sai), nên đoạn gene di chuyển <b>ít đột biến</b> hơn.',
        ],
        fix: 'Ghi chú gốc viết "class 1 (DNA retrotransposon)": chữ "DNA" là thừa. Lớp I đúng là <b>retrotransposon</b> (đi qua RNA); "DNA transposon" là tên của lớp II.',
        base: 'Khoảng 45% hệ gene người là trình tự gốc gene nhảy, chủ yếu lớp I (LINE, Alu).',
        link: [['transposon', 9]],
      },
    ],
  },
  {
    ch: 'Chương 3 · Phiên mã',
    base: `<ul><li><b>Promoter</b> là DNA nằm <b>trước +1</b>, nơi RNA polymerase bám vào. Nó <b>không</b> nằm trong mRNA. <b>AUG</b> là codon trên mRNA, nằm sau +1, nơi ribosome bắt đầu dịch mã.</li>
      <li>RNA polymerase đọc mạch khuôn 3′→5′ và tổng hợp RNA 5′→3′. Nó <b>không cần mồi</b> và tự mở xoắn DNA.</li>
      <li>Điều hòa chủ yếu ở bước <b>khởi đầu</b>.</li></ul>`,
    link: [['dogma', 1], ['txprok', 10], ['txeuk', 12]],
    qs: [
      {
        en: 'Concept of a gene?',
        vi: 'Gene là gì?',
        a: [
          'Gene là <b>đoạn DNA mang thông tin tạo ra 1 sản phẩm có chức năng</b>: một chuỗi polypeptide <b>hoặc một RNA</b> (rRNA, tRNA, miRNA…).',
          'Gene gồm <b>vùng điều hòa</b> (promoter, enhancer/operator) và <b>vùng được phiên mã</b> (5′UTR, exon, intron, 3′UTR).',
        ],
        fix: 'Bẫy: promoter thuộc gene nhưng <b>không</b> được phiên mã. Không phải gene nào cũng cho ra protein.',
        base: 'Ở nhân sơ, nhiều gene có thể chung 1 promoter (operon) và cho 1 mRNA mang nhiều gene.',
        link: [['dogma', 1]],
      },
      {
        en: 'Cancer: control an oncogene using the variable affinity between RNA pol and the promoter.',
        vi: 'Ung thư: chặn oncogene dựa vào ái lực RNA pol – promoter',
        a: [
          '<b>Ý tưởng</b>: tạo một <b>phân tử cạnh tranh</b> bám promoter của oncogene <b>chặt hơn</b> RNA polymerase (hoặc yếu tố phiên mã). RNA pol không bám được thì không khởi đầu phiên mã, nên gene bị tắt.',
          '<b>Quy trình</b>: (1) giải trình tự promoter; (2) thiết kế các ứng viên có ái lực cao hơn, ví dụ đổi vài amino acid ở vùng bám DNA; (3) <b>docking</b> để sàng lọc; (4) <b>mô phỏng động lực học phân tử</b>, vì docking chỉ cho hình ảnh tĩnh mà ta cần xem tương tác có bền theo thời gian không; (5) thí nghiệm <b>wet lab</b>.',
        ],
        base: 'Promoter càng giống trình tự đồng thuận thì ái lực càng cao và phiên mã càng mạnh. Thực tế có công cụ cùng ý tưởng: <b>CRISPRi</b> (dCas9 bám chặn promoter).',
        link: [['txprok', 10], ['txeuk', 12]],
      },
      {
        en: 'Few RNA polymerases and promoters, but so many genes: how is expression controlled?',
        vi: 'Ít RNA pol mà nhiều gene: điều hòa thế nào?',
        a: [
          'Hầu hết gene dùng <b>chung</b> một loại RNA pol bám promoter. Cái khác nhau là <b>vùng kiểm soát phiên mã</b> riêng của từng gene.',
          'Ở vùng đó, các <b>yếu tố phiên mã đặc hiệu</b> bám vào để tăng hoặc giảm tần suất phiên mã: <b>operator</b> + repressor ở nhân sơ; <b>enhancer/silencer</b> + activator/repressor ở nhân thực, có khi nằm rất xa gene.',
          'Mỗi gene có một tổ hợp vùng kiểm soát riêng, nên được điều hòa riêng, chủ yếu ở bước <b>khởi đầu</b> (và kéo dài).',
        ],
        base: 'Ở nhân thực còn thêm tầng chromatin (Chương 4) quyết định DNA có "mở" cho phiên mã hay không.',
        link: [['operon', 11], ['txeuk', 12]],
      },
      {
        en: 'Why do prokaryotes use the operon model?',
        vi: 'Vì sao nhân sơ dùng operon?',
        a: [
          'Hệ gene nhỏ, cần gọn. Các gene cùng phục vụ <b>một chức năng</b> (ví dụ lacZ, lacY, lacA cùng để dùng lactose) được xếp cạnh nhau, dưới <b>1 promoter + 1 operator</b>.',
          'Kết quả là 1 mRNA mang nhiều gene: <b>bật hoặc tắt cùng lúc</b>, nhanh và tiết kiệm năng lượng.',
        ],
        base: 'Nhân thực thì mỗi gene có promoter riêng, mỗi mRNA mang 1 gene.',
        link: [['operon', 11]],
      },
      {
        en: 'Transcription initiation: eukaryotes vs prokaryotes?',
        vi: 'Khởi đầu phiên mã nhân sơ và nhân thực khác gì?',
        a: [
          '<b>Nhân sơ</b> có 1 loại RNA pol. Enzyme lõi + <b>σ</b> thành holoenzyme; σ <b>tự nhận ra</b> hộp −35 (TTGACA) và −10 (TATAAT), mở DNA ở −10 rồi bắt đầu phiên mã.',
          '<b>Nhân thực</b> có 3 loại RNA pol (I: rRNA, II: mRNA, III: tRNA/5S). Pol II <b>không tự nhận ra promoter</b>: TFIID (có <b>TBP</b>) bám hộp TATA, rồi các TFII khác và Pol II lắp vào thành phức hợp tiền khởi đầu (<b>PIC</b>). TFIIH mở DNA và phosphoryl hóa <b>CTD</b> để Pol II rời promoter.',
          'Nhân thực còn cần enhancer, Mediator và tháo nucleosome. Nhân sơ không có nucleosome, và phiên mã đi cùng lúc với dịch mã.',
        ],
        base: 'Cả hai đều cần protein nhận ra promoter trước khi RNA pol bám vào: σ ở nhân sơ, TBP/TFIID ở nhân thực.',
        link: [['txprok', 10], ['txeuk', 12]],
      },
      {
        n: '6–7',
        en: 'Most important feature of transcription elongation? How is the transcription bubble formed?',
        vi: 'Đặc điểm quan trọng nhất của kéo dài và cách tạo bong bóng phiên mã',
        a: [
          'Đặc điểm quan trọng nhất là <b>bong bóng phiên mã</b> (~13 bp DNA mở ra), di chuyển cùng RNA pol.',
          'Cách tạo: (1) RNA pol <b>tự mở xoắn</b> DNA phía trước nhờ hoạt tính kiểu helicase của chính nó; (2) mạch khuôn đi vào trung tâm hoạt động, tạo đoạn lai RNA–DNA ngắn (~8–9 bp); (3) phía sau, RNA tách ra và RNA pol dẫn 2 mạch DNA <b>đóng xoắn lại</b>.',
        ],
        base: 'Phía trước RNA pol bị xoắn dương, phía sau bị xoắn âm. Topoisomerase gỡ cả hai.',
        link: [['txprok', 10]],
      },
      {
        en: 'Why does eukaryotic initiation need so many factors compared with prokaryotes?',
        vi: 'Sao khởi đầu ở nhân thực cần nhiều yếu tố vậy?',
        a: [
          'Ý trong ghi chú: protein phức hợp ở nhân thực có nhiều tiểu đơn vị hơn, nhiều gene và khâu hơn, nên cần nhiều yếu tố để kiểm soát cho chính xác.',
          'Nên viết thêm 3 lý do chuẩn: (1) DNA quấn quanh <b>nucleosome</b> nên promoter bị che, cần tháo ra; (2) Pol II <b>không có σ</b>, nên cần TBP/TFII để tìm promoter; (3) sinh vật đa bào có cùng một hệ gene mà mỗi loại tế bào bật gene khác nhau, nên cần <b>tổ hợp</b> nhiều yếu tố phiên mã và enhancer.',
        ],
        base: 'Nhiều yếu tố hơn đồng nghĩa với nhiều điểm điều hòa hơn.',
        link: [['txeuk', 12], ['epieuk', 14]],
      },
      {
        en: 'How does transcription terminate?',
        vi: 'Phiên mã kết thúc thế nào?',
        a: [
          'Nhân sơ, <b>ρ-độc lập</b>: RNA có đoạn giàu GC tự gập thành <b>kẹp tóc</b>, theo sau là <b>dãy U</b>. Liên kết U–A yếu nên RNA tuột khỏi khuôn.',
          'Nhân sơ, <b>ρ-phụ thuộc</b>: protein <b>Rho</b> (helicase, dùng ATP) bám vào RNA, chạy đuổi theo RNA pol, và tách RNA ra khi pol dừng lại.',
          'Nhân thực (Pol II): khi chép qua tín hiệu <b>AAUAAA</b>, RNA bị cắt cách đó 10–30 nt rồi được gắn đuôi <b>poly-A</b>. Pol II vẫn chạy tiếp một đoạn, rồi exonuclease (Xrn2) "đuổi" theo phân hủy phần RNA thừa và đẩy Pol II ra.',
        ],
        base: 'Bẫy: Pol II <b>không</b> dừng ngay tại AAUAAA; nó dừng sau khi RNA đã bị cắt.',
        link: [['txprok', 10], ['txeuk', 12]],
      },
    ],
  },
  {
    ch: 'Chương 4 · Ngoại di truyền (Epigenetics)',
    base: `<ul><li><b>Epigenetic</b> là thay đổi biểu hiện gene <b>mà không đổi trình tự DNA</b>, và được di truyền qua các lần phân bào.</li>
      <li>DNA (tích điện âm) quấn quanh 8 histone thành <b>nucleosome</b>. Đuôi histone giàu <b>lysine</b> (tích điện dương) nên hút DNA.</li></ul>`,
    link: [['epieuk', 14], ['epiprok', 15]],
    qs: [
      {
        en: 'How does histone modification affect gene expression?',
        vi: 'Biến đổi histone ảnh hưởng biểu hiện gene thế nào?',
        a: [
          '<b>Acetyl hóa</b> (HAT gắn nhóm acetyl vào lysine) làm mất điện tích dương, nên histone bám DNA lỏng ra. Chromatin mở thì yếu tố phiên mã và RNA pol vào được: gene <b>BẬT</b>. HDAC gỡ acetyl thì chromatin chặt lại: gene <b>TẮT</b>.',
          '<b>Methyl hóa histone</b> không đổi điện tích. Tác dụng tùy vị trí: <b>H3K4me3</b> đánh dấu promoter đang hoạt động; <b>H3K9me3/H3K27me3</b> làm chromatin nén thành dị nhiễm sắc, gene bị khóa.',
          'Các "dấu" này được protein đọc dấu nhận ra (bromodomain đọc acetyl, chromodomain đọc methyl). Đây là "mã histone".',
        ],
        base: 'Thêm 2 tầng nữa: <b>methyl hóa DNA ở CpG</b> (DNMT) làm tắt promoter, và RNA không mã hóa (Xist, lncRNA).',
        link: [['epieuk', 14]],
      },
    ],
  },
  {
    ch: 'Chương 5 · Dịch mã',
    base: `Cô giảng nhanh, không có câu hỏi riêng. Nắm chắc mấy ý sau:
      <ul><li>Mỗi <b>codon</b> gồm 3 nucleotide. Có 64 codon: 61 mã hóa amino acid, 3 codon dừng (<b>UAA, UAG, UGA</b>). <b>AUG</b> là codon mở đầu (Met; fMet ở vi khuẩn). Mã có tính <b>thoái hóa</b>, và có hiện tượng <b>wobble</b> ở base thứ 3.</li>
      <li><b>Aminoacyl-tRNA synthetase</b> gắn đúng amino acid vào đúng tRNA. Đây là "người phiên dịch" thật sự.</li>
      <li>Ribosome có 3 vị trí <b>A</b> (tRNA mới vào), <b>P</b> (giữ chuỗi peptide), <b>E</b> (tRNA ra). Liên kết peptide do <b>rRNA</b> xúc tác (ribozyme).</li>
      <li>Khởi đầu ở nhân sơ: trình tự <b>Shine–Dalgarno</b> bắt cặp với 16S rRNA. Ở nhân thực: ribosome bám <b>mũ 5′</b> rồi <b>quét</b> tới AUG đầu tiên (Kozak).</li>
      <li>Kéo dài: <b>EF-Tu / eEF1A</b> đưa aa-tRNA vào vị trí A; <b>EF-G / eEF2</b> đẩy ribosome dịch chuyển. Gặp codon dừng thì <b>yếu tố giải phóng</b> (release factor) bám vào và chuỗi được thả ra.</li></ul>`,
    link: [['translation', 16], ['dogma', 1]],
    qs: [],
  },
  {
    ch: 'Chương 6 · Tổng hợp & xử lý protein',
    base: `<ul><li>Protein được "gửi" tới đúng chỗ nhờ <b>tín hiệu định hướng</b> (một đoạn amino acid làm "địa chỉ") và <b>thụ thể</b> đặc hiệu ở nơi đến.</li>
      <li>Trong ER: <b>PDI</b> tạo và sắp xếp lại cầu S–S, <b>BiP/calnexin</b> giúp gấp nếp. Protein gấp sai bị đưa ra ngoài phân hủy (ubiquitin–proteasome).</li></ul>`,
    link: [['ptm', 17], ['mito', 18]],
    qs: [
      {
        en: 'Large-scale microbial production: keep the protein inside the cell or secrete it? How to get it?',
        vi: 'Sản xuất quy mô lớn: giữ protein trong tế bào hay tiết ra?',
        a: [
          'Nên <b>tiết ra môi trường nuôi</b>. Khi đó không cần phá tế bào, dịch nuôi ít protein lạ nên <b>tinh sạch dễ</b>. Tế bào vẫn sống nên sản xuất được liên tục, và protein dễ gấp đúng hơn.',
          'Giữ trong tế bào thì phải phá tế bào, lẫn rất nhiều protein và đại phân tử khác. Ở E. coli, protein còn hay vón thành thể vùi.',
          '<b>Cách làm</b>: gắn <b>peptide tín hiệu tiết</b> vào đầu N của protein cần lấy. Tế bào tự đưa nó ra ngoài, peptidase cắt bỏ tín hiệu, rồi ta thu dịch nuôi và tinh sạch.',
        ],
        fix: '"Gắn trên bề mặt tế bào" (surface display) khác "tiết ra môi trường". Muốn thu hoạch quy mô lớn thì chọn tiết ra môi trường.',
        base: 'Peptide tín hiệu là "địa chỉ" ở đầu N. Sau khi protein tới nơi, nó thường bị cắt bỏ.',
        link: [['ptm', 17]],
      },
      {
        en: 'How does PDI know a disulfide bond is in the wrong position?',
        vi: 'PDI biết cầu S–S sai bằng cách nào?',
        a: [
          '<b>PDI không "biết"</b> đâu là đúng. Nó chỉ <b>trao đổi thiol–disulfide</b>: tấn công cầu S–S nào nó với tới được, cắt ra rồi nối lại kiểu khác.',
          'Cầu S–S <b>sai</b> làm protein ở dạng <b>kém bền, lỏng lẻo, lộ ra ngoài</b>, nên PDI dễ tiếp cận và tiếp tục sắp xếp lại.',
          'Khi cầu S–S <b>đúng</b> được tạo, protein gấp gọn và <b>bền nhất</b>. Các cầu S–S bị giấu vào trong, PDI không với tới được nữa nên dừng lại. Tức là chính độ bền nhiệt động "chọn" ra đáp án đúng.',
        ],
        fix: 'Ghi chú gốc viết "DNA" là <b>nhầm</b>. Đúng là <b>protein</b>: cầu S–S nối 2 cysteine trong protein, DNA không có.',
        base: 'Cầu S–S hình thành trong lòng ER (môi trường oxy hóa), hầu như không hình thành trong bào tương (môi trường khử).',
        link: [['ptm', 17]],
      },
      {
        en: 'How does a signal sequence send a protein to the right location?',
        vi: 'Tín hiệu đưa protein tới đúng chỗ thế nào?',
        a: [
          'Nhờ <b>tương tác đặc hiệu giữa tín hiệu và thụ thể</b> (hoặc kênh) ở nơi đến. Mỗi địa chỉ có cặp tín hiệu–thụ thể riêng.',
          'Ví dụ <b>ty thể</b>: trình tự định hướng ở đầu N được <b>Tom20/22</b> ở màng ngoài nhận ra, rồi chuỗi đi qua <b>Tom40</b> và <b>Tim23</b> (cần điện thế màng Δψ). <b>mtHsp70</b> kéo chuỗi vào chất nền (dùng ATP), <b>MPP</b> cắt bỏ tín hiệu, rồi protein gấp nếp và hoạt động.',
          'Ví dụ <b>ER</b>: <b>SRP</b> bám peptide tín hiệu ngay khi chuỗi đang được dịch mã, đưa cả ribosome tới kênh Sec61.',
        ],
        fix: 'Không phải tín hiệu nào cũng bị cắt. NLS (vào nhân) và KDEL (giữ lại ER) <b>được giữ lại</b>.',
        base: 'Việc cắt tín hiệu sau khi tới nơi giúp protein chỉ hoạt động ở đúng vị trí của nó.',
        link: [['mito', 18], ['ptm', 17]],
      },
    ],
  },
];

const links = (arr) => arr.map(([id, n]) => L(id, n)).join(' · ');

export function renderNotes(main) {
  main.innerHTML = `<div class="lesson-head"><h1>🎯 Câu cô hỏi trên lớp</h1>
    <p class="sub">Các câu cô đã giảng kỹ (Chương 1–6). Mỗi câu gồm: trả lời ngắn, <b>nền tảng</b> cần nhớ, và link sang bài 3D liên quan. Tự trả lời trong đầu trước, rồi mới bấm mở đáp án.</p></div>
  <div class="box info">📌 Dòng <b>⚠️ Chính xác hơn</b> đánh dấu chỗ ghi chú gốc bị nhầm hoặc thiếu. Đi thi viết theo bản đã sửa, nhưng vẫn giữ ý cô.</div>
  <div class="tabs"><button id="openAll">📖 Mở hết</button><button id="closeAll">🙈 Đóng hết</button></div>
  ${NOTES.map(c => { let k = 0; return `<div class="sec found note-ch"><h2>${c.ch}</h2>
    <div class="box good"><div class="note-h">🧱 Nền tảng chương</div>${c.base}<div class="note-link">🔗 Xem 3D: ${links(c.link)}</div></div>
    ${c.qs.map(q => `<details class="qa"><summary><span><b>${q.n ? (k = parseInt(q.n.split('–')[1]), q.n) : ++k}.</b> ${q.en}<br><i class="note-vi">${q.vi}</i></span></summary><div class="ans">
      <ul>${q.a.map(x => `<li>${x}</li>`).join('')}</ul>
      ${q.fix ? `<div class="box warn">⚠️ <b>Chính xác hơn:</b> ${q.fix}</div>` : ''}
      <p class="note-base">🧱 <b>Nền tảng:</b> ${q.base}</p>
      <div class="note-link">🔗 Xem 3D: ${links(q.link)}</div></div></details>`).join('')}
  </div>`; }).join('')}
  <div class="navline"><a class="btn" href="#/traps">⚠️ Ôn bẫy</a><a class="btn primary" href="#/exams">📝 Làm đề →</a></div>`;
  const all = (on) => main.querySelectorAll('details.qa').forEach(d => d.open = on);
  main.querySelector('#openAll').onclick = () => all(true);
  main.querySelector('#closeAll').onclick = () => all(false);
}
