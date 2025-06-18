#!/usr/bin/env bash

rm -f ALL_FILES.md

echo "# Full Codebase Extraction" >> ALL_FILES.md

process_file() {
  local file="$1"
  local filename=$(basename -- "$file")
  local ext="${filename##*.}"

  echo -e "\n## File: ${file}\n" >> ALL_FILES.md
  echo '```'${ext} >> ALL_FILES.md 

  if [[ -f "$file" && -r "$file" ]]; then
    cat "$file" >> ALL_FILES.md
  else
    echo "[ERROR] Unable to read file: $file" >> ALL_FILES.md
  fi

  echo '```' >> ALL_FILES.md 
}

find . -type f \
  ! -path "./.git/*" \
  ! -path "./target/*" \
  ! -path "*/assets/*" \
  ! -path "./figures/*" \
  ! -path "./documents/*" \
  ! -path "./.idea/*" \
  ! -path "./idea/*" \
  ! -name "*.pdf" \
  ! -name "content.sh" \
  ! -name "Cargo.lock" \
  ! -name ".gitignore" \
  ! -name ".DS_Store" \
  ! -name "ALL_FILES.md" \
  -print | while IFS= read -r file; do
  process_file "$file"
done
