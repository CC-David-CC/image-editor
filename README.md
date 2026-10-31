# Image Editor

Filerobot Image Editor runs locally in its own lazy-loaded app bundle, with its
own React 18 dependencies. It never requests a cloud image or a translation
service. Open a PNG, JPEG or WebP from Files; save writes to the shared account
mirror using the opened version. Browser storage then synchronizes to the file
service. Closing the window disposes the editor and releases its image data. Filerobot's
built-in download is suppressed; the user saves to account files instead.
Choose **Open from My files** to select an image. An image that cannot be opened
leaves the current edits available. Save updates the opened file. **Save As**
chooses a separate PNG, JPEG or WebP path in My files and asks before replacing
an existing file; subsequent saves update the new file. Animated GIF editing is
not supported.

Run `npm ci --prefix apps/system/image-editor --ignore-scripts` before the
public app builder. Generated dependencies and output are not tracked.
