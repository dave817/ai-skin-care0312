import sanitizeHtml from "sanitize-html";

const BLOG_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "div",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    div: ["class"],
    span: ["class"],
    p: ["class"],
    h1: ["class", "id"],
    h2: ["class", "id"],
    h3: ["class", "id"],
    h4: ["class", "id"],
    blockquote: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

const PRODUCT_DESC_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "h3", "h4", "img"],
  allowedAttributes: {
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["http", "https"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
};

export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, BLOG_OPTIONS);
}

export function sanitizeProductDescription(html: string): string {
  return sanitizeHtml(html, PRODUCT_DESC_OPTIONS);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
