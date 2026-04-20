import os
import argparse
from PIL import Image, ImageFilter, ImageEnhance
import tkinter as tk
from tkinter import filedialog

def generate_test_data(input_path: str, output_dir: str):
    """
    Generates simulated 'in-the-wild' variants of a given official sports image.
    These simulations include standard social media degradations like cropping,
    blurring, recoloring, and heavy JPEG compression.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        original = Image.open(input_path).convert('RGB')
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        
        print(f"Processing '{base_name}'...")

        # 1. Mild Crop (Simulating someone screenshotting loosely or zooming in on a player)
        width, height = original.size
        left = width * 0.1
        top = height * 0.1
        right = width * 0.9
        bottom = height * 0.9
        cropped = original.crop((left, top, right, bottom))
        cropped.save(os.path.join(output_dir, f"{base_name}_cropped.jpg"))
        print(" -> Created: Cropped variant")
        
        # 2. Heavy Blur (Simulating low-res video screen capture or bad network connection)
        blurred = original.filter(ImageFilter.GaussianBlur(radius=3))
        blurred.save(os.path.join(output_dir, f"{base_name}_blurred.jpg"))
        print(" -> Created: Blurred variant")
        
        # 3. Brightness/Contrast Change (Simulating TikTok / IG Filters)
        enhancer = ImageEnhance.Contrast(original)
        high_contrast = enhancer.enhance(1.5)
        brightener = ImageEnhance.Brightness(high_contrast)
        filtered = brightener.enhance(1.2)
        filtered.save(os.path.join(output_dir, f"{base_name}_filtered.jpg"))
        print(" -> Created: Filtered variant")

        # 4. Severe Quality Loss (Social Media JPEG compression artifacts)
        original.save(os.path.join(output_dir, f"{base_name}_compressed.jpg"), "JPEG", quality=15)
        print(" -> Created: Low Quality Compressed variant")
        
        # 5. Combined Attack (Piracy sim: cropped + compressed + heavily saturated)
        piracy = original.crop((width * 0.15, height * 0.15, width * 0.85, height * 0.85))
        color_enhancer = ImageEnhance.Color(piracy)
        piracy = color_enhancer.enhance(2.5) # Heavy saturation
        piracy.save(os.path.join(output_dir, f"{base_name}_piracy_sim.jpg"), "JPEG", quality=25)
        print(" -> Created: Piracy Simulation variant")

        print(f"\n✅ Successfully generated 5 test permutations in directory: ./{output_dir}/")

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VectorGuard Test Data Generator")
    parser.add_argument("input_path", nargs="?", default=None, help="Path to the original image OR a directory (leave empty to open file picker)")
    parser.add_argument("--output_dir", default="test_artifacts", help="Output directory for generated variants")
    
    args = parser.parse_args()
    
    input_path = args.input_path
    
    if not input_path:
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)  # Make the file picker appear on top of other windows!
        print("Opening file dialog... Please select an image from any folder on your computer.")
        input_path = filedialog.askopenfilename(
            title="Select an image to generate artifacts",
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.webp"), ("All files", "*.*")]
        )
        if not input_path:
            print("Operation cancelled. No file selected.")
            exit(0)
    
    if os.path.isfile(input_path):
        generate_test_data(input_path, args.output_dir)
    elif os.path.isdir(input_path):
        valid_exts = {'.jpg', '.jpeg', '.png', '.webp'}
        count = 0
        for fname in os.listdir(input_path):
            if os.path.splitext(fname)[1].lower() in valid_exts:
                generate_test_data(os.path.join(input_path, fname), args.output_dir)
                count += 1
        if count == 0:
            print("No valid images found in the specified directory.")
    else:
        print("Invalid input path. Please provide a valid image or directory.")
