export default function formattedValue(value, thousandSeparator = '.', decimalSeparator = ',') {
    return Number(value).toString().replace('.', decimalSeparator).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandSeparator}`) // 1000 -> 1.000
}
