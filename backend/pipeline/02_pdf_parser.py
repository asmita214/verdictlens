import pdfplumber
import json
from pathlib import Path


def extract_text_from_pdf(pdf_path: str) -> dict:
    """
    Opens a PDF and extracts text from every page.
    If a page has no text (scanned image), uses OCR to read it.
    Returns a dict with filename and full text.
    """
    text_pages = []
    ocr_used = False

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):

            page_text = page.extract_text()

            if page_text and len(page_text.strip()) > 50:
                text_pages.append(page_text.strip())

            else:
                try:
                    import pytesseract
                    from PIL import Image
                    page_image = page.to_image(resolution=300)
                    pil_image = page_image.original
                    ocr_text = pytesseract.image_to_string(
                        pil_image,
                        lang="eng"
                    )
                    if ocr_text.strip():
                        text_pages.append(ocr_text.strip())
                        ocr_used = True
                except Exception:
                    pass

    full_text = "\n\n".join(text_pages)

    return {
        "filename": Path(pdf_path).name,
        "source": "ecourts",
        "total_pages": len(text_pages),
        "ocr_used": ocr_used,
        "full_text": full_text,
        "char_count": len(full_text)
    }


def parse_all_pdfs(input_folder: str, output_folder: str):
    """
    Goes through every PDF in input_folder.
    Extracts text from each one.
    Saves result as JSON in output_folder.
    """
    input_path = Path(input_folder)
    output_path = Path(output_folder)
    output_path.mkdir(exist_ok=True)

    pdf_files = list(input_path.glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files to parse")

    success = 0
    failed = 0

    for i, pdf_file in enumerate(pdf_files):
        print(f"[{i+1}/{len(pdf_files)}] Parsing: {pdf_file.name}")

        try:
            result = extract_text_from_pdf(str(pdf_file))

            if result["char_count"] < 200:
                print(f"  Skipped — too little text extracted")
                failed += 1
                continue

            output_file = output_path / (pdf_file.stem + ".json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

            print(f"  Done — {result['char_count']} chars, OCR: {result['ocr_used']}")
            success += 1

        except Exception as e:
            print(f"  Failed — {e}")
            failed += 1
            continue

    print(f"\nCompleted. Success: {success}, Failed: {failed}")


if __name__ == "__main__":
    parse_all_pdfs(
        input_folder="data/raw_pdfs",
        output_folder="data/parsed"
    )