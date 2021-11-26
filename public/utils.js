
/**
 * getRandomString devuelve un string de caracteres aleatorios con ~26
 * caracteres de longitud.
 * 
 * Usa un generador de números aleatorios criptográficamente seguro.
 * 
 * @return {string} String aleatorio.
 */
export function getRandomString() {
    const a = new Uint32Array(4);
    window.crypto.getRandomValues(a);
    return a.reduce((acc, i) => {
        return acc + i.toString(36)
    }, "");
}

/**
 * getCurrentTime devuelve un UNIX-timestamp del instante actual en
 * milisegundos.
 * 
 * @return {number} Tiempo en milisegundos desde 1970-01-01 00:00:00 UTC.
 */
export function getCurrentTime() {
    return new Date().getTime()
}
