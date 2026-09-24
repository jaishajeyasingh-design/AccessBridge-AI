import re

def clean_text(text: str) -> str:
    """
    Cleans extracted raw text by:
    - Normalizing line endings (\r\n -> \n)
    - Trimming line whitespace
    - Compressing 3+ consecutive newlines into 2 newlines (preserving paragraph structure)
    - Stripping leading and trailing whitespace
    Does not alter document content or word meanings.
    """
    if not text:
        return ""

    # Normalize line endings
    normalized = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Strip whitespace from individual lines
    lines = [line.strip() for line in normalized.split('\n')]
    cleaned_lines_str = '\n'.join(lines)

    # Collapse 3 or more consecutive newlines to 2 newlines
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned_lines_str)

    return cleaned.strip()
