import sys
import subprocess

try:
    import PyPDF2
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

reader = PyPDF2.PdfReader('c:/Users/USER/OneDrive/Desktop/RaahatLink/RahatLink_Hackathon.pdf')
with open('c:/Users/USER/OneDrive/Desktop/RaahatLink/pdf_content.txt', 'w', encoding='utf-8') as f:
    for page in reader.pages:
        f.write(page.extract_text() + '\n')
print("Done")
