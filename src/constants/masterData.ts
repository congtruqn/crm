export const evaluates = [
    {
      value: 1,
      label: 'Tiềm năng',
    },
    {
      value: 2,
      label: 'Đang sử dụng',
    },
    {
      value: 3,
      label: 'Chưa triển khai',
    },
    {
      value: 4,
      label: 'Ngừng triển khai',
    },
];
export const getEvaluate = function(value: number){
    switch (value) {
        case 1:
            return 'Tiềm năng';
        case 2:
            return 'Đang sử dụng';
        case 3:
            return 'Chưa triển khai';
        case 4:
            return 'Ngừng triển khai';
        default:
            break;
    }

}
export const customerStatus = [
    {
      value: 1,
      label: 'Đã điện thoại',
    },
    {
      value: 2,
      label: 'Đã báo giá',
    },
    {
      value: 3,
      label: 'Đã mua',
    },
    {
      value: 4,
      label: 'Đã đến xem xe',
    },
    {
        value: 5,
        label: 'Đã mua chổ khác',
    },
]