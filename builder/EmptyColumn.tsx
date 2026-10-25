/** Editor only: an empty column shows a box with a + that opens Add element. */
export function EmptyColumn() {
  return (
    <button type="button" className="lb-empty" data-lb-add aria-label="Add element">
      +
    </button>
  )
}
