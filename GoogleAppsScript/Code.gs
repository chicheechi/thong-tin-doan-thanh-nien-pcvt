const SPREADSHEET_ID = '17MgncO6J1_GTDJHJHBe9Y37E44p4znXDG-XfLFN01Qw';
const IMAGE_FOLDER_NAME = 'KetQuaThi_Images';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Thu Thập Kết Quả Thi PCVT')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getStaffData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  // Giả sử danh sách nhân sự nằm ở sheet đầu tiên
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getDisplayValues();
  const staffList = [];

  // Duyệt từ dòng 2 (bỏ qua dòng tiêu đề)
  for (let i = 1; i < data.length; i++) {
    // Cần điều chỉnh chỉ số cột nếu file gốc khác. Giả định Cột A(0)=STT, Cột B(1)=MSNV, Cột C(2)=Họ Tên
    // (Bác có thể thay số 1 và 2 ở dưới cho chuẩn với sheet thực tế)
    const msnv = data[i][1] ? data[i][1].toString().trim() : ''; 
    const name = data[i][2] ? data[i][2].toString().trim() : '';
    if (msnv && name) {
      staffList.push({ id: msnv, name: name });
    }
  }
  return staffList;
}

function uploadResult(payload) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('KetQua');
    
    // Nếu chưa có sheet KetQua thì tự tạo và thêm dòng tiêu đề
    if (!sheet) {
      sheet = ss.insertSheet('KetQua');
      sheet.appendRow(['Timestamp', 'MSNV', 'Họ và tên', 'Vòng thi', 'Ngày thi', 'Link ảnh Drive']);
    }

    let fileUrl = '';
    if (payload.imageBase64) {
      fileUrl = saveImage(payload.imageBase64, payload.msnv, payload.round);
    }

    sheet.appendRow([
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
      payload.msnv,
      payload.name,
      payload.round,
      payload.date,
      fileUrl
    ]);

    return { success: true, message: 'Nộp kết quả thành công!' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi lưu dữ liệu: ' + error.toString() };
  }
}

function saveImage(base64Data, msnv, round) {
  const splitBase = base64Data.split(',');
  const type = splitBase[0].split(';')[0].replace('data:', '');
  const byteCharacters = Utilities.base64Decode(splitBase[1]);
  const blob = Utilities.newBlob(byteCharacters, type, msnv + '_' + round + '_' + new Date().getTime());

  let folders = DriveApp.getFoldersByName(IMAGE_FOLDER_NAME);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(IMAGE_FOLDER_NAME);
  }

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function getHistory() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('KetQua');
  if (!sheet) return [];

  const data = sheet.getDataRange().getDisplayValues();
  const history = [];

  // Bắt đầu từ 1 để bỏ qua dòng tiêu đề
  for (let i = 1; i < data.length; i++) {
    history.push({
      timestamp: data[i][0],
      msnv: data[i][1],
      name: data[i][2],
      round: data[i][3],
      date: data[i][4],
      link: data[i][5]
    });
  }
  // Đảo ngược danh sách để hiển thị lượt nộp mới nhất lên đầu
  return history.reverse();
}
