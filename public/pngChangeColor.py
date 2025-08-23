from PIL import Image

# Load image
img = Image.open("logo.png").convert("RGBA")

# Desired RGB color
new_rgb = (122, 82, 85)  # red, for example
new_rgb = (169, 180, 148)  # red, for example

# Change all non-transparent pixels
pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a != 0:  # if not transparent
            pixels[x, y] = (*new_rgb, a)  # keep the original alpha

# Save result
img.save("logo.png")