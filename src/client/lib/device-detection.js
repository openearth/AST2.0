'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
/**
 * Whether the current device is a mobile device
 * @returns {boolean}
 */
function isMobile() {
    return (
        isMobile.cached ||
        (isMobile.cached = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
            navigator.userAgent
        ))
    );
}

/**
 * Whether the current device is a touch device
 * @returns {boolean}
 */
function isTouch() {
    return (
        isTouch.cached ||
        (isTouch.cached =
            'ontouchstart' in window ||
            (window.DocumentTouch && document instanceof window.DocumentTouch))
    );
}

/**
 * Whether the current device is a iOS
 * @returns {boolean}
 */
function isIOS() {
    return isIOS.cached || (isIOS.cached = /iPhone|iPad|iPod/i.test(navigator.userAgent));
}

/**
 * Checks if the browser is on iOS and version 10 or higher
 * @type {boolean}
 */
function isIOS10() {
    return Math.floor(getIOSVersion()) === '10';
}

/**
 * The iOS version or null if not running iOS
 * @returns {number|null}
 */
function getIOSVersion() {
    if (getIOSVersion.cached) return getIOSVersion.cached;

    var result = null;

    if (isIOS()) {
        var match = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        var version = void 0;

        if (match !== undefined && match !== null) {
            version = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3] || 0, 10)];
            result = parseFloat(version.join('.'));
        }
    }

    return (getIOSVersion.cached = result);
}

/**
 * The Visitor's user agent
 * @returns {string}
 */
function getUserAgent() {
    if (getUserAgent.cached) return getUserAgent.cached;

    var result = void 0;

    var userAgent = navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i
    );

    if (navigator.userAgent.match(/crios/i)) {
        result = 'Chrome';
    } else if (navigator.userAgent.match(/OPR/i)) {
        result = 'Opera';
    } else if (navigator.userAgent.match(/Edge/i)) {
        result = 'Edge';
    } else if (navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
        result = 'IE11';
    } else {
        result = userAgent !== null ? userAgent[1] : 'unknown';
    }

    return (getUserAgent.cached = result);
}

/**
 * Returns version of IE/Edge or null, if browser is not Internet Explorer
 * @see https://codepen.io/gapcode/pen/vEJNZN
 * @returns {number|null}
 */
function getIEOrEdgeVersion() {
    if (getIEOrEdgeVersion.cached) return getIEOrEdgeVersion.cached;

    var ua = navigator.userAgent;

    var result = null;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        result = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        result = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        result = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    return (getIEOrEdgeVersion.cached = result);
}

/**
 * Adds classes to the body element based on visitors device and user agent.
 * @param {Node} DOMNode - The DOM node to add the classes to
 * @returns {void}
 */
function addDeviceClasses(DOMNode) {
    var array =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : ['mobile', 'touch', 'userAgent'];

    if (array.indexOf('mobile') > -1) {
        DOMNode.classList.add(isMobile() ? 'device-mobile' : 'device-desktop');
        isIOS() && DOMNode.classList.add('device-iOS', 'device-iOS' + Math.floor(getIOSVersion()));
    }
    if (array.indexOf('touch') > -1) {
        isTouch() && DOMNode.classList.add('device-touch');
    }
    if (array.indexOf('userAgent') > -1) {
        DOMNode.classList.add('device-' + getUserAgent());
    }
}

exports.isMobile = isMobile;
exports.isTouch = isTouch;
exports.isIOS = isIOS;
exports.isIOS10 = isIOS10;
exports.getIOSVersion = getIOSVersion;
exports.getUserAgent = getUserAgent;
exports.addDeviceClasses = addDeviceClasses;
exports.getIEOrEdgeVersion = getIEOrEdgeVersion;
