const SPREADSHEET_ID = '1Qui6AL8gnfS9WWFDGr2LFpOvpUwBCsr4e8j0Z-xiETc';
const IMAGE_FOLDER_NAME = 'KetQuaThi_Images';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Thu Thập Kết Quả Thi PCVT')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getStaffData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0]; 
  const data = sheet.getDataRange().getDisplayValues();
  const staffList = [];

  if (data.length <= 1) return [];

  let headerRowIdx = -1;
  // Tìm dòng tiêu đề chính xác hơn
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const rowStr = data[i].map(c => c.toString().toLowerCase().replace(/\s+/g, '')).join('');
    if (rowStr.includes('họvàtên') || rowStr.includes('sốhiệu') || rowStr.includes('msnv')) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) headerRowIdx = 0;

  const cleanHeaders = data[headerRowIdx].map(h => h.toString().toLowerCase().replace(/\s+/g, ''));
  
  // Ưu tiên tìm chính xác hơn để tránh trùng lặp nếu tiêu đề gộp
  let msnvIdx = cleanHeaders.findIndex(h => h === 'msnv' || h === 'sốhiệu' || h.includes('mãnhânviên'));
  let nameIdx = cleanHeaders.findIndex(h => h === 'họvàtên' || (h.includes('họ') && h.includes('tên')));
  let deptIdx = cleanHeaders.findIndex(h => h.includes('phòngban') || h.includes('đơnvị') || h.includes('bộphận') || h === 'tênphòng');

  // Fallback chuẩn hóa theo thứ tự phổ biến: B:MSNV (1), C:Họ Tên (2), D:Phòng Ban (3)
  if (msnvIdx === -1) msnvIdx = 1; 
  if (nameIdx === -1) nameIdx = 2; 
  if (deptIdx === -1) deptIdx = 3; 

  // Duyệt dữ liệu, bỏ qua dòng tiêu đề và các dòng trống
  for (let i = headerRowIdx + 1; i < data.length; i++) {
    const row = data[i];
    const msnv = row[msnvIdx] ? row[msnvIdx].toString().trim() : ''; 
    const name = row[nameIdx] ? row[nameIdx].toString().trim() : '';
    const department = row[deptIdx] ? row[deptIdx].toString().trim() : 'Khác';

    // Đảm bảo không lấy nhầm dòng tiêu đề hoặc dòng trống
    if (msnv && name && name.toLowerCase().replace(/\s+/g, '') !== 'họvàtên') {
      staffList.push({ id: msnv, name: name, department: department });
    }
  }
  return staffList;
}

function uploadResult(payload) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('KetQua');
    
    if (!sheet) {
      sheet = ss.insertSheet('KetQua');
      sheet.appendRow(['Timestamp', 'MSNV', 'Họ và tên', 'Phòng ban', 'Vòng thi', 'Ngày thi', 'Link ảnh Drive']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f3f3f3');
    }

    let fileUrl = '';
    if (payload.imageBase64) {
      fileUrl = saveImage(payload.imageBase64, payload.msnv, payload.round, payload.department, payload.name);
    }

    sheet.appendRow([
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
      payload.msnv,
      payload.name,
      payload.department || 'Dữ liệu cũ',
      payload.round,
      payload.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy"),
      fileUrl
    ]);

    return { success: true, message: 'Nộp kết quả thành công!' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi lưu dữ liệu: ' + error.toString() };
  }
}

function saveImage(base64Data, msnv, round, department, name) {
  const splitBase = base64Data.split(',');
  const type = splitBase[0].split(';')[0].replace('data:', '');
  const byteCharacters = Utilities.base64Decode(splitBase[1]);
  const blob = Utilities.newBlob(byteCharacters, type, msnv + '_' + round + '_' + new Date().getTime());

  // 1. Thư mục gốc
  let rootFolders = DriveApp.getFoldersByName(IMAGE_FOLDER_NAME);
  let rootFolder;
  if (rootFolders.hasNext()) {
    rootFolder = rootFolders.next();
  } else {
    rootFolder = DriveApp.createFolder(IMAGE_FOLDER_NAME);
  }

  // 2. Thư mục Phòng ban
  let deptName = department ? department : 'Khác';
  let deptFolders = rootFolder.getFoldersByName(deptName);
  let deptFolder;
  if (deptFolders.hasNext()) {
    deptFolder = deptFolders.next();
  } else {
    deptFolder = rootFolder.createFolder(deptName);
  }

  // 3. Thư mục Cá nhân (MSNV - Họ Tên)
  let empFolderName = msnv + ' - ' + name;
  let empFolders = deptFolder.getFoldersByName(empFolderName);
  let empFolder;
  if (empFolders.hasNext()) {
    empFolder = empFolders.next();
  } else {
    empFolder = deptFolder.createFolder(empFolderName);
  }

  const file = empFolder.createFile(blob);
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
    const row = data[i];
    // Đảm bảo lấy đúng cột theo thứ tự mới: Timestamp(0), MSNV(1), Họ và tên(2), Phòng ban(3), Vòng thi(4), Ngày thi(5), Link(6)
    history.push({
      timestamp: row[0],
      msnv: row[1],
      name: row[2],
      // Nếu dòng cũ chỉ có 6 cột, thì các cột sau sẽ bị lệch. 
      // Kiểm tra sơ bộ: Nếu cột 6 trống nhưng cột 5 có ký tự thì có thể là mẫu cũ
      department: row.length > 6 ? (row[3] || '') : 'Dữ liệu cũ',
      round: row.length > 6 ? row[4] : row[3],
      date: row.length > 6 ? row[5] : row[4],
      link: row.length > 6 ? row[6] : row[5]
    });
  }
  // Đảo ngược danh sách để hiển thị lượt nộp mới nhất lên đầu
  return history.reverse();
}
