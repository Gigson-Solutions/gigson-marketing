/**
 * Renders a JSON-LD block. Replaces the `<script type="application/ld+json"
 * dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />` that was written
 * out by hand in 21 page files.
 *
 * `data` is always built in our own code (never user input), so stringifying it
 * straight into the tag is safe — but `<` is still escaped so a stray sequence
 * in translated copy can't close the script element early.
 */
const JsonLd = ({ data }: { data: unknown }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
