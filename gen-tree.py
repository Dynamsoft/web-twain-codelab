import os
from bs4 import BeautifulSoup
from collections import defaultdict

def find_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') or file.endswith('.htm'):
                html_files.append(os.path.join(root, file))
    return html_files

def extract_title(html_path):
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            title = soup.title.string if soup.title else "Untitled"
            return title.strip()
    except Exception as e:
        print(f"Failed to process {html_path}: {e}")
        return ""

def organize_by_directory(html_files, base_dir):
    dir_structure = defaultdict(list)
    for html_file in html_files:
        rel_path = os.path.relpath(html_file, base_dir)
        dir_part, file_name = os.path.split(rel_path)
        if dir_part == ".":
            dir_part = ""
        
        dir_structure[dir_part].append((file_name, html_file))
    
    return dir_structure

def generate_markdown_report(dir_structure, output_file, base_dir):
    with open(output_file, 'w', encoding='utf-8') as md:
        md.write("# Tree\n\n")
        
        if "" in dir_structure:
            md.write("## Root\n\n")
            for file_name, html_file in dir_structure[""]:
                title = extract_title(html_file)
                md.write(f"- [{title}]({file_name})\n")
            md.write("\n")
            del dir_structure[""]
        
        sorted_dirs = sorted(dir_structure.keys())
        
        for dir_path in sorted_dirs:
            dir_parts = dir_path.split(os.sep)
            heading_level = min(2 + len(dir_parts) - 1, 6)
            heading = "#" * heading_level + " " + "/".join(dir_parts)
            
            md.write(f"{heading}\n\n")
            
            for file_name, html_file in dir_structure[dir_path]:
                title = extract_title(html_file)
                md.write(f"- [{title}]({dir_path}/{file_name})\n")
            
            md.write("\n")

if __name__ == "__main__":
    search_directory = input("Input the path: ").strip()
    output_markdown = "html_report.md"
    
    if not os.path.isdir(search_directory):
        print(f"Error: '{search_directory}' does not exist.")
        exit(1)
    
    html_files = find_html_files(search_directory)
    
    if not html_files:
        print("No HTML files")
        exit(0)
    
    dir_structure = organize_by_directory(html_files, search_directory)
    generate_markdown_report(dir_structure, output_markdown, search_directory)
    print(f"Output to: {os.path.abspath(output_markdown)}")
    
    