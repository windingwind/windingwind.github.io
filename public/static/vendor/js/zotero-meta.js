/**
 * Create citation meta tags for Zotero connector
 * @param {Record<string, string>[]} citations
 * To get all meta data from an existing website (e.g. ArXiv), call:
 * ```js
 * Array.from(document.querySelectorAll("meta")).filter(e=>e.name.startsWith('citation'))
 *     .map(e=>({name: e.name, content: e.content}));
 * ```
 * on that website and copy it.
 * Paste the result into the `citations` variable which is passed to this function.
 * @see https://www.zotero.org/support/dev/exposing_metadata
 */
function createCitationMeta(citations) {
  for (const citation of citations) {
    document.head.appendChild(
      Object.assign(document.createElement("meta"), citation)
    );
  }
  document.dispatchEvent(
    new Event("ZoteroItemUpdated", {
      bubbles: true,
      cancelable: true,
    })
  );
}
