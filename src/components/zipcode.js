export default function isValidPostalCode(postalCode) {
    let postalCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return postalCodeRegex.test(postalCode);
}