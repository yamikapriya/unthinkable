# Social Media Content Analyzer

## Overview

Social Media Content Analyzer is a React-based web application that
extracts text from PDF and image files and analyzes the content to provide
engagement improvement suggestions.

## Features

- Upload PDF files
- Upload PNG and JPG images
- Extract text from PDFs
- Extract text from images using OCR
- Display extracted content
- Calculate an engagement score
- Identify content strengths
- Provide improvement suggestions
- Show OCR progress
- Validate uploaded file types
- Handle extraction errors

## Technologies Used

- React
- JavaScript
- Vite
- PDF.js
- Tesseract.js
- HTML
- CSS

## How It Works

1. The user uploads a PDF or image.
2. PDF files are processed using PDF.js.
3. Image files are processed using Tesseract.js OCR.
4. The extracted text is displayed.
5. The application analyzes the content.
6. An engagement score is calculated.
7. Strengths and improvement suggestions are displayed.

## Installation

Clone the repository and open the project folder.

Install dependencies:

```bash
npm install
