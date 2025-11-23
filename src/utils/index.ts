/* eslint-disable no-useless-escape */
export const removeUnicode =  function (str: string) {
    if (!str) {
      return '';
    }
    str = str.trim().toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\-|\'| |\"|\&|\#|\[|\]|~|$|_/g, '');
    str = str.replace(/-+-/g, ''); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, '');
    return str;
}; 

export const convertUnknownToStringArray = function(value: unknown): string[] | [] {
  if (Array.isArray(value)) {
      const stringArray: string[] = [];
      for (const item of value) {
          if (typeof item === 'string') {
              stringArray.push(item);
          } else {
              // Handle cases where an element is not a string, e.g., skip or throw an error
              console.warn(`Non-string element found in array: ${item}`);
              return []; // Or throw new Error('Array contains non-string elements');
          }
      }
      return stringArray;
  }
  return []; // Or throw new Error('Value is not an array');
}