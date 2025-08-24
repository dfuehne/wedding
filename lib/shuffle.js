/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
export function fisherYatesShuffle(array) {
    let currentIndex = array.length - 1;
    let randomIndex;

    for (let i = currentIndex; i > 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1));
        // swap elements at i and randomIndex
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

