import re

def clean_text(text: str) -> str:
    """Cleans raw text by stripping HTML, URLs, markdown symbols, and duplicate spaces.

    Args:
        text (str): Raw string content.

    Returns:
        str: Sanitized plain text string.
    """
    if not text:
        return ""

    # 1. Remove URLs (http, https, ftp, www)
    text = re.sub(r"https?://\S+|www\.\S+|ftp://\S+", "", text)

    # 2. Remove HTML tags and common HTML entities (e.g. &amp;)
    text = re.sub(r"<[^>]*>", "", text)
    text = re.sub(r"&[a-zA-Z0-9#]+;", " ", text)

    # 3. Clean Markdown syntax
    # Markdown links [text](url) -> keep only 'text'
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Markdown headers, bold, italics, quotes, inline code markers (#, *, _, `, >, -, [, ])
    text = re.sub(r"[\#\*\_`\~\>\-\[\]\(\)]", " ", text)

    # 4. Remove special character symbols, leaving letters, numbers, and basic punctuation
    text = re.sub(r"[^\w\s\.\,\?\!\'\"\-]", " ", text)

    # 5. Clean up duplicate whitespaces and trim trailing characters
    text = re.sub(r"\s+", " ", text)

    return text.strip()
