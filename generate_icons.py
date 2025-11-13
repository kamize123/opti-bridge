#!/usr/bin/env python3
"""
Generate placeholder icons for Tauri app.
This creates simple PNG icons that can be replaced later with proper designs.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL/Pillow not installed. Creating empty icon files...")
    import os
    os.makedirs("src-tauri/icons", exist_ok=True)
    # Create empty files as placeholders
    sizes = [(32, "32x32.png"), (128, "128x128.png"), (256, "128x128@2x.png"), (512, "icon.png")]
    for size, filename in sizes:
        filepath = f"src-tauri/icons/{filename}"
        open(filepath, 'a').close()
    print(f"Created placeholder icon files. Please replace with actual icons.")
    exit(0)

import os

# Create icons directory
os.makedirs("src-tauri/icons", exist_ok=True)

def create_icon(size, filename):
    """Create a simple icon with gradient background and text"""
    # Create image with gradient
    img = Image.new('RGB', (size, size), color='#18181b')
    draw = ImageDraw.Draw(img)
    
    # Draw simple geometric shape (circle)
    margin = size // 4
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#3b82f6', outline='#60a5fa', width=max(2, size//64))
    
    # Draw text "OB" for OptiBridge
    try:
        font_size = size // 3
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "OB"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - size//20)
    draw.text(position, text, fill='white', font=font)
    
    # Save
    filepath = f"src-tauri/icons/{filename}"
    img.save(filepath, 'PNG')
    print(f"Created {filepath}")

# Generate icons
create_icon(32, "32x32.png")
create_icon(128, "128x128.png")
create_icon(256, "128x128@2x.png")
create_icon(512, "icon.png")

# For .ico (Windows) and .icns (macOS), we'll use the PNG as base
# In production, use proper tools like png2ico or iconutil
print("\nNote: For production, generate proper .ico and .icns files")
print("Windows: Use png2ico or online converter")
print("macOS: Use iconutil or online converter")

