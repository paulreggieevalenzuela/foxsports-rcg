
/**
 * General xpath selector
 * Taken from:
 *       https://dzone.com/articles/some-simple-javascript-xpath
 *
 * @param  {String}     path    Valid xpath definition
 * @param  {Element}    label   Element where to start the search, defaults to document
 * @return {Array}              List of elements found
 */
export function xpath(path, element) {
    let nextElement, results = [];

    const searchElement = document.evaluate(path, element || document, null, 4, null);

    while (nextElement = searchElement.iterateNext()) {
        results.push(nextElement);
    }

    return results;
}

/**
 * Return appropriate xpath string based on type
 *
 * @param  {String} type    Identifier which which general format to use
 * @param  {String} label   Actual label text on the element
 * @return {String}         Xpath selector
 */
export function xpathPrefix(type, label) {
    switch (type) {
        case 'TABLE_ROW':
            return `//div[@class="rcg-booking-details-job__item"]//dt[text()='${label}']/following-sibling::dd[1]`;
        default:
            return null;
    }
}
