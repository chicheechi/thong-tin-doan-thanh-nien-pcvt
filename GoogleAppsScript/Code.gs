const SPREADSHEET_ID = '1Qui6AL8gnfS9WWFDGr2LFpOvpUwBCsr4e8j0Z-xiETc';
const IMAGE_FOLDER_NAME = 'KetQuaThi_Images';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Thu Thập Kết Quả Thi PCVT')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getStaffData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0]; // Lọc danh sách ở Sheet đầu tiên
  const data = sheet.getDataRange().getDisplayValues();
  const staffList = [];

  if (data.length <= 1) return [];

  let headerRowIdx = 0;
  // Quét 5 dòng đầu tiên để tự động tìm dòng tiêu đề và làm sạch khoảng trắng/xuống dòng
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const rowStr = data[i].map(c => c.toString().toLowerCase().replace(/\s+/g, '')).join('');
    if (rowStr.includes('phòngban') || rowStr.includes('họvàtên') || rowStr.includes('sốhiệu')) {
      headerRowIdx = i;
      break;
    }
  }

  // Tự động nhận diện cột linh hoạt (loại bỏ mọi dấu cách, enter rỗng để quét khớp 100%)
  const cleanHeaders = data[headerRowIdx].map(h => h.toString().toLowerCase().replace(/\s+/g, ''));
  let deptIdx = cleanHeaders.findIndex(h => h.includes('phòngban') || h.includes('tênphòng') || h.includes('đơnvị'));
  let nameIdx = cleanHeaders.findIndex(h => h.includes('họ') && h.includes('tên'));
  let msnvIdx = cleanHeaders.findIndex(h => h.includes('sốhiệu') || h.includes('msnv') || h.includes('mãnhânviên'));

  // Fallback lại cột mặc định theo bảng nếu bị sai tiêu đề
  if (deptIdx === -1) deptIdx = 1; // Cột B mặc định (Phòng Ban)
  if (nameIdx === -1) nameIdx = 2; // Cột C mặc định (Họ và Tên)
  if (msnvIdx === -1) msnvIdx = 3; // Cột D mặc định (Số hiệu)

  // Duyệt dữ liệu từ dòng kế tiếp của headers
  for (let i = headerRowIdx + 1; i < data.length; i++) {
    let msnvRaw = data[i][msnvIdx] ? data[i][msnvIdx].toString().trim() : ''; 
    let msnv = msnvRaw;
    if (/^\d+$/.test(msnvRaw)) {
        msnv = msnvRaw.padStart(6, '0');
    }
    
    let nameRaw = data[i][nameIdx] ? data[i][nameIdx].toString().trim() : '';
    let name = nameRaw.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    
    let deptRaw = data[i][deptIdx] ? data[i][deptIdx].toString().trim() : 'Khác';
    let department = deptRaw.charAt(0).toUpperCase() + deptRaw.slice(1);

    if (msnv && name) {
      staffList.push({ id: msnv, name: name, department: department });
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
      fileUrl = saveImage(payload.imageBase64, payload.msnv, payload.round, payload.department, payload.name);
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
